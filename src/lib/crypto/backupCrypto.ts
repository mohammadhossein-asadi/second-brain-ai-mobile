import { pbkdf2, pbkdf2Async } from "@noble/hashes/pbkdf2.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { gcm } from "@noble/ciphers/aes.js";
import { utf8ToBytes } from "@noble/hashes/utils.js";

/**
 * End-to-end encrypted backup payload format.
 *
 * Pure, dependency-light crypto core — no React Native imports, so it can be
 * unit-tested directly under Node. Randomness is injected by the caller:
 * on-device the service wires expo-crypto; tests use node:crypto webcrypto.
 *
 * Payload layout (before base64):
 *   [16B salt][12B nonce][ciphertext+16B GCM tag]
 * Envelope: "SBRAIN1:<base64(payload)>"
 * Key: PBKDF2-HMAC-SHA256(passphrase, salt, 600k, 32B); AAD binds the magic.
 */

export const BACKUP_MAGIC = "SBRAIN1";
const SALT_LEN = 16;
const NONCE_LEN = 12;
const KEY_LEN = 32;
const PBKDF2_ITERATIONS = 600_000;
const GCM_TAG_LEN = 16;

export type RandomBytesFn = (length: number) => Uint8Array;

export type BackupCryptoErrorCode =
  | "bad-format"
  | "corrupt"
  | "wrong-passphrase";

export class BackupCryptoError extends Error {
  readonly code: BackupCryptoErrorCode;

  constructor(code: BackupCryptoErrorCode, message: string) {
    super(message);
    this.name = "BackupCryptoError";
    this.code = code;
  }
}

const B64_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function bytesToBase64(bytes: Uint8Array): string {
  let out = "";
  let i = 0;
  for (; i + 2 < bytes.length; i += 3) {
    const n = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    out +=
      B64_ALPHABET[(n >> 18) & 63] +
      B64_ALPHABET[(n >> 12) & 63] +
      B64_ALPHABET[(n >> 6) & 63] +
      B64_ALPHABET[n & 63];
  }
  const rem = bytes.length - i;
  if (rem === 1) {
    const n = bytes[i] << 16;
    out += B64_ALPHABET[(n >> 18) & 63] + B64_ALPHABET[(n >> 12) & 63] + "==";
  } else if (rem === 2) {
    const n = (bytes[i] << 16) | (bytes[i + 1] << 8);
    out +=
      B64_ALPHABET[(n >> 18) & 63] +
      B64_ALPHABET[(n >> 12) & 63] +
      B64_ALPHABET[(n >> 6) & 63] +
      "=";
  }
  return out;
}

function base64ToBytes(text: string): Uint8Array {
  const clean = text.replace(/\s+/g, "").replace(/=+$/, "");
  const out = new Uint8Array(Math.floor((clean.length * 3) / 4));
  let bits = 0;
  let acc = 0;
  let pos = 0;
  for (let i = 0; i < clean.length; i++) {
    const idx = B64_ALPHABET.indexOf(clean[i]);
    if (idx === -1) throw new BackupCryptoError("bad-format", "Invalid base64 character");
    acc = (acc << 6) | idx;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out[pos++] = (acc >> bits) & 0xff;
    }
  }
  return out.subarray(0, pos);
}

function bytesToUtf8(bytes: Uint8Array): string {
  let out = "";
  let i = 0;
  while (i < bytes.length) {
    const b = bytes[i];
    if (b < 0x80) {
      out += String.fromCharCode(b);
      i += 1;
    } else if (b < 0xe0) {
      out += String.fromCharCode(((b & 0x1f) << 6) | (bytes[i + 1] & 0x3f));
      i += 2;
    } else if (b < 0xf0) {
      out += String.fromCharCode(
        ((b & 0x0f) << 12) | ((bytes[i + 1] & 0x3f) << 6) | (bytes[i + 2] & 0x3f)
      );
      i += 3;
    } else {
      const cp =
        ((b & 0x07) << 18) |
        ((bytes[i + 1] & 0x3f) << 12) |
        ((bytes[i + 2] & 0x3f) << 6) |
        (bytes[i + 3] & 0x3f);
      const offset = cp - 0x10000;
      out += String.fromCharCode(0xd800 + (offset >> 10), 0xdc00 + (offset & 0x3ff));
      i += 4;
    }
  }
  return out;
}

