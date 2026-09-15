import React from "react";
import { View, Pressable } from "react-native";
import {
  Home,
  CheckSquare,
  FileText,
  FolderGit2,
  Target,
  Sparkles,
  Users,
  Award,
  BookOpen,
  DollarSign,
  Compass,
  Network,
  Cpu,
  Share2,
  Lock,
  WifiOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react-native";
import { useAppStore } from "../../context/AppContext";
import { ActiveView } from "../../types";
import { T } from "../ui/primitives";
import { useThemeColors } from "../../lib/theme";

export const Breadcrumbs: React.FC = () => {
  const {
    activeView,
    setActiveView,
    isRTL,
    t,
    tasks,
    notes,
    projects,
    goals,
    habits,
    contacts,
    isOffline,
    lastOfflineSyncTimestamp,
    lockVault,
  } = useAppStore();
  const c = useThemeColors();

  const getViewConfig = (
    view: ActiveView
  ): { label: string; icon: React.ReactNode; count?: number } => {
    switch (view) {
      case "dashboard":
        return { label: t.nav.dashboard, icon: <Home size={14} color="#a3a3a3" /> };
      case "tasks":
        return { label: t.nav.tasks, icon: <CheckSquare size={14} color="#a3a3a3" />, count: tasks.length };
      case "notes":
        return { label: t.nav.notes, icon: <FileText size={14} color="#a3a3a3" />, count: notes.length };
      case "projects":
        return { label: t.nav.projects, icon: <FolderGit2 size={14} color="#a3a3a3" />, count: projects.length };
      case "goals":
        return { label: t.nav.goals, icon: <Target size={14} color="#a3a3a3" />, count: goals.length };
      case "habits":
        return { label: t.nav.habits, icon: <Sparkles size={14} color="#a3a3a3" />, count: habits.length };
      case "contacts":
        return { label: t.nav.contacts, icon: <Users size={14} color="#a3a3a3" />, count: contacts.length };
      case "skills":
        return { label: t.nav.skills, icon: <Award size={14} color="#a3a3a3" /> };
      case "resources":
        return { label: t.nav.resources, icon: <BookOpen size={14} color="#a3a3a3" /> };
      case "income":
        return { label: t.nav.income, icon: <DollarSign size={14} color="#a3a3a3" /> };
      case "self-awareness":
        return { label: t.nav.selfAwareness, icon: <Compass size={14} color="#a3a3a3" /> };
      case "graph":
        return { label: t.nav.graph, icon: <Network size={14} color="#a3a3a3" /> };
      case "automation":
        return { label: t.nav.automation, icon: <Cpu size={14} color="#a3a3a3" /> };
      case "export":
        return { label: t.nav.export, icon: <Share2 size={14} color="#a3a3a3" /> };
      default:
        return { label: t.nav.dashboard, icon: <Home size={14} color="#a3a3a3" /> };
    }
  };

  const currentConfig = getViewConfig(activeView);
  const Chevron = isRTL ? ChevronLeft : ChevronRight;

  return (
    <View
      className="w-full border-b px-3"
      style={{
        height: 44,
        backgroundColor: isOffline ? "rgba(15,15,15,0.9)" : "rgba(10,10,10,0.55)",
        borderBottomColor: "rgba(38,38,38,0.8)",
        flexDirection: isRTL ? "row-reverse" : "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Hierarchy Path */}
      <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6, flexShrink: 1 }}>
        <Pressable
          onPress={() => setActiveView("dashboard")}
          style={({ pressed }) => ({
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            gap: 6,
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 4,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Home size={14} color={activeView === "dashboard" ? "#3b82f6" : "#a3a3a3"} />
          {activeView === "dashboard" && (
            <T style={{ fontSize: 12, fontWeight: "700", color: "#3b82f6" }}>
              {isRTL ? "پایگاه دانش" : "Knowledge Base"}
            </T>
          )}
        </Pressable>

        {activeView !== "dashboard" && (
          <>
            <Chevron size={14} color="#525252" />
            <View
              className="flex-row items-center rounded-lg border bg-blue-500/10 px-2.5 py-0.5"
              style={{ borderColor: "rgba(59,130,246,0.2)", flexDirection: isRTL ? "row-reverse" : "row", gap: 6 }}
            >
              {currentConfig.icon}
              <T numberOfLines={1} style={{ fontSize: 12, fontWeight: "700", color: "#3b82f6", maxWidth: 140 }}>
                {currentConfig.label}
              </T>
              {typeof currentConfig.count === "number" && (
                <View className="rounded-full bg-blue-500/20 px-1.5">
                  <T style={{ fontSize: 10, color: "#3b82f6" }}>{currentConfig.count}</T>
                </View>
              )}
            </View>
          </>
        )}
      </View>

      {/* Right Side Tools */}
      <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
        {isOffline ? (
          <View
            className="flex-row items-center rounded-full border bg-amber-500/15 px-2.5 py-0.5"
            style={{ borderColor: "rgba(245,158,11,0.3)", gap: 6, flexDirection: isRTL ? "row-reverse" : "row" }}
          >
            <WifiOff size={12} color="#fbbf24" />
            <T style={{ fontSize: 11, color: "#fbbf24" }}>
              {isRTL ? "آفلاین" : "Offline"}
            </T>
          </View>
        ) : (
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
            <View style={{ height: 6, width: 6, borderRadius: 3, backgroundColor: "#3b82f6" }} />
            <T style={{ fontSize: 11, color: "#737373" }}>
              {isRTL ? "آماده آفلاین" : "Offline Ready"}
            </T>
          </View>
        )}

        <Pressable
          onPress={lockVault}
          style={({ pressed }) => ({
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            gap: 6,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "rgba(38,38,38,0.9)",
            backgroundColor: "#171717",
            paddingHorizontal: 10,
            paddingVertical: 4,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Lock size={12} color="#3b82f6" />
          <T style={{ fontSize: 11, color: "#d4d4d4" }}>
            {isRTL ? "قفل" : "Lock"}
          </T>
        </Pressable>
      </View>
    </View>
  );
};
