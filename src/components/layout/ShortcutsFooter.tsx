import React, { useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import {
  Keyboard,
  ChevronDown,
  ChevronUp,
  Search,
  Plus,
  Globe,
  Bot,
} from "lucide-react-native";
import { useSecondBrain } from "../../context/SecondBrainContext";
import { T } from "../ui/primitives";
import { useThemeColors } from "../../lib/theme";
import { storage } from "../../lib/storage";

export const ShortcutsFooter: React.FC = () => {
  const {
    isRTL,
    setIsShortcutsModalOpen,
    setIsCommandPaletteOpen,
    setIsQuickCaptureOpen,
    setIsWebClipperOpen,
    setIsAIAssistantOpen,
  } = useSecondBrain();
  const c = useThemeColors();

  const STORAGE_KEY = "second_brain_shortcuts_footer_collapsed";
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return storage.getItem(STORAGE_KEY) === "true";
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      storage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  if (isCollapsed) {
    return (
      <View
        style={{
          position: "absolute",
          bottom: 12,
          [isRTL ? "left" : "right"]: 16,
          zIndex: 30,
        }}
      >
        <Pressable
          onPress={toggleCollapse}
          style={({ pressed }) => ({
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            gap: 6,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: c.borderColor,
            backgroundColor: c.navbarBtnBg,
            paddingHorizontal: 12,
            paddingVertical: 6,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Keyboard size={14} color="#3b82f6" />
          <T style={{ fontSize: 11, color: c.textSecondary }}>
            {isRTL ? "کلیدهای میانبر" : "Shortcuts"}
          </T>
          <ChevronUp size={12} color={c.textMuted} />
        </Pressable>
      </View>
    );
  }

  const actions = [
    {
      label: isRTL ? "جستجو" : "Search",
      icon: <Search size={12} color={c.textPrimary} />,
      onPress: () => setIsCommandPaletteOpen(true),
    },
    {
      label: isRTL ? "ثبت سریع" : "Capture",
      icon: <Plus size={12} color={c.textPrimary} />,
      onPress: () => setIsQuickCaptureOpen(true),
    },
    {
      label: isRTL ? "کلیپر" : "Clipper",
      icon: <Globe size={12} color={c.textPrimary} />,
      onPress: () => setIsWebClipperOpen(true),
    },
    {
      label: isRTL ? "کوپایلوت" : "AI",
      icon: <Bot size={12} color={c.textPrimary} />,
      onPress: () => setIsAIAssistantOpen(true),
    },
    {
      label: isRTL ? "راهنما" : "Help",
      icon: <Keyboard size={12} color="#3b82f6" />,
      onPress: () => setIsShortcutsModalOpen(true),
    },
  ];

  return (
    <View
      style={{
        position: "absolute",
        bottom: 12,
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 30,
      }}
      pointerEvents="box-none"
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 999,
          borderWidth: 1,
          borderColor: c.borderColor,
          backgroundColor: c.navbarBg,
          paddingHorizontal: 12,
          paddingVertical: 6,
          gap: 4,
        }}
      >
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6, paddingHorizontal: 4 }}>
          <Keyboard size={14} color="#3b82f6" />
          <T style={{ fontSize: 11, color: c.textMuted }}>
            {isRTL ? "میانبرها:" : "Shortcuts:"}
          </T>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4 }}>
            {actions.map((a) => (
              <Pressable
                key={a.label}
                onPress={a.onPress}
                style={({ pressed }) => ({
                  flexDirection: isRTL ? "row-reverse" : "row",
                  alignItems: "center",
                  gap: 4,
                  borderRadius: 8,
                  backgroundColor: pressed ? c.bgElevated : "transparent",
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                {a.icon}
                <T style={{ fontSize: 11, color: c.textSecondary }}>{a.label}</T>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <Pressable onPress={toggleCollapse} style={{ padding: 4 }}>
          <ChevronDown size={12} color={c.textMuted} />
        </Pressable>
      </View>
    </View>
  );
};
