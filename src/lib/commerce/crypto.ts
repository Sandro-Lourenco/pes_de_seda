import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";

export function opaqueId(prefix: string) {
  return `${prefix}_${randomUUID().replaceAll("-", "")}`;
}

export function accessToken() {
  return randomBytes(32).toString("base64url");
}

export function hashSecret(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function equalSecret(actual: string | undefined, expected: string | undefined) {
  if (!actual || !expected) return false;
  const a = Buffer.from(hashSecret(actual), "hex");
  const b = Buffer.from(hashSecret(expected), "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}
