import React, { useState } from "react";
import { View, Pressable, ScrollView, Modal } from "react-native";
import { Settings, Check, RotateCcw, Eye, EyeOff } from "lucide-react-native";
import { useSecondBrain } from "../../context/SecondBrainContext";
import { aiService, getApiKey, setApiKey } from "../../services/ai";
import { T, Input, Select } from "../ui/primitives";

const KEY_LABELS: Record<string, { fa: string; en: string }> = {
  GEMINI_API_KEY: { fa: "گوگل جمنای", en: "Google Gemini" },
  OPENAI_API_KEY_1: { fa: "اوپن‌ای‌آی (کلید ۱)", en: "OpenAI (Key 1)" },
  OPENAI_API_KEY_2: { fa: "اوپن‌ای‌آی (کلید ۲)", en: "OpenAI (Key 2)" },
  OPENAI_API_KEY_3: { fa: "اوپن‌ای‌آی (کلید ۳)", en: "OpenAI (Key 3)" },
  OPENROUTER_API_KEY: { fa: "اوپن‌روتر", en: "OpenRouter" },
  HF_DEEPSEEK_API_KEY: { fa: "دیپ‌سیک (هاگینگ‌فیس)", en: "DeepSeek (HF)" },
  HF_GLM_API_KEY: { fa: "مدل GLM", en: "GLM Model" },
  GLM_API_KEY: { fa: "زد‌‌‌‌‌‌دانش (GLM)", en: "Z.ai (GLM)" },
  HUGGINGFACE_API_KEY: { fa: "هاگینگ‌فیس", en: "Hugging Face" },
  GROQ_API_KEY: { fa: "گروک", en: "Groq Cloud" },
  MISTRAL_API_KEY: { fa: "میسترال", en: "Mistral AI" },
  SAMBANOVA_API_KEY: { fa: "سامبانوا", en: "SambaNova" },
  BAZAARLINK_API_KEY: { fa: "بازارلینک", en: "BazaarLink" },
  AIONLABS_API_KEY: { fa: "آیون لبز", en: "Aion Labs" },
  LLM7_API_KEY: { fa: "ال‌ال‌ام ۷", en: "LLM7" },
  OLLAMA_API_KEY: { fa: "اولاما", en: "Ollama Cloud" },
  GITHUB_TOKEN: { fa: "گیت‌هاب", en: "GitHub" },
};

