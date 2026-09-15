import React from "react";
import { View, Pressable, Modal, ScrollView, Animated } from "react-native";
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  FolderKanban,
  Target,
  CalendarCheck,
  Users,
  Award,
  BookOpen,
  DollarSign,
  Sparkles,
  Bot,
  Network,
  Zap,
  HardDriveDownload,
  Plus,
  Search,
  Brain,
  X,
} from "lucide-react-native";
import { useAppStore } from "../../context/AppContext";
import { ActiveView } from "../../types";
import { T } from "../ui/primitives";
import { useThemeColors } from "../../lib/theme";
import { PomodoroTimer } from "./PomodoroTimer";

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const {
    activeView,
    setActiveView,
    tasks,
    isRTL,
    t,
    setIsCommandPaletteOpen,
    setIsQuickCaptureOpen,
    setIsAIAssistantOpen,
  } = useAppStore();
  const c = useThemeColors();

  const pendingTasksCount = tasks.filter((t) => !t.isCompleted).length;

  const mainNavItems: { id: ActiveView; label: string; icon: any; badge?: number }[] = [
    { id: "dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
    { id: "notes", label: t.nav.notes, icon: FileText },
    { id: "tasks", label: t.nav.tasks, icon: CheckSquare, badge: pendingTasksCount },
    { id: "projects", label: t.nav.projects, icon: FolderKanban },
    { id: "goals", label: t.nav.goals, icon: Target },
    { id: "habits", label: t.nav.habits, icon: CalendarCheck },
  ];

  const databaseItems: { id: ActiveView; label: string; icon: any }[] = [
    { id: "contacts", label: t.nav.contacts, icon: Users },
    { id: "skills", label: t.nav.skills, icon: Award },
    { id: "resources", label: t.nav.resources, icon: BookOpen },
    { id: "income", label: t.nav.income, icon: DollarSign },
    { id: "self-awareness", label: t.nav.selfAwareness, icon: Sparkles },
  ];

  const aiToolsItems: { id: ActiveView | "ai_modal"; label: string; icon: any; isSpecial?: boolean }[] = [
    { id: "ai_modal", label: t.nav.aiAssistant, icon: Bot, isSpecial: true },
    { id: "graph", label: t.nav.graph, icon: Network },
    { id: "automation", label: t.nav.automation, icon: Zap },
    { id: "export", label: t.nav.export, icon: HardDriveDownload },
  ];

  const handleNavClick = (id: ActiveView | "ai_modal") => {
    if (id === "ai_modal") {
      setIsAIAssistantOpen(true);
      setIsMobileOpen(false);
    } else {
      setActiveView(id);
      setIsMobileOpen(false);
    }
  };

  return (
    <Modal
      visible={isMobileOpen}
      transparent
      animationType="none"
      onRequestClose={() => setIsMobileOpen(false)}
      statusBarTranslucent
    >
      <View style={{ flex: 1, flexDirection: isRTL ? "row-reverse" : "row" }}>
        {/* Drawer content */}
        <AnimatedSidebarBody
          onClose={() => setIsMobileOpen(false)}
          handleNavClick={handleNavClick}
          mainNavItems={mainNavItems}
          databaseItems={databaseItems}
          aiToolsItems={aiToolsItems}
          activeView={activeView}
          pendingTasksCount={pendingTasksCount}
        />
        {/* Backdrop */}
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.75)" }}
          onPress={() => setIsMobileOpen(false)}
        />
      </View>
    </Modal>
  );
};

interface SidebarBodyProps {
  onClose: () => void;
  handleNavClick: (id: ActiveView | "ai_modal") => void;
  mainNavItems: { id: ActiveView; label: string; icon: any; badge?: number }[];
  databaseItems: { id: ActiveView; label: string; icon: any }[];
  aiToolsItems: { id: ActiveView | "ai_modal"; label: string; icon: any; isSpecial?: boolean }[];
  activeView: ActiveView;
  pendingTasksCount: number;
}

