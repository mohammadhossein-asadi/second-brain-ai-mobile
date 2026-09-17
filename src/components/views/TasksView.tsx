import React, { useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import {
  List,
  LayoutGrid,
  Calendar as CalendarIcon,
  Plus,
  CheckSquare,
  Trash2,
  Edit2,
  X,
} from "lucide-react-native";
import { useSecondBrain } from "../../context/SecondBrainContext";
import { Priority, Status, Task } from "../../types";
import { TaskReminderBanner } from "./TaskReminderBanner";
import { TasksSkeleton } from "./ViewSkeletons";
import { SortableTaskRow } from "./SortableTaskRow";
import { T, Input, Select, ModalShell, Btn } from "../ui/primitives";
import { EmptyState } from "../ui/EmptyState";
import { TagInput } from "../ui/TagInput";
import { Hash, Tag as TagIcon } from "lucide-react-native";

export const TasksView: React.FC = () => {
  const {
    tasks,
    projects,
    goals,
    addTask,
    updateTask,
    toggleTaskCompleted,
    deleteTask,
    reorderTasks,
    isDataLoading,
    showToast,
    isRTL,
    t,
    localSearchQuery,
    selectedFolderId,
    folders,
    trackRecentItem,
    allWorkspaceTags,
  } = useSecondBrain();

  const [viewMode, setViewMode] = useState<"table" | "board" | "calendar">("table");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterTag, setFilterTag] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>("not_started");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("2025-05-15");
  const [estimatedTime, setEstimatedTime] = useState<number>(2);
  const [projectId, setProjectId] = useState("");
  const [goalId, setGoalId] = useState("");
  const [taskTags, setTaskTags] = useState<string[]>([]);

  // Unique tags across tasks
  const taskTagsList = React.useMemo(() => {
    const all = tasks.flatMap((task) => task.tags || []);
    return Array.from(new Set(all)).filter(Boolean);
  }, [tasks]);

  const taskTagCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const task of tasks) {
      for (const tag of task.tags || []) {
        counts[tag] = (counts[tag] || 0) + 1;
      }
    }
    return counts;
  }, [tasks]);

  const filteredTasks = tasks.filter((taskItem) => {
    // Filter by selected folder
    if (selectedFolderId) {
      const folder = folders.find((f) => f.id === selectedFolderId);
      if (folder && (!folder.itemIds?.taskIds || !folder.itemIds.taskIds.includes(taskItem.id))) {
        return false;
      }
    }
    if (filterStatus !== "all" && taskItem.status !== filterStatus) return false;
    if (filterPriority !== "all" && taskItem.priority !== filterPriority) return false;
    if (filterTag !== "all" && (!taskItem.tags || !taskItem.tags.includes(filterTag))) return false;

    // Filter by local search query
    if (localSearchQuery.trim()) {
      const query = localSearchQuery.trim().toLowerCase();
      const matchName = taskItem.name.toLowerCase().includes(query);
      const matchDesc = taskItem.description?.toLowerCase().includes(query);
      const matchTag = taskItem.tags?.some((tg) => tg.toLowerCase().includes(query));
      if (!matchName && !matchDesc && !matchTag) return false;
    }
    return true;
  });

  const handleOpenCreate = () => {
    setEditingTask(null);
    setName("");
    setDescription("");
    setStatus("not_started");
    setPriority("medium");
    setDueDate(isRTL ? "۱۴۰۴/۰۲/۲۵" : "2025-05-15");
    setEstimatedTime(2);
    setProjectId("");
    setGoalId("");
    setTaskTags([]);
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setName(task.name);
    setDescription(task.description || "");
    setStatus(task.status);
    setPriority(task.priority);
    setDueDate(task.dueDate || (isRTL ? "۱۴۰۴/۰۲/۲۵" : "2025-05-15"));
    setEstimatedTime(task.estimatedTime || 1);
    setProjectId(task.projectId || "");
    setGoalId(task.goalId || "");
    setTaskTags(task.tags || []);
    setIsCreateModalOpen(true);

    trackRecentItem({
      itemId: task.id,
      type: "task",
      title: task.name,
      view: "tasks",
      badge: isRTL ? (task.priority === "high" ? "فوری" : "تسک") : task.priority,
    });
  };

  const handleSaveTask = () => {
    if (!name.trim()) return;

    if (editingTask) {
      updateTask(editingTask.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        dueDate,
        estimatedTime,
        projectId: projectId || undefined,
        goalId: goalId || undefined,
        tags: taskTags,
        isCompleted: status === "completed",
      });
    } else {
      addTask({
        name: name.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        dueDate,
        estimatedTime,
        projectId: projectId || undefined,
        goalId: goalId || undefined,
        tags: taskTags,
        isCompleted: status === "completed",
      });
    }
    setIsCreateModalOpen(false);
  };

  const handleSetTaskReminder = (taskId: string, reminderTime: string) => {
    updateTask(taskId, {
      reminderSet: true,
      reminderTime: reminderTime,
    });
  };

  const handleToggleTaskReminder = (task: Task) => {
    const nextReminder = !task.reminderSet;
    const time = nextReminder
      ? task.dueDate
        ? `${task.dueDate} - ۰۹:۰۰`
        : isRTL ? "روز موعد ساعت ۰۹:۰۰" : "09:00 AM on due date"
      : undefined;

    updateTask(task.id, {
      reminderSet: nextReminder,
      reminderTime: time,
    });

    showToast(
      nextReminder
        ? (isRTL ? `یادآور تسک «${task.name}» فعال شد` : `Reminder set for '${task.name}'`)
        : (isRTL ? `یادآور تسک «${task.name}» غیرفعال شد` : `Reminder disabled for '${task.name}'`),
      nextReminder ? "success" : "info"
    );
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

  const statusBadge = (s: Status) => {
    const map: Record<string, { bg: string; border: string; color: string }> = {
      completed: { bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)", color: "#60a5fa" },
      in_progress: { bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.2)", color: "#818cf8" },
    };
    const v = map[s] || { bg: "#171717", border: "#262626", color: "#a3a3a3" };
    const label = s === "completed" ? t.statuses.completed : s === "in_progress" ? t.statuses.in_progress : t.statuses.not_started;
    return (
      <View className="rounded-full border px-2.5 py-0.5" style={{ backgroundColor: v.bg, borderColor: v.border }}>
        <T style={{ fontSize: 10, fontWeight: "600", color: v.color }}>{label}</T>
      </View>
    );
  };

  const kanbanColumns: { id: Status; title: string }[] = [
    { id: "not_started", title: t.statuses.not_started },
    { id: "in_progress", title: t.statuses.in_progress },
    { id: "completed", title: t.statuses.completed },
  ];

  const ViewModeButton = ({
    mode,
    label,
    icon,
  }: {
    mode: "table" | "board" | "calendar";
    label: string;
    icon: React.ReactNode;
  }) => (
    <Pressable
      onPress={() => setViewMode(mode)}
      style={({ pressed }) => ({
        flexDirection: isRTL ? "row-reverse" : "row",
        alignItems: "center",
        gap: 6,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: viewMode === mode ? "#404040" : "transparent",
        backgroundColor: viewMode === mode ? "#262626" : "transparent",
        opacity: pressed ? 0.8 : 1,
      })}
    >
      {icon}
      <T style={{ fontSize: 12, fontWeight: "600", color: viewMode === mode ? "#60a5fa" : "#a3a3a3" }}>
        {label}
      </T>
    </Pressable>
  );

  if (isDataLoading) {
    return <TasksSkeleton />;
  }

  return (
    <View className="gap-6 pb-12">
      {/* Reminder banner */}
      <TaskReminderBanner tasks={tasks} onSetReminder={handleSetTaskReminder} />

      {/* Top Bar */}
      <View style={{ gap: 12 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View
            style={{
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              gap: 4,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#262626",
              backgroundColor: "rgba(23,23,23,0.8)",
              padding: 4,
            }}
          >
            <ViewModeButton mode="table" label={t.views.tasks.tableView} icon={<List size={16} color={viewMode === "table" ? "#60a5fa" : "#a3a3a3"} />} />
            <ViewModeButton mode="board" label={t.views.tasks.kanbanView} icon={<LayoutGrid size={16} color={viewMode === "board" ? "#60a5fa" : "#a3a3a3"} />} />
            <ViewModeButton mode="calendar" label={t.views.tasks.calendarView} icon={<CalendarIcon size={16} color={viewMode === "calendar" ? "#60a5fa" : "#a3a3a3"} />} />
          </View>
        </ScrollView>

        {/* Filters and Add button */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          <View style={{ flex: 1, minWidth: 130 }}>
            <Select
              value={filterStatus}
              options={[
                { value: "all", label: t.views.tasks.allStatuses },
                { value: "not_started", label: t.statuses.not_started },
                { value: "in_progress", label: t.statuses.in_progress },
                { value: "completed", label: t.statuses.completed },
              ]}
              onChange={setFilterStatus}
            />
          </View>
          <View style={{ flex: 1, minWidth: 130 }}>
            <Select
              value={filterPriority}
              options={[
                { value: "all", label: t.views.tasks.allPriorities },
                { value: "critical", label: t.priorities.critical },
                { value: "high", label: t.priorities.high },
                { value: "medium", label: t.priorities.medium },
                { value: "low", label: t.priorities.low },
              ]}
              onChange={setFilterPriority}
            />
          </View>

          <Btn
            title={t.views.tasks.newTask}
            onPress={handleOpenCreate}
            icon={<Plus size={16} color="#ffffff" />}
          />
        </View>
      </View>

      {/* Workspace Task Tag Quick-Filter Bar */}
      {taskTagsList.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4 }}>
              <TagIcon size={12} color="#60a5fa" />
              <T style={{ fontSize: 11, color: "#a3a3a3" }}>
                {isRTL ? "برچسب‌های تسک:" : "Task tags:"}
              </T>
            </View>
            <Pressable
              onPress={() => setFilterTag("all")}
              style={{
                borderRadius: 999,
                paddingHorizontal: 10,
                paddingVertical: 2,
                backgroundColor: filterTag === "all" ? "#262626" : "#0a0a0a",
                borderWidth: 1,
                borderColor: filterTag === "all" ? "#404040" : "#0a0a0a",
              }}
            >
              <T style={{ fontSize: 11, fontWeight: filterTag === "all" ? "700" : "400", color: filterTag === "all" ? "#e5e5e5" : "#737373" }}>
                #{t.common.all}
              </T>
            </Pressable>
            {taskTagsList.map((tag) => {
              const isSelected = filterTag === tag;
              return (
                <Pressable
                  key={tag}
                  onPress={() => setFilterTag(isSelected ? "all" : tag)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    borderRadius: 999,
                    paddingHorizontal: 10,
                    paddingVertical: 2,
                    borderWidth: 1,
                    backgroundColor: isSelected ? "#2563eb" : "#171717",
                    borderColor: isSelected ? "#3b82f6" : "#262626",
                  }}
                >
                  <T style={{ fontSize: 11, fontWeight: isSelected ? "700" : "400", color: isSelected ? "#ffffff" : "#a3a3a3" }}>
                    #{tag}
                  </T>
                  <T style={{ fontSize: 10, color: isSelected ? "#bfdbfe" : "#737373" }}>
                    ({taskTagCounts[tag] || 0})
                  </T>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      ) : null}

      {/* Active Tag Filter Indicator */}
      {filterTag !== "all" ? (
        <View
          style={{
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            gap: 6,
            alignSelf: "flex-start",
            borderRadius: 12,
            backgroundColor: "rgba(59,130,246,0.15)",
            borderWidth: 1,
            borderColor: "rgba(59,130,246,0.3)",
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
        >
          <TagIcon size={12} color="#60a5fa" />
          <T style={{ fontSize: 12, color: "#93c5fd" }}>#{filterTag}</T>
          <Pressable onPress={() => setFilterTag("all")} style={{ padding: 2 }}>
            <X size={12} color="#60a5fa" />
          </Pressable>
        </View>
      ) : null}

      {/* VIEW 1: LIST VIEW WITH DRAG REORDERING */}
      {viewMode === "table" && (
        <View className="overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/60">
          {filteredTasks.length === 0 ? (
            <View style={{ padding: 16 }}>
              <EmptyState
                imageSize="sm"
                title={t.views.tasks.noTasksFound}
                description={
                  localSearchQuery || filterStatus !== "all" || filterPriority !== "all" || filterTag !== "all"
                    ? isRTL
                      ? "هیچ وظیفه‌ای با فیلترها یا عبارت جستجوی فعلی مطابقت ندارد."
                      : "No tasks match your active search or filter criteria."
                    : isRTL
                    ? "هنوز هیچ وظیفه‌ای ثبت نشده است. با ایجاد نخستین تسک روز خود را سازمان‌دهی کنید."
                    : "No tasks found in your workspace. Start by creating a new task."
                }
                actionLabel={tasks.length === 0 ? (isRTL ? "+ ایجاد وظیفه جدید" : "+ Create New Task") : undefined}
                onAction={tasks.length === 0 ? handleOpenCreate : undefined}
                icon={<CheckSquare size={16} color="#60a5fa" />}
              />
            </View>
          ) : (
            <DraggableList
              data={filteredTasks}
              onReorder={(updated) => {
                reorderTasks(updated);
                showToast(
                  isRTL ? "ترتیب تسک‌ها با موفقیت تغییر یافت" : "Tasks reordered successfully",
                  "success"
                );
              }}
              renderItemProps={{
                projects,
                isRTL,
                t,
                priorityBadge,
                toggleTaskCompleted,
                handleToggleTaskReminder,
                handleOpenEdit,
                deleteTask,
                filterTag,
                onTagClick: (tag: string) => setFilterTag(filterTag === tag ? "all" : tag),
              }}
            />
          )}
        </View>
      )}

      {/* VIEW 2: KANBAN BOARD (mobile: vertical columns with status change selects) */}
      {viewMode === "board" && (
        filteredTasks.length === 0 ? (
          <View style={{ paddingVertical: 24 }}>
            <EmptyState
              imageSize="md"
              title={t.views.tasks.noTasksFound}
              description={
                localSearchQuery || filterStatus !== "all" || filterPriority !== "all"
                  ? isRTL
                    ? "هیچ وظیفه‌ای با فیلترهای کنونی در تخته کانبان یافت نشد."
                    : "No tasks match your active filters on the Kanban board."
                  : isRTL
                  ? "تخته کانبان در حال حاضر خالی است. نخستین وظیفه خود را اضافه کنید."
                  : "Your Kanban board is empty. Add a new task to start tracking progress."
              }
              actionLabel={tasks.length === 0 ? (isRTL ? "+ ایجاد وظیفه جدید" : "+ Create New Task") : undefined}
              onAction={tasks.length === 0 ? handleOpenCreate : undefined}
              icon={<CheckSquare size={16} color="#60a5fa" />}
            />
          </View>
        ) : (
        <View className="gap-5">
          {kanbanColumns.map((col) => {
            const colTasks = filteredTasks.filter((taskItem) => taskItem.status === col.id);
            return (
              <View key={col.id} className="rounded-3xl border border-neutral-800 bg-neutral-900/50 p-5">
                {/* Column Header */}
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#262626", paddingBottom: 12 }}>
                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
                    <View style={{ height: 8, width: 8, borderRadius: 4, backgroundColor: "#60a5fa" }} />
                    <T style={{ fontSize: 13, fontWeight: "700", color: "#ffffff" }}>{col.title}</T>
                  </View>
                  <View className="rounded-full border border-neutral-800 bg-neutral-900 px-2.5 py-0.5">
                    <T style={{ fontSize: 12, color: "#a3a3a3" }}>{colTasks.length}</T>
                  </View>
                </View>

                {/* Task Cards */}
                <View style={{ marginTop: 16, gap: 12, minHeight: 100 }}>
                  {colTasks.length === 0 ? (
                    <View
                      style={{
                        paddingVertical: 48,
                        alignItems: "center",
                        borderWidth: 1,
                        borderStyle: "dashed",
                        borderColor: "rgba(38,38,38,0.8)",
                        borderRadius: 16,
                      }}
                    >
                      <T style={{ fontSize: 12, color: "#737373" }}>{t.views.tasks.noTasksFound}</T>
                    </View>
                  ) : (
                    colTasks.map((taskItem) => {
                      const project = projects.find((p) => p.id === taskItem.projectId);
                      return (
                        <View key={taskItem.id} className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4" style={{ gap: 12 }}>
                          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                            <Pressable
                              onPress={() => toggleTaskCompleted(taskItem.id)}
                              style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "flex-start", gap: 8, flex: 1 }}
                            >
                              <View
                                style={{
                                  height: 18,
                                  width: 18,
                                  marginTop: 2,
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: 6,
                                  borderWidth: 1,
                                  borderColor: taskItem.isCompleted ? "#2563eb" : "#404040",
                                  backgroundColor: taskItem.isCompleted ? "#2563eb" : "transparent",
                                }}
                              />
                              <T
                                style={{
                                  fontSize: 13,
                                  fontWeight: "700",
                                  lineHeight: 20,
                                  textDecorationLine: taskItem.isCompleted ? "line-through" : "none",
                                  color: taskItem.isCompleted ? "#737373" : "#ffffff",
                                  flex: 1,
                                }}
                              >
                                {taskItem.name}
                              </T>
                            </Pressable>
                            <View>{priorityBadge(taskItem.priority)}</View>
                          </View>

                          {taskItem.description ? (
                            <T numberOfLines={2} style={{ fontSize: 12, color: "#a3a3a3", lineHeight: 19 }}>
                              {taskItem.description}
                            </T>
                          ) : null}

                          {taskItem.tags && taskItem.tags.length > 0 ? (
                            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, paddingTop: 4 }}>
                              {taskItem.tags.map((tag) => {
                                const isSelected = filterTag === tag;
                                return (
                                  <Pressable
                                    key={tag}
                                    onPress={() => setFilterTag(isSelected ? "all" : tag)}
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      gap: 2,
                                      borderRadius: 6,
                                      paddingHorizontal: 6,
                                      paddingVertical: 2,
                                      backgroundColor: isSelected ? "#2563eb" : "rgba(23,37,84,0.4)",
                                      borderWidth: 1,
                                      borderColor: isSelected ? "#3b82f6" : "rgba(30,64,175,0.4)",
                                    }}
                                  >
                                    <T style={{ fontSize: 10, fontWeight: "500", color: isSelected ? "#ffffff" : "#93c5fd" }}>
                                      #{tag}
                                    </T>
                                  </Pressable>
                                );
                              })}
                            </View>
                          ) : null}

                          <View
                            style={{
                              flexDirection: isRTL ? "row-reverse" : "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              paddingTop: 8,
                              borderTopWidth: 1,
                              borderTopColor: "#171717",
                            }}
                          >
                            {project ? (
                              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4, maxWidth: 140 }}>
                                <T style={{ fontSize: 12 }}>{project.icon}</T>
                                <T numberOfLines={1} style={{ fontSize: 12, color: "#d4d4d4" }}>{project.name}</T>
                              </View>
                            ) : (
                              <T style={{ fontSize: 12, color: "#525252" }}>—</T>
                            )}
                            {taskItem.dueDate ? (
                              <T style={{ fontSize: 12, color: "#a3a3a3" }}>{taskItem.dueDate}</T>
                            ) : null}
                          </View>

                          {/* Quick status change + actions */}
                          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", paddingTop: 4 }}>
                            <View style={{ flex: 1, marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }}>
                              <Select
                                value={taskItem.status}
                                options={[
                                  { value: "not_started" as Status, label: t.statuses.not_started },
                                  { value: "in_progress" as Status, label: t.statuses.in_progress },
                                  { value: "completed" as Status, label: t.statuses.completed },
                                ]}
                                onChange={(newStatus) => {
                                  updateTask(taskItem.id, {
                                    status: newStatus,
                                    isCompleted: newStatus === "completed",
                                  });
                                }}
                              />
                            </View>

                            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4 }}>
                              <Pressable onPress={() => handleOpenEdit(taskItem)} className="rounded-lg p-1.5">
                                <Edit2 size={14} color="#a3a3a3" />
                              </Pressable>
                              <Pressable onPress={() => deleteTask(taskItem.id)} className="rounded-lg p-1.5">
                                <Trash2 size={14} color="#a3a3a3" />
                              </Pressable>
                            </View>
                          </View>
                        </View>
                      );
                    })
                  )}
                </View>
              </View>
            );
          })}
        </View>
        )
      )}

      {/* VIEW 3: CALENDAR VIEW */}
      {viewMode === "calendar" && (
        <View className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6" style={{ gap: 20 }}>
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#262626", paddingBottom: 16 }}>
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
              <CalendarIcon size={16} color="#60a5fa" />
              <T style={{ fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
                {t.views.tasks.calendarView}
              </T>
            </View>
            <T style={{ fontSize: 12, color: "#a3a3a3" }}>
              {tasks.filter((taskItem) => taskItem.dueDate).length} {t.nav.tasks}
            </T>
          </View>

          <View style={{ gap: 16 }}>
            {tasks
              .filter((taskItem) => taskItem.dueDate)
              .map((taskItem) => (
                <View key={taskItem.id} className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4" style={{ gap: 10 }}>
                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View className="rounded-full border border-neutral-800 bg-neutral-900 px-2.5 py-0.5">
                      <T style={{ fontSize: 12, fontWeight: "600", color: "#60a5fa" }}>{taskItem.dueDate}</T>
                    </View>
                    {priorityBadge(taskItem.priority)}
                  </View>
                  <T style={{ fontSize: 13, fontWeight: "700", color: "#ffffff" }}>{taskItem.name}</T>
                  {taskItem.description ? (
                    <T numberOfLines={1} style={{ fontSize: 12, color: "#a3a3a3" }}>
                      {taskItem.description}
                    </T>
                  ) : null}
                  {taskItem.tags && taskItem.tags.length > 0 ? (
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, paddingTop: 4 }}>
                      {taskItem.tags.map((tag) => {
                        const isSelected = filterTag === tag;
                        return (
                          <Pressable
                            key={tag}
                            onPress={() => setFilterTag(isSelected ? "all" : tag)}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 2,
                              borderRadius: 6,
                              paddingHorizontal: 6,
                              paddingVertical: 2,
                              backgroundColor: isSelected ? "#2563eb" : "rgba(23,37,84,0.4)",
                              borderWidth: 1,
                              borderColor: isSelected ? "#3b82f6" : "rgba(30,64,175,0.4)",
                            }}
                          >
                            <T style={{ fontSize: 10, fontWeight: "500", color: isSelected ? "#ffffff" : "#93c5fd" }}>
                              #{tag}
                            </T>
                          </Pressable>
                        );
                      })}
                    </View>
                  ) : null}
                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", paddingTop: 8, borderTopWidth: 1, borderTopColor: "#171717" }}>
                    {statusBadge(taskItem.status)}
                    <T style={{ fontSize: 12, color: "#a3a3a3" }}>
                      {taskItem.estimatedTime ? `${taskItem.estimatedTime}h` : "—"}
                    </T>
                  </View>
                </View>
              ))}
          </View>
        </View>
      )}

      {/* Modal: Add or Edit Task */}
      <TaskEditModal
        visible={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        editingTask={editingTask}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        status={status}
        setStatus={setStatus}
        priority={priority}
        setPriority={setPriority}
        dueDate={dueDate}
        setDueDate={setDueDate}
        estimatedTime={estimatedTime}
        setEstimatedTime={setEstimatedTime}
        projectId={projectId}
        setProjectId={setProjectId}
        goalId={goalId}
        setGoalId={setGoalId}
        onSave={handleSaveTask}
        projects={projects}
        goals={goals}
        isRTL={isRTL}
        t={t}
        taskTags={taskTags}
        setTaskTags={setTaskTags}
        allWorkspaceTags={allWorkspaceTags}
      />
    </View>
  );
};

