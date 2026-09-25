export const REVIEWER_ACCESS_CODE_DIGEST =
  "f379e4ff0c54829dcdc1250b1cf9348d16f53199d371370500888f9d7c00e090";

export function normalizeReviewerAccessCode(value: string): string {
  return value.trim().toUpperCase();
}

export function matchesReviewerAccessDigest(digest: string): boolean {
  return digest.toLowerCase() === REVIEWER_ACCESS_CODE_DIGEST;
}
