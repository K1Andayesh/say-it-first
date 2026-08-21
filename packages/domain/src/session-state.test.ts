import { describe, expect, it } from "vitest";

import {
  assertPracticeSessionTransition,
  canTransitionPracticeSession,
} from "./session-state.js";

describe("practice session state machine", () => {
  it("allows the normal voice-practice path", () => {
    const path = [
      "idle",
      "authorising",
      "connecting",
      "ready",
      "active",
      "ending",
      "evaluating",
      "completed",
    ] as const;

    for (let index = 0; index < path.length - 1; index += 1) {
      expect(canTransitionPracticeSession(path[index]!, path[index + 1]!)).toBe(true);
    }
  });

  it("rejects skipping directly from active to completed", () => {
    expect(() => assertPracticeSessionTransition("active", "completed")).toThrow(
      "Invalid practice-session transition: active -> completed",
    );
  });
});