// --- DraggableFlatList wrapper ---
import DraggableFlatListDefault, {
  ScaleDecorator,
  DragEndParams,
} from "react-native-draggable-flatlist";

interface DraggableListProps {
  data: Task[];
  onReorder: (tasks: Task[]) => void;
  renderItemProps: any;
}

const DraggableList: React.FC<DraggableListProps> = ({ data, onReorder, renderItemProps }) => {
  const handleDragEnd = ({ data: updated }: DragEndParams<Task>) => {
    onReorder(updated);
  };

  return (
    <DraggableFlatListDefault
      data={data}
      keyExtractor={(item: Task) => item.id}
      onDragEnd={handleDragEnd}
      renderItem={({ item, drag, isActive }: { item: Task; drag: () => void; isActive: boolean }) => (
        <ScaleDecorator>
          <SortableTaskRow
            taskItem={item}
            project={renderItemProps.projects.find((p: any) => p.id === item.projectId)}
            isRTL={renderItemProps.isRTL}
            t={renderItemProps.t}
            priorityBadge={renderItemProps.priorityBadge}
            toggleTaskCompleted={renderItemProps.toggleTaskCompleted}
            handleToggleTaskReminder={renderItemProps.handleToggleTaskReminder}
            handleOpenEdit={renderItemProps.handleOpenEdit}
            deleteTask={renderItemProps.deleteTask}
            drag={drag}
            isActive={isActive}
            selectedTag={renderItemProps.filterTag}
            onTagClick={renderItemProps.onTagClick}
          />
        </ScaleDecorator>
      )}
      activationDistance={10}
    />
  );
};

