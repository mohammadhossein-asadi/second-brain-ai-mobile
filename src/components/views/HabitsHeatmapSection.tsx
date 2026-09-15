import React, { useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import {
  Flame,
  Award,
  Zap,
  TrendingUp,
  Calendar,
  Info,
} from "lucide-react-native";
import { useSecondBrain } from "../../context/SecondBrainContext";
import { getTodayKey } from "../../data/initialData";
import { T } from "../ui/primitives";

export const HabitsHeatmapSection: React.FC = () => {
  const { habits, isRTL } = useSecondBrain();
  const [selectedDay, setSelectedDay] = useState<{
    dateKey: string;
    dayLabel: string;
    completed: number;
    total: number;
    percent: number;
    isToday?: boolean;
  } | null>(null);

  const todayKey = getTodayKey();

  // Generate past 7 weeks (49 days) of calendar matrix
  const totalDays = 49;
  const daysGrid = Array.from({ length: totalDays }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (totalDays - 1 - i));
    const dateKey = d.toISOString().split("T")[0];
    const locale = isRTL ? "fa-IR" : "en-US";
    let dayLabel = dateKey;
    try {
      dayLabel = new Intl.DateTimeFormat(locale, {
        weekday: "short",
        month: "numeric",
        day: "numeric",
      }).format(d);
    } catch {
      // Intl may be limited on Hermes — fall back to ISO date
    }

    const completed = habits.filter((h) => Boolean(h.logs[dateKey])).length;
    const total = habits.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      dateKey,
      dayLabel,
      completed,
      total,
      percent,
      isToday: dateKey === todayKey,
    };
  });

  // Color intensity mapping
  const getCellColors = (percent: number, completed: number) => {
    if (completed === 0 || percent === 0) {
      return { bg: "#111111", border: "#262626", text: "#525252" };
    }
    if (percent <= 25) {
      return { bg: "rgba(23,37,84,0.7)", border: "rgba(30,58,138,0.6)", text: "#93c5fd" };
    }
    if (percent <= 50) {
      return { bg: "rgba(30,64,175,0.8)", border: "rgba(37,99,235,0.6)", text: "#bfdbfe" };
    }
    if (percent <= 75) {
      return { bg: "#2563eb", border: "rgba(59,130,246,0.8)", text: "#ffffff" };
    }
    return { bg: "#60a5fa", border: "#93c5fd", text: "#0a0a0a" };
  };

  // Streaks comparison dataset for chart
  const streakData = habits.map((h) => {
    // Calculate simulated longest streak (at least current streak or higher)
    const longestStreak = Math.max(h.streak, Math.round(h.streak * 1.35) || 5);
    return {
      name: `${h.icon} ${h.name}`,
      currentStreak: h.streak,
      longestStreak,
      rate: Math.min(100, Math.round((h.streak / (longestStreak || 1)) * 100)),
    };
  });

  const bestStreakHabit = habits.reduce(
    (max, h) => (h.streak > max.streak ? h : max),
    habits[0] || { name: "ندارد", streak: 0, icon: "⚡" }
  );

  const averageStreak =
    habits.length > 0
      ? Math.round(habits.reduce((acc, h) => acc + h.streak, 0) / habits.length)
      : 0;

  const totalCompletionsLast7Days = habits.reduce((acc, h) => {
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = d.toISOString().split("T")[0];
      if (h.logs[k]) count++;
    }
    return acc + count;
  }, 0);

  const weeklyAdherence =
    habits.length > 0
      ? Math.min(100, Math.round((totalCompletionsLast7Days / (habits.length * 7)) * 100))
      : 0;

  return (
    <View className="gap-6">
      {/* 3 Metric Cards */}
      <View className="gap-4">
        {/* Top Habit Streak */}
        <View
          className="flex-row items-center justify-between rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5"
          style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
        >
          <View style={{ flex: 1 }}>
            <T style={{ fontSize: 12, color: "#a3a3a3" }}>
              {isRTL ? "برترین استمرار و زنجیره فعال" : "Top Habit Streak"}
            </T>
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8, marginTop: 6 }}>
              <T style={{ fontSize: 24, fontWeight: "700", color: "#fbbf24" }}>
                {bestStreakHabit.streak}
              </T>
              <T style={{ fontSize: 12, color: "#a3a3a3" }}>{isRTL ? "روز متوالی" : "days"}</T>
            </View>
            <T numberOfLines={1} style={{ fontSize: 12, color: "#d4d4d4", marginTop: 4, maxWidth: 180 }}>
              {bestStreakHabit.icon} {bestStreakHabit.name}
            </T>
          </View>
          <View className="h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
            <Flame size={24} color="#fbbf24" />
          </View>
        </View>

        {/* Weekly Adherence */}
        <View
          className="flex-row items-center justify-between rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5"
          style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
        >
          <View style={{ flex: 1 }}>
            <T style={{ fontSize: 12, color: "#a3a3a3" }}>
              {isRTL ? "پایبندی تجمعی هفتگی" : "Weekly Adherence"}
            </T>
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "baseline", gap: 8, marginTop: 6 }}>
              <T style={{ fontSize: 24, fontWeight: "700", color: "#60a5fa" }}>
                {weeklyAdherence}%
              </T>
              <T style={{ fontSize: 12, color: "#a3a3a3" }}>{isRTL ? "از کل عادات" : "of total"}</T>
            </View>
            <T style={{ fontSize: 12, color: "rgba(96,165,250,0.9)", marginTop: 4 }}>
              {totalCompletionsLast7Days} {isRTL ? "ثبت موفق در ۷ روز گذشته" : "successes in 7d"}
            </T>
          </View>
          <View className="h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
            <TrendingUp size={24} color="#60a5fa" />
          </View>
        </View>

        {/* Average Streak */}
        <View
          className="flex-row items-center justify-between rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5"
          style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
        >
          <View style={{ flex: 1 }}>
            <T style={{ fontSize: 12, color: "#a3a3a3" }}>
              {isRTL ? "میانگین زنجیره عادات" : "Average Streak"}
            </T>
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "baseline", gap: 8, marginTop: 6 }}>
              <T style={{ fontSize: 24, fontWeight: "700", color: "#38bdf8" }}>
                {averageStreak}
              </T>
              <T style={{ fontSize: 12, color: "#a3a3a3" }}>{isRTL ? "روز پایداری" : "days"}</T>
            </View>
            <T style={{ fontSize: 12, color: "#a3a3a3", marginTop: 4 }}>
              {habits.length} {isRTL ? "عادت فعال تحت پایش" : "active tracked habits"}
            </T>
          </View>
          <View className="h-12 w-12 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10">
            <Zap size={24} color="#38bdf8" />
          </View>
        </View>
      </View>

      {/* 7-Week Completion Heatmap */}
      <View className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5">
        <View style={{ marginBottom: 20, gap: 12 }}>
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12 }}>
            <View className="h-10 w-10 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-950">
              <Calendar size={20} color="#60a5fa" />
            </View>
            <View style={{ flex: 1 }}>
              <T style={{ fontSize: 14, fontWeight: "700", color: "#ffffff" }}>
                {isRTL ? "نقشه حرارتی استمرار عادات (۴۹ روز اخیر)" : "Habit Consistency Heatmap (Past 49 Days)"}
              </T>
              <T style={{ fontSize: 12, color: "#a3a3a3", marginTop: 2 }}>
                {isRTL
                  ? "چگالی انجام عادات در طول زمان؛ هر بلوک نشان‌دهنده درصد موفقیت روزانه است"
                  : "Daily habit completion intensity matrix over the past 7 calendar weeks"}
              </T>
            </View>
          </View>

          {/* Legend */}
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
            <T style={{ fontSize: 11, color: "#a3a3a3" }}>{isRTL ? "کمتر" : "Less"}</T>
            <View style={{ flexDirection: "row", gap: 4 }}>
              <View style={{ height: 12, width: 12, borderRadius: 6, backgroundColor: "#111111", borderWidth: 1, borderColor: "#262626" }} />
              <View style={{ height: 12, width: 12, borderRadius: 6, backgroundColor: "rgba(23,37,84,0.9)", borderWidth: 1, borderColor: "rgba(30,58,138,0.6)" }} />
              <View style={{ height: 12, width: 12, borderRadius: 6, backgroundColor: "rgba(30,64,175,0.9)", borderWidth: 1, borderColor: "rgba(37,99,235,0.6)" }} />
              <View style={{ height: 12, width: 12, borderRadius: 6, backgroundColor: "#2563eb", borderWidth: 1, borderColor: "rgba(59,130,246,0.8)" }} />
              <View style={{ height: 12, width: 12, borderRadius: 6, backgroundColor: "#60a5fa", borderWidth: 1, borderColor: "#93c5fd" }} />
            </View>
            <T style={{ fontSize: 11, color: "#a3a3a3" }}>{isRTL ? "بیشتر" : "More"}</T>
          </View>
        </View>

        {/* Heatmap Grid (7 cols per row) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", flexWrap: "wrap", gap: 8 }}>
            {daysGrid.map((day) => {
              const colors = getCellColors(day.percent, day.completed);
              const isSelected = selectedDay?.dateKey === day.dateKey;
              return (
                <Pressable
                  key={day.dateKey}
                  onPress={() => setSelectedDay(isSelected ? null : day)}
                  style={{
                    width: 88,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 10,
                    borderRadius: 16,
                    borderWidth: day.isToday || isSelected ? 2 : 1,
                    borderColor: day.isToday ? "#ffffff" : isSelected ? "#3b82f6" : colors.border,
                    backgroundColor: colors.bg,
                  }}
                >
                  <T style={{ fontSize: 10, color: colors.text, opacity: 0.8, marginBottom: 2 }}>
                    {day.dayLabel.split(" ")[0]}
                  </T>
                  <T style={{ fontSize: 12, fontWeight: "700", color: colors.text }}>
                    {day.completed}/{day.total}
                  </T>
                  <T style={{ fontSize: 9, color: colors.text, opacity: 0.7, marginTop: 2 }}>
                    {day.percent}%
                  </T>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* Selected day detail bar */}
        <View
          style={{
            marginTop: 12,
            minHeight: 28,
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 8,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: "rgba(38,38,38,0.6)",
          }}
        >
          {selectedDay ? (
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <T style={{ fontSize: 12, fontWeight: "700", color: "#ffffff" }}>{selectedDay.dayLabel}</T>
              <T style={{ fontSize: 12, fontWeight: "700", color: "#60a5fa" }}>
                {selectedDay.completed} {isRTL ? "از" : "of"} {selectedDay.total} {isRTL ? "عادت انجام شد" : "completed"} ({selectedDay.percent}%)
              </T>
              {selectedDay.isToday && (
                <View className="rounded-full bg-blue-500/20 px-2 py-0.5">
                  <T style={{ fontSize: 10, fontWeight: "700", color: "#60a5fa" }}>
                    {isRTL ? "امروز" : "Today"}
                  </T>
                </View>
              )}
            </View>
          ) : (
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
              <Info size={14} color="#737373" />
              <T style={{ fontSize: 11, color: "#737373" }}>
                {isRTL ? "برای مشاهده جزییات، روی بلوک‌های نقشه حرارتی ضربه بزنید" : "Tap any day tile to inspect exact completion details"}
              </T>
            </View>
          )}
        </View>
      </View>

      {/* Consistency Streaks Bar Chart */}
      <View className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5">
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <View className="h-10 w-10 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-950">
            <Award size={20} color="#fbbf24" />
          </View>
          <View style={{ flex: 1 }}>
            <T style={{ fontSize: 14, fontWeight: "700", color: "#ffffff" }}>
              {isRTL ? "مقایسه زنجیره پیوستگی عادات (Streaks)" : "Habit Streaks & Longest Records"}
            </T>
            <T style={{ fontSize: 12, color: "#a3a3a3", marginTop: 2 }}>
              {isRTL
                ? "بررسی تعداد روزهای متوالی انجام هر عادت در مقایسه با رکورد قبلی"
                : "Current continuous streak days vs personal best records"}
            </T>
          </View>
        </View>

        {streakData.length > 0 ? (
          <BarChart
            data={streakData.map((entry) => ({
              label: entry.name,
              value: entry.currentStreak,
              frontColor: entry.currentStreak >= 10 ? "#10b981" : "#f59e0b",
              spacing: 6,
              labelComponent: (props: any) => null,
            }))}
            barWidth={22}
            noOfSections={4}
            barBorderRadius={8}
            yAxisColor="#525252"
            xAxisColor="#525252"
            yAxisTextStyle={{ color: "#a3a3a3", fontSize: 10 }}
            xAxisLabelTextStyle={{ color: "#d4d4d4", fontSize: 9 }}
            height={220}
            isAnimated
          />
        ) : (
          <T style={{ fontSize: 12, color: "#737373" }}>
            {isRTL ? "عادتی ثبت نشده است" : "No habits tracked yet"}
          </T>
        )}
      </View>
    </View>
  );
};
