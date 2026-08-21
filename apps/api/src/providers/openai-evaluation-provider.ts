import {
  practiceEvaluationSchema,
  type PracticeEvaluation,
} from "@say-it-first/contracts";
import {
  buildEvaluationInput,
  getPersona,
  getScenario,
  validateEvaluationEvidence,
} from "@say-it-first/domain";
import type { FastifyBaseLogger } from "fastify";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

import { AppError } from "../lib/app-error.js";
import { getRequestContext } from "../observability/request-context.js";
import type {
  EvaluationInput,
  EvaluationProvider,
  EvaluationResult,
} from "./provider-contracts.js";

type OpenAIEvaluationProviderOptions = {
  apiKey: string;
  model: string;
  timeoutMs: number;
  logger: FastifyBaseLogger;
};

export class OpenAIEvaluationProvider implements EvaluationProvider {
  public readonly configured = true;
  public readonly model: string;
  private readonly client: OpenAI;

  public constructor(private readonly options: OpenAIEvaluationProviderOptions) {
    this.model = options.model;
    this.client = new OpenAI({ apiKey: options.apiKey, timeout: options.timeoutMs, maxRetries: 1 });
  }

  public async evaluate(input: EvaluationInput): Promise<EvaluationResult> {
    const scenario = getScenario(input.scenarioId);
    const persona = getPersona(input.personaId);
    if (!scenario || scenario.version !== input.scenarioVersion || !persona) {
      throw new AppError({
        code: "not_found",
        message: "The selected rehearsal definition is unavailable.",
        statusCode: 404,
      });
    }

    const context = getRequestContext();
    const startedAt = performance.now();

    this.options.logger.info(
      {
        event: "ai.evaluation.requested",
        requestId: context.requestId,
        traceId: context.traceId,
        model: this.options.model,
        scenarioId: scenario.id,
        scenarioVersion: scenario.version,
        personaId: persona.id,
        transcriptTurnCount: input.transcript.length,
        userTurnCount: input.transcript.filter((turn) => turn.speaker === "user").length,
      },
      "requesting grounded evaluation",
    );

    let providerRequestId: string | null = null;
    let evaluation: PracticeEvaluation | null = null;
    const evaluationInput = buildEvaluationInput({
      scenario,
      persona,
      transcript: input.transcript,
      ...(input.customContext ? { customContext: input.customContext } : {}),
    });

    for (let attempt = 1; attempt <= 2; attempt += 1) {
      let response;
      try {
        response = await this.client.responses.parse({
          model: this.options.model,
          store: false,
          input: [
            {
              role: "system",
              content:
                attempt === 1
                  ? "You are a rigorous workplace communication practice evaluator. Return only grounded, evidence-linked coaching. Never invent a quote or infer emotion, personality, confidence, or intent."
                  : "This is a correction attempt. Every evidence turnId must identify an existing user turn and every quote must be an exact substring of that turn. Use null or not_enough_evidence whenever the transcript cannot support a claim. Never invent evidence.",
            },
            { role: "user", content: evaluationInput },
          ],
          text: {
            format: zodTextFormat(practiceEvaluationSchema, "practice_evaluation"),
          },
        });
      } catch (error) {
        const durationMs = Math.round(performance.now() - startedAt);
        this.options.logger.error(
          {
            event: "ai.evaluation.failed",
            requestId: context.requestId,
            traceId: context.traceId,
            providerRequestId,
            model: this.options.model,
            attempt,
            durationMs,
            transcriptTurnCount: input.transcript.length,
            err: error,
          },
          "evaluation provider request failed",
        );
        throw new AppError({
          code: "provider_unavailable",
          message: "Feedback could not be generated. Your local transcript is still available.",
          statusCode: 503,
          retryable: true,
          logContext: { operation: "evaluation", providerRequestId, attempt, durationMs },
          cause: error,
        });
      }

      providerRequestId = response._request_id ?? null;
      const parsed = practiceEvaluationSchema.safeParse(response.output_parsed);
      if (!parsed.success) {
        const durationMs = Math.round(performance.now() - startedAt);
        if (attempt === 1) {
          this.options.logger.warn(
            {
              event: "ai.evaluation.output_retrying",
              requestId: context.requestId,
              traceId: context.traceId,
              providerRequestId,
              model: this.options.model,
              attempt,
              reason: "schema_validation",
              issueCount: parsed.error.issues.length,
              durationMs,
            },
            "retrying invalid evaluation output once",
          );
          continue;
        }

        this.options.logger.error(
          {
            event: "ai.evaluation.output_invalid",
            requestId: context.requestId,
            traceId: context.traceId,
            providerRequestId,
            model: this.options.model,
            attempt,
            reason: "schema_validation",
            issueCount: parsed.error.issues.length,
            durationMs,
          },
          "evaluation output remained invalid",
        );
        throw new AppError({
          code: "invalid_provider_output",
          message: "Feedback was withheld because the result could not be verified.",
          statusCode: 502,
          retryable: true,
          logContext: {
            operation: "evaluation_schema",
            providerRequestId,
            issueCount: parsed.error.issues.length,
          },
        });
      }

      const evidenceIssues = validateEvaluationEvidence(parsed.data, input.transcript);
      if (evidenceIssues.length === 0) {
        evaluation = parsed.data;
        break;
      }

      const durationMs = Math.round(performance.now() - startedAt);
      if (attempt === 1) {
        this.options.logger.warn(
          {
            event: "ai.evaluation.output_retrying",
            requestId: context.requestId,
            traceId: context.traceId,
            providerRequestId,
            model: this.options.model,
            attempt,
            reason: "evidence_grounding",
            issueCount: evidenceIssues.length,
            issues: evidenceIssues,
            durationMs,
          },
          "retrying ungrounded evaluation output once",
        );
        continue;
      }

      this.options.logger.error(
        {
          event: "ai.evaluation.grounding_failed",
          requestId: context.requestId,
          traceId: context.traceId,
          providerRequestId,
          model: this.options.model,
          attempt,
          durationMs,
          issueCount: evidenceIssues.length,
          issues: evidenceIssues,
        },
        "evaluation evidence remained ungrounded",
      );
      throw new AppError({
        code: "invalid_provider_output",
        message: "Feedback was withheld because its evidence could not be verified.",
        statusCode: 502,
        retryable: true,
        logContext: {
          operation: "evaluation_grounding",
          providerRequestId,
          issueCount: evidenceIssues.length,
        },
      });
    }

    if (!evaluation) {
      throw new AppError({
        code: "invalid_provider_output",
        message: "Feedback was withheld because the result could not be verified.",
        statusCode: 502,
        retryable: true,
        logContext: { operation: "evaluation_unknown", providerRequestId },
      });
    }

    const durationMs = Math.round(performance.now() - startedAt);

    this.options.logger.info(
      {
        event: "ai.evaluation.completed",
        requestId: context.requestId,
        traceId: context.traceId,
        providerRequestId,
        model: this.options.model,
        durationMs,
        transcriptTurnCount: input.transcript.length,
        evaluatorConfidence: evaluation.evaluatorConfidence,
        cautionCount: evaluation.cautions.length,
      },
      "grounded evaluation completed",
    );

    return { evaluation, model: this.options.model, providerRequestId, durationMs };
  }
}
