import { describe, expect, it } from "vitest";

import type { PracticeEvaluation, TranscriptTurn } from "@say-it-first/contracts";

import { validateEvaluationEvidence } from "./evidence.js";

const transcript: TranscriptTurn[] = [
  {
    id: "turn-user-1",
    sequence: 0,
    speaker: "user",
    text: "The last three deliverables needed substantial rework, and we need to change that.",
    startedAtMs: 0,
    endedAtMs: 4_000,
  },
  {
    id: "turn-employee-1",
    sequence: 1,
    speaker: "employee",
    text: "That does not feel fair because the requirements changed.",
    startedAtMs: 4_100,
    endedAtMs: 7_000,
  },
];

function evaluationWithEvidence(turnId: string, quote: string): PracticeEvaluation {
  return {
    schemaVersion: 1,
    summary: "The manager stated the gap directly.",
    strongestMoment: { turnId, quote, explanation: "This names the observable gap." },
    missedOpportunity: null,
    dimensions: [
      "clarity",
      "empathy_listening",
      "specificity",
      "boundaries_assertiveness",
      "next_steps_accountability",
    ].map((dimension) => ({
      dimension: dimension as PracticeEvaluation["dimensions"][number]["dimension"],
      score: null,
      label: "not_enough_evidence" as const,
      evidence: [],
      feedback: "Not enough evidence.",
      nextTry: "Continue the conversation.",
    })),
    suggestedOpening: null,
    suggestedNextSentence: "What got in the way, and what support do you need?",
    suggestedClosing: null,
    overallNextStep: "Continue with a specific improvement plan.",
    cautions: [],
    evaluatorConfidence: 0.8,
  };
}

describe("validateEvaluationEvidence", () => {
  it("accepts an exact quote from a user turn", () => {
    const evaluation = evaluationWithEvidence(
      "turn-user-1",
      "The last three deliverables needed substantial rework",
    );

    expect(validateEvaluationEvidence(evaluation, transcript)).toEqual([]);
  });

  it("rejects an invented quote", () => {
    const evaluation = evaluationWithEvidence("turn-user-1", "You consistently fail at quality");

    expect(validateEvaluationEvidence(evaluation, transcript)).toEqual([
      {
        path: "strongestMoment",
        reason: "quote_not_exact",
        turnId: "turn-user-1",
      },
    ]);
  });

  it("rejects evidence attributed to the simulated employee", () => {
    const evaluation = evaluationWithEvidence("turn-employee-1", "That does not feel fair");

    expect(validateEvaluationEvidence(evaluation, transcript)).toEqual([
      {
        path: "strongestMoment",
        reason: "not_user_turn",
        turnId: "turn-employee-1",
      },
    ]);
  });
});
