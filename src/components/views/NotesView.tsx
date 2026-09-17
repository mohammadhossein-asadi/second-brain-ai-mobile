import React, { useState, useMemo } from "react";
import { View, Pressable, ScrollView, TextInput } from "react-native";
import { Alert } from "react-native";
import {
  FileText,
  Plus,
  Pin,
  Trash2,
  Sparkles,
  Search,
  Eye,
  Edit3,
  Bookmark,
  Lightbulb,
  Users,
  BookOpen,
  Tag,
  ArrowLeft,
  ArrowRight,
  Check,
  Link2,
  FolderKanban,
  ExternalLink,
  X,
  Plus as PlusIcon,
  Filter,
  X as XIcon,
} from "lucide-react-native";
import { useSecondBrain } from "../../context/SecondBrainContext";
import { Note, NoteType, SuggestedCategory } from "../../types";
import { NotesSkeleton } from "./ViewSkeletons";
import { LinkSuggesterPanel } from "../ai/LinkSuggesterPanel";
import { EmptyState } from "../ui/EmptyState";
import { TagInput } from "../ui/TagInput";
import { T, Input, Select, ModalShell, Btn, Spinner } from "../ui/primitives";

const AVAILABLE_CATEGORIES = [
  { id: "Personal", name: "Personal", nameFa: "شخصی", icon: "🌱" },
  { id: "Work", name: "Work", nameFa: "کاری", icon: "💼" },
  { id: "Urgent", name: "Urgent", nameFa: "فوری", icon: "🚨" },
  { id: "Ideas", name: "Ideas", nameFa: "ایده‌ها", icon: "💡" },
  { id: "Study", name: "Study", nameFa: "مطالعه و یادگیری", icon: "📚" },
  { id: "Finance", name: "Finance", nameFa: "مالی", icon: "💰" },
];

