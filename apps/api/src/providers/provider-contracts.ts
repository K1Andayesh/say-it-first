import type { PracticeEvaluation, TranscriptTurn } from "@say-it-first/contracts";

export type RealtimeCallInput = {
  sdp: string;
  scenarioId: string;
  personaId: string;
  anonymousUserId: string;
  customContext?: string;
};

export type RealtimeCallResult = {
  answerSdp: string;
  model: string;
  providerRequestId: string | null;
  durationMs: number;
};

export interface RealtimeProvider {
  readonly configured: boolean;
  readonly model: string;
  createCall(input: RealtimeCallInput): Promise<RealtimeCallResult>;
}

export type EvaluationInput = {
  scenarioId: string;
  scenarioVersion: number;
  personaId: string;
  transcript: readonly TranscriptTurn[];
  customContext?: string;
};

export type EvaluationResult = {
  evaluation: PracticeEvaluation;
  model: string;
  providerRequestId: string | null;
  durationMs: number;
};

export interface EvaluationProvider {
  readonly configured: boolean;
  readonly model: string;
  evaluate(input: EvaluationInput): Promise<EvaluationResult>;
}
