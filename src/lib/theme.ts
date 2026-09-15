import { useSecondBrain } from "../context/SecondBrainContext";

/** Concrete theme token values, mirroring the web app's CSS custom properties. */
export interface ThemeColors {
  bgMain: string;
  bgSurface: string;
  bgElevated: string;
  bgSubtle: string;
  bgHover: string;
  cardSurface: string;
  cardHover: string;
  borderColor: string;
  borderSubtle: string;
  borderHover: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textSubtle: string;
  navbarBg: string;
  navbarBorder: string;
  navbarBtnBg: string;
  navbarBtnBorder: string;
  navbarBtnText: string;
  sidebarBg: string;
  sidebarBorder: string;
  sidebarItemText: string;
  sidebarItemActiveText: string;
  accentBlue: string;
  accentBlueSubtle: string;
  accentEmerald: string;
  accentEmeraldSubtle: string;
}

export const lightColors: ThemeColors = {
  bgMain: "#f8fafc",
  bgSurface: "#ffffff",
  bgElevated: "#f1f5f9",
  bgSubtle: "#f8fafc",
  bgHover: "#e2e8f0",
  cardSurface: "#ffffff",
  cardHover: "#f8fafc",
  borderColor: "#e2e8f0",
  borderSubtle: "#f1f5f9",
  borderHover: "#cbd5e1",
  textPrimary: "#0f172a",
  textSecondary: "#334155",
  textMuted: "#64748b",
  textSubtle: "#94a3b8",
  navbarBg: "rgba(255, 255, 255, 0.95)",
  navbarBorder: "#e2e8f0",
  navbarBtnBg: "#ffffff",
  navbarBtnBorder: "#e2e8f0",
  navbarBtnText: "#334155",
  sidebarBg: "#ffffff",
  sidebarBorder: "#e2e8f0",
  sidebarItemText: "#475569",
  sidebarItemActiveText: "#0f172a",
  accentBlue: "#2563eb",
  accentBlueSubtle: "rgba(37, 99, 235, 0.1)",
  accentEmerald: "#2563eb",
  accentEmeraldSubtle: "rgba(37, 99, 235, 0.1)",
};

export const darkColors: ThemeColors = {
  bgMain: "#0a0e17",
  bgSurface: "#111827",
  bgElevated: "#1a2234",
  bgSubtle: "#131b2e",
  bgHover: "#1f293d",
  cardSurface: "#111827",
  cardHover: "#1a2234",
  borderColor: "#1f293d",
  borderSubtle: "#172033",
  borderHover: "#334155",
  textPrimary: "#f8fafc",
  textSecondary: "#cbd5e1",
  textMuted: "#94a3b8",
  textSubtle: "#64748b",
  navbarBg: "rgba(10, 14, 23, 0.95)",
  navbarBorder: "#1f293d",
  navbarBtnBg: "#151d2e",
  navbarBtnBorder: "#1f293d",
  navbarBtnText: "#cbd5e1",
  sidebarBg: "#0d121d",
  sidebarBorder: "#1f293d",
  sidebarItemText: "#94a3b8",
  sidebarItemActiveText: "#ffffff",
  accentBlue: "#3b82f6",
  accentBlueSubtle: "rgba(59, 130, 246, 0.15)",
  accentEmerald: "#3b82f6",
  accentEmeraldSubtle: "rgba(59, 130, 246, 0.15)",
};

export function useThemeColors(): ThemeColors {
  const { theme } = useSecondBrain();
  return theme === "dark" ? darkColors : lightColors;
}

/** Modal chrome is always dark on the web app — kept faithful here. */
export const modalColors = {
  backdrop: "rgba(0,0,0,0.75)",
  surface: "#0a0a0a",
  border: "#262626",
  text: "#e5e5e5",
  textMuted: "#a3a3a3",
  textSubtle: "#737373",
  innerBg: "#171717",
  border800: "#262626",
  accentCyan: "#22d3ee",
};