export const NotesView: React.FC = () => {
  const {
    notes,
    selectedNoteId,
    setSelectedNoteId,
    addNote,
    updateNote,
    deleteNote,
    generateTagsForNote,
    suggestCategoriesForNote,
    suggestLinksForNote,
    generateOneSentenceSummary,
    generateMissingNoteSummaries,
    projects,
    contacts,
    setActiveView,
    isDataLoading,
    isRTL,
    t,
    showToast,
    localSearchQuery,
    selectedFolderId,
    folders,
    trackRecentItem,
    addFolder,
    updateFolder,
    deleteFolder,
    setIsManageFolderModalOpen,
    setFolderBeingEdited,
    renameTagGlobally,
    deleteTagGlobally,
    allWorkspaceTags,
    isOnboardingOpen,
    setIsOnboardingOpen,
    toggleFocusMode,
  } = useSecondBrain();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isAITagging, setIsAITagging] = useState(false);
  const [isSuggestingCategories, setIsSuggestingCategories] = useState(false);
  const [categorySuggestions, setCategorySuggestions] = useState<SuggestedCategory[]>([]);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isSummarizingAllNotes, setIsSummarizingAllNotes] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");
  const [isTagSuggestionsOpen, setIsTagSuggestionsOpen] = useState(false);
  const [tagHighlightedIndex, setTagHighlightedIndex] = useState(-1);
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);
  const [tagRenameState, setTagRenameState] = useState<{ oldTag: string; newTag: string; isGlobal: boolean } | null>(null);
  const [tagSearchInManager, setTagSearchInManager] = useState("");
  const [noteTagSuggestions, setNoteTagSuggestions] = useState<string[]>([]);
  const [activeTag, setActiveTag] = useState("");
  const [tagCounts, setTagCounts] = useState<Record<string, number>>({});
  const [workspaceUnusedTags, setWorkspaceUnusedTags] = useState<string[]>([]);
  // Mobile navigation state between list and editor
  const [mobileMode, setMobileMode] = useState<"list" | "editor">("list");

  const activeNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  // All unique tags across notes
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));

  const getCategoryStyle = (catName?: string) => {
    switch (catName?.toLowerCase()) {
      case "urgent":
        return { bg: "rgba(244,63,94,0.1)", color: "#fb7185", border: "rgba(244,63,94,0.3)", icon: "🚨" };
      case "work":
        return { bg: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "rgba(59,130,246,0.3)", icon: "💼" };
      case "personal":
        return { bg: "rgba(16,185,129,0.1)", color: "#34d399", border: "rgba(16,185,129,0.3)", icon: "🌱" };
      case "ideas":
        return { bg: "rgba(245,158,11,0.1)", color: "#fbbf24", border: "rgba(245,158,11,0.3)", icon: "💡" };
      case "study":
        return { bg: "rgba(168,85,247,0.1)", color: "#c084fc", border: "rgba(168,85,247,0.3)", icon: "📚" };
      case "finance":
        return { bg: "rgba(34,211,238,0.1)", color: "#22d3ee", border: "rgba(34,211,238,0.3)", icon: "💰" };
      default:
        return { bg: "rgba(38,38,38,0.8)", color: "#d4d4d4", border: "rgba(64,64,64,0.6)", icon: "🏷️" };
    }
  };

  const getCategoryLabel = (catName?: string) => {
    if (!catName) return "";
    const matched = AVAILABLE_CATEGORIES.find((c) => c.id.toLowerCase() === catName.toLowerCase());
    if (!matched) return catName;
    return isRTL ? matched.nameFa : matched.name;
  };

  const effectiveSearch = (searchQuery || localSearchQuery).trim().toLowerCase();
  const filteredNotes = notes.filter((n) => {
    if (
      selectedCategoryFilter !== "all" &&
      n.category?.toLowerCase() !== selectedCategoryFilter.toLowerCase()
    ) {
      return false;
    }
    if (selectedTag !== "all" && !n.tags.includes(selectedTag)) return false;
    if (selectedFolderId) {
      const folder = folders.find((f) => f.id === selectedFolderId);
      if (folder && (!folder.itemIds?.noteIds || !folder.itemIds.noteIds.includes(n.id))) {
        return false;
      }
    }
    if (
      effectiveSearch &&
      !n.title.toLowerCase().includes(effectiveSearch) &&
      !n.content.toLowerCase().includes(effectiveSearch)
    ) {
      return false;
    }
    return true;
  });

  const handleCreateNewNote = () => {
    const defaultContent = isRTL
      ? "شروع به نوشتن در مغز دوم کنید...\n\n- نکته ۱\n- نکته ۲\n\nمی‌توانید با استفاده از [[نام یادداشت]] به یادداشت‌های دیگر پیوند بدهید."
      : "Start capturing thoughts in your second brain...\n\n- Key point 1\n- Key point 2\n\nYou can link to other notes using [[Note Title]].";

    const newNote = addNote({
      title: isRTL ? "یادداشت جدید بدون عنوان" : "Untitled New Note",
      content: defaultContent,
      type: "note",
      category: "Personal",
      isPinned: false,
      isArchived: false,
      tags: isRTL ? ["پیش‌نویس"] : ["draft"],
    });
    setSelectedNoteId(newNote.id);
    trackRecentItem({
      itemId: newNote.id,
      type: "note",
      title: newNote.title,
      view: "notes",
    });
    setCategorySuggestions([]);
    setIsPreviewMode(false);
    setMobileMode("editor");
  };

  const handleAIEnhance = async () => {
    if (!activeNote) return;
    setIsAITagging(true);
    try {
      const result = await generateTagsForNote(activeNote.title, activeNote.content);
      updateNote(activeNote.id, {
        summary: result.summary,
        tags: Array.from(new Set([...activeNote.tags, ...result.tags])),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsAITagging(false);
    }
  };

  const handleSuggestCategories = async () => {
    if (!activeNote) return;
    setIsSuggestingCategories(true);
    try {
      const result = await suggestCategoriesForNote(activeNote.title, activeNote.content);
      if (result && result.suggestedCategories && result.suggestedCategories.length > 0) {
        setCategorySuggestions(result.suggestedCategories);
      }
    } catch (err) {
      console.error("Gemini category suggestion error:", err);
    } finally {
      setIsSuggestingCategories(false);
    }
  };

  const handleGenerateOneSentenceSummary = async () => {
    if (!activeNote) return;
    setIsGeneratingSummary(true);
    try {
      const summary = await generateOneSentenceSummary(activeNote.title, activeNote.content);
      updateNote(activeNote.id, { summary });
      showToast(
        isRTL
          ? "خلاصه تک‌جمله‌ای هوشمند با موفقیت تولید شد."
          : "One-sentence smart summary generated successfully.",
        "success"
      );
    } catch (err) {
      console.error("Gemini summary error:", err);
      showToast(isRTL ? "خطا در تولید خلاصه" : "Error generating summary", "error");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleAutoSummarizeAllNotes = async () => {
    setIsSummarizingAllNotes(true);
    try {
      await generateMissingNoteSummaries();
    } catch (err) {
      console.error("Auto summarize all notes error:", err);
    } finally {
      setIsSummarizingAllNotes(false);
    }
  };

  const handleApplyCategory = (catName: string, catNameFa?: string) => {
    if (!activeNote) return;
    const tagToAdd = isRTL && catNameFa ? catNameFa : catName;
    const updatedTags = activeNote.tags.includes(tagToAdd)
      ? activeNote.tags
      : [...activeNote.tags, tagToAdd];
    updateNote(activeNote.id, {
      category: catName,
      tags: updatedTags,
    });
  };

  const handleAddTag = () => {
    if (!newTagInput.trim() || !activeNote) return;
    const cleanTag = newTagInput.trim().replace(/^#/, "");
    if (!activeNote.tags.includes(cleanTag)) {
      updateNote(activeNote.id, {
        tags: [...activeNote.tags, cleanTag],
      });
    }
    setNewTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!activeNote) return;
    updateNote(activeNote.id, {
      tags: activeNote.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const confirmDeleteNote = () => {
    if (!activeNote) return;
    Alert.alert(t.common.delete, t.common.deleteConfirm, [
      { text: t.common.cancel, style: "cancel" },
      {
        text: t.common.delete,
        style: "destructive",
        onPress: () => {
          deleteNote(activeNote.id);
          setMobileMode("list");
        },
      },
    ]);
  };

  const getTypeIcon = (type: NoteType) => {
    switch (type) {
      case "idea":
        return <Lightbulb size={16} color="#fbbf24" />;
      case "meeting":
        return <Users size={16} color="#60a5fa" />;
      case "book_summary":
        return <BookOpen size={16} color="#c084fc" />;
      case "bookmark":
        return <Bookmark size={16} color="#22d3ee" />;
      default:
        return <FileText size={16} color="#a3a3a3" />;
    }
  };

  const BackIcon = isRTL ? ArrowLeft : ArrowRight;

  const linkedProjects = projects.filter((p) =>
    (activeNote?.linkedProjectIds || []).includes(p.id)
  );
  const linkedContacts = contacts.filter((c) =>
    (activeNote?.linkedContactIds || []).includes(c.id)
  );

  if (isDataLoading) {
    return <NotesSkeleton />;
  }

  const toolbarBtnStyle = {
    flexDirection: isRTL ? ("row-reverse" as const) : ("row" as const),
    alignItems: "center" as const,
    gap: 6,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  };

  return (
    <View className="w-full overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/60">
      {/* SIDEBAR: NOTES LIST (visible in list mode) */}
      {mobileMode === "list" && (
        <View style={{ flex: 1, backgroundColor: "rgba(10,10,10,0.7)" }}>
          {/* Top bar */}
          <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: "#262626", gap: 12 }}>
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
                <T style={{ fontSize: 13, fontWeight: "700", color: "#ffffff" }}>{t.views.notes.title}</T>
                <T style={{ fontSize: 12, color: "#a3a3a3" }}>({notes.length})</T>
              </View>
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
                <Pressable
                  onPress={handleAutoSummarizeAllNotes}
                  disabled={isSummarizingAllNotes}
                  style={({ pressed }) => [
                    toolbarBtnStyle,
                    {
                      borderWidth: 1,
                      borderColor: "rgba(59,130,246,0.3)",
                      backgroundColor: pressed ? "rgba(59,130,246,0.2)" : "rgba(59,130,246,0.1)",
                      opacity: isSummarizingAllNotes ? 0.5 : 1,
                    },
                  ]}
                >
                  {isSummarizingAllNotes ? (
                    <Spinner size={14} color="#60a5fa" />
                  ) : (
                    <Sparkles size={14} color="#fbbf24" />
                  )}
                  <T style={{ fontSize: 12, fontWeight: "600", color: "#93c5fd" }}>
                    {isSummarizingAllNotes
                      ? isRTL ? "خلاصه‌سازی..." : "..."
                      : isRTL ? "خلاصه همگانی" : "Auto-Summarize"}
                  </T>
                </Pressable>

                <Pressable
                  onPress={handleCreateNewNote}
                  style={({ pressed }) => [
                    toolbarBtnStyle,
                    {
                      backgroundColor: pressed ? "#3b82f6" : "#2563eb",
                    },
                  ]}
                >
                  <Plus size={16} color="#ffffff" />
                  <T style={{ fontSize: 12, fontWeight: "600", color: "#ffffff" }}>
                    {t.views.notes.newNote}
                  </T>
                </Pressable>
              </View>
            </View>

            {/* Search box */}
            <View
              style={{
                flexDirection: isRTL ? "row-reverse" : "row",
                alignItems: "center",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#262626",
                backgroundColor: "rgba(23,23,23,0.8)",
                paddingHorizontal: 12,
                paddingVertical: 8,
                gap: 8,
              }}
            >
              <Search size={16} color="#737373" />
              <Input
                placeholder={t.views.notes.searchPlaceholder}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{ flex: 1, fontSize: 12, color: "#ffffff", paddingVertical: 0 }}
              />
            </View>

            {/* Category filter pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 6 }}>
                <Pressable
                  onPress={() => setSelectedCategoryFilter("all")}
                  style={({ pressed }) => ({
                    borderRadius: 999,
                    paddingHorizontal: 10,
                    paddingVertical: 2,
                    backgroundColor: selectedCategoryFilter === "all" ? "#2563eb" : "#171717",
                    borderWidth: 1,
                    borderColor: selectedCategoryFilter === "all" ? "#2563eb" : "#262626",
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <T
                    style={{
                      fontSize: 11,
                      fontWeight: selectedCategoryFilter === "all" ? "700" : "500",
                      color: selectedCategoryFilter === "all" ? "#ffffff" : "#a3a3a3",
                    }}
                  >
                    {t.common.all}
                  </T>
                </Pressable>
                {AVAILABLE_CATEGORIES.map((cat) => {
                  const isCatSelected = selectedCategoryFilter.toLowerCase() === cat.id.toLowerCase();
                  return (
                    <Pressable
                      key={cat.id}
                      onPress={() => setSelectedCategoryFilter(cat.id)}
                      style={({ pressed }) => ({
                        flexDirection: isRTL ? "row-reverse" : "row",
                        alignItems: "center",
                        gap: 4,
                        borderRadius: 999,
                        paddingHorizontal: 10,
                        paddingVertical: 2,
                        backgroundColor: isCatSelected ? "#262626" : "#171717",
                        borderWidth: 1,
                        borderColor: isCatSelected ? "#525252" : "#262626",
                        opacity: pressed ? 0.8 : 1,
                      })}
                    >
                      <T style={{ fontSize: 11 }}>{cat.icon}</T>
                      <T
                        style={{
                          fontSize: 11,
                          fontWeight: isCatSelected ? "700" : "500",
                          color: isCatSelected ? "#60a5fa" : "#a3a3a3",
                        }}
                      >
                        {isRTL ? cat.nameFa : cat.name}
                      </T>
                    </Pressable>
                  );
                }) }
              </View>
            </ScrollView>

            {/* Tag filter pills */}
            {allTags.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 6 }}>
                  <Pressable
                    onPress={() => setSelectedTag("all")}
                    style={{ paddingHorizontal: 8, paddingVertical: 2 }}
                  >
                    <T
                      style={{
                        fontSize: 10,
                        fontWeight: selectedTag === "all" ? "700" : "400",
                        color: selectedTag === "all" ? "#e5e5e5" : "#737373",
                      }}
                    >
                      #{t.common.all}
                    </T>
                  </Pressable>
                  {allTags.map((tag) => (
                    <Pressable key={tag} onPress={() => setSelectedTag(tag)} style={{ paddingHorizontal: 8, paddingVertical: 2 }}>
                      <T
                        style={{
                          fontSize: 10,
                          fontWeight: selectedTag === tag ? "700" : "400",
                          color: selectedTag === tag ? "#60a5fa" : "#737373",
                        }}
                      >
                        #{tag}
                      </T>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>

          {/* Notes Items List */}
          <ScrollView style={{ maxHeight: 480 }} contentContainerStyle={{ padding: 12, gap: 8 }}>
            {filteredNotes.length === 0 ? (
              <T style={{ paddingVertical: 48, textAlign: "center", fontSize: 12, color: "#a3a3a3" }}>
                {t.views.notes.noNotes}
              </T>
            ) : (
              filteredNotes.map((note) => {
                const isSelected = activeNote?.id === note.id;
                const catStyle = getCategoryStyle(note.category);
                return (
                  <Pressable
                    key={note.id}
                    onPress={() => {
                      setSelectedNoteId(note.id);
                      trackRecentItem({
                        itemId: note.id,
                        type: "note",
                        title: note.title,
                        view: "notes",
                      });
                      setMobileMode("editor");
                    }}
                    style={({ pressed }) => ({
                      borderRadius: 16,
                      padding: 14,
                      minHeight: 44,
                      borderWidth: 1,
                      borderColor: isSelected ? "#404040" : "rgba(38,38,38,0.8)",
                      backgroundColor: isSelected ? "#171717" : "rgba(10,10,10,0.6)",
                      opacity: pressed ? 0.9 : 1,
                    })}
                  >
                    <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "flex-start", justifyContent: "space-between", gap: 4 }}>
                      <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8, flex: 1 }}>
                        {getTypeIcon(note.type)}
                        <T numberOfLines={1} style={{ fontSize: 13, fontWeight: "700", color: "#ffffff", flex: 1 }}>
                          {note.title || t.views.notes.untitledNote}
                        </T>
                      </View>
                      {note.isPinned ? <Pin size={14} color="#60a5fa" /> : null}
                    </View>

                    {/* One-sentence summary preview */}
                    {note.summary ? (
                      <View
                        className="mt-2 rounded-xl border bg-blue-500/10 px-2.5 py-1.5"
                        style={{ borderColor: "rgba(59,130,246,0.2)", flexDirection: isRTL ? "row-reverse" : "row", gap: 6 }}
                      >
                        <Sparkles size={12} color="#60a5fa" />
                        <T numberOfLines={2} style={{ fontSize: 11, color: "#bfdbfe", flex: 1, lineHeight: 16 }}>
                          {note.summary}
                        </T>
                      </View>
                    ) : (
                      <T numberOfLines={2} style={{ marginTop: 6, fontSize: 12, color: "#a3a3a3", lineHeight: 17 }}>
                        {note.content.slice(0, 90)}
                      </T>
                    )}

                    <View style={{ marginTop: 10, flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between" }}>
                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, flex: 1 }}>
                        {note.category ? (
                          <View
                            className="rounded-md border px-1.5 py-0.5"
                            style={{ backgroundColor: catStyle.bg, borderColor: catStyle.border }}
                          >
                            <T style={{ fontSize: 10, fontWeight: "600", color: catStyle.color }}>
                              {catStyle.icon} {getCategoryLabel(note.category)}
                            </T>
                          </View>
                        ) : null}
                        {note.tags.slice(0, 2).map((tagItem) => (
                          <View key={tagItem} className="rounded-full border border-neutral-800 bg-neutral-900 px-2 py-0.5">
                            <T style={{ fontSize: 10, color: "rgba(96,165,250,0.9)" }}>#{tagItem}</T>
                          </View>
                        ))}
                      </View>
                      <T style={{ fontSize: 11, color: "#a3a3a3" }}>{note.updatedAt}</T>
                    </View>
                  </Pressable>
                );
              })
            )}
          </ScrollView>
        </View>
      )}

      {/* MAIN: ACTIVE NOTE EDITOR (visible in editor mode) */}
      {mobileMode === "editor" && (
        <View style={{ flex: 1, backgroundColor: "rgba(10,10,10,0.4)" }}>
          {activeNote ? (
            <>
              {/* Note Toolbar */}
              <View
                style={{
                  flexDirection: isRTL ? "row-reverse" : "row",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: "#262626",
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  backgroundColor: "rgba(23,23,23,0.6)",
                }}
              >
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
                  {/* Mobile Back Button */}
                  <Pressable
                    onPress={() => setMobileMode("list")}
                    style={[toolbarBtnStyle, { borderWidth: 1, borderColor: "#262626", backgroundColor: "#171717" }]}
                  >
                    <BackIcon size={16} color="#d4d4d4" />
                    <T style={{ fontSize: 12, color: "#d4d4d4" }}>{t.common.back}</T>
                  </Pressable>

                  {/* Note Type Selector */}
                  <View style={{ width: 130 }}>
                    <Select
                      value={activeNote.type}
                      options={[
                        { value: "note" as NoteType, label: isRTL ? "یادداشت متنی" : "Note" },
                        { value: "idea" as NoteType, label: isRTL ? "ایده و تفکر" : "Idea" },
                        { value: "meeting" as NoteType, label: isRTL ? "خلاصه جلسه" : "Meeting" },
                        { value: "book_summary" as NoteType, label: isRTL ? "خلاصه مطالعه" : "Book Summary" },
                        { value: "bookmark" as NoteType, label: isRTL ? "بوکمارک وب" : "Bookmark" },
                      ]}
                      onChange={(v) => updateNote(activeNote.id, { type: v }) }
                    />
                  </View>

                  {/* Pin toggle */}
                  <Pressable
                    onPress={() => updateNote(activeNote.id, { isPinned: !activeNote.isPinned }) }
                    style={[
                      toolbarBtnStyle,
                      {
                        borderWidth: 1,
                        borderColor: activeNote.isPinned ? "#404040" : "#262626",
                        backgroundColor: activeNote.isPinned ? "#262626" : "transparent",
                      },
                    ]}
                  >
                    <Pin
                      size={16}
                      color={activeNote.isPinned ? "#60a5fa" : "#a3a3a3"}
                      fill={activeNote.isPinned ? "#60a5fa" : "transparent"}
                    />
                  </Pressable>
                </View>

                {/* Action buttons */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
                    {/* One-Sentence Summary */}
                    <Pressable
                      onPress={handleGenerateOneSentenceSummary}
                      disabled={isGeneratingSummary}
                      style={[
                        toolbarBtnStyle,
                        {
                          borderWidth: 1,
                          borderColor: "rgba(59,130,246,0.3)",
                          backgroundColor: "rgba(59,130,246,0.1)",
                          opacity: isGeneratingSummary ? 0.5 : 1,
                        },
                      ]}
                    >
                      {isGeneratingSummary ? (
                        <Spinner size={14} color="#60a5fa" />
                      ) : (
                        <Sparkles size={14} color="#fbbf24" />
                      )}
                      <T style={{ fontSize: 12, fontWeight: "600", color: "#93c5fd" }}>
                        {isGeneratingSummary
                          ? isRTL ? "..." : "..."
                          : isRTL ? "⚡ خلاصه" : "⚡ Summary"}
                      </T>
                    </Pressable>

                    {/* AI Tag & Summarize */}
                    <Pressable
                      onPress={handleAIEnhance}
                      disabled={isAITagging}
                      style={[
                        toolbarBtnStyle,
                        {
                          borderWidth: 1,
                          borderColor: "#262626",
                          backgroundColor: "#171717",
                          opacity: isAITagging ? 0.4 : 1,
                        },
                      ]}
                    >
                      {isAITagging ? (
                        <Spinner size={14} />
                      ) : (
                        <Tag size={14} color="#60a5fa" />
                      )}
                      <T style={{ fontSize: 12, fontWeight: "600", color: "#d4d4d4" }}>
                        {isAITagging ? t.views.notes.aiTagging : t.views.notes.aiTags}
                      </T>
                    </Pressable>

                    {/* Edit vs Preview Toggle */}
                    <Pressable
                      onPress={() => setIsPreviewMode(!isPreviewMode)}
                      style={[toolbarBtnStyle, { borderWidth: 1, borderColor: "#262626", backgroundColor: "#171717" }]}
                    >
                      {isPreviewMode ? (
                        <>
                          <Edit3 size={14} color="#60a5fa" />
                          <T style={{ fontSize: 12, color: "#d4d4d4" }}>{t.views.notes.editMode}</T>
                        </>
                      ) : (
                        <>
                          <Eye size={14} color="#60a5fa" />
                          <T style={{ fontSize: 12, color: "#d4d4d4" }}>{t.views.notes.previewMode}</T>
                        </>
                      )}
                    </Pressable>

                    {/* Delete */}
                    <Pressable onPress={confirmDeleteNote} className="rounded-xl p-2">
                      <Trash2 size={16} color="#a3a3a3" />
                    </Pressable>
                  </View>
                </ScrollView>
              </View>

              {/* Note Body */}
              <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
                {/* Title Input */}
                <Input
                  value={activeNote.title}
                  onChangeText={(v) => updateNote(activeNote.id, { title: v }) }
                  placeholder={t.views.notes.untitledNote}
                  style={{ fontSize: 20, fontWeight: "700", color: "#ffffff", paddingVertical: 4 }}
                />

                {/* One-Sentence Summary Card */}
                <View
                  className="rounded-2xl border bg-blue-950/20 p-3"
                  style={{ borderColor: "rgba(59,130,246,0.2)", gap: 8 }}
                >
                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                    <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
                      <Sparkles size={14} color="#fbbf24" />
                      <T style={{ fontSize: 12, fontWeight: "600", color: "#93c5fd" }}>
                        {isRTL ? "خلاصه تک‌جمله‌ای:" : "One-Sentence Summary:"}
                      </T>
                    </View>
                    <Pressable
                      onPress={handleGenerateOneSentenceSummary}
                      disabled={isGeneratingSummary}
                      style={({ pressed }) => [
                        toolbarBtnStyle,
                        {
                          borderWidth: 1,
                          borderColor: "rgba(59,130,246,0.3)",
                          backgroundColor: pressed ? "rgba(59,130,246,0.2)" : "rgba(59,130,246,0.1)",
                          opacity: isGeneratingSummary ? 0.5 : 1,
                        },
                      ]}
                    >
                      {isGeneratingSummary ? (
                        <Spinner size={12} color="#60a5fa" />
                      ) : (
                        <Sparkles size={12} color="#fbbf24" />
                      )}
                      <T style={{ fontSize: 11, color: "#93c5fd" }}>
                        {activeNote.summary
                          ? isRTL ? "تولید مجدد" : "Regenerate"
                          : isRTL ? "تولید خودکار" : "Generate"}
                      </T>
                    </Pressable>
                  </View>
                  <T style={{ fontSize: 13, color: "#e5e5e5", lineHeight: 20 }}>
                    {activeNote.summary ||
                      (isRTL
                        ? "هنوز خلاصه‌ای با هوش مصنوعی برای این یادداشت ساخته نشده است."
                        : "No one-sentence summary generated yet.")}
                  </T>
                </View>

                {/* Currently Linked Entities */}
                {linkedProjects.length > 0 || linkedContacts.length > 0 ? (
                  <View
                    className="rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-2.5"
                    style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 }}
                  >
                    <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
                      <Link2 size={14} color="#60a5fa" />
                      <T style={{ fontSize: 11, color: "#a3a3a3" }}>
                        {isRTL ? "پیوندهای متصل:" : "Connected Links:"}
                      </T>
                    </View>

                    {linkedProjects.map((p) => (
                      <Pressable
                        key={p.id}
                        onPress={() => setActiveView("projects")}
                        style={({ pressed }) => [
                          toolbarBtnStyle,
                          {
                            borderWidth: 1,
                            borderColor: "rgba(245,158,11,0.3)",
                            backgroundColor: pressed ? "rgba(245,158,11,0.2)" : "rgba(245,158,11,0.1)",
                          },
                        ]}
                      >
                        <FolderKanban size={14} color="#fbbf24" />
                        <T style={{ fontSize: 12, color: "#fbbf24" }}>{p.name}</T>
                      </Pressable>
                    ))}

                    {linkedContacts.map((ct) => (
                      <Pressable
                        key={ct.id}
                        onPress={() => setActiveView("contacts")}
                        style={({ pressed }) => [
                          toolbarBtnStyle,
                          {
                            borderWidth: 1,
                            borderColor: "rgba(16,185,129,0.3)",
                            backgroundColor: pressed ? "rgba(16,185,129,0.2)" : "rgba(16,185,129,0.1)",
                          },
                        ]}
                      >
                        <Users size={14} color="#34d399" />
                        <T style={{ fontSize: 12, color: "#34d399" }}>{ct.name}</T>
                      </Pressable>
                    ))}
                  </View>
                ) : null}

                {/* AI-Powered Link Suggester Panel */}
                <LinkSuggesterPanel
                  note={activeNote}
                  onUpdateNote={updateNote}
                  onInsertTextIntoContent={(text) =>
                    updateNote(activeNote.id, {
                      content: (activeNote.content || "") + text,
                    })
                  }
                />

                {/* Category & AI Category Suggestions */}
                <View style={{ gap: 10 }}>
                  <View
                    className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-3"
                    style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
                        <Tag size={14} color="#60a5fa" />
                        <T style={{ fontSize: 12, color: "#a3a3a3" }}>
                          {isRTL ? "دسته‌بندی:" : "Category:"}
                        </T>
                      </View>

                      <View style={{ width: 160 }}>
                        <Select
                          value={activeNote.category || ""}
                          options={[
                            { value: "", label: isRTL ? "بدون دسته‌بندی" : "No Category" },
                            ...AVAILABLE_CATEGORIES.map((cat) => ({
                              value: cat.id,
                              label: `${cat.icon} ${isRTL ? cat.nameFa : cat.name}`,
                            })),
                          ]}
                          onChange={(v) => updateNote(activeNote.id, { category: v || undefined }) }
                        />
                      </View>

                      {activeNote.category ? (
                        (() => {
                          const catStyle = getCategoryStyle(activeNote.category);
                          return (
                            <View
                              className="flex-row items-center rounded-full border px-2.5 py-0.5"
                              style={{ backgroundColor: catStyle.bg, borderColor: catStyle.border, flexDirection: isRTL ? "row-reverse" : "row", gap: 4 }}
                            >
                              <T style={{ fontSize: 11 }}>{catStyle.icon}</T>
                              <T style={{ fontSize: 11, fontWeight: "600", color: catStyle.color }}>
                                {getCategoryLabel(activeNote.category)}
                              </T>
                            </View>
                          );
                        })()
                      ) : null}
                    </View>

                    {/* Gemini Category Suggestion Action */}
                    <Pressable
                      onPress={handleSuggestCategories}
                      disabled={isSuggestingCategories}
                      style={({ pressed }) => [
                        toolbarBtnStyle,
                        {
                          borderWidth: 1,
                          borderColor: "rgba(59,130,246,0.3)",
                          backgroundColor: pressed ? "rgba(59,130,246,0.3)" : "rgba(59,130,246,0.2)",
                          opacity: isSuggestingCategories ? 0.5 : 1,
                        },
                      ]}
                    >
                      {isSuggestingCategories ? (
                        <Spinner size={14} color="#60a5fa" />
                      ) : (
                        <Sparkles size={14} color="#fbbf24" />
                      )}
                      <T style={{ fontSize: 12, fontWeight: "600", color: "#93c5fd" }}>
                        {isSuggestingCategories
                          ? isRTL ? "در حال تحلیل..." : "Analyzing..."
                          : isRTL ? "✨ پیشنهاد دسته‌بندی" : "✨ Suggest Categories"}
                      </T>
                    </Pressable>
                  </View>

                  {/* Gemini Suggestions Ribbon */}
                  {categorySuggestions.length > 0 && (
                    <View
                      className="rounded-2xl border bg-blue-950/20 p-3.5"
                      style={{ borderColor: "rgba(59,130,246,0.3)", gap: 10 }}
                    >
                      <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
                          <Sparkles size={16} color="#fbbf24" />
                          <T style={{ fontSize: 12, fontWeight: "600", color: "#93c5fd" }}>
                            {isRTL
                              ? "پیشنهادهای هوش مصنوعی:"
                              : "Gemini Category Suggestions:"}
                          </T>
                        </View>
                        <Pressable onPress={() => setCategorySuggestions([])} style={{ padding: 4 }}>
                          <T style={{ fontSize: 12, color: "#a3a3a3" }}>✕</T>
                        </Pressable>
                      </View>

                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                        {categorySuggestions.map((cat) => {
                          const isApplied =
                            activeNote.category?.toLowerCase() === cat.name.toLowerCase();
                          const style = getCategoryStyle(cat.name);
                          return (
                            <Pressable
                              key={cat.name}
                              onPress={() => handleApplyCategory(cat.name, cat.nameFa)}
style={({ pressed }) => ({
                                flexDirection: isRTL ? "row-reverse" : "row",
                                alignItems: "center",
                                gap: 6,
                                borderRadius: 12,
                                borderWidth: 1,
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                backgroundColor: isApplied ? "#2563eb" : "rgba(23,23,23,0.9)",
                                borderColor: isApplied ? "#3b82f6" : "#262626",
                                opacity: pressed ? 0.85 : 1,
                              })}
                            >
                              <T style={{ fontSize: 12 }}>{style.icon}</T>
                              <T style={{ fontSize: 12, fontWeight: "700", color: isApplied ? "#ffffff" : "#e5e5e5" }}>
                                {isRTL ? cat.nameFa : cat.name}
                              </T>
                              {cat.confidence ? (
                                <View className="rounded-full bg-blue-500/20 px-1.5 py-0.5">
                                  <T style={{ fontSize: 10, color: "#93c5fd" }}>
                                    {Math.round(cat.confidence * 100)}%
                                  </T>
                                </View>
                              ) : null}
                              {isApplied ? null : null}
                            </Pressable>
                          );
                        }) }
                      </View>

                      {categorySuggestions[0]?.reason ? (
                        <T style={{ fontSize: 11, color: "#a3a3a3" }}>
                          💡 <T style={{ fontSize: 11, color: "#d4d4d4" }}>{categorySuggestions[0].reason}</T>
                        </T>
                      ) : null}
                    </View>
                  )}
                </View>

                {/* AI Summary Box */}
              {activeNote.summary ? (
                <View className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4">
                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
                    <Sparkles size={16} color="#60a5fa" />
                    <T style={{ fontSize: 12, fontWeight: "700", color: "#60a5fa" }}>
                      {t.views.notes.aiTags}
                    </T>
                  </View>
                  <T style={{ marginTop: 8, fontSize: 13, color: "#d4d4d4", lineHeight: 20 }}>
                    {activeNote.summary}
                  </T>
                </View>
              ) : null}

              {/* Content Editor or Rendered View */}
              {isPreviewMode ? (
                <T style={{ fontSize: 14, color: "#e5e5e5", lineHeight: 24 }}>
                  {activeNote.content}
                </T>
              ) : (
                <Input
                  multiline
                  value={activeNote.content}
                  onChangeText={(v) => updateNote(activeNote.id, { content: v }) }
                  placeholder={t.views.notes.noteContentPlaceholder}
                  style={{
                    width: "100%",
                    minHeight: 300,
                    fontSize: 14,
                    lineHeight: 24,
                    color: "#e5e5e5",
                    textAlignVertical: "top",
                    padding: 0,
                  }}
                />
              )}

              {/* Tags Section */}
              <View style={{ paddingTop: 16, borderTopWidth: 1, borderTopColor: "#262626" }}>
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Tag size={16} color="#a3a3a3" />
                  <T style={{ fontSize: 12, fontWeight: "600", color: "#d4d4d4" }}>{t.common.tags}:</T>
                </View>

                <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                  {activeNote.tags.map((tagItem) => (
                    <View
                      key={tagItem}
                      className="flex-row items-center rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1"
                      style={{ gap: 6, flexDirection: isRTL ? "row-reverse" : "row" }}
                    >
                      <T style={{ fontSize: 12, color: "#60a5fa" }}>#{tagItem}</T>
                      <Pressable onPress={() => handleRemoveTag(tagItem)}>
                        <T style={{ fontSize: 14, color: "#a3a3a3" }}>×</T>
                      </Pressable>
                    </View>
                  ))}

                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
                    <Input
                      placeholder={t.views.notes.addTagPlaceholder}
                      value={newTagInput}
                      onChangeText={setNewTagInput}
                      onSubmitEditing={handleAddTag}
                      style={{
                        width: 110,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: "#262626",
                        backgroundColor: "#171717",
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        fontSize: 12,
                        color: "#ffffff",
                      }}
                    />
                    <Pressable
                      onPress={handleAddTag}
                      style={({ pressed }) => ({
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: "#262626",
                        backgroundColor: pressed ? "#262626" : "#171717",
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                      }) }
                    >
                      <T style={{ fontSize: 12, color: "#d4d4d4" }}>+</T>
                    </Pressable>
                  </View>
                </View>
              </View>
            </ScrollView>
            </>
          ) : (
            <View style={{ alignItems: "center", justifyContent: "center", padding: 24, minHeight: 300 }}>
              <FileText size={48} color="#404040" />
              <T style={{ fontSize: 14, color: "#a3a3a3", marginTop: 8 }}>
                {t.views.notes.selectNotePrompt}
              </T>
              <Btn
                title={`+ ${t.views.notes.newNote}`}
                onPress={handleCreateNewNote}
                style={{ marginTop: 16 }}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
};