function AnimatedSidebarBody(props: SidebarBodyProps) {
  const translateX = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    translateX.setValue(0);
  }, [translateX]);

  const {
    onClose,
    handleNavClick,
    mainNavItems,
    databaseItems,
    aiToolsItems,
    activeView,
  } = props;

  const { isRTL, t, setActiveView, setIsQuickCaptureOpen, setIsCommandPaletteOpen } =
    useAppStore();
  const c = useThemeColors();

  return (
    <Animated.View
      style={{
        width: "80%",
        maxWidth: 288,
        backgroundColor: c.sidebarBg,
        borderRightWidth: isRTL ? 0 : 1,
        borderLeftWidth: isRTL ? 1 : 0,
        borderColor: c.sidebarBorder,
        height: "100%",
      }}
    >
      {/* Brand Header */}
      <View
        style={{
          height: 64,
          flexDirection: isRTL ? "row-reverse" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: c.sidebarBorder,
          paddingHorizontal: 16,
        }}
      >
        <Pressable
          onPress={() => {
            setActiveView("dashboard");
            onClose();
          }}
          style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12 }}
        >
          <View
            className="h-10 w-10 shrink-0 items-center justify-center rounded-2xl border"
            style={{ backgroundColor: c.bgElevated, borderColor: c.sidebarBorder }}
          >
            <Brain size={20} color="#2563eb" />
          </View>
          <View>
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
              <T style={{ fontSize: 13, fontWeight: "700", color: c.textPrimary }}>
                {t.common.appName}
              </T>
              <View style={{ height: 6, width: 6, borderRadius: 3, backgroundColor: "#3b82f6" }} />
            </View>
            <T numberOfLines={1} style={{ fontSize: 10, color: c.textMuted }}>
              {t.common.appSubtitle}
            </T>
          </View>
        </Pressable>

        <Pressable
          onPress={onClose}
          className="h-11 w-11 items-center justify-center rounded-xl"
        >
          <X size={20} color={c.textMuted} />
        </Pressable>
      </View>

      {/* Quick Actions */}
      <View style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: c.sidebarBorder, gap: 8 }}>
        <Pressable
          onPress={() => {
            setIsQuickCaptureOpen(true);
            onClose();
          }}
          style={({ pressed }) => ({
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            borderRadius: 12,
            backgroundColor: "#2563eb",
            paddingVertical: 10,
            paddingHorizontal: 12,
            opacity: pressed ? 0.85 : 1,
            minHeight: 44,
          })}
        >
          <Plus size={16} color="#ffffff" />
          <T style={{ fontSize: 12, fontWeight: "600", color: "#ffffff" }}>
            {t.common.quickCapture}
          </T>
        </Pressable>

        <Pressable
          onPress={() => {
            setIsCommandPaletteOpen(true);
            onClose();
          }}
          style={({ pressed }) => ({
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: c.sidebarBorder,
            backgroundColor: c.bgElevated,
            paddingVertical: 8,
            paddingHorizontal: 12,
            opacity: pressed ? 0.85 : 1,
            minHeight: 44,
          })}
        >
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
            <Search size={16} color={c.textMuted} />
            <T style={{ fontSize: 12, color: c.textMuted }}>{t.common.search}</T>
          </View>
        </Pressable>
      </View>

      {/* Navigation Sections */}
      <ScrollView style={{ flex: 1, padding: 12 }}>
        {/* Main Navigation */}
        <View style={{ marginBottom: 20 }}>
          <T style={{ marginBottom: 8, paddingHorizontal: 12, fontSize: 10, fontWeight: "700", color: c.textMuted, letterSpacing: 2 }}>
            {t.nav.coreSection}
          </T>
          <View style={{ gap: 4 }}>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => handleNavClick(item.id)}
                  style={({ pressed }) => ({
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    gap: 12,
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    minHeight: 44,
                    borderWidth: 1,
                    borderColor: isActive ? c.sidebarBorder : "transparent",
                    backgroundColor: isActive ? c.bgElevated : pressed ? "rgba(148,163,184,0.08)" : "transparent",
                  })}
                >
                  <Icon size={16} color={isActive ? "#2563eb" : c.textMuted} />
                  <T
                    numberOfLines={1}
                    style={{
                      flex: 1,
                      fontSize: 12,
                      color: isActive ? c.sidebarItemActiveText : c.sidebarItemText,
                      fontWeight: isActive ? "700" : "500",
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {item.label}
                  </T>
                  {item.badge !== undefined && item.badge > 0 && (
                    <View
                      style={{
                        height: 20,
                        minWidth: 20,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 999,
                        backgroundColor: c.bgSubtle,
                        borderWidth: 1,
                        borderColor: c.sidebarBorder,
                        paddingHorizontal: 6,
                      }}
                    >
                      <T style={{ fontSize: 10, fontWeight: "700", color: "#2563eb" }}>
                        {item.badge}
                      </T>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Databases */}
        <View style={{ marginBottom: 20 }}>
          <T style={{ marginBottom: 8, paddingHorizontal: 12, fontSize: 10, fontWeight: "700", color: c.textMuted, letterSpacing: 2 }}>
            {t.nav.databaseSection}
          </T>
          <View style={{ gap: 4 }}>
            {databaseItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => handleNavClick(item.id)}
                  style={({ pressed }) => ({
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    gap: 12,
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    minHeight: 44,
                    borderWidth: 1,
                    borderColor: isActive ? c.sidebarBorder : "transparent",
                    backgroundColor: isActive ? c.bgElevated : pressed ? "rgba(148,163,184,0.08)" : "transparent",
                  })}
                >
                  <Icon size={16} color={isActive ? "#6366f1" : c.textMuted} />
                  <T
                    numberOfLines={1}
                    style={{
                      flex: 1,
                      fontSize: 12,
                      color: isActive ? c.sidebarItemActiveText : c.sidebarItemText,
                      fontWeight: isActive ? "700" : "500",
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {item.label}
                  </T>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* AI & Automation Tools */}
        <View>
          <T style={{ marginBottom: 8, paddingHorizontal: 12, fontSize: 10, fontWeight: "700", color: c.textMuted, letterSpacing: 2 }}>
            {t.nav.aiToolsSection}
          </T>
          <View style={{ gap: 4 }}>
            {aiToolsItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id !== "ai_modal" && activeView === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => handleNavClick(item.id)}
                  style={({ pressed }) => ({
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    gap: 12,
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    minHeight: 44,
                    borderWidth: 1,
                    borderColor: item.isSpecial
                      ? "rgba(59,130,246,0.2)"
                      : isActive
                      ? c.sidebarBorder
                      : "transparent",
                    backgroundColor: item.isSpecial
                      ? "rgba(59,130,246,0.1)"
                      : isActive
                      ? c.bgElevated
                      : pressed
                      ? "rgba(148,163,184,0.08)"
                      : "transparent",
                  })}
                >
                  <Icon
                    size={16}
                    color={item.isSpecial ? "#3b82f6" : isActive ? "#6366f1" : c.textMuted}
                  />
                  <T
                    numberOfLines={1}
                    style={{
                      flex: 1,
                      fontSize: 12,
                      color: item.isSpecial
                        ? "#3b82f6"
                        : isActive
                        ? c.sidebarItemActiveText
                        : c.sidebarItemText,
                      fontWeight: item.isSpecial || isActive ? "600" : "500",
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {item.label}
                  </T>
                  {item.isSpecial && (
                    <View
                      className="rounded-full border bg-blue-500/20 px-2 py-0.5"
                      style={{ borderColor: "rgba(59,130,246,0.3)" }}
                    >
                      <T style={{ fontSize: 9, fontWeight: "700", color: "#3b82f6" }}>AI</T>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Pomodoro Focus Timer */}
      <PomodoroTimer isCollapsed={false} />

      {/* Footer */}
      <View style={{ borderTopWidth: 1, borderTopColor: c.sidebarBorder, padding: 12 }}>
        <View
          style={{
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}>
            <View style={{ height: 8, width: 8, borderRadius: 4, backgroundColor: "#3b82f6" }} />
            <T style={{ fontSize: 11, color: c.sidebarItemActiveText, fontWeight: "500" }}>
              {t.common.systemOnline}
            </T>
          </View>
          <T style={{ fontSize: 10, color: c.textMuted }}>v2.5</T>
        </View>
      </View>
    </Animated.View>
  );
}