export const ProviderSettingsModal: React.FC<{ visible: boolean; onClose: () => void }> = ({
  visible,
  onClose,
}) => {
  const { isRTL, t, showToast, loadAIProviders, selectedAIProvider, setSelectedAIProvider } =
    useSecondBrain();

  const [providers, setProviders] = useState(aiService.getProviders());
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  const refreshProviders = () => setProviders(aiService.getProviders());

  const handleSaveKey = (name: string) => {
    const value = drafts[name];
    if (value === undefined) return;
    setApiKey(name, value);
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    refreshProviders();
    loadAIProviders();
    showToast(isRTL ? "کلید API ذخیره شد" : "API key saved", "success");
  };

  const handleClearKey = (name: string) => {
    setApiKey(name, "");
    setDrafts((prev) => ({ ...prev, [name]: "" }));
    refreshProviders();
    loadAIProviders();
    showToast(isRTL ? "کلید API حذف شد" : "API key cleared", "info");
  };

  const configuredCount = providers.filter((p) => p.isConfigured).length;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.75)", alignItems: "center", justifyContent: "center", padding: 16 }}
        onPress={onClose}
      >
        <Pressable
          style={{
            width: "100%",
            maxWidth: 520,
            maxHeight: "88%",
            borderRadius: 24,
            borderWidth: 1,
            borderColor: "#1f293d",
            backgroundColor: "#05070d",
            overflow: "hidden",
          }}
          onPress={() => {}}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: "#262626",
              paddingHorizontal: 20,
              paddingVertical: 14,
            }}
          >
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 10 }}>
              <View
                style={{
                  height: 36,
                  width: 36,
                  borderRadius: 14,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(59,130,246,0.1)",
                  borderWidth: 1,
                  borderColor: "rgba(59,130,246,0.2)",
                }}
              >
                <Settings size={18} color="#60a5fa" />
              </View>
              <View>
                <T style={{ fontSize: 14, fontWeight: "700", color: "#ffffff" }}>
                  {isRTL ? "تنظیمات ارائه‌دهندگان هوش مصنوعی" : "AI Provider Settings"}
                </T>
                <T style={{ fontSize: 11, color: "#a3a3a3" }}>
                  {configuredCount} / {providers.length} {isRTL ? "متصل" : "configured"}
                </T>
              </View>
            </View>
            <Pressable onPress={onClose} style={{ borderRadius: 12, padding: 6 }}>
              <T style={{ fontSize: 16, color: "#a3a3a3" }}>✕</T>
            </Pressable>
          </View>

          {/* Default provider selector */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: "#262626",
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <T style={{ fontSize: 12, color: "#d4d4d4", flexShrink: 1 }}>
              {isRTL ? "مدل پیش‌فرض:" : "Default provider:"}
            </T>
            <View style={{ flex: 1, maxWidth: 240 }}>
              <Select
                value={selectedAIProvider}
                options={[
                  { value: "auto", label: isRTL ? "✨ هوشمند (پشتیبان خودکار)" : "✨ Auto" },
                  ...providers.map((p) => ({
                    value: p.id,
                    label: `${p.nameFa || p.name}${p.isConfigured ? " ✓" : ""}`,
                  })),
                ]}
                onChange={setSelectedAIProvider}
              />
            </View>
          </View>

          {/* Keys list */}
          <ScrollView style={{ maxHeight: 460 }} contentContainerStyle={{ padding: 16, gap: 14 }}>
            {Object.entries(KEY_LABELS).map(([keyName, labels]) => {
              const current = getApiKey(keyName);
              const hasKey = Boolean(current);
              const draft = drafts[keyName];
              return (
                <View
                  key={keyName}
                  style={{
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: hasKey ? "rgba(59,130,246,0.3)" : "#262626",
                    backgroundColor: "rgba(10,10,10,0.5)",
                    padding: 12,
                    gap: 8,
                  }}
                >
                  <View
                    style={{
                      flexDirection: isRTL ? "row-reverse" : "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
                      <T style={{ fontSize: 12, fontWeight: "700", color: "#e5e5e5" }}>
                        {isRTL ? labels.fa : labels.en}
                      </T>
                      {hasKey ? (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                            borderRadius: 999,
                            backgroundColor: "rgba(59,130,246,0.15)",
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                          }}
                        >
                          <Check size={10} color="#60a5fa" />
                          <T style={{ fontSize: 10, color: "#60a5fa" }}>{isRTL ? "فعال" : "OK"}</T>
                        </View>
                      ) : null}
                    </View>
                    <T style={{ fontSize: 10, color: "#737373" }}>{keyName}</T>
                  </View>

                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
                    <Pressable
                      onPress={() =>
                        setVisibleKeys((prev) => ({ ...prev, [keyName]: !prev[keyName] }))
                      }
                      style={{ padding: 6 }}
                    >
                      {visibleKeys[keyName] ? (
                        <EyeOff size={14} color="#737373" />
                      ) : (
                        <Eye size={14} color="#737373" />
                      )}
                    </Pressable>
                    <Input
                      value={drafts[keyName] ?? current}
                      onChangeText={(v) => setDrafts((prev) => ({ ...prev, [keyName]: v }))}
                      placeholder={hasKey ? "••••••••" : isRTL ? "کلید API را وارد کنید" : "Enter API key"}
                      secureTextEntry={!visibleKeys[keyName]}
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={{
                        flex: 1,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: "#262626",
                        backgroundColor: "#171717",
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        fontSize: 11,
                        color: "#ffffff",
                      }}
                    />
                    <Pressable
                      onPress={() => handleSaveKey(keyName)}
                      disabled={drafts[keyName] === undefined}
                      style={({ pressed }) => ({
                        borderRadius: 10,
                        backgroundColor: "#2563eb",
                        paddingHorizontal: 12,
                        paddingVertical: 7,
                        opacity: drafts[keyName] === undefined ? 0.4 : pressed ? 0.85 : 1,
                      })}
                    >
                      <T style={{ fontSize: 11, fontWeight: "700", color: "#ffffff" }}>
                        {isRTL ? "ذخیره" : "Save"}
                      </T>
                    </Pressable>
                    {hasKey ? (
                      <Pressable
                        onPress={() => handleClearKey(keyName)}
                        style={({ pressed }) => ({
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: "#404040",
                          padding: 7,
                          opacity: pressed ? 0.7 : 1,
                        })}
                      >
                        <RotateCcw size={13} color="#a3a3a3" />
                      </Pressable>
                    ) : null}
                  </View>
                </View>
              );
            })}

            <T style={{ fontSize: 10, color: "#737373", lineHeight: 16, textAlign: isRTL ? "right" : "left" }}>
              {isRTL
                ? "کلیدها به‌صورت محلی روی دستگاه ذخیره می‌شوند و فقط برای تماس مستقیم با ارائه‌دهندگان استفاده می‌شوند."
                : "Keys are stored locally on this device and used only for direct provider API calls."}
            </T>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
