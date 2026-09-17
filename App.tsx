import React, { useState, useEffect } from "react";
import { View, ScrollView, Linking } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SecondBrainProvider, useSecondBrain } from "./src/context/SecondBrainContext";
import { Sidebar } from "./src/components/layout/Sidebar";
import { Header } from "./src/components/layout/Header";
import { Breadcrumbs } from "./src/components/layout/Breadcrumbs";
import { DashboardView } from "./src/components/views/DashboardView";
import { NotesView } from "./src/components/views/NotesView";
import { TasksView } from "./src/components/views/TasksView";
import { ProjectsView } from "./src/components/views/ProjectsView";
import { GoalsView } from "./src/components/views/GoalsView";
import { HabitsView } from "./src/components/views/HabitsView";
import { ContactsView } from "./src/components/views/ContactsView";
import { SkillsView } from "./src/components/views/SkillsView";
import { ResourcesView } from "./src/components/views/ResourcesView";
import { IncomeView } from "./src/components/views/IncomeView";
import { SelfAwarenessView } from "./src/components/views/SelfAwarenessView";
import { GraphView } from "./src/components/views/GraphView";
import { AutomationView } from "./src/components/views/AutomationView";
import { ExportView } from "./src/components/views/ExportView";
import { CommandPalette } from "./src/components/modals/CommandPalette";
import { QuickCaptureModal } from "./src/components/modals/QuickCaptureModal";
import { WebClipperModal } from "./src/components/modals/WebClipperModal";
import { KeyboardShortcutsModal } from "./src/components/modals/KeyboardShortcutsModal";
import { VaultLockScreen } from "./src/components/modals/VaultLockScreen";
import { OfflineBanner } from "./src/components/ui/OfflineBanner";
import { ShortcutsFooter } from "./src/components/layout/ShortcutsFooter";
import { AIAssistantDrawer } from "./src/components/ai/AIAssistantDrawer";
import { ToastContainer } from "./src/components/ui/ToastContainer";
import { ErrorBoundary } from "./src/components/ui/ErrorBoundary";
import { PullToRefresh } from "./src/components/ui/PullToRefresh";
import { useThemeColors } from "./src/lib/theme";
import "./global.css";

function MainLayout() {
  const { activeView, setActiveView, theme, setIsQuickCaptureOpen } = useSecondBrain();
  const c = useThemeColors();
  const insets = useSafeAreaInsets();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Quick-capture widget deep link: secondbrain://quick-capture
  useEffect(() => {
    const processUrl = (url: string | null) => {
      if (!url) return;
      if (/^(secondbrain|com\.secondbrainai\.mobile):\/\/quick-capture/.test(url)) {
        setIsQuickCaptureOpen(true);
      }
    };
    Linking.getInitialURL().then(processUrl);
    const sub = Linking.addEventListener("url", ({ url }) => processUrl(url));
    return () => sub.remove();
  }, [setIsQuickCaptureOpen]);

  // Render current view
  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView />;
      case "notes":
        return <NotesView />;
      case "tasks":
        return <TasksView />;
      case "projects":
        return <ProjectsView />;
      case "goals":
        return <GoalsView />;
      case "habits":
        return <HabitsView />;
      case "contacts":
        return <ContactsView />;
      case "skills":
        return <SkillsView />;
      case "resources":
        return <ResourcesView />;
      case "income":
        return <IncomeView />;
      case "self-awareness":
        return <SelfAwarenessView />;
      case "graph":
        return <GraphView />;
      case "automation":
        return <AutomationView />;
      case "export":
        return <ExportView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: c.bgMain,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <StatusBar style={theme === "dark" ? "light" : "dark"} />

      {/* Main app viewport */}
      <View style={{ flex: 1, backgroundColor: c.bgSurface }}>
        {/* Sticky Header */}
        <Header setIsMobileOpen={setIsMobileOpen} />

        {/* Breadcrumb Navigation Hierarchy */}
        <Breadcrumbs />

        {/* Scrollable View Content with mobile pull-to-refresh */}
        <PullToRefresh style={{ flex: 1 }}>
          <View style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 12 }}>
            <ErrorBoundary onReset={() => setActiveView("dashboard")}>
              <View style={{ width: "100%" }}>{renderView()}</View>
            </ErrorBoundary>
          </View>
        </PullToRefresh>

        {/* Floating shortcuts bar */}
        <ShortcutsFooter />
      </View>

      {/* Drawer navigation */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Overlays & Modals */}
      <VaultLockScreen />
      <OfflineBanner />
      <CommandPalette />
      <QuickCaptureModal />
      <WebClipperModal />
      <KeyboardShortcutsModal />
      <AIAssistantDrawer />
      <ToastContainer />
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Vazirmatn: require("./assets/fonts/Vazirmatn-Regular.ttf"),
    "Vazirmatn-Medium": require("./assets/fonts/Vazirmatn-Medium.ttf"),
    "Vazirmatn-SemiBold": require("./assets/fonts/Vazirmatn-SemiBold.ttf"),
    "Vazirmatn-Bold": require("./assets/fonts/Vazirmatn-Bold.ttf"),
    "Vazirmatn-Light": require("./assets/fonts/Vazirmatn-Light.ttf"),
    "Vazirmatn-ExtraBold": require("./assets/fonts/Vazirmatn-ExtraBold.ttf"),
  });

  if (!fontsLoaded) {
    // Keep the native splash screen visible while fonts load
    return null;
  }

  return (
    <SecondBrainProvider>
      <MainLayout />
    </SecondBrainProvider>
  );
}
