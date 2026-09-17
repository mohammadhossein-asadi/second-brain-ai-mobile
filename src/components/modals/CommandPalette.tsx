import React, { useState, useEffect, useMemo } from "react";
import { View, Pressable, Alert, FlatList, TextStyle } from "react-native";
import {
  Search,
  FileText,
  CheckSquare,
  FolderKanban,
  Target,
  Users,
  Zap,
  Network,
  Plus,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  BookOpen,
  X,
  History,
  Clock,
  Compass,
  Sliders,
  Sun,
  Moon,
  Languages,
  Keyboard,
  RotateCcw,
  TrendingUp,
  Globe,
  RefreshCw,
  LayoutDashboard,
  CalendarCheck,
  Award,
  DollarSign,
  HardDriveDownload,
  Bot,
  Calendar,
  Maximize2,
} from "lucide-react-native";
import { useSecondBrain } from "../../context/SecondBrainContext";
import { ActiveView } from "../../types";
import { ModalShell, T, TBold, Input, Btn } from "../ui/primitives";
import {
  getFrequentlyAccessedViews,
  getSmartTimePrediction,
  ViewStats,
} from "../../utils/viewTracking";
import { storage } from "../../lib/storage";

type IconType = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

// Always-dark modal chrome palette (mirrors the web dark: variants used inside
// the command palette dialog, and the ModalShell dark surface).
const P = {
  border: "#262626",
  borderSoft: "rgba(38,38,38,0.6)",
  surface: "#0a0a0a",
  surfaceAlt: "rgba(23,23,23,0.5)",
  inner: "#171717",
  text: "#f5f5f5",
  textMid: "#d4d4d4",
  textMuted: "#a3a3a3",
  textSubtle: "#737373",
  blue: "#3b82f6",
  blueSoft: "#60a5fa",
  blueLight: "#93c5fd",
  blueBg: "rgba(59,130,246,0.2)",
  blueBgSoft: "rgba(59,130,246,0.15)",
  blueBorder: "rgba(59,130,246,0.3)",
  emerald: "#34d399",
  rose: "#fb7185",
  deepBlueBg: "rgba(23,37,84,0.25)",
};

const RECENT_SEARCHES_KEY = "second_brain_recent_searches";

