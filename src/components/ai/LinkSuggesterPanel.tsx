import React, { useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import {
  Link2,
  Sparkles,
  FolderKanban,
  Users,
  Check,
  ExternalLink,
  Plus,
  ChevronDown,
  ChevronUp,
  FileCode,
} from "lucide-react-native";
import { useAppStore } from "../../context/AppContext";
import { Note, SuggestedLink } from "../../types";
import { T, Spinner } from "../ui/primitives";

interface LinkSuggesterPanelProps {
  note: Note;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onInsertTextIntoContent?: (textToInsert: string) => void;
}

export const LinkSuggesterPanel: React.FC<LinkSuggesterPanelProps> = ({
  note,
  onUpdateNote,
  onInsertTextIntoContent,
}) => {
  const { suggestLinksForNote, setActiveView, isRTL, showToast } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedLinks, setSuggestedLinks] = useState<SuggestedLink[]>([]);
  const [hasScanned, setHasScanned] = useState(false);
  const [provider, setProvider] = useState<string>("");

  const linkedProjectIds = note.linkedProjectIds || [];
  const linkedContactIds = note.linkedContactIds || [];

  const handleScanLinks = async () => {
    setIsLoading(true);
    setIsOpen(true);
    try {
      const result = await suggestLinksForNote(note.title, note.content);
      setSuggestedLinks(result.links || []);
      setProvider(result.provider || "Gemini Knowledge Graph");
      setHasScanned(true);

      if (result.links && result.links.length > 0) {
        showToast(
          isRTL
            ? `${result.links.length} پیوند هوشمند به پروژه‌ها و مخاطبان یافت شد.`
            : `Found ${result.links.length} smart links to projects & contacts.`,
          "info"
        );
      } else {
        showToast(
          isRTL
            ? "هیچ پیوند مرتبطی با پروژه‌ها یا مخاطبان فعلی یافت نشد."
            : "No related links found in note content.",
          "info"
        );
      }
    } catch (err) {
      console.error("Error scanning links:", err);
      showToast(isRTL ? "خطا در تحلیل پیوندها" : "Error suggesting links", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleLink = (link: SuggestedLink) => {
    if (link.targetType === "project") {
      const isAlreadyLinked = linkedProjectIds.includes(link.targetId);
      const nextIds = isAlreadyLinked
        ? linkedProjectIds.filter((id) => id !== link.targetId)
        : [...linkedProjectIds, link.targetId];

      onUpdateNote(note.id, { linkedProjectIds: nextIds });
      showToast(
        isAlreadyLinked
          ? isRTL
            ? `اتصال به پروژه «${link.title}» حذف شد.`
            : `Unlinked from project "${link.title}".`
          : isRTL
          ? `پروژه «${link.title}» به یادداشت متصل شد.`
          : `Linked project "${link.title}" to note.`,
        "success"
      );
    } else {
      const isAlreadyLinked = linkedContactIds.includes(link.targetId);
      const nextIds = isAlreadyLinked
        ? linkedContactIds.filter((id) => id !== link.targetId)
        : [...linkedContactIds, link.targetId];

      onUpdateNote(note.id, { linkedContactIds: nextIds });
      showToast(
        isAlreadyLinked
          ? isRTL
            ? `اتصال به مخاطب «${link.title}» حذف شد.`
            : `Unlinked from contact "${link.title}".`
          : isRTL
          ? `مخاطب «${link.title}» به یادداشت متصل شد.`
          : `Linked contact "${link.title}" to note.`,
        "success"
      );
    }
  };

  const handleInsertLinkToContent = (link: SuggestedLink) => {
    const linkText =
      link.targetType === "project"
        ? `\n\n[[پروژه: ${link.title}]]`
        : `\n\n[@مخاطب: ${link.title}]`;

    if (onInsertTextIntoContent) {
      onInsertTextIntoContent(linkText);
    } else {
      onUpdateNote(note.id, {
        content: (note.content || "") + linkText,
      });
    }

    showToast(
      isRTL
        ? `پیوند «${link.title}» در متن یادداشت درج شد.`
        : `Link "${link.title}" inserted into note text.`,
      "success"
    );
  };

  const handleJumpToEntity = (link: SuggestedLink) => {
    if (link.targetType === "project") {
      setActiveView("projects");
    } else {
      setActiveView("contacts");
    }
  };

  const isLinkConnected = (link: SuggestedLink) => {
    if (link.targetType === "project") {
      return linkedProjectIds.includes(link.targetId);
    }
    return linkedContactIds.includes(link.targetId);
  };

  return (
    <View className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/60 p-3" style={{ gap: 12 }}>
      {/* Header Bar */}
      <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8, flex: 1 }}>
          <View
            className="h-7 w-7 items-center justify-center rounded-lg border bg-blue-500/10"
            style={{ borderColor: "rgba(59,130,246,0.2)" }}
          >
            <Link2 size={16} color="#60a5fa" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
              <T style={{ fontSize: 12, fontWeight: "700", color: "#e5e5e5" }}>
                {isRTL ? "پیوندساز هوشمند پایگاه دانش" : "AI Smart Link Suggester"}
              </T>
              <View className="rounded-full bg-blue-500/20 px-1.5 py-0.5">
                <T style={{ fontSize: 10, color: "#93c5fd" }}>Gemini</T>
              </View>
            </View>
            <T style={{ fontSize: 11, color: "#a3a3a3" }}>
              {isRTL
                ? "اسکن هوشمند متن یادداشت و پیشنهاد پیوند به پروژه‌ها و مخاطبان مرتبط"
                : "Scans note content to propose internal links to related projects & contacts"}
            </T>
          </View>
        </View>

        {/* Actions */}
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
          <Pressable
            onPress={handleScanLinks}
            disabled={isLoading}
            style={({ pressed }) => ({
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              gap: 6,
              borderRadius: 12,
              backgroundColor: "#2563eb",
              paddingHorizontal: 12,
              paddingVertical: 6,
              opacity: isLoading ? 0.5 : pressed ? 0.85 : 1,
            })}
          >
            {isLoading ? <Spinner size={14} color="#ffffff" /> : <Sparkles size={14} color="#ffffff" />}
            <T style={{ fontSize: 12, fontWeight: "600", color: "#ffffff" }}>
              {isLoading
                ? isRTL
                  ? "در حال اسکن..."
                  : "Scanning..."
                : isRTL
                ? "اسکن پیوندها"
                : "Scan Links"}
            </T>
          </Pressable>

          {hasScanned && (
            <Pressable
              onPress={() => setIsOpen(!isOpen)}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-1.5"
            >
              {isOpen ? <ChevronUp size={16} color="#a3a3a3" /> : <ChevronDown size={16} color="#a3a3a3" />}
            </Pressable>
          )}
        </View>
      </View>

      {/* Suggestion Results Body */}
      {isOpen && (
        <View style={{ gap: 12, paddingTop: 8, borderTopWidth: 1, borderTopColor: "rgba(38,38,38,0.8)" }}>
          {isLoading ? (
            <View style={{ alignItems: "center", paddingVertical: 24, gap: 8 }}>
              <Spinner size={24} />
              <T style={{ fontSize: 12, color: "#a3a3a3", textAlign: "center" }}>
                {isRTL
                  ? "در حال تحلیل ارتباطات معنایی با پروژه‌ها و مخاطبان شما..."
                  : "Analyzing contextual links with your projects and contacts..."}
              </T>
            </View>
          ) : suggestedLinks.length === 0 ? (
            <View className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4" style={{ gap: 6 }}>
              <T style={{ fontSize: 12, color: "#d4d4d4", textAlign: "center" }}>
                {isRTL
                  ? "هیچ نام پروژه یا مخاطبی در متن این یادداشت شناسایی نشد."
                  : "No matching project or contact names found in this note."}
              </T>
              <T style={{ fontSize: 11, color: "#737373", textAlign: "center" }}>
                {isRTL
                  ? "راهنما: با ذکر نام پروژه‌ها، کلمات کلیدی، یا نام اعضای تیم در متن یادداشت، پیوندساز هوشمند بلافاصله آن‌ها را پیشنهاد خواهد داد."
                  : "Tip: Mentioning project names or team member names will trigger contextual smart links."}
              </T>
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between" }}>
                <T style={{ fontSize: 11, color: "#a3a3a3" }}>
                  {isRTL
                    ? `${suggestedLinks.length} ارتباط کشف‌شده توسط ${provider}:`
                    : `${suggestedLinks.length} connections found by ${provider}:`}
                </T>
                <T style={{ fontSize: 10, color: "#737373" }}>
                  {isRTL ? "برای اتصال ضربه بزنید" : "Tap to link"}
                </T>
              </View>

              <View style={{ gap: 10 }}>
                {suggestedLinks.map((link) => {
                  const isConnected = isLinkConnected(link);
                  const isProject = link.targetType === "project";

                  return (
                    <View
                      key={`${link.targetType}-${link.targetId}`}
                      className="rounded-xl border p-3"
                      style={{
                        backgroundColor: isConnected ? "rgba(23,37,84,0.3)" : "rgba(10,10,10,0.7)",
                        borderColor: isConnected ? "rgba(59,130,246,0.4)" : "rgba(38,38,38,0.9)",
                        gap: 10,
                      }}
                    >
                      {/* Card Header */}
                      <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8, flex: 1 }}>
                          <View
                            className="h-7 w-7 shrink-0 items-center justify-center rounded-lg border"
                            style={{
                              backgroundColor: isProject ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)",
                              borderColor: isProject ? "rgba(245,158,11,0.2)" : "rgba(16,185,129,0.2)",
                            }}
                          >
                            {isProject ? (
                              <FolderKanban size={14} color="#fbbf24" />
                            ) : (
                              <Users size={14} color="#34d399" />
                            )}
                          </View>
                          <View style={{ flex: 1 }}>
                            <T numberOfLines={1} style={{ fontSize: 12, fontWeight: "700", color: "#ffffff" }}>
                              {link.title}
                            </T>
                            {link.subtitle ? (
                              <T numberOfLines={1} style={{ fontSize: 10, color: "#a3a3a3" }}>
                                {link.subtitle}
                              </T>
                            ) : null}
                          </View>
                        </View>

                        <View className="shrink-0 rounded-full border bg-blue-500/10 px-1.5 py-0.5" style={{ borderColor: "rgba(59,130,246,0.2)" }}>
                          <T style={{ fontSize: 10, color: "#60a5fa", fontWeight: "600" }}>
                            {Math.round(link.confidence * 100)}%
                          </T>
                        </View>
                      </View>

                      {/* Explanation Reason */}
                      {link.reason ? (
                        <View className="rounded-lg border border-neutral-800/60 bg-neutral-900/60 p-1.5">
                          <T style={{ fontSize: 11, color: "#d4d4d4", lineHeight: 17 }}>💡 {link.reason}</T>
                        </View>
                      ) : null}

                      {/* Card Actions */}
                      <View
                        style={{
                          flexDirection: isRTL ? "row-reverse" : "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 6,
                          paddingTop: 4,
                          borderTopWidth: 1,
                          borderTopColor: "rgba(38,38,38,0.6)",
                        }}
                      >
                        <Pressable
                          onPress={() => handleToggleLink(link)}
                          style={({ pressed }) => ({
                            flexDirection: isRTL ? "row-reverse" : "row",
                            alignItems: "center",
                            gap: 4,
                            borderRadius: 8,
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            backgroundColor: isConnected ? "#2563eb" : "#171717",
                            borderWidth: isConnected ? 0 : 1,
                            borderColor: "#404040",
                            opacity: pressed ? 0.85 : 1,
                          })}
                        >
                          {isConnected ? (
                            <>
                              <Check size={12} color="#ffffff" />
                              <T style={{ fontSize: 11, fontWeight: "600", color: "#ffffff" }}>
                                {isRTL ? "متصل شد" : "Linked"}
                              </T>
                            </>
                          ) : (
                            <>
                              <Plus size={12} color="#d4d4d4" />
                              <T style={{ fontSize: 11, fontWeight: "600", color: "#d4d4d4" }}>
                                {isRTL ? "اتصال" : "Link"}
                              </T>
                            </>
                          )}
                        </Pressable>

                        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4 }}>
                          <Pressable
                            onPress={() => handleInsertLinkToContent(link)}
                            style={({ pressed }) => ({
                              flexDirection: isRTL ? "row-reverse" : "row",
                              alignItems: "center",
                              gap: 4,
                              borderRadius: 8,
                              backgroundColor: "#171717",
                              borderWidth: 1,
                              borderColor: "#262626",
                              paddingHorizontal: 8,
                              paddingVertical: 4,
                              opacity: pressed ? 0.8 : 1,
                            })}
                          >
                            <FileCode size={12} color="#818cf8" />
                            <T style={{ fontSize: 11, color: "#d4d4d4" }}>
                              {isRTL ? "درج" : "Insert"}
                            </T>
                          </Pressable>

                          <Pressable
                            onPress={() => handleJumpToEntity(link)}
                            className="rounded-lg border border-neutral-800 bg-neutral-900 p-1"
                          >
                            <ExternalLink size={12} color="#a3a3a3" />
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};
