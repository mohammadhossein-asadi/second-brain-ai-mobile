import React from "react";
import { View, Pressable } from "react-native";
import { GripVertical, Check, Bell, Edit2, Trash2 } from "lucide-react-native";
import { Task, Project, Priority } from "../../types";
import { T } from "../ui/primitives";

interface SortableTaskRowProps {
  taskItem: Task;
  project: Project | undefined;
  isRTL: boolean;
  t: any;
  priorityBadge: (priority: Priority) => React.ReactNode;
  toggleTaskCompleted: (id: string) => void;
  handleToggleTaskReminder: (task: Task) => void;
  handleOpenEdit: (task: Task) => void;
  deleteTask: (id: string) => void;
  drag: () => void;
  isActive: boolean;
  selectedTag?: string;
  onTagClick?: (tag: string) => void;
}

/**
 * Mobile row renderer used inside DraggableFlatList (replaces @dnd-kit's useSortable).
 */
export const SortableTaskRow: React.FC<SortableTaskRowProps> = ({
  taskItem,
  project,
  isRTL,
  t,
  priorityBadge,
  toggleTaskCompleted,
  handleToggleTaskReminder,
  handleOpenEdit,
  deleteTask,
  drag,
  isActive,
  selectedTag,
  onTagClick,
}) => {
  return (
    <View
      style={{
        flexDirection: isRTL ? "row-reverse" : "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(38,38,38,0.6)",
        backgroundColor: isActive ? "rgba(59,130,246,0.15)" : "transparent",
        opacity: isActive ? 0.85 : 1,
        borderRadius: isActive ? 12 : 0,
      }}
    >
      {/* Drag Handle */}
      <Pressable
        onLongPress={drag}
        delayLongPress={150}
        style={{ width: 32, alignItems: "center", padding: 6 }}
      >
        <GripVertical size={16} color="#737373" />
      </Pressable>

      {/* Checkbox */}
      <Pressable
        onPress={() => toggleTaskCompleted(taskItem.id)}
        style={{
          height: 20,
          width: 20,
          marginHorizontal: 12,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: taskItem.isCompleted ? "#2563eb" : "#404040",
          backgroundColor: taskItem.isCompleted ? "#2563eb" : "#171717",
        }}
      >
        {taskItem.isCompleted ? <Check size={14} color="#ffffff" /> : null}
      </Pressable>

      {/* Name & description */}
      <View style={{ flex: 1, minWidth: 0 }}>
        <T
          numberOfLines={1}
          style={{
            fontSize: 13,
            fontWeight: "600",
            color: taskItem.isCompleted ? "#737373" : "#ffffff",
            textDecorationLine: taskItem.isCompleted ? "line-through" : "none",
          }}
        >
          {taskItem.name}
        </T>
        {taskItem.description ? (
          <T numberOfLines={1} style={{ fontSize: 12, color: "#a3a3a3", marginTop: 2 }}>
            {taskItem.description}
          </T>
        ) : null}

        {/* Tags */}
        {taskItem.tags && taskItem.tags.length > 0 ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
            {taskItem.tags.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <Pressable
                  key={tag}
                  onPress={() => onTagClick?.(tag)}
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

        {/* Mobile meta row: project / due / estimate */}
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
          {project ? (
            <View
              style={{
                flexDirection: isRTL ? "row-reverse" : "row",
                alignItems: "center",
                gap: 6,
                borderRadius: 999,
                backgroundColor: "#171717",
                borderWidth: 1,
                borderColor: "#262626",
                paddingHorizontal: 10,
                paddingVertical: 2,
              }}
            >
              <T style={{ fontSize: 11 }}>{project.icon || "📁"}</T>
              <T numberOfLines={1} style={{ fontSize: 11, color: "#d4d4d4", maxWidth: 130 }}>
                {project.name}
              </T>
            </View>
          ) : null}
          <T style={{ fontSize: 11, color: "#a3a3a3" }}>
            {taskItem.dueDate || "—"}
          </T>
          {taskItem.estimatedTime ? (
            <T style={{ fontSize: 11, color: "#a3a3a3" }}>{taskItem.estimatedTime}h</T>
          ) : null}
        </View>
      </View>

      {/* Priority badge */}
      <View style={{ marginHorizontal: 8 }}>{priorityBadge(taskItem.priority)}</View>

      {/* Actions */}
      <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 2 }}>
        <Pressable
          onPress={() => handleToggleTaskReminder(taskItem)}
          style={({ pressed }) => ({
            borderRadius: 8,
            padding: 6,
            backgroundColor: taskItem.reminderSet
              ? "rgba(69,26,3,0.4)"
              : pressed
              ? "#262626"
              : "transparent",
          })}
        >
          <Bell size={14} color={taskItem.reminderSet ? "#fbbf24" : "#737373"} />
        </Pressable>
        <Pressable
          onPress={() => handleOpenEdit(taskItem)}
          style={({ pressed }) => ({ borderRadius: 8, padding: 6, opacity: pressed ? 0.7 : 1 })}
        >
          <Edit2 size={14} color="#a3a3a3" />
        </Pressable>
        <Pressable
          onPress={() => deleteTask(taskItem.id)}
          style={({ pressed }) => ({
            borderRadius: 8,
            padding: 6,
            backgroundColor: pressed ? "rgba(76,5,25,0.6)" : "transparent",
          })}
        >
          <Trash2 size={14} color="#a3a3a3" />
        </Pressable>
      </View>
    </View>
  );
};
