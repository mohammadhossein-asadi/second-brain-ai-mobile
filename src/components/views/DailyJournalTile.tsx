import React, { useState, useEffect } from "react";
import { View, Pressable, TextInput } from "react-native";
import {
  BookOpen,
  Sparkles,
  Save,
  Check,
  RotateCcw,
  Calendar,
  FileText,
  Zap,
  Leaf,
} from "lucide-react-native";
import { useSecondBrain } from "../../context/SecondBrainContext";
import { getTodayKey } from "../../data/initialData";
import { storage } from "../../lib/storage";
import { T, Input } from "../ui/primitives";
import { useThemeColors } from "../../lib/theme";

interface DailyJournalTileProps {
  isRTL: boolean;
}

export const DailyJournalTile: React.FC<DailyJournalTileProps> = ({ isRTL }) => {
  const { addNote, showToast, notes, setActiveView, setSelectedNoteId } = useSecondBrain();
  const c = useThemeColors();
  const todayKey = getTodayKey();

  const DRAFT_KEY = `second_brain_daily_journal_${todayKey}`;

  // Mood options
  const moods = [
    { id: "focused", icon: Zap, labelFa: "Ù…ØªÙ…Ø±Ú©Ø² Ùˆ Ù¾Ø±Ø§Ù†Ø±Ú˜ÛŒ", labelEn: "High Focus", color: "#fbbf24" },
    { id: "calm", icon: Leaf, labelFa: "Ø¢Ø±Ø§Ù… Ùˆ Ù…ØªØ¹Ø§Ø¯Ù„", labelEn: "Calm & Grounded", color: "#60a5fa" },
    { id: "creative", icon: Sparkles, labelFa: "Ø§Ù„Ù‡Ø§Ù…â€ŒØ¨Ø®Ø´ Ùˆ Ø®Ù„Ø§Ù‚", labelEn: "Creative Flow", color: "#818cf8" },
    { id: "reflective", icon: BookOpen, labelFa: "Ø¯Ø±ÙˆÙ†â€ŒÙ†Ú¯Ø± Ùˆ ÛŒØ§Ø¯Ú¯ÛŒØ±Ù†Ø¯Ù‡", labelEn: "Reflective", color: "#38bdf8" },
  ];

  // Quick Prompt Chips
  const promptChips = isRTL
    ? [
        { label: "ðŸ† Ø¯Ø³ØªØ§ÙˆØ±Ø¯Ù‡Ø§", text: "Ø³Ù‡ Ø¯Ø³ØªØ§ÙˆØ±Ø¯ Ùˆ Ù¾ÛŒØ±ÙˆØ²ÛŒ Ù…Ù† Ø¯Ø± Ø±ÙˆØ² Ø¬Ø§Ø±ÛŒ:\nÛ±. \nÛ². \nÛ³. \n" },
        { label: "ðŸ’¡ Ø¯Ø±Ø³ Ù…Ù‡Ù…", text: "Ø¨Ø²Ø±Ú¯â€ŒØªØ±ÛŒÙ† Ø¨ØµÛŒØ±Øª ÛŒØ§ Ø¯Ø±Ø³ÛŒ Ú©Ù‡ Ø§Ù…Ø±ÙˆØ² Ø¢Ù…ÙˆØ®ØªÙ…:\n- " },
        { label: "ðŸŽ¯ ØªÙ…Ø±Ú©Ø² ÙØ±Ø¯Ø§", text: "Ù…Ù‡Ù…â€ŒØªØ±ÛŒÙ† Ø§ÙˆÙ„ÙˆÛŒØª Ùˆ Ù‚ÙˆØ±Ø¨Ø§ØºÙ‡ Ø°Ù‡Ù†ÛŒ Ø¨Ø±Ø§ÛŒ ÙØ±Ø¯Ø§:\n- " },
        { label: "ðŸ™ Ø´Ú©Ø±Ú¯Ø²Ø§Ø±ÛŒ", text: "Ø§Ù…Ø±ÙˆØ² Ø¨Ø±Ø§ÛŒ Ú†Ù‡ Ú†ÛŒØ²Ù‡Ø§ÛŒÛŒ Ø´Ú©Ø±Ú¯Ø²Ø§Ø±Ù…:\nÛ±. \nÛ². \n" },
      ]
    : [
        { label: "ðŸ† 3 Wins", text: "Top 3 accomplishments and victories today:\n1. \n2. \n3. \n" },
        { label: "ðŸ’¡ Big Insight", text: "The key insight or lesson learned today:\n- " },
        { label: "ðŸŽ¯ Tomorrow's Focus", text: "The primary high-leverage objective for tomorrow:\n- " },
        { label: "ðŸ™ Gratitude", text: "Moments of gratitude today:\n1. \n2. \n" },
      ];

  const [selectedMood, setSelectedMood] = useState<string>(() => {
    return storage.getItem(`${DRAFT_KEY}_mood`) || "focused";
  });

  const [reflectionText, setReflectionText] = useState<string>(() => {
    return storage.getItem(DRAFT_KEY) || "";
  });

  const [autoSavedTime, setAutoSavedTime] = useState<string | null>(null);

  // Check if today already has an existing saved journal note
  const todayNote = notes.find(
    (n) => n.tags.includes("journal") && (n.tags.includes(todayKey) || n.title.includes(todayKey))
  );

  // Auto-save draft
  useEffect(() => {
    if (reflectionText.trim()) {
      storage.setItem(DRAFT_KEY, reflectionText);
      storage.setItem(`${DRAFT_KEY}_mood`, selectedMood);
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      setAutoSavedTime(`${hh}:${mm}`);
    }
  }, [reflectionText, selectedMood, DRAFT_KEY]);

  const handleAppendPrompt = (promptText: string) => {
    setReflectionText((prev) => {
      if (!prev.trim()) return promptText;
      return `${prev}\n\n${promptText}`;
    });
  };

  const handleClear = () => {
    setReflectionText("");
    setAutoSavedTime(null);
    storage.removeItem(DRAFT_KEY);
    storage.removeItem(`${DRAFT_KEY}_mood`);
  };

  const handleSaveToNotes = () => {
    if (!reflectionText.trim()) {
      showToast(
        isRTL ? "Ù„Ø·ÙØ§Ù‹ Ø§Ø¨ØªØ¯Ø§ ÛŒØ§Ø¯Ø¯Ø§Ø´Øª Ø¨Ø§Ø²ØªØ§Ø¨ Ø±ÙˆØ²Ø§Ù†Ù‡ Ø®ÙˆØ¯ Ø±Ø§ Ø¨Ù†ÙˆÛŒØ³ÛŒØ¯" : "Please write a reflection first",
        "warning"
      );
      return;
    }

    const currentMoodObj = moods.find((m) => m.id === selectedMood);
    const moodLabel = isRTL ? currentMoodObj?.labelFa : currentMoodObj?.labelEn;

    const formattedContent = `## ${isRTL ? "Ø¨Ø§Ø²ØªØ§Ø¨ Ø±ÙˆØ²Ø§Ù†Ù‡" : "Daily Reflection"} - ${todayKey}\n\n**${isRTL ? "Ø­Ø§Ù„Øª Ø°Ù‡Ù†ÛŒ Ùˆ Ø§Ù†Ø±Ú˜ÛŒ" : "State of Mind"}:** ${moodLabel}\n\n${reflectionText}\n\n---\n*${isRTL ? "Ø«Ø¨Øªâ€ŒØ´Ø¯Ù‡ Ø§Ø² Ø·Ø±ÛŒÙ‚ Ø¯Ø§Ø´Ø¨ÙˆØ±Ø¯ Ù…ØºØ² Ø¯ÙˆÙ…" : "Captured via Second Brain Dashboard"}*`;

    addNote({
      title: isRTL ? `Ú˜ÙˆØ±Ù†Ø§Ù„ Ø±ÙˆØ²Ø§Ù†Ù‡ - ${todayKey}` : `Daily Journal - ${todayKey}`,
      content: formattedContent,
      type: "journal",
      isPinned: false,
      isArchived: false,
      tags: ["journal", "reflection", todayKey],
    });

    showToast(
      isRTL ? "Ø¨Ø§Ø²ØªØ§Ø¨ Ø±ÙˆØ²Ø§Ù†Ù‡ Ø¨Ø§ Ù…ÙˆÙÙ‚ÛŒØª Ø¯Ø± ÛŒØ§Ø¯Ø¯Ø§Ø´Øªâ€ŒÙ‡Ø§ÛŒ Ù…ØºØ² Ø¯ÙˆÙ… Ø°Ø®ÛŒØ±Ù‡ Ø´Ø¯" : "Daily reflection saved to Notes",
      "success",
      isRTL ? "Ú˜ÙˆØ±Ù†Ø§Ù„ Ø±ÙˆØ²Ø§Ù†Ù‡" : "Daily Journal"
    );
  };

  // Formatted date string
  const dateDisplay = isRTL
    ? `Ø³Ù‡â€ŒØ´Ù†Ø¨Ù‡ØŒ Û±Û¸ Ø´Ù‡Ø±ÛŒÙˆØ± Û±Û´Û°Ûµ (${todayKey})`
    : new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      });

  const hasDraft = Boolean(reflectionText.trim());

  return (
    <View className="rounded-3xl border p-5" style={{ backgroundColor: c.cardSurface, borderColor: c.borderColor }}>
      {/* Header */}
      <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: c.borderSubtle }}>
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12, flex: 1 }}>
          <View
            className="h-10 w-10 items-center justify-center rounded-2xl border bg-blue-500/10"
            style={{ borderColor: "rgba(59,130,246,0.2)" }}
          >
            <BookOpen size={20} color="#60a5fa" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <T style={{ fontSize: 14, fontWeight: "700", color: c.textPrimary }}>
                {isRTL ? "Ú˜ÙˆØ±Ù†Ø§Ù„ Ùˆ Ø¨Ø§Ø²ØªØ§Ø¨ Ø±ÙˆØ²Ø§Ù†Ù‡" : "Daily Journal & Reflections"}
              </T>
              {todayNote && (
                <View
                  className="flex-row items-center rounded-full border bg-blue-500/10 px-2 py-0.5"
                  style={{ borderColor: "rgba(59,130,246,0.3)", gap: 4, flexDirection: isRTL ? "row-reverse" : "row" }}
                >
                  <Check size={12} color="#60a5fa" />
                  <T style={{ fontSize: 10, color: "#60a5fa" }}>
                    {isRTL ? "Ø§Ù…Ø±ÙˆØ² Ø«Ø¨Øª Ø´Ø¯" : "Recorded today"}
                  </T>
                </View>
              )}
            </View>
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6, marginTop: 2 }}>
              <Calendar size={12} color="#60a5fa" />
              <T style={{ fontSize: 12, color: c.textMuted }}>{dateDisplay}</T>
            </View>
          </View>
        </View>

        {/* Mood Selector Pills */}
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {moods.map((m) => {
            const Icon = m.icon;
            const isSelected = selectedMood === m.id;
            return (
              <Pressable
                key={m.id}
                onPress={() => setSelectedMood(m.id)}
                style={({ pressed }) => ({
                  flexDirection: isRTL ? "row-reverse" : "row",
                  alignItems: "center",
                  gap: 6,
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderWidth: 1,
                  borderColor: isSelected ? m.color : c.borderColor,
                  backgroundColor: isSelected ? c.accentBlueSubtle : c.bgElevated,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Icon size={14} color={isSelected ? m.color : c.textMuted} />
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Quick Prompt Starters */}
      <View style={{ marginBottom: 14, flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4 }}>
          <Sparkles size={12} color="#fbbf24" />
          <T style={{ fontSize: 11, color: c.textMuted }}>
            {isRTL ? "Ø³Ø±Ù†Ø®â€ŒÙ‡Ø§ÛŒ ÙÚ©Ø±ÛŒ:" : "Thought Prompts:"}
          </T>
        </View>
        {promptChips.map((chip, idx) => (
          <Pressable
            key={idx}
            onPress={() => handleAppendPrompt(chip.text)}
            style={({ pressed }) => ({
              borderRadius: 12,
              borderWidth: 1,
              borderColor: c.borderColor,
              backgroundColor: pressed ? c.bgHover : c.bgElevated,
              paddingHorizontal: 10,
              paddingVertical: 4,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <T style={{ fontSize: 11, color: c.textSecondary }}>{chip.label}</T>
          </Pressable>
        ))}
      </View>

      {/* Main Journal Textarea */}
      <Input
        value={reflectionText}
        onChangeText={setReflectionText}
        multiline
        placeholder={
          isRTL
            ? "Ø§Ù…Ø±ÙˆØ² Ú†Ú¯ÙˆÙ†Ù‡ Ø³Ù¾Ø±ÛŒ Ø´Ø¯ØŸ Ú†Ù‡ Ø¢Ù…ÙˆØ®ØªÛŒØŸ Ø¨Ø²Ø±Ú¯â€ŒØªØ±ÛŒÙ† Ù…Ø§Ù†Ø¹ ÛŒØ§ Ø¯Ø³ØªØ§ÙˆØ±Ø¯Øª Ú†Ù‡ Ø¨ÙˆØ¯ØŸ Ø§ÙÚ©Ø§Ø±Øª Ø±Ø§ Ø¢Ø²Ø§Ø¯Ø§Ù†Ù‡ Ø¨Ù†ÙˆÛŒØ³..."
            : "How did today unfold? What lessons emerged? Note your daily wins, hurdles, and thoughts freely..."
        }
        style={{
          width: "100%",
          borderRadius: 16,
          borderWidth: 1,
          borderColor: c.borderColor,
          backgroundColor: c.bgSubtle,
          padding: 16,
          fontSize: 13,
          minHeight: 110,
          textAlignVertical: "top",
        }}
      />

      {/* Footer Controls: Auto-save status, Clear, and Save Button */}
      <View
        style={{
          marginTop: 14,
          flexDirection: isRTL ? "row-reverse" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: c.borderSubtle,
          flexWrap: "wrap",
        }}
      >
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12 }}>
          {autoSavedTime && (
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
              <Save size={12} color="#60a5fa" />
              <T style={{ fontSize: 10, color: "#60a5fa" }}>
                {isRTL ? `Ù¾ÛŒØ´â€ŒÙ†ÙˆÛŒØ³ Ø°Ø®ÛŒØ±Ù‡ Ø´Ø¯ (${autoSavedTime})` : `Draft saved (${autoSavedTime})`}
              </T>
            </View>
          )}
          <T style={{ fontSize: 11, color: c.textMuted }}>
            {reflectionText.length} {isRTL ? "Ú©Ø§Ø±Ø§Ú©ØªØ±" : "chars"}
          </T>
        </View>

        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
          {hasDraft && (
            <Pressable
              onPress={handleClear}
              style={({ pressed }) => ({
                flexDirection: isRTL ? "row-reverse" : "row",
                alignItems: "center",
                gap: 4,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: c.borderColor,
                backgroundColor: c.bgElevated,
                paddingHorizontal: 12,
                paddingVertical: 6,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <RotateCcw size={12} color={c.textMuted} />
              <T style={{ fontSize: 12, color: c.textMuted }}>{isRTL ? "Ù¾Ø§Ú©â€ŒØ³Ø§Ø²ÛŒ" : "Clear"}</T>
            </Pressable>
          )}

          {todayNote && (
            <Pressable
              onPress={() => {
                setSelectedNoteId(todayNote.id);
                setActiveView("notes");
              }}
              style={({ pressed }) => ({
                flexDirection: isRTL ? "row-reverse" : "row",
                alignItems: "center",
                gap: 4,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: c.borderColor,
                backgroundColor: c.bgElevated,
                paddingHorizontal: 12,
                paddingVertical: 6,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <FileText size={12} color="#60a5fa" />
              <T style={{ fontSize: 12, color: c.textSecondary }}>
                {isRTL ? "Ù…Ø´Ø§Ù‡Ø¯Ù‡ ÛŒØ§Ø¯Ø¯Ø§Ø´Øª" : "View Note"}
              </T>
            </Pressable>
          )}

          <Pressable
            onPress={handleSaveToNotes}
            disabled={!hasDraft}
            style={({ pressed }) => ({
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              gap: 6,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: hasDraft ? "#2563eb" : c.bgHover,
              opacity: !hasDraft ? 0.5 : pressed ? 0.85 : 1,
            })}
          >
            <Save size={14} color={hasDraft ? "#ffffff" : c.textMuted} />
            <T style={{ fontSize: 12, fontWeight: "700", color: hasDraft ? "#ffffff" : c.textMuted }}>
              {isRTL ? "Ø°Ø®ÛŒØ±Ù‡ Ø¯Ø± ÛŒØ§Ø¯Ø¯Ø§Ø´Øªâ€ŒÙ‡Ø§ÛŒ Ù…ØºØ² Ø¯ÙˆÙ…" : "Save to Notes"}
            </T>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
