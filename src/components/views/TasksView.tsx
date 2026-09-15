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
  } = useSecondBrain();

  const [viewMode, setViewMode] = useState<"table" | "board" | "calendar">("table");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
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

  const filteredTasks = tasks.filter((taskItem) => {
    if (filterStatus !== "all" && taskItem.status !== filterStatus) return false;
    if (filterPriority !== "all" && taskItem.priority !== filterPriority) return false;
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
    setIsCreateModalOpen(true);
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

      {/* VIEW 1: LIST VIEW WITH DRAG REORDERING */}
      {viewMode === "table" && (
        <View className="overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/60">
          {filteredTasks.length === 0 ? (
            <T style={{ paddingVertical: 56, textAlign: "center", fontSize: 12, color: "#a3a3a3" }}>
              {t.views.tasks.noTasksFound}
            </T>
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
              }}
            />
          )}
        </View>
      )}

      {/* VIEW 2: KANBAN BOARD (mobile: vertical columns with status change selects) */}
      {viewMode === "board" && (
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
