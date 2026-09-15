import React from "react";
import { View, ViewStyle } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useSecondBrain } from "../../context/SecondBrainContext";

interface CircularProgressProps {
  progress: number; // 0 to 100
  size?: number; // diameter in pixels
  strokeWidth?: number; // thickness in pixels
  strokeColor?: string; // tailwind text-color class or concrete color
  trackColor?: string; // tailwind text-color class or concrete color
  className?: string;
  style?: ViewStyle;
  children?: React.ReactNode;
}

/** Maps the web app's tailwind text-color classes to concrete hex values for SVG strokes. */
const TAILWIND_TEXT_COLORS: Record<string, string> = {
  "text-blue-300": "#93c5fd",
  "text-blue-400": "#60a5fa",
  "text-blue-500": "#3b82f6",
  "text-blue-600": "#2563eb",
  "text-emerald-400": "#34d399",
  "text-emerald-500": "#10b981",
  "text-emerald-600": "#059669",
  "text-rose-400": "#fb7185",
  "text-rose-500": "#f43f5e",
  "text-amber-400": "#fbbf24",
  "text-amber-500": "#f59e0b",
  "text-sky-400": "#38bdf8",
  "text-sky-500": "#0ea5e9",
  "text-slate-200": "#e2e8f0",
  "text-slate-300": "#cbd5e1",
  "text-neutral-600": "#525252",
  "text-neutral-700": "#404040",
  "text-neutral-800": "#262629",
};

function resolveStrokeColor(
  colorValue: string | undefined,
  isDark: boolean,
  fallback: string
): string {
  if (!colorValue) return fallback;
  if (colorValue.startsWith("#") || colorValue.startsWith("rgb") || colorValue.startsWith("hsl")) {
    return colorValue;
  }
  const tokens = colorValue.split(/\s+/).filter(Boolean);
  const darkToken = tokens.find((t) => t.startsWith("dark:"));
  const lightToken = tokens.find((t) => !t.startsWith("dark:"));
  const token = (isDark ? darkToken || lightToken : lightToken || darkToken)?.replace(/^dark:/, "");
  return (token && TAILWIND_TEXT_COLORS[token]) || fallback;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 44,
  strokeWidth = 3.5,
  strokeColor,
  trackColor,
  className,
  style,
  children,
}) => {
  const { theme } = useSecondBrain();
  const isDark = theme === "dark";

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  const stroke = resolveStrokeColor(strokeColor, isDark, "#3b82f6");
  const track = resolveStrokeColor(trackColor, isDark, isDark ? "#262629" : "#e2e8f0");

  return (
    <View
      className={className}
      style={[
        {
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: [{ rotate: "-90deg" }] }}
      >
        {/* Background track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={track}
          strokeWidth={strokeWidth}
        />
        {/* Progress stroke with rounded ends */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      {children != null && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </View>
      )}
    </View>
  );
};
