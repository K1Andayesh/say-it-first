import * as Crypto from "expo-crypto";

import {
  apiErrorResponseSchema,
  evaluatePracticeResponseSchema,
  type EvaluatePracticeRequest,
  type EvaluatePracticeResponse,
} from "@say-it-first/contracts";

import { diagnosticLog } from "@/services/diagnostics/diagnostic-log";

const configuredApiBaseUrl: unknown = process.env.EXPO_PUBLIC_API_BASE_URL;
const apiBaseUrl =
  typeof configuredApiBaseUrl === "string" && configuredApiBaseUrl.trim()
    ? configuredApiBaseUrl.replace(/\/$/, "")
    : "http://10.0.2.2:4100";

export class ApiClientError extends Error {
  public constructor(
    message: string,
    public readonly retryable: boolean,
    public readonly requestId: string | null,
    public readonly traceId: string | null,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export function createCorrelation(): { requestId: string; traceId: string; traceparent: string } {
  const requestId = Crypto.randomUUID();
  const traceId = Crypto.randomUUID().replaceAll("-", "");
  const spanId = Crypto.randomUUID().replaceAll("-", "").slice(0, 16);
  return { requestId, traceId, traceparent: `00-${traceId}-${spanId}-01` };
}

export function getApiBaseUrl(): string {
  return apiBaseUrl;
}

export async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export async function evaluatePractice(
  input: EvaluatePracticeRequest,
): Promise<EvaluatePracticeResponse> {
  const correlation = createCorrelation();
  const startedAt = performance.now();
  diagnosticLog.record("info", "api.evaluation.requested", {
    requestId: correlation.requestId,
    traceId: correlation.traceId,
    turnCount: input.transcript.length,
  });

  const response = await fetchWithTimeout(`${apiBaseUrl}/api/v1/evaluations`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-request-id": correlation.requestId,
      traceparent: correlation.traceparent,
    },
    body: JSON.stringify(input),
  }, 45_000);

  const durationMs = Math.round(performance.now() - startedAt);
  const body: unknown = await response.json();
  if (!response.ok) {
    const parsedError = apiErrorResponseSchema.safeParse(body);
    diagnosticLog.record("warn", "api.evaluation.failed", {
      requestId: correlation.requestId,
      traceId: correlation.traceId,
      statusCode: response.status,
      durationMs,
    });
    throw new ApiClientError(
      parsedError.success ? parsedError.data.error.message : "Feedback could not be generated.",
      parsedError.success ? parsedError.data.error.retryable : response.status >= 500,
      parsedError.success ? parsedError.data.error.requestId : correlation.requestId,
      parsedError.success ? parsedError.data.error.traceId : correlation.traceId,
    );
  }

  const result = evaluatePracticeResponseSchema.parse(body);
  diagnosticLog.record("info", "api.evaluation.completed", {
    requestId: result.meta.requestId,
    traceId: result.meta.traceId,
    model: result.meta.model,
    durationMs,
  });
  return result;
}
