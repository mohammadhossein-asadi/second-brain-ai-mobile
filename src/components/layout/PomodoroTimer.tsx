import React, { useState, useEffect, useRef } from "react";
import { View, Pressable } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Play, Pause, RotateCcw, Timer, CheckCircle2 } from "lucide-react-native";
import { useSecondBrain } from "../../context/SecondBrainContext";
import { T } from "../ui/primitives";
import { useThemeColors } from "../../lib/theme";
import { storage } from "../../lib/storage";
import * as Haptics from "expo-haptics";

interface PomodoroTimerProps {
  isCollapsed?: boolean;
}

type PomodoroMode = "focus" | "shortBreak" | "longBreak";

const MODE_DURATIONS: Record<PomodoroMode, number> = {
  focus: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
};

// Haptic + notification feedback chime replacement for Web Audio
function playCompletionChime() {
  try {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // haptics unavailable
  }
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ isCollapsed = false }) => {
  const { isRTL, showToast } = useSecondBrain();
  const c = useThemeColors();
  const [mode, setMode] = useState<PomodoroMode>("focus");
  const [timeLeft, setTimeLeft] = useState<number>(MODE_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(() => {
    const stored = storage.getItem("sb_pomodoro_sessions");
    return stored ? parseInt(stored, 10) : 0;
  });

  const timerRef = useRef<any>(null);

  // Switch mode handler
  const switchMode = (newMode: PomodoroMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODE_DURATIONS[newMode]);
  };

  // Reset timer
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(MODE_DURATIONS[mode]);
  };

  // Toggle start/pause
  const togglePlayPause = () => {
    setIsRunning((prev) => !prev);
  };

  // Ticking effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            playCompletionChime();

            if (mode === "focus") {
              const updated = completedSessions + 1;
              setCompletedSessions(updated);
              storage.setItem("sb_pomodoro_sessions", updated.toString());

              showToast(
                isRTL
                  ? "جلسه تمرکز ۲۵ دقیقه‌ای با موفقیت تمام شد! وقت استراحت کوتاه است."
                  : "Focus session completed! Great work, time for a short break.",
                "success",
                isRTL ? "پومودورو" : "Pomodoro"
              );
              if (updated % 4 === 0) {
                setMode("longBreak");
                return MODE_DURATIONS.longBreak;
              } else {
                setMode("shortBreak");
                return MODE_DURATIONS.shortBreak;
              }
            } else {
              showToast(
                isRTL
                  ? "زمان استراحت پایان یافت! برای شروع جلسه تمرکز بعدی آماده‌اید؟"
                  : "Break ended! Ready to start the next focus sprint?",
                "info",
                isRTL ? "پومودورو" : "Pomodoro"
              );
              setMode("focus");
              return MODE_DURATIONS.focus;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, completedSessions, isRTL, showToast]);

  const totalDuration = MODE_DURATIONS[mode];
  const progressPercent = Math.round(((totalDuration - timeLeft) / totalDuration) * 100);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  // Mini circular progress for collapsed mode
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (progressPercent / 100) * circumference;

  if (isCollapsed) {
    return (
      <View style={{ alignItems: "center", justifyContent: "center", padding: 8 }}>
        <Pressable
          onPress={togglePlayPause}
          style={({ pressed }) => ({
            position: "relative",
            height: 44,
            width: 44,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 16,
            backgroundColor: c.bgElevated,
            borderWidth: 1,
            borderColor: c.borderColor,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Svg
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, transform: [{ rotate: "-90deg" }] }}
            height={44}
            width={44}
            viewBox="0 0 38 38"
          >
            <Circle cx="19" cy="19" r={radius} fill="none" stroke={c.textSubtle} strokeWidth="2.5" />
            <Circle
              cx="19"
              cy="19"
              r={radius}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
            />
          </Svg>
          {isRunning ? (
            <Pause size={16} color="#3b82f6" />
          ) : (
            <Play size={16} color={c.textMuted} />
          )}
        </Pressable>
      </View>
    );
  }

  return (
    <View
      style={{
        marginHorizontal: 8,
        marginVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: c.borderColor,
        backgroundColor: c.bgElevated,
        padding: 12,
      }}
    >
      {/* Timer Header */}
      <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
          <Timer size={14} color="#3b82f6" />
          <T style={{ fontSize: 12, fontWeight: "700", color: c.textPrimary }}>
            {isRTL ? "تمرکز پومودورو" : "Pomodoro Focus"}
          </T>
        </View>
        <View
          style={{
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            gap: 4,
            borderRadius: 999,
            backgroundColor: "rgba(59,130,246,0.15)",
            borderWidth: 1,
            borderColor: "rgba(59,130,246,0.2)",
            paddingHorizontal: 8,
            paddingVertical: 2,
          }}
        >
          <CheckCircle2 size={10} color="#3b82f6" />
          <T style={{ fontSize: 10, fontWeight: "700", color: "#3b82f6" }}>{completedSessions}</T>
        </View>
      </View>

      {/* Mode Selector Tabs */}
      <View
        style={{
          flexDirection: "row",
          gap: 4,
          borderRadius: 12,
          backgroundColor: c.bgSubtle,
          padding: 4,
          marginBottom: 10,
        }}
      >
        {(
          [
            { id: "focus" as PomodoroMode, label: isRTL ? "تمرکز" : "Focus", active: "#3b82f6" },
            { id: "shortBreak" as PomodoroMode, label: isRTL ? "استراحت" : "Break", active: "#0ea5e9" },
            { id: "longBreak" as PomodoroMode, label: isRTL ? "طولانی" : "Long", active: "#6366f1" },
          ]
        ).map((m) => (
          <Pressable
            key={m.id}
            onPress={() => switchMode(m.id)}
            style={({ pressed }) => ({
              flex: 1,
              borderRadius: 8,
              paddingVertical: 4,
              alignItems: "center",
              borderWidth: 1,
              borderColor: mode === m.id ? c.borderColor : "transparent",
              backgroundColor: mode === m.id ? c.bgSurface : "transparent",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <T style={{ fontSize: 10, fontWeight: mode === m.id ? "700" : "500", color: mode === m.id ? m.active : c.textMuted }}>
              {m.label}
            </T>
          </Pressable>
        ))}
      </View>

      {/* Digital Countdown & Controls */}
      <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 8, paddingVertical: 4 }}>
        <View>
          <T style={{ fontSize: 24, fontWeight: "900", color: c.textPrimary, fontVariant: ["tabular-nums"] }}>
            {timeFormatted}
          </T>
          <T style={{ fontSize: 10, color: c.textMuted }}>
            {mode === "focus"
              ? isRTL
                ? "۲۵ دقیقه تمرکز خالص"
                : "25 min focus sprint"
              : isRTL
              ? "زمان تجدید قوا"
              : "Recharge & breathe"}
          </T>
        </View>

        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
          <Pressable
            onPress={togglePlayPause}
            style={({ pressed }) => ({
              height: 36,
              width: 36,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 12,
              backgroundColor: isRunning ? "#f59e0b" : "#2563eb",
              opacity: pressed ? 0.85 : 1,
            })}
          >
            {isRunning ? (
              <Pause size={16} color="#171717" />
            ) : (
              <Play size={16} color="#ffffff" />
            )}
          </Pressable>

          <Pressable
            onPress={handleReset}
            style={({ pressed }) => ({
              height: 36,
              width: 36,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: c.borderColor,
              backgroundColor: c.bgSurface,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <RotateCcw size={14} color={c.textSecondary} />
          </Pressable>
        </View>
      </View>

      {/* Thin progress bar */}
      <View style={{ marginTop: 8, height: 6, width: "100%", borderRadius: 999, backgroundColor: c.bgSubtle, overflow: "hidden" }}>
        <View
          style={{
            height: "100%",
            borderRadius: 999,
            backgroundColor:
              mode === "focus" ? "#3b82f6" : mode === "shortBreak" ? "#0ea5e9" : "#6366f1",
            width: `${progressPercent}%`,
          }}
        />
      </View>
    </View>
  );
};
