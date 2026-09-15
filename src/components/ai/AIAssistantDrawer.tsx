import React, { useState, useRef, useEffect, useCallback } from "react";
import { View, Pressable, ScrollView, Modal, TextInput } from "react-native";
import {
  Bot,
  X,
  Send,
  RotateCcw,
  Cpu,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ArrowDown,
} from "lucide-react-native";
import { useAppStore } from "../../context/AppContext";
import { AIChatMessageItem } from "./AIChatMessageItem";
import { T, Input, Select, Spinner } from "../ui/primitives";
import { useThemeColors } from "../../lib/theme";

export const AIAssistantDrawer: React.FC = () => {
  const {
    isAIAssistantOpen,
    setIsAIAssistantOpen,
    chatMessages,
    isChatLoading,
    sendChatMessage,
    clearChatHistory,
    aiProviders,
    selectedAIProvider,
    setSelectedAIProvider,
    githubProfile,
    isRTL,
    t,
    showToast,
  } = useAppStore();
  const c = useThemeColors();

  const [input, setInput] = useState("");
  const [showProviderDetails, setShowProviderDetails] = useState(false);
  const messagesScrollRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (isAIAssistantOpen && messagesScrollRef.current) {
      setTimeout(() => {
        messagesScrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatMessages, isAIAssistantOpen]);

  const handleSend = async (textToSend?: string) => {
    const message = textToSend || input;
    if (!message.trim() || isChatLoading) return;
    setInput("");
    await sendChatMessage(message.trim());
  };

  const handleClearHistory = () => {
    clearChatHistory();
    showToast(
      isRTL ? "تاریخچه چت با هوش مصنوعی پاک شد" : "AI chat history cleared",
      "info"
    );
  };

  const configuredCount = aiProviders.filter((p) => p.isConfigured).length;
  const activeProviderObj = aiProviders.find((p) => p.id === selectedAIProvider);

  const samplePrompts = [
    t.modals.aiAssistant.samplePrompt1,
    t.modals.aiAssistant.samplePrompt2,
    t.modals.aiAssistant.samplePrompt3,
    t.modals.aiAssistant.samplePrompt4,
  ];

  const providerOptions = [
    { value: "auto", label: isRTL ? "✨ هوشمند (پشتیبان خودکار)" : "✨ Auto (smart fallback)" },
    ...aiProviders.map((p) => ({
      value: p.id,
      label: `${p.nameFa || p.name} ${p.isConfigured ? "✓" : "(کلید نیاز است)"}`,
    })),
  ];

  return (
    <Modal
      visible={isAIAssistantOpen}
      transparent
      animationType="slide"
      onRequestClose={() => setIsAIAssistantOpen(false)}
      statusBarTranslucent
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }}>
        <Pressable style={{ flex: 1 }} onPress={() => setIsAIAssistantOpen(false)} />
        <View
          style={{
            height: "92%",
            backgroundColor: "#0a0a0a",
            borderTopWidth: 1,
            borderTopColor: "#262626",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            overflow: "hidden",
          }}
        >
          {/* Drawer Header */}
          <View
            style={{
              height: 64,
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: "#262626",
              paddingHorizontal: 20,
            }}
          >
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 10 }}>
              <View
                className="h-9 w-9 items-center justify-center rounded-2xl border bg-neutral-900"
                style={{ borderColor: "#262626" }}
              >
                <Bot size={20} color="#3b82f6" />
              </View>
              <View>
                <T style={{ fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
                  {t.modals.aiAssistant.title}
                </T>
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6, marginTop: 2 }}>
                  <View style={{ height: 6, width: 6, borderRadius: 3, backgroundColor: "#3b82f6" }} />
                  <T style={{ fontSize: 12, color: "#3b82f6" }}>
                    {configuredCount > 0
                      ? `${configuredCount} ارائه‌دهنده فعال`
                      : t.modals.aiAssistant.connectedState}
                  </T>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 4 }}>
              <Pressable onPress={handleClearHistory} className="rounded-xl p-2">
                <RotateCcw size={16} color="#a3a3a3" />
              </Pressable>
              <Pressable onPress={() => setIsAIAssistantOpen(false)} className="rounded-xl p-2">
                <X size={16} color="#a3a3a3" />
              </Pressable>
            </View>
          </View>

          {/* Provider Selector Strip */}
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "rgba(38,38,38,0.8)",
              backgroundColor: "rgba(23,23,23,0.5)",
              paddingHorizontal: 16,
              paddingVertical: 10,
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8, flex: 1 }}>
              <Cpu size={14} color="#818cf8" />
              <T style={{ fontSize: 12, color: "#a3a3a3" }}>مدل:</T>
              <View style={{ flex: 1, maxWidth: 200 }}>
                <Select
                  value={selectedAIProvider}
                  options={providerOptions}
                  onChange={setSelectedAIProvider}
                />
              </View>
            </View>

            <Pressable
              onPress={() => setShowProviderDetails(!showProviderDetails)}
              style={({ pressed }) => ({
                flexDirection: isRTL ? "row-reverse" : "row",
                alignItems: "center",
                gap: 4,
                borderRadius: 8,
                backgroundColor: "rgba(38,38,38,0.5)",
                paddingHorizontal: 8,
                paddingVertical: 4,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <T style={{ fontSize: 11, color: "#a3a3a3" }}>
                {showProviderDetails ? "بستن" : "وضعیت"}
              </T>
              <ChevronDownIcon rotated={showProviderDetails} />
            </Pressable>
          </View>

          {/* Provider Details Accordion */}
          {showProviderDetails && (
            <View style={{ borderBottomWidth: 1, borderBottomColor: "#262626", backgroundColor: "#171717", padding: 14, gap: 10 }}>
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between" }}>
                <T style={{ fontSize: 12, color: "#d4d4d4", fontWeight: "500" }}>
                  وضعیت اتصال به ارائه‌دهندگان هوش مصنوعی
                </T>
                <View className="rounded-full bg-neutral-800 px-2 py-0.5">
                  <T style={{ fontSize: 11, color: "#a3a3a3" }}>
                    {configuredCount} از {aiProviders.length} متصل
                  </T>
                </View>
              </View>

              <ScrollView style={{ maxHeight: 144 }} nestedScrollEnabled>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                  {aiProviders.map((prov) => (
                    <View
                      key={prov.id}
                      style={{
                        flexDirection: isRTL ? "row-reverse" : "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "48%",
                        padding: 6,
                        borderRadius: 8,
                        borderWidth: 1,
                        backgroundColor: prov.isConfigured ? "rgba(23,37,84,0.2)" : "rgba(10,10,10,0.4)",
                        borderColor: prov.isConfigured ? "rgba(59,130,246,0.4)" : "#262626",
                      }}
                    >
                      <T numberOfLines={1} style={{ fontSize: 11, color: prov.isConfigured ? "#e5e5e5" : "#a3a3a3", flex: 1 }}>
                        {prov.nameFa || prov.name}
                      </T>
                      {prov.isConfigured ? (
                        <CheckCircle2 size={14} color="#3b82f6" />
                      ) : (
                        <AlertCircle size={14} color="#737373" />
                      )}
                    </View>
                  ))}
                </View>
              </ScrollView>

              {githubProfile && (
                <View
                  style={{
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    gap: 8,
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor: "#0a0a0a",
                    borderWidth: 1,
                    borderColor: "#262626",
                  }}
                >
                  <T style={{ fontSize: 11, color: "#d4d4d4" }}>
                    متصل به گیت‌هاب: @{githubProfile.login}
                  </T>
                </View>
              )}
            </View>
          )}

          {/* Messages Area */}
          <ScrollView
            ref={messagesScrollRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 16, gap: 16 }}
          >
            {chatMessages.length === 0 && (
              <View className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
                <T style={{ fontSize: 12, color: "#d4d4d4", lineHeight: 19 }}>
                  {t.modals.aiAssistant.emptyStatePrompt}
                </T>
              </View>
            )}

            {chatMessages.map((msg, idx) => (
              <AIChatMessageItem
                key={msg.id}
                message={msg}
                isLatest={idx === chatMessages.length - 1}
                isRTL={isRTL}
                onStreamChunk={() => {
                  messagesScrollRef.current?.scrollToEnd({ animated: false });
                }}
                onTypingComplete={() =>
                  messagesScrollRef.current?.scrollToEnd({ animated: true })
                }
              />
            ))}

            {isChatLoading && !chatMessages.some((m) => m.role === "assistant" && m.isStreaming) && (
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "flex-start", gap: 10, maxWidth: "85%" }}>
                <View
                  className="h-8 w-8 items-center justify-center rounded-2xl border bg-blue-500/20"
                  style={{ borderColor: "rgba(59,130,246,0.3)" }}
                >
                  <Bot size={16} color="#3b82f6" />
                </View>
                <View
                  className="flex-row items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/90 px-4 py-3"
                  style={{ borderTopLeftRadius: 4 }}
                >
                  <View style={{ flexDirection: "row", gap: 6 }}>
                    <View style={{ height: 8, width: 8, borderRadius: 4, backgroundColor: "#3b82f6" }} />
                    <View style={{ height: 8, width: 8, borderRadius: 4, backgroundColor: "rgba(59,130,246,0.7)" }} />
                    <View style={{ height: 8, width: 8, borderRadius: 4, backgroundColor: "rgba(59,130,246,0.4)" }} />
                  </View>
                  <T style={{ fontSize: 11, color: "#a3a3a3" }}>
                    {isRTL
                      ? `در حال پردازش با ${activeProviderObj?.nameFa || "Gemini"}...`
                      : `Generating response with ${activeProviderObj?.name || "Gemini"}...`}
                  </T>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Quick Prompt Suggestions */}
          <View style={{ borderTopWidth: 1, borderTopColor: "#262626", padding: 12, backgroundColor: "#111111" }}>
            <T style={{ fontSize: 12, fontWeight: "600", color: "#a3a3a3", marginBottom: 8 }}>
              {t.modals.aiAssistant.subtitle}
            </T>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 6 }}>
                {samplePrompts.map((p, idx) => (
                  <Pressable
                    key={idx}
                    onPress={() => handleSend(p)}
                    style={({ pressed }) => ({
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: pressed ? "rgba(59,130,246,0.5)" : "#262626",
                      backgroundColor: "#171717",
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      opacity: pressed ? 0.8 : 1,
                      maxWidth: 220,
                    })}
                  >
                    <T numberOfLines={1} style={{ fontSize: 12, color: "#d4d4d4" }}>
                      {p}
                    </T>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Chat Input */}
          <View style={{ borderTopWidth: 1, borderTopColor: "#262626", padding: 12, backgroundColor: "#0a0a0a" }}>
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "flex-end", gap: 8 }}>
              <Input
                placeholder={t.modals.aiAssistant.inputPlaceholder}
                value={input}
                onChangeText={setInput}
                onSubmitEditing={() => handleSend()}
                editable={!isChatLoading}
                multiline
                style={{
                  flex: 1,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#262626",
                  backgroundColor: "#171717",
                  padding: 10,
                  fontSize: 12,
                  maxHeight: 112,
                  color: "#ffffff",
                }}
              />

              <Pressable
                onPress={() => handleSend()}
                disabled={!input.trim() || isChatLoading}
                style={({ pressed }) => ({
                  height: 40,
                  width: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 12,
                  backgroundColor: "#2563eb",
                  opacity: !input.trim() || isChatLoading ? 0.3 : pressed ? 0.85 : 1,
                })}
              >
                <SendIcon isRTL={isRTL} />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

function ChevronDownIcon({ rotated }: { rotated: boolean }) {
  return (
    <View style={{ transform: [{ rotate: rotated ? "180deg" : "0deg" }] }}>
      <ChevronDown size={12} color="#a3a3a3" />
    </View>
  );
}

function SendIcon({ isRTL }: { isRTL: boolean }) {
  return (
    <View style={{ transform: [{ rotate: isRTL ? "180deg" : "0deg" }] }}>
      <Send size={16} color="#ffffff" />
    </View>
  );
}
