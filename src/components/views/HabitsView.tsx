import React, { useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { Alert } from "react-native";
import { Flame, Plus, Check, Trash2 } from "lucide-react-native";
import { useAppStore } from "../../context/AppContext";
import { getTodayKey } from "../../data/initialData";
import { HabitsHeatmapSection } from "./HabitsHeatmapSection";
import { HabitsSkeleton } from "./ViewSkeletons";
import { T, Input, ModalShell, Btn } from "../ui/primitives";

export const HabitsView: React.FC = () => {
  const { habits, addHabit, toggleHabitToday, deleteHabit, isDataLoading, isRTL, t } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("⚡");

  const todayKey = getTodayKey();

  // Generate last 7 days keys
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split("T")[0];
    const locale = isRTL ? "fa-IR" : "en-US";
    let dayName = "";
    let dayNum = "";
    try {
      dayName = new Intl.DateTimeFormat(locale, { weekday: "short" }).format(d);
      dayNum = new Intl.DateTimeFormat(locale, { day: "numeric" }).format(d);
    } catch {
      dayName = key.slice(8);
      dayNum = key.slice(5, 7);
    }
    return { key, dayName, dayNum, isToday: key === todayKey };
  });

  const handleSave = () => {
    if (!name.trim()) return;

    addHabit(name.trim(), icon.trim() || "⚡");
    setName("");
    setIcon("⚡");
    setIsModalOpen(false);
  };

  const confirmDelete = (habitId: string) => {
    Alert.alert(t.common.delete, t.common.deleteConfirm, [
      { text: t.common.cancel, style: "cancel" },
      { text: t.common.delete, style: "destructive", onPress: () => deleteHabit(habitId) },
    ]);
  };

  const totalCompletionsToday = habits.filter((h) => h.logs[todayKey]).length;
  const completionPercentage = habits.length > 0 ? Math.round((totalCompletionsToday / habits.length) * 100) : 0;

  if (isDataLoading) {
    return <HabitsSkeleton />;
  }

  return (
    <View className="gap-6 pb-12">
      {/* Header Bento Card */}
      <View
        className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6"
        style={{ gap: 16 }}
      >
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12 }}>
          <View className="h-11 w-11 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-950">
            <Flame size={24} color="#fbbf24" />
          </View>
          <View style={{ flex: 1 }}>
            <T style={{ fontSize: 14, fontWeight: "700", color: "#ffffff" }}>{t.views.habits.title}</T>
            <T style={{ fontSize: 12, color: "#a3a3a3", marginTop: 2 }}>{t.views.habits.subtitle}</T>
          </View>
        </View>

        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <T style={{ fontSize: 12, color: "#a3a3a3" }}>
            {t.views.habits.todayCompletion}:{" "}
            <T style={{ fontSize: 12, fontWeight: "700", color: "#60a5fa" }}>
              {totalCompletionsToday}/{habits.length} ({completionPercentage}%)
            </T>
          </T>
          <Btn
            title={t.views.habits.newHabit}
            onPress={() => setIsModalOpen(true)}
            icon={<Plus size={16} color="#ffffff" />}
          />
        </View>
      </View>

      {/* Heatmap & Streak Consistency Section */}
      <HabitsHeatmapSection />

      {/* Habits 7-Day Tracker Card */}
      <View className="overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/60">
        {habits.length === 0 ? (
          <T style={{ paddingVertical: 56, textAlign: "center", fontSize: 12, color: "#a3a3a3" }}>
            {t.views.habits.noHabitsFound}
          </T>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {/* Header row */}
              <View
                style={{
                  flexDirection: isRTL ? "row-reverse" : "row",
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderBottomColor: "#262626",
                  backgroundColor: "rgba(23,23,23,0.9)",
                  paddingVertical: 14,
                }}
              >
                <T style={{ minWidth: 180, paddingHorizontal: 20, fontSize: 12, color: "#a3a3a3" }}>
                  {t.views.habits.habitNameLabel}
                </T>
                <T style={{ paddingHorizontal: 16, fontSize: 12, color: "#a3a3a3", textAlign: "center" }}>
                  {t.views.habits.currentStreak}
                </T>
                {last7Days.map((day) => (
                  <View
                    key={day.key}
                    style={{
                      width: 56,
                      alignItems: "center",
                      backgroundColor: day.isToday ? "rgba(38,38,38,0.8)" : "transparent",
                      paddingVertical: 4,
                      borderRadius: 8,
                    }}
                  >
                    <T style={{ fontSize: 11, color: day.isToday ? "#60a5fa" : "#737373" }}>{day.dayName}</T>
                    <T style={{ fontSize: 12, fontWeight: "700", color: day.isToday ? "#60a5fa" : "#d4d4d4", marginTop: 2 }}>
                      {day.dayNum}
                    </T>
                  </View>
                ))}
                <T style={{ width: 64, paddingHorizontal: 16, fontSize: 12, color: "#a3a3a3", textAlign: "center" }}>
                  {t.common.actions}
                </T>
              </View>

              {/* Habit rows */}
              {habits.map((habit) => (
                <View
                  key={habit.id}
                  style={{
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(38,38,38,0.6)",
                    paddingVertical: 14,
                  }}
                >
                  {/* Name */}
                  <View
                    style={{
                      minWidth: 180,
                      paddingHorizontal: 20,
                      flexDirection: isRTL ? "row-reverse" : "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <View className="h-8 w-8 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950">
                      <T style={{ fontSize: 18 }}>{habit.icon}</T>
                    </View>
                    <T numberOfLines={1} style={{ fontSize: 13, fontWeight: "600", color: "#ffffff", maxWidth: 120 }}>
                      {habit.name}
                    </T>
                  </View>

                  {/* Streak */}
                  <View style={{ paddingHorizontal: 16 }}>
                    <View
                      className="flex-row items-center rounded-full border bg-amber-500/10 px-2.5 py-0.5"
                      style={{ borderColor: "rgba(245,158,11,0.2)", gap: 4, flexDirection: isRTL ? "row-reverse" : "row" }}
                    >
                      <Flame size={14} color="#fbbf24" />
                      <T style={{ fontSize: 12, fontWeight: "700", color: "#fbbf24" }}>
                        {habit.streak} {t.views.habits.days}
                      </T>
                    </View>
                  </View>

                  {/* 7-day toggles */}
                  {last7Days.map((day) => {
                    const isChecked = Boolean(habit.logs[day.key]);
                    return (
                      <View
                        key={day.key}
                        style={{
                          width: 56,
                          alignItems: "center",
                          backgroundColor: day.isToday ? "rgba(38,38,38,0.2)" : "transparent",
                        }}
                      >
                        <Pressable
                          onPress={() => toggleHabitToday(habit.id, day.key)}
                          style={({ pressed }) => ({
                            height: 32,
                            width: 32,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 12,
                            backgroundColor: isChecked ? "#2563eb" : "#0a0a0a",
                            borderWidth: isChecked ? 0 : 1,
                            borderColor: pressed ? "#525252" : "#262626",
                            opacity: pressed ? 0.85 : 1,
                          })}
                        >
                          {isChecked ? <Check size={16} color="#ffffff" /> : null}
                        </Pressable>
                      </View>
                    );
                  })}

                  {/* Delete */}
                  <View style={{ width: 64, alignItems: "center" }}>
                    <Pressable onPress={() => confirmDelete(habit.id)} className="rounded-xl p-1.5">
                      <Trash2 size={14} color="#a3a3a3" />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      {/* CREATE MODAL */}
      <ModalShell visible={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth={440}>
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
                <Flame size={16} color="#fbbf24" />
                <T style={{ fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
                  {t.views.habits.createModalTitle}
                </T>
              </View>
              <Pressable onPress={() => setIsModalOpen(false)} className="rounded-xl p-1.5">
                <T style={{ fontSize: 16, color: "#a3a3a3" }}>✕</T>
              </Pressable>
            </View>

            <View style={{ marginTop: 16, gap: 16 }}>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <View style={{ flex: 3 }}>
                  <T style={{ fontSize: 12, fontWeight: "600", color: "#d4d4d4", marginBottom: 6 }}>
                    {t.views.habits.habitNameLabel}
                  </T>
                  <Input
                    value={name}
                    onChangeText={setName}
                    placeholder={t.views.habits.habitNamePlaceholder}
                    style={{
                      width: "100%",
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: "#262626",
                      backgroundColor: "rgba(23,23,23,0.8)",
                      padding: 10,
                      fontSize: 12,
                      color: "#ffffff",
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <T style={{ fontSize: 12, fontWeight: "600", color: "#d4d4d4", marginBottom: 6 }}>
                    {t.views.habits.iconLabel}
                  </T>
                  <Input
                    value={icon}
                    onChangeText={setIcon}
                    style={{
                      width: "100%",
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: "#262626",
                      backgroundColor: "rgba(23,23,23,0.8)",
                      padding: 10,
                      fontSize: 12,
                      color: "#ffffff",
                      textAlign: "center",
                    }}
                  />
                </View>
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
                <Btn title={t.common.cancel} variant="ghost" onPress={() => setIsModalOpen(false)} />
                <Btn title={t.common.add} onPress={handleSave} />
              </View>
            </View>
          </View>
        </ScrollView>
      </ModalShell>
    </View>
  );
};
