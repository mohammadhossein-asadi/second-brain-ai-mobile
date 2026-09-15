import React, { useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { Alert } from "react-native";
import { Users, Plus, Phone, Mail, Calendar, Trash2, Edit2 } from "lucide-react-native";
import { useAppStore } from "../../context/AppContext";
import { Contact, ContactLevel } from "../../types";
import { ContactsSkeleton } from "./ViewSkeletons";
import { T, Input, Select, ModalShell, Btn } from "../ui/primitives";

export const ContactsView: React.FC = () => {
  const {
    contacts,
    addContact,
    updateContact,
    deleteContact,
    isDataLoading,
    isRTL,
    t,
  } = useAppStore();

  const [selectedLevel, setSelectedLevel] = useState<ContactLevel | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Form
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [level, setLevel] = useState<ContactLevel>(1);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [lastContacted, setLastContacted] = useState("2025-04-10");
  const [nextFollowUp, setNextFollowUp] = useState("2025-05-01");
  const [notes, setNotes] = useState("");

  const filteredContacts = contacts.filter((c) => {
    if (selectedLevel !== "all" && c.level !== selectedLevel) return false;
    return true;
  });

  const handleOpenCreate = () => {
    setEditingContact(null);
    setName("");
    setRole("");
    setLevel(1);
    setPhone("");
    setEmail("");
    setTelegram("");
    setLinkedin("");
    setLastContacted(isRTL ? "۱۴۰۴/۰۱/۲۰" : "2025-04-10");
    setNextFollowUp(isRTL ? "۱۴۰۴/۰۲/۱۵" : "2025-05-01");
    setNotes("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Contact) => {
    setEditingContact(c);
    setName(c.name);
    setRole(c.role || "");
    setLevel(c.level);
    setPhone(c.phone || "");
    setEmail(c.email || "");
    setTelegram(c.telegram || "");
    setLinkedin(c.linkedin || "");
    setLastContacted(c.lastContacted || "");
    setNextFollowUp(c.nextFollowUp || "");
    setNotes(c.notes || "");
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    if (editingContact) {
      updateContact(editingContact.id, {
        name: name.trim(),
        role: role.trim() || undefined,
        level,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        telegram: telegram.trim() || undefined,
        linkedin: linkedin.trim() || undefined,
        lastContacted,
        nextFollowUp,
        notes: notes.trim() || undefined,
      });
    } else {
      addContact({
        name: name.trim(),
        role: role.trim() || undefined,
        level,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        telegram: telegram.trim() || undefined,
        linkedin: linkedin.trim() || undefined,
        lastContacted,
        nextFollowUp,
        notes: notes.trim() || undefined,
      });
    }
    setIsModalOpen(false);
  };

  const confirmDelete = (contact: Contact) => {
    Alert.alert(t.common.delete, t.common.deleteConfirm, [
      { text: t.common.cancel, style: "cancel" },
      { text: t.common.delete, style: "destructive", onPress: () => deleteContact(contact.id) },
    ]);
  };

  const levelBadge = (lvl: ContactLevel) => {
    const map: Record<number, { bg: string; border: string; color: string; label: string }> = {
      1: { bg: "rgba(244,63,94,0.1)", border: "rgba(244,63,94,0.2)", color: "#fb7185", label: t.views.contacts.level1 },
      2: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)", color: "#fbbf24", label: t.views.contacts.level2 },
    };
    const v = map[Number(lvl)] || { bg: "#171717", border: "#262626", color: "#a3a3a3", label: t.views.contacts.level3 };
    return (
      <View className="rounded-full border px-2.5 py-0.5" style={{ backgroundColor: v.bg, borderColor: v.border }}>
        <T style={{ fontSize: 12, fontWeight: "700", color: v.color }}>{v.label}</T>
      </View>
    );
  };

  const levelTabs: { id: ContactLevel | "all"; label: string }[] = [
    { id: "all", label: t.views.contacts.allLevels },
    { id: 1, label: t.views.contacts.level1 },
    { id: 2, label: t.views.contacts.level2 },
    { id: 3, label: t.views.contacts.level3 },
  ];

  if (isDataLoading) {
    return <ContactsSkeleton />;
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
      {/* Top Bar */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 6 }}>
            {levelTabs.map((tab) => (
              <Pressable
                key={String(tab.id)}
                onPress={() => setSelectedLevel(tab.id)}
                style={({ pressed }) => ({
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 9,
                  minHeight: 40,
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: selectedLevel === tab.id ? "#404040" : "#262626",
                  backgroundColor: selectedLevel === tab.id ? "#262626" : "#171717",
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <T
                  style={{
                    fontSize: 12,
                    fontWeight: selectedLevel === tab.id ? "700" : "400",
                    color: selectedLevel === tab.id ? "#60a5fa" : "#a3a3a3",
                  }}
                >
                  {tab.label}
                </T>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <Btn
          title={t.views.contacts.newContact}
          onPress={handleOpenCreate}
          icon={<Plus size={16} color="#ffffff" />}
        />
      </View>

      {/* Contacts Cards */}
      <View className="gap-5">
        {filteredContacts.length === 0 ? (
          <T style={{ paddingVertical: 64, textAlign: "center", fontSize: 12, color: "#a3a3a3" }}>
            {t.views.contacts.noContactsFound}
          </T>
        ) : (
          filteredContacts.map((contact) => (
            <View
              key={contact.id}
              className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6"
              style={{ justifyContent: "space-between" }}
            >
              <View>
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12, flex: 1 }}>
                    <View className="h-11 w-11 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-950">
                      <T style={{ fontSize: 16, fontWeight: "700", color: "#60a5fa" }}>
                        {contact.name.charAt(0)}
                      </T>
                    </View>
                    <View>
                      <T numberOfLines={1} style={{ fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
                        {contact.name}
                      </T>
                      <T style={{ fontSize: 12, color: "#a3a3a3" }}>{contact.role || "—"}</T>
                    </View>
                  </View>

                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4 }}>
                    <Pressable onPress={() => handleOpenEdit(contact)} className="rounded-xl p-1.5">
                      <Edit2 size={14} color="#a3a3a3" />
                    </Pressable>
                    <Pressable onPress={() => confirmDelete(contact)} className="rounded-xl p-1.5">
                      <Trash2 size={14} color="#a3a3a3" />
                    </Pressable>
                  </View>
                </View>

                <View style={{ marginTop: 16, flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                  {levelBadge(contact.level)}
                  {contact.phone ? (
                    <View
                      className="flex-row items-center rounded-full border border-neutral-800 bg-neutral-950 px-2.5 py-0.5"
                      style={{ gap: 4, flexDirection: isRTL ? "row-reverse" : "row" }}
                    >
                      <Phone size={12} color="#737373" />
                      <T style={{ fontSize: 11, color: "#a3a3a3" }}>{contact.phone}</T>
                    </View>
                  ) : null}
                  {contact.email ? (
                    <View
                      className="flex-row items-center rounded-full border border-neutral-800 bg-neutral-950 px-2.5 py-0.5"
                      style={{ gap: 4, flexDirection: isRTL ? "row-reverse" : "row" }}
                    >
                      <Mail size={12} color="#737373" />
                      <T style={{ fontSize: 11, color: "#a3a3a3" }}>{contact.email}</T>
                    </View>
                  ) : null}
                </View>

                {contact.notes ? (
                  <T numberOfLines={2} style={{ marginTop: 16, fontSize: 12, color: "#d4d4d4", lineHeight: 19 }}>
                    {contact.notes}
                  </T>
                ) : null}
              </View>

              {/* Follow-up info */}
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
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
                  <Calendar size={14} color="#737373" />
                  <T style={{ fontSize: 12, color: "#a3a3a3" }}>
                    {t.views.contacts.nextFollowUp}: {contact.nextFollowUp || "—"}
                  </T>
                </View>
                {contact.telegram ? (
                  <T style={{ fontSize: 11, color: "#38bdf8" }}>@{contact.telegram}</T>
                ) : null}
              </View>
            </View>
          ))
        )}
      </View>

      {/* CREATE / EDIT MODAL */}
      <ModalShell visible={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth={520}>
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
                <Users size={16} color="#60a5fa" />
                <T style={{ fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
                  {editingContact ? t.views.contacts.editModalTitle : t.views.contacts.createModalTitle}
                </T>
              </View>
              <Pressable onPress={() => setIsModalOpen(false)} className="rounded-xl p-1.5">
                <T style={{ fontSize: 16, color: "#a3a3a3" }}>✕</T>
              </Pressable>
            </View>

            <View style={{ marginTop: 16, gap: 16 }}>
              <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
                <View style={{ flex: 1, minWidth: "45%" }}>
                  <T style={labelStyle}>{t.views.contacts.contactNameLabel}</T>
                  <Input value={name} onChangeText={setName} style={inputStyle} />
                </View>

                <View style={{ flex: 1, minWidth: "45%" }}>
                  <T style={labelStyle}>{t.views.contacts.roleLabel}</T>
                  <Input value={role} onChangeText={setRole} style={inputStyle} />
                </View>
              </View>

              <View>
                <T style={labelStyle}>{t.views.contacts.level1}</T>
                <Select
                  value={level}
                  options={[
                    { value: 1 as ContactLevel, label: t.views.contacts.level1 },
                    { value: 2 as ContactLevel, label: t.views.contacts.level2 },
                    { value: 3 as ContactLevel, label: t.views.contacts.level3 },
                  ]}
                  onChange={setLevel}
                />
              </View>

              <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
                <View style={{ flex: 1, minWidth: "45%" }}>
                  <T style={labelStyle}>{t.views.contacts.phoneLabel}</T>
                  <Input value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={inputStyle} />
                </View>
                <View style={{ flex: 1, minWidth: "45%" }}>
                  <T style={labelStyle}>{t.views.contacts.emailLabel}</T>
                  <Input value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={inputStyle} />
                </View>
              </View>

              <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
                <View style={{ flex: 1, minWidth: "45%" }}>
                  <T style={labelStyle}>{t.views.contacts.telegramLabel}</T>
                  <Input value={telegram} onChangeText={setTelegram} autoCapitalize="none" style={inputStyle} />
                </View>
                <View style={{ flex: 1, minWidth: "45%" }}>
                  <T style={labelStyle}>{t.views.contacts.linkedinLabel}</T>
                  <Input value={linkedin} onChangeText={setLinkedin} autoCapitalize="none" style={inputStyle} />
                </View>
              </View>

              <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
                <View style={{ flex: 1, minWidth: "45%" }}>
                  <T style={labelStyle}>{t.views.contacts.lastContact}</T>
                  <Input value={lastContacted} onChangeText={setLastContacted} style={inputStyle} />
                </View>
                <View style={{ flex: 1, minWidth: "45%" }}>
                  <T style={labelStyle}>{t.views.contacts.nextFollowUp}</T>
                  <Input value={nextFollowUp} onChangeText={setNextFollowUp} style={inputStyle} />
                </View>
              </View>

              <View>
                <T style={labelStyle}>{t.views.contacts.notesLabel}</T>
                <Input
                  multiline
                  value={notes}
                  onChangeText={setNotes}
                  style={[inputStyle, { minHeight: 60, textAlignVertical: "top" }]}
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
                <Btn title={editingContact ? t.common.save : t.common.add} onPress={handleSave} />
              </View>
            </View>
          </View>
        </ScrollView>
      </ModalShell>
    </View>
  );
};
