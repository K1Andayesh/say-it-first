import { z } from "zod";

import { transcriptTurnSchema } from "./transcript.js";

export const dimensionSchema = z.enum([
  "clarity",
  "empathy_listening",
  "specificity",
  "boundaries_assertiveness",
  "next_steps_accountability",
]);

export const transcriptEvidenceSchema = z.object({
  turnId: z.string().min(1).max(120),
  quote: z.string().min(1).max(300),
});

export const evidenceFeedbackSchema = transcriptEvidenceSchema.extend({
  explanation: z.string().min(1).max(800),
});

export const dimensionEvaluationSchema = z.object({
  dimension: dimensionSchema,
  score: z.number().int().min(0).max(100).nullable(),
  label: z.enum(["needs_work", "developing", "strong", "not_enough_evidence"]),
  evidence: z.array(transcriptEvidenceSchema).max(3),
  feedback: z.string().min(1).max(1_000),
  nextTry: z.string().min(1).max(600),
});

export const evaluationCautionSchema = z.object({
  code: z.enum([
    "hr_review",
    "legal_review",
    "safety_concern",
    "harassment_or_discrimination",
    "medical_or_disability",
    "self_harm_or_violence",
    "insufficient_context",
  ]),
  message: z.string().min(1).max(600),
});

export const practiceEvaluationSchema = z.object({
  schemaVersion: z.literal(1),
  summary: z.string().min(1).max(800),
  strongestMoment: evidenceFeedbackSchema.nullable(),
  missedOpportunity: evidenceFeedbackSchema.nullable(),
  dimensions: z.array(dimensionEvaluationSchema).length(5),
  suggestedOpening: z.string().min(1).max(600).nullable(),
  suggestedNextSentence: z.string().min(1).max(600).nullable(),
  suggestedClosing: z.string().min(1).max(600).nullable(),
  overallNextStep: z.string().min(1).max(800),
  cautions: z.array(evaluationCautionSchema).max(5),
  evaluatorConfidence: z.number().min(0).max(1),
});

export type PracticeEvaluation = z.infer<typeof practiceEvaluationSchema>;
export type TranscriptEvidence = z.infer<typeof transcriptEvidenceSchema>;

export const evaluatePracticeRequestSchema = z.object({
  practiceSessionId: z.string().uuid(),
  scenarioId: z.string().min(1).max(120),
  scenarioVersion: z.number().int().positive(),
  personaId: z.string().min(1).max(120),
  transcript: z.array(transcriptTurnSchema).min(1).max(200),
  customContext: z.string().max(600).optional(),
});

export type EvaluatePracticeRequest = z.infer<typeof evaluatePracticeRequestSchema>;

export const evaluatePracticeResponseSchema = z.object({
  evaluation: practiceEvaluationSchema,
  meta: z.object({
    requestId: z.string().min(1),
    traceId: z.string().regex(/^[a-f0-9]{32}$/),
    durationMs: z.number().int().nonnegative(),
    model: z.string().min(1),
    providerRequestId: z.string().nullable(),
  }),
});

export type EvaluatePracticeResponse = z.infer<typeof evaluatePracticeResponseSchema>;
