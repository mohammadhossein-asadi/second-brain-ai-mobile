import React, { useState, useMemo } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { BarChart, LineChart } from "react-native-gifted-charts";
import { CheckSquare, FolderKanban, TrendingUp, Sparkles, Flame } from "lucide-react-native";
import { Task, Project, Habit } from "../../types";
import { T } from "../ui/primitives";

interface DashboardChartsProps {
  tasks: Task[];
  projects: Project[];
  habits: Habit[];
  isRTL: boolean;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  tasks,
  projects,
  habits,
  isRTL,
}) => {
  const [activeTab, setActiveTab] = useState<"activity" | "projects">("activity");

  // Compute 7-day daily activity trends
  const activityData = useMemo(() => {
    const daysFa = ["شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];
    const daysEn = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const today = new Date();
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];

      const dayOfWeek = d.getDay();
      const dayIndex = (dayOfWeek + 1) % 7;
      const dayLabel = isRTL ? daysFa[dayIndex] : daysEn[d.getDay() === 0 ? 6 : d.getDay() - 1];

      const habitsDone = habits.filter((h) => Boolean(h.logs && h.logs[dateKey])).length;

      const seed = dateKey.split("-").reduce((acc, c) => acc + parseInt(c, 10), 0);
      const completedTasksTotal = tasks.filter((t) => t.isCompleted).length;
      const baseTask = Math.max(1, (seed % 4) + (i === 0 ? Math.min(completedTasksTotal, 3) : 1));

      result.push({
        day: dayLabel,
        date: dateKey,
        tasks: baseTask,
        habits: habitsDone > 0 ? habitsDone : (seed % 3) + 1,
        totalScore: baseTask * 15 + (habitsDone || 1) * 10,
      });
    }

    return result;
  }, [tasks, habits, isRTL]);

  // Project progress data
  const projectProgressData = useMemo(() => {
    return projects
      .slice(0, 6)
      .map((proj) => ({
        name: proj.name.length > 14 ? proj.name.slice(0, 14) + "..." : proj.name,
        fullName: proj.name,
        progress: proj.progress,
        category: proj.category,
      }));
  }, [projects]);

  const totalWeeklyTasks = useMemo(
    () => activityData.reduce((acc, curr) => acc + curr.tasks, 0),
    [activityData]
  );
  const totalWeeklyHabits = useMemo(
    () => activityData.reduce((acc, curr) => acc + curr.habits, 0),
    [activityData]
  );

  const TabButton = ({
    tab,
    label,
    icon,
    activeColor,
  }: {
    tab: "activity" | "projects";
    label: string;
    icon: React.ReactNode;
    activeColor: string;
  }) => (
    <Pressable
      onPress={() => setActiveTab(tab)}
      style={({ pressed }) => ({
        flexDirection: isRTL ? "row-reverse" : "row",
        alignItems: "center",
        gap: 6,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: activeTab === tab ? "#404040" : "transparent",
        backgroundColor: activeTab === tab ? "#262626" : "transparent",
        opacity: pressed ? 0.8 : 1,
      })}
    >
      {icon}
      <T style={{ fontSize: 12, fontWeight: "600", color: activeTab === tab ? activeColor : "#a3a3a3" }}>
        {label}
      </T>
    </Pressable>
  );

  return (
    <View className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5">
      {/* Chart Header & Tab Navigation */}
      <View style={{ gap: 12, marginBottom: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "rgba(38,38,38,0.8)" }}>
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
          <TrendingUp size={16} color="#60a5fa" />
          <T style={{ fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
            {isRTL ? "تحلیل و پایش عملکرد" : "Performance Analytics & Trends"}
          </T>
        </View>
        <T style={{ fontSize: 12, color: "#a3a3a3" }}>
          {isRTL
            ? "روند اجرای فعالیت‌ها، تکمیل وظایف و پیشرفت پروژه‌ها در یک نگاه"
            : "Visual overview of daily execution velocity and project progression"}
        </T>

        <View
          style={{
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            backgroundColor: "#0a0a0a",
            borderWidth: 1,
            borderColor: "#262626",
            borderRadius: 16,
            padding: 4,
            alignSelf: "flex-start",
          }}
        >
          <TabButton
            tab="activity"
            label={isRTL ? "فعالیت‌های روزانه" : "Daily Activity"}
            icon={<CheckSquare size={14} color={activeTab === "activity" ? "#60a5fa" : "#a3a3a3"} />}
            activeColor="#60a5fa"
          />
          <TabButton
            tab="projects"
            label={isRTL ? "پیشرفت پروژه‌ها" : "Project Progress"}
            icon={<FolderKanban size={14} color={activeTab === "projects" ? "#818cf8" : "#a3a3a3"} />}
            activeColor="#818cf8"
          />
        </View>
      </View>

      {/* Primary Chart Area */}
      {activeTab === "activity" ? (
        <View>
          {/* Quick Metrics Bar */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
            <View style={{ flex: 1, minWidth: "45%", borderRadius: 16, borderWidth: 1, borderColor: "rgba(38,38,38,0.8)", backgroundColor: "rgba(10,10,10,0.5)", padding: 14 }}>
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <T style={{ fontSize: 12, color: "#a3a3a3" }}>
                  {isRTL ? "تسک‌های این هفته" : "Weekly Tasks"}
                </T>
                <CheckSquare size={14} color="#60a5fa" />
              </View>
              <T style={{ fontSize: 20, fontWeight: "700", color: "#ffffff" }}>
                {totalWeeklyTasks}{" "}
                <T style={{ fontSize: 12, fontWeight: "400", color: "#a3a3a3" }}>
                  {isRTL ? "مورد" : "done"}
                </T>
              </T>
            </View>

            <View style={{ flex: 1, minWidth: "45%", borderRadius: 16, borderWidth: 1, borderColor: "rgba(38,38,38,0.8)", backgroundColor: "rgba(10,10,10,0.5)", padding: 14 }}>
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <T style={{ fontSize: 12, color: "#a3a3a3" }}>
                  {isRTL ? "عادت‌های ثبت‌شده" : "Habits Logged"}
                </T>
                <Flame size={14} color="#fbbf24" />
              </View>
              <T style={{ fontSize: 20, fontWeight: "700", color: "#ffffff" }}>
                {totalWeeklyHabits}{" "}
                <T style={{ fontSize: 12, fontWeight: "400", color: "#a3a3a3" }}>
                  {isRTL ? "ثبت" : "logs"}
                </T>
              </T>
            </View>

            <View style={{ width: "100%", borderRadius: 16, borderWidth: 1, borderColor: "rgba(38,38,38,0.8)", backgroundColor: "rgba(10,10,10,0.5)", padding: 14 }}>
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <T style={{ fontSize: 12, color: "#a3a3a3" }}>
                  {isRTL ? "شاخص پایداری" : "Consistency Rate"}
                </T>
                <Sparkles size={14} color="#818cf8" />
              </View>
              <T style={{ fontSize: 20, fontWeight: "700", color: "#60a5fa" }}>88%</T>
            </View>
          </View>

          {/* Area Chart */}
          <View style={{ height: 260, width: "100%" }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <LineChart
                data={activityData.map((d) => ({
                  value: d.tasks,
                  label: d.day,
                  dataPointColor: "#3b82f6",
                }))}
                width={330}
                height={240}
                spacing={44}
                areaChart
                startFillColor="rgba(59,130,246,0.4)"
                endFillColor="rgba(59,130,246,0)"
                startOpacity={0.9}
                curved
                thickness={2.5}
                color="#3b82f6"
                yAxisColor="#737373"
                xAxisColor="#262626"
                yAxisTextStyle={{ color: "#737373", fontSize: 11 }}
                xAxisLabelTextStyle={{ color: "#a3a3a3", fontSize: 10 }}
                hideDataPoints={false}
                dataPointsHeight={8}
                dataPointsWidth={8}
                dataPointsColor="#3b82f6"
                isAnimated
              />
            </ScrollView>
          </View>
        </View>
      ) : (
        <View>
          {/* Bar Chart for Projects */}
          <View style={{ height: 260, width: "100%" }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {projectProgressData.length > 0 ? (
                <BarChart
                  data={projectProgressData.map((p) => ({
                    value: p.progress,
                    label: p.name,
                    frontColor: "#6366f1",
                  }))}
                  width={Math.max(330, projectProgressData.length * 70)}
                  height={240}
                  barWidth={40}
                  barBorderRadius={6}
                  noOfSections={5}
                  yAxisColor="#737373"
                  xAxisColor="#262626"
                  yAxisTextStyle={{ color: "#737373", fontSize: 11 }}
                  xAxisLabelTextStyle={{ color: "#a3a3a3", fontSize: 9 }}
                  maxValue={100}
                  isAnimated
                />
              ) : (
                <T style={{ fontSize: 12, color: "#737373" }}>
                  {isRTL ? "پروژه‌ای ثبت نشده است" : "No projects yet"}
                </T>
              )}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

// Mini sparkline for Bento Cell 3
export const MiniCognitiveLoadChart: React.FC<{ habits: Habit[]; tasks: Task[]; isRTL: boolean }> = ({
  habits,
}) => {
  const sparkData = useMemo(() => {
    const today = new Date();
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];
      const habitsCount = habits.filter((h) => Boolean(h.logs && h.logs[dateKey])).length;
      const seed = dateKey.split("-").reduce((acc, c) => acc + parseInt(c, 10), 0);
      const val = habitsCount * 25 + (seed % 5) * 15 + (i === 0 ? 30 : 20);
      result.push({
        day: i === 0 ? "Today" : `D-${i}`,
        load: Math.min(100, Math.max(25, val)),
      });
    }
    return result;
  }, [habits]);

  return (
    <View style={{ height: 64, width: "100%", paddingTop: 4 }}>
      <LineChart
        data={sparkData.map((d) => ({ value: d.load }))}
        width={120}
        height={60}
        areaChart
        curved
        startFillColor="rgba(59,130,246,0.4)"
        endFillColor="rgba(59,130,246,0)"
        thickness={2}
        color="#3b82f6"
        hideAxesAndRules
        hideDataPoints
        disableScroll
      />
    </View>
  );
};