// --- Task Edit Modal ---
interface TaskEditModalProps {
  visible: boolean;
  onClose: () => void;
  editingTask: Task | null;
  name: string;
  setName: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  status: Status;
  setStatus: (s: Status) => void;
  priority: Priority;
  setPriority: (p: Priority) => void;
  dueDate: string;
  setDueDate: (v: string) => void;
  estimatedTime: number;
  setEstimatedTime: (v: number) => void;
  projectId: string;
  setProjectId: (v: string) => void;
  goalId: string;
  setGoalId: (v: string) => void;
  onSave: () => void;
  projects: any[];
  goals: any[];
  isRTL: boolean;
  t: any;
  taskTags: string[];
  setTaskTags: (v: string[]) => void;
  allWorkspaceTags: string[];
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({
  visible,
  onClose,
  editingTask,
  name,
  setName,
  description,
  setDescription,
  status,
  setStatus,
  priority,
  setPriority,
  dueDate,
  setDueDate,
  estimatedTime,
  setEstimatedTime,
  projectId,
  setProjectId,
  goalId,
  setGoalId,
  onSave,
  projects,
  goals,
  isRTL,
  t,
  taskTags,
  setTaskTags,
  allWorkspaceTags,
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
              <CheckSquare size={16} color="#60a5fa" />
              <T style={{ fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
                {editingTask ? t.views.tasks.editModalTitle : t.views.tasks.createModalTitle}
              </T>
            </View>
            <Pressable onPress={onClose} className="rounded-xl p-1.5">
              <X size={16} color="#a3a3a3" />
            </Pressable>
          </View>

          <View style={{ marginTop: 16, gap: 16 }}>
            <View>
              <T style={labelStyle}>{t.views.tasks.taskNameLabel}</T>
              <Input
                value={name}
                onChangeText={setName}
                placeholder={t.views.tasks.taskNamePlaceholder}
                style={inputStyle}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
              <View style={{ flex: 1, minWidth: "45%" }}>
                <T style={labelStyle}>{t.common.status}</T>
                <Select
                  value={status}
                  options={[
                    { value: "not_started" as Status, label: t.statuses.not_started },
                    { value: "in_progress" as Status, label: t.statuses.in_progress },
                    { value: "completed" as Status, label: t.statuses.completed },
                  ]}
                  onChange={setStatus}
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

            <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
              <View style={{ flex: 1, minWidth: "45%" }}>
                <T style={labelStyle}>{t.views.tasks.dueDateCol}</T>
                <Input
                  value={dueDate}
                  onChangeText={setDueDate}
                  placeholder={isRTL ? "۱۴۰۴/۰۲/۲۵" : "2025-05-15"}
                  style={inputStyle}
                />
              </View>

              <View style={{ flex: 1, minWidth: "45%" }}>
                <T style={labelStyle}>{t.views.tasks.estTimeCol}</T>
                <Input
                  value={String(estimatedTime)}
                  onChangeText={(v) => setEstimatedTime(Number(v) || 0)}
                  keyboardType="numeric"
                  style={inputStyle}
                />
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
              <View style={{ flex: 1, minWidth: "45%" }}>
                <T style={labelStyle}>{t.views.tasks.project}</T>
                <Select
                  value={projectId}
                  options={[
                    { value: "", label: t.views.tasks.noProject },
                    ...projects.map((p: any) => ({ value: p.id, label: p.name })),
                  ]}
                  onChange={setProjectId}
                />
              </View>

              <View style={{ flex: 1, minWidth: "45%" }}>
                <T style={labelStyle}>{t.nav.goals}</T>
                <Select
                  value={goalId}
                  options={[
                    { value: "", label: t.views.tasks.noGoal },
                    ...goals.map((g: any) => ({ value: g.id, label: g.name })),
                  ]}
                  onChange={setGoalId}
                />
              </View>
            </View>

            <View>
              <T style={labelStyle}>{t.views.tasks.taskDescLabel}</T>
              <Input
                multiline
                value={description}
                onChangeText={setDescription}
                placeholder={t.views.tasks.taskDescPlaceholder}
                style={[inputStyle, { minHeight: 60, textAlignVertical: "top" }]}
              />
            </View>

            {/* Task Tags with auto-complete */}
            <View>
              <T style={labelStyle}>{t.common.tags}</T>
              <TagInput
                tags={taskTags}
                onChange={setTaskTags}
                allAvailableTags={allWorkspaceTags}
                isRTL={isRTL}
                placeholder={
                  isRTL
                    ? "افزودن برچسب تسک... (مثلاً: #پایگاه_داده، #طراحی)"
                    : "Add task tags... (e.g. #database, #frontend)"
                }
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
              <Btn title={t.common.cancel} variant="ghost" onPress={onClose} />
              <Btn title={editingTask ? t.common.save : t.common.add} onPress={onSave} />
            </View>
          </View>
        </View>
      </ScrollView>
    </ModalShell>
  );
};
