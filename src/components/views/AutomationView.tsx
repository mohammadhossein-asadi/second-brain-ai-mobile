import React, { useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { Alert } from "react-native";
import {
  Zap,
  Plus,
  Play,
  CheckCircle2,
  Trash2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react-native";
import { useAppStore } from "../../context/AppContext";
import { AutomationRule } from "../../types";
import { T, Input, Select, ModalShell, Btn } from "../ui/primitives";

export const AutomationView: React.FC = () => {
  const {
    automationRules,
    toggleAutomationRule,
    runAutomationRule,
    addAutomationRule,
    deleteAutomationRule,
    isRTL,
    t,
  } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"productivity" | "ai" | "organization" | "health">("productivity");
  const [triggerType, setTriggerType] = useState<"on_create" | "on_update" | "on_schedule">("on_create");
  const [lastExecutedMessage, setLastExecutedMessage] = useState<string | null>(null);

  const handleCreate = () => {
    if (!name.trim()) return;

    addAutomationRule({
      name: name.trim(),
      description: description.trim() || name.trim(),
      category,
      triggerType,
      isActive: true,
      lastRunAt: undefined,
    });

    setName("");
    setDescription("");
    setIsModalOpen(false);
  };

  const confirmDelete = (rule: AutomationRule) => {
    Alert.alert(t.common.delete, t.common.deleteConfirm, [
      { text: t.common.cancel, style: "cancel" },
      { text: t.common.delete, style: "destructive", onPress: () => deleteAutomationRule(rule.id) },
    ]);
  };

  const handleTestRun = (rule: AutomationRule) => {
    runAutomationRule(rule.id);
    setLastExecutedMessage(`${t.views.automation.testRunSuccess}: «${rule.name}»`);
    setTimeout(() => setLastExecutedMessage(null), 3500);
  };

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
      {/* Top Banner */}
      <View
        className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6"
        style={{ gap: 16 }}
      >
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12 }}>
          <View className="h-11 w-11 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-950">
            <Zap size={24} color="#fbbf24" />
          </View>
          <View style={{ flex: 1 }}>
            <T style={{ fontSize: 14, fontWeight: "700", color: "#ffffff" }}>{t.views.automation.title}</T>
            <T style={{ fontSize: 12, color: "#a3a3a3", marginTop: 2 }}>{t.views.automation.subtitle}</T>
          </View>
        </View>

        <Btn
          title={t.views.automation.newRule}
          onPress={() => setIsModalOpen(true)}
          icon={<Plus size={16} color="#ffffff" />}
        />
      </View>

      {/* Success banner if test run */}
      {lastExecutedMessage ? (
        <View
          className="flex-row items-center rounded-2xl border border-blue-800/80 bg-blue-950/60 p-4"
          style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 8 }}
        >
          <CheckCircle2 size={16} color="#60a5fa" />
          <T style={{ fontSize: 12, fontWeight: "600", color: "#60a5fa", flex: 1 }}>
            {lastExecutedMessage}
          </T>
        </View>
      ) : null}

      {/* Rules List */}
      <View className="gap-4">
        {automationRules.length === 0 ? (
          <View className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-12">
            <T style={{ textAlign: "center", fontSize: 12, color: "#a3a3a3" }}>
              {isRTL ? "هیچ قانون اتوماسیونی ثبت نشده است" : "No automation rules configured yet."}
            </T>
          </View>
        ) : (
          automationRules.map((rule) => (
            <View
              key={rule.id}
              className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6"
              style={{ gap: 20 }}
            >
              <View style={{ gap: 12 }}>
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: 5,
                      backgroundColor: rule.isActive ? "#60a5fa" : "#404040",
                    }}
                  />
                  <T numberOfLines={1} style={{ fontSize: 13, fontWeight: "700", color: "#ffffff", flex: 1 }}>
                    {rule.name}
                  </T>
                  <View className="rounded-full border border-neutral-800 bg-neutral-950 px-2 py-0.5">
                    <T style={{ fontSize: 11, color: "#a3a3a3" }}>{rule.category}</T>
                  </View>
                </View>

                <T style={{ fontSize: 12, color: "#d4d4d4", lineHeight: 19 }}>{rule.description}</T>

                {/* Trigger -> Action */}
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                  <View className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-1.5">
                    <T style={{ fontSize: 12 }}>
                      <T style={{ fontSize: 12, color: "#737373", fontWeight: "600" }}>
                        {t.views.automation.when}:{" "}
                      </T>
                      <T style={{ fontSize: 12, fontWeight: "600", color: "#fbbf24" }}>
                        {rule.triggerType}
                      </T>
                    </T>
                  </View>
                  {isRTL ? (
                    <ArrowLeft size={14} color="#525252" />
                  ) : (
                    <ArrowRight size={14} color="#525252" />
                  )}
                  <View className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-1.5">
                    <T style={{ fontSize: 12 }}>
                      <T style={{ fontSize: 12, color: "#737373", fontWeight: "600" }}>
                        {t.views.automation.then}:{" "}
                      </T>
                      <T style={{ fontSize: 12, fontWeight: "600", color: "#60a5fa" }}>
                        {rule.category} hook
                      </T>
                    </T>
                  </View>
                </View>

                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 16 }}>
                  <T style={{ fontSize: 11, color: "#737373" }}>
                    {t.views.automation.lastTrigger}: {rule.lastRunAt || t.views.automation.neverTriggered}
                  </T>
                  <T style={{ fontSize: 11, color: "#737373" }}>RUNS: {rule.runCount}</T>
                </View>
              </View>

              {/* Actions */}
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <Pressable
                  onPress={() => handleTestRun(rule)}
                  style={({ pressed }) => ({
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    gap: 6,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#262626",
                    backgroundColor: pressed ? "#262626" : "#0a0a0a",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    minHeight: 38,
                  })}
                >
                  <Play size={14} color="#60a5fa" />
                  <T style={{ fontSize: 12, fontWeight: "600", color: "#d4d4d4" }}>
                    {t.views.automation.testRunButton}
                  </T>
                </Pressable>

                <Pressable
                  onPress={() => toggleAutomationRule(rule.id)}
                  style={({ pressed }) => ({
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    minHeight: 38,
                    justifyContent: "center",
                    borderWidth: 1,
                    backgroundColor: rule.isActive ? "rgba(59,130,246,0.1)" : "#171717",
                    borderColor: rule.isActive ? "rgba(59,130,246,0.2)" : "#262626",
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <T
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: rule.isActive ? "#60a5fa" : "#737373",
                    }}
                  >
                    {rule.isActive ? t.common.active : t.common.disabled}
                  </T>
                </Pressable>

                <Pressable onPress={() => confirmDelete(rule)} className="rounded-xl p-2">
                  <Trash2 size={16} color="#a3a3a3" />
                </Pressable>
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
                <Zap size={16} color="#60a5fa" />
                <T style={{ fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
                  {t.views.automation.createModalTitle}
                </T>
              </View>
              <Pressable onPress={() => setIsModalOpen(false)} className="rounded-xl p-1.5">
                <T style={{ fontSize: 16, color: "#a3a3a3" }}>✕</T>
              </Pressable>
            </View>

            <View style={{ marginTop: 16, gap: 16 }}>
              <View>
                <T style={labelStyle}>{t.views.automation.ruleNameLabel}</T>
                <Input
                  value={name}
                  onChangeText={setName}
                  placeholder={isRTL ? "مثال: یادآوری بررسی هفتگی اهداف" : "e.g. Weekly Goal Review Reminder"}
                  style={inputStyle}
                />
              </View>

              <View>
                <T style={labelStyle}>{isRTL ? "توضیحات" : "Description"}</T>
                <Input
                  multiline
                  value={description}
                  onChangeText={setDescription}
                  style={[inputStyle, { minHeight: 60, textAlignVertical: "top" }]}
                />
              </View>

              <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
                <View style={{ flex: 1, minWidth: "45%" }}>
                  <T style={labelStyle}>{t.common.category}</T>
                  <Select
                    value={category}
                    options={[
                      { value: "productivity" as const, label: "Productivity" },
                      { value: "ai" as const, label: "AI Agent" },
                      { value: "organization" as const, label: "Organization" },
                      { value: "health" as const, label: "Health & Habits" },
                    ]}
                    onChange={setCategory}
                  />
                </View>

                <View style={{ flex: 1, minWidth: "45%" }}>
                  <T style={labelStyle}>{t.views.automation.triggerLabel}</T>
                  <Select
                    value={triggerType}
                    options={[
                      { value: "on_create" as const, label: "On Create" },
                      { value: "on_update" as const, label: "On Update" },
                      { value: "on_schedule" as const, label: "On Schedule" },
                    ]}
                    onChange={setTriggerType}
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
                <Btn title={t.common.add} onPress={handleCreate} />
              </View>
            </View>
          </View>
        </ScrollView>
      </ModalShell>
    </View>
  );
};
