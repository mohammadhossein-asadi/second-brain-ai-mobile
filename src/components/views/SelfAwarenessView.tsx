import React, { useState } from "react";
import { View, Pressable, ScrollView, Linking } from "react-native";
import { Alert } from "react-native";
import Slider from "@react-native-community/slider";
import {
  Compass,
  Plus,
  Video,
  BookOpen,
  FileText,
  Sparkles,
  Trash2,
  ExternalLink,
  Star,
  CheckCircle2,
} from "lucide-react-native";
import { useSecondBrain } from "../../context/SecondBrainContext";
import { SelfAwareness, SelfAwarenessType } from "../../types";
import { GeminiJournalSentimentSection } from "./GeminiJournalSentimentSection";
import { T, Input, Select, ModalShell, Btn } from "../ui/primitives";

export const SelfAwarenessView: React.FC = () => {
  const {
    selfAwareness,
    addSelfAwareness,
    deleteSelfAwareness,
    toggleSelfAwarenessCompleted,
    isRTL,
    t,
  } = useSecondBrain();

  const [activeType, setActiveType] = useState<SelfAwarenessType | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [title, setTitle] = useState("");
  const [type, setType] = useState<SelfAwarenessType>("documentary");
  const [keyInsights, setKeyInsights] = useState("");
  const [impactRating, setImpactRating] = useState<number>(5);
  const [link, setLink] = useState("");

  const filteredItems = (selfAwareness || []).filter((item) => {
    if (activeType !== "all" && item.type !== activeType) return false;
    return true;
  });

  const handleSave = () => {
    if (!title.trim()) return;

    addSelfAwareness({
      title: title.trim(),
      name: title.trim(),
      type,
      keyInsights: keyInsights.trim(),
      notes: keyInsights.trim(),
      impactRating,
      link: link.trim() || undefined,
      isCompleted: false,
    });

    setTitle("");
    setKeyInsights("");
    setLink("");
    setIsModalOpen(false);
  };

  const confirmDelete = (item: SelfAwareness) => {
    Alert.alert(t.common.delete, t.common.deleteConfirm, [
      { text: t.common.cancel, style: "cancel" },
      { text: t.common.delete, style: "destructive", onPress: () => deleteSelfAwareness(item.id) },
    ]);
  };

  const getIcon = (itemType: SelfAwarenessType) => {
    switch (itemType) {
      case "documentary":
        return <Video size={16} color="#fb7185" />;
      case "book":
        return <BookOpen size={16} color="#c084fc" />;
      case "article":
        return <FileText size={16} color="#38bdf8" />;
      default:
        return <Sparkles size={16} color="#fbbf24" />;
    }
  };

  const tabs: { id: SelfAwarenessType | "all"; label: string }[] = [
    { id: "all", label: t.views.selfAwareness.allEntries },
    { id: "documentary", label: t.views.selfAwareness.documentaries },
    { id: "book", label: t.views.selfAwareness.books },
    { id: "article", label: t.views.selfAwareness.articles },
    { id: "reflection", label: t.views.selfAwareness.insights },
  ];

  const labelStyle = { fontSize: 12, fontWeight: "600" as const, color: "#d4d4d4", marginBottom: 6 };
  const inputStyle = {
    width: "100%" as const,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#262626",
    backgroundColor: "rgba(23,23,23,0.8)",
    padding: 10,
    fontSize: 12,
    color: "#ffffff",
  };

  return (
    <View className="gap-6 pb-12">
      {/* Header Bento Card */}
      <View
        className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6"
        style={{ gap: 16 }}
      >
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12 }}>
          <View className="h-11 w-11 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-950">
            <Compass size={24} color="#60a5fa" />
          </View>
          <View style={{ flex: 1 }}>
            <T style={{ fontSize: 14, fontWeight: "700", color: "#ffffff" }}>
              {t.views.selfAwareness.title}
            </T>
            <T style={{ fontSize: 12, color: "#a3a3a3", marginTop: 2 }}>
              {t.views.selfAwareness.subtitle}
            </T>
          </View>
        </View>

        <Btn
          title={t.views.selfAwareness.newItem}
          onPress={() => setIsModalOpen(true)}
          icon={<Plus size={16} color="#ffffff" />}
        />
      </View>

      {/* Gemini AI Journal Sentiment & Mood Trends */}
      <GeminiJournalSentimentSection />

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 6 }}>
          {tabs.map((tab) => (
            <Pressable
              key={tab.id}
              onPress={() => setActiveType(tab.id)}
              style={({ pressed }) => ({
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 9,
                minHeight: 40,
                justifyContent: "center",
                borderWidth: 1,
                borderColor: activeType === tab.id ? "#404040" : "#262626",
                backgroundColor: activeType === tab.id ? "#262626" : "#171717",
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <T
                style={{
                  fontSize: 12,
                  fontWeight: activeType === tab.id ? "700" : "400",
                  color: activeType === tab.id ? "#60a5fa" : "#a3a3a3",
                }}
              >
                {tab.label}
              </T>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Self-Awareness Items */}
      <View className="gap-5">
        {filteredItems.length === 0 ? (
          <T style={{ paddingVertical: 64, textAlign: "center", fontSize: 12, color: "#a3a3a3" }}>
            {t.views.selfAwareness.noItemsFound}
          </T>
        ) : (
          filteredItems.map((item) => (
            <View key={item.id} className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6">
              <View>
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
                    <View className="h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950">
                      {getIcon(item.type)}
                    </View>
                    <View className="rounded-full border border-neutral-800 bg-neutral-900 px-2.5 py-0.5">
                      <T style={{ fontSize: 12, color: "#a3a3a3" }}>{item.type}</T>
                    </View>
                  </View>

                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4 }}>
                    <Pressable
                      onPress={() => toggleSelfAwarenessCompleted(item.id)}
                      style={{
                        borderRadius: 12,
                        padding: 6,
                        backgroundColor: item.isCompleted ? "rgba(23,37,84,0.4)" : "transparent",
                      }}
                    >
                      <CheckCircle2 size={16} color={item.isCompleted ? "#60a5fa" : "#737373"} />
                    </Pressable>
                    <Pressable onPress={() => confirmDelete(item)} className="rounded-xl p-1.5">
                      <Trash2 size={14} color="#a3a3a3" />
                    </Pressable>
                  </View>
                </View>

                <T style={{ marginTop: 16, fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
                  {item.title || item.name}
                </T>

                {/* Impact rating stars */}
                {item.impactRating !== undefined ? (
                  <View style={{ marginTop: 12, flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        color={star <= (item.impactRating || 0) ? "#fbbf24" : "#404040"}
                        fill={star <= (item.impactRating || 0) ? "#fbbf24" : "transparent"}
                      />
                    ))}
                    <T style={{ marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0, fontSize: 12, color: "#a3a3a3" }}>
                      {t.views.selfAwareness.impactRating}: {item.impactRating}/5
                    </T>
                  </View>
                ) : null}

                {item.keyInsights || item.notes ? (
                  <View className="mt-4 rounded-2xl border border-neutral-800/80 bg-neutral-950/80 p-3">
                    <T style={{ fontSize: 11, fontWeight: "600", color: "#737373", marginBottom: 4 }}>
                      {t.views.selfAwareness.keyInsight}:
                    </T>
                    <T style={{ fontSize: 12, color: "#d4d4d4", lineHeight: 19 }}>
                      {item.keyInsights || item.notes}
                    </T>
                  </View>
                ) : null}
              </View>

              {/* Link */}
              {item.link ? (
                <View
                  style={{
                    marginTop: 20,
                    paddingTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: "rgba(38,38,38,0.8)",
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                  }}
                >
                  <Pressable
                    onPress={() => Linking.openURL(item.link!)}
                    style={({ pressed }) => ({
                      flexDirection: isRTL ? "row-reverse" : "row",
                      alignItems: "center",
                      gap: 6,
                      opacity: pressed ? 0.7 : 1,
                    })}
                  >
                    <ExternalLink size={14} color="#38bdf8" />
                    <T style={{ fontSize: 12, fontWeight: "600", color: "#38bdf8" }}>
                      {t.views.selfAwareness.linkLabel}
                    </T>
                  </Pressable>
                </View>
              ) : null}
            </View>
          ))
        )}
      </View>

      {/* CREATE MODAL */}
      <ModalShell visible={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth={440}>
        <ScrollView>
          <View style={{ padding: 20 }}>
            <View
              style={{
                flexDirection: isRTL ? "row-reverse" : "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottomWidth: 1,
                borderBottomColor: "#262626",
                paddingBottom: 16,
              }}
            >
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
                <Compass size={16} color="#60a5fa" />
                <T style={{ fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
                  {t.views.selfAwareness.createModalTitle}
                </T>
              </View>
              <Pressable onPress={() => setIsModalOpen(false)} className="rounded-xl p-1.5">
                <T style={{ fontSize: 16, color: "#a3a3a3" }}>✕</T>
              </Pressable>
            </View>

            <View style={{ marginTop: 16, gap: 16 }}>
              <View>
                <T style={labelStyle}>{t.views.selfAwareness.itemTitleLabel}</T>
                <Input value={title} onChangeText={setTitle} style={inputStyle} />
              </View>

              <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
                <View style={{ flex: 1, minWidth: "45%" }}>
                  <T style={labelStyle}>{isRTL ? "نوع مورد" : "Type"}</T>
                  <Select
                    value={type}
                    options={[
                      { value: "documentary" as SelfAwarenessType, label: t.views.selfAwareness.documentaries },
                      { value: "book" as SelfAwarenessType, label: t.views.selfAwareness.books },
                      { value: "article" as SelfAwarenessType, label: t.views.selfAwareness.articles },
                      { value: "reflection" as SelfAwarenessType, label: t.views.selfAwareness.insights },
                    ]}
                    onChange={setType}
                  />
                </View>

                <View style={{ flex: 1, minWidth: "45%" }}>
                  <T style={labelStyle}>
                    {t.views.selfAwareness.impactRating} ({impactRating} / 5)
                  </T>
                  <Slider
                    minimumValue={1}
                    maximumValue={5}
                    step={1}
                    value={impactRating}
                    onValueChange={setImpactRating}
                    minimumTrackTintColor="#60a5fa"
                    maximumTrackTintColor="#262626"
                    thumbTintColor="#60a5fa"
                  />
                </View>
              </View>

              <View>
                <T style={labelStyle}>{t.views.selfAwareness.insightLabel}</T>
                <Input
                  multiline
                  value={keyInsights}
                  onChangeText={setKeyInsights}
                  style={[inputStyle, { minHeight: 70, textAlignVertical: "top" }]}
                />
              </View>

              <View>
                <T style={labelStyle}>{t.views.selfAwareness.linkLabel}</T>
                <Input value={link} onChangeText={setLink} placeholder="https://..." autoCapitalize="none" style={inputStyle} />
              </View>

              <View
                style={{
                  flexDirection: isRTL ? "row-reverse" : "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 8,
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: "#262626",
                }}
              >
                <Btn title={t.common.cancel} variant="ghost" onPress={() => setIsModalOpen(false)} />
                <Btn title={t.common.add} onPress={handleSave} />
              </View>
            </View>
          </View>
        </ScrollView>
      </ModalShell>
    </View>
  );
};
