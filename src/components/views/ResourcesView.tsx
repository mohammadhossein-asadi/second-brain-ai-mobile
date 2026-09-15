import React, { useState } from "react";
import { View, Pressable, ScrollView, Linking } from "react-native";
import { Alert } from "react-native";
import {
  BookOpen,
  Plus,
  Star,
  ExternalLink,
  Trash2,
  Headphones,
  GraduationCap,
  Globe,
} from "lucide-react-native";
import { useAppStore } from "../../context/AppContext";
import { Resource, ResourceType } from "../../types";
import { T, Input, Select, ModalShell, Btn } from "../ui/primitives";

export const ResourcesView: React.FC = () => {
  const { resources, addResource, updateResource, deleteResource, isRTL, t } = useAppStore();

  const [activeType, setActiveType] = useState<ResourceType | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [type, setType] = useState<ResourceType>("book");
  const [status, setStatus] = useState<"to_read" | "reading" | "finished">("reading");
  const [rating, setRating] = useState<number>(5);
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");

  const filteredResources = resources.filter((r) => {
    if (activeType !== "all" && r.type !== activeType) return false;
    return true;
  });

  const handleSave = () => {
    if (!title.trim()) return;

    addResource({
      title: title.trim(),
      author: author.trim() || undefined,
      type,
      status,
      rating,
      url: url.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setTitle("");
    setAuthor("");
    setUrl("");
    setNotes("");
    setIsModalOpen(false);
  };

  const confirmDelete = (res: Resource) => {
    Alert.alert(t.common.delete, t.common.deleteConfirm, [
      { text: t.common.cancel, style: "cancel" },
      { text: t.common.delete, style: "destructive", onPress: () => deleteResource(res.id) },
    ]);
  };

  const getResourceIcon = (itemType?: ResourceType) => {
    switch (itemType) {
      case "podcast":
        return <Headphones size={16} color="#c084fc" />;
      case "course":
        return <GraduationCap size={16} color="#60a5fa" />;
      case "website":
        return <Globe size={16} color="#22d3ee" />;
      default:
        return <BookOpen size={16} color="#fbbf24" />;
    }
  };

  const statusBadge = (s?: string) => {
    const map: Record<string, { bg: string; border: string; color: string }> = {
      finished: { bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)", color: "#60a5fa" },
      reading: { bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.2)", color: "#818cf8" },
    };
    const v = map[s || ""] || { bg: "#171717", border: "#262626", color: "#a3a3a3" };
    const label =
      s === "finished" ? t.views.resources.finished : s === "reading" ? t.views.resources.reading : t.views.resources.toRead;
    return (
      <View className="rounded-full border px-2.5 py-0.5" style={{ backgroundColor: v.bg, borderColor: v.border }}>
        <T style={{ fontSize: 12, fontWeight: "600", color: v.color }}>{label}</T>
      </View>
    );
  };

  const tabs: { id: ResourceType | "all"; label: string }[] = [
    { id: "all", label: t.views.resources.allTypes },
    { id: "book", label: t.views.resources.books },
    { id: "course", label: t.views.resources.courses },
    { id: "podcast", label: t.views.resources.podcasts },
    { id: "website", label: t.views.resources.websites },
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
      {/* Top Bar */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
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

        <Btn
          title={t.views.resources.newResource}
          onPress={() => setIsModalOpen(true)}
          icon={<Plus size={16} color="#ffffff" />}
        />
      </View>

      {/* Resources Grid */}
      <View className="gap-5">
        {filteredResources.length === 0 ? (
          <T style={{ paddingVertical: 64, textAlign: "center", fontSize: 12, color: "#a3a3a3" }}>
            {t.views.resources.noResourcesFound}
          </T>
        ) : (
          filteredResources.map((res) => (
            <View key={res.id} className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6">
              <View>
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
                    <View className="h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950">
                      {getResourceIcon(res.type)}
                    </View>
                    {statusBadge(res.status)}
                  </View>

                  <Pressable onPress={() => confirmDelete(res)} className="rounded-xl p-1.5">
                    <Trash2 size={14} color="#a3a3a3" />
                  </Pressable>
                </View>

                <T style={{ marginTop: 16, fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
                  {res.title || res.name}
                </T>

                {res.author ? (
                  <T style={{ marginTop: 4, fontSize: 12, color: "#a3a3a3" }}>
                    {t.views.resources.author}: {res.author}
                  </T>
                ) : null}

                {/* Star rating */}
                {res.rating !== undefined ? (
                  <View style={{ marginTop: 12, flexDirection: isRTL ? "row-reverse" : "row", gap: 4 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        color={star <= (res.rating || 0) ? "#fbbf24" : "#404040"}
                        fill={star <= (res.rating || 0) ? "#fbbf24" : "transparent"}
                      />
                    ))}
                  </View>
                ) : null}

                {res.notes ? (
                  <T numberOfLines={2} style={{ marginTop: 12, fontSize: 12, color: "#d4d4d4", lineHeight: 19 }}>
                    {res.notes}
                  </T>
                ) : null}
              </View>

              {/* URL + status change */}
              <View
                style={{
                  marginTop: 24,
                  paddingTop: 16,
                  borderTopWidth: 1,
                  borderTopColor: "rgba(38,38,38,0.8)",
                  flexDirection: isRTL ? "row-reverse" : "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                {res.url ? (
                  <Pressable
                    onPress={() => Linking.openURL(res.url!)}
                    style={({ pressed }) => ({
                      flexDirection: isRTL ? "row-reverse" : "row",
                      alignItems: "center",
                      gap: 6,
                      opacity: pressed ? 0.7 : 1,
                    })}
                  >
                    <ExternalLink size={14} color="#38bdf8" />
                    <T style={{ fontSize: 12, fontWeight: "600", color: "#38bdf8" }}>
                      {t.views.resources.openLink}
                    </T>
                  </Pressable>
                ) : (
                  <T style={{ fontSize: 12, color: "#525252" }}>—</T>
                )}

                <View style={{ width: 130 }}>
                  <Select
                    value={res.status}
                    options={[
                      { value: "to_read" as const, label: t.views.resources.toRead },
                      { value: "reading" as const, label: t.views.resources.reading },
                      { value: "finished" as const, label: t.views.resources.finished },
                    ]}
                    onChange={(v) =>
                      updateResource(res.id, { status: v as "to_read" | "reading" | "finished" })
                    }
                  />
                </View>
              </View>
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
                <BookOpen size={16} color="#60a5fa" />
                <T style={{ fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
                  {t.views.resources.createModalTitle}
                </T>
              </View>
              <Pressable onPress={() => setIsModalOpen(false)} className="rounded-xl p-1.5">
                <T style={{ fontSize: 16, color: "#a3a3a3" }}>✕</T>
              </Pressable>
            </View>

            <View style={{ marginTop: 16, gap: 16 }}>
              <View>
                <T style={labelStyle}>{t.views.resources.resourceTitleLabel}</T>
                <Input value={title} onChangeText={setTitle} style={inputStyle} />
              </View>

              <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
                <View style={{ flex: 1, minWidth: "45%" }}>
                  <T style={labelStyle}>{t.views.resources.authorLabel}</T>
                  <Input value={author} onChangeText={setAuthor} style={inputStyle} />
                </View>

                <View style={{ flex: 1, minWidth: "45%" }}>
                  <T style={labelStyle}>{t.common.category}</T>
                  <Select
                    value={type}
                    options={[
                      { value: "book" as ResourceType, label: t.views.resources.books },
                      { value: "course" as ResourceType, label: t.views.resources.courses },
                      { value: "podcast" as ResourceType, label: t.views.resources.podcasts },
                      { value: "website" as ResourceType, label: t.views.resources.websites },
                    ]}
                    onChange={setType}
                  />
                </View>
              </View>

              <View>
                <T style={labelStyle}>{t.views.resources.urlLabel}</T>
                <Input value={url} onChangeText={setUrl} placeholder="https://..." autoCapitalize="none" style={inputStyle} />
              </View>

              <View>
                <T style={labelStyle}>{t.views.resources.notesLabel}</T>
                <Input
                  multiline
                  value={notes}
                  onChangeText={setNotes}
                  style={[inputStyle, { minHeight: 60, textAlignVertical: "top" }]}
                />
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
