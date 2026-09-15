import React, { useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { Alert } from "react-native";
import Slider from "@react-native-community/slider";
import { Award, Plus, Star, Trash2 } from "lucide-react-native";
import { useAppStore } from "../../context/AppContext";
import { Skill, SkillType } from "../../types";
import { T, Input, Select, ModalShell, Btn } from "../ui/primitives";

export const SkillsView: React.FC = () => {
  const { skills, addSkill, updateSkill, deleteSkill, isRTL, t } = useAppStore();

  const [activeTab, setActiveTab] = useState<SkillType | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [name, setName] = useState("");
  const [type, setType] = useState<SkillType>("hard");
  const [level, setLevel] = useState<number>(3);
  const [status, setStatus] = useState<"learning" | "mastered">("learning");

  const filteredSkills = skills.filter((s) => {
    if (activeTab !== "all" && s.type !== activeTab) return false;
    return true;
  });

  const handleSave = () => {
    if (!name.trim()) return;

    addSkill({
      name: name.trim(),
      type,
      level,
      status,
    });

    setName("");
    setLevel(3);
    setStatus("learning");
    setIsModalOpen(false);
  };

  const confirmDelete = (skill: Skill) => {
    Alert.alert(t.common.delete, t.common.deleteConfirm, [
      { text: t.common.cancel, style: "cancel" },
      { text: t.common.delete, style: "destructive", onPress: () => deleteSkill(skill.id) },
    ]);
  };

  const tabs: { id: SkillType | "all"; label: string }[] = [
    { id: "all", label: t.views.skills.allSkills },
    { id: "hard", label: t.views.skills.hardSkills },
    { id: "soft", label: t.views.skills.softSkills },
  ];

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
      {/* Top Bar */}
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
                  {tab.label} {tab.id === "all" ? `(${skills.length})` : ""}
                </T>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <Btn
          title={t.views.skills.newSkill}
          onPress={() => setIsModalOpen(true)}
          icon={<Plus size={16} color="#ffffff" />}
        />
      </View>

      {/* Skills Grid */}
      <View className="gap-5">
        {filteredSkills.length === 0 ? (
          <T style={{ paddingVertical: 64, textAlign: "center", fontSize: 12, color: "#a3a3a3" }}>
            {t.views.skills.noSkillsFound}
          </T>
        ) : (
          filteredSkills.map((skill) => (
            <View key={skill.id} className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6">
              <View>
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <View
                    className="rounded-full border px-2.5 py-0.5"
                    style={
                      skill.type === "hard"
                        ? { backgroundColor: "rgba(99,102,241,0.1)", borderColor: "rgba(99,102,241,0.2)" }
                        : { backgroundColor: "rgba(168,85,247,0.1)", borderColor: "rgba(168,85,247,0.2)" }
                    }
                  >
                    <T
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: skill.type === "hard" ? "#818cf8" : "#c084fc",
                      }}
                    >
                      {skill.type === "hard" ? t.views.skills.hardSkills : t.views.skills.softSkills}
                    </T>
                  </View>

                  <Pressable onPress={() => confirmDelete(skill)} className="rounded-xl p-1.5">
                    <Trash2 size={14} color="#a3a3a3" />
                  </Pressable>
                </View>

                <T style={{ marginTop: 16, fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
                  {skill.name}
                </T>

                {/* Star rating for level */}
                <View style={{ marginTop: 12, flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Pressable
                      key={star}
                      onPress={() => updateSkill(skill.id, { level: star })}
                      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, padding: 2 })}
                    >
                      <Star
                        size={16}
                        color={star <= skill.level ? "#fbbf24" : "#404040"}
                        fill={star <= skill.level ? "#fbbf24" : "transparent"}
                      />
                    </Pressable>
                  ))}
                  <T style={{ marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0, fontSize: 12, color: "#a3a3a3" }}>
                    {skill.level} / 5
                  </T>
                </View>
              </View>

              {/* Status toggle */}
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
                <T style={{ fontSize: 12, color: "#a3a3a3" }}>{t.views.skills.statusLabel}</T>
                <Pressable
                  onPress={() =>
                    updateSkill(skill.id, {
                      status: skill.status === "learning" ? "mastered" : "learning",
                    })
                  }
                  style={({ pressed }) => ({
                    borderRadius: 999,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderWidth: 1,
                    backgroundColor:
                      skill.status === "mastered" ? "rgba(59,130,246,0.1)" : "#171717",
                    borderColor:
                      skill.status === "mastered" ? "rgba(59,130,246,0.2)" : "#262626",
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <T
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: skill.status === "mastered" ? "#60a5fa" : "#a3a3a3",
                    }}
                  >
                    {skill.status === "mastered" ? t.views.skills.mastered : t.views.skills.learning}
                  </T>
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
                <Award size={16} color="#60a5fa" />
                <T style={{ fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
                  {t.views.skills.createModalTitle}
                </T>
              </View>
              <Pressable onPress={() => setIsModalOpen(false)} className="rounded-xl p-1.5">
                <T style={{ fontSize: 16, color: "#a3a3a3" }}>✕</T>
              </Pressable>
            </View>

            <View style={{ marginTop: 16, gap: 16 }}>
              <View>
                <T style={labelStyle}>{t.views.skills.skillNameLabel}</T>
                <Input value={name} onChangeText={setName} style={inputStyle} />
              </View>

              <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
                <View style={{ flex: 1, minWidth: "45%" }}>
                  <T style={labelStyle}>{t.views.skills.skillTypeLabel}</T>
                  <Select
                    value={type}
                    options={[
                      { value: "hard" as SkillType, label: t.views.skills.hardSkills },
                      { value: "soft" as SkillType, label: t.views.skills.softSkills },
                    ]}
                    onChange={setType}
                  />
                </View>

                <View style={{ flex: 1, minWidth: "45%" }}>
                  <T style={labelStyle}>{t.views.skills.statusLabel}</T>
                  <Select
                    value={status}
                    options={[
                      { value: "learning" as const, label: t.views.skills.learning },
                      { value: "mastered" as const, label: t.views.skills.mastered },
                    ]}
                    onChange={setStatus}
                  />
                </View>
              </View>

              <View>
                <T style={labelStyle}>
                  {t.views.skills.levelLabel} ({level} / 5)
                </T>
                <Slider
                  minimumValue={1}
                  maximumValue={5}
                  step={1}
                  value={level}
                  onValueChange={setLevel}
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
