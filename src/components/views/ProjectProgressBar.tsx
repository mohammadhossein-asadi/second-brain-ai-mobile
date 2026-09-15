import React from "react";
import { View } from "react-native";
import { CheckCircle2, Circle, AlertCircle, CheckSquare } from "lucide-react-native";
import { Project, Task } from "../../types";
import { useAppStore } from "../../context/AppContext";
import { T } from "../ui/primitives";

interface ProjectProgressBarProps {
  project: Project;
  tasks?: Task[];
  showDetails?: boolean;
  className?: string;
}

export const ProjectProgressBar: React.FC<ProjectProgressBarProps> = ({
  project,
  tasks: propTasks,
  showDetails = true,
}) => {
  const { tasks: contextTasks, isRTL, t } = useAppStore();
  const allTasks = propTasks || contextTasks;

  // Find all tasks linked to this project
  const projectTasks = allTasks.filter((task) => task.projectId === project.id);
  const totalTasks = projectTasks.length;
  const checkedTasks = projectTasks.filter((task) => task.isCompleted).length;
  const uncheckedTasks = totalTasks - checkedTasks;

  const hasLinkedTasks = totalTasks > 0;
  const calculatedPercentage = hasLinkedTasks
    ? Math.round((checkedTasks / totalTasks) * 100)
    : Math.min(100, Math.max(0, project.progress ?? 0));

  const isComplete = hasLinkedTasks ? checkedTasks === totalTasks : calculatedPercentage === 100;

  const getProgressColor = () => {
    if (isComplete) return "#34d399";
    if (calculatedPercentage >= 70) return "#22d3ee";
    if (calculatedPercentage >= 35) return "#6366f1";
    if (calculatedPercentage > 0) return "#facc15";
    return "#525252";
  };

  const getTextColor = () => {
    if (isComplete) return "#34d399";
    if (calculatedPercentage >= 70) return "#22d3ee";
    if (calculatedPercentage >= 35) return "#60a5fa";
    if (calculatedPercentage > 0) return "#fbbf24";
    return "#a3a3a3";
  };

  return (
    <View className="gap-2.5">
      {/* Top Header: Progress Label and Percentage */}
      <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
          {isComplete ? (
            <CheckCircle2 size={14} color="#34d399" />
          ) : (
            <CheckSquare size={14} color="#60a5fa" />
          )}
          <T style={{ fontSize: 12, color: "#a3a3a3" }}>{t.views.projects.progressLabel}</T>
        </View>
        <T style={{ fontSize: 13, fontWeight: "700", color: getTextColor() }}>
          {calculatedPercentage}%
        </T>
      </View>

      {/* Progress Bar Track and Filled Bar */}
      <View
        style={{
          height: 8,
          width: "100%",
          borderRadius: 999,
          backgroundColor: "#0a0a0a",
          borderWidth: 1,
          borderColor: "#262626",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            borderRadius: 999,
            backgroundColor: getProgressColor(),
            width: `${calculatedPercentage}%`,
          }}
        />
      </View>

      {/* Detailed Checked vs Unchecked Tasks Breakdown */}
      {showDetails && (
        <View
          style={{
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 2,
          }}
        >
          {hasLinkedTasks ? (
            <>
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4 }}>
                <CheckCircle2 size={12} color="rgba(52,211,153,0.9)" />
                <T style={{ fontSize: 11, color: "rgba(52,211,153,0.9)" }}>
                  {checkedTasks} {isRTL ? "انجام‌شده" : "checked"}
                </T>
              </View>

              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4 }}>
                <Circle size={10} color="#737373" />
                <T style={{ fontSize: 11, color: "#a3a3a3" }}>
                  {uncheckedTasks} {isRTL ? "باقیمانده" : "unchecked"}
                </T>
              </View>

              <View
                style={{
                  backgroundColor: "#171717",
                  borderWidth: 1,
                  borderColor: "rgba(38,38,38,0.8)",
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 6,
                }}
              >
                <T style={{ fontSize: 10, color: "#737373" }}>
                  {checkedTasks}/{totalTasks}
                </T>
              </View>
            </>
          ) : (
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4 }}>
                <AlertCircle size={12} color="#525252" />
                <T style={{ fontSize: 10, color: "#737373", fontStyle: "italic" }}>
                  {isRTL ? "تسک مستقیمی ثبت نشده است" : "No tasks linked to this project"}
                </T>
              </View>
              <View
                style={{
                  backgroundColor: "#171717",
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: "rgba(38,38,38,0.6)",
                }}
              >
                <T style={{ fontSize: 10, color: "#737373" }}>
                  {isRTL ? "پیشرفت دستی" : "Manual"}: {calculatedPercentage}%
                </T>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};