function deriveKeySync(passphrase: string, salt: Uint8Array): Uint8Array {
  return pbkdf2(sha256, passphrase, salt, { c: PBKDF2_ITERATIONS, dkLen: KEY_LEN });
}

async function deriveKeyAsync(passphrase: string, salt: Uint8Array): Promise<Uint8Array> {
  return pbkdf2Async(sha256, passphrase, salt, { c: PBKDF2_ITERATIONS, dkLen: KEY_LEN });
}

export function encryptBackup(
  json: string,
  passphrase: string,
  randomBytes: RandomBytesFn
): string {
  const salt = randomBytes(SALT_LEN);
  const nonce = randomBytes(NONCE_LEN);
  const key = deriveKeySync(passphrase, salt);
  const aad = utf8ToBytes(BACKUP_MAGIC);
  const ciphertext = gcm(key, nonce, aad).encrypt(utf8ToBytes(json));
  const payload = new Uint8Array(SALT_LEN + NONCE_LEN + ciphertext.length);
  payload.set(salt, 0);
  payload.set(nonce, SALT_LEN);
  payload.set(ciphertext, SALT_LEN + NONCE_LEN);
  return `${BACKUP_MAGIC}:${bytesToBase64(payload)}`;
}

export function decryptBackup(payload: string, passphrase: string): string {
  if (!payload.startsWith(`${BACKUP_MAGIC}:`)) {
    throw new BackupCryptoError("bad-format", "Not an SBRAIN backup payload");
  }
  const data = base64ToBytes(payload.slice(BACKUP_MAGIC.length + 1));
  if (data.length < SALT_LEN + NONCE_LEN + GCM_TAG_LEN) {
    throw new BackupCryptoError("corrupt", "Backup payload too short");
  }
  const salt = data.slice(0, SALT_LEN);
  const nonce = data.slice(SALT_LEN, SALT_LEN + NONCE_LEN);
  const ciphertext = data.slice(SALT_LEN + NONCE_LEN);
  const key = deriveKeySync(passphrase, salt);
  const aad = utf8ToBytes(BACKUP_MAGIC);
  let plain: Uint8Array;
  try {
    plain = gcm(key, nonce, aad).decrypt(ciphertext);
  } catch {
    throw new BackupCryptoError("wrong-passphrase", "Decryption failed");
  }
  return bytesToUtf8(plain);
}

export async function encryptBackupAsync(
  json: string,
  passphrase: string,
  randomBytes: RandomBytesFn
): Promise<string> {
  const salt = randomBytes(SALT_LEN);
  const nonce = randomBytes(NONCE_LEN);
  const key = await deriveKeyAsync(passphrase, salt);
  const aad = utf8ToBytes(BACKUP_MAGIC);
  const ciphertext = gcm(key, nonce, aad).encrypt(utf8ToBytes(json));
  const payload = new Uint8Array(SALT_LEN + NONCE_LEN + ciphertext.length);
  payload.set(salt, 0);
  payload.set(nonce, SALT_LEN);
  payload.set(ciphertext, SALT_LEN + NONCE_LEN);
  return `${BACKUP_MAGIC}:${bytesToBase64(payload)}`;
}

export async function decryptBackupAsync(payload: string, passphrase: string): Promise<string> {
  if (!payload.startsWith(`${BACKUP_MAGIC}:`)) {
    throw new BackupCryptoError("bad-format", "Not an SBRAIN backup payload");
  }
  const data = base64ToBytes(payload.slice(BACKUP_MAGIC.length + 1));
  if (data.length < SALT_LEN + NONCE_LEN + GCM_TAG_LEN) {
    throw new BackupCryptoError("corrupt", "Backup payload too small");
  }
  const salt = data.slice(0, SALT_LEN);
  const nonce = data.slice(SALT_LEN, SALT_LEN + NONCE_LEN);
  const ciphertext = data.slice(SALT_LEN + NONCE_LEN);
  const key = await deriveKeyAsync(passphrase, salt);
  const aad = utf8ToBytes(BACKUP_MAGIC);
  let plain: Uint8Array;
  try {
    plain = gcm(key, nonce, aad).decrypt(ciphertext);
  } catch {
    throw new BackupCryptoError("wrong-passphrase", "Decryption failed");
  }
  return bytesToUtf8(plain);
}

export function isValidBackupPayload(payload: string): boolean {
  return typeof payload === "string" && payload.startsWith(`${BACKUP_MAGIC}:`);
}
