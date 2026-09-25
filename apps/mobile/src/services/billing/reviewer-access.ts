import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";

import {
  matchesReviewerAccessDigest,
  normalizeReviewerAccessCode,
} from "./reviewer-access-code";

const REVIEWER_ACCESS_STORAGE_KEY = "say_it_first_play_reviewer_access_v1";

export async function hasReviewerAccess(): Promise<boolean> {
  return (await SecureStore.getItemAsync(REVIEWER_ACCESS_STORAGE_KEY)) === "active";
}

export async function activateReviewerAccess(code: string): Promise<boolean> {
  const normalized = normalizeReviewerAccessCode(code);
  if (!normalized) return false;
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    normalized,
  );
  if (!matchesReviewerAccessDigest(digest)) return false;
  await SecureStore.setItemAsync(REVIEWER_ACCESS_STORAGE_KEY, "active");
  return true;
}
