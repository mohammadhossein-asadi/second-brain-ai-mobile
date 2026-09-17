import React, { useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import Slider from "@react-native-community/slider";
import { Alert } from "react-native";
import {
  FolderKanban,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  X,
  Archive,
  ArchiveRestore,
} from "lucide-react-native";
import { useSecondBrain } from "../../context/SecondBrainContext";
import { Priority, Project, ProjectCategory, Status } from "../../types";
import { ProjectsSkeleton } from "./ViewSkeletons";
import { ProjectProgressBar } from "./ProjectProgressBar";
import { CircularProgress } from "../ui/CircularProgress";
import { T, Input, Select, ModalShell, Btn } from "../ui/primitives";

export const ProjectsView: React.FC = () => {
  const {
    projects,
    tasks,
    addProject,
    updateProject,
    deleteProject,
    toggleArchiveProject,
    isDataLoading,
    isRTL,
    t,
    localSearchQuery,
    selectedFolderId,
    folders,
    trackRecentItem,
  } = useSecondBrain();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [archiveFilter, setArchiveFilter] = useState<"active" | "archived" | "all">("active");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [status, setStatus] = useState<Status>("in_progress");
  const [progress, setProgress] = useState<number>(30);
  const [category, setCategory] = useState<ProjectCategory>("business");
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-06-30");
  const [icon, setIcon] = useState("🚀");

  const categoriesList: { id: ProjectCategory | "all"; label: string }[] = [
    { id: "all", label: t.views.projects.allCategories },
    { id: "business", label: t.categories.business },
    { id: "language", label: t.categories.language },
    { id: "self_dev", label: t.categories.self_dev },
    { id: "main", label: t.categories.main },
    { id: "personal", label: t.categories.personal },
  ];

  const activeProjectsCount = projects.filter((p) => !p.isArchived).length;
  const archivedProjectsCount = projects.filter((p) => Boolean(p.isArchived)).length;

  const filteredProjects = projects.filter((p) => {
    if (archiveFilter === "active" && p.isArchived) return false;
    if (archiveFilter === "archived" && !p.isArchived) return false;
    if (selectedCategory !== "all" && p.category !== selectedCategory) return false;

    // Filter by selected folder
    if (selectedFolderId) {
      const folder = folders.find((f) => f.id === selectedFolderId);
      if (folder && (!folder.itemIds?.projectIds || !folder.itemIds.projectIds.includes(p.id))) {
        return false;
      }
    }

    // Filter by local search query
    if (localSearchQuery.trim()) {
      const query = localSearchQuery.trim().toLowerCase();
      const matchName = p.name.toLowerCase().includes(query);
      const matchDesc = p.description?.toLowerCase().includes(query);
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

  const handleOpenCreate = () => {
    setEditingProject(null);
    setName("");
    setDescription("");
    setPriority("medium");
    setStatus("not_started");
    setProgress(0);
    setCategory("business");
    setStartDate(isRTL ? "۱۴۰۴/۰۱/۰۱" : "2025-01-01");
    setEndDate(isRTL ? "۱۴۰۴/۰۶/۳۱" : "2025-06-30");
    setIcon("📁");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Project) => {
    setEditingProject(p);
    setName(p.name);
    setDescription(p.description);
    setPriority(p.priority);
    setStatus(p.status);
    setProgress(p.progress);
    setCategory(p.category);
    setStartDate(p.startDate || "");
    setEndDate(p.endDate || "");
    setIcon(p.icon || "📁");
    setIsModalOpen(true);

    trackRecentItem({
      itemId: p.id,
      type: "project",
      title: p.name,
      view: "projects",
      badge: isRTL ? "پروژه" : "Project",
    });
  };

  const handleSave = () => {
    if (!name.trim()) return;

    if (editingProject) {
      updateProject(editingProject.id, {
        name: name.trim(),
        description: description.trim(),
        priority,
        status,
        progress,
        category,
        startDate,
        endDate,
        icon,
      });
    } else {
      addProject({
        name: name.trim(),
        description: description.trim(),
        priority,
        status,
        progress,
        category,
        startDate,
        endDate,
        icon,
      });
    }
    setIsModalOpen(false);
  };

  const confirmDelete = (project: Project) => {
    Alert.alert(t.common.delete, t.common.deleteConfirm, [
      { text: t.common.cancel, style: "cancel" },
      { text: t.common.delete, style: "destructive", onPress: () => deleteProject(project.id) },
    ]);
  };

  const priorityBadge = (p: Priority) => {
    const map: Record<string, { bg: string; border: string; color: string }> = {
      critical: { bg: "rgba(244,63,94,0.1)", border: "rgba(244,63,94,0.2)", color: "#fb7185" },
      high: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)", color: "#fbbf24" },
      medium: { bg: "rgba(14,165,233,0.1)", border: "rgba(14,165,233,0.2)", color: "#38bdf8" },
    };
    const v = map[p] || { bg: "#171717", border: "#262626", color: "#a3a3a3" };
    return (
      <View className="rounded-full border px-2.5 py-0.5" style={{ backgroundColor: v.bg, borderColor: v.border }}>
        <T style={{ fontSize: 10, fontWeight: "600", color: v.color }}>
          {p === "critical" ? t.priorities.critical : p === "high" ? t.priorities.high : p === "medium" ? t.priorities.medium : t.priorities.low}
        </T>
      </View>
    );
  };

  const getCategoryLabel = (cat: ProjectCategory) => {
    switch (cat) {
      case "business":
        return t.categories.business;
      case "language":
        return t.categories.language;
      case "self_dev":
        return t.categories.self_dev;
      case "main":
        return t.categories.main;
      case "personal":
        return t.categories.personal;
    }
  };

  if (isDataLoading) {
    return <ProjectsSkeleton />;
  }

  const FilterTab = ({
    id,
    label,
    activeColor = "#60a5fa",
    icon,
  }: {
    id: "active" | "archived" | "all";
    label: string;
    activeColor?: string;
    icon?: React.ReactNode;
  }) => (
    <Pressable
      onPress={() => setArchiveFilter(id)}
      style={({ pressed }) => ({
        flexDirection: isRTL ? "row-reverse" : "row",
        alignItems: "center",
        gap: 6,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: archiveFilter === id ? "#262626" : "transparent",
        opacity: pressed ? 0.8 : 1,
      })}
    >
      {icon}
      <T
        style={{
          fontSize: 12,
          fontWeight: archiveFilter === id ? "700" : "500",
          color: archiveFilter === id ? activeColor : "#a3a3a3",
        }}
      >
        {label}
      </T>
    </Pressable>
  );

  return (
    <View className="gap-6 pb-12">
      {/* Header bar & Status filter */}
      <View style={{ gap: 16 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <View
            style={{
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              backgroundColor: "rgba(23,23,23,0.8)",
              borderWidth: 1,
              borderColor: "#262626",
              borderRadius: 16,
              padding: 4,
            }}
          >
            <FilterTab id="active" label={`${isRTL ? "پروژه‌های فعال" : "Active"} (${activeProjectsCount})`} />
            <FilterTab
              id="archived"
              label={`${isRTL ? "بایگانی شده" : "Archived"} (${archivedProjectsCount})`}
              activeColor="#fbbf24"
              icon={<Archive size={14} color={archiveFilter === "archived" ? "#fbbf24" : "#a3a3a3"} />}
            />
            <FilterTab id="all" label={`${isRTL ? "همه" : "All"} (${projects.length})`} activeColor="#ffffff" />
          </View>

          <Btn
            title={t.views.projects.newProject}
            onPress={handleOpenCreate}
            icon={<Plus size={16} color="#ffffff" />}
          />
        </View>

        {/* Category filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 6 }}>
            {categoriesList.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={({ pressed }) => ({
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 9,
                  minHeight: 38,
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: selectedCategory === cat.id ? "#404040" : "#262626",
                  backgroundColor: selectedCategory === cat.id ? "#262626" : "#171717",
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <T
                  style={{
                    fontSize: 12,
                    fontWeight: selectedCategory === cat.id ? "700" : "400",
                    color: selectedCategory === cat.id ? "#60a5fa" : "#a3a3a3",
                  }}
                >
                  {cat.label}
                </T>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Projects Grid */}
      <View className="gap-5">
        {filteredProjects.length === 0 ? (
          <T style={{ paddingVertical: 64, textAlign: "center", fontSize: 12, color: "#a3a3a3" }}>
            {t.views.projects.noProjectsFound}
          </T>
        ) : (
          filteredProjects.map((project) => {
            const projectTasks = tasks.filter((task) => task.projectId === project.id);
            const completedCount = projectTasks.filter((task) => task.isCompleted).length;
            const totalTasks = projectTasks.length;
            const calculatedPct = totalTasks > 0
              ? Math.round((completedCount / totalTasks) * 100)
              : Math.min(100, Math.max(0, project.progress ?? 0));

            const ringColor = calculatedPct === 100
              ? "#34d399"
              : calculatedPct >= 70
              ? "#60a5fa"
              : calculatedPct >= 35
              ? "#818cf8"
              : calculatedPct > 0
              ? "#fbbf24"
              : "#525252";

            return (
              <View
                key={project.id}
                className="rounded-3xl border p-6"
                style={{
                  borderColor: project.isArchived ? "#1f1f1f" : "#262626",
                  backgroundColor: project.isArchived ? "rgba(23,23,23,0.4)" : "rgba(23,23,23,0.6)",
                  opacity: project.isArchived ? 0.75 : 1,
                }}
              >
                <View>
                  {/* Top badges & controls */}
                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12, flex: 1 }}>
                      <View
                        className="h-11 w-11 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-950"
                      >
                        <T style={{ fontSize: 24 }}>{project.icon || "📁"}</T>
                      </View>
                      <View>
                        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
                          <T numberOfLines={1} style={{ fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
                            {project.name}
                          </T>
                          {project.isArchived ? (
                            <View className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5">
                              <T style={{ fontSize: 10, fontWeight: "700", color: "#fbbf24" }}>
                                {isRTL ? "بایگانی‌شده" : "Archived"}
                              </T>
                            </View>
                          ) : null}
                        </View>
                        <T style={{ fontSize: 11, color: "#a3a3a3" }}>
                          {getCategoryLabel(project.category)}
                        </T>
                      </View>
                    </View>

                    <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
                      {/* Visual Completion Progress Ring */}
                      <View pointerEvents="none">
                        <CircularProgress progress={calculatedPct} size={38} strokeWidth={3.5} strokeColor={ringColor} trackColor="#262626">
                          <T style={{ fontSize: 9, fontWeight: "700", color: "#ffffff" }}>
                            {calculatedPct}%
                          </T>
                        </CircularProgress>
                      </View>

                      <Pressable
                        onPress={() => toggleArchiveProject(project.id)}
                        className="rounded-xl p-1.5"
                      >
                        {project.isArchived ? (
                          <ArchiveRestore size={14} color="#fbbf24" />
                        ) : (
                          <Archive size={14} color="#a3a3a3" />
                        )}
                      </Pressable>
                      <Pressable
                        onPress={() => handleOpenEdit(project)}
                        className="rounded-xl p-1.5"
                      >
                        <Edit2 size={14} color="#a3a3a3" />
                      </Pressable>
                      <Pressable
                        onPress={() => confirmDelete(project)}
                        className="rounded-xl p-1.5"
                      >
                        <Trash2 size={14} color="#a3a3a3" />
                      </Pressable>
                    </View>
                  </View>

                  {/* Description */}
                  <T style={{ marginTop: 16, fontSize: 12, color: "#d4d4d4", lineHeight: 19 }}>
                    {project.description}
                  </T>

                  {/* Dates */}
                  {project.startDate || project.endDate ? (
                    <View style={{ marginTop: 16, flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
                      <Calendar size={14} color="#737373" />
                      <T style={{ fontSize: 11, color: "#a3a3a3" }}>
                        {project.startDate} — {project.endDate}
                      </T>
                    </View>
                  ) : null}
                </View>

                {/* Progress */}
                <View style={{ marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: "rgba(38,38,38,0.8)", gap: 12 }}>
                  <ProjectProgressBar project={project} tasks={tasks} showDetails={true} />
                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", justifyContent: "flex-end", paddingTop: 4 }}>
                    {priorityBadge(project.priority)}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* CREATE / EDIT MODAL */}
      <ProjectModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProject={editingProject}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        priority={priority}
        setPriority={setPriority}
        status={status}
        setStatus={setStatus}
        progress={progress}
        setProgress={setProgress}
        category={category}
        setCategory={setCategory}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        icon={icon}
        setIcon={setIcon}
        onSave={handleSave}
        isRTL={isRTL}
        t={t}
      />
    </View>
  );
};

interface ProjectModalProps {
  visible: boolean;
  onClose: () => void;
  editingProject: Project | null;
  name: string;
  setName: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  priority: Priority;
  setPriority: (p: Priority) => void;
  status: Status;
  setStatus: (s: Status) => void;
  progress: number;
  setProgress: (v: number) => void;
  category: ProjectCategory;
  setCategory: (c: ProjectCategory) => void;
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
  icon: string;
  setIcon: (v: string) => void;
  onSave: () => void;
  isRTL: boolean;
  t: any;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  visible,
  onClose,
  editingProject,
  name,
  setName,
  description,
  setDescription,
  priority,
  setPriority,
  progress,
  setProgress,
  category,
  setCategory,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  icon,
  setIcon,
  onSave,
  isRTL,
  t,
}) => {
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
    <ModalShell visible={visible} onClose={onClose} maxWidth={520}>
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
              <FolderKanban size={16} color="#60a5fa" />
              <T style={{ fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
                {editingProject ? t.views.projects.editModalTitle : t.views.projects.createModalTitle}
              </T>
            </View>
            <Pressable onPress={onClose} className="rounded-xl p-1.5">
              <T style={{ fontSize: 16, color: "#a3a3a3" }}>✕</T>
            </Pressable>
          </View>

          <View style={{ marginTop: 16, gap: 16 }}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 3 }}>
                <T style={labelStyle}>{t.views.projects.projectNameLabel}</T>
                <Input value={name} onChangeText={setName} style={inputStyle} />
              </View>
              <View style={{ flex: 1 }}>
                <T style={labelStyle}>{t.views.projects.iconLabel}</T>
                <Input value={icon} onChangeText={setIcon} style={[inputStyle, { textAlign: "center" }]} />
              </View>
            </View>

            <View>
              <T style={labelStyle}>{t.views.projects.projectDescLabel}</T>
              <Input
                multiline
                value={description}
                onChangeText={setDescription}
                style={[inputStyle, { minHeight: 60, textAlignVertical: "top" }]}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
              <View style={{ flex: 1, minWidth: "45%" }}>
                <T style={labelStyle}>{t.common.category}</T>
                <Select
                  value={category}
                  options={[
                    { value: "business" as ProjectCategory, label: t.categories.business },
                    { value: "language" as ProjectCategory, label: t.categories.language },
                    { value: "self_dev" as ProjectCategory, label: t.categories.self_dev },
                    { value: "main" as ProjectCategory, label: t.categories.main },
                    { value: "personal" as ProjectCategory, label: t.categories.personal },
                  ]}
                  onChange={setCategory}
                />
              </View>

              <View style={{ flex: 1, minWidth: "45%" }}>
                <T style={labelStyle}>{t.common.priority}</T>
                <Select
                  value={priority}
                  options={[
                    { value: "critical" as Priority, label: t.priorities.critical },
                    { value: "high" as Priority, label: t.priorities.high },
                    { value: "medium" as Priority, label: t.priorities.medium },
                    { value: "low" as Priority, label: t.priorities.low },
                  ]}
                  onChange={setPriority}
                />
              </View>
            </View>

            <View>
              <T style={labelStyle}>
                {t.common.progress} ({progress}%)
              </T>
              <Slider
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={progress}
                onValueChange={setProgress}
                minimumTrackTintColor="#60a5fa"
                maximumTrackTintColor="#262626"
                thumbTintColor="#60a5fa"
              />
            </View>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <T style={labelStyle}>{t.views.projects.startDateLabel}</T>
                <Input value={startDate} onChangeText={setStartDate} style={inputStyle} />
              </View>
              <View style={{ flex: 1 }}>
                <T style={labelStyle}>{t.views.projects.endDateLabel}</T>
                <Input value={endDate} onChangeText={setEndDate} style={inputStyle} />
              </View>
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
              <Btn title={t.common.cancel} variant="ghost" onPress={onClose} />
              <Btn title={editingProject ? t.common.save : t.common.add} onPress={onSave} />
            </View>
          </View>
        </View>
      </ScrollView>
    </ModalShell>
  );
};
