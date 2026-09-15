import React, { useState } from "react";
import { View, Pressable } from "react-native";
import {
  BellRing,
  Bell,
  Calendar,
  ChevronDown,
  ChevronUp,
  Sparkles,
  X,
} from "lucide-react-native";
import { Task } from "../../types";
import { useSecondBrain } from "../../context/SecondBrainContext";
import { T } from "../ui/primitives";

interface TaskReminderBannerProps {
  tasks: Task[];
  onSetReminder: (taskId: string, reminderTime: string) => void;
  onDismissAll?: () => void;
}

export const TaskReminderBanner: React.FC<TaskReminderBannerProps> = ({
  tasks,
  onSetReminder,
}) => {
  const { isRTL, showToast } = useSecondBrain();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  // Filter incomplete tasks with high or critical priority that don't have a reminder set yet
  const urgentTasksNeedingReminders = tasks.filter(
    (t) =>
      !t.isCompleted &&
      t.status !== "completed" &&
      (t.priority === "critical" || t.priority === "high") &&
      !t.reminderSet
  );

  if (isDismissed || urgentTasksNeedingReminders.length === 0) {
    return null;
  }

  const handleSetAll = () => {
    urgentTasksNeedingReminders.forEach((task) => {
      const suggestedTime = task.dueDate
        ? `${task.dueDate} - ۰۹:۰۰ صبح`
        : isRTL ? "صبح روز موعد ساعت ۰۹:۰۰" : "09:00 AM on due date";
      onSetReminder(task.id, suggestedTime);
    });

    showToast(
      isRTL
        ? `یادآور هوشمند برای ${urgentTasksNeedingReminders.length} تسک با اولویت بالا تنظیم شد`
        : `Smart reminders scheduled for ${urgentTasksNeedingReminders.length} high-priority tasks`,
      "success",
      isRTL ? "سیستم یادآور هوشمند" : "Smart Reminders"
    );
  };

  return (
    <View className="rounded-3xl border border-amber-500/30 bg-neutral-900/80 p-4">
      <View style={{ flexDirection: isRTL ? "row-reverse" : "row", justifyContent: "space-between", gap: 12 }}>
        <View style={{ flex: 1, flexDirection: isRTL ? "row-reverse" : "row", gap: 12 }}>
          <View className="h-10 w-10 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10">
            <BellRing size={20} color="#fbbf24" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <T style={{ fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
                {isRTL
                  ? "پیشنهاد هوشمند: تنظیم یادآور برای تسک‌های با اولویت بالا"
                  : "Smart Suggestion: Set Reminders for High-Priority Tasks"}
              </T>
              <View className="rounded-full border border-rose-500/40 bg-rose-500/20 px-2 py-0.5">
                <T style={{ fontSize: 10, fontWeight: "700", color: "#fda4af" }}>
                  {urgentTasksNeedingReminders.length} {isRTL ? "تسک بدون یادآور" : "tasks"}
                </T>
              </View>
            </View>
            <T style={{ fontSize: 12, color: "#a3a3a3", marginTop: 2 }}>
              {isRTL
                ? "بر اساس تاریخ موعد و اولویت تسک‌ها، برای جلوگیری از تعویق پیشنهاد می‌شود یادآور فعال شود."
                : "Based on due dates and task priorities, setting automated reminders prevents delay."}
            </T>
          </View>
        </View>

        {/* Action buttons */}
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
          <Pressable
            onPress={handleSetAll}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: "#f59e0b",
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 9,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Sparkles size={14} color="#171717" />
            <T style={{ fontSize: 12, fontWeight: "700", color: "#171717" }}>
              {isRTL ? "تنظیم خودکار برای همه" : "Schedule All"}
            </T>
          </Pressable>

          <Pressable
            onPress={() => setIsExpanded((prev) => !prev)}
            className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-2"
          >
            {isExpanded ? <ChevronUp size={16} color="#a3a3a3" /> : <ChevronDown size={16} color="#a3a3a3" />}
          </Pressable>

          <Pressable
            onPress={() => setIsDismissed(true)}
            className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-2"
          >
            <X size={16} color="#a3a3a3" />
          </Pressable>
        </View>
      </View>

      {/* Expanded tasks suggestion list */}
      {isExpanded && (
        <View className="mt-4 gap-3 border-t border-neutral-800/80 pt-3">
          {urgentTasksNeedingReminders.slice(0, 6).map((task) => {
            const suggestedTime = task.dueDate
              ? `${task.dueDate} - ۰۹:۰۰`
              : isRTL ? "روز موعد ساعت ۰۹:۰۰" : "Due date 09:00 AM";

            return (
              <View
                key={task.id}
                className="rounded-2xl border border-neutral-800/90 bg-neutral-950/70 p-3"
                style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", gap: 10 }}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
                    <View
                      style={{
                        height: 8,
                        width: 8,
                        borderRadius: 4,
                        backgroundColor: task.priority === "critical" ? "#f43f5e" : "#fbbf24",
                      }}
                    />
                    <T numberOfLines={1} style={{ fontSize: 12, fontWeight: "700", color: "#ffffff", flex: 1 }}>
                      {task.name}
                    </T>
                  </View>
                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4 }}>
                      <Calendar size={12} color="#737373" />
                      <T style={{ fontSize: 11, color: "#a3a3a3" }}>
                        {task.dueDate || (isRTL ? "بدون تاریخ" : "No date")}
                      </T>
                    </View>
                    <T style={{ fontSize: 11, color: "#525252" }}>•</T>
                    <T numberOfLines={1} style={{ fontSize: 11, color: "rgba(251,191,36,0.9)", flexShrink: 1 }}>
                      {suggestedTime}
                    </T>
                  </View>
                </View>

                <Pressable
                  onPress={() => {
                    onSetReminder(task.id, suggestedTime);
                    showToast(
                      isRTL
                        ? `یادآور برای تسک «${task.name}» در زمان ${suggestedTime} تنظیم شد`
                        : `Reminder set for '${task.name}' at ${suggestedTime}`,
                      "success"
                    );
                  }}
                  style={({ pressed }) => ({
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    gap: 4,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "rgba(245,158,11,0.4)",
                    backgroundColor: pressed ? "#f59e0b" : "#171717",
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                  })}
                >
                  <Bell size={12} color="#fcd34d" />
                  <T style={{ fontSize: 11, fontWeight: "700", color: "#fcd34d" }}>
                    {isRTL ? "فعال‌سازی" : "Set"}
                  </T>
                </Pressable>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};
