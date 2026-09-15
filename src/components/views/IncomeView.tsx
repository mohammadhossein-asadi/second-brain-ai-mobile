import React, { useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { Alert } from "react-native";
import { DollarSign, Plus, Trash2, TrendingUp, ArrowUpRight } from "lucide-react-native";import { useSecondBrain } from "../../context/SecondBrainContext";
import { IncomeStream, IncomeType } from "../../types";
import { IncomeSkeleton } from "./ViewSkeletons";
import { T, Input, Select, ModalShell, Btn } from "../ui/primitives";

export const IncomeView: React.FC = () => {
  const { incomeStreams, addIncomeStream, deleteIncomeStream, isDataLoading, isRTL, t } = useSecondBrain();

  const [activeTab, setActiveTab] = useState<IncomeType | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [source, setSource] = useState("");
  const [type, setType] = useState<IncomeType>("active");
  const [amount, setAmount] = useState<number>(15000000);
  const [currency, setCurrency] = useState(isRTL ? "تومان" : "USD");
  const [frequency, setFrequency] = useState<"monthly" | "one_time" | "project_based">("monthly");
  const [status, setStatus] = useState<"active" | "potential" | "paused">("active");

  const filteredStreams = incomeStreams.filter((s) => {
    if (activeTab !== "all" && s.type !== activeTab) return false;
    return true;
  });

  const totalMonthlyActive = incomeStreams
    .filter((s) => s.type === "active" && s.status === "active" && s.frequency === "monthly")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalMonthlyPassive = incomeStreams
    .filter((s) => s.type === "passive" && s.status === "active" && s.frequency === "monthly")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalMonthlyIncome = totalMonthlyActive + totalMonthlyPassive;

  const handleSave = () => {
    if (!source.trim()) return;

    addIncomeStream({
      source: source.trim(),
      type,
      amount: Number(amount),
      currency: currency || (isRTL ? t.views.income.currencyToman : "USD"),
      frequency,
      status,
    });

    setSource("");
    setAmount(15000000);
    setIsModalOpen(false);
  };

  const confirmDelete = (stream: IncomeStream) => {
    Alert.alert(t.common.delete, t.common.deleteConfirm, [
      { text: t.common.cancel, style: "cancel" },
      { text: t.common.delete, style: "destructive", onPress: () => deleteIncomeStream(stream.id) },
    ]);
  };

  const formatMoney = (val: number) => {
    const locale = isRTL ? "fa-IR" : "en-US";
    try {
      return new Intl.NumberFormat(locale).format(val);
    } catch {
      return String(val);
    }
  };

  const getFrequencyLabel = (freq: string) => {
    switch (freq) {
      case "monthly":
        return t.views.income.frequencyMonthly;
      case "one_time":
        return t.views.income.frequencyOneTime;
      case "project_based":
        return t.views.income.frequencyProject;
      default:
        return freq;
    }
  };

  const getStatusBadge = (st: string) => {
    const map: Record<string, { bg: string; border: string; color: string; label: string }> = {
      active: { bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)", color: "#60a5fa", label: t.views.income.statusActive },
      potential: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)", color: "#fbbf24", label: t.views.income.statusPotential },
    };
    const v = map[st] || { bg: "#171717", border: "#262626", color: "#a3a3a3", label: t.views.income.statusPaused };
    return (
      <View className="rounded-full border px-2.5 py-0.5" style={{ backgroundColor: v.bg, borderColor: v.border }}>
        <T style={{ fontSize: 12, fontWeight: "600", color: v.color }}>{v.label}</T>
      </View>
    );
  };

  const tabs: { id: IncomeType | "all"; label: string }[] = [
    { id: "all", label: t.views.income.allStreams },
    { id: "active", label: t.views.income.activeIncome },
    { id: "passive", label: t.views.income.passiveIncome },
  ];

  if (isDataLoading) {
    return <IncomeSkeleton />;
  }

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
    <View className="gap-6 pb-12">
      {/* 3 Overview Stat Cards */}
      <View style={{ gap: 16 }}>
        {/* Active */}
        <View className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5">
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between" }}>
            <T style={{ fontSize: 12, fontWeight: "600", color: "#a3a3a3" }}>
              {t.views.income.activeIncome}
            </T>
            <View className="h-8 w-8 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950">
              <ArrowUpRight size={16} color="#38bdf8" />
            </View>
          </View>
          <T style={{ marginTop: 12, fontSize: 22, fontWeight: "700", color: "#ffffff" }}>
            {formatMoney(totalMonthlyActive)}{" "}
            <T style={{ fontSize: 12, fontWeight: "400", color: "#a3a3a3" }}>
              {t.views.income.currencyToman}
            </T>
          </T>
          <T style={{ marginTop: 4, fontSize: 12, color: "#a3a3a3" }}>{t.views.income.activeRate}</T>
        </View>

        {/* Passive */}
        <View className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5">
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between" }}>
            <T style={{ fontSize: 12, fontWeight: "600", color: "#a3a3a3" }}>
              {t.views.income.passiveIncome}
            </T>
            <View className="h-8 w-8 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950">
              <TrendingUp size={16} color="#60a5fa" />
            </View>
          </View>
          <T style={{ marginTop: 12, fontSize: 22, fontWeight: "700", color: "#60a5fa" }}>
            {formatMoney(totalMonthlyPassive)}{" "}
            <T style={{ fontSize: 12, fontWeight: "400", color: "#a3a3a3" }}>
              {t.views.income.currencyToman}
            </T>
          </T>
          <T style={{ marginTop: 4, fontSize: 12, color: "#a3a3a3" }}>{t.views.income.passiveRate}</T>
        </View>

        {/* Total */}
        <View className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5">
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between" }}>
            <T style={{ fontSize: 12, fontWeight: "600", color: "#a3a3a3" }}>
              {t.views.income.totalMonthlyIncome}
            </T>
            <View className="h-8 w-8 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950">
              <DollarSign size={16} color="#fbbf24" />
            </View>
          </View>
          <T style={{ marginTop: 12, fontSize: 22, fontWeight: "700", color: "#fbbf24" }}>
            {formatMoney(totalMonthlyIncome)}{" "}
            <T style={{ fontSize: 12, fontWeight: "400", color: "#a3a3a3" }}>
              {t.views.income.currencyToman}
            </T>
          </T>
          <T style={{ marginTop: 4, fontSize: 12, color: "#a3a3a3" }}>{t.views.income.frequencyMonthly}</T>
        </View>
      </View>

      {/* Filter Tabs & Add Button */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 6 }}>
            {tabs.map((tab) => (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={({ pressed }) => ({
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 9,
                  minHeight: 40,
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: activeTab === tab.id ? "#404040" : "#262626",
                  backgroundColor: activeTab === tab.id ? "#262626" : "#171717",
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <T
                  style={{
                    fontSize: 12,
                    fontWeight: activeTab === tab.id ? "700" : "400",
                    color: activeTab === tab.id ? "#60a5fa" : "#a3a3a3",
                  }}
                >
                  {tab.label}
                </T>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <Btn
          title={t.views.income.newIncome}
          onPress={() => setIsModalOpen(true)}
          icon={<Plus size={16} color="#ffffff" />}
        />
      </View>

      {/* Streams Grid */}
      <View className="gap-5">
        {filteredStreams.length === 0 ? (
          <T style={{ paddingVertical: 64, textAlign: "center", fontSize: 12, color: "#a3a3a3" }}>
            {t.views.income.noStreamsFound}
          </T>
        ) : (
          filteredStreams.map((stream) => (
            <View key={stream.id} className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6">
              <View>
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <View
                    className="rounded-full border px-2.5 py-0.5"
                    style={
                      stream.type === "active"
                        ? { backgroundColor: "rgba(14,165,233,0.1)", borderColor: "rgba(14,165,233,0.2)" }
                        : { backgroundColor: "rgba(59,130,246,0.1)", borderColor: "rgba(59,130,246,0.2)" }
                    }
                  >
                    <T
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: stream.type === "active" ? "#38bdf8" : "#60a5fa",
                      }}
                    >
                      {stream.type === "active" ? t.views.income.activeIncome : t.views.income.passiveIncome}
                    </T>
                  </View>

                  <Pressable onPress={() => confirmDelete(stream)} className="rounded-xl p-1.5">
                    <Trash2 size={14} color="#a3a3a3" />
                  </Pressable>
                </View>

                <T style={{ marginTop: 16, fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
                  {stream.source || stream.name}
                </T>

                <T style={{ marginTop: 12, fontSize: 18, fontWeight: "700", color: "#60a5fa" }}>
                  {formatMoney(stream.amount)}{" "}
                  <T style={{ fontSize: 12, fontWeight: "400", color: "#a3a3a3" }}>{stream.currency}</T>
                </T>
              </View>

              {/* Status and Frequency */}
              <View
                style={{
                  marginTop: 24,
                  paddingTop: 16,
                  borderTopWidth: 1,
                  borderTopColor: "rgba(38,38,38,0.8)",
                  flexDirection: isRTL ? "row-reverse" : "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <T style={{ fontSize: 12, color: "#a3a3a3" }}>{getFrequencyLabel(stream.frequency)}</T>
                {getStatusBadge(stream.status)}
              </View>
            </View>
          ))
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
                <DollarSign size={16} color="#60a5fa" />
                <T style={{ fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
                  {t.views.income.createModalTitle}
                </T>
              </View>
              <Pressable onPress={() => setIsModalOpen(false)} className="rounded-xl p-1.5">
                <T style={{ fontSize: 16, color: "#a3a3a3" }}>✕</T>
              </Pressable>
            </View>

            <View style={{ marginTop: 16, gap: 16 }}>
              <View>
                <T style={labelStyle}>{t.views.income.sourceLabel}</T>
                <Input value={source} onChangeText={setSource} style={inputStyle} />
              </View>

              <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
                <View style={{ flex: 1, minWidth: "45%" }}>
                  <T style={labelStyle}>{t.common.category}</T>
                  <Select
                    value={type}
                    options={[
                      { value: "active" as IncomeType, label: t.views.income.activeIncome },
                      { value: "passive" as IncomeType, label: t.views.income.passiveIncome },
                    ]}
                    onChange={setType}
                  />
                </View>

                <View style={{ flex: 1, minWidth: "45%" }}>
                  <T style={labelStyle}>{t.views.income.amountLabel}</T>
                  <Input
                    value={String(amount)}
                    onChangeText={(v) => setAmount(Number(v) || 0)}
                    keyboardType="numeric"
                    style={inputStyle}
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
                <View style={{ flex: 1, minWidth: "45%" }}>
                  <T style={labelStyle}>{t.views.projects.timeline}</T>
                  <Select
                    value={frequency}
                    options={[
                      { value: "monthly" as const, label: t.views.income.frequencyMonthly },
                      { value: "one_time" as const, label: t.views.income.frequencyOneTime },
                      { value: "project_based" as const, label: t.views.income.frequencyProject },
                    ]}
                    onChange={setFrequency}
                  />
                </View>

                <View style={{ flex: 1, minWidth: "45%" }}>
                  <T style={labelStyle}>{t.common.status}</T>
                  <Select
                    value={status}
                    options={[
                      { value: "active" as const, label: t.views.income.statusActive },
                      { value: "potential" as const, label: t.views.income.statusPotential },
                      { value: "paused" as const, label: t.views.income.statusPaused },
                    ]}
                    onChange={setStatus}
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
