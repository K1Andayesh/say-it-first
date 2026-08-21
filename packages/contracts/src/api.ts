import { z } from "zod";

export const apiErrorCodeSchema = z.enum([
  "bad_request",
  "not_found",
  "rate_limited",
  "provider_unavailable",
  "provider_rejected",
  "invalid_provider_output",
  "configuration_error",
  "internal_error",
]);

export const apiErrorResponseSchema = z.object({
  error: z.object({
    code: apiErrorCodeSchema,
    message: z.string().min(1),
    retryable: z.boolean(),
    requestId: z.string().min(1),
    traceId: z.string().regex(/^[a-f0-9]{32}$/),
  }),
});

export type ApiErrorCode = z.infer<typeof apiErrorCodeSchema>;
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;

export const healthResponseSchema = z.object({
  status: z.enum(["ok", "degraded"]),
  service: z.literal("say-it-first-api"),
  version: z.string().min(1),
  checks: z.record(z.string(), z.enum(["ok", "missing", "failed"])).optional(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
