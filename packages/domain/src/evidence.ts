import type {
  PracticeEvaluation,
  TranscriptEvidence,
  TranscriptTurn,
} from "@say-it-first/contracts";

export type EvidenceValidationIssue = {
  path: string;
  reason: "turn_not_found" | "not_user_turn" | "quote_not_exact";
  turnId: string;
};

function normalizeForExactComparison(value: string): string {
  return value.normalize("NFKC").replace(/\s+/g, " ").trim();
}

function collectEvidence(evaluation: PracticeEvaluation): Array<{
  path: string;
  evidence: TranscriptEvidence;
}> {
  const collected: Array<{ path: string; evidence: TranscriptEvidence }> = [];

  if (evaluation.strongestMoment) {
    collected.push({ path: "strongestMoment", evidence: evaluation.strongestMoment });
  }
  if (evaluation.missedOpportunity) {
    collected.push({ path: "missedOpportunity", evidence: evaluation.missedOpportunity });
  }

  evaluation.dimensions.forEach((dimension, dimensionIndex) => {
    dimension.evidence.forEach((evidence, evidenceIndex) => {
      collected.push({
        path: `dimensions.${dimensionIndex}.evidence.${evidenceIndex}`,
        evidence,
      });
    });
  });

  return collected;
}

export function validateEvaluationEvidence(
  evaluation: PracticeEvaluation,
  transcript: readonly TranscriptTurn[],
): EvidenceValidationIssue[] {
  const turnsById = new Map(transcript.map((turn) => [turn.id, turn]));
  const issues: EvidenceValidationIssue[] = [];

  for (const { path, evidence } of collectEvidence(evaluation)) {
    const turn = turnsById.get(evidence.turnId);
    if (!turn) {
      issues.push({ path, reason: "turn_not_found", turnId: evidence.turnId });
      continue;
    }
    if (turn.speaker !== "user") {
      issues.push({ path, reason: "not_user_turn", turnId: evidence.turnId });
      continue;
    }

    const normalizedTurn = normalizeForExactComparison(turn.text);
    const normalizedQuote = normalizeForExactComparison(evidence.quote);
    if (!normalizedTurn.includes(normalizedQuote)) {
      issues.push({ path, reason: "quote_not_exact", turnId: evidence.turnId });
    }
  }

  return issues;
}
