import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";

const secureStoreKey = "say-it-first.anonymous-user-id.v1";

export async function getOrCreateAnonymousUserId(): Promise<string> {
  const existing = await SecureStore.getItemAsync(secureStoreKey);
  if (existing) return existing;

  const created = Crypto.randomUUID();
  await SecureStore.setItemAsync(secureStoreKey, created, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  return created;
}
