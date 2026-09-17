import React from "react";
import { View, Pressable } from "react-native";
import {
  CheckSquare,
  FolderKanban,
  CalendarCheck,
  TrendingUp,
  Sparkles,
  Check,
  Plus,
  Flame,
  FileText,
  ChevronLeft,
  ChevronRight,
  Activity,
  ArrowUpRight,
  Bot,
  RefreshCw,
} from "lucide-react-native";import { useSecondBrain } from "../../context/SecondBrainContext";
import { getTodayKey } from "../../data/initialData";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { DashboardCharts, MiniCognitiveLoadChart } from "./DashboardCharts";
import { ProgressRingsSection } from "./ProgressRingsSection";
import { DailyJournalTile } from "./DailyJournalTile";
import { CircularProgress } from "../ui/CircularProgress";
import { DailyAffirmation } from "../dashboard/DailyAffirmation";
import { DailyReview } from "../dashboard/DailyReview";
import { T } from "../ui/primitives";
import { useThemeColors } from "../../lib/theme";

export const DashboardView: React.FC = () => {
  const {
    tasks,
    projects,
    goals,
    habits,
    notes,
    suggestions,
    isDataLoading,
    refreshDashboardData,
    toggleTaskCompleted,
    toggleHabitToday,
    acceptSuggestion,
    dismissSuggestion,
    setActiveView,
    setIsQuickCaptureOpen,
    setIsAIAssistantOpen,
    setSelectedNoteId,
    isRTL,
    t,
  } = useSecondBrain();
  const c = useThemeColors();

  if (isDataLoading) {
    return <DashboardSkeleton />;
  }

  const todayKey = getTodayKey();
  const pendingTasks = tasks.filter((t) => !t.isCompleted);
  const completedTodayHabits = habits.filter((h) => Boolean(h.logs[todayKey])).length;
  const habitCompletionRate =
    habits.length > 0 ? Math.round((completedTodayHabits / habits.length) * 100) : 0;
  const activeProjects = projects.filter((p) => p.status === "in_progress");

  // Top main goal for the core objective block
  const primaryGoal = goals[0] || {
    name: t.views.dashboard.coreObjective,
    progress: 75,
    timeline: "yearly" as const,
    description: "",
  };

  const ArrowIcon = isRTL ? ChevronLeft : ChevronRight;

  const priorityBadge = (priority: string) => {
    const map: Record<string, { bg: string; border: string; color: string; label: string }> = {
      critical: { bg: "rgba(244,63,94,0.1)", border: "rgba(244,63,94,0.2)", color: "#fb7185", label: t.priorities.critical },
      high: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)", color: "#fbbf24", label: t.priorities.high },
      medium: { bg: "rgba(14,165,233,0.1)", border: "rgba(14,165,233,0.2)", color: "#38bdf8", label: t.priorities.medium },
    };
    const v = map[priority] || { bg: "#262626", border: "#404040", color: "#a3a3a3", label: t.priorities.low };
    return (
      <View
        className="rounded-full border px-2.5 py-0.5"
        style={{ backgroundColor: v.bg, borderColor: v.border }}
      >
        <T style={{ fontSize: 10, fontWeight: "600", color: v.color }}>{v.label}</T>
      </View>
    );
  };

  const Pill = ({ children, color }: { children: React.ReactNode; color?: string }) => (
    <View
      className="flex-row items-center rounded-full border px-3.5 py-1.5"
      style={{ backgroundColor: c.bgSurface, borderColor: c.borderColor, gap: 8 }}
    >
      {children}
      {color ? <T style={{ fontSize: 12, color }}>{children}</T> : null}
    </View>
  );

  return (
    <View className="gap-6 pb-12">
      {/* Header & High-level Status */}
      <View
        style={{
          gap: 16,
          paddingBottom: 20,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(38,38,38,0.8)",
        }}
      >
        <View style={{ gap: 4 }}>
          <T style={{ fontSize: 24, fontWeight: "700", color: c.textPrimary }}>
            {t.views.dashboard.title}
          </T>
          <T style={{ fontSize: 12, color: c.textMuted }}>{t.views.dashboard.subtitle}</T>
        </View>

        {/* Status Indicators & Actions */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          <View
            className="flex-row items-center rounded-full border px-3.5 py-1.5"
            style={{ backgroundColor: c.bgSurface, borderColor: c.borderColor, gap: 8 }}
          >
            <View style={{ height: 8, width: 8, borderRadius: 4, backgroundColor: "#3b82f6" }} />
            <T style={{ fontSize: 12, color: "#3b82f6" }}>{t.common.systemOnline}</T>
          </View>
          <View
            className="rounded-full border px-3.5 py-1.5"
            style={{ backgroundColor: c.bgSurface, borderColor: c.borderColor }}
          >
            <T style={{ fontSize: 12, color: c.textSecondary }}>
              {notes.length} {t.views.dashboard.knowledgeNodes}
            </T>
          </View>
          <View
            className="rounded-full border px-3.5 py-1.5"
            style={{ backgroundColor: c.bgSurface, borderColor: c.borderColor }}
          >
            <T style={{ fontSize: 12, color: c.textMuted }}>
              {pendingTasks.length} {t.views.dashboard.overdueTasks}
            </T>
          </View>

          <Pressable
            onPress={() => refreshDashboardData()}
            disabled={isDataLoading}
            style={({ pressed }) => ({
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              gap: 6,
              minHeight: 36,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: c.borderColor,
              backgroundColor: pressed ? c.bgHover : c.bgSurface,
              paddingHorizontal: 12,
              paddingVertical: 6,
            })}
          >
            <RefreshCw size={12} color="#3b82f6" />
            <T style={{ fontSize: 12, color: c.textSecondary }}>
              {t.views.dashboard.refreshData}
            </T>
          </Pressable>
        </View>
      </View>

      {/* Daily Review: Progress summary of habits and tasks completed today */}
      <DailyReview />

      {/* Bento Grid Layout (mobile: single column) */}
      <View className="gap-5">
        {/* Cell 1: Core Objective */}
        <View
          className="rounded-3xl border p-6"
          style={{ backgroundColor: c.cardSurface, borderColor: c.borderColor }}
        >
          <View>
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <T style={{ fontSize: 12, fontWeight: "700", color: c.textMuted, letterSpacing: 1 }}>
                {t.views.dashboard.coreObjective}
              </T>
              <View
                className="rounded-full border bg-blue-500/10 px-3 py-0.5"
                style={{ borderColor: "rgba(59,130,246,0.2)" }}
              >
                <T style={{ fontSize: 12, fontWeight: "600", color: "#3b82f6" }}>
                  {primaryGoal.progress}%
                </T>
              </View>
            </View>

            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
              <View style={{ flex: 1 }}>
                <T style={{ fontSize: 20, fontWeight: "700", color: c.textPrimary, lineHeight: 30 }}>
                  {primaryGoal.name}
                </T>

                <T style={{ marginTop: 12, fontSize: 13, color: c.textMuted, lineHeight: 21 }}>
                  {primaryGoal.description ||
                    (isRTL
                      ? `هماهنگی میان اهداف بلندمدت و وظایف روزانه. پایش مستمر ${projects.length} پروژه فعال با کمترین اصطکاک شناختی.`
                      : `Bridging high-level goals with daily actions. Coordinating ${projects.length} active projects.`)}
                </T>
              </View>

              <View style={{ marginTop: 4 }}>
                <CircularProgress progress={primaryGoal.progress} size={56} strokeWidth={4.5} strokeColor="#3b82f6">
                  <T style={{ fontSize: 12, fontWeight: "700", color: "#3b82f6" }}>
                    {primaryGoal.progress}%
                  </T>
                </CircularProgress>
              </View>
            </View>

            {/* Progress bar */}
            <View
              style={{
                marginTop: 20,
                height: 8,
                width: "100%",
                backgroundColor: c.bgHover,
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  backgroundColor: "#3b82f6",
                  borderRadius: 999,
                  width: `${primaryGoal.progress}%`,
                }}
              />
            </View>
          </View>

          <View
            style={{
              marginTop: 32,
              paddingTop: 20,
              borderTopWidth: 1,
              borderTopColor: "rgba(38,38,38,0.8)",
              flexDirection: isRTL ? "row-reverse" : "row",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 32 }}>
              <View>
                <T style={{ fontSize: 28, fontWeight: "700", color: "#3b82f6" }}>
                  {primaryGoal.progress}%
                </T>
                <T style={{ fontSize: 12, color: c.textMuted, marginTop: 4 }}>
                  {t.views.dashboard.goalProgress}
                </T>
              </View>

              <View>
                <T style={{ fontSize: 28, fontWeight: "700", color: c.textPrimary }}>
                  {completedTodayHabits}/{habits.length}
                </T>
                <T style={{ fontSize: 12, color: c.textMuted, marginTop: 4 }}>
                  {t.views.dashboard.habitsDoneToday}
                </T>
              </View>
            </View>

            <Pressable
              onPress={() => setActiveView("goals")}
              style={({ pressed }) => ({
                flexDirection: isRTL ? "row-reverse" : "row",
                alignItems: "center",
                gap: 6,
                borderRadius: 12,
                backgroundColor: pressed ? c.bgHover : c.bgElevated,
                borderWidth: 1,
                borderColor: c.borderColor,
                paddingHorizontal: 16,
                paddingVertical: 10,
              })}
            >
              <T style={{ fontSize: 12, fontWeight: "600", color: c.textPrimary }}>
                {t.views.dashboard.viewGoalsMap}
              </T>
              <ArrowIcon size={16} color={c.textSecondary} />
            </Pressable>
          </View>
        </View>

        {/* Cell 2: Habit Consistency */}
        <View
          className="rounded-3xl border p-5"
          style={{ backgroundColor: c.cardSurface, borderColor: c.borderColor }}
        >
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between" }}>
            <View
              className="h-10 w-10 items-center justify-center rounded-2xl border bg-amber-500/10"
              style={{ borderColor: "rgba(245,158,11,0.2)" }}
            >
              <Flame size={20} color="#fbbf24" />
            </View>
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
              <CircularProgress progress={habitCompletionRate} size={34} strokeWidth={3} strokeColor="#3b82f6">
                <T style={{ fontSize: 9, fontWeight: "700", color: "#3b82f6" }}>
                  {habitCompletionRate}%
                </T>
              </CircularProgress>
              <T style={{ fontSize: 12, fontWeight: "700", color: c.textMuted, letterSpacing: 1 }}>
                {t.views.dashboard.velocity}
              </T>
            </View>
          </View>

          <View style={{ marginTop: 16 }}>
            <T style={{ fontSize: 12, color: c.textMuted, marginBottom: 4 }}>
              {t.views.dashboard.longestStreak}
            </T>
            <T style={{ fontSize: 28, fontWeight: "700", color: c.textPrimary }}>
              {Math.max(...habits.map((h) => h.streak), 0)}{" "}
              <T style={{ fontSize: 14, fontWeight: "400", color: c.textMuted }}>
                {t.views.dashboard.days}
              </T>
            </T>
            <View style={{ marginTop: 8, flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
              <TrendingUp size={14} color="#3b82f6" />
              <T style={{ fontSize: 12, color: "#3b82f6" }}>{t.views.dashboard.streakPraise}</T>
            </View>
          </View>
        </View>

        {/* Cell 3: Weekly Cognitive Load */}
        <View
          className="rounded-3xl border p-5"
          style={{ backgroundColor: c.cardSurface, borderColor: c.borderColor }}
        >
          <View>
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <T style={{ fontSize: 12, fontWeight: "700", color: c.textMuted, letterSpacing: 1 }}>
                {t.views.dashboard.weeklyLoad}
              </T>
              <Activity size={16} color="#3b82f6" />
            </View>

            <MiniCognitiveLoadChart habits={habits} tasks={tasks} isRTL={isRTL} />
          </View>

          <View
            style={{
              marginTop: 8,
              flexDirection: isRTL ? "row-reverse" : "row",
              justifyContent: "space-between",
            }}
          >
            <T style={{ fontSize: 11, color: c.textMuted }}>{isRTL ? "ابتدای هفته" : "Start"}</T>
            <T style={{ fontSize: 11, fontWeight: "700", color: "#3b82f6" }}>
              {t.views.dashboard.todayHabits}
            </T>
          </View>
        </View>

        {/* Cell 4: Urgent Tasks Stream */}
        <View
          className="rounded-3xl border p-5"
          style={{ backgroundColor: c.cardSurface, borderColor: c.borderColor }}
        >
          <View>
            <View
              style={{
                flexDirection: isRTL ? "row-reverse" : "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                paddingBottom: 8,
                borderBottomWidth: 1,
                borderBottomColor: c.borderSubtle,
              }}
            >
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
                <CheckSquare size={16} color="#3b82f6" />
                <T style={{ fontSize: 12, fontWeight: "700", color: c.textSecondary, letterSpacing: 1 }}>
                  {t.views.dashboard.urgentTasks}
                </T>
              </View>

              <Pressable
                onPress={() => setActiveView("tasks")}
                style={({ pressed }) => ({
                  flexDirection: isRTL ? "row-reverse" : "row",
                  alignItems: "center",
                  gap: 4,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <T style={{ fontSize: 12, color: c.textMuted }}>
                  {t.views.dashboard.viewBoard} ({tasks.length})
                </T>
                <ArrowIcon size={14} color={c.textMuted} />
              </Pressable>
            </View>

            {/* Task list */}
            <View style={{ gap: 8 }}>
              {tasks.slice(0, 4).map((task) => (
                <View
                  key={task.id}
                  style={{
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(38,38,38,0.6)",
                    paddingBottom: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                    minHeight: 44,
                    borderRadius: 12,
                  }}
                >
                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12, flex: 1 }}>
                    <Pressable
                      onPress={() => toggleTaskCompleted(task.id)}
                      style={{
                        height: 20,
                        width: 20,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: task.isCompleted ? "#3b82f6" : "#404040",
                        backgroundColor: task.isCompleted ? "#3b82f6" : "transparent",
                      }}
                    >
                      {task.isCompleted ? <Check size={14} color="#ffffff" /> : null}
                    </Pressable>
                    <T
                      numberOfLines={1}
                      style={{
                        maxWidth: 200,
                        flex: 1,
                        fontSize: 13,
                        textDecorationLine: task.isCompleted ? "line-through" : "none",
                        color: task.isCompleted ? c.textSubtle : c.textSecondary,
                        fontWeight: task.isCompleted ? "400" : "500",
                      }}
                    >
                      {task.name}
                    </T>
                  </View>

                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
                    {priorityBadge(task.priority)}
                    <T style={{ fontSize: 11, color: c.textMuted }}>
                      {task.dueDate || t.common.today}
                    </T>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View
            style={{
              marginTop: 12,
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: "rgba(38,38,38,0.6)",
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <T style={{ fontSize: 12, color: c.textMuted }}>{t.views.projects.progressLabel}</T>
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
              <CircularProgress
                progress={Math.round(
                  (tasks.filter((t) => t.isCompleted).length / (tasks.length || 1)) * 100
                )}
                size={26}
                strokeWidth={2.5}
                strokeColor="#3b82f6"
              />
              <T style={{ fontSize: 13, fontWeight: "700", color: "#3b82f6" }}>
                {Math.round(
                  (tasks.filter((t) => t.isCompleted).length / (tasks.length || 1)) * 100
                )}
                %
              </T>
            </View>
          </View>
        </View>

        {/* Cell 5: Quick Capture Action Card */}
        <Pressable
          onPress={() => setIsQuickCaptureOpen(true)}
          style={({ pressed }) => ({
            backgroundColor: pressed ? "#6366f1" : "#4f46e5",
            borderRadius: 24,
            padding: 20,
            justifyContent: "space-between",
            minHeight: 150,
          })}
        >
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.1)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.2)",
              }}
            >
              <Plus size={20} color="#ffffff" />
            </View>
            <ArrowUpRight size={16} color="rgba(255,255,255,0.75)" />
          </View>

          <View style={{ marginTop: 16 }}>
            <T style={{ fontSize: 12, fontWeight: "600", color: "rgba(255,255,255,0.8)", marginBottom: 4, letterSpacing: 1 }}>
              {t.common.quickCapture}
            </T>
            <T style={{ fontSize: 17, fontWeight: "700", color: "#ffffff" }}>
              {t.modals.quickCapture.modalTitle}
            </T>
            <T numberOfLines={1} style={{ marginTop: 4, fontSize: 12, color: "rgba(255,255,255,0.85)" }}>
              {t.modals.quickCapture.contentPlaceholder}
            </T>
          </View>
        </Pressable>

        {/* Cell 6: AI Assistant Node */}
        <Pressable
          onPress={() => setIsAIAssistantOpen(true)}
          style={({ pressed }) => ({
            backgroundColor: c.cardSurface,
            borderWidth: 1,
            borderColor: pressed ? "rgba(59,130,246,0.5)" : c.borderColor,
            borderRadius: 24,
            padding: 20,
            alignItems: "center",
            justifyContent: "center",
            minHeight: 150,
          })}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#404040",
              backgroundColor: c.bgSubtle,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Bot size={24} color="#3b82f6" />
          </View>
          <T style={{ fontSize: 14, fontWeight: "700", color: c.textPrimary, marginBottom: 2 }}>
            {t.common.aiAssistant}
          </T>
          <T style={{ fontSize: 12, color: c.textMuted }}>{t.modals.aiAssistant.connectedState}</T>
        </Pressable>
      </View>

      {/* Daily Affirmation Bento Card */}
      <DailyAffirmation />

      {/* Proactive Intelligence Banner */}
      {suggestions.length > 0 && (
        <View
          className="rounded-3xl border p-4"
          style={{ backgroundColor: c.cardSurface, borderColor: c.borderColor }}
        >
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "flex-start", gap: 12, flex: 1, minWidth: 220 }}>
              <View
                style={{
                  height: 36,
                  width: 36,
                  borderRadius: 16,
                  backgroundColor: "rgba(59,130,246,0.1)",
                  borderWidth: 1,
                  borderColor: "rgba(59,130,246,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles size={16} color="#3b82f6" />
              </View>
              <View style={{ flex: 1 }}>
                <T style={{ fontSize: 14, fontWeight: "700", color: c.textPrimary }}>
                  {suggestions[0].title}
                </T>
                <T style={{ fontSize: 12, color: c.textSecondary, marginTop: 4, lineHeight: 19 }}>
                  {suggestions[0].description}
                </T>
              </View>
            </View>

            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
              <Pressable
                onPress={() => dismissSuggestion(suggestions[0].id)}
                style={({ pressed }) => ({
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: c.borderColor,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <T style={{ fontSize: 12, color: c.textMuted }}>{t.common.cancel}</T>
              </Pressable>
              <Pressable
                onPress={() => acceptSuggestion(suggestions[0].id)}
                style={({ pressed }) => ({
                  flexDirection: isRTL ? "row-reverse" : "row",
                  alignItems: "center",
                  gap: 6,
                  borderRadius: 12,
                  backgroundColor: "#2563eb",
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <Check size={14} color="#ffffff" />
                <T style={{ fontSize: 12, fontWeight: "600", color: "#ffffff" }}>
                  {suggestions[0].actionText || t.common.open}
                </T>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Visual Analytics & Trends */}
      <DashboardCharts tasks={tasks} projects={projects} habits={habits} isRTL={isRTL} />

      {/* Progress Rings */}
      <ProgressRingsSection
        projects={projects}
        goals={goals}
        tasks={tasks}
        isRTL={isRTL}
        onNavigateToProjects={() => setActiveView("projects")}
        onNavigateToGoals={() => setActiveView("goals")}
      />

      {/* Daily Journaling */}
      <DailyJournalTile isRTL={isRTL} />

      {/* Projects & Habits Matrix */}
      <View className="gap-5">
        {/* Projects Tile */}
        <View
          className="rounded-3xl border p-5"
          style={{ backgroundColor: c.cardSurface, borderColor: c.borderColor }}
        >
          <View
            style={{
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: c.borderSubtle,
              paddingBottom: 12,
            }}
          >
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
              <FolderKanban size={16} color="#818cf8" />
              <T style={{ fontSize: 12, fontWeight: "700", color: c.textSecondary, letterSpacing: 1 }}>
                {t.views.dashboard.activeProjects}
              </T>
            </View>
            <Pressable
              onPress={() => setActiveView("projects")}
              style={({ pressed }) => ({
                flexDirection: isRTL ? "row-reverse" : "row",
                alignItems: "center",
                gap: 4,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <T style={{ fontSize: 12, color: c.textMuted }}>{t.views.dashboard.viewProjects}</T>
              <ArrowIcon size={12} color={c.textMuted} />
            </Pressable>
          </View>

          <View style={{ gap: 12 }}>
            {projects.slice(0, 4).map((proj) => (
              <Pressable
                key={proj.id}
                onPress={() => setActiveView("projects")}
                style={({ pressed }) => ({
                  backgroundColor: c.bgSubtle,
                  borderWidth: 1,
                  borderColor: pressed ? c.borderHover : "rgba(38,38,38,0.8)",
                  padding: 16,
                  borderRadius: 16,
                })}
              >
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8, flex: 1 }}>
                    <T style={{ fontSize: 16 }}>{proj.icon || "📁"}</T>
                    <T numberOfLines={1} style={{ fontSize: 13, fontWeight: "700", color: c.textPrimary, flex: 1 }}>
                      {proj.name}
                    </T>
                  </View>
                  <T style={{ fontSize: 12, fontWeight: "700", color: "#3b82f6" }}>
                    {proj.progress}%
                  </T>
                </View>

                <View
                  style={{
                    marginTop: 12,
                    height: 6,
                    width: "100%",
                    backgroundColor: c.bgHover,
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      height: "100%",
                      backgroundColor: "#6366f1",
                      borderRadius: 999,
                      width: `${proj.progress}%`,
                    }}
                  />
                </View>

                <View
                  style={{
                    marginTop: 10,
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <T style={{ fontSize: 12, color: c.textMuted }}>{proj.category}</T>
                  {priorityBadge(proj.priority)}
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Daily Habits Tile */}
        <View
          className="rounded-3xl border p-5"
          style={{ backgroundColor: c.cardSurface, borderColor: c.borderColor }}
        >
          <View
            style={{
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: c.borderSubtle,
              paddingBottom: 12,
            }}
          >
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
              <CalendarCheck size={16} color="#3b82f6" />
              <T style={{ fontSize: 12, fontWeight: "700", color: c.textSecondary, letterSpacing: 1 }}>
                {t.nav.habits}
              </T>
            </View>
            <Pressable
              onPress={() => setActiveView("habits")}
              style={({ pressed }) => ({
                flexDirection: isRTL ? "row-reverse" : "row",
                alignItems: "center",
                gap: 4,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <T style={{ fontSize: 12, color: c.textMuted }}>{t.views.habits.last7Days}</T>
              <ArrowIcon size={12} color={c.textMuted} />
            </Pressable>
          </View>

          <View style={{ gap: 8 }}>
            {habits.map((habit) => {
              const isChecked = Boolean(habit.logs[todayKey]);
              const logValues = Object.values(habit.logs || {});
              const recentCount = logValues.slice(-7).filter(Boolean).length;
              const habitWeeklyProgress = Math.min(100, Math.round((recentCount / 7) * 100));

              return (
                <Pressable
                  key={habit.id}
                  onPress={() => toggleHabitToday(habit.id)}
                  style={({ pressed }) => ({
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: c.bgSubtle,
                    borderWidth: 1,
                    borderColor: pressed ? "rgba(59,130,246,0.4)" : "rgba(38,38,38,0.8)",
                    padding: 10,
                    borderRadius: 12,
                    minHeight: 44,
                  })}
                >
                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 10, flex: 1 }}>
                    <View pointerEvents="none">
                      <CircularProgress
                        progress={isChecked ? 100 : habitWeeklyProgress}
                        size={26}
                        strokeWidth={2.6}
                        strokeColor="#3b82f6"
                      >
                        {isChecked ? (
                          <Check size={12} color="#3b82f6" />
                        ) : (
                          <T style={{ fontSize: 8, color: c.textMuted }}>{habit.streak}</T>
                        )}
                      </CircularProgress>
                    </View>

                    <T style={{ fontSize: 16 }}>{habit.icon}</T>
                    <T
                      numberOfLines={1}
                      style={{
                        fontSize: 12,
                        flex: 1,
                        color: isChecked ? "#3b82f6" : c.textSecondary,
                        fontWeight: isChecked ? "700" : "400",
                      }}
                    >
                      {habit.name}
                    </T>
                  </View>

                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4 }}>
                    <Flame size={14} color="#fbbf24" />
                    <T style={{ fontSize: 12, color: "#fbbf24" }}>
                      {habit.streak}
                      {t.views.habits.days}
                    </T>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View
            style={{
              marginTop: 16,
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: c.borderSubtle,
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <T style={{ fontSize: 12, color: c.textMuted }}>{t.views.habits.todayCompletion}</T>
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
              <CircularProgress progress={habitCompletionRate} size={26} strokeWidth={2.6} strokeColor="#3b82f6" />
              <T style={{ fontSize: 13, fontWeight: "700", color: "#3b82f6" }}>{habitCompletionRate}%</T>
            </View>
          </View>
        </View>
      </View>

      {/* Recent Notes Section */}
      <View
        className="rounded-3xl border p-5"
        style={{ backgroundColor: c.cardSurface, borderColor: c.borderColor }}
      >
        <View
          style={{
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: c.borderSubtle,
            paddingBottom: 12,
          }}
        >
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
            <FileText size={16} color="#3b82f6" />
            <T style={{ fontSize: 12, fontWeight: "700", color: c.textSecondary, letterSpacing: 1 }}>
              {t.views.dashboard.recentNotes}
            </T>
          </View>
          <Pressable
            onPress={() => setActiveView("notes")}
            style={({ pressed }) => ({
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              gap: 4,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <T style={{ fontSize: 12, color: c.textMuted }}>{t.views.dashboard.allNotes}</T>
            <ArrowIcon size={12} color={c.textMuted} />
          </Pressable>
        </View>

        <View style={{ gap: 12 }}>
          {notes.slice(0, 3).map((note) => (
            <Pressable
              key={note.id}
              onPress={() => {
                setSelectedNoteId(note.id);
                setActiveView("notes");
              }}
              style={({ pressed }) => ({
                backgroundColor: c.bgSubtle,
                borderWidth: 1,
                borderColor: pressed ? c.borderHover : "rgba(38,38,38,0.8)",
                padding: 16,
                borderRadius: 16,
                minHeight: 100,
                justifyContent: "space-between",
              })}
            >
              <View>
                <T numberOfLines={1} style={{ fontSize: 13, fontWeight: "700", color: c.textPrimary }}>
                  {note.title || t.views.notes.untitledNote}
                </T>
                <T numberOfLines={2} style={{ fontSize: 12, color: c.textMuted, marginTop: 4, lineHeight: 18 }}>
                  {note.content.slice(0, 90)}...
                </T>
              </View>
              <View style={{ marginTop: 12, flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
                {note.tags.slice(0, 2).map((tag, idx) => (
                  <View
                    key={idx}
                    className="rounded-md border px-2 py-0.5"
                    style={{ backgroundColor: c.bgSurface, borderColor: c.borderColor }}
                  >
                    <T style={{ fontSize: 10, color: c.textMuted }}>#{tag}</T>
                  </View>
                ))}
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};
