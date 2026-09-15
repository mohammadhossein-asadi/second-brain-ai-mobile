import React, { useState } from "react";
import { View, Pressable } from "react-native";
import Svg, { Circle } from "react-native-svg";
import {
  FolderKanban,
  Target,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
} from "lucide-react-native";
import { Project, Goal, Task } from "../../types";
import { T } from "../ui/primitives";
import { useThemeColors } from "../../lib/theme";

interface ProgressRingsSectionProps {
  projects: Project[];
  goals: Goal[];
  tasks: Task[];
  isRTL: boolean;
  onNavigateToProjects: () => void;
  onNavigateToGoals: () => void;
}

// Reusable Circular SVG Progress Ring Component
interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: "blue" | "emerald" | "indigo" | "amber" | "sky" | "purple";
  icon?: React.ReactNode;
  showPercentage?: boolean;
  trackColor?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 72,
  strokeWidth = 6,
  color = "blue",
  icon,
  showPercentage = true,
  trackColor,
}) => {
  const normalizedRadius = (size - strokeWidth) / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  const colorMap = {
    blue: { stroke: "#3b82f6", text: "#60a5fa" },
    emerald: { stroke: "#3b82f6", text: "#60a5fa" },
    indigo: { stroke: "#6366f1", text: "#818cf8" },
    amber: { stroke: "#f59e0b", text: "#fbbf24" },
    sky: { stroke: "#0ea5e9", text: "#38bdf8" },
    purple: { stroke: "#a855f7", text: "#c084fc" },
  };

  const scheme = colorMap[color];

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg height={size} width={size} style={{ transform: [{ rotate: "-90deg" }] }}>
        <Circle
          stroke={trackColor || "#1f2937"}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
        <Circle
          stroke={scheme.stroke}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
      </Svg>

      {/* Center Label / Percentage */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
        {showPercentage && (
          <T style={{ fontSize: 12, fontWeight: "700", color: scheme.text, marginTop: 2 }}>
            {Math.round(clampedProgress)}%
          </T>
        )}
      </View>
    </View>
  );
};

