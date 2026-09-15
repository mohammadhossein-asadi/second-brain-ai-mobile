import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";

/**
 * Native replacements for the web app's Blob/download and FileReader flows.
 */

export async function writeAndShareFile(
  contents: string,
  filename: string,
  mimeType: string
): Promise<void> {
  const file = new File(Paths.document, filename);
  file.write(contents);
  await Sharing.shareAsync(file.uri, { mimeType, dialogTitle: filename });
}

export async function pickAndReadTextFile(mime: string): Promise<string | null> {
  const result = await DocumentPicker.getDocumentAsync({ type: mime, multiple: false });
  if (result.canceled || !result.assets || result.assets.length === 0) return null;
  const asset = result.assets[0];
  const file = new File(asset.uri);
  return file.text();
}

export function backupFilename(prefix: string, extension: string): string {
  const dateStr = new Date().toISOString().split("T")[0];
  return `${prefix}-${dateStr}.${extension}`;
}
