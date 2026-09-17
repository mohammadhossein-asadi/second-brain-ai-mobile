import { getRandomValues } from "expo-crypto";
import {
  writeAndShareFile,
  pickAndReadTextFile,
  backupFilename,
} from "../../lib/files";
import {
  encryptBackupAsync,
  decryptBackupAsync,
  BackupCryptoError,
  isValidBackupPayload,
} from "../../lib/crypto/backupCrypto";

/**
 * End-to-end encrypted backup service.
 *
 * The backup payload is encrypted on-device with a user passphrase
 * (PBKDF2-HMAC-SHA256 + AES-256-GCM). The resulting file can be saved to
 * iCloud Drive / Google Drive / anywhere via the share sheet — it is only
 * readable with the passphrase.
 */

const MIN_PASSPHRASE_LENGTH = 8;

const randomBytes = (length: number): Uint8Array =>
  getRandomValues(new Uint8Array(length));

export type BackupResult =
  | { success: true; message?: string }
  | { success: false; reason: "short-passphrase" | "wrong-passphrase" | "bad-file" | "canceled" | "error"; message?: string };

export function validatePassphrase(passphrase: string): boolean {
  return typeof passphrase === "string" && passphrase.length >= MIN_PASSPHRASE_LENGTH;
}

export async function shareEncryptedBackup(
  backupJSON: string,
  passphrase: string
): Promise<{ success: boolean; reason?: string; message?: string }> {
  if (!validatePassphrase(passphrase)) {
    return { success: false, reason: "short-passphrase" };
  }
  try {
    const payload = await encryptBackupAsync(backupJSON, passphrase, randomBytes);
    const filename = backupFilename("second_brain_encrypted_backup", "sbrain");
    await writeAndShareFile(payload, filename, "application/octet-stream");
    return { success: true };
  } catch {
    return { success: false, reason: "error" };
  }
}

export async function restoreFromEncryptedBackup(
  passphrase: string
): Promise<{ success: boolean; reason?: string; message?: string }> {
  if (!validatePassphrase(passphrase)) {
    return { success: false, reason: "short-passphrase" };
  }
  try {
    const content = await pickAndReadTextFile("*/*");
    if (!content) {
      return { success: false, reason: "canceled" };
    }
    const payload = content.trim();
    if (!isValidBackupPayload(payload)) {
      return { success: false, reason: "bad-file" };
    }
    const json = await decryptBackupAsync(payload, passphrase);
    // Sanity-check the decrypted payload is JSON before handing it onward
    JSON.parse(json);
    return { success: true, message: json };
  } catch (e) {
    if (e instanceof BackupCryptoError) {
      if (e.code === "wrong-passphrase") {
        return { success: false, reason: "wrong-passphrase" };
      }
      return { success: false, reason: "bad-file" };
    }
    return { success: false, reason: "error" };
  }
}
