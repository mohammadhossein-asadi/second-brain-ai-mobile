import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CheckCircle2,
  Info,
  AlertTriangle,
  AlertCircle,
  X,
} from "lucide-react-native";
import { useAppStore } from "../../context/AppContext";
import { useThemeColors } from "../../lib/theme";
import { T, TBold } from "./primitives";
import { Toast, ToastType } from "../../types";

const TOAST_TYPE_COLORS: Record<ToastType, { icon: string; border: string; bar: string }> = {
  success: { icon: "#3b82f6", border: "rgba(59,130,246,0.3)", bar: "#3b82f6" },
  warning: { icon: "#f59e0b", border: "rgba(245,158,11,0.3)", bar: "#f59e0b" },
  error: { icon: "#f43f5e", border: "rgba(244,63,94,0.3)", bar: "#f43f5e" },
  info: { icon: "#0ea5e9", border: "rgba(14,165,233,0.3)", bar: "#0ea5e9" },
};

function getToastIcon(type?: ToastType) {
  const color = TOAST_TYPE_COLORS[type || "info"].icon;
  switch (type) {
    case "success":
      return <CheckCircle2 size={20} color={color} />;
    case "warning":
      return <AlertTriangle size={20} color={color} />;
    case "error":
      return <AlertCircle size={20} color={color} />;
    case "info":
    default:
      return <Info size={20} color={color} />;
  }
}

const ToastItem: React.FC<{ toast: Toast; isDark: boolean; onDismiss: (id: string) => void }> = ({
  toast,
  isDark,
  onDismiss,
}) => {
  const c = useThemeColors();
  const typeColors = TOAST_TYPE_COLORS[toast.type || "info"];
  const barAnim = useRef(new Animated.Value(1)).current;
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    if (barWidth <= 0) return;
    const anim = Animated.timing(barAnim, {
      toValue: 0,
      duration: toast.duration || 3500,
      easing: Easing.linear,
      useNativeDriver: false,
    });
    anim.start();
    return () => anim.stop();
  }, [barWidth, barAnim, toast.duration]);

  return (
    <View
      style={{
        width: "100%",
        maxWidth: 384,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: typeColors.border,
        backgroundColor: isDark ? "rgba(23,23,23,0.95)" : "rgba(255,255,255,0.95)",
        padding: 16,
        overflow: "hidden",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
        <View style={{ paddingTop: 2 }}>{getToastIcon(toast.type)}</View>

        <View style={{ flex: 1, minWidth: 0 }}>
          {toast.title ? (
            <TBold
              style={{
                fontSize: 12,
                color: c.textPrimary,
                marginBottom: 2,
              }}
              numberOfLines={1}
            >
              {toast.title}
            </TBold>
          ) : null}
          <T style={{ fontSize: 12, color: c.textSecondary, lineHeight: 18 }}>
            {toast.message}
          </T>
        </View>

        <Pressable
          onPress={() => onDismiss(toast.id)}
          hitSlop={6}
          style={({ pressed }) => ({
            width: 32,
            height: 32,
            flexShrink: 0,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <X size={16} color={c.textMuted} />
        </Pressable>
      </View>

      {/* Subtle animated progress timer indicator */}
      <View
        onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2 }}
      >
        <Animated.View
          style={{
            height: 2,
            borderRadius: 1,
            backgroundColor: typeColors.bar,
            width: barAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, barWidth],
            }),
          }}
        />
      </View>
    </View>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast, isRTL, theme } = useAppStore();
  const insets = useSafeAreaInsets();

  // Deduplicate toasts by ID and message content to guarantee single-rendering
  const uniqueToasts = useMemo(() => {
    const seenIds = new Set<string>();
    const seenMessages = new Set<string>();
    return toasts.filter((toast) => {
      if (seenIds.has(toast.id)) return false;
      if (seenMessages.has(toast.message)) return false;
      seenIds.add(toast.id);
      seenMessages.add(toast.message);
      return true;
    });
  }, [toasts]);

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        top: insets.top + 8,
        left: 0,
        right: 0,
        zIndex: 50,
        elevation: 50,
        paddingHorizontal: 16,
        gap: 10,
        alignItems: isRTL ? "flex-start" : "flex-end",
      }}
    >
      {uniqueToasts.map((toast: Toast) => (
        <ToastItem key={toast.id} toast={toast} isDark={theme === "dark"} onDismiss={dismissToast} />
      ))}
    </View>
  );
};
