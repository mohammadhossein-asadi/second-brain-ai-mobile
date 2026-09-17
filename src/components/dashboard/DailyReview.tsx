import React, { useMemo } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import {
  CalendarCheck,
  CheckCircle2,
  Flame,
  CheckSquare,
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  FileText,
  TrendingUp,
  Activity,
} from "lucide-react-native";
import { useSecondBrain } from "../../context/SecondBrainContext";
import { getTodayKey, getDateOffsetKey } from "../../data/initialData";
import { CircularProgress } from "../ui/CircularProgress";
import { T } from "../ui/primitives";

export const DailyReview: React.FC = () => {
  const {
    habits,
    tasks,
    toggleHabitToday,
    toggleTaskCompleted,
    openOrCreateDailyNote,
    setActiveView,
    isRTL,
    language,
  } = useSecondBrain();

  const todayKey = getTodayKey();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // Calculate habits metrics
  const completedHabits = habits.filter((h) => Boolean(h.logs[todayKey]));
  const totalHabits = habits.length;
  const habitPct = totalHabits > 0 ? Math.round((completedHabits.length / totalHabits) * 100) : 0;

  // Calculate tasks metrics
  const completedTasks = tasks.filter((t) => t.isCompleted);
  const totalTasks = tasks.length;
  const taskPct = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Overall combined score for today's review
  const totalItems = totalHabits + totalTasks;
  const totalCompleted = completedHabits.length + completedTasks.length;
  const overallProgress = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;

  // Format today's date
  const now = new Date();
  let formattedDate = "";
  try {
    formattedDate = now.toLocaleDateString(language === "fa" ? "fa-IR" : "en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  } catch {
    formattedDate = now.toDateString();
  }

  // Dynamic status evaluation
  const getReviewStatus = () => {
    if (overallProgress === 100 && totalItems > 0) {
      return {
        label: isRTL ? "تکمیل ۱۰۰٪ — روز درخشان!" : "100% Complete — Outstanding!",
        color: "#34d399",
        barColor: "#10b981",
        quote: isRTL
          ? "تمام عادات و وظایف امروز با موفقیت تکمیل شدند. ثبات شما فوق‌العاده است!"
          : "All scheduled habits and tasks completed today. Exceptional consistency!",
      };
    }
    if (overallProgress >= 65) {
      return {
        label: isRTL ? "پیشرفت عالی — در مسیر هدف" : "Great Momentum — On Track",
        color: "#60a5fa",
        barColor: "#3b82f6",
        quote: isRTL
          ? "بیشتر برنامه‌های امروز محقق شده‌اند. با تکمیل چند مورد باقی‌مانده روز را بی‌نقص به پایان برسانید."
          : "Most daily goals accomplished. Complete the remaining items to wrap up strong.",
      };
    }
    if (overallProgress >= 30) {
      return {
        label: isRTL ? "در حال پیشرفت — نیازمند تمرکز" : "In Progress — Keep Focus",
        color: "#fbbf24",
        barColor: "#f59e0b",
        quote: isRTL
          ? "پیشرفت اولیه ثبت شده است. یک یا دو تسک کلیدی دیگر را تیک بزنید تا ریتم کار حفظ شود."
          : "Initial progress made. Check off a high-priority task or habit to maintain momentum.",
      };
    }
    return {
      label: isRTL ? "آغاز مرور روزانه" : "Daily Review Started",
      color: "#a3a3a3",
      barColor: "#3b82f6",
      quote: isRTL
        ? "روز کاری پیش روی شماست. اولین عادت یا وظیفه امروز را تیک بزنید تا روز پرباری بسازید."
        : "The day is in your hands. Check off your first habit or task to build positive inertia.",
    };
  };

  const status = getReviewStatus();

  // 7-Day Habit Consistency Trend calculation
  const habitTrendData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const offset = -i;
      const dateKey = getDateOffsetKey(offset);
      const d = new Date();
      d.setDate(d.getDate() + offset);

      let dayName = dateKey;
      let dayShort = dateKey;
      try {
        dayName = d.toLocaleDateString(language === "fa" ? "fa-IR" : "en-US", {
          weekday: "short",
        });
        dayShort = d.toLocaleDateString(language === "fa" ? "fa-IR" : "en-US", {
          month: "numeric",
          day: "numeric",
        });
      } catch {
        // Intl fallback
      }

      const completed = habits.filter(
        (h) => Boolean(h.logs[dateKey]) || Boolean(h.completedDates?.includes(dateKey))
      ).length;

      const rate = habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0;

      data.push({
        day: dayName,
        date: dayShort,
        dateKey,
        rate,
        completed,
        total: habits.length,
        isToday: i === 0,
      });
    }
    return data;
  }, [habits, language]);

  const avg7DayConsistency = useMemo(() => {
    if (habitTrendData.length === 0) return 0;
    const total = habitTrendData.reduce((acc, curr) => acc + curr.rate, 0);
    return Math.round(total / habitTrendData.length);
  }, [habitTrendData]);

  const HabitTaskRow = ({
    isDone,
    label,
    streakLabel,
    urgent,
    onToggle,
  }: {
    isDone: boolean;
    label: string;
    streakLabel?: string;
    urgent?: boolean;
    onToggle: () => void;
  }) => (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => ({
        flexDirection: isRTL ? "row-reverse" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: isDone ? "rgba(16,185,129,0.3)" : "rgba(38,38,38,0.8)",
        backgroundColor: isDone ? "rgba(16,185,129,0.05)" : "rgba(23,23,23,0.6)",
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8, flex: 1 }}>
        <View
          style={{
            height: 16,
            width: 16,
            borderRadius: 6,
            borderWidth: 1,
            alignItems: "center",
            justifyContent: "center",
            borderColor: isDone ? "#10b981" : "#404040",
            backgroundColor: isDone ? "#10b981" : "transparent",
          }}
        >
          {isDone ? <Check size={12} color="#ffffff" /> : null}
        </View>
        <T
          numberOfLines={1}
          style={{
            fontSize: 12,
            fontWeight: "500",
            flex: 1,
            textDecorationLine: isDone ? "line-through" : "none",
            color: isDone ? "#737373" : "#d4d4d4",
          }}
        >
          {label}
        </T>
      </View>

      {urgent ? (
        <View
          style={{
            borderRadius: 999,
            backgroundColor: "rgba(244,63,94,0.1)",
            borderWidth: 1,
            borderColor: "rgba(244,63,94,0.2)",
            paddingHorizontal: 6,
            paddingVertical: 1,
            marginLeft: 4,
          }}
        >
          <T style={{ fontSize: 9, fontWeight: "600", color: "#f43f5e" }}>
            {isRTL ? "فوری" : "Urgent"}
          </T>
        </View>
      ) : streakLabel ? (
        <T style={{ fontSize: 10, color: "rgba(245,158,11,0.9)" }}>{streakLabel}</T>
      ) : null}
    </Pressable>
  );

  return (
    <View
      className="rounded-3xl border p-5"
      style={{ backgroundColor: "#111827", borderColor: "#1f293d" }}
    >
      <View style={{ gap: 24 }}>
        {/* Top Header Bar */}
        <View
          style={{
            flexDirection: isRTL ? "row-reverse" : "row",
            justifyContent: "space-between",
            gap: 12,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(31,41,61,0.8)",
            flexWrap: "wrap",
          }}
        >
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12, flex: 1 }}>
            <View
              className="h-11 w-11 shrink-0 items-center justify-center rounded-2xl border bg-blue-500/10"
              style={{ borderColor: "rgba(59,130,246,0.2)" }}
            >
              <CalendarCheck size={20} color="#60a5fa" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <T style={{ fontSize: 16, fontWeight: "700", color: "#ffffff" }}>
                  {isRTL ? "مرور روزانه امروز" : "Daily Review"}
                </T>
                <View
                  className="flex-row items-center rounded-full border bg-blue-950/40 px-2.5 py-0.5"
                  style={{ borderColor: "rgba(59,130,246,0.2)", gap: 4, flexDirection: isRTL ? "row-reverse" : "row" }}
                >
                  <Sparkles size={12} color="#60a5fa" />
                  <T style={{ fontSize: 10, color: "#60a5fa" }}>{formattedDate}</T>
                </View>
              </View>
              <T style={{ fontSize: 12, color: "#a3a3a3", marginTop: 2 }}>
                {isRTL
                  ? "خلاصه و پایش هوشمند وضعیت عادات و وظایف ثبت‌شده برای امروز"
                  : "Progress summary of habits and tasks completed today"}
              </T>
            </View>
          </View>

          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
            <View
              className="flex-row items-center rounded-full border px-3 py-1"
              style={{
                borderColor: status.color + "40",
                backgroundColor: status.color + "1A",
                gap: 6,
                flexDirection: isRTL ? "row-reverse" : "row",
              }}
            >
              <View
                style={{
                  height: 8,
                  width: 8,
                  borderRadius: 4,
                  backgroundColor: overallProgress === 100 ? "#10b981" : overallProgress >= 50 ? "#3b82f6" : "#f59e0b",
                }}
              />
              <T style={{ fontSize: 12, fontWeight: "600", color: status.color }}>{status.label}</T>
            </View>
          </View>
        </View>

        {/* Main Content Layout */}
        <View style={{ gap: 20 }}>
          {/* Circular Progress & Overall Stat Tile */}
          <View
            className="rounded-2xl border p-5"
            style={{ backgroundColor: "rgba(10,10,10,0.4)", borderColor: "rgba(31,41,61,0.8)", alignItems: "center" }}
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
              <T style={{ fontSize: 11, fontWeight: "600", color: "#a3a3a3", letterSpacing: 1 }}>
                {isRTL ? "شاخص عملکرد امروز" : "Daily Completion"}
              </T>
              <T style={{ fontSize: 12, fontWeight: "700", color: "#d4d4d4" }}>
                {totalCompleted}/{totalItems} {isRTL ? "مورد" : "items"}
              </T>
            </View>

            <View style={{ marginVertical: 12, alignItems: "center" }}>
              <CircularProgress
                progress={overallProgress}
                size={110}
                strokeWidth={9}
                strokeColor={status.barColor}
                trackColor="#262626"
              >
                <View style={{ alignItems: "center" }}>
                  <T style={{ fontSize: 24, fontWeight: "900", color: "#ffffff" }}>{overallProgress}%</T>
                  <T style={{ fontSize: 10, fontWeight: "700", color: "#737373", letterSpacing: 1 }}>
                    {isRTL ? "پیشرفت" : "Progress"}
                  </T>
                </View>
              </CircularProgress>
            </View>

            {/* Reflection Note */}
            <T style={{ fontSize: 12, color: "#a3a3a3", lineHeight: 19, textAlign: "center", maxWidth: 280 }}>
              {status.quote}
            </T>

            {/* Daily Note CTA */}
            <View
              style={{
                width: "100%",
                marginTop: 16,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: "rgba(31,41,61,0.8)",
              }}
            >
              <Pressable
                onPress={openOrCreateDailyNote}
                style={({ pressed }) => ({
                  width: "100%",
                  flexDirection: isRTL ? "row-reverse" : "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  borderRadius: 12,
                  backgroundColor: pressed ? "rgba(30,58,138,0.5)" : "rgba(23,37,84,0.4)",
                  borderWidth: 1,
                  borderColor: "rgba(30,64,175,0.6)",
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                })}
              >
                <FileText size={14} color="#60a5fa" />
                <T style={{ fontSize: 12, fontWeight: "600", color: "#60a5fa" }}>
                  {isRTL ? "ثبت یادداشت روزانه امروز" : "Open Today's Daily Note"}
                </T>
              </Pressable>
            </View>
          </View>

          {/* Habits & Tasks Checklist Cards */}
          <View style={{ gap: 16 }}>
            {/* Habits Summary Tile */}
            <View
              className="rounded-2xl border p-4"
              style={{ backgroundColor: "rgba(10,10,10,0.4)", borderColor: "rgba(31,41,61,0.8)" }}
            >
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
                  <View
                    className="h-7 w-7 items-center justify-center rounded-lg border bg-amber-500/10"
                    style={{ borderColor: "rgba(245,158,11,0.2)" }}
                  >
                    <Flame size={16} color="#f59e0b" />
                  </View>
                  <View>
                    <T style={{ fontSize: 12, fontWeight: "700", color: "#ffffff" }}>
                      {isRTL ? "عادات امروز" : "Habits Today"}
                    </T>
                    <T style={{ fontSize: 10, color: "#a3a3a3" }}>
                      {completedHabits.length} {isRTL ? "از" : "of"} {totalHabits} {isRTL ? "تکمیل شده" : "completed"}
                    </T>
                  </View>
                </View>

                <T style={{ fontSize: 12, fontWeight: "700", color: "#fbbf24" }}>{habitPct}%</T>
              </View>

              {/* Habit Mini Progress Bar */}
              <View style={{ height: 6, width: "100%", backgroundColor: "#262626", borderRadius: 999, overflow: "hidden", marginBottom: 12 }}>
                <View style={{ backgroundColor: "#f59e0b", height: "100%", borderRadius: 999, width: `${habitPct}%` }} />
              </View>

              {/* Habits Interactive Quick List */}
              <View style={{ gap: 6, maxHeight: 192 }}>
                {habits.length === 0 ? (
                  <T style={{ fontSize: 12, color: "#737373", paddingVertical: 12, textAlign: "center" }}>
                    {isRTL ? "هنوز عادتی ثبت نشده است" : "No habits added yet"}
                  </T>
                ) : (
                  habits.slice(0, 4).map((habit) => {
                    const isDone = Boolean(habit.logs[todayKey]);
                    return (
                      <HabitTaskRow
                        key={habit.id}
                        isDone={isDone}
                        label={habit.name}
                        streakLabel={`🔥 ${habit.streak}`}
                        onToggle={() => toggleHabitToday(habit.id)}
                      />
                    );
                  })
                )}
              </View>

              <View
                style={{
                  marginTop: 12,
                  paddingTop: 10,
                  borderTopWidth: 1,
                  borderTopColor: "rgba(31,41,61,0.8)",
                  flexDirection: isRTL ? "row-reverse" : "row",
                }}
              >
                <Pressable onPress={() => setActiveView("habits")} style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4 }}>
                  <T style={{ fontSize: 11, fontWeight: "600", color: "#60a5fa" }}>
                    {isRTL ? "مدیریت تمام عادات" : "Manage all habits"}
                  </T>
                  <ArrowIcon size={12} color="#60a5fa" />
                </Pressable>
              </View>
            </View>

            {/* Tasks Summary Tile */}
            <View
              className="rounded-2xl border p-4"
              style={{ backgroundColor: "rgba(10,10,10,0.4)", borderColor: "rgba(31,41,61,0.8)" }}
            >
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
                  <View
                    className="h-7 w-7 items-center justify-center rounded-lg border bg-blue-500/10"
                    style={{ borderColor: "rgba(59,130,246,0.2)" }}
                  >
                    <CheckSquare size={16} color="#3b82f6" />
                  </View>
                  <View>
                    <T style={{ fontSize: 12, fontWeight: "700", color: "#ffffff" }}>
                      {isRTL ? "وظایف و تسک‌ها" : "Tasks Progress"}
                    </T>
                    <T style={{ fontSize: 10, color: "#a3a3a3" }}>
                      {completedTasks.length} {isRTL ? "از" : "of"} {totalTasks} {isRTL ? "انجام شده" : "done"}
                    </T>
                  </View>
                </View>

                <T style={{ fontSize: 12, fontWeight: "700", color: "#60a5fa" }}>{taskPct}%</T>
              </View>

              {/* Tasks Mini Progress Bar */}
              <View style={{ height: 6, width: "100%", backgroundColor: "#262626", borderRadius: 999, overflow: "hidden", marginBottom: 12 }}>
                <View style={{ backgroundColor: "#3b82f6", height: "100%", borderRadius: 999, width: `${taskPct}%` }} />
              </View>

              {/* Tasks Interactive Quick List */}
              <View style={{ gap: 6, maxHeight: 192 }}>
                {tasks.length === 0 ? (
                  <T style={{ fontSize: 12, color: "#737373", paddingVertical: 12, textAlign: "center" }}>
                    {isRTL ? "هیچ وظیفه‌ای ثبت نشده است" : "No tasks added yet"}
                  </T>
                ) : (
                  tasks.slice(0, 4).map((task) => (
                    <HabitTaskRow
                      key={task.id}
                      isDone={task.isCompleted}
                      label={task.name}
                      urgent={task.priority === "critical"}
                      onToggle={() => toggleTaskCompleted(task.id)}
                    />
                  ))
                )}
              </View>

              <View
                style={{
                  marginTop: 12,
                  paddingTop: 10,
                  borderTopWidth: 1,
                  borderTopColor: "rgba(31,41,61,0.8)",
                  flexDirection: isRTL ? "row-reverse" : "row",
                }}
              >
                <Pressable onPress={() => setActiveView("tasks")} style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4 }}>
                  <T style={{ fontSize: 11, fontWeight: "600", color: "#60a5fa" }}>
                    {isRTL ? "مشاهده فهرست کامل وظایف" : "View full task list"}
                  </T>
                  <ArrowIcon size={12} color="#60a5fa" />
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        {/* 7-Day Habit Consistency Trend Chart */}
        <View
          className="rounded-2xl border p-4"
          style={{ backgroundColor: "rgba(10,10,10,0.4)", borderColor: "rgba(31,41,61,0.8)" }}
        >
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
            <View
              className="h-8 w-8 items-center justify-center rounded-xl border bg-emerald-500/10"
              style={{ borderColor: "rgba(16,185,129,0.2)" }}
            >
              <Activity size={16} color="#10b981" />
            </View>
            <View style={{ flex: 1, minWidth: 180 }}>
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <T style={{ fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
                  {isRTL ? "روند ثبات عادات در ۷ روز گذشته" : "7-Day Habit Consistency Trend"}
                </T>
                <View
                  className="flex-row items-center rounded-full border bg-emerald-500/10 px-2 py-0.5"
                  style={{ borderColor: "rgba(16,185,129,0.2)", gap: 4, flexDirection: isRTL ? "row-reverse" : "row" }}
                >
                  <TrendingUp size={12} color="#10b981" />
                  <T style={{ fontSize: 10, fontWeight: "600", color: "#10b981" }}>
                    {isRTL ? `میانگین ثبات: ${avg7DayConsistency}٪` : `7-Day Avg: ${avg7DayConsistency}%`}
                  </T>
                </View>
              </View>
              <T style={{ fontSize: 11, color: "#a3a3a3", marginTop: 2 }}>
                {isRTL
                  ? "پایش پیوسته درصد تکمیل عادات روزانه جهت شناسایی نوسانات و حفظ ریتم عملکردی"
                  : "Visualizing daily habit completion rate over the past week"}
              </T>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={habitTrendData.map((d) => ({
                value: d.rate,
                label: d.day,
                dataPointColor: d.isToday ? "#10b981" : "#3b82f6",
              }))}
              width={330}
              height={180}
              spacing={44}
              areaChart
              curved
              startFillColor="rgba(59,130,246,0.28)"
              endFillColor="rgba(59,130,246,0)"
              startOpacity={0.9}
              thickness={2.5}
              color="#3b82f6"
              yAxisColor="#94a3b8"
              xAxisColor="rgba(148,163,184,0.2)"
              yAxisTextStyle={{ color: "#94a3b8", fontSize: 10 }}
              xAxisLabelTextStyle={{ color: "#94a3b8", fontSize: 10 }}
              maxValue={100}
              noOfSections={4}
              yAxisOffset={0}
              dataPointsHeight={8}
              dataPointsWidth={8}
              dataPointsRadius={4}
              hideRules
              isAnimated
            />
          </ScrollView>
        </View>
      </View>
    </View>
  );
};
