import React, { useState, useEffect } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { Alert } from "react-native";
import { X, Check, Trash2, Folder, Layers } from "lucide-react-native";
import { useSecondBrain } from "../../context/SecondBrainContext";
import { T, Input, ModalShell } from "../ui/primitives";

const AVAILABLE_ICONS = ["📁", "🚀", "💼", "🌱", "💡", "🎯", "⚡", "🔬", "📚", "💰", "📦", "🎨", "🧠", "🏷️", "🔥", "⭐"];

const AVAILABLE_COLORS: Array<{ id: string; bg: string }> = [
  { id: "blue", bg: "#3b82f6" },
  { id: "emerald", bg: "#10b981" },
  { id: "amber", bg: "#f59e0b" },
  { id: "purple", bg: "#a855f7" },
  { id: "rose", bg: "#f43f5e" },
  { id: "cyan", bg: "#06b6d4" },
  { id: "indigo", bg: "#6366f1" },
];

export const ManageFolderModal: React.FC = () => {
  const {
    isManageFolderModalOpen,
    setIsManageFolderModalOpen,
    folderBeingEdited,
    setFolderBeingEdited,
    addFolder,
    updateFolder,
    deleteFolder,
    notes,
    tasks,
    projects,
    showToast,
    isRTL,
  } = useSecondBrain();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"work" | "personal" | "archived" | "general">("work");
  const [color, setColor] = useState("blue");
  const [icon, setIcon] = useState("📁");

  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);

  const [activeTab, setActiveTab] = useState<"details" | "items">("details");

  useEffect(() => {
    if (folderBeingEdited) {
      setName(folderBeingEdited.name);
      setDescription(folderBeingEdited.description || "");
      setCategory(folderBeingEdited.category || "work");
      setColor(folderBeingEdited.color || "blue");
      setIcon(folderBeingEdited.icon || "📁");
      setSelectedNoteIds(folderBeingEdited.itemIds?.noteIds || []);
      setSelectedTaskIds(folderBeingEdited.itemIds?.taskIds || []);
      setSelectedProjectIds(folderBeingEdited.itemIds?.projectIds || []);
    } else {
      setName("");
      setDescription("");
      setCategory("work");
      setColor("blue");
      setIcon("📁");
      setSelectedNoteIds([]);
      setSelectedTaskIds([]);
      setSelectedProjectIds([]);
    }
    setActiveTab("details");
  }, [folderBeingEdited, isManageFolderModalOpen]);

  const handleClose = () => {
    setIsManageFolderModalOpen(false);
    setFolderBeingEdited(null);
  };

  const handleSave = () => {
    if (!name.trim()) {
      showToast(isRTL ? "لطفاً نام پوشه را وارد کنید" : "Please enter a folder name", "warning");
      return;
    }

    const folderPayload = {
      name: name.trim(),
      description: description.trim(),
      category,
      color,
      icon,
      itemIds: {
        noteIds: selectedNoteIds,
        taskIds: selectedTaskIds,
        projectIds: selectedProjectIds,
      },
    };

    if (folderBeingEdited) {
      updateFolder(folderBeingEdited.id, folderPayload);
      showToast(isRTL ? "پوشه با موفقیت به‌روزرسانی شد" : "Folder updated successfully", "success");
    } else {
      addFolder(folderPayload);
      showToast(isRTL ? "پوشه جدید ایجاد شد" : "New folder created", "success");
    }

    handleClose();
  };

  const handleDelete = () => {
    if (folderBeingEdited) {
      Alert.alert(
        isRTL ? "حذف پوشه" : "Delete Folder",
        isRTL
          ? "آیا از حذف این پوشه اطمینان دارید؟ یادداشت‌ها و تسک‌ها حذف نخواهند شد."
          : "Are you sure you want to delete this folder? Items inside will not be deleted.",
        [
          { text: isRTL ? "انصراف" : "Cancel", style: "cancel" },
          {
            text: isRTL ? "حذف" : "Delete",
            style: "destructive",
            onPress: () => {
              deleteFolder(folderBeingEdited.id);
              showToast(isRTL ? "پوشه حذف شد" : "Folder deleted", "info");
              handleClose();
            },
          },
        ]
      );
    }
  };

  const toggleItem = (type: "note" | "task" | "project", id: string) => {
    if (type === "note") {
      setSelectedNoteIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else if (type === "task") {
      setSelectedTaskIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else if (type === "project") {
      setSelectedProjectIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    }
  };

  const totalAssignedCount =
    selectedNoteIds.length + selectedTaskIds.length + selectedProjectIds.length;

  if (!isManageFolderModalOpen) return null;

  const labelStyle = { fontSize: 12, fontWeight: "500" as const, color: "#d4d4d4", marginBottom: 6 };
  const inputStyle = {
    width: "100%" as const,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3f3f46",
    backgroundColor: "rgba(39,39,42,0.8)",
    padding: 10,
    fontSize: 13,
    color: "#f4f4f5",
  };

  const ItemToggleRow = ({
    selected,
    label,
    emoji,
    accent,
    onToggle,
  }: {
    selected: boolean;
    label: string;
    emoji?: string;
    accent: "blue" | "emerald" | "amber";
    onToggle: () => void;
  }) => {
    const accentBg =
      accent === "blue"
        ? "rgba(37,99,235,0.15)"
        : accent === "emerald"
        ? "rgba(5,150,105,0.15)"
        : "rgba(217,119,6,0.15)";
    const accentBorder =
      accent === "blue"
        ? "rgba(59,130,246,0.5)"
        : accent === "emerald"
        ? "rgba(16,185,129,0.5)"
        : "rgba(245,158,11,0.5)";
    const accentText = accent === "blue" ? "#bfdbfe" : accent === "emerald" ? "#d1fae5" : "#fde68a";

    return (
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => ({
          width: "100%",
          flexDirection: isRTL ? "row-reverse" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 8,
          borderRadius: 12,
          borderWidth: 1,
          backgroundColor: selected ? accentBg : "rgba(39,39,42,0.4)",
          borderColor: selected ? accentBorder : "rgba(63,63,70,0.4)",
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8, flex: 1 }}>
          {emoji ? <T style={{ fontSize: 12 }}>{emoji}</T> : null}
          <T numberOfLines={1} style={{ fontSize: 12, fontWeight: "500", color: selected ? accentText : "#a3a3a3", flex: 1 }}>
            {label}
          </T>
        </View>
        <View
          style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: selected ? accentBorder : "#52525b",
            backgroundColor: selected ? accentBorder : "transparent",
          }}
        >
          {selected ? <Check size={12} color="#ffffff" /> : null}
        </View>
      </Pressable>
    );
  };

  return (
    <ScrollView>
      <View style={{ padding: 20 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: "#27272a",
            paddingBottom: 14,
          }}
        >
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 10 }}>
            <View
              style={{
                padding: 8,
                borderRadius: 12,
                backgroundColor: "rgba(39,39,42,0.8)",
                borderWidth: 1,
                borderColor: "rgba(63,63,70,0.6)",
              }}
            >
              <T style={{ fontSize: 20 }}>{icon}</T>
            </View>
            <View>
              <T style={{ fontSize: 16, fontWeight: "600", color: "#f4f4f5" }}>
                {folderBeingEdited
                  ? isRTL ? "ویرایش پوشه" : "Edit Folder"
                  : isRTL ? "ایجاد پوشه جدید" : "New Custom Folder"}
              </T>
              <T style={{ fontSize: 12, color: "#a1a1aa" }}>
                {isRTL
                  ? "دسته‌بندی و تجمیع یکپارچه یادداشت‌ها، وظایف و پروژه‌ها"
                  : "Group notes, tasks, and projects together"}
              </T>
            </View>
          </View>
          <Pressable onPress={handleClose} style={{ padding: 8 }}>
            <X size={20} color="#a1a1aa" />
          </Pressable>
        </View>

        {/* Tab Selection */}
        <View
          style={{
            flexDirection: isRTL ? "row-reverse" : "row",
            borderBottomWidth: 1,
            borderBottomColor: "#27272a",
            marginTop: 8,
            gap: 8,
          }}
        >
          {(
            [
              { id: "details" as const, label: isRTL ? "مشخصات پوشه" : "Folder Details", icon: <Folder size={14} color={activeTab === "details" ? "#60a5fa" : "#a1a1aa"} /> },
              { id: "items" as const, label: isRTL ? "اتصال آیتم‌ها" : "Linked Items", icon: <Layers size={14} color={activeTab === "items" ? "#60a5fa" : "#a1a1aa"} /> },
            ]
          ).map((tab) => (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={{
                paddingBottom: 10,
                paddingHorizontal: 12,
                borderBottomWidth: 2,
                borderBottomColor: activeTab === tab.id ? "#3b82f6" : "transparent",
                flexDirection: isRTL ? "row-reverse" : "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              {tab.icon}
              <T style={{ fontSize: 12, fontWeight: "500", color: activeTab === tab.id ? "#60a5fa" : "#a1a1aa" }}>
                {tab.label}
              </T>
              {tab.id === "items" && totalAssignedCount > 0 ? (
                <View style={{ paddingHorizontal: 6, paddingVertical: 1, borderRadius: 999, backgroundColor: "rgba(59,130,246,0.2)" }}>
                  <T style={{ fontSize: 10, fontWeight: "700", color: "#60a5fa" }}>{totalAssignedCount}</T>
                </View>
              ) : null}
            </Pressable>
          ))}
        </View>

        {/* Content */}
        <View style={{ paddingVertical: 20, gap: 16, minHeight: 300 }}>
          {activeTab === "details" ? (
            <>
              {/* Folder Name */}
              <View>
                <T style={labelStyle}>
                  {isRTL ? "نام پوشه" : "Folder Name"} <T style={{ color: "#fb7185" }}>*</T>
                </T>
                <Input
                  value={name}
                  onChangeText={setName}
                  placeholder={isRTL ? "مثال: استارتاپ، امور مالی، سلامتی" : "e.g. Startup, Finance, Health"}
                  style={inputStyle}
                />
              </View>

              {/* Category */}
              <View>
                <T style={labelStyle}>{isRTL ? "دسته‌بندی والد" : "Parent Workspace"}</T>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {[
                    { id: "work" as const, label: isRTL ? "کاری" : "Work" },
                    { id: "personal" as const, label: isRTL ? "شخصی" : "Personal" },
                    { id: "archived" as const, label: isRTL ? "آرشیو" : "Archived" },
                    { id: "general" as const, label: isRTL ? "عمومی" : "General" },
                  ].map((cat) => (
                    <Pressable
                      key={cat.id}
                      onPress={() => setCategory(cat.id)}
                      style={({ pressed }) => ({
                        paddingVertical: 8,
                        paddingHorizontal: 10,
                        borderRadius: 12,
                        borderWidth: 1,
                        minWidth: "23%",
                        alignItems: "center",
                        backgroundColor: category === cat.id ? "rgba(37,99,235,0.2)" : "rgba(39,39,42,0.5)",
                        borderColor: category === cat.id ? "#3b82f6" : "rgba(63,63,70,0.6)",
                        opacity: pressed ? 0.8 : 1,
                      })}
                    >
                      <T
                        style={{
                          fontSize: 12,
                          fontWeight: "500",
                          color: category === cat.id ? "#93c5fd" : "#a1a1aa",
                        }}
                      >
                        {cat.label}
                      </T>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Icon Picker */}
              <View>
                <T style={labelStyle}>{isRTL ? "آیکون پوشه" : "Folder Icon"}</T>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 8,
                    padding: 8,
                    backgroundColor: "rgba(39,39,42,0.4)",
                    borderWidth: 1,
                    borderColor: "rgba(63,63,70,0.5)",
                    borderRadius: 12,
                  }}
                >
                  {["📁", "🚀", "💼", "🌱", "💡", "🎯", "⚡", "🔬", "📚", "💰", "📦", "🎨", "🧠", "🏷️", "🔥", "⭐"].map((ic) => (
                    <Pressable
                      key={ic}
                      onPress={() => setIcon(ic)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: icon === ic ? "rgba(37,99,235,0.3)" : "transparent",
                        borderWidth: icon === ic ? 2 : 0,
                        borderColor: "#3b82f6",
                      }}
                    >
                      <T style={{ fontSize: 18 }}>{ic}</T>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Color Accent */}
              <View>
                <T style={labelStyle}>{isRTL ? "رنگ نماد" : "Color Accent"}</T>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  {AVAILABLE_COLORS.map((clr) => (
                    <Pressable
                      key={clr.id}
                      onPress={() => setColor(clr.id)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: clr.bg,
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: color === clr.id ? 1 : 0.7,
                        borderWidth: color === clr.id ? 2 : 0,
                        borderColor: "#ffffff",
                      }}
                    >
                      {color === clr.id ? <Check size={14} color="#ffffff" /> : null}
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Description */}
              <View>
                <T style={labelStyle}>{isRTL ? "توضیحات کوتاه (اختیاری)" : "Description (optional)"}</T>
                <Input
                  multiline
                  value={description}
                  onChangeText={setDescription}
                  placeholder={isRTL ? "توضیح یا هدف از ایجاد این پوشه..." : "Purpose or context of this folder..."}
                  style={[inputStyle, { minHeight: 60, textAlignVertical: "top" }]}
                />
              </View>
            </>
          ) : (
            <>
              {/* Linked Projects */}
              <View>
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <T style={{ fontSize: 12, fontWeight: "600", color: "#d4d4d4" }}>
                    📁 {isRTL ? "پروژه‌ها" : "Projects"}
                  </T>
                  <T style={{ fontSize: 11, color: "#71717a" }}>
                    {selectedProjectIds.length} {isRTL ? "انتخاب شده" : "selected"}
                  </T>
                </View>
                <View style={{ gap: 6, maxHeight: 144 }}>
                  {projects.map((proj) => (
                    <ItemToggleRow
                      key={proj.id}
                      selected={selectedProjectIds.includes(proj.id)}
                      label={proj.name}
                      emoji={proj.icon || "🚀"}
                      accent="blue"
                      onToggle={() => toggleItem("project", proj.id)}
                    />
                  ))}
                </View>
              </View>

              {/* Linked Tasks */}
              <View>
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <T style={{ fontSize: 12, fontWeight: "600", color: "#d4d4d4" }}>
                    ☑️ {isRTL ? "وظایف" : "Tasks"}
                  </T>
                  <T style={{ fontSize: 11, color: "#71717a" }}>
                    {selectedTaskIds.length} {isRTL ? "انتخاب شده" : "selected"}
                  </T>
                </View>
                <View style={{ gap: 6, maxHeight: 160 }}>
                  {tasks.slice(0, 15).map((task) => (
                    <ItemToggleRow
                      key={task.id}
                      selected={selectedTaskIds.includes(task.id)}
                      label={task.name}
                      accent="emerald"
                      onToggle={() => toggleItem("task", task.id)}
                    />
                  ))}
                </View>
              </View>

              {/* Linked Notes */}
              <View>
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <T style={{ fontSize: 12, fontWeight: "600", color: "#d4d4d4" }}>
                    📝 {isRTL ? "یادداشت‌ها" : "Notes"}
                  </T>
                  <T style={{ fontSize: 11, color: "#71717a" }}>
                    {selectedNoteIds.length} {isRTL ? "انتخاب شده" : "selected"}
                  </T>
                </View>
                <View style={{ gap: 6, maxHeight: 160 }}>
                  {notes.map((note) => (
                    <ItemToggleRow
                      key={note.id}
                      selected={selectedNoteIds.includes(note.id)}
                      label={note.title}
                      accent="amber"
                      onToggle={() => toggleItem("note", note.id)}
                    />
                  ))}
                </View>
              </View>
            </>
          )}
        </View>

        {/* Footer Actions */}
        <View
          style={{
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 14,
            borderTopWidth: 1,
            borderTopColor: "#27272a",
          }}
        >
          {folderBeingEdited ? (
            <Pressable
              onPress={handleDelete}
              style={({ pressed }) => ({
                flexDirection: isRTL ? "row-reverse" : "row",
                alignItems: "center",
                gap: 6,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "rgba(244,63,94,0.2)",
                backgroundColor: pressed ? "rgba(244,63,94,0.1)" : "transparent",
              })}
            >
              <Trash2 size={14} color="#fb7185" />
              <T style={{ fontSize: 12, fontWeight: "500", color: "#fb7185" }}>
                {isRTL ? "حذف پوشه" : "Delete Folder"}
              </T>
            </Pressable>
          ) : (
            <View />
          )}

          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
            <Pressable onPress={handleClose} style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
              <T style={{ fontSize: 12, fontWeight: "500", color: "#a1a1aa" }}>
                {isRTL ? "انصراف" : "Cancel"}
              </T>
            </Pressable>
            <Pressable
              onPress={handleSave}
              style={({ pressed }) => ({
                flexDirection: isRTL ? "row-reverse" : "row",
                alignItems: "center",
                gap: 6,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 12,
                backgroundColor: pressed ? "#3b82f6" : "#2563eb",
              })}
            >
              <Check size={14} color="#ffffff" />
              <T style={{ fontSize: 12, fontWeight: "500", color: "#ffffff" }}>
                {isRTL ? "ذخیره پوشه" : "Save Folder"}
              </T>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
