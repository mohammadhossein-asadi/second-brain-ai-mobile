import React, { Component, ErrorInfo, ReactNode } from "react";
import { Platform, Pressable, ScrollView, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import {
  AlertTriangle,
  RotateCcw,
  Home,
  Copy,
  Check,
  Download,
} from "lucide-react-native";
import { storage, mmkv } from "../../lib/storage";
import { writeAndShareFile, backupFilename } from "../../lib/files";
import { T, TBold } from "./primitives";

const MONO_FONT = Platform.select({ ios: "Menlo", android: "monospace", default: undefined });

interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  isRTL?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isCopied: boolean;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
    isCopied: false,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error, errorInfo });
    // Log error for development diagnostics
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isCopied: false,
      showDetails: false,
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleReturnToDashboard = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isCopied: false,
      showDetails: false,
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
    // On native the onReset prop navigates back to the dashboard
    // (the web's window CustomEvent dispatch has no equivalent here).
  };

  private handleCopyError = async (): Promise<void> => {
    const errorText = `Second Brain Error Report:\n\nMessage: ${this.state.error?.message || "Unknown error"}\n\nStack:\n${this.state.error?.stack || "No stack available"}\n\nComponent Stack:\n${this.state.errorInfo?.componentStack || "No component stack"}`;
    try {
      await Clipboard.setStringAsync(errorText);
      this.setState({ isCopied: true });
      setTimeout(() => this.setState({ isCopied: false }), 2500);
    } catch {
      // Fallback
    }
  };

  private handleEmergencyBackup = async (): Promise<void> => {
    try {
      // Gather all storage keys related to the second brain
      const backup: Record<string, unknown> = {};
      const keys = mmkv.getAllKeys();
      for (const key of keys) {
        if (key.startsWith("second_brain_") || key.includes("brain")) {
          const raw = mmkv.getString(key) ?? "";
          try {
            backup[key] = JSON.parse(raw);
          } catch {
            backup[key] = raw;
          }
        }
      }
      const jsonString = JSON.stringify(backup, null, 2);
      // Persist the emergency snapshot so it survives even if the share sheet is cancelled
      storage.setItem("second_brain_emergency_backup", jsonString);
      await writeAndShareFile(
        jsonString,
        backupFilename("second-brain-emergency", "json"),
        "application/json"
      );
    } catch (e) {
      console.error("Emergency backup failed", e);
    }
  };

  private renderActionButton({
    onPress,
    icon,
    label,
    bg,
    borderColor,
    labelColor,
  }: {
    onPress: () => void;
    icon: ReactNode;
    label: string;
    bg: string;
    borderColor: string;
    labelColor: string;
  }): ReactNode {
    const { isRTL } = this.props;
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          flexDirection: isRTL ? "row-reverse" : "row",
          alignItems: "center",
          gap: 6,
          borderRadius: 12,
          backgroundColor: bg,
          borderWidth: 1,
          borderColor,
          paddingHorizontal: 14,
          paddingVertical: 10,
          minHeight: 40,
          opacity: pressed ? 0.8 : 1,
        })}
      >
        {icon}
        <T style={{ fontSize: 12, fontWeight: "600", color: labelColor }}>{label}</T>
      </Pressable>
    );
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isRTL = this.props.isRTL ?? false;
      const { error } = this.state;

      return (
        <View
          style={{
            minHeight: 420,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: 560,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: "rgba(244,63,94,0.2)",
              backgroundColor: "#0d0f14",
              padding: 24,
              alignItems: "center",
              gap: 20,
            }}
          >
            {/* Warning Icon */}
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: "rgba(244,63,94,0.1)",
                borderWidth: 1,
                borderColor: "rgba(244,63,94,0.3)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AlertTriangle size={28} color="#fb7185" />
            </View>

            {/* Error Message */}
            <View style={{ alignItems: "center", gap: 8 }}>
              <TBold style={{ fontSize: 16, color: "#ffffff", textAlign: "center" }}>
                {isRTL ? "خطایی در نمایش این بخش رخ داد" : "Something went wrong in this section"}
              </TBold>
              <T
                style={{
                  fontSize: 12,
                  color: "#a3a3a3",
                  textAlign: "center",
                  lineHeight: 18,
                  maxWidth: 420,
                }}
              >
                {isRTL
                  ? "اطلاعات شما کاملاً امن است و در حافظه محلی ذخیره شده است. می‌توانید مجدداً تلاش کنید یا به صفحه پیشخوان بازگردید."
                  : "Your data is completely safe and stored locally. You can reload this view or return to the dashboard."}
              </T>
            </View>

            {/* Action Buttons */}
            <View
              style={{
                flexDirection: isRTL ? "row-reverse" : "row",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                width: "100%",
              }}
            >
              {this.renderActionButton({
                onPress: this.handleReset,
                icon: <RotateCcw size={16} color="#ffffff" />,
                label: isRTL ? "تلاش مجدد" : "Try Again",
                bg: "#2563eb",
                borderColor: "transparent",
                labelColor: "#ffffff",
              })}

              {this.renderActionButton({
                onPress: this.handleReturnToDashboard,
                icon: <Home size={16} color="#60a5fa" />,
                label: isRTL ? "بازگشت به پیشخوان" : "Dashboard",
                bg: "#171717",
                borderColor: "#3f3f46",
                labelColor: "#e5e5e5",
              })}

              {this.renderActionButton({
                onPress: this.handleEmergencyBackup,
                icon: <Download size={16} color="#fbbf24" />,
                label: isRTL ? "پشتیبان اضطراری" : "Backup",
                bg: "#0a0a0a",
                borderColor: "#262626",
                labelColor: "#d4d4d4",
              })}

              {this.renderActionButton({
                onPress: this.handleCopyError,
                icon:
                  this.state.isCopied ? (
                    <Check size={14} color="#34d399" />
                  ) : (
                    <Copy size={14} color="#a3a3a3" />
                  ),
                label: this.state.isCopied
                  ? isRTL
                    ? "کپی شد"
                    : "Copied"
                  : isRTL
                  ? "گزارش خطا"
                  : "Copy Log",
                bg: "#0a0a0a",
                borderColor: "#262626",
                labelColor: this.state.isCopied ? "#34d399" : "#a3a3a3",
              })}
            </View>

            {/* Collapsible Technical Details */}
            {error && (
              <View
                style={{
                  marginTop: 4,
                  width: "100%",
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: "rgba(38,38,38,0.8)",
                  backgroundColor: "rgba(10,10,10,0.6)",
                  padding: 12,
                }}
              >
                <Pressable
                  onPress={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <T
                    style={{
                      fontFamily: MONO_FONT,
                      fontSize: 11,
                      color: "#737373",
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {isRTL
                      ? "مشاهده جزئیات فنی خطا (برای توسعه‌دهندگان)"
                      : "View technical error details"}
                  </T>
                </Pressable>
                {this.state.showDetails && (
                  <ScrollView
                    style={{ marginTop: 8, maxHeight: 160 }}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator
                  >
                    <View
                      style={{
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: "#262626",
                        backgroundColor: "#0a0a0a",
                        padding: 8,
                        gap: 8,
                      }}
                    >
                      <TBold
                        style={{
                          fontFamily: MONO_FONT,
                          fontSize: 11,
                          color: "rgba(253,164,175,0.8)",
                        }}
                      >
                        {error.name}: {error.message}
                      </TBold>
                      {error.stack ? (
                        <T
                          style={{
                            fontFamily: MONO_FONT,
                            fontSize: 10,
                            color: "#737373",
                          }}
                        >
                          {error.stack}
                        </T>
                      ) : null}
                    </View>
                  </ScrollView>
                )}
              </View>
            )}
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
