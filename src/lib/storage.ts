import { createMMKV } from "react-native-mmkv";

/**
 * Synchronous key-value storage that replaces the web app's `localStorage`.
 * Same keys are used (app_v1_*), so exported backups remain
 * compatible between the web and Android versions.
 */
export const mmkv = createMMKV({ id: "app-storage" });

export const storage = {
  getItem(key: string): string | null {
    return mmkv.getString(key) ?? null;
  },
  setItem(key: string, value: string): void {
    mmkv.set(key, value);
  },
  removeItem(key: string): void {
    mmkv.remove(key);
  },
  has(key: string): boolean {
    return mmkv.contains(key);
  },
};