export const ProgressRingsSection: React.FC<ProgressRingsSectionProps> = ({
  projects,
  goals,
  isRTL,
  onNavigateToProjects,
  onNavigateToGoals,
}) => {
  const c = useThemeColors();
  const [filterMode, setFilterMode] = useState<"all" | "projects" | "goals">("all");

  // Filter active projects and goals
  const activeProjects = projects.filter((p) => p.status === "in_progress" || p.status === "not_started");
  const activeGoals = goals.filter((g) => !g.isCompleted);

  // Compute overall portfolio progress
  const averageProjectProgress =
    activeProjects.length > 0
      ? Math.round(
          activeProjects.reduce((acc, p) => acc + (p.progress || 0), 0) / activeProjects.length
        )
      : 0;

  const averageGoalProgress =
    activeGoals.length > 0
      ? Math.round(
          activeGoals.reduce((acc, g) => acc + (g.progress || 0), 0) / activeGoals.length
        )
      : 0;

  const overallVelocity = Math.round(averageProjectProgress * 0.55 + averageGoalProgress * 0.45);

  const getProgressColor = (progress: number): "blue" | "emerald" | "indigo" | "amber" | "sky" => {
    if (progress >= 75) return "blue";
    if (progress >= 50) return "indigo";
    if (progress >= 25) return "sky";
    return "amber";
  };

  const FilterTab = ({
    mode,
    label,
    icon,
    activeColor,
  }: {
    mode: "all" | "projects" | "goals";
    label: string;
    icon?: React.ReactNode;
    activeColor: string;
  }) => (
    <Pressable
      onPress={() => setFilterMode(mode)}
      style={({ pressed }) => ({
        flexDirection: isRTL ? "row-reverse" : "row",
        alignItems: "center",
        gap: 6,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: filterMode === mode ? c.borderHover : "transparent",
        backgroundColor: filterMode === mode ? c.bgElevated : "transparent",
        opacity: pressed ? 0.8 : 1,
      })}
    >
      {icon}
      <T
        style={{
          fontSize: 12,
          fontWeight: "600",
          color: filterMode === mode ? activeColor : c.textMuted,
        }}
      >
        {label}
      </T>
    </Pressable>
  );

  return (
    <View
      className="rounded-3xl border p-5"
      style={{ backgroundColor: c.cardSurface, borderColor: c.borderColor }}
    >
      {/* Section Header */}
      <View
        style={{
          flexDirection: isRTL ? "row-reverse" : "row",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 20,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: c.borderSubtle,
          flexWrap: "wrap",
        }}
      >
        <View style={{ flex: 1, minWidth: 200 }}>
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
            <View
              className="h-7 w-7 items-center justify-center rounded-xl border bg-indigo-500/10"
              style={{ borderColor: "rgba(99,102,241,0.2)" }}
            >
              <TrendingUp size={16} color="#818cf8" />
            </View>
            <T style={{ fontSize: 13, fontWeight: "700", color: c.textPrimary }}>
              {isRTL ? "حلقه‌های پیشرفت پروژه‌ها و اهداف" : "Completion Progress Rings"}
            </T>
            <View
              className="rounded-full border bg-blue-500/10 px-2 py-0.5"
              style={{ borderColor: "rgba(59,130,246,0.3)" }}
            >
              <T style={{ fontSize: 10, fontWeight: "700", color: "#60a5fa" }}>
                {overallVelocity}% {isRTL ? "پیشرفت کل" : "Overall"}
              </T>
            </View>
          </View>
          <T style={{ fontSize: 12, color: c.textMuted, marginTop: 4 }}>
            {isRTL
              ? "پایش چشمی نرخ تکمیل و پیشروی پروژه‌های فعال (PARA) و مقاصد استراتژیک"
              : "Visual completion percentages for active projects (PARA) and strategic goals"}
          </T>
        </View>

        {/* Filter Tabs */}
        <View
          style={{
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            backgroundColor: c.bgSubtle,
            borderWidth: 1,
            borderColor: c.borderColor,
            borderRadius: 16,
            padding: 4,
          }}
        >
          <FilterTab mode="all" label={isRTL ? "ترکیبی" : "All"} activeColor={c.textPrimary} />
          <FilterTab
            mode="projects"
            label={isRTL ? "پروژه‌ها" : "Projects"}
            icon={<FolderKanban size={14} color={filterMode === "projects" ? "#818cf8" : c.textMuted} />}
            activeColor="#818cf8"
          />
          <FilterTab
            mode="goals"
            label={isRTL ? "اهداف" : "Goals"}
            icon={<Target size={14} color={filterMode === "goals" ? "#60a5fa" : c.textMuted} />}
            activeColor="#60a5fa"
          />
        </View>
      </View>

      {/* Main Grid: Overview Summary Ring + Item Rings */}
      <View className="gap-4">
        {/* Overall Executive Momentum Ring Card */}
        <View
          className="rounded-2xl border p-5"
          style={{ backgroundColor: c.bgSubtle, borderColor: c.borderSubtle, alignItems: "center" }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <T style={{ fontSize: 11, fontWeight: "600", color: c.textMuted }}>
              {isRTL ? "تکانه کلی" : "Momentum"}
            </T>
            <Sparkles size={14} color="#fbbf24" />
          </View>

          <View style={{ marginVertical: 12 }}>
            <ProgressRing
              progress={overallVelocity}
              size={116}
              strokeWidth={10}
              color={overallVelocity >= 65 ? "blue" : "indigo"}
              trackColor={c.bgHover}
            />
          </View>

          <View style={{ width: "100%", gap: 8, marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: c.borderSubtle }}>
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4 }}>
                <FolderKanban size={12} color="#818cf8" />
                <T style={{ fontSize: 12, color: c.textSecondary }}>
                  {isRTL ? "میانگین پروژه‌ها:" : "Avg Projects:"}
                </T>
              </View>
              <T style={{ fontSize: 12, fontWeight: "700", color: c.textPrimary }}>
                {averageProjectProgress}%
              </T>
            </View>
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4 }}>
                <Target size={12} color="#60a5fa" />
                <T style={{ fontSize: 12, color: c.textSecondary }}>
                  {isRTL ? "میانگین اهداف:" : "Avg Goals:"}
                </T>
              </View>
              <T style={{ fontSize: 12, fontWeight: "700", color: c.textPrimary }}>
                {averageGoalProgress}%
              </T>
            </View>
          </View>
        </View>

        {/* Active Projects & Goals Progress Rings */}
        <View className="gap-3.5">
          {/* Render Projects */}
          {(filterMode === "all" || filterMode === "projects") &&
            activeProjects.slice(0, filterMode === "projects" ? 6 : 3).map((proj) => {
              const color = getProgressColor(proj.progress);
              return (
                <Pressable
                  key={proj.id}
                  onPress={onNavigateToProjects}
                  style={({ pressed }) => ({
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    gap: 14,
                    backgroundColor: c.bgSubtle,
                    borderWidth: 1,
                    borderColor: pressed ? "#818cf8" : c.borderSubtle,
                    borderRadius: 16,
                    padding: 16,
                    opacity: pressed ? 0.9 : 1,
                  })}
                >
                  <ProgressRing
                    progress={proj.progress}
                    size={64}
                    strokeWidth={5.5}
                    color={color}
                    trackColor={c.bgHover}
                  />

                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
                      <T style={{ fontSize: 14 }}>{proj.icon || "📁"}</T>
                      <T numberOfLines={1} style={{ fontSize: 13, fontWeight: "700", color: c.textPrimary, flex: 1 }}>
                        {proj.name}
                      </T>
                    </View>

                    <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8, marginTop: 4 }}>
                      <T numberOfLines={1} style={{ fontSize: 11, color: c.textMuted }}>
                        {proj.category}
                      </T>
                      <T style={{ fontSize: 11, color: c.textMuted }}>•</T>
                      <T style={{ fontSize: 10, color: c.textSubtle }}>
                        {proj.status === "in_progress" ? (isRTL ? "جاری" : "Active") : isRTL ? "برنامه‌ریزی" : "Planning"}
                      </T>
                    </View>

                    <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                      <T style={{ fontSize: 10, color: c.textSubtle }}>
                        {isRTL ? "پیشرفت" : "Progress"}: {proj.progress}%
                      </T>
                      <ArrowUpRight size={12} color={c.textSubtle} />
                    </View>
                  </View>
                </Pressable>
              );
            })}

          {/* Render Goals */}
          {(filterMode === "all" || filterMode === "goals") &&
            activeGoals.slice(0, filterMode === "goals" ? 6 : 3).map((goal) => {
              const color = getProgressColor(goal.progress);
              return (
                <Pressable
                  key={goal.id}
                  onPress={onNavigateToGoals}
                  style={({ pressed }) => ({
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    gap: 14,
                    backgroundColor: c.bgSubtle,
                    borderWidth: 1,
                    borderColor: pressed ? "#60a5fa" : c.borderSubtle,
                    borderRadius: 16,
                    padding: 16,
                    opacity: pressed ? 0.9 : 1,
                  })}
                >
                  <ProgressRing
                    progress={goal.progress}
                    size={64}
                    strokeWidth={5.5}
                    color={color}
                    trackColor={c.bgHover}
                  />

                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
                      <Target size={14} color="#60a5fa" />
                      <T numberOfLines={1} style={{ fontSize: 13, fontWeight: "700", color: c.textPrimary, flex: 1 }}>
                        {goal.name}
                      </T>
                    </View>

                    <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8, marginTop: 4 }}>
                      <T numberOfLines={1} style={{ fontSize: 11, color: c.textMuted }}>
                        {goal.timeline === "weekly"
                          ? isRTL ? "هفتگی" : "Weekly"
                          : goal.timeline === "monthly"
                          ? isRTL ? "ماهانه" : "Monthly"
                          : goal.timeline === "six_months"
                          ? isRTL ? "شش‌ماهه" : "6 Months"
                          : isRTL ? "سالانه" : "Yearly"}
                      </T>
                      {goal.targetDate && (
                        <>
                          <T style={{ fontSize: 11, color: c.textMuted }}>•</T>
                          <T numberOfLines={1} style={{ fontSize: 10, color: c.textSubtle }}>
                            {goal.targetDate}
                          </T>
                        </>
                      )}
                    </View>

                    <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                      <T style={{ fontSize: 10, color: c.textSubtle }}>
                        {goal.progress}% {isRTL ? "تکمیل" : "done"}
                      </T>
                      <ArrowUpRight size={12} color={c.textSubtle} />
                    </View>
                  </View>
                </Pressable>
              );
            })}
        </View>
      </View>
    </View>
  );
};
