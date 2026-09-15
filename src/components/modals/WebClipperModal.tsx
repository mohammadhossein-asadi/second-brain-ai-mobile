import React, { useState, useEffect } from "react";
import { View, Pressable } from "react-native";
import {
  Globe,
  Bookmark,
  FileText,
  X,
  Check,
  Save,
  RotateCcw,
} from "lucide-react-native";
import { useSecondBrain } from "../../context/SecondBrainContext";
import { storage } from "../../lib/storage";
import { modalColors } from "../../lib/theme";
import { ModalShell, T, TBold, Input, Spinner, ScrollView } from "../ui/primitives";

interface WebClipperDraft {
  url: string;
  clippedResult: {
    title: string;
    description: string;
    content: string;
    tags: string[];
  } | null;
  savedAt: number;
}

const DRAFT_KEY = "second_brain_web_clipper_draft";

export const WebClipperModal: React.FC = () => {
  const { isWebClipperOpen, setIsWebClipperOpen, addNote, isRTL, t } = useSecondBrain();

  const loadDraft = (): WebClipperDraft | null => {
    try {
      const saved = storage.getItem(DRAFT_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  };

  const [url, setUrl] = useState(() => loadDraft()?.url ?? "");

  const [loading, setLoading] = useState(false);
  const [autoSavedTime, setAutoSavedTime] = useState<string | null>(null);

  const [clippedResult, setClippedResult] = useState<WebClipperDraft["clippedResult"]>(
    () => loadDraft()?.clippedResult ?? null
  );

  const formatTime = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const s = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    return isRTL ? s.replace(/\d/g, (x) => "۰۱۲۳۴۵۶۷۸۹"[Number(x)]) : s;
  };

  // Auto-save draft on changes
  useEffect(() => {
    if (url.trim() || clippedResult) {
      try {
        const draft: WebClipperDraft = {
          url,
          clippedResult,
          savedAt: Date.now(),
        };
        storage.setItem(DRAFT_KEY, JSON.stringify(draft));
        setAutoSavedTime(formatTime(new Date()));
      } catch (e) {
        console.warn("Error auto-saving web clipper draft:", e);
      }
    }
  }, [url, clippedResult, isRTL]);

  const handleClearDraft = () => {
    setUrl("");
    setClippedResult(null);
    setAutoSavedTime(null);
    try {
      storage.removeItem(DRAFT_KEY);
    } catch (e) {}
  };

  if (!isWebClipperOpen) return null;

  const handleClip = () => {
    if (!url.trim()) return;
    setLoading(true);

    setTimeout(() => {
      let sampleTitle = isRTL
        ? "مقاله علمی: رویکردهای نوین در سازماندهی دانش فردی"
        : "Scientific Article: Modern Paradigms in Personal Knowledge Management";
      let sampleDesc = isRTL
        ? "بررسی متدهای PARA و Zettelkasten در افزایش راندمان پژوهشگران و یادگیرندگان مستقل"
        : "Evaluation of PARA and Zettelkasten methodologies for independent researchers and lifelong learners";
      let sampleTags = isRTL
        ? ["وب_کلیپ", "مدیریت_دانش", "پژوهش"]
        : ["web-clip", "pkm", "research"];

      if (url.includes("github")) {
        sampleTitle = isRTL
          ? "مخزن منبع‌باز: ابزارهای نسل جدید یادداشت‌برداری"
          : "Open Source Repo: Next-Gen Knowledge Graph & Note Tools";
        sampleDesc = isRTL
          ? "فهرست کتابخانه‌های مدرن برای توسعه ادیتورهای بلوکی و گراف دانش"
          : "Curated modern libraries for block editors and interactive knowledge graph visualizations";
        sampleTags = isRTL ? ["گیت_هاب", "کد", "ابزار"] : ["github", "code", "tools"];
      } else if (url.includes("medium") || url.includes("substack")) {
        sampleTitle = isRTL
          ? "یادداشت تحلیلی: چگونه یک سیستم پایدار مغز دوم بسازیم؟"
          : "Analytical Essay: How to Architect a Sustainable Second Brain";
        sampleDesc = isRTL
          ? "راهنمای عملی ایجاد چرخه بازخورد و جلوگیری از انباشت اطلاعات بی‌استفاده"
          : "Actionable frameworks for feedback loops and eliminating useless digital hoarding";
        sampleTags = isRTL ? ["مقاله", "تحلیل", "سیستم_ها"] : ["essay", "systems", "thinking"];
      }

      setClippedResult({
        title: sampleTitle,
        description: sampleDesc,
        content: isRTL
          ? `### خلاصه مقاله استخراج‌شده:\n\nاین مقاله به اصول پیونددادن ایده‌ها و استفاده از تگ‌های مفهومی اشاره می‌کند.\n\n- منبع ذخیره: ${url}\n- تاریخ: ${new Date().toLocaleDateString("fa-IR")}`
          : `### Extracted Article Summary:\n\nThis article outlines bidirectional linking and concept clustering.\n\n- Source URL: ${url}\n- Captured: ${new Date().toLocaleDateString("en-US")}`,
        tags: sampleTags,
      });
      setLoading(false);
    }, 800);
  };

  const handleSaveToNotes = () => {
    if (!clippedResult) return;
    addNote({
      title: clippedResult.title,
      content: `**${isRTL ? "منبع وب" : "Source Link"}:** [${url}](${url})\n\n> ${clippedResult.description}\n\n${clippedResult.content}`,
      type: "bookmark",
      isPinned: false,
      isArchived: false,
      tags: clippedResult.tags,
    });
    try {
      storage.removeItem(DRAFT_KEY);
    } catch (e) {}
    setIsWebClipperOpen(false);
    setClippedResult(null);
    setUrl("");
    setAutoSavedTime(null);
  };

  const presets = isRTL
    ? [
        { label: "مقاله مدیوم", val: "https://medium.com/building-a-app-guide" },
        { label: "مخزن گیت‌هاب", val: "https://github.com/app-pkm" },
      ]
    : [
        { label: "Medium Article", val: "https://medium.com/building-a-app-guide" },
        { label: "GitHub Repo", val: "https://github.com/app-pkm" },
      ];

  const hasDraft = Boolean(url.trim() || clippedResult);

  const rowDirection = { flexDirection: isRTL ? ("row-reverse" as const) : ("row" as const) };

  return (
    <ModalShell visible onClose={() => setIsWebClipperOpen(false)} maxWidth={520}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View
          style={[
            rowDirection,
            {
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: modalColors.border,
              paddingBottom: 16,
            },
          ]}
        >
          <View style={[rowDirection, { alignItems: "center", gap: 12, flex: 1 }]}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 16,
                backgroundColor: modalColors.innerBg,
                borderWidth: 1,
                borderColor: modalColors.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Globe size={20} color="#22d3ee" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={[rowDirection, { alignItems: "center", gap: 8 }]}>
                <TBold style={{ fontSize: 14, color: "#ffffff" }}>{t.modals.webClipper.title}</TBold>
                {hasDraft && (
                  <View
                    style={[
                      rowDirection,
                      {
                        alignItems: "center",
                        gap: 4,
                        borderRadius: 999,
                        backgroundColor: "rgba(34,211,238,0.1)",
                        borderWidth: 1,
                        borderColor: "rgba(34,238,238,0.3)",
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                      },
                    ]}
                  >
                    <Save size={12} color="#22d3ee" />
                    <T style={{ fontSize: 10, color: "#22d3ee" }}>
                      {isRTL ? "پیش‌نویس ذخیره شد" : "Draft saved"}
                    </T>
                  </View>
                )}
              </View>
              <T style={{ fontSize: 12, color: modalColors.textMuted, marginTop: 2 }} numberOfLines={1}>
                {t.modals.webClipper.subtitle}
              </T>
            </View>
          </View>
          <View style={[rowDirection, { alignItems: "center", gap: 6 }]}>
            {hasDraft && (
              <Pressable
                onPress={handleClearDraft}
                style={({ pressed }) => [
                  rowDirection,
                  {
                    alignItems: "center",
                    gap: 4,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: pressed ? "rgba(244,63,94,0.4)" : modalColors.border,
                    backgroundColor: modalColors.innerBg,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <RotateCcw size={12} color={modalColors.textMuted} />
                <T style={{ fontSize: 11, color: modalColors.textMuted }}>
                  {isRTL ? "پاک‌سازی" : "Clear"}
                </T>
              </Pressable>
            )}
            <Pressable
              onPress={() => setIsWebClipperOpen(false)}
              style={({ pressed }) => ({ borderRadius: 12, padding: 6, opacity: pressed ? 0.7 : 1 })}
            >
              <X size={16} color={modalColors.textMuted} />
            </Pressable>
          </View>
        </View>

        <View style={{ marginTop: 20, gap: 16 }}>
          <View>
            <T style={{ fontSize: 12, fontWeight: "600", color: modalColors.text, marginBottom: 6 }}>
              URL
            </T>
            <View style={{ gap: 8 }}>
              <Input
                placeholder={t.modals.webClipper.urlPlaceholder}
                value={url}
                onChangeText={setUrl}
                keyboardType="url"
                autoCapitalize="none"
                style={{
                  borderWidth: 1,
                  borderColor: modalColors.border,
                  backgroundColor: "rgba(23,23,23,0.8)",
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  fontSize: 12,
                  color: "#ffffff",
                  textAlign: "left",
                }}
              />
              <Pressable
                onPress={handleClip}
                disabled={!url.trim() || loading}
                style={({ pressed }) => [
                  rowDirection,
                  {
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    borderRadius: 12,
                    backgroundColor: "#2563eb",
                    paddingHorizontal: 16,
                    minHeight: 40,
                    opacity: !url.trim() || loading ? 0.4 : pressed ? 0.85 : 1,
                  },
                ]}
              >
                {loading ? (
                  <Spinner size={16} color="#ffffff" />
                ) : (
                  <Bookmark size={16} color="#ffffff" />
                )}
                <T style={{ fontSize: 12, fontWeight: "700", color: "#ffffff" }}>
                  {loading ? t.modals.webClipper.clipping : t.modals.webClipper.clipButton}
                </T>
              </Pressable>
            </View>
          </View>

          {/* Quick preset links */}
          <View style={[rowDirection, { flexWrap: "wrap", alignItems: "center", gap: 8 }]}>
            <T style={{ fontSize: 12, fontWeight: "600", color: modalColors.textSubtle }}>
              {isRTL ? "پیش‌فرض‌ها:" : "Presets:"}
            </T>
            {presets.map((preset) => (
              <Pressable
                key={preset.label}
                onPress={() => setUrl(preset.val)}
                style={({ pressed }) => ({
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: pressed ? "#404040" : modalColors.border,
                  backgroundColor: modalColors.innerBg,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                })}
              >
                <T style={{ fontSize: 12, color: modalColors.text }}>{preset.label}</T>
              </Pressable>
            ))}
          </View>

          {/* Clipped content preview */}
          {clippedResult && (
            <View style={{ borderRadius: 16, borderWidth: 1, borderColor: modalColors.border, backgroundColor: "rgba(23,23,23,0.6)", padding: 16, gap: 12 }}>
              <View style={[rowDirection, { gap: 10 }]}>
                <View style={{ marginTop: 2 }}>
                  <FileText size={16} color="#22d3ee" />
                </View>
                <View style={{ flex: 1 }}>
                  <TBold style={{ fontSize: 12, color: "#ffffff" }}>{clippedResult.title}</TBold>
                  <T style={{ fontSize: 12, color: modalColors.textMuted, marginTop: 4, lineHeight: 18 }}>
                    {clippedResult.description}
                  </T>
                </View>
              </View>

              <View style={[rowDirection, { flexWrap: "wrap", gap: 6 }]}>
                {clippedResult.tags.map((tag) => (
                  <View
                    key={tag}
                    style={{
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: modalColors.border,
                      backgroundColor: modalColors.innerBg,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                    }}
                  >
                    <T style={{ fontSize: 11, color: "#22d3ee" }}>#{tag}</T>
                  </View>
                ))}
              </View>

              <View
                style={[
                  rowDirection,
                  {
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTopWidth: 1,
                    borderTopColor: modalColors.border,
                    paddingTop: 12,
                  },
                ]}
              >
                <View style={[rowDirection, { alignItems: "center", gap: 6, flex: 1 }]}>
                  {autoSavedTime && (
                    <>
                      <Save size={12} color="#22d3ee" />
                      <T style={{ fontSize: 10, color: "#22d3ee" }}>
                        {isRTL
                          ? `ذخیره خودکار پیش‌نویس در ${autoSavedTime}`
                          : `Draft auto-saved at ${autoSavedTime}`}
                      </T>
                    </>
                  )}
                </View>
                <Pressable
                  onPress={handleSaveToNotes}
                  style={({ pressed }) => [
                    rowDirection,
                    {
                      alignItems: "center",
                      gap: 6,
                      borderRadius: 12,
                      backgroundColor: pressed ? "#22d3ee" : "#06b6d4",
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      minHeight: 36,
                    },
                  ]}
                >
                  <Check size={14} color="#0a0a0a" strokeWidth={3} />
                  <T style={{ fontSize: 12, fontWeight: "700", color: "#0a0a0a" }}>
                    {t.modals.webClipper.saveToNotes}
                  </T>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ModalShell>
  );
};
