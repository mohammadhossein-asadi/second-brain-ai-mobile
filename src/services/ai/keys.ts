import Constants from "expo-constants";
import { storage } from "../../lib/storage";

/**
 * AI API keys: bundled at build time from .env (via app.config.js `extra.ai`)
 * with runtime overrides stored in MMKV (in-app Provider Settings screen).
 */
const OVERRIDES_KEY = "second_brain_v1_aiKeys";

type KeyMap = Record<string, string>;

const bundled: KeyMap = (() => {
  const extra = (Constants.expoConfig as any)?.extra?.ai;
  return extra && typeof extra === "object" ? extra : {};
})();

function loadOverrides(): KeyMap {
  try {
    const raw = storage.getItem(OVERRIDES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore parse errors
  }
  return {};
}

function saveOverrides(map: KeyMap) {
  storage.setItem(OVERRIDES_KEY, JSON.stringify(map));
}

export function getApiKey(name: string): string {
  const overrides = loadOverrides();
  const value = overrides[name] ?? bundled[name] ?? "";
  return typeof value === "string" ? value.trim() : "";
}

export function setApiKey(name: string, value: string): void {
  const overrides = loadOverrides();
  if (value && value.trim()) {
    overrides[name] = value.trim();
  } else {
    delete overrides[name];
  }
  saveOverrides(overrides);
}

export function clearApiKey(name: string): void {
  const overrides = loadOverrides();
  delete overrides[name];
  saveOverrides(overrides);
}

export function getAllKeyOverrides(): KeyMap {
  return loadOverrides();
}
