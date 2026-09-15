import React, { useState, useEffect } from "react";
import { View, Pressable, ScrollView, Alert } from "react-native";
import {
  Menu,
  Search,
  Plus,
  Bot,
  Bell,
  Sparkles,
  RotateCcw,
  Check,
  Globe,
  Sun,
  Moon,
  Keyboard,
  Settings,
} from "lucide-react-native";
import { useSecondBrain } from "../../context/SecondBrainContext";
import { ActiveView } from "../../types";
import { T } from "../ui/primitives";
import { useThemeColors } from "../../lib/theme";
import { ProviderSettingsModal } from "../modals/ProviderSettingsModal";

interface HeaderProps {
  setIsMobileOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ setIsMobileOpen }) => {
  const {
    activeView,
    language,
    toggleLanguage,
    theme,
    toggleTheme,
    isRTL,
    t,
    setIsCommandPaletteOpen,
    setIsQuickCaptureOpen,
    setIsAIAssistantOpen,
    setIsShortcutsModalOpen,
    setIsWebClipperOpen,
    suggestions,
    acceptSuggestion,
    dismissSuggestion,
    resetToDefaults,
  } = useSecondBrain();
  const c = useThemeColors();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProviderSettings, setShowProviderSettings] = useState(false);
  const [timeStr, setTimeStr] = useState("");

  React.useEffect(() => {
    const update = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      setTimeStr(`${hh}:${mm}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [language]);

  const viewMetaMap: Record<ActiveView, { title: string; subtitle: string }> = {
    dashboard: { title: t.views.dashboard.title, subtitle: t.views.dashboard.subtitle },
    notes: { title: t.views.notes.title, subtitle: t.views.notes.subtitle },
    tasks: { title: t.views.tasks.title, subtitle: t.views.tasks.subtitle },
    projects: { title: t.views.projects.title, subtitle: t.views.projects.subtitle },
    goals: { title: t.views.goals.title, subtitle: t.views.goals.subtitle },
    habits: { title: t.views.habits.title, subtitle: t.views.habits.subtitle },
    contacts: { title: t.views.contacts.title, subtitle: t.views.contacts.subtitle },
    skills: { title: t.views.skills.title, subtitle: t.views.skills.subtitle },
    resources: { title: t.views.resources.title, subtitle: t.views.resources.subtitle },
    income: { title: t.views.income.title, subtitle: t.views.income.subtitle },
    "self-awareness": { title: t.views.selfAwareness.title, subtitle: t.views.selfAwareness.subtitle },
    graph: { title: t.views.graph.title, subtitle: t.views.graph.subtitle },
    automation: { title: t.views.automation.title, subtitle: t.views.automation.subtitle },
    export: { title: t.views.export.title, subtitle: t.views.export.subtitle },
  };

  const currentViewMeta = viewMetaMap[activeView] || {
    title: t.common.appName,
    subtitle: t.common.appSubtitle,
  };

  const pendingSuggestions = suggestions.filter((s) => !s.resolved);

  const iconBtnStyle = {
    width: 44,
    height: 44,
    minHeight: 44,
    minWidth: 44,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: c.navbarBtnBorder,
    backgroundColor: c.navbarBtnBg,
  };

  return (
    <View
      className="w-full border-b px-3"
      style={{
        height: 64,
        backgroundColor: c.navbarBg,
        borderBottomColor: c.navbarBorder,
        flexDirection: isRTL ? "row-reverse" : "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* View Title & Mobile Menu Button */}
      <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 10, flex: 1 }}>
        <Pressable
          onPress={() => setIsMobileOpen(true)}
          style={[iconBtnStyle, { borderRadius: 12 }]}
        >
          <Menu size={20} color={c.navbarBtnText} />
        </Pressable>

        <View style={{ flexShrink: 1 }}>
          <T numberOfLines={1} style={{ fontSize: 15, fontWeight: "700", color: c.textPrimary }}>
            {currentViewMeta.title}
          </T>
          <T numberOfLines={1} style={{ fontSize: 11, color: c.textMuted }}>
            {currentViewMeta.subtitle}
          </T>
        </View>
      </View>

      {/* Right Controls */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center", gap: 8 }}
        style={{ flexGrow: 0 }}
      >
        {/* Keyboard Shortcuts Help Button */}
        <Pressable onPress={() => setIsShortcutsModalOpen(true)} style={iconBtnStyle}>
          <Keyboard size={16} color="#2563eb" />
        </Pressable>

        {/* AI Provider Settings Button */}
        <Pressable onPress={() => setShowProviderSettings(true)} style={iconBtnStyle}>
          <Settings size={16} color="#818cf8" />
        </Pressable>

        {/* Provider Settings Modal */}
        <ProviderSettingsModal
          visible={showProviderSettings}
          onClose={() => setShowProviderSettings(false)}
        />

        {/* Web Clipper Button */}
        <Pressable onPress={() => setIsWebClipperOpen(true)} style={iconBtnStyle}>
          <Globe size={16} color="#22d3ee" />
        </Pressable>

        {/* Theme Switcher Toggle */}
        <Pressable onPress={toggleTheme} style={iconBtnStyle}>
          {theme === "dark" ? (
            <Sun size={16} color="#fbbf24" />
          ) : (
            <Moon size={16} color="#0284c7" />
          )}
        </Pressable>

        {/* Language Switcher Toggle */}
        <Pressable
          onPress={toggleLanguage}
          style={[iconBtnStyle, { flexDirection: "row", gap: 6, borderRadius: 999, paddingHorizontal: 10, width: "auto", minWidth: 44 }]}
        >
          <Globe size={16} color="#2563eb" />
          <T style={{ fontSize: 11, fontWeight: "600", color: c.textPrimary }}>
            {language === "fa" ? "EN" : "فا"}
          </T>
        </Pressable>

        {/* Search icon trigger */}
        <Pressable onPress={() => setIsCommandPaletteOpen(true)} style={iconBtnStyle}>
          <Search size={16} color={c.navbarBtnText} />
        </Pressable>

        {/* Quick Add Pill */}
        <Pressable
          onPress={() => setIsQuickCaptureOpen(true)}
          style={({ pressed }) => ({
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            gap: 6,
            minHeight: 44,
            borderRadius: 999,
            backgroundColor: "#2563eb",
            paddingHorizontal: 14,
            paddingVertical: 8,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Plus size={16} color="#ffffff" />
          <T style={{ fontSize: 12, fontWeight: "600", color: "#ffffff" }}>
            {t.common.quickCapture}
          </T>
        </Pressable>

        {/* AI Assistant button */}
        <Pressable
          onPress={() => setIsAIAssistantOpen(true)}
          style={({ pressed }) => ({
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            gap: 6,
            minHeight: 44,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: c.navbarBtnBorder,
            backgroundColor: c.navbarBtnBg,
            paddingHorizontal: 12,
            paddingVertical: 8,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Bot size={16} color="#2563eb" />
          <T style={{ fontSize: 12, fontWeight: "600", color: "#2563eb" }}>AI</T>
        </Pressable>

        {/* Notification Suggestions Bell */}
        <View>
          <Pressable onPress={() => setShowNotifications(!showNotifications)} style={iconBtnStyle}>
            <Bell size={16} color={c.navbarBtnText} />
            {pendingSuggestions.length > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: 2,
                  left: 2,
                  height: 16,
                  width: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 999,
                  backgroundColor: "#3b82f6",
                }}
              >
                <T style={{ fontSize: 9, fontWeight: "700", color: "#ffffff" }}>
                  {pendingSuggestions.length}
                </T>
              </View>
            )}
          </Pressable>

          {/* Notifications dropdown */}
          {showNotifications && (
            <View
              style={{
                position: "absolute",
                top: 50,
                [isRTL ? "left" : "right"]: 0,
                width: 288,
                maxWidth: 320,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: c.borderColor,
                backgroundColor: c.bgSurface,
                padding: 16,
                zIndex: 100,
                elevation: 8,
              }}
            >
              <View
                style={{
                  flexDirection: isRTL ? "row-reverse" : "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottomWidth: 1,
                  borderBottomColor: c.borderColor,
                  paddingBottom: 10,
                }}
              >
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
                  <Sparkles size={14} color="#3b82f6" />
                  <T style={{ fontSize: 12, fontWeight: "700", color: c.textPrimary }}>
                    {t.common.notifications}
                  </T>
                </View>
                <View
                  className="rounded-full border px-2 py-0.5"
                  style={{ borderColor: c.borderColor, backgroundColor: c.bgElevated }}
                >
                  <T style={{ fontSize: 10, color: "#2563eb" }}>{pendingSuggestions.length}</T>
                </View>
              </View>

              <ScrollView style={{ maxHeight: 320, marginTop: 12 }} nestedScrollEnabled>
                {pendingSuggestions.length === 0 ? (
                  <T style={{ paddingVertical: 24, textAlign: "center", fontSize: 12, color: c.textMuted }}>
                    {t.common.noResults}
                  </T>
                ) : (
                  <View style={{ gap: 10 }}>
                    {pendingSuggestions.map((sug) => (
                      <View
                        key={sug.id}
                        className="rounded-xl border p-3"
                        style={{ borderColor: c.borderColor, backgroundColor: c.bgElevated }}
                      >
                        <T style={{ fontSize: 12, fontWeight: "700", color: c.textPrimary }}>
                          {sug.title}
                        </T>
                        <T style={{ marginTop: 4, fontSize: 11, color: c.textSecondary, lineHeight: 18 }}>
                          {sug.description}
                        </T>
                        <View
                          style={{
                            marginTop: 10,
                            flexDirection: isRTL ? "row-reverse" : "row",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: 8,
                          }}
                        >
                          <Pressable
                            onPress={() => dismissSuggestion(sug.id)}
                            style={({ pressed }) => ({
                              borderRadius: 8,
                              paddingHorizontal: 10,
                              paddingVertical: 4,
                              opacity: pressed ? 0.7 : 1,
                            })}
                          >
                            <T style={{ fontSize: 10, color: c.textMuted }}>{t.common.cancel}</T>
                          </Pressable>
                          <Pressable
                            onPress={() => {
                              acceptSuggestion(sug.id);
                              setShowNotifications(false);
                            }}
                            style={({ pressed }) => ({
                              flexDirection: isRTL ? "row-reverse" : "row",
                              alignItems: "center",
                              gap: 4,
                              borderRadius: 8,
                              backgroundColor: "#2563eb",
                              paddingHorizontal: 12,
                              paddingVertical: 4,
                              opacity: pressed ? 0.85 : 1,
                            })}
                          >
                            <Check size={12} color="#ffffff" />
                            <T style={{ fontSize: 10, fontWeight: "600", color: "#ffffff" }}>
                              {sug.actionText || t.common.open}
                            </T>
                          </Pressable>
                        </View>
                       </View>
                     ))}
                   </View>
                 )}
               </ScrollView>
            </View>
          )}
        </View>

        {/* Reset Database Button */}
        <Pressable
          onPress={() => {
            Alert.alert(t.common.resetDb, t.common.resetConfirm, [
              { text: t.common.cancel, style: "cancel" },
              {
                text: isRTL ? "بازنشانی" : "Reset",
                style: "destructive",
                onPress: resetToDefaults,
              },
            ]);
          }}
          style={iconBtnStyle}
        >
          <RotateCcw size={16} color={c.navbarBtnText} />
        </Pressable>
      </ScrollView>
    </View>
  );
};
