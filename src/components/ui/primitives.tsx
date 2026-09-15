import React from "react";
import {
  View,
  Text as RNText,
  TextInput as RNTextInput,
  Pressable,
  ActivityIndicator,
  Modal as RNModal,
  Switch as RNSwitch,
  ScrollView as RNScrollView,
  ViewStyle,
  ScrollViewProps,
  TextInputProps,
  TextProps,
} from "react-native";
import { useSecondBrain } from "../../context/SecondBrainContext";
import { useThemeColors, ThemeColors } from "../../lib/theme";

// ---------------------------------------------------------------------------
// T — Text with automatic font family + writing direction
// ---------------------------------------------------------------------------

export function T({ style, ...props }: TextProps) {
  const { isRTL, language } = useSecondBrain();
  const c = useThemeColors();
  return (
    <RNText
      style={[
        {
          fontFamily: language === "fa" ? "Vazirmatn" : undefined,
          writingDirection: isRTL ? "rtl" : "ltr",
          color: c.textPrimary,
        },
        style,
      ]}
      {...props}
    />
  );
}

export function TBold({ style, ...props }: TextProps) {
  const { language } = useSecondBrain();
  return (
    <T
      style={[language === "fa" ? { fontFamily: "Vazirmatn-SemiBold" } : { fontWeight: "700" }, style]}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// Input / TextArea
// ---------------------------------------------------------------------------

export function Input({ style, ...props }: TextInputProps) {
  const { isRTL, language } = useSecondBrain();
  const c = useThemeColors();
  return (
    <RNTextInput
      style={[
        {
          fontFamily: language === "fa" ? "Vazirmatn" : undefined,
          color: c.textPrimary,
          textAlign: isRTL ? "right" : "left",
        },
        style,
      ]}
      placeholderTextColor={c.textMuted}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// Btn — pressable button with variants
// ---------------------------------------------------------------------------

type BtnVariant = "primary" | "success" | "danger" | "outline" | "ghost" | "neutral";

const BTN_VARIANTS: Record<BtnVariant, { bg: string; text: string; border: string }> = {
  primary: { bg: "#2563eb", text: "#ffffff", border: "transparent" },
  success: { bg: "#059669", text: "#ffffff", border: "transparent" },
  danger: { bg: "#e11d48", text: "#ffffff", border: "transparent" },
  outline: { bg: "transparent", text: "#334155", border: "#e2e8f0" },
  ghost: { bg: "transparent", text: "#64748b", border: "transparent" },
  neutral: { bg: "#1a2234", text: "#f8fafc", border: "#1f293d" },
};

export function Btn({
  title,
  onPress,
  variant = "primary",
  disabled,
  loading,
  icon,
  size = "md",
  style,
  fullWidth,
}: {
  title?: string;
  onPress?: () => void;
  variant?: BtnVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  style?: ViewStyle;
  fullWidth?: boolean;
}) {
  const c = useThemeColors();
  const v =
    variant === "outline"
      ? { bg: "transparent", text: c.textSecondary, border: c.borderColor }
      : variant === "ghost"
      ? { bg: "transparent", text: c.textMuted, border: "transparent" }
      : variant === "neutral"
      ? { bg: c.bgElevated, text: c.textPrimary, border: c.borderColor }
      : BTN_VARIANTS[variant];
  const padH = size === "sm" ? 10 : size === "lg" ? 20 : 14;
  const padV = size === "sm" ? 6 : size === "lg" ? 12 : 9;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          borderWidth: v.border === "transparent" ? 0 : 1,
          paddingHorizontal: padH,
          paddingVertical: padV,
          borderRadius: 14,
          opacity: disabled ? 0.4 : pressed ? 0.8 : 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          alignSelf: fullWidth ? "stretch" : "auto",
        },
        style,
      ]}
    >
      {loading ? <ActivityIndicator size="small" color={v.text} /> : icon}
      {title ? (
        <T style={{ color: v.text, fontSize: size === "sm" ? 11 : 13, fontWeight: "600" }}>
          {title}
        </T>
      ) : null}
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// IconBtn — square pressable icon container
// ---------------------------------------------------------------------------

export function IconBtn({
  children,
  onPress,
  className,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={className}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, borderRadius: 12 }, style]}
    >
      {children}
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Select — modal-based dropdown replacing <select>
// ---------------------------------------------------------------------------

export function Select<T extends string | number>({
  value,
  options,
  onChange,
  placeholder,
  style,
}: {
  value: T | undefined;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
  placeholder?: string;
  style?: ViewStyle;
}) {
  const [open, setOpen] = React.useState(false);
  const c = useThemeColors();
  const selected = options.find((opt) => opt.value === value);
  return (
    <View style={style}>
      <Pressable
        onPress={() => setOpen(true)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderWidth: 1,
          borderColor: c.borderColor,
          backgroundColor: c.bgElevated,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 9,
        }}
      >
        <T style={{ color: selected ? c.textPrimary : c.textMuted, fontSize: 12 }}>
          {selected?.label || placeholder || "—"}
        </T>
        <T style={{ color: c.textMuted, fontSize: 10 }}>▾</T>
      </Pressable>
      <RNModal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", padding: 24 }}
          onPress={() => setOpen(false)}
        >
          <Pressable
            style={{
              backgroundColor: c.bgSurface,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: c.borderColor,
              maxHeight: "70%",
            }}
          >
            <RNScrollView>
              {options.map((opt) => (
                <Pressable
                  key={String(opt.value)}
                  onPress={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  style={({ pressed }) => ({
                    paddingHorizontal: 16,
                    paddingVertical: 13,
                    backgroundColor: pressed ? c.bgHover : "transparent",
                    borderBottomWidth: 1,
                    borderBottomColor: c.borderSubtle,
                  })}
                >
                  <T
                    style={{
                      color: opt.value === value ? c.accentBlue : c.textPrimary,
                      fontSize: 13,
                      fontWeight: opt.value === value ? "700" : "400",
                    }}
                  >
                    {opt.label}
                  </T>
                </Pressable>
              ))}
            </RNScrollView>
          </Pressable>
        </Pressable>
      </RNModal>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Toggle
// ---------------------------------------------------------------------------

export function Toggle({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  const c = useThemeColors();
  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ true: c.accentBlue, false: c.bgHover }}
      thumbColor="#ffffff"
    />
  );
}

// ---------------------------------------------------------------------------
// Card / Panel
// ---------------------------------------------------------------------------

export function Card({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}) {
  const c = useThemeColors();
  return (
    <View
      className={className}
      style={[
        {
          backgroundColor: c.cardSurface,
          borderWidth: 1,
          borderColor: c.borderColor,
          borderRadius: 24,
          padding: 16,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

// ---------------------------------------------------------------------------
// ModalShell — full-screen modal wrapper (always-dark chrome, faithful to web)
// ---------------------------------------------------------------------------

export function ModalShell({
  visible,
  onClose,
  children,
  maxWidth = 560,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: number;
}) {
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.75)",
          alignItems: "center",
          justifyContent: "center",
          padding: 14,
        }}
        onPress={onClose}
      >
        <Pressable
          style={{
            width: "100%",
            maxWidth,
            maxHeight: "90%",
            borderRadius: 24,
            borderWidth: 1,
            borderColor: "#1f293d",
            backgroundColor: "#05070d",
            overflow: "hidden",
          }}
          onPress={() => {}}
        >
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------

export function Spinner({ size = 16, color }: { size?: number | "large" | "small"; color?: string }) {
  return <ActivityIndicator size={size} color={color || "#3b82f6"} />;
}

// ---------------------------------------------------------------------------
// ProgressBar
// ---------------------------------------------------------------------------

export function ProgressBar({
  progress,
  color = "#2563eb",
  height = 8,
  trackColor,
  style,
}: {
  progress: number;
  color?: string;
  height?: number;
  trackColor?: string;
  style?: ViewStyle;
}) {
  const c = useThemeColors();
  return (
    <View
      style={[
        { height, backgroundColor: trackColor || c.bgHover, borderRadius: height / 2, overflow: "hidden" },
        style,
      ]}
    >
      <View
        style={{
          width: `${Math.max(0, Math.min(100, progress))}%`,
          height: "100%",
          backgroundColor: color,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// ScrollView with keyboard support
// ---------------------------------------------------------------------------

export function ScrollView({ keyboardShouldPersistTaps = "handled", ...props }: ScrollViewProps) {
  return <RNScrollView keyboardShouldPersistTaps={keyboardShouldPersistTaps} {...props} />;
}
