import { createHash } from "node:crypto";

import { buildRoleplayInstructions, getPersona, getScenario } from "@say-it-first/domain";
import type { FastifyBaseLogger } from "fastify";

import { AppError } from "../lib/app-error.js";
import { getRequestContext } from "../observability/request-context.js";
import type {
  RealtimeCallInput,
  RealtimeCallResult,
  RealtimeProvider,
} from "./provider-contracts.js";

type OpenAIRealtimeProviderOptions = {
  apiKey: string;
  model: string;
  voice: string;
  safetyHashSalt: string;
  timeoutMs: number;
  logger: FastifyBaseLogger;
  fetchImplementation?: typeof fetch;
};

export function buildOpenAIRealtimeSession(input: {
  model: string;
  voice: string;
  instructions: string;
}) {
  return {
    type: "realtime" as const,
    model: input.model,
    output_modalities: ["audio"] as const,
    instructions: input.instructions,
    // Audio tokens share this response budget. A small text-style cap can stop
    // audible speech mid-sentence, so let the model use its full response limit
    // and control brevity through the roleplay instructions instead.
    max_output_tokens: "inf" as const,
    audio: {
      input: {
        transcription: { model: "gpt-4o-mini-transcribe", language: "en" },
        turn_detection: {
          type: "server_vad" as const,
          create_response: true,
          // Speakerphone echo and brief acknowledgements must not truncate coaching replies.
          // The mobile client also gates its outbound track while the employee is speaking.
          interrupt_response: false,
          prefix_padding_ms: 300,
          silence_duration_ms: 750,
          threshold: 0.65,
        },
      },
      output: { voice: input.voice },
    },
  };
}

export class OpenAIRealtimeProvider implements RealtimeProvider {
  public readonly configured = true;
  public readonly model: string;
  private readonly fetchImplementation: typeof fetch;

  public constructor(private readonly options: OpenAIRealtimeProviderOptions) {
    this.model = options.model;
    this.fetchImplementation = options.fetchImplementation ?? fetch;
  }

  public async createCall(input: RealtimeCallInput): Promise<RealtimeCallResult> {
    const scenario = getScenario(input.scenarioId);
    const persona = getPersona(input.personaId);
    if (!scenario || !persona) {
      throw new AppError({
        code: "not_found",
        message: "The selected rehearsal is unavailable.",
        statusCode: 404,
      });
    }

    const context = getRequestContext();
    const startedAt = performance.now();
    const safetyIdentifier = createHash("sha256")
      .update(`${this.options.safetyHashSalt}:${input.anonymousUserId}`)
      .digest("hex");

    const session = buildOpenAIRealtimeSession({
      model: this.options.model,
      instructions: buildRoleplayInstructions({
        scenario,
        persona,
        ...(input.customContext ? { customContext: input.customContext } : {}),
      }),
      voice: this.options.voice,
    });

    const form = new FormData();
    form.set("sdp", input.sdp);
    form.set("session", JSON.stringify(session));

    this.options.logger.info(
      {
        event: "ai.realtime.session.requested",
        requestId: context.requestId,
        traceId: context.traceId,
        model: this.options.model,
        scenarioId: scenario.id,
        scenarioVersion: scenario.version,
        personaId: persona.id,
        maxOutputTokens: session.max_output_tokens,
      },
      "requesting realtime session",
    );

    let response: Response;
    try {
      response = await this.fetchImplementation("https://api.openai.com/v1/realtime/calls", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.options.apiKey}`,
          "OpenAI-Safety-Identifier": safetyIdentifier,
          "X-Client-Request-Id": context.requestId,
          traceparent: `00-${context.traceId}-${context.spanId}-${context.traceFlags}`,
        },
        body: form,
        signal: AbortSignal.timeout(this.options.timeoutMs),
      });
    } catch (error) {
      const durationMs = Math.round(performance.now() - startedAt);
      this.options.logger.error(
        {
          event: "ai.realtime.session.failed",
          requestId: context.requestId,
          traceId: context.traceId,
          model: this.options.model,
          durationMs,
          err: error,
        },
        "realtime session request failed",
      );
      throw new AppError({
        code: "provider_unavailable",
        message: "The rehearsal could not connect. Your microphone audio was not saved.",
        statusCode: 503,
        retryable: true,
        logContext: { operation: "realtime_session", durationMs },
        cause: error,
      });
    }

    const answerSdp = await response.text();
    const durationMs = Math.round(performance.now() - startedAt);
    const providerRequestId = response.headers.get("x-request-id");

    if (!response.ok) {
      this.options.logger.warn(
        {
          event: "ai.realtime.session.rejected",
          requestId: context.requestId,
          traceId: context.traceId,
          providerRequestId,
          model: this.options.model,
          providerStatus: response.status,
          durationMs,
        },
        "realtime provider rejected session",
      );
      throw new AppError({
        code: "provider_rejected",
        message: "The rehearsal service rejected the connection. Please try again.",
        statusCode: response.status >= 500 ? 503 : 502,
        retryable: response.status === 429 || response.status >= 500,
        logContext: {
          operation: "realtime_session",
          providerStatus: response.status,
          providerRequestId,
          durationMs,
        },
      });
    }

    if (!answerSdp.startsWith("v=0") || answerSdp.length > 100_000) {
      this.options.logger.error(
        {
          event: "ai.realtime.session.invalid_sdp",
          requestId: context.requestId,
          traceId: context.traceId,
          providerRequestId,
          model: this.options.model,
          answerLength: answerSdp.length,
          durationMs,
        },
        "realtime provider returned an invalid SDP answer",
      );
      throw new AppError({
        code: "invalid_provider_output",
        message: "The rehearsal connection could not be verified. Please try again.",
        statusCode: 502,
        retryable: true,
        logContext: {
          operation: "realtime_sdp_validation",
          providerRequestId,
          answerLength: answerSdp.length,
          durationMs,
        },
      });
    }

    this.options.logger.info(
      {
        event: "ai.realtime.session.created",
        requestId: context.requestId,
        traceId: context.traceId,
        providerRequestId,
        model: this.options.model,
        durationMs,
      },
      "realtime session created",
    );

    return { answerSdp, model: this.options.model, providerRequestId, durationMs };
  }
}
