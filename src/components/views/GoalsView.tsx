import React, { useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import Slider from "@react-native-community/slider";
import { Alert } from "react-native";
import { Target, Plus, Edit2, Trash2, Calendar, CheckCircle2 } from "lucide-react-native";
import { useSecondBrain } from "../../context/SecondBrainContext";
import { Goal, GoalTimeframe, Status } from "../../types";
import { GoalsSkeleton } from "./ViewSkeletons";
import { CircularProgress } from "../ui/CircularProgress";
import { T, Input, Select, ModalShell, Btn } from "../ui/primitives";

export const GoalsView: React.FC = () => {
  const {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    tasks,
    isDataLoading,
    isRTL,
    t,
  } = useSecondBrain();

  const [activeTimeframe, setActiveTimeframe] = useState<GoalTimeframe | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [timeframe, setTimeframe] = useState<GoalTimeframe>("yearly");
  const [progress, setProgress] = useState(35);
  const [status, setStatus] = useState<Status>("in_progress");
  const [targetDate, setTargetDate] = useState("2025-12-31");

  const filteredGoals = goals.filter((g) => {
    if (activeTimeframe !== "all" && g.timeframe !== activeTimeframe) return false;
    return true;
  });

  const handleOpenCreate = () => {
    setEditingGoal(null);
    setName("");
    setDescription("");
    setTimeframe("yearly");
    setProgress(0);
    setStatus("not_started");
    setTargetDate(isRTL ? "۱۴۰۴/۱۲/۲۹" : "2025-12-31");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (g: Goal) => {
    setEditingGoal(g);
    setName(g.name);
    setDescription(g.description || "");
    setTimeframe(g.timeframe || g.timeline || "yearly");
    setProgress(g.progress);
    setStatus(g.status);
    setTargetDate(g.targetDate || (isRTL ? "۱۴۰۴/۱۲/۲۹" : "2025-12-31"));
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    if (editingGoal) {
      updateGoal(editingGoal.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        timeframe,
        timeline: timeframe,
        progress: Number(progress),
        status,
        isCompleted: status === "completed",
        targetDate,
      });
    } else {
      addGoal({
        name: name.trim(),
        description: description.trim() || undefined,
        timeframe,
        timeline: timeframe,
        progress: Number(progress),
        status,
        isCompleted: status === "completed",
        targetDate,
      });
    }
    setIsModalOpen(false);
  };

  const confirmDelete = (goal: Goal) => {
    Alert.alert(t.common.delete, t.common.deleteConfirm, [
      { text: t.common.cancel, style: "cancel" },
      { text: t.common.delete, style: "destructive", onPress: () => deleteGoal(goal.id) },
    ]);
  };

  const getTimeframeLabel = (tf: GoalTimeframe) => {
    switch (tf) {
      case "yearly":
        return t.timelines.yearly;
      case "six_months":
        return t.timelines.six_months;
      case "monthly":
        return t.timelines.monthly;
      default:
        return t.timelines.weekly;
    }
  };

  const tabs: { id: GoalTimeframe | "all"; label: string }[] = [
    { id: "all", label: t.views.goals.allTimeframes },
    { id: "yearly", label: t.timelines.yearly },
    { id: "six_months", label: t.timelines.six_months },
    { id: "monthly", label: t.timelines.monthly },
  ];

  if (isDataLoading) {
    return <GoalsSkeleton />;
  }

  return (
    <View className="gap-6 pb-12">
      {/* Top bar */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 6 }}>
            {tabs.map((tab) => (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTimeframe(tab.id)}
                style={({ pressed }) => ({
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 9,
                  minHeight: 40,
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: activeTimeframe === tab.id ? "#404040" : "#262626",
                  backgroundColor: activeTimeframe === tab.id ? "#262626" : "#171717",
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <T
                  style={{
                    fontSize: 12,
                    fontWeight: activeTimeframe === tab.id ? "700" : "400",
                    color: activeTimeframe === tab.id ? "#60a5fa" : "#a3a3a3",
                  }}
                >
                  {tab.label}
                </T>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <Btn
          title={t.views.goals.newGoal}
          onPress={handleOpenCreate}
          icon={<Plus size={16} color="#ffffff" />}
        />
      </View>

      {/* Goals Cards */}
      <View className="gap-5">
        {filteredGoals.length === 0 ? (
          <T style={{ paddingVertical: 64, textAlign: "center", fontSize: 12, color: "#a3a3a3" }}>
            {t.views.goals.noGoalsFound}
          </T>
        ) : (
          filteredGoals.map((goal) => {
            const linkedTasks = tasks.filter((task) => task.goalId === goal.id);
            const completedTasks = linkedTasks.filter((task) => task.isCompleted).length;
            const calculatedPct = linkedTasks.length > 0
              ? Math.round((completedTasks / linkedTasks.length) * 100)
              : Math.min(100, Math.max(0, goal.progress ?? 0));

            const ringColor = calculatedPct === 100
              ? "#34d399"
              : calculatedPct >= 70
              ? "#60a5fa"
              : calculatedPct >= 35
              ? "#818cf8"
              : calculatedPct > 0
              ? "#fbbf24"
              : "#525252";

            return (
              <View
                key={goal.id}
                className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6"
                style={{ justifyContent: "space-between" }}
              >
                <View>
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <View className="rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1">
                      <T style={{ fontSize: 12, fontWeight: "700", color: "#60a5fa" }}>
                        {getTimeframeLabel(goal.timeframe || goal.timeline)}
                      </T>
                    </View>
                    {goal.isCompleted ? (
                      <View className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5">
                        <T style={{ fontSize: 10, fontWeight: "700", color: "#34d399" }}>
                          {isRTL ? "تکمیل‌شده" : "Completed"}
                        </T>
                      </View>
                    ) : null}
                  </View>

                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
                    {/* Visual Completion Progress Ring */}
                    <View pointerEvents="none">
                      <CircularProgress progress={calculatedPct} size={38} strokeWidth={3.5} strokeColor={ringColor} trackColor="#262626">
                        <T style={{ fontSize: 9, fontWeight: "700", color: "#ffffff" }}>
                          {calculatedPct}%
                        </T>
                      </CircularProgress>
                    </View>

                    <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4 }}>
                      <Pressable onPress={() => handleOpenEdit(goal)} className="rounded-xl p-1.5">
                        <Edit2 size={14} color="#a3a3a3" />
                      </Pressable>
                      <Pressable onPress={() => confirmDelete(goal)} className="rounded-xl p-1.5">
                        <Trash2 size={14} color="#a3a3a3" />
                      </Pressable>
                    </View>
                  </View>
                </View>

                  <T style={{ marginTop: 16, fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
                    {goal.name}
                  </T>
                  {goal.description ? (
                    <T style={{ marginTop: 8, fontSize: 12, color: "#d4d4d4", lineHeight: 19 }}>
                      {goal.description}
                    </T>
                  ) : null}

                  {goal.targetDate ? (
                    <View style={{ marginTop: 16, flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
                      <Calendar size={14} color="#737373" />
                      <T style={{ fontSize: 11, color: "#a3a3a3" }}>
                        {t.views.goals.targetDate}: {goal.targetDate}
                      </T>
                    </View>
                  ) : null}
                </View>

                {/* Progress Bar & Linked tasks */}
                <View style={{ marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: "rgba(38,38,38,0.8)", gap: 12 }}>
                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between" }}>
                    <T style={{ fontSize: 12, color: "#a3a3a3" }}>{t.common.progress}</T>
                    <T style={{ fontSize: 13, fontWeight: "700", color: "#60a5fa" }}>{calculatedPct}%</T>
                  </View>

                  <View
                    style={{
                      height: 6,
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
                        backgroundColor: "#60a5fa",
                        width: `${calculatedPct}%`,
                      }}
                    />
                  </View>

                  {linkedTasks.length > 0 ? (
                    <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between" }}>
                      <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
                        <CheckCircle2 size={14} color="#34d399" />
                        <T style={{ fontSize: 12, fontWeight: "500", color: "#34d399" }}>
                          {completedTasks} / {linkedTasks.length} {t.views.projects.tasksCount}
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
                          {Math.round((completedTasks / linkedTasks.length) * 100)}%
                        </T>
                      </View>
                    </View>
                  ) : null}
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* CREATE / EDIT MODAL */}
      <GoalModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingGoal={editingGoal}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        progress={progress}
        setProgress={setProgress}
        status={status}
        setStatus={setStatus}
        targetDate={targetDate}
        setTargetDate={setTargetDate}
        onSave={handleSave}
        isRTL={isRTL}
        t={t}
      />
    </View>
  );
};

interface GoalModalProps {
  visible: boolean;
  onClose: () => void;
  editingGoal: Goal | null;
  name: string;
  setName: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  timeframe: GoalTimeframe;
  setTimeframe: (tf: GoalTimeframe) => void;
  progress: number;
  setProgress: (v: number) => void;
  status: Status;
  setStatus: (s: Status) => void;
  targetDate: string;
  setTargetDate: (v: string) => void;
  onSave: () => void;
  isRTL: boolean;
  t: any;
}

const GoalModal: React.FC<GoalModalProps> = ({
  visible,
  onClose,
  editingGoal,
  name,
  setName,
  description,
  setDescription,
  timeframe,
  setTimeframe,
  progress,
  setProgress,
  targetDate,
  setTargetDate,
  onSave,
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
              <Target size={16} color="#60a5fa" />
              <T style={{ fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
                {editingGoal ? t.views.goals.editModalTitle : t.views.goals.createModalTitle}
              </T>
            </View>
            <Pressable onPress={onClose} className="rounded-xl p-1.5">
              <T style={{ fontSize: 16, color: "#a3a3a3" }}>✕</T>
            </Pressable>
          </View>

          <View style={{ marginTop: 16, gap: 16 }}>
            <View>
              <T style={labelStyle}>{t.views.goals.goalNameLabel}</T>
              <Input value={name} onChangeText={setName} style={inputStyle} />
            </View>

            <View>
              <T style={labelStyle}>{t.views.goals.goalDescLabel}</T>
              <Input
                multiline
                value={description}
                onChangeText={setDescription}
                style={[inputStyle, { minHeight: 60, textAlignVertical: "top" }]}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
              <View style={{ flex: 1, minWidth: "45%" }}>
                <T style={labelStyle}>{t.views.goals.timeframeLabel}</T>
                <Select
                  value={timeframe}
                  options={[
                    { value: "yearly" as GoalTimeframe, label: t.timelines.yearly },
                    { value: "six_months" as GoalTimeframe, label: t.timelines.six_months },
                    { value: "monthly" as GoalTimeframe, label: t.timelines.monthly },
                  ]}
                  onChange={setTimeframe}
                />
              </View>

              <View style={{ flex: 1, minWidth: "45%" }}>
                <T style={labelStyle}>{t.views.goals.targetDate}</T>
                <Input value={targetDate} onChangeText={setTargetDate} style={inputStyle} />
              </View>
            </View>

            <View>
              <T style={labelStyle}>
                {t.common.progress} ({progress}%)
              </T>
              <Slider
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={progress}
                onValueChange={setProgress}
                minimumTrackTintColor="#60a5fa"
                maximumTrackTintColor="#262626"
                thumbTintColor="#60a5fa"
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
              <Btn title={editingGoal ? t.common.save : t.common.add} onPress={onSave} />
            </View>
          </View>
        </View>
      </ScrollView>
    </ModalShell>
  );
};