// Component that splits text by query and visually highlights matching terms
const HighlightMatch: React.FC<{ text: string; query: string; style?: TextStyle }> = ({
  text,
  query,
  style,
}) => {
  const trimmed = query.trim();
  if (!trimmed || !text) {
    return <T style={style}>{text}</T>;
  }

  try {
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    const parts = text.split(regex);

    return (
      <T style={style}>
        {parts.map((part, i) => {
          if (part.toLowerCase() === trimmed.toLowerCase()) {
            return (
              <T
                key={i}
                style={{
                  color: P.blueLight,
                  backgroundColor: "rgba(59,130,246,0.35)",
                  fontWeight: "700",
                  textDecorationLine: "underline",
                  textDecorationColor: "rgba(59,130,246,0.6)",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                {part}
              </T>
            );
          }
          return <React.Fragment key={i}>{part}</React.Fragment>;
        })}
      </T>
    );
  } catch {
    return <T style={style}>{text}</T>;
  }
};

// Helper to extract a relevant snippet around the match
function getSnippetWithMatch(content: string, query: string): string | null {
  if (!query.trim() || !content) return null;
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.trim().toLowerCase();
  const matchIndex = lowerContent.indexOf(lowerQuery);

  if (matchIndex === -1) return null;

  const start = Math.max(0, matchIndex - 25);
  const end = Math.min(content.length, matchIndex + query.length + 45);
  let snippet = content.slice(start, end).replace(/\n/g, " ").trim();

  if (start > 0) snippet = "..." + snippet;
  if (end < content.length) snippet = snippet + "...";

  return snippet;
}

export interface CommandPaletteItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: IconType;
  action: () => void;
  badge?: string | number;
  badgeColor?: string;
  snippet?: string | null;
  tag?: string;
  completed?: boolean;
}

export interface ContextSection {
  id: string;
  title: string;
  icon: IconType;
  items: CommandPaletteItem[];
}

type PaletteRow =
  | { kind: "header"; section: ContextSection }
  | { kind: "item"; item: CommandPaletteItem };

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActiveView,
    setIsQuickCaptureOpen,
    setIsAIAssistantOpen,
    setIsWebClipperOpen,
    setIsShortcutsModalOpen,
    theme,
    toggleTheme,
    language,
    toggleLanguage,
    notes,
    tasks,
    projects,
    goals,
    contacts,
    resources,
    setSelectedNoteId,
    syncData,
    generateMissingNoteSummaries,
    resetToDefaults,
    showToast,
    isRTL,
    t,
    openOrCreateDailyNote,
    toggleFocusMode,
  } = useSecondBrain();

  const [query, setQuery] = useState("");

  // Recent searches state persisted to storage (same key as web localStorage)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = storage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return ["PARA method", "Sprint tasks", "Habits tracker", "Design tokens"];
  });

  // Frequently accessed views for the predictive section
  const [frequentViews, setFrequentViews] = useState<ViewStats[]>([]);
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setFrequentViews(getFrequentlyAccessedViews(6));
    }
  }, [isCommandPaletteOpen]);

  // Smart time-context prediction
  const timePrediction = useMemo(() => getSmartTimePrediction(isRTL), [isRTL]);

  const addRecentSearch = (term: string) => {
    const clean = term.trim();
    if (!clean || clean.length < 2) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...filtered].slice(0, 8);
      try {
        storage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const removeRecentSearch = (termToRemove: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== termToRemove);
      try {
        storage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      storage.removeItem(RECENT_SEARCHES_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectResult = (action: () => void) => {
    if (query.trim()) {
      addRecentSearch(query);
    }
    action();
  };

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery("");
    }
  }, [isCommandPaletteOpen]);

  const q = query.trim().toLowerCase();

  // 1. Navigation Definitions (All Views)
  const viewDefinitions: {
    id: ActiveView;
    title: string;
    subtitle: string;
    icon: IconType;
    keywords: string[];
  }[] = useMemo(
    () => [
      {
        id: "dashboard",
        title: t.nav.dashboard,
        subtitle: t.views.dashboard.subtitle,
        icon: LayoutDashboard,
        keywords: ["home", "main", "overview", "داشبورد", "خانه", "اصلی"],
      },
      {
        id: "notes",
        title: t.nav.notes,
        subtitle: isRTL ? "مخزن یادداشت‌های زتل‌کاستن و پارا" : "Zettelkasten and PARA notes vault",
        icon: FileText,
        keywords: ["note", "zettelkasten", "text", "vault", "یادداشت", "نوشتن", "زتلکاستن"],
      },
      {
        id: "tasks",
        title: t.nav.tasks,
        subtitle: t.views.tasks.subtitle,
        icon: CheckSquare,
        keywords: ["todo", "task", "gtd", "وظیفه", "کارها", "انجام"],
      },
      {
        id: "projects",
        title: t.nav.projects,
        subtitle: isRTL ? "مدیریت پروژه‌های فعال با افق زمانی" : "Active projects and milestones",
        icon: FolderKanban,
        keywords: ["project", "para", "milestone", "پروژه", "برنامه‌ریزی"],
      },
      {
        id: "goals",
        title: t.nav.goals,
        subtitle: isRTL ? "افق‌های دید و اهداف استراتژیک" : "Strategic goals and horizons",
        icon: Target,
        keywords: ["goal", "target", "okr", "هدف", "اهداف"],
      },
      {
        id: "habits",
        title: t.nav.habits,
        subtitle: isRTL ? "ردیابی عادت‌ها و روتین‌های روزانه" : "Daily habits and streak tracking",
        icon: CalendarCheck,
        keywords: ["habit", "routine", "streak", "عادت", "روتین"],
      },
      {
        id: "resources",
        title: t.nav.resources,
        subtitle: isRTL ? "مخزن مراجع، مقالات و بوک‌مارک‌ها" : "Repository of references and bookmarks",
        icon: BookOpen,
        keywords: ["resource", "library", "book", "link", "منبع", "کتابخانه", "لینک"],
      },
      {
        id: "contacts",
        title: t.nav.contacts,
        subtitle: isRTL ? "مدیریت ارتباطات فردی و شبکه افراد" : "Personal CRM and network relationships",
        icon: Users,
        keywords: ["contact", "people", "crm", "network", "مخاطب", "دوستان", "شبکه"],
      },
      {
        id: "skills",
        title: t.nav.skills,
        subtitle: isRTL ? "درخت مهارت‌ها و پیشرفت فردی" : "Skill tree and capability growth",
        icon: Award,
        keywords: ["skill", "learning", "growth", "مهارت", "یادگیری"],
      },
      {
        id: "graph",
        title: t.nav.graph,
        subtitle: t.modals.commandPalette.viewGraphSubtitle,
        icon: Network,
        keywords: ["graph", "network", "mindmap", "گراف", "نقشه", "ارتباطات"],
      },
      {
        id: "automation",
        title: t.nav.automation,
        subtitle: t.views.automation.subtitle,
        icon: Zap,
        keywords: ["automation", "rule", "trigger", "خودکارسازی", "اتوماسیون"],
      },
      {
        id: "income",
        title: t.nav.income,
        subtitle: isRTL ? "جریان‌های درآمدی و مدیریت مالی" : "Income streams and finance overview",
        icon: DollarSign,
        keywords: ["income", "money", "finance", "درآمد", "مالی"],
      },
      {
        id: "self-awareness",
        title: t.nav.selfAwareness,
        subtitle: isRTL ? "ارزش‌ها، خودشناسی و اصول زندگی" : "Core values, self-reflection & principles",
        icon: Sparkles,
        keywords: ["self", "values", "reflection", "خودشناسی", "ارزش"],
      },
      {
        id: "export",
        title: t.nav.export,
        subtitle: isRTL ? "خروجی گرفتن و پشتیبان‌گیری از داده‌ها" : "Backup and export data archive",
        icon: HardDriveDownload,
        keywords: ["export", "backup", "download", "خروجی", "پشتیبان"],
      },
    ],
    [t, isRTL]
  );

  // 2. Action Definitions
  const actionDefinitions = useMemo(
    () => [
      {
        id: "act-daily-note",
        title: isRTL ? "یادداشت روزانه امروز (Daily Note)" : "Today's Daily Note",
        subtitle: isRTL ? "ایجاد یا باز کردن سریع یادداشت روز جاری با الگوی روزانه" : "Create or open daily note for today",
        icon: Calendar,
        badge: "Daily",
        keywords: ["daily", "today", "note", "journal", "روزانه", "امروز", "یادداشت"],
        action: () => {
          setIsCommandPaletteOpen(false);
          openOrCreateDailyNote();
        },
      },
      {
        id: "act-focus-mode",
        title: isRTL ? "تغییر وضعیت حالت تمرکز (Focus Mode)" : "Toggle Focus Mode",
        subtitle: isRTL ? "پنهان‌سازی سایدبار و المان‌های ناوبری برای تمرکز کامل" : "Hide sidebar and navigation elements to minimize distractions",
        icon: Maximize2,
        badge: "Focus",
        keywords: ["focus", "zen", "minimal", "distraction", "تمرکز", "خلوت", "سایدبار"],
        action: () => {
          setIsCommandPaletteOpen(false);
          toggleFocusMode();
        },
      },
      {
        id: "act-quick-note",
        title: t.modals.commandPalette.quickNoteAction,
        subtitle: t.modals.commandPalette.quickNoteSubtitle,
        icon: Plus,
        badge: isRTL ? "ورودی سریع" : "Create",
        keywords: ["new", "create", "note", "task", "capture", "جدید", "ثبت", "یادداشت", "ورودی"],
        action: () => {
          setIsCommandPaletteOpen(false);
          setIsQuickCaptureOpen(true);
        },
      },
      {
        id: "act-ai-copilot",
        title: t.modals.commandPalette.askAiAction,
        subtitle: t.modals.commandPalette.askAiSubtitle,
        icon: Bot,
        badge: "AI",
        keywords: ["ai", "gemini", "assistant", "copilot", "chat", "هوش مصنوعی", "دستیار", "تحلیل"],
        action: () => {
          setIsCommandPaletteOpen(false);
          setIsAIAssistantOpen(true);
        },
      },
      {
        id: "act-web-clipper",
        title: isRTL ? "استخراج هوشمند وب (Web Clipper)" : "Intelligent Web Clipper",
        subtitle: isRTL ? "ذخیره و خلاصه‌سازی صفحه اینترنتی در مخزن" : "Clip and summarize web URL into vault",
        icon: Globe,
        badge: "Web",
        keywords: ["clipper", "url", "link", "web", "scrape", "وب", "لینک", "کلیپر"],
        action: () => {
          setIsCommandPaletteOpen(false);
          setIsWebClipperOpen(true);
        },
      },
      {
        id: "act-sync-data",
        title: isRTL ? "همگام‌سازی فوری مغز دوم" : "Sync Knowledge Vault",
        subtitle: isRTL ? "بروزرسانی تغییرات با فضای ذخیره‌سازی ابری" : "Persist and synchronize data changes",
        icon: RefreshCw,
        badge: "Sync",
        keywords: ["sync", "cloud", "refresh", "همگام", "بروزرسانی"],
        action: async () => {
          setIsCommandPaletteOpen(false);
          await syncData();
          showToast(isRTL ? "مغز دوم با موفقیت همگام شد" : "Vault synchronized successfully", "success");
        },
      },
      {
        id: "act-summaries",
        title: isRTL ? "تولید دسته‌ای خلاصه‌ها با هوش مصنوعی" : "Batch AI Note Summaries",
        subtitle: isRTL ? "تکمیل خلاصه‌های خودکار برای تمام یادداشت‌ها" : "Generate missing summaries across all notes",
        icon: Sparkles,
        badge: "AI",
        keywords: ["summarize", "summary", "ai", "notes", "خلاصه", "هوش مصنوعی"],
        action: async () => {
          setIsCommandPaletteOpen(false);
          showToast(isRTL ? "در حال تولید خلاصه یادداشت‌ها..." : "Generating missing summaries...", "info");
          await generateMissingNoteSummaries();
        },
      },
    ],
    [t, isRTL, setIsCommandPaletteOpen, setIsQuickCaptureOpen, setIsAIAssistantOpen, setIsWebClipperOpen, syncData, showToast, generateMissingNoteSummaries]
  );

  // 3. Settings Definitions
  const settingsDefinitions = useMemo(
    () => [
      {
        id: "set-theme",
        title:
          theme === "dark"
            ? isRTL
              ? "تغییر به حالت روشن (Light Mode)"
              : "Switch to Light Mode"
            : isRTL
            ? "تغییر به حالت تاریک (Dark Mode)"
            : "Switch to Dark Mode",
        subtitle: isRTL ? "تنظیم ظاهر بصری سیستم" : "Toggle dark / light appearance theme",
        icon: theme === "dark" ? Sun : Moon,
        badge: "Theme",
        keywords: ["theme", "dark", "light", "mode", "تم", "تاریک", "روشن"],
        action: () => {
          toggleTheme();
          setIsCommandPaletteOpen(false);
        },
      },
      {
        id: "set-lang",
        title: language === "fa" ? "Switch language to English" : "تغییر زبان به فارسی",
        subtitle: isRTL ? "تغییر زبان رابط کاربری به انگلیسی" : "Switch interface language to Persian",
        icon: Languages,
        badge: "Language",
        keywords: ["lang", "language", "persian", "english", "farsi", "زبان", "فارسی", "انگلیسی"],
        action: () => {
          toggleLanguage();
          setIsCommandPaletteOpen(false);
        },
      },
      {
        id: "set-shortcuts",
        title: isRTL ? "راهنمای کلیدهای میانبر کیبورد" : "Keyboard Shortcuts & Guide",
        subtitle: isRTL ? "مشاهده تمام کلیدهای میانبر کاربردی" : "View all available global hotkeys",
        icon: Keyboard,
        badge: "Hotkeys",
        keywords: ["shortcut", "keyboard", "help", "guide", "hotkey", "کلید", "میانبر", "راهنما"],
        action: () => {
          setIsCommandPaletteOpen(false);
          setIsShortcutsModalOpen(true);
        },
      },
      {
        id: "set-clear-searches",
        title: isRTL ? "پاک‌سازی تاریخچه جستجوها" : "Clear Search History",
        subtitle: isRTL ? "حذف تمام عبارت‌های جستجوی اخیر" : "Remove all saved recent search terms",
        icon: RotateCcw,
        badge: "History",
        keywords: ["clear", "history", "recent", "search", "پاک", "تاریخچه", "جستجو"],
        action: () => {
          clearRecentSearches();
          showToast(isRTL ? "تاریخچه جستجو پاک شد" : "Search history cleared", "info");
        },
      },
      {
        id: "set-reset-db",
        title: isRTL ? "بازنشانی پایگاه داده به حالت اولیه" : "Reset Database to Defaults",
        subtitle: isRTL ? "بازیابی اطلاعات نمونه و پاک‌سازی داده‌های محلی" : "Restore initial sample data and reset storage",
        icon: RotateCcw,
        badge: "Reset",
        keywords: ["reset", "restore", "defaults", "database", "ریست", "بازنشانی", "پیشفرض"],
        action: () => {
          Alert.alert(
            isRTL ? "بازنشانی داده‌ها" : "Reset Database",
            t.common.resetConfirm,
            [
              { text: t.common.cancel, style: "cancel" },
              {
                text: isRTL ? "بازنشانی" : "Reset",
                style: "destructive",
                onPress: () => {
                  setIsCommandPaletteOpen(false);
                  resetToDefaults();
                },
              },
            ]
          );
        },
      },
    ],
    [theme, isRTL, language, toggleTheme, toggleLanguage, setIsCommandPaletteOpen, setIsShortcutsModalOpen, showToast, resetToDefaults, t.common.resetConfirm, t.common.cancel]
  );

  // Grouped results computation (Context Sections)
  const contextSections: ContextSection[] = useMemo(() => {
    const sections: ContextSection[] = [];

    // Filter Navigation
    const matchingNav = viewDefinitions
      .filter((v) => {
        if (!q) return true;
        return (
          v.title.toLowerCase().includes(q) ||
          v.subtitle.toLowerCase().includes(q) ||
          v.keywords.some((k) => k.toLowerCase().includes(q))
        );
      })
      .map((v) => ({
        id: `nav-${v.id}`,
        title: v.title,
        subtitle: v.subtitle,
        icon: v.icon,
        badge: isRTL ? "نما" : "View",
        action: () => {
          handleSelectResult(() => {
            setActiveView(v.id);
            setIsCommandPaletteOpen(false);
          });
        },
      }));

    // Filter Actions
    const matchingActions = actionDefinitions
      .filter((a) => {
        if (!q) return true;
        return (
          a.title.toLowerCase().includes(q) ||
          a.subtitle.toLowerCase().includes(q) ||
          a.keywords.some((k) => k.toLowerCase().includes(q))
        );
      })
      .map((a) => ({
        id: a.id,
        title: a.title,
        subtitle: a.subtitle,
        icon: a.icon,
        badge: a.badge,
        action: () => {
          handleSelectResult(a.action);
        },
      }));

    // Filter Settings
    const matchingSettings = settingsDefinitions
      .filter((s) => {
        if (!q) return true;
        return (
          s.title.toLowerCase().includes(q) ||
          s.subtitle.toLowerCase().includes(q) ||
          s.keywords.some((k) => k.toLowerCase().includes(q))
        );
      })
      .map((s) => ({
        id: s.id,
        title: s.title,
        subtitle: s.subtitle,
        icon: s.icon,
        badge: s.badge,
        action: () => {
          handleSelectResult(s.action);
        },
      }));

    // When query is entered, include content searches:
    let matchingNotes: CommandPaletteItem[] = [];
    let matchingTasks: CommandPaletteItem[] = [];
    let matchingProjects: CommandPaletteItem[] = [];
    let matchingGoals: CommandPaletteItem[] = [];
    let matchingResources: CommandPaletteItem[] = [];
    let matchingContacts: CommandPaletteItem[] = [];

    if (q) {
      // Notes
      matchingNotes = notes
        .filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q) ||
            n.tags.some((tagItem) => tagItem.toLowerCase().includes(q))
        )
        .slice(0, 5)
        .map((note) => ({
          id: `note-${note.id}`,
          title: note.title,
          subtitle: note.tags[0] ? `#${note.tags[0]}` : undefined,
          snippet: getSnippetWithMatch(note.content, query),
          icon: FileText,
          tag: note.tags[0],
          badge: isRTL ? "یادداشت" : "Note",
          action: () => {
            handleSelectResult(() => {
              setSelectedNoteId(note.id);
              setActiveView("notes");
              setIsCommandPaletteOpen(false);
            });
          },
        }));

      // Tasks
      matchingTasks = tasks
        .filter((taskItem) => taskItem.name.toLowerCase().includes(q))
        .slice(0, 4)
        .map((taskItem) => ({
          id: `task-${taskItem.id}`,
          title: taskItem.name,
          subtitle: taskItem.priority,
          icon: CheckSquare,
          completed: taskItem.isCompleted,
          badge: taskItem.priority,
          action: () => {
            handleSelectResult(() => {
              setActiveView("tasks");
              setIsCommandPaletteOpen(false);
            });
          },
        }));

      // Projects
      matchingProjects = projects
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            (p.description && p.description.toLowerCase().includes(q))
        )
        .slice(0, 4)
        .map((proj) => ({
          id: `proj-${proj.id}`,
          title: proj.name,
          subtitle: proj.description || undefined,
          icon: FolderKanban,
          badge: `${proj.progress}%`,
          action: () => {
            handleSelectResult(() => {
              setActiveView("projects");
              setIsCommandPaletteOpen(false);
            });
          },
        }));

      // Goals
      matchingGoals = goals
        .filter(
          (g) =>
            g.name.toLowerCase().includes(q) ||
            (g.description && g.description.toLowerCase().includes(q))
        )
        .slice(0, 4)
        .map((goal) => ({
          id: `goal-${goal.id}`,
          title: goal.name,
          subtitle: goal.description || undefined,
          icon: Target,
          badge: `${goal.progress}%`,
          action: () => {
            handleSelectResult(() => {
              setActiveView("goals");
              setIsCommandPaletteOpen(false);
            });
          },
        }));

      // Resources
      matchingResources = (resources || [])
        .filter(
          (r) =>
            (r.title && r.title.toLowerCase().includes(q)) ||
            (r.name && r.name.toLowerCase().includes(q)) ||
            (r.description && r.description.toLowerCase().includes(q)) ||
            (r.notes && r.notes.toLowerCase().includes(q)) ||
            (r.url && r.url.toLowerCase().includes(q)) ||
            (r.tags && r.tags.some((tagItem) => tagItem.toLowerCase().includes(q)))
        )
        .slice(0, 4)
        .map((res) => {
          const resText = res.description || res.notes || "";
          return {
            id: `res-${res.id}`,
            title: res.title || res.name || "",
            subtitle: res.url || res.type,
            snippet: resText ? getSnippetWithMatch(resText, query) : null,
            icon: BookOpen,
            badge: res.type,
            action: () => {
              handleSelectResult(() => {
                setActiveView("resources");
                setIsCommandPaletteOpen(false);
              });
            },
          };
        });

      // Contacts
      matchingContacts = contacts
        .filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            (c.role && c.role.toLowerCase().includes(q)) ||
            (c.notes && c.notes.toLowerCase().includes(q))
        )
        .slice(0, 3)
        .map((c) => ({
          id: `contact-${c.id}`,
          title: c.name,
          subtitle: c.role || c.phone || undefined,
          icon: Users,
          badge: c.level,
          action: () => {
            handleSelectResult(() => {
              setActiveView("contacts");
              setIsCommandPaletteOpen(false);
            });
          },
        }));
    }

    // Build hierarchical sections
    if (matchingActions.length > 0) {
      sections.push({
        id: "actions",
        title: t.modals.commandPalette.actionsSection || (isRTL ? "اقدامات و ابزارها" : "Actions"),
        icon: Zap,
        items: matchingActions,
      });
    }

    if (matchingNav.length > 0) {
      sections.push({
        id: "navigation",
        title: t.modals.commandPalette.navigationSection || (isRTL ? "ناوبری و نماها" : "Navigation"),
        icon: Compass,
        items: matchingNav,
      });
    }

    if (matchingSettings.length > 0) {
      sections.push({
        id: "settings",
        title: t.modals.commandPalette.settingsSection || (isRTL ? "تنظیمات و سامانه" : "Settings"),
        icon: Sliders,
        items: matchingSettings,
      });
    }

    if (matchingNotes.length > 0) {
      sections.push({
        id: "notes",
        title: t.modals.commandPalette.notesSection,
        icon: FileText,
        items: matchingNotes,
      });
    }

    if (matchingTasks.length > 0) {
      sections.push({
        id: "tasks",
        title: t.modals.commandPalette.tasksSection,
        icon: CheckSquare,
        items: matchingTasks,
      });
    }

    if (matchingProjects.length > 0) {
      sections.push({
        id: "projects",
        title: t.modals.commandPalette.projectsSection,
        icon: FolderKanban,
        items: matchingProjects,
      });
    }

    if (matchingGoals.length > 0) {
      sections.push({
        id: "goals",
        title: t.modals.commandPalette.goalsSection,
        icon: Target,
        items: matchingGoals,
      });
    }

    if (matchingResources.length > 0) {
      sections.push({
        id: "resources",
        title: t.modals.commandPalette.resourcesSection || (isRTL ? "منابع و مراجع" : "Resources"),
        icon: BookOpen,
        items: matchingResources,
      });
    }

    if (matchingContacts.length > 0) {
      sections.push({
        id: "contacts",
        title: t.modals.commandPalette.contactsSection,
        icon: Users,
        items: matchingContacts,
      });
    }

    return sections;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    q,
    query,
    viewDefinitions,
    actionDefinitions,
    settingsDefinitions,
    notes,
    tasks,
    projects,
    goals,
    resources,
    contacts,
    t,
    isRTL,
    setActiveView,
    setIsCommandPaletteOpen,
    setSelectedNoteId,
  ]);

  // Flattened items (used for "Enter" on hardware keyboards)
  const flatItems = useMemo(() => {
    return contextSections.flatMap((s) => s.items);
  }, [contextSections]);

  // Flattened rows for the FlatList (section headers + items)
  const listData = useMemo<PaletteRow[]>(() => {
    const rows: PaletteRow[] = [];
    contextSections.forEach((section) => {
      rows.push({ kind: "header", section });
      section.items.forEach((item) => {
        rows.push({ kind: "item", item });
      });
    });
    return rows;
  }, [contextSections]);

  const rowDir = { flexDirection: isRTL ? ("row-reverse" as const) : ("row" as const) };

  const renderRecentSearches = () => (
    <View
      style={{
        borderWidth: 1,
        borderColor: P.border,
        backgroundColor: P.surfaceAlt,
        borderRadius: 16,
        padding: 12,
      }}
    >
      <View style={[rowDir, { alignItems: "center", justifyContent: "space-between", marginBottom: 8 }]}>
        <View style={[rowDir, { alignItems: "center", gap: 6 }]}>
          <History size={14} color={P.blueSoft} />
          <TBold style={{ fontSize: 12, color: P.textMid }}>
            {t.modals.commandPalette.recentSearches || (isRTL ? "جستجوهای اخیر" : "Recent Searches")}
          </TBold>
        </View>
        <Pressable
          onPress={clearRecentSearches}
          hitSlop={8}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <T style={{ fontSize: 11, color: P.textSubtle }}>
            {t.modals.commandPalette.clearAll || (isRTL ? "پاک کردن همه" : "Clear all")}
          </T>
        </Pressable>
      </View>

      <View style={[{ flexWrap: "wrap" }, rowDir, { gap: 6 }]}>
        {recentSearches.map((term) => (
          <View
            key={term}
            style={[
              rowDir,
              {
                alignItems: "center",
                gap: 6,
                borderRadius: 12,
                backgroundColor: P.inner,
                borderWidth: 1,
                borderColor: P.border,
                paddingHorizontal: 10,
                paddingVertical: 5,
              },
            ]}
          >
            <Pressable
              onPress={() => setQuery(term)}
              hitSlop={4}
              style={[rowDir, { alignItems: "center", gap: 6 }]}
            >
              <Clock size={12} color={P.textSubtle} />
              <T numberOfLines={1} style={{ fontSize: 12, color: P.textMid, maxWidth: 180 }}>
                {term}
              </T>
            </Pressable>
            <Pressable
              onPress={() => removeRecentSearch(term)}
              hitSlop={6}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, borderRadius: 4, padding: 2 }]}
            >
              <X size={12} color={P.textSubtle} />
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );

  const renderFrequentViews = () => {
    // grid grid-cols-2 → rows of two on mobile
    const gridRows: ViewStats[][] = [];
    for (let i = 0; i < frequentViews.length; i += 2) {
      gridRows.push(frequentViews.slice(i, i + 2));
    }
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: P.border,
          backgroundColor: P.surfaceAlt,
          borderRadius: 16,
          padding: 12,
        }}
      >
        <View style={[rowDir, { alignItems: "center", justifyContent: "space-between", marginBottom: 10 }]}>
          <View style={[rowDir, { alignItems: "center", gap: 6 }]}>
            <TrendingUp size={14} color={P.emerald} />
            <TBold style={{ fontSize: 12, color: P.textMid }}>
              {t.modals.commandPalette.frequentlyAccessed ||
                (isRTL ? "نماهای پربازدید و پرتکرار" : "Frequently Accessed Views")}
            </TBold>
          </View>
          <T style={{ fontSize: 10, color: P.textSubtle }}>
            {isRTL ? "پیش‌بینی هوشمند" : "Predictive shortcuts"}
          </T>
        </View>

        {gridRows.map((row, rowIdx) => (
          <View key={rowIdx} style={[rowDir, { gap: 8, marginBottom: rowIdx === gridRows.length - 1 ? 0 : 8 }]}>
            {row.map((stat) => {
              const def = viewDefinitions.find((v) => v.id === stat.id);
              if (!def) return null;
              const Icon = def.icon;
              return (
                <Pressable
                  key={stat.id}
                  onPress={() => {
                    handleSelectResult(() => {
                      setActiveView(stat.id);
                      setIsCommandPaletteOpen(false);
                    });
                  }}
                  style={({ pressed }) => [
                    rowDir,
                    {
                      alignItems: "center",
                      gap: 10,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: pressed ? "rgba(59,130,246,0.5)" : P.border,
                      backgroundColor: P.surface,
                      padding: 8,
                      flex: 1,
                    },
                  ]}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      backgroundColor: P.inner,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={16} color={P.blueSoft} />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <T numberOfLines={1} style={{ fontSize: 12, fontWeight: "600", color: P.text }}>
                      {def.title}
                    </T>
                    <T style={{ fontSize: 10, color: P.textSubtle, marginTop: 1 }}>
                      {stat.count} {isRTL ? "بازدید" : "visits"}
                    </T>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  const renderPredictiveHeader = () => {
    if (query) return null;
    return (
      <View style={{ gap: 12, paddingBottom: 2 }}>
        {/* 1. Time-Context Smart Suggestion Pill */}
        <View
          style={{
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "rgba(59,130,246,0.2)",
            backgroundColor: P.deepBlueBg,
            paddingHorizontal: 14,
            paddingVertical: 10,
            gap: 8,
          }}
        >
          <View style={[rowDir, { alignItems: "center", gap: 10 }]}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: P.blueBgSoft,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={16} color={P.blueSoft} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={[rowDir, { alignItems: "center", gap: 8, flexWrap: "wrap" }]}>
                <View
                  style={{
                    borderRadius: 6,
                    backgroundColor: P.blueBg,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                  }}
                >
                  <T style={{ fontSize: 10, fontWeight: "700", color: P.blueLight }}>
                    {timePrediction.badgeText}
                  </T>
                </View>
                <T numberOfLines={1} style={{ fontSize: 11, color: P.textMuted }}>
                  {t.modals.commandPalette.suggestedForYou || (isRTL ? "پیشنهاد هوشمند برای الان" : "Suggested for you")}
                </T>
              </View>
              <T numberOfLines={2} style={{ fontSize: 12, color: P.textMid, marginTop: 2 }}>
                {timePrediction.reason}
              </T>
            </View>
          </View>

          <Btn
            title={t.common.open}
            size="sm"
            variant="primary"
            icon={<ArrowIcon size={14} color="#ffffff" />}
            onPress={() => {
              handleSelectResult(() => {
                setActiveView(timePrediction.suggestedView);
                setIsCommandPaletteOpen(false);
              });
            }}
            style={{ alignSelf: "flex-end" }}
          />
        </View>

        {/* 2. Recent Searches Predictive Tags */}
        {recentSearches.length > 0 && renderRecentSearches()}

        {/* 3. Frequently Accessed Views (Predictive Feature) */}
        {frequentViews.length > 0 && renderFrequentViews()}
      </View>
    );
  };

  const renderItem = ({ item: row }: { item: PaletteRow }) => {
    if (row.kind === "header") {
      const SectionIcon = row.section.icon;
      return (
        <View
          style={[
            rowDir,
            {
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: "rgba(38,38,38,0.8)",
              paddingHorizontal: 12,
              paddingVertical: 6,
              marginTop: 14,
            },
          ]}
        >
          <View style={[rowDir, { alignItems: "center", gap: 8 }]}>
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 6,
                backgroundColor: P.blueBgSoft,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SectionIcon size={14} color={P.blueSoft} />
            </View>
            <TBold style={{ fontSize: 12, color: P.textMid }}>{row.section.title}</TBold>
          </View>
          <View
            style={{
              borderRadius: 999,
              backgroundColor: P.inner,
              paddingHorizontal: 8,
              paddingVertical: 2,
            }}
          >
            <T style={{ fontSize: 10, color: P.textMuted }}>{row.section.items.length}</T>
          </View>
        </View>
      );
    }

    const paletteItem = row.item;
    const ItemIcon = paletteItem.icon;
    return (
      <Pressable
        onPress={paletteItem.action}
        style={({ pressed }) => [
          {
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingVertical: 8,
            marginTop: 4,
            backgroundColor: pressed ? P.inner : "transparent",
            borderWidth: 1,
            borderColor: pressed ? "rgba(59,130,246,0.3)" : "transparent",
          },
        ]}
      >
        <View style={[rowDir, { alignItems: "center", justifyContent: "space-between" }]}>
          <View style={[rowDir, { alignItems: "center", gap: 10, flex: 1, minWidth: 0 }]}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: P.inner,
                alignItems: "center",
                justifyContent: "center",
                opacity: paletteItem.completed ? 0.6 : 1,
              }}
            >
              <ItemIcon size={14} color={P.blueSoft} />
            </View>

            <View style={{ flex: 1, minWidth: 0 }}>
              <HighlightMatch
                text={paletteItem.title}
                query={query}
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: paletteItem.completed ? P.textSubtle : P.text,
                  textDecorationLine: paletteItem.completed ? "line-through" : "none",
                }}
              />
              {paletteItem.subtitle ? (
                <T numberOfLines={1} style={{ fontSize: 11, color: P.textSubtle, marginTop: 1 }}>
                  {paletteItem.subtitle}
                </T>
              ) : null}
            </View>
          </View>

          {paletteItem.badge !== undefined && paletteItem.badge !== null && paletteItem.badge !== "" ? (
            <View
              style={[
                {
                  borderRadius: 999,
                  backgroundColor: P.inner,
                  borderWidth: 1,
                  borderColor: P.borderSoft,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                },
                isRTL ? { marginRight: 8 } : { marginLeft: 8 },
              ]}
            >
              <T numberOfLines={1} style={{ fontSize: 10, color: P.textMuted, textTransform: "uppercase" }}>
                {String(paletteItem.badge)}
              </T>
            </View>
          ) : null}
        </View>

        {/* Snippet highlighting match location in note or resource text */}
        {paletteItem.snippet ? (
          <View style={isRTL ? { marginRight: 38 } : { marginLeft: 38 }}>
            <HighlightMatch
              text={paletteItem.snippet}
              query={query}
              style={{ fontSize: 11, color: P.textMuted, marginTop: 3 }}
            />
          </View>
        ) : null}
      </Pressable>
    );
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <ModalShell
      visible={isCommandPaletteOpen}
      onClose={() => setIsCommandPaletteOpen(false)}
      maxWidth={672}
    >
      <View style={{ width: "100%", height: "82%", maxHeight: 640, backgroundColor: P.surface }}>
        {/* Search Input Bar */}
        <View
          style={[
            rowDir,
            {
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: P.border,
              paddingHorizontal: 16,
              backgroundColor: P.surface,
            },
          ]}
        >
          <Search size={20} color={P.blueSoft} />
          <Input
            placeholder={t.modals.commandPalette.searchPlaceholder}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={() => {
              if (flatItems.length > 0) {
                flatItems[0].action();
              } else if (query.trim()) {
                addRecentSearch(query);
              }
            }}
            style={{ flex: 1, fontSize: 14, paddingHorizontal: 10, paddingVertical: 14, color: P.text }}
            placeholderTextColor={P.textSubtle}
          />
          {query ? (
            <Pressable
              onPress={() => setQuery("")}
              hitSlop={8}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, padding: 4, marginRight: 6 }]}
            >
              <X size={14} color={P.textSubtle} />
            </Pressable>
          ) : null}
          <Pressable
            onPress={() => setIsCommandPaletteOpen(false)}
            hitSlop={8}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, borderRadius: 12, padding: 6 }]}
          >
            <X size={16} color={P.textMuted} />
          </Pressable>
        </View>

        {/* Scrollable Results */}
        <FlatList
          data={listData}
          keyExtractor={(row) =>
            row.kind === "header" ? `hdr-${row.section.id}` : row.item.id
          }
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          ListHeaderComponent={renderPredictiveHeader}
          ListEmptyComponent={
            query && flatItems.length === 0 ? (
              <View style={{ paddingVertical: 48, alignItems: "center" }}>
                <Search size={32} color={P.textSubtle} style={{ opacity: 0.4, marginBottom: 8 }} />
                <TBold style={{ fontSize: 12, color: P.textMid, textAlign: "center" }}>
                  {t.modals.commandPalette.noResults}
                </TBold>
                <T style={{ fontSize: 11, color: P.textSubtle, marginTop: 4, textAlign: "center" }}>
                  {isRTL
                    ? `عبارت «${query}» در دسته‌بندی‌ها یافت نشد`
                    : `No matches for "${query}"`}
                </T>
                <Pressable
                  onPress={() => {
                    setIsCommandPaletteOpen(false);
                    setIsQuickCaptureOpen(true);
                  }}
                  style={({ pressed }) => [
                    rowDir,
                    {
                      alignItems: "center",
                      gap: 6,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: "rgba(59,130,246,0.2)",
                      backgroundColor: P.blueBgSoft,
                      paddingHorizontal: 14,
                      paddingVertical: 7,
                      marginTop: 14,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Plus size={14} color={P.blueSoft} />
                  <T style={{ fontSize: 12, fontWeight: "600", color: P.blueSoft }}>
                    {t.common.quickCapture}
                  </T>
                </Pressable>
              </View>
            ) : null
          }
          contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 12, paddingBottom: 16 }}
          extraData={[query, recentSearches, frequentViews, isRTL]}
        />

        {/* Footer Bar */}
        <View
          style={[
            rowDir,
            {
              alignItems: "center",
              justifyContent: "space-between",
              borderTopWidth: 1,
              borderTopColor: P.border,
              backgroundColor: P.surfaceAlt,
              paddingHorizontal: 16,
              paddingVertical: 10,
            },
          ]}
        >
          <View style={[rowDir, { alignItems: "center", gap: 10 }]}>
            <ArrowIcon size={13} color={P.textSubtle} />
            <T style={{ fontSize: 11, color: P.textMuted }}>
              {isRTL ? "برای اجرا، نتیجه را لمس کنید" : "Tap a result to run it"}
            </T>
          </View>

          <T style={{ fontSize: 11, color: P.textSubtle }}>Spotlight · Context Intelligence</T>
        </View>
      </View>
    </ModalShell>
  );
};
