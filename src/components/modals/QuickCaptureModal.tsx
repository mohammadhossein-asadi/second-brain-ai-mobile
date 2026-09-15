import React, { useState, useEffect } from "react";
import { View, Pressable } from "react-native";
import {
  FileText,
  CheckSquare,
  Lightbulb,
  Bookmark,
  Mic,
  MicOff,
  X,
  Plus,
  Link as LinkIcon,
  Check,
  Save,
  RotateCcw,
} from "lucide-react-native";
import { useSecondBrain } from "../../context/SecondBrainContext";
import { Priority } from "../../types";
import { storage } from "../../lib/storage";
import { modalColors } from "../../lib/theme";
import { ModalShell, T, TBold, Input, Select, ScrollView } from "../ui/primitives";

type CaptureType = "note" | "task" | "idea" | "bookmark" | "voice";

export const QuickCaptureModal: React.FC = () => {
  const {
    isQuickCaptureOpen,
    setIsQuickCaptureOpen,
    addNote,
    addTask,
    projects,
    goals,
    isRTL,
    t,
  } = useSecondBrain();

  const DRAFT_KEY = "second_brain_quick_capture_draft";
  const [autoSavedTime, setAutoSavedTime] = useState<string | null>(null);

  const loadDraft = (): any | null => {
    try {
      const saved = storage.getItem(DRAFT_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  };

  const [type, setType] = useState<CaptureType>(() => {
    const d = loadDraft();
    if (d?.type) return d.type;
    return "note";
  });
  const [title, setTitle] = useState(() => loadDraft()?.title ?? "");
  const [content, setContent] = useState(() => loadDraft()?.content ?? "");
  const [url, setUrl] = useState(() => loadDraft()?.url ?? "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(() => {
    const d = loadDraft();
    return Array.isArray(d?.tags) ? d.tags : [];
  });
  const [priority, setPriority] = useState<Priority>(() => {
    const d = loadDraft();
    if (d?.priority) return d.priority;
    return "medium";
  });
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    () => loadDraft()?.selectedProjectId ?? ""
  );
  const [selectedGoalId, setSelectedGoalId] = useState<string>(
    () => loadDraft()?.selectedGoalId ?? ""
  );

  const formatTime = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const s = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    return isRTL ? s.replace(/\d/g, (x) => "۰۱۲۳۴۵۶۷۸۹"[Number(x)]) : s;
  };

  useEffect(() => {
    if (title.trim() || content.trim() || url.trim() || tags.length > 0) {
      try {
        const draft = {
          type,
          title,
          content,
          url,
          tags,
          priority,
          selectedProjectId,
          selectedGoalId,
          updatedAt: Date.now(),
        };
        storage.setItem(DRAFT_KEY, JSON.stringify(draft));
        setAutoSavedTime(formatTime(new Date()));
      } catch (e) {
        console.warn("Auto-save draft error:", e);
      }
    }
  }, [type, title, content, url, tags, priority, selectedProjectId, selectedGoalId, isRTL]);

  const handleClearDraft = () => {
    setTitle("");
    setContent("");
    setUrl("");
    setTags([]);
    setAutoSavedTime(null);
    try {
      storage.removeItem(DRAFT_KEY);
    } catch (e) {}
  };

  if (!isQuickCaptureOpen) return null;

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, "");
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (itemToRemove: string) => {
    setTags(tags.filter((item) => item !== itemToRemove));
  };

  const handleSave = () => {
    if (!title.trim()) return;

    if (type === "task") {
      addTask({
        name: title.trim(),
        description: content.trim() || undefined,
        isCompleted: false,
        status: "not_started",
        priority,
        projectId: selectedProjectId || undefined,
        goalId: selectedGoalId || undefined,
        dueDate: isRTL ? "۱۴۰۴/۰۲/۲۵" : "2025-05-15",
      });
    } else if (type === "bookmark") {
      addNote({
        title: title.trim(),
        content: `**${isRTL ? "آدرس منبع" : "Source"}:** [${url || "URL"}](${url})\n\n${content}`,
        type: "bookmark",
        isPinned: false,
        isArchived: false,
        tags: tags.length ? tags : [isRTL ? "بوکمارک" : "bookmark"],
      });
    } else if (type === "idea") {
      addNote({
        title: title.trim(),
        content,
        type: "idea",
        isPinned: true,
        isArchived: false,
        tags: tags.length ? tags : [isRTL ? "ایده" : "idea"],
      });
    } else {
      addNote({
        title: title.trim(),
        content,
        type: "note",
        isPinned: false,
        isArchived: false,
        tags: tags.length ? tags : [isRTL ? "یادداشت_سریع" : "quick_note"],
      });
    }

    setTitle("");
    setContent("");
    setUrl("");
    setTags([]);
    setAutoSavedTime(null);
    try {
      storage.removeItem(DRAFT_KEY);
    } catch (e) {}
    setIsQuickCaptureOpen(false);
  };

  const hasDraftContent = Boolean(title.trim() || content.trim() || url.trim() || tags.length > 0);

  const rowDirection = { flexDirection: isRTL ? ("row-reverse" as const) : ("row" as const) };

  return (
    <ModalShell visible onClose={() => setIsQuickCaptureOpen(false)} maxWidth={520}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Header */}
        <View
          style={[
            rowDirection,
            { alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: modalColors.border, paddingBottom: 14 },
          ]}
        >
          <View style={[rowDirection, { alignItems: "center", gap: 10, flex: 1 }]}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                backgroundColor: modalColors.innerBg,
                borderWidth: 1,
                borderColor: modalColors.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Plus size={20} color="#60a5fa" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={[rowDirection, { alignItems: "center", gap: 8 }]}>
                <TBold style={{ fontSize: 14, color: "#ffffff" }}>
                  {t.modals.quickCapture.modalTitle}
                </TBold>
                {hasDraftContent && (
                  <View
                    style={[
                      rowDirection,
                      {
                        alignItems: "center",
                        gap: 4,
                        borderRadius: 999,
                        backgroundColor: "rgba(59,130,246,0.1)",
                        borderWidth: 1,
                        borderColor: "rgba(59,130,246,0.3)",
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                      },
                    ]}
                  >
                    <Save size={12} color="#60a5fa" />
                    <T style={{ fontSize: 10, color: "#60a5fa" }}>
                      {isRTL ? "ذخیره خودکار پیش‌نویس" : "Auto-saved draft"}
                    </T>
                  </View>
                )}
              </View>
              <T style={{ fontSize: 12, color: modalColors.textMuted, marginTop: 2 }} numberOfLines={1}>
                {t.modals.quickCapture.contentPlaceholder}
              </T>
            </View>
          </View>
          <View style={[rowDirection, { alignItems: "center", gap: 6 }]}>
            {hasDraftContent && (
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
              onPress={() => setIsQuickCaptureOpen(false)}
              style={({ pressed }) => ({
                borderRadius: 12,
                padding: 6,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <X size={16} color={modalColors.textMuted} />
            </Pressable>
          </View>
        </View>

        {/* Type Selector Tabs */}
        <View
          style={[
            rowDirection,
            {
              marginTop: 16,
              marginBottom: 16,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: modalColors.border,
              backgroundColor: "rgba(23,23,23,0.8)",
              padding: 4,
              gap: 4,
            },
          ]}
        >
          {[
            { id: "note" as const, label: t.modals.quickCapture.tabNote, icon: FileText },
            { id: "task" as const, label: t.modals.quickCapture.tabTask, icon: CheckSquare },
            { id: "idea" as const, label: t.modals.quickCapture.tabIdea, icon: Lightbulb },
            { id: "bookmark" as const, label: t.modals.quickCapture.tabBookmark, icon: Bookmark },
            { id: "voice" as const, label: t.modals.quickCapture.tabVoice, icon: Mic },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = type === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => setType(item.id)}
                style={({ pressed }) => ({
                  flex: 1,
                  minHeight: 44,
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  borderRadius: 12,
                  paddingHorizontal: 2,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: isSelected ? "#404040" : "transparent",
                  backgroundColor: isSelected ? "#262626" : "transparent",
                  opacity: pressed && !isSelected ? 0.7 : 1,
                })}
              >
                <Icon size={16} color={isSelected ? "#60a5fa" : modalColors.textMuted} />
                <T
                  numberOfLines={1}
                  style={{
                    fontSize: 10,
                    color: isSelected ? "#60a5fa" : modalColors.textMuted,
                    fontWeight: isSelected ? "700" : "600",
                  }}
                >
                  {item.label}
                </T>
              </Pressable>
            );
          })}
        </View>

        {/* Voice widget — DEVIATION from web: live Web Speech API recognition is not
            available in React Native, so the mic is disabled and text entry is used. */}
        {type === "voice" && (
          <View
            style={{
              marginBottom: 16,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: modalColors.border,
              backgroundColor: "rgba(23,23,23,0.6)",
              padding: 16,
              alignItems: "center",
              gap: 10,
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: modalColors.innerBg,
                borderWidth: 1,
                borderColor: modalColors.border,
              }}
            >
              <MicOff size={24} color={modalColors.textSubtle} />
            </View>
            <View>
              <TBold style={{ fontSize: 12, color: "#ffffff", textAlign: "center" }}>
                {isRTL
                  ? "ثبت صوتی زنده در این نسخه غیرفعال است"
                  : "Live voice capture is unavailable"}
              </TBold>
              <T style={{ fontSize: 11, color: modalColors.textMuted, marginTop: 4, textAlign: "center" }}>
                {isRTL
                  ? "تشخیص گفتار به سرویس گفتار بومی دستگاه نیاز دارد؛ لطفاً یادداشت خود را تایپ کنید."
                  : "Speech recognition requires the native speech service. Please type your note below."}
              </T>
            </View>
          </View>
        )}

        {/* Form */}
        <View style={{ gap: 14 }}>
          <View>
            <T style={{ fontSize: 12, fontWeight: "600", color: modalColors.text, marginBottom: 4 }}>
              {t.common.title}
            </T>
            <Input
              placeholder={t.modals.quickCapture.titlePlaceholder}
              value={title}
              onChangeText={setTitle}
              style={{
                borderWidth: 1,
                borderColor: modalColors.border,
                backgroundColor: "rgba(23,23,23,0.7)",
                borderRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 10,
                fontSize: 12,
                color: "#ffffff",
              }}
            />
          </View>

          {/* Bookmark URL field */}
          {type === "bookmark" && (
            <View>
              <T style={{ fontSize: 12, fontWeight: "600", color: modalColors.text, marginBottom: 4 }}>
                {t.modals.quickCapture.bookmarkUrlPlaceholder}
              </T>
              <View
                style={[
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: modalColors.border,
                    backgroundColor: "rgba(23,23,23,0.7)",
                    borderRadius: 12,
                    paddingHorizontal: 12,
                  },
                ]}
              >
                <LinkIcon size={16} color={modalColors.textSubtle} />
                <Input
                  placeholder={t.modals.quickCapture.bookmarkUrlPlaceholder}
                  value={url}
                  onChangeText={setUrl}
                  keyboardType="url"
                  autoCapitalize="none"
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    fontSize: 12,
                    color: "#ffffff",
                    textAlign: "left",
                  }}
                />
              </View>
            </View>
          )}

          {/* Task specific fields */}
          {type === "task" && (
            <View style={{ gap: 8 }}>
              <View>
                <T style={{ fontSize: 12, fontWeight: "600", color: modalColors.text, marginBottom: 4 }}>
                  {t.common.priority}
                </T>
                <Select<Priority>
                  value={priority}
                  onChange={(v) => setPriority(v)}
                  options={[
                    { value: "critical", label: t.priorities.critical },
                    { value: "high", label: t.priorities.high },
                    { value: "medium", label: t.priorities.medium },
                    { value: "low", label: t.priorities.low },
                  ]}
                />
              </View>

              <View>
                <T style={{ fontSize: 12, fontWeight: "600", color: modalColors.text, marginBottom: 4 }}>
                  {t.modals.quickCapture.relatedProject}
                </T>
                <Select
                  value={selectedProjectId}
                  onChange={(v) => setSelectedProjectId(v)}
                  options={[
                    { value: "", label: t.modals.quickCapture.noProject },
                    ...projects.map((p) => ({ value: p.id, label: p.name })),
                  ]}
                />
              </View>

              <View>
                <T style={{ fontSize: 12, fontWeight: "600", color: modalColors.text, marginBottom: 4 }}>
                  {t.modals.quickCapture.relatedGoal}
                </T>
                <Select
                  value={selectedGoalId}
                  onChange={(v) => setSelectedGoalId(v)}
                  options={[
                    { value: "", label: t.modals.quickCapture.noGoal },
                    ...goals.map((g) => ({ value: g.id, label: g.name })),
                  ]}
                />
              </View>
            </View>
          )}

          {/* Content / Notes */}
          <View>
            <T style={{ fontSize: 12, fontWeight: "600", color: modalColors.text, marginBottom: 4 }}>
              {isRTL ? "محتوا / یادداشت" : "Content / Notes"}
            </T>
            <Input
              multiline
              numberOfLines={3}
              placeholder={t.modals.quickCapture.contentPlaceholder}
              value={content}
              onChangeText={setContent}
              textAlignVertical="top"
              style={{
                borderWidth: 1,
                borderColor: modalColors.border,
                backgroundColor: "rgba(23,23,23,0.7)",
                borderRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 10,
                fontSize: 12,
                color: "#ffffff",
                minHeight: 80,
              }}
            />
          </View>

          {/* Tags */}
          <View>
            <T style={{ fontSize: 12, fontWeight: "600", color: modalColors.text, marginBottom: 4 }}>
              {t.common.tags}
            </T>
            <View style={[rowDirection, { gap: 8 }]}>
              <Input
                placeholder={t.modals.quickCapture.tagsPlaceholder}
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={handleAddTag}
                returnKeyType="done"
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: modalColors.border,
                  backgroundColor: "rgba(23,23,23,0.7)",
                  borderRadius: 12,
                  paddingHorizontal: 8,
                  paddingVertical: 8,
                  fontSize: 12,
                  color: "#ffffff",
                }}
              />
              <Pressable
                onPress={handleAddTag}
                style={({ pressed }) => ({
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: modalColors.border,
                  backgroundColor: modalColors.innerBg,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  justifyContent: "center",
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <T style={{ fontSize: 12, fontWeight: "600", color: modalColors.text }}>+</T>
              </Pressable>
            </View>

            {tags.length > 0 && (
              <View style={[rowDirection, { flexWrap: "wrap", gap: 6, marginTop: 8 }]}>
                {tags.map((itemTag) => (
                  <View
                    key={itemTag}
                    style={[
                      rowDirection,
                      {
                        alignItems: "center",
                        gap: 4,
                        borderRadius: 999,
                        borderWidth: 1,
                        borderColor: modalColors.border,
                        backgroundColor: modalColors.innerBg,
                        paddingHorizontal: 10,
                        paddingVertical: 2,
                      },
                    ]}
                  >
                    <T style={{ fontSize: 12, color: "#60a5fa" }}>#{itemTag}</T>
                    <Pressable onPress={() => handleRemoveTag(itemTag)} hitSlop={6}>
                      <T style={{ fontSize: 12, color: modalColors.textMuted }}>×</T>
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Submit buttons */}
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
                  <Save size={12} color="#93c5fd" />
                  <T style={{ fontSize: 10, color: "#93c5fd" }}>
                    {isRTL ? `ذخیره شد در ${autoSavedTime}` : `Saved at ${autoSavedTime}`}
                  </T>
                </>
              )}
            </View>
            <View style={[rowDirection, { alignItems: "center", gap: 8 }]}>
              <Pressable
                onPress={() => setIsQuickCaptureOpen(false)}
                style={({ pressed }) => ({ borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8, opacity: pressed ? 0.7 : 1 })}
              >
                <T style={{ fontSize: 12, color: modalColors.textMuted }}>{t.common.cancel}</T>
              </Pressable>
              <Pressable
                onPress={handleSave}
                style={({ pressed }) => [
                  rowDirection,
                  {
                    alignItems: "center",
                    gap: 6,
                    borderRadius: 12,
                    backgroundColor: "#2563eb",
                    paddingHorizontal: 20,
                    paddingVertical: 8,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <Check size={16} color="#ffffff" strokeWidth={2.5} />
                <T style={{ fontSize: 12, fontWeight: "700", color: "#ffffff" }}>
                  {t.modals.quickCapture.saveItem}
                </T>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </ModalShell>
  );
};
