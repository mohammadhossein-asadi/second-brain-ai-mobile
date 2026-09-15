import React, { useState, useEffect, useRef } from "react";
import { View, Pressable } from "react-native";
import Markdown from "react-native-markdown-display";
import * as Clipboard from "expo-clipboard";
import * as Speech from "expo-speech";
import {
  Copy,
  Check,
  Bot,
  User,
  Sparkles,
  FastForward,
  Volume2,
  VolumeX,
} from "lucide-react-native";
import { ChatMessage } from "../../types";
import { T } from "../ui/primitives";
import { useThemeColors } from "../../lib/theme";

interface AIChatMessageItemProps {
  message: ChatMessage;
  isLatest: boolean;
  isRTL: boolean;
  onTypingComplete?: () => void;
  onStreamChunk?: () => void;
}

export const AIChatMessageItem: React.FC<AIChatMessageItemProps> = ({
  message,
  isLatest,
  isRTL,
  onTypingComplete,
  onStreamChunk,
}) => {
  const c = useThemeColors();
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Typewriter / token-streaming state
  const [displayedContent, setDisplayedContent] = useState<string>(() => {
    if (isUser || !isLatest) return message.content;
    return "";
  });
  const [isTyping, setIsTyping] = useState<boolean>(() => {
    return !isUser && isLatest;
  });

  const fullContentRef = useRef(message.content);
  fullContentRef.current = message.content;

  // Real-time token streaming
  useEffect(() => {
    if (isUser || !isLatest) {
      setDisplayedContent(message.content);
      setIsTyping(false);
      return;
    }

    if (message.isStreaming) {
      setDisplayedContent(message.content);
      setIsTyping(true);
      onStreamChunk?.();
      return;
    }

    const fullText = message.content;
    if (!fullText) {
      setIsTyping(false);
      return;
    }

    setDisplayedContent(fullText);
    setIsTyping(false);
    onTypingComplete?.();
  }, [message.id, message.content, message.isStreaming, isLatest, isUser]);

  const handleSkipTyping = () => {
    setDisplayedContent(message.content);
    setIsTyping(false);
    onTypingComplete?.();
  };

  const handleCopyMessage = async () => {
    try {
      await Clipboard.setStringAsync(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  const handleCopyCode = async (codeText: string, codeId: string) => {
    try {
      await Clipboard.setStringAsync(codeText);
      setCopiedCodeId(codeId);
      setTimeout(() => setCopiedCodeId(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    Speech.speak(message.content, {
      language: isRTL ? "fa-IR" : "en-US",
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const markdownStyles = {
    body: { color: c.textSecondary, fontSize: 13 },
    paragraph: { marginTop: 0, marginBottom: 8, color: c.textSecondary, lineHeight: 20 },
    strong: { color: c.textPrimary, fontWeight: "700" as const },
    em: { fontStyle: "italic" as const },
    heading1: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: c.textPrimary,
      marginTop: 12,
      marginBottom: 6,
      borderBottomWidth: 1,
      borderBottomColor: c.borderSubtle,
      paddingBottom: 4,
    },
    heading2: { fontSize: 14, fontWeight: "700" as const, color: "#60a5fa", marginTop: 10, marginBottom: 4 },
    heading3: { fontSize: 12, fontWeight: "700" as const, color: c.textPrimary, marginTop: 8, marginBottom: 4 },
    bullet_list: { marginTop: 6, marginBottom: 6 },
    ordered_list: { marginTop: 6, marginBottom: 6 },
    bullet_list_icon: { color: "#60a5fa" },
    blockquote: {
      backgroundColor: "rgba(59,130,246,0.06)",
      borderLeftWidth: 3,
      borderLeftColor: "#3b82f6",
      paddingHorizontal: 10,
      paddingVertical: 4,
      marginVertical: 8,
    },
    code_inline: {
      backgroundColor: "#171717",
      color: "#93c5fd",
      fontFamily: "monospace",
      fontSize: 11,
    },
    fence: {
      backgroundColor: "#0a0a0a",
      borderColor: "#262626",
      borderWidth: 1,
      color: "#93c5fd",
      fontFamily: "monospace",
      fontSize: 11,
    },
    link: { color: "#60a5fa" },
    hr: { backgroundColor: c.borderSubtle, marginVertical: 12 },
  };

  if (isUser) {
    return (
      <View style={{ alignItems: "flex-end", gap: 4 }}>
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "flex-end", gap: 8, maxWidth: "85%" }}>
          <View
            className="rounded-2xl px-4 py-3"
            style={{
              backgroundColor: "#2563eb",
              borderBottomRightRadius: 4,
              maxWidth: "100%",
            }}
          >
            <T style={{ fontSize: 13, color: "#ffffff", lineHeight: 20 }}>{message.content}</T>
          </View>
          <View
            className="h-7 w-7 items-center justify-center rounded-xl border bg-blue-500/20"
            style={{ borderColor: "rgba(59,130,246,0.3)" }}
          >
            <User size={16} color="#3b82f6" />
          </View>
        </View>
        <T style={{ fontSize: 10, color: "#737373", paddingHorizontal: 36 }}>{message.timestamp}</T>
      </View>
    );
  }

  return (
    <View style={{ alignItems: "flex-start", gap: 4 }}>
      <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "flex-start", gap: 10, maxWidth: "95%", width: "95%" }}>
        {/* Assistant Avatar */}
        <View
          className="h-8 w-8 items-center justify-center rounded-2xl border bg-blue-500/20"
          style={{ borderColor: "rgba(59,130,246,0.3)", marginTop: 2 }}
        >
          <Bot size={16} color="#3b82f6" />
        </View>

        {/* Message Bubble with Markdown */}
        <View
          className="flex-1 rounded-2xl border p-4"
          style={{
            backgroundColor: c.bgSurface,
            borderColor: c.borderColor,
            borderTopLeftRadius: 4,
          }}
        >
          {!displayedContent && message.isStreaming ? (
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 10, paddingVertical: 4 }}>
              <View style={{ flexDirection: "row", gap: 6 }}>
                <View style={{ height: 8, width: 8, borderRadius: 4, backgroundColor: "#3b82f6" }} />
                <View style={{ height: 8, width: 8, borderRadius: 4, backgroundColor: "#3b82f6", opacity: 0.7 }} />
                <View style={{ height: 8, width: 8, borderRadius: 4, backgroundColor: "#3b82f6", opacity: 0.4 }} />
              </View>
              <T style={{ fontSize: 12, color: c.textMuted }}>
                {isRTL ? "در حال نوشتن پاسخ..." : "Generating response..."}
              </T>
            </View>
          ) : (
            <>
              <Markdown style={markdownStyles}>{displayedContent}</Markdown>

              {/* Active blinking cursor */}
              {(isTyping || message.isStreaming) && (
                <View style={{ height: 14, width: 6, backgroundColor: "#3b82f6", borderRadius: 2, marginTop: 4, opacity: 0.8 }} />
              )}
            </>
          )}

          {/* Footer controls & Provenance badge */}
          <View
            style={{
              marginTop: 12,
              paddingTop: 10,
              borderTopWidth: 1,
              borderTopColor: c.borderSubtle,
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4 }}>
                <Sparkles size={12} color="#3b82f6" />
                <T style={{ fontSize: 11, color: "#3b82f6" }}>{message.provider || "Gemini"}</T>
              </View>
              {message.model ? (
                <T style={{ fontSize: 10, color: c.textSubtle }}>· {message.model}</T>
              ) : null}
            </View>

            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
              {isTyping ? (
                <Pressable
                  onPress={handleSkipTyping}
                  style={({ pressed }) => ({
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    gap: 4,
                    borderRadius: 8,
                    backgroundColor: c.bgElevated,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <FastForward size={12} color="#3b82f6" />
                  <T style={{ fontSize: 10, color: c.textSecondary }}>
                    {isRTL ? "پرش به انتها" : "Skip"}
                  </T>
                </Pressable>
              ) : (
                <>
                  <Pressable
                    onPress={handleToggleSpeak}
                    style={({ pressed }) => ({
                      flexDirection: isRTL ? "row-reverse" : "row",
                      alignItems: "center",
                      gap: 4,
                      borderRadius: 8,
                      backgroundColor: pressed ? c.bgHover : "transparent",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                    })}
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX size={12} color="#f43f5e" />
                        <T style={{ fontSize: 10, color: "#f43f5e" }}>{isRTL ? "توقف" : "Stop"}</T>
                      </>
                    ) : (
                      <>
                        <Volume2 size={12} color={c.textMuted} />
                        <T style={{ fontSize: 10, color: c.textMuted }}>{isRTL ? "صدا" : "Read"}</T>
                      </>
                    )}
                  </Pressable>

                  <Pressable
                    onPress={handleCopyMessage}
                    style={({ pressed }) => ({
                      flexDirection: isRTL ? "row-reverse" : "row",
                      alignItems: "center",
                      gap: 4,
                      borderRadius: 8,
                      backgroundColor: pressed ? c.bgHover : "transparent",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                    })}
                  >
                    {copied ? (
                      <>
                        <Check size={12} color="#3b82f6" />
                        <T style={{ fontSize: 10, color: "#3b82f6" }}>{isRTL ? "کپی شد" : "Copied"}</T>
                      </>
                    ) : (
                      <>
                        <Copy size={12} color={c.textMuted} />
                        <T style={{ fontSize: 10, color: c.textMuted }}>{isRTL ? "کپی" : "Copy"}</T>
                      </>
                    )}
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </View>
      </View>
      <T style={{ fontSize: 10, color: "#737373", paddingLeft: isRTL ? 0 : 44, paddingRight: isRTL ? 44 : 0 }}>
        {message.timestamp}
      </T>
    </View>
  );
};
