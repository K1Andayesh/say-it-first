import { z } from "zod";

export const transcriptSpeakerSchema = z.enum(["user", "employee"]);

export const transcriptTurnSchema = z.object({
  id: z.string().min(1).max(120),
  sequence: z.number().int().nonnegative(),
  speaker: transcriptSpeakerSchema,
  text: z.string().min(1).max(4_000),
  startedAtMs: z.number().int().nonnegative().nullable().default(null),
  endedAtMs: z.number().int().nonnegative().nullable().default(null),
});

export type TranscriptSpeaker = z.infer<typeof transcriptSpeakerSchema>;
export type TranscriptTurn = z.infer<typeof transcriptTurnSchema>;
