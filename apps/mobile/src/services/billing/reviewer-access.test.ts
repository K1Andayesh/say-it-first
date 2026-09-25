import { describe, expect, it } from "vitest";

import {
  matchesReviewerAccessDigest,
  normalizeReviewerAccessCode,
} from "./reviewer-access-code";

describe("Play reviewer access", () => {
  it("normalizes reviewer input without publishing the private review code", () => {
    expect(normalizeReviewerAccessCode("  demo-code  ")).toBe("DEMO-CODE");
  });

  it("accepts only the documented code digest", () => {
    const valid = "f379e4ff0c54829dcdc1250b1cf9348d16f53199d371370500888f9d7c00e090";
    const invalid = "ce9e0b10c20da37d2cc53f54f27fa4a48aa1479eed6e98d7b11936d58aa6ba06";
    expect(matchesReviewerAccessDigest(valid)).toBe(true);
    expect(matchesReviewerAccessDigest(invalid)).toBe(false);
  });
});
