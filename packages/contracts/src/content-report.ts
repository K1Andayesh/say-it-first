import { z } from "zod";

export const contentReportReasonSchema = z.enum([
  "harassment",
  "harmful_advice",
  "discrimination",
  "sexual_content",
  "other",
]);

export const createContentReportRequestSchema = z.object({
  scenarioId: z.string().min(1).max(120),
  personaId: z.string().min(1).max(120),
  assistantTurnId: z.string().min(1).max(160),
  assistantText: z.string().trim().min(1).max(2_000),
  reason: contentReportReasonSchema,
});

export const createContentReportResponseSchema = z.object({
  reportId: z.string().uuid(),
  accepted: z.literal(true),
  meta: z.object({
    requestId: z.string().min(1),
    traceId: z.string().regex(/^[a-f0-9]{32}$/),
  }),
});

export type ContentReportReason = z.infer<typeof contentReportReasonSchema>;
export type CreateContentReportRequest = z.infer<typeof createContentReportRequestSchema>;
export type CreateContentReportResponse = z.infer<typeof createContentReportResponseSchema>;
