import React, { useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import {
  Keyboard,
  X,
  Search,
  Zap,
  Compass,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react-native";
import { useSecondBrain } from "../../context/SecondBrainContext";
import { T, Input, ModalShell } from "../ui/primitives";

interface ShortcutItem {
  id: string;
  keys: string[];
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
  descriptionEn: string;
  category: "navigation" | "actions" | "views" | "system";
  action?: () => void;
}

export const KeyboardShortcutsModal: React.FC = () => {
  const {
    isShortcutsModalOpen,
    setIsShortcutsModalOpen,
    setIsCommandPaletteOpen,
    setIsQuickCaptureOpen,
    setIsWebClipperOpen,
    setIsAIAssistantOpen,
    setActiveView,
    toggleTheme,
    toggleLanguage,
    toggleFocusMode,
    isRTL,
    t,
  } = useSecondBrain();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const shortcuts: ShortcutItem[] = [
    {
      id: "cmd-k",
      keys: ["⌘", "K"],
      titleFa: "پالت دستورات و جستجوی سراسری",
      titleEn: "Command Palette & Universal Search",
      descriptionFa: "جستجوی آنی در یادداشت‌ها، وظایف، پروژه‌ها و اجرای دستورات",
      descriptionEn: "Instant search across all second brain entities and actions",
      category: "navigation",
      action: () => {
        setIsShortcutsModalOpen(false);
        setIsCommandPaletteOpen(true);
      },
    },
    {
      id: "cmd-j",
      keys: ["⌘", "J"],
      titleFa: "ثبت سریع ایده، وظیفه و یادداشت",
      titleEn: "Quick Capture Modal",
      descriptionFa: "باز کردن فرم سریع برای ضبط آنی بدون قطع کار فعلی",
      descriptionEn: "Instantly capture tasks, thoughts, notes, and bookmarks",
      category: "navigation",
      action: () => {
        setIsShortcutsModalOpen(false);
        setIsQuickCaptureOpen(true);
      },
    },
    {
      id: "help",
      keys: ["?"],
      titleFa: "راهنمای کلیدهای میانبر",
      titleEn: "Keyboard Shortcuts Guide",
      descriptionFa: "نمایش این راهنما در هر کجای برنامه",
      descriptionEn: "Toggle this keyboard shortcuts cheatsheet modal",
      category: "navigation",
    },
    {
      id: "web-clipper",
      keys: ["W"],
      titleFa: "وب‌کلیپر و ذخیره لینک",
      titleEn: "Web Clipper",
      descriptionFa: "استخراج محتوا و ذخیره نشانی‌های وب در یادداشت‌ها",
      descriptionEn: "Capture external web URLs, summarize, and save to notes",
      category: "actions",
      action: () => {
        setIsShortcutsModalOpen(false);
        setIsWebClipperOpen(true);
      },
    },
    {
      id: "ai-assistant",
      keys: ["A"],
      titleFa: "دستیار هوشمند و کوپایلوت",
      titleEn: "AI Copilot Assistant",
      descriptionFa: "پرسش، خلاصه‌سازی و تحلیل ارتباطات مغز دوم با هوش مصنوعی",
      descriptionEn: "Query, summarize, and connect knowledge using AI",
      category: "actions",
      action: () => {
        setIsShortcutsModalOpen(false);
        setIsAIAssistantOpen(true);
      },
    },
    {
      id: "focus-mode",
      keys: ["F"],
      titleFa: "تغییر حالت تمرکز (Focus Mode)",
      titleEn: "Toggle Focus Mode",
      descriptionFa: "پنهان‌سازی سایدبار، نوارها و تمام المان‌های ناوبری برای تمرکز کامل بر محتوا",
      descriptionEn: "Hide sidebar, header, and navigation to work without distractions",
      category: "actions",
      action: () => {
        setIsShortcutsModalOpen(false);
        toggleFocusMode();
      },
    },
    {
      id: "nav-dash",
      keys: ["G", "D"],
      titleFa: "رفتن به داشبورد",
      titleEn: "Go to Dashboard",
      descriptionFa: "نمایش مرکز کنترل، متریک‌ها، نمودارها و ژورنال روزانه",
      descriptionEn: "Navigate to Dashboard overview and daily journal",
      category: "views",
      action: () => {
        setIsShortcutsModalOpen(false);
        setActiveView("dashboard");
      },
    },
    {
      id: "nav-proj",
      keys: ["G", "P"],
      titleFa: "رفتن به پروژه‌ها (PARA)",
      titleEn: "Go to Projects",
      descriptionFa: "مدیریت پروژه‌ها، تسک‌های مربوطه و پیشرفت",
      descriptionEn: "Manage active projects and PARA methodology components",
      category: "views",
      action: () => {
        setIsShortcutsModalOpen(false);
        setActiveView("projects");
      },
    },
    {
      id: "nav-tasks",
      keys: ["G", "T"],
      titleFa: "رفتن به کارها و وظایف",
      titleEn: "Go to Tasks & Actions",
      descriptionFa: "فهرست اقدامات فوری، ماتریس اولویت و انجام وظایف",
      descriptionEn: "Manage active tasks, deadlines, and priorities",
      category: "views",
      action: () => {
        setIsShortcutsModalOpen(false);
        setActiveView("tasks");
      },
    },
    {
      id: "nav-notes",
      keys: ["G", "N"],
      titleFa: "رفتن به یادداشت‌ها",
      titleEn: "Go to Notes & Knowledge",
      descriptionFa: "مرور مغز دوم Zettelkasten و یادداشت‌های اتمیک",
      descriptionEn: "Explore atomic knowledge notes, links, and tags",
      category: "views",
      action: () => {
        setIsShortcutsModalOpen(false);
        setActiveView("notes");
      },
    },
    {
      id: "nav-goals",
      keys: ["G", "G"],
      titleFa: "رفتن به اهداف استراتژیک",
      titleEn: "Go to Goals",
      descriptionFa: "پایش اهداف کوتاه‌مدت، میان‌مدت و بلندمدت با حلقه‌های پیشرفت",
      descriptionEn: "Track strategic goals, milestones, and progress rings",
      category: "views",
      action: () => {
        setIsShortcutsModalOpen(false);
        setActiveView("goals");
      },
    },
    {
      id: "nav-habits",
      keys: ["G", "H"],
      titleFa: "رفتن به عادت‌ها",
      titleEn: "Go to Habits Tracker",
      descriptionFa: "ثبت روزانه عادت‌ها، زنجیره استمرار و شاخص ثبات",
      descriptionEn: "Log daily habits, streaks, and consistency scores",
      category: "views",
      action: () => {
        setIsShortcutsModalOpen(false);
        setActiveView("habits");
      },
    },
    {
      id: "nav-contacts",
      keys: ["G", "C"],
      titleFa: "رفتن به شبکه ارتباطات",
      titleEn: "Go to Contacts CRM",
      descriptionFa: "مدیریت شبکه ارتباطی حرفه‌ای، پیگیری‌ها و یادداشت‌ها",
      descriptionEn: "Personal CRM for meaningful network follow-ups",
      category: "views",
      action: () => {
        setIsShortcutsModalOpen(false);
        setActiveView("contacts");
      },
    },
    {
      id: "toggle-theme",
      keys: ["T"],
      titleFa: "تغییر تم (تاریک / روشن)",
      titleEn: "Toggle Theme (Dark / Light)",
      descriptionFa: "جابه‌جایی میان حالت تاریک مدرن و حالت روشن شیک",
      descriptionEn: "Switch between dark obsidian and refined light canvas",
      category: "system",
      action: () => toggleTheme(),
    },
    {
      id: "toggle-lang",
      keys: ["L"],
      titleFa: "تغییر زبان (فارسی / English)",
      titleEn: "Switch Language",
      descriptionFa: "جابه‌جایی زبان رابط کاربری و چیدمان راست‌چین / چپ‌چین",
      descriptionEn: "Toggle interface between Persian RTL and English LTR",
      category: "system",
      action: () => toggleLanguage(),
    },
  ];

  const filteredShortcuts = shortcuts.filter((s) => {
    const matchesCategory = activeCategory === "all" || s.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;
    const textToSearch = `${s.titleFa} ${s.titleEn} ${s.descriptionFa} ${s.descriptionEn} ${s.keys.join(" ")}`.toLowerCase();
    return matchesCategory && textToSearch.includes(query);
  });

  const categories = [
    { id: "all", labelFa: "همه کلیدها", labelEn: "All Shortcuts", icon: Keyboard },
    { id: "navigation", labelFa: "جستجو و ناوبری", labelEn: "Navigation", icon: Compass },
    { id: "views", labelFa: "نماها و بخش‌ها", labelEn: "Views (G + ...)", icon: Layers },
    { id: "actions", labelFa: "اقدامات و ابزارها", labelEn: "Actions", icon: Zap },
    { id: "system", labelFa: "تنظیمات سیستمی", labelEn: "System", icon: Sparkles },
  ];

  return (
    <ModalShell
      visible={isShortcutsModalOpen}
      onClose={() => setIsShortcutsModalOpen(false)}
      maxWidth={640}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: isRTL ? "row-reverse" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: "#262626",
          paddingHorizontal: 20,
          paddingVertical: 14,
          backgroundColor: "rgba(10,10,10,0.4)",
        }}
      >
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12 }}>
          <View
            className="h-10 w-10 items-center justify-center rounded-2xl border bg-blue-500/10"
            style={{ borderColor: "rgba(59,130,246,0.2)" }}
          >
            <Keyboard size={20} color="#60a5fa" />
          </View>
          <View>
            <T style={{ fontSize: 14, fontWeight: "700", color: "#ffffff" }}>
              {isRTL ? "کلیدهای میانبر و راهنما" : "Shortcuts & Guide"}
            </T>
            <T style={{ fontSize: 11, color: "#a3a3a3", marginTop: 2 }}>
              {isRTL
                ? "روی هر مورد ضربه بزنید تا اجرا شود"
                : "Tap any item to run it instantly"}
            </T>
          </View>
        </View>
        <Pressable onPress={() => setIsShortcutsModalOpen(false)} className="rounded-xl p-2">
          <X size={20} color="#a3a3a3" />
        </Pressable>
      </View>

      {/* Search & Category Filter Bar */}
      <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: "rgba(38,38,38,0.8)", gap: 12 }}>
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              flex: 1,
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#262626",
              backgroundColor: "#0a0a0a",
              paddingHorizontal: 12,
              gap: 8,
            }}
          >
            <Search size={16} color="#a3a3a3" />
            <Input
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={
                isRTL
                  ? "جستجوی میانبر (مثلاً K، داشبورد، کلیپر...)"
                  : "Search shortcuts (e.g. K, dashboard, clipper...)"
              }
              style={{ flex: 1, fontSize: 13, color: "#ffffff", paddingVertical: 10 }}
            />
          </View>
        </View>

        {/* Categories Tab Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 6 }}>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setActiveCategory(cat.id)}
                  style={({ pressed }) => ({
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    gap: 6,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    backgroundColor: isActive ? "#2563eb" : "#0a0a0a",
                    borderWidth: 1,
                    borderColor: isActive ? "#2563eb" : "#262626",
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <Icon size={14} color={isActive ? "#ffffff" : "#a3a3a3"} />
                  <T style={{ fontSize: 12, fontWeight: "600", color: isActive ? "#ffffff" : "#a3a3a3" }}>
                    {isRTL ? cat.labelFa : cat.labelEn}
                  </T>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Shortcuts List Content */}
      <ScrollView style={{ maxHeight: 400 }} contentContainerStyle={{ padding: 16, gap: 10 }}>
        {filteredShortcuts.length === 0 ? (
          <View style={{ paddingVertical: 48, alignItems: "center" }}>
            <Keyboard size={32} color="#525252" />
            <T style={{ fontSize: 12, color: "#a3a3a3", marginTop: 8 }}>
              {isRTL ? "میانبری مطابق با جستجوی شما یافت نشد" : "No shortcuts matched your search"}
            </T>
          </View>
        ) : (
          filteredShortcuts.map((s) => (
            <Pressable
              key={s.id}
              onPress={s.action}
              style={({ pressed }) => ({
                flexDirection: isRTL ? "row-reverse" : "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 14,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: pressed ? "#404040" : "rgba(38,38,38,0.8)",
                backgroundColor: pressed ? "rgba(38,38,38,0.5)" : "rgba(10,10,10,0.4)",
                gap: 12,
              })}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
                  <T numberOfLines={1} style={{ fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
                    {isRTL ? s.titleFa : s.titleEn}
                  </T>
                  {s.action ? (
                    <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 2 }}>
                      <T style={{ fontSize: 10, color: "#60a5fa" }}>{isRTL ? "اجرا" : "Run"}</T>
                      <ExternalLink size={10} color="#60a5fa" />
                    </View>
                  ) : null}
                </View>
                <T numberOfLines={1} style={{ fontSize: 11, color: "#a3a3a3", marginTop: 2 }}>
                  {isRTL ? s.descriptionFa : s.descriptionEn}
                </T>
              </View>

              {/* Key Badges */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                {s.keys.map((k, idx) => (
                  <React.Fragment key={idx}>
                    <View
                      style={{
                        minHeight: 26,
                        minWidth: 26,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: "#404040",
                        backgroundColor: "#1f1f1f",
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                      }}
                    >
                      <T style={{ fontSize: 12, fontWeight: "700", color: "#e5e5e5" }}>{k}</T>
                    </View>
                    {idx < s.keys.length - 1 && (
                      <T style={{ fontSize: 12, color: "#737373", fontWeight: "700" }}>+</T>
                    )}
                  </React.Fragment>
                ))}
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>

      {/* Footer Note */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: "#262626",
          paddingHorizontal: 20,
          paddingVertical: 12,
          backgroundColor: "#0a0a0a",
          flexDirection: isRTL ? "row-reverse" : "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <T style={{ fontSize: 11, color: "#a3a3a3", flex: 1 }}>
          {isRTL
            ? "روی موبایل از دکمه‌های نوار بالای صفحه استفاده کنید."
            : "Use the header buttons on mobile."}
        </T>
        <Pressable
          onPress={() => setIsShortcutsModalOpen(false)}
          style={({ pressed }) => ({
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: pressed ? "#404040" : "#262626",
          })}
        >
          <T style={{ fontSize: 12, fontWeight: "500", color: "#ffffff" }}>{t.common.cancel}</T>
        </Pressable>
      </View>
    </ModalShell>
  );
};
