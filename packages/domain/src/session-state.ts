export const practiceSessionStates = [
  "idle",
  "authorising",
  "connecting",
  "ready",
  "active",
  "paused",
  "ending",
  "evaluating",
  "completed",
  "blocked",
  "connection_failed",
  "interrupted",
  "evaluation_failed",
] as const;

export type PracticeSessionState = (typeof practiceSessionStates)[number];

const transitions: Readonly<Record<PracticeSessionState, readonly PracticeSessionState[]>> = {
  idle: ["authorising"],
  authorising: ["connecting", "blocked"],
  connecting: ["ready", "connection_failed"],
  ready: ["active", "ending", "interrupted"],
  active: ["paused", "ending", "interrupted"],
  paused: ["active", "ending", "interrupted"],
  ending: ["evaluating", "interrupted"],
  evaluating: ["completed", "evaluation_failed"],
  completed: [],
  blocked: ["authorising"],
  connection_failed: ["authorising"],
  interrupted: ["evaluating", "authorising"],
  evaluation_failed: ["evaluating"],
};

export function canTransitionPracticeSession(
  from: PracticeSessionState,
  to: PracticeSessionState,
): boolean {
  return transitions[from].includes(to);
}

export function assertPracticeSessionTransition(
  from: PracticeSessionState,
  to: PracticeSessionState,
): void {
  if (!canTransitionPracticeSession(from, to)) {
    throw new Error(`Invalid practice-session transition: ${from} -> ${to}`);
  }
}
