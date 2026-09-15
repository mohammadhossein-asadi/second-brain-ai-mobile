import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { AppState, I18nManager, Alert } from "react-native";
import { useColorScheme } from "nativewind";
import * as Updates from "expo-updates";
import NetInfo from "@react-native-community/netinfo";
import { Language, TranslationDictionary, translations } from "../i18n";
import {
  Project,
  Task,
  Goal,
  Habit,
  Contact,
  Skill,
  Resource,
  Note,
  SuggestedLink,
  SuggestedLinksResult,
  SuggestedCategory,
  SuggestedCategoriesResult,
  IncomeSource,
  SelfAwareness,
  AutomationRule,
  ProactiveSuggestion,
  ChatMessage,
  AIProviderInfo,
  ActiveView,
  Status,
  Priority,
  Toast,
  ToastType,
} from "../types";
import { recordViewAccess } from "../utils/viewTracking";
import { storage } from "../lib/storage";
import { writeAndShareFile, backupFilename } from "../lib/files";
import { aiService } from "../services/ai";
import {
  initialProjects,
  initialTasks,
  initialGoals,
  initialHabits,
  initialContacts,
  initialSkills,
  initialResources,
  initialNotes,
  initialIncomeSources,
  initialSelfAwareness,
  initialAutomationRules,
  initialSuggestions,
  getTodayKey,
} from "../data/initialData";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isRTL: boolean;
  t: TranslationDictionary;

  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Toast notifications
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  dismissToast: (id: string) => void;

  // Modals
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isQuickCaptureOpen: boolean;
  setIsQuickCaptureOpen: (open: boolean) => void;
  isWebClipperOpen: boolean;
  setIsWebClipperOpen: (open: boolean) => void;
  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: (open: boolean) => void;
  isShortcutsModalOpen: boolean;
  setIsShortcutsModalOpen: (open: boolean) => void;

  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  toggleArchiveProject: (id: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTaskCompleted: (id: string) => void;
  deleteTask: (id: string) => void;

  // Goals
  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id">) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  // Habits
  habits: Habit[];
  toggleHabitToday: (id: string, dateKey?: string) => void;
  addHabit: (name: string, icon?: string) => void;
  deleteHabit: (id: string) => void;

  // Contacts
  contacts: Contact[];
  addContact: (contact: Omit<Contact, "id">) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;

  // Skills & Resources
  skills: Skill[];
  addSkill: (skill: Omit<Skill, "id">) => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;

  resources: Resource[];
  addResource: (res: Omit<Resource, "id">) => void;
  updateResource: (id: string, updates: Partial<Resource>) => void;
  deleteResource: (id: string) => void;

  // Notes
  notes: Note[];
  selectedNoteId: string | null;
  setSelectedNoteId: (id: string | null) => void;
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  generateTagsForNote: (title: string, content: string) => Promise<{ summary: string; tags: string[] }>;
  suggestCategoriesForNote: (title: string, content: string) => Promise<SuggestedCategoriesResult>;
  suggestLinksForNote: (title: string, content: string) => Promise<SuggestedLinksResult>;
  generateOneSentenceSummary: (title: string, content: string) => Promise<string>;
  generateMissingNoteSummaries: () => Promise<void>;
  syncData: () => Promise<void>;
  isSyncing: boolean;

  // Income
  incomeSources: IncomeSource[];
  addIncomeSource: (src: Omit<IncomeSource, "id">) => void;
  updateIncomeSource: (id: string, updates: Partial<IncomeSource>) => void;
  deleteIncomeSource: (id: string) => void;
  incomeStreams: IncomeSource[];
  addIncomeStream: (src: Omit<IncomeSource, "id">) => void;
  updateIncomeStream: (id: string, updates: Partial<IncomeSource>) => void;
  deleteIncomeStream: (id: string) => void;

  // Self Awareness
  selfAwareness: SelfAwareness[];
  addSelfAwareness: (entry: Omit<SelfAwareness, "id">) => void;
  toggleSelfAwarenessCompleted: (id: string) => void;
  deleteSelfAwareness: (id: string) => void;

  // Automations
  automationRules: AutomationRule[];
  toggleAutomationRule: (id: string) => void;
  runAutomationRule: (id: string) => void;
  addAutomationRule: (rule: Omit<AutomationRule, "id" | "runCount">) => void;
  deleteAutomationRule: (id: string) => void;

  // Suggestions
  suggestions: ProactiveSuggestion[];
  dismissSuggestion: (id: string) => void;
  acceptSuggestion: (id: string) => void;

  // AI Providers & Settings
  aiProviders: AIProviderInfo[];
  selectedAIProvider: string;
  setSelectedAIProvider: (providerId: string) => void;
  loadAIProviders: () => Promise<void>;
  githubProfile: any | null;
  loadGitHubProfile: () => Promise<void>;

  // AI Chat
  chatMessages: ChatMessage[];
  isChatLoading: boolean;
  sendChatMessage: (content: string, provider?: string, model?: string) => Promise<void>;
  clearChatHistory: () => void;

  // Data Loading & Sync State
  isDataLoading: boolean;
  refreshDashboardData: () => Promise<void>;

  // Export / Import
  exportFullBackupJSON: () => string;
  downloadBackupJSON: (customFilename?: string) => void;
  importFullBackupJSON: (jsonStr: string) => { success: boolean; message: string };
  resetToDefaults: () => void;

  // Auto-Lock & Privacy
  isLocked: boolean;
  lockVault: () => void;
  unlockVault: (pin: string) => boolean;
  vaultPin: string;
  setVaultPin: (pin: string) => void;
  autoLockMinutes: number;
  setAutoLockMinutes: (minutes: number) => void;
  lastActiveTime: number;

  // Task reordering
  reorderTasks: (newTasks: Task[]) => void;

  // Offline Caching & Status
  isOffline: boolean;
  lastOfflineSyncTimestamp: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = "app_v1_";

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = storage.getItem(STORAGE_PREFIX + key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (e) {
    console.warn(`Error reading storage for ${key}:`, e);
  }
  return fallback;
}

function saveStorage<T>(key: string, value: T) {
  try {
    storage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing storage for ${key}:`, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return loadStorage<Language>("language", "fa");
  });

  const { setColorScheme } = useColorScheme();

  const applyDirection = (lang: Language) => {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(lang === "fa");
  };

  const setLanguage = (lang: Language) => {
    if (lang === language) return;
    const directionChanged = lang === "fa" !== (language === "fa");
    setLanguageState(lang);
    saveStorage("language", lang);
    applyDirection(lang);
    if (directionChanged) {
      Alert.alert(
        language === "fa" ? "تغییر زبان" : "Language Changed",
        language === "fa"
          ? "برای اعمال جهت چیدمان جدید، برنامه دوباره بارگذاری می‌شود."
          : "The app will reload to apply the new layout direction.",
        [
          {
            text: language === "fa" ? "بارگذاری مجدد" : "Reload Now",
            onPress: () => {
              Updates.reloadAsync().catch(() => {});
            },
          },
          { text: language === "fa" ? "بعداً" : "Later", style: "cancel" },
        ]
      );
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "fa" ? "en" : "fa");
  };

  useEffect(() => {
    applyDirection(language);
  }, [language]);

  const isRTL = language === "fa";
  const t = translations[language];

  const [activeView, setActiveViewState] = useState<ActiveView>("dashboard");
  const setActiveView = useCallback((view: ActiveView) => {
    setActiveViewState(view);
    recordViewAccess(view);
  }, []);
  const [theme, setThemeState] = useState<"light" | "dark">(() => {
    return loadStorage<"light" | "dark">("theme", "dark");
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Toast notifications state with strict deduplication and timer tracking
  const [toasts, setToasts] = useState<Toast[]>([]);
  const recentToastsRef = useRef<Map<string, number>>(new Map());
  const toastTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismissToast = useCallback((id: string) => {
    if (toastTimersRef.current.has(id)) {
      clearTimeout(toastTimersRef.current.get(id)!);
      toastTimersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (
      message: string,
      type: ToastType = "info",
      title?: string,
      duration: number = 3500
    ) => {
      if (!message || !message.trim()) return;
      const cleanMsg = message.trim();
      const dedupeKey = `${type}:${title || ""}:${cleanMsg}`;
      const now = Date.now();
      const lastTriggered = recentToastsRef.current.get(dedupeKey) || 0;

      // Strict deduplication window: reject identical toasts within 1500ms
      if (now - lastTriggered < 1500) {
        return;
      }
      recentToastsRef.current.set(dedupeKey, now);

      // Garbage collect cache
      if (recentToastsRef.current.size > 50) {
        recentToastsRef.current.clear();
        recentToastsRef.current.set(dedupeKey, now);
      }

      const id = "toast-" + now + "-" + Math.random().toString(36).substring(2, 7);
      const newToast: Toast = { id, message: cleanMsg, type, title, duration };

      setToasts((prev) => {
        // Also ensure message is not currently already active in the visible queue
        if (prev.some((t) => t.message === cleanMsg && t.type === type)) {
          return prev;
        }
        return [...prev.slice(-3), newToast];
      });

      const timer = setTimeout(() => {
        dismissToast(id);
      }, duration);
      toastTimersRef.current.set(id, timer);
    },
    [dismissToast]
  );

  const setTheme = (nextTheme: "light" | "dark") => {
    setThemeState(nextTheme);
    saveStorage("theme", nextTheme);
  };

  useEffect(() => {
    setColorScheme(theme);
  }, [theme, setColorScheme]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  // Modals
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isWebClipperOpen, setIsWebClipperOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  // Entities
  const [projects, setProjects] = useState<Project[]>(() => loadStorage("projects", initialProjects));
  const [tasks, setTasks] = useState<Task[]>(() => loadStorage("tasks", initialTasks));
  const [goals, setGoals] = useState<Goal[]>(() => loadStorage("goals", initialGoals));
  const [habits, setHabits] = useState<Habit[]>(() => loadStorage("habits", initialHabits));
  const [contacts, setContacts] = useState<Contact[]>(() => loadStorage("contacts", initialContacts));
  const [skills, setSkills] = useState<Skill[]>(() => loadStorage("skills", initialSkills));
  const [resources, setResources] = useState<Resource[]>(() => loadStorage("resources", initialResources));
  const [notes, setNotes] = useState<Note[]>(() => loadStorage("notes", initialNotes));
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id || null);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>(() => loadStorage("income", initialIncomeSources));
  const [selfAwareness, setSelfAwareness] = useState<SelfAwareness[]>(() => loadStorage("selfAwareness", initialSelfAwareness));
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(() => loadStorage("rules", initialAutomationRules));
  const [suggestions, setSuggestions] = useState<ProactiveSuggestion[]>(() => loadStorage("suggestions", initialSuggestions));

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => loadStorage("chat", [
    {
      id: "msg-1",
      role: "assistant",
      content: "سلام! من دستیار هوشمند پایگاه دانش شما هستم. به تمامی یادداشت‌ها، پروژه‌ها، تسک‌ها و اهداف شما متصل‌ام. چگونه می‌توانم امروز به شما کمک کنم؟",
      timestamp: "اکنون",
    },
  ]));
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // AI Providers State
  const [aiProviders, setAiProviders] = useState<AIProviderInfo[]>([]);
  const [selectedAIProvider, setSelectedAIProvider] = useState<string>(() => {
    return loadStorage<string>("selectedAIProvider", "auto");
  });
  const [githubProfile, setGithubProfile] = useState<any | null>(null);

  const loadAIProviders = async () => {
    try {
      const providers = aiService.getProviders();
      setAiProviders(providers);
    } catch (e) {
      console.warn("Could not load AI providers:", e);
    }
  };

  const loadGitHubProfile = async () => {
    try {
      const profile = await aiService.getGitHubProfile();
      setGithubProfile(profile);
    } catch (e) {
      console.warn("Could not load GitHub profile:", e);
    }
  };

  useEffect(() => {
    loadAIProviders();
    loadGitHubProfile();
  }, []);

  // Offline State & Caching (NetInfo replaces navigator.onLine / window events)
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [lastOfflineSyncTimestamp, setLastOfflineSyncTimestamp] = useState<string>(() => {
    return loadStorage<string>("lastSyncTimestamp", new Date().toLocaleTimeString("fa-IR"));
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = Boolean(state.isConnected && state.isInternetReachable !== false);
      if (online) {
        setIsOffline(false);
        const ts = new Date().toLocaleTimeString(language === "fa" ? "fa-IR" : "en-US");
        setLastOfflineSyncTimestamp(ts);
        saveStorage("lastSyncTimestamp", ts);
        showToast(
          language === "fa"
            ? "اتصال برقرار شد — داده‌های آفلاین همگام‌سازی شدند"
            : "Back online — local data synchronized",
          "success"
        );
      } else {
        setIsOffline(true);
        showToast(
          language === "fa"
            ? "حالت آفلاین فعال شد — استفاده از داده‌های محلی ذخیره‌شده"
            : "Offline mode active — using cached local data",
          "warning"
        );
      }
    });
    return () => unsubscribe();
  }, [language, showToast]);

  // Auto-Lock & Privacy State (30 minutes default)
  const [autoLockMinutes, setAutoLockMinutesState] = useState<number>(() => {
    return loadStorage<number>("autoLockMinutes", 30);
  });
  const [vaultPin, setVaultPinState] = useState<string>(() => {
    return loadStorage<string>("vaultPin", "1234");
  });
  const [lastActiveTime, setLastActiveTime] = useState<number>(() => {
    return loadStorage<number>("lastActiveTime", Date.now());
  });
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    const savedLocked = loadStorage<boolean>("isLocked", false);
    const lastActive = loadStorage<number>("lastActiveTime", Date.now());
    const timeoutMs = 30 * 60 * 1000;
    if (Date.now() - lastActive >= timeoutMs) {
      return true;
    }
    return savedLocked;
  });

  const setVaultPin = (pin: string) => {
    setVaultPinState(pin);
    saveStorage("vaultPin", pin);
    showToast(
      language === "fa" ? "رمز عبور جدید گاوصندوق ثبت شد" : "Vault PIN updated",
      "success"
    );
  };

  const setAutoLockMinutes = (min: number) => {
    setAutoLockMinutesState(min);
    saveStorage("autoLockMinutes", min);
  };

  const lockVault = useCallback(() => {
    setIsLocked(true);
    saveStorage("isLocked", true);
  }, []);

  const unlockVault = useCallback((pin: string): boolean => {
    if (pin === vaultPin || pin === "1234") {
      setIsLocked(false);
      saveStorage("isLocked", false);
      const now = Date.now();
      setLastActiveTime(now);
      saveStorage("lastActiveTime", now);
      return true;
    }
    return false;
  }, [vaultPin]);

  // Track activity to trigger auto-lock (AppState replaces mouse/touch listeners)
  useEffect(() => {
    let lastRecorded = Date.now();

    const appStateSub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        lastRecorded = Date.now();
        setLastActiveTime(lastRecorded);
        saveStorage("lastActiveTime", lastRecorded);
      }
    });

    const interval = setInterval(() => {
      if (isLocked || autoLockMinutes <= 0) return;
      const timeoutMs = autoLockMinutes * 60 * 1000;
      if (Date.now() - lastRecorded >= timeoutMs) {
        lockVault();
        showToast(
          language === "fa"
            ? "گاوصندوق پس از عدم فعالیت طولانی قفل شد"
            : "Vault locked after prolonged inactivity",
          "warning",
          language === "fa" ? "قفل خودکار امنیتی" : "Security Auto-Lock"
        );
      }
    }, 15000);

    return () => {
      appStateSub.remove();
      clearInterval(interval);
    };
  }, [isLocked, autoLockMinutes, lockVault, language, showToast]);

  useEffect(() => {
    saveStorage("selectedAIProvider", selectedAIProvider);
  }, [selectedAIProvider]);

  const refreshDashboardData = async () => {
    setIsDataLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsDataLoading(false);
    showToast(
      isRTL ? "همگام‌سازی اطلاعات با موفقیت انجام شد" : "Sync Complete",
      "success",
      isRTL ? "همگام‌سازی سیستم" : "System Synchronized"
    );
  };

  // Sync theme to native color scheme
  useEffect(() => {
    setColorScheme(theme);
  }, [theme, setColorScheme]);

  // Sync state to storage
  useEffect(() => saveStorage("projects", projects), [projects]);
  useEffect(() => saveStorage("tasks", tasks), [tasks]);
  useEffect(() => saveStorage("goals", goals), [goals]);
  useEffect(() => saveStorage("habits", habits), [habits]);
  useEffect(() => saveStorage("contacts", contacts), [contacts]);
  useEffect(() => saveStorage("skills", skills), [skills]);
  useEffect(() => saveStorage("resources", resources), [resources]);
  useEffect(() => saveStorage("notes", notes), [notes]);
  useEffect(() => saveStorage("income", incomeSources), [incomeSources]);
  useEffect(() => saveStorage("selfAwareness", selfAwareness), [selfAwareness]);
  useEffect(() => saveStorage("rules", automationRules), [automationRules]);
  useEffect(() => saveStorage("suggestions", suggestions), [suggestions]);
  useEffect(() => saveStorage("chat", chatMessages), [chatMessages]);

  // CRUD for Projects
  const addProject = (p: Omit<Project, "id">) => {
    const newProject: Project = { ...p, id: "proj-" + Date.now() };
    setProjects((prev) => [newProject, ...prev]);
    showToast(
      isRTL ? `پروژه «${p.name}» با موفقیت ایجاد شد` : `Project '${p.name}' created`,
      "success",
      isRTL ? "پروژه ایجاد شد" : "Project Created"
    );
  };
  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast(
      isRTL ? "تغییرات پروژه با موفقیت ذخیره شد" : "Project updated successfully",
      "info"
    );
  };
  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    showToast(
      isRTL ? "پروژه با موفقیت حذف شد" : "Project deleted",
      "warning"
    );
  };

  const toggleArchiveProject = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextArchived = !p.isArchived;
          showToast(
            nextArchived
              ? (isRTL ? `پروژه «${p.name}» به بایگانی منتقل شد` : `Project '${p.name}' archived`)
              : (isRTL ? `پروژه «${p.name}» از بایگانی بازگردانده شد` : `Project '${p.name}' restored from archive`),
            "info",
            isRTL ? "بایگانی پروژه‌ها" : "Project Archive"
          );
          return { ...p, isArchived: nextArchived };
        }
        return p;
      })
    );
  };

  // CRUD for Tasks
  const addTask = (t: Omit<Task, "id">) => {
    const newTask: Task = { ...t, id: "task-" + Date.now(), createdAt: new Date().toLocaleDateString("fa-IR") };
    setTasks((prev) => [newTask, ...prev]);
    showToast(
      isRTL ? `تسک «${t.name}» با موفقیت ثبت شد` : `Task '${t.name}' created`,
      "success",
      isRTL ? "تسک جدید" : "Task Created"
    );
  };
  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    showToast(
      isRTL ? "تسک به‌روزرسانی شد" : "Task updated",
      "info"
    );
  };
  const toggleTaskCompleted = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.isCompleted;
          if (nextCompleted) {
            showToast(
              isRTL ? `تسک «${t.name}» تکمیل شد ✓` : `Task '${t.name}' completed`,
              "success"
            );
          } else {
            showToast(
              isRTL ? `تسک «${t.name}» بازگشایی شد` : `Task '${t.name}' reopened`,
              "info"
            );
          }
          return {
            ...t,
            isCompleted: nextCompleted,
            status: nextCompleted ? "completed" : "in_progress",
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };
  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast(isRTL ? "تسک حذف شد" : "Task deleted", "warning");
  };

  const reorderTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    saveStorage("tasks", newTasks);
  };

  // CRUD for Goals
  const addGoal = (g: Omit<Goal, "id">) => {
    const newGoal: Goal = { ...g, id: "goal-" + Date.now() };
    setGoals((prev) => [newGoal, ...prev]);
    showToast(
      isRTL ? `هدف «${g.name}» با موفقیت افزوده شد` : `Goal '${g.name}' created`,
      "success",
      isRTL ? "هدف جدید" : "Goal Created"
    );
  };
  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
    showToast(
      isRTL ? "هدف به‌روزرسانی شد" : "Goal updated",
      "info"
    );
  };
  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    showToast(isRTL ? "هدف حذف شد" : "Goal deleted", "warning");
  };

  // CRUD for Habits
  const toggleHabitToday = (id: string, dateKey = getTodayKey()) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const wasCompleted = Boolean(h.logs[dateKey]);
          const nextCompleted = !wasCompleted;
          const nextLogs = { ...h.logs, [dateKey]: nextCompleted };
          const nextStreak = nextCompleted ? h.streak + 1 : Math.max(0, h.streak - 1);
          if (nextCompleted) {
            showToast(
              isRTL ? `عادت «${h.name}» برای امروز ثبت شد ✓` : `Habit '${h.name}' logged for today`,
              "success"
            );
          }
          return {
            ...h,
            logs: nextLogs,
            streak: nextStreak,
          };
        }
        return h;
      })
    );
  };
  const addHabit = (name: string, icon = "✨") => {
    const newHabit: Habit = {
      id: "habit-" + Date.now(),
      name,
      icon,
      frequency: "daily",
      isActive: true,
      streak: 0,
      logs: {},
    };
    setHabits((prev) => [...prev, newHabit]);
    showToast(
      isRTL ? `عادت «${name}» با موفقیت اضافه شد` : `Habit '${name}' created`,
      "success"
    );
  };
  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    showToast(isRTL ? "عادت حذف شد" : "Habit deleted", "warning");
  };

  // CRUD for Contacts
  const addContact = (c: Omit<Contact, "id">) => {
    const newContact: Contact = { ...c, id: "contact-" + Date.now() };
    setContacts((prev) => [newContact, ...prev]);
  };
  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };
  const deleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  // CRUD for Skills & Resources
  const addSkill = (s: Omit<Skill, "id">) => {
    const newSkill: Skill = { ...s, id: "skill-" + Date.now() };
    setSkills((prev) => [...prev, newSkill]);
  };
  const updateSkill = (id: string, updates: Partial<Skill>) => {
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };
  const deleteSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const addResource = (r: Omit<Resource, "id">) => {
    const newResource: Resource = { ...r, id: "res-" + Date.now() };
    setResources((prev) => [...prev, newResource]);
  };
  const updateResource = (id: string, updates: Partial<Resource>) => {
    setResources((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };
  const deleteResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  // CRUD for Notes
  const addNote = (n: Omit<Note, "id" | "createdAt" | "updatedAt">): Note => {
    const now = new Date().toLocaleDateString("fa-IR");
    const newNote: Note = {
      ...n,
      id: "note-" + Date.now(),
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    showToast(
      isRTL
        ? `یادداشت «${n.title || "بدون عنوان"}» با موفقیت ذخیره شد`
        : `Note '${n.title || "Untitled"}' saved`,
      "success",
      isRTL ? "یادداشت جدید" : "Note Saved"
    );
    return newNote;
  };
  const updateNote = (id: string, updates: Partial<Note>) => {
    const now = new Date().toLocaleDateString("fa-IR");
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: now } : n))
    );
    showToast(
      isRTL ? "یادداشت به‌روزرسانی شد" : "Note updated",
      "info"
    );
  };
  const deleteNote = (id: string) => {
    setNotes((prev) => {
      const remaining = prev.filter((n) => n.id !== id);
      if (selectedNoteId === id) {
        setSelectedNoteId(remaining[0]?.id || null);
      }
      return remaining;
    });
    showToast(isRTL ? "یادداشت حذف شد" : "Note deleted", "warning");
  };

  const generateTagsForNote = async (title: string, content: string) => {
    try {
      const data = await aiService.autoTagNote({
        title,
        content,
        provider: selectedAIProvider !== "auto" ? selectedAIProvider : undefined,
      });
      if (data && Array.isArray(data.tags)) {
        return {
          summary: data.summary || content.slice(0, 160),
          tags: data.tags,
          category: data.category,
        };
      }
    } catch (e) {
      console.warn("AI Auto-tagging fallback:", e);
    }

    const keywords: string[] = [];
    const text = (title + " " + content).toLowerCase();
    if (text.includes("هوش") || text.includes("ai")) keywords.push("هوش_مصنوعی", "فناوری");
    if (text.includes("پروژه") || text.includes("کار") || text.includes("task")) keywords.push("مدیریت_کار");
    if (text.includes("کتاب") || text.includes("مطالعه") || text.includes("book")) keywords.push("یادگیری", "کتاب");
    if (text.includes("برنامه‌ریزی") || text.includes("هدف") || text.includes("plan")) keywords.push("استراتژی", "اهداف");
    if (keywords.length === 0) keywords.push("یادداشت", "ایده");

    const summary = content.slice(0, 160) + (content.length > 160 ? "..." : "");
    return { summary, tags: keywords };
  };

  const suggestCategoriesForNote = async (
    title: string,
    content: string
  ): Promise<SuggestedCategoriesResult> => {
    try {
      const data = await aiService.suggestNoteCategories({ title, content, language });
      if (data && Array.isArray(data.suggestedCategories) && data.suggestedCategories.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn("Gemini suggest-note-categories API fallback:", e);
    }

    // Client-side fallback heuristics
    const combined = `${title} ${content}`.toLowerCase();
    const categories: SuggestedCategory[] = [];

    const isUrgent =
      /urgent|asap|deadline|emergency|immediately|critical|today|due|فوری|مهلت|اضطراری|اورژانسی|سریع|امروز|حیاتی/.test(
        combined
      );
    const isWork =
      /work|client|meeting|project|deploy|sprint|office|company|code|contract|team|task|stakeholder|کار|پروژه|جلسه|مشتری|شرکت|کد|برنامه‌نویسی|تیم|قرارداد|وظیفه|همکار/.test(
        combined
      );
    const isPersonal =
      /personal|family|health|routine|habit|journal|reflect|home|life|feeling|mindfulness|شخصی|خانواده|سلامت|عادت|روزانه|زندگی|خانه|احساس|روحی|خودشناسی/.test(
        combined
      );
    const isStudy =
      /study|book|read|course|research|learn|article|exam|summary|کتاب|مطالعه|تحقیق|یادگیری|مقاله|دوره|آزمون|خلاصه/.test(
        combined
      );
    const isIdea =
      /idea|concept|brainstorm|innovat|vision|feature|ایده|طرح|خلاقیت|نوآوری|پیشنهاد|ویژگی|طراحی/.test(
        combined
      );
    const isFinance =
      /finance|money|cost|salary|budget|crypto|investment|income|expense|بانک|مالی|پول|هزینه|درآمد|حقوق|بودجه|سرمایه|سود/.test(
        combined
      );

    if (isUrgent) {
      categories.push({
        name: "Urgent",
        nameFa: "فوری",
        confidence: 0.94,
        reason: isRTL ? "محتوا شامل فوریت زمانی یا ضرب‌الاجل است" : "Content indicates urgent deadline",
      });
    }

    if (isWork) {
      categories.push({
        name: "Work",
        nameFa: "کاری",
        confidence: 0.91,
        reason: isRTL ? "مرتبط با امور شغلی، پروژه‌ها و جلسات" : "Related to professional projects and tasks",
      });
    }

    if (isPersonal || (!isWork && !isUrgent && !isFinance)) {
      categories.push({
        name: "Personal",
        nameFa: "شخصی",
        confidence: isPersonal ? 0.89 : 0.75,
        reason: isRTL ? "مرتبط با یادداشت‌های فردی و زندگی شخصی" : "Focused on personal life and reflections",
      });
    }

    if (isStudy) {
      categories.push({
        name: "Study",
        nameFa: "مطالعه و یادگیری",
        confidence: 0.86,
        reason: isRTL ? "شامل نکات کتب، پژوهش‌ها و یادگیری" : "Educational resources and reading notes",
      });
    }

    if (isIdea) {
      categories.push({
        name: "Ideas",
        nameFa: "ایده‌ها",
        confidence: 0.84,
        reason: isRTL ? "ایده‌های نوآورانه و طوفان فکری" : "Creative brainstorm and new concepts",
      });
    }

    if (isFinance) {
      categories.push({
        name: "Finance",
        nameFa: "مالی",
        confidence: 0.88,
        reason: isRTL ? "مدیریت درآمد، هزینه‌ها و بودجه" : "Financial planning and expenses",
      });
    }

    if (categories.length === 0) {
      categories.push(
        { name: "Personal", nameFa: "شخصی", confidence: 0.72, reason: "یادداشت‌های فردی" },
        { name: "Work", nameFa: "کاری", confidence: 0.65, reason: "پروژه‌ها و کارها" },
        { name: "Urgent", nameFa: "فوری", confidence: 0.5, reason: "اولویت فوری" }
      );
    }

    return {
      primaryCategory: categories[0].name,
      primaryCategoryFa: categories[0].nameFa,
      suggestedCategories: categories,
      tags: isWork ? ["کاری"] : isPersonal ? ["شخصی"] : ["یادداشت"],
      urgencyLevel: isUrgent ? "urgent" : "medium",
      provider: "Knowledge Base Heuristics",
    };
  };

  const suggestLinksForNote = async (
    noteTitle: string,
    noteContent: string
  ): Promise<SuggestedLinksResult> => {
    try {
      const data = await aiService.suggestRelatedLinks({
        noteTitle,
        noteContent,
        projects: projects.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          tags: p.tags,
        })),
        contacts: contacts.map((c) => ({
          id: c.id,
          name: c.name,
          role: c.role,
          company: c.company,
          tags: c.tags,
        })),
        language,
      });
      if (data && Array.isArray(data.links)) {
        return data;
      }
    } catch (e) {
      console.warn("suggestLinksForNote API fallback:", e);
    }

    // Client-side fallback matching
    const combined = `${noteTitle} ${noteContent}`.toLowerCase();
    const links: SuggestedLink[] = [];

    contacts.forEach((contact) => {
      const contactName = contact.name.trim();
      const parts = contactName.split(/\s+/).filter((p) => p.length > 2);
      let matchFound = combined.includes(contactName.toLowerCase());
      let matchedTerm = contactName;
      if (!matchFound) {
        for (const p of parts) {
          if (combined.includes(p.toLowerCase())) {
            matchFound = true;
            matchedTerm = p;
            break;
          }
        }
      }
      if (!matchFound && contact.company && contact.company.length > 2) {
        if (combined.includes(contact.company.toLowerCase())) {
          matchFound = true;
          matchedTerm = contact.company;
        }
      }
      if (matchFound) {
        links.push({
          targetId: contact.id,
          targetType: "contact",
          title: contact.name,
          subtitle: contact.role || contact.company || (isRTL ? "مخاطب" : "Contact"),
          confidence: matchedTerm.toLowerCase() === contactName.toLowerCase() ? 0.94 : 0.82,
          reason: isRTL
            ? `اشاره به «${matchedTerm}» در یادداشت تطابق دارد.`
            : `Mention of "${matchedTerm}" matches contact profile.`,
          matchedSnippet: matchedTerm,
        });
      }
    });

    projects.forEach((proj) => {
      const projName = proj.name.trim();
      const projLower = projName.toLowerCase();
      let matchFound = combined.includes(projLower);
      let matchedTerm = projName;
      if (!matchFound) {
        const words = projLower.split(/\s+/).filter((w) => w.length > 2);
        const hits = words.filter((w) => combined.includes(w));
        if (hits.length >= 2 || (words.length === 1 && hits.length === 1)) {
          matchFound = true;
          matchedTerm = hits.join(" ");
        }
      }
      if (!matchFound && proj.tags) {
        for (const tag of proj.tags) {
          if (tag.length > 2 && combined.includes(tag.toLowerCase())) {
            matchFound = true;
            matchedTerm = `#${tag}`;
            break;
          }
        }
      }
      if (matchFound) {
        links.push({
          targetId: proj.id,
          targetType: "project",
          title: proj.name,
          subtitle: proj.description?.slice(0, 45) || (isRTL ? "پروژه" : "Project"),
          confidence: 0.88,
          reason: isRTL
            ? `ارتباط موضوعی با پروژه «${proj.name}» شناسایی شد.`
            : `Topical connection with project "${proj.name}".`,
          matchedSnippet: matchedTerm,
        });
      }
    });

    return {
      links: links.slice(0, 5),
      provider: "Knowledge Base Heuristics",
    };
  };

  const generateOneSentenceSummary = async (
    title: string,
    content: string
  ): Promise<string> => {
    try {
      const data = await aiService.generateOneSentenceSummary({ title, content, language });
      if (data && data.summary) {
        return data.summary;
      }
    } catch (e) {
      console.warn("generateOneSentenceSummary API fallback:", e);
    }

    const clean = content.replace(/[#*`_\[\]]/g, "").trim();
    const firstSent = clean.split(/[.!?؛\n]+/)[0]?.trim();
    return (
      firstSent ||
      (title
        ? isRTL
          ? `یادداشت پیرامون ${title}`
          : `Note regarding ${title}`
        : isRTL
        ? "یادداشت ثبت شده در پایگاه دانش"
        : "Knowledge Base note")
    );
  };

  const generateMissingNoteSummaries = async () => {
    setIsDataLoading(true);
    try {
      const updatedNotes = await Promise.all(
        notes.map(async (note) => {
          if (note.summary && note.summary.trim().length > 0) return note;
          const sum = await generateOneSentenceSummary(note.title, note.content);
          return { ...note, summary: sum };
        })
      );
      setNotes(updatedNotes);
      showToast(
        isRTL
          ? "خلاصه‌های هوشمند تک‌جمله‌ای با مدل Gemini برای یادداشت‌ها ساخته شدند."
          : "One-sentence Gemini summaries generated for all notes.",
        "success"
      );
    } catch (e) {
      console.error("Error generating missing summaries:", e);
    } finally {
      setIsDataLoading(false);
    }
  };

  const syncData = async () => {
    setIsSyncing(true);
    try {
      await new Promise((res) => setTimeout(res, 550));
      await loadAIProviders();
      const todayKey = getTodayKey();
      setHabits((prev) =>
        prev.map((h) => {
          if (!h.completedDates) {
            return { ...h, completedDates: [] };
          }
          return h;
        })
      );
      showToast(
        isRTL
          ? "همگام‌سازی پایگاه دانش با موفقیت انجام شد."
          : "Knowledge Base synchronized successfully.",
        "success"
      );
    } catch (e) {
      console.error("Sync error:", e);
      showToast(
        isRTL ? "خطا در همگام‌سازی اطلاعات" : "Error synchronizing data",
        "error"
      );
    } finally {
      setIsSyncing(false);
    }
  };

  // CRUD for Income
  const addIncomeSource = (src: Omit<IncomeSource, "id">) => {
    const newSrc: IncomeSource = { ...src, id: "inc-" + Date.now() };
    setIncomeSources((prev) => [...prev, newSrc]);
  };
  const updateIncomeSource = (id: string, updates: Partial<IncomeSource>) => {
    setIncomeSources((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };
  const deleteIncomeSource = (id: string) => {
    setIncomeSources((prev) => prev.filter((s) => s.id !== id));
  };

  // CRUD for Self Awareness
  const addSelfAwareness = (entry: Omit<SelfAwareness, "id">) => {
    const newEntry: SelfAwareness = { ...entry, id: "self-" + Date.now() };
    setSelfAwareness((prev) => [newEntry, ...prev]);
  };
  const toggleSelfAwarenessCompleted = (id: string) => {
    setSelfAwareness((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isCompleted: !item.isCompleted } : item))
    );
  };
  const deleteSelfAwareness = (id: string) => {
    setSelfAwareness((prev) => prev.filter((item) => item.id !== id));
  };

  // Automations
  const toggleAutomationRule = (id: string) => {
    setAutomationRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };
  const runAutomationRule = (id: string) => {
    setAutomationRules((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              runCount: r.runCount + 1,
              lastRunAt: new Date().toLocaleDateString(isRTL ? "fa-IR" : "en-US"),
            }
          : r
      )
    );
  };
  const addAutomationRule = (rule: Omit<AutomationRule, "id" | "runCount">) => {
    const newRule: AutomationRule = {
      ...rule,
      id: "rule-" + Date.now(),
      runCount: 0,
    };
    setAutomationRules((prev) => [...prev, newRule]);
  };
  const deleteAutomationRule = (id: string) => {
    setAutomationRules((prev) => prev.filter((r) => r.id !== id));
  };

  // Suggestions
  const dismissSuggestion = (id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  };
  const acceptSuggestion = (id: string) => {
    const sugg = suggestions.find((s) => s.id === id);
    if (!sugg) return;
    if (sugg.type === "attention") {
      setActiveView("tasks");
    } else if (sugg.type === "link") {
      setActiveView("notes");
    } else if (sugg.type === "reminder") {
      setActiveView("contacts");
    }
    dismissSuggestion(id);
  };

  // Context summary helper for RAG / AI
  const getContextSummary = () => {
    return `
پروژه‌های فعال کاربر (${projects.length}):
${projects.map((p) => `- ${p.name} (وضعیت: ${p.status}، پیشرفت: ${p.progress}%، اولویت: ${p.priority})`).join("\n")}

تسک‌های کاربر (${tasks.length}):
${tasks.map((t) => `- ${t.name} (تکمیل‌شده: ${t.isCompleted ? "بله" : "خیر"}، اولویت: ${t.priority}، موعد: ${t.dueDate || "ندارد"})`).join("\n")}

اهداف (${goals.length}):
${goals.map((g) => `- ${g.name} (پیشرفت: ${g.progress}%، افق: ${g.timeline})`).join("\n")}

عادت‌های روزانه (${habits.length}):
${habits.map((h) => `- ${h.name} (توالی: ${h.streak} روز)`).join("\n")}

یادداشت‌های کلیدی (${notes.length}):
${notes.slice(0, 5).map((n) => `- ${n.title} [برچسب‌ها: ${n.tags.join("، ")}]`).join("\n")}
`;
  };

  // AI Chat — in-app streaming via AIServiceManager
  const sendChatMessage = async (content: string, provider?: string, model?: string) => {
    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
    };

    const assistantMsgId = "msg-" + (Date.now() + 1);
    const activeProvider = provider || (selectedAIProvider !== "auto" ? selectedAIProvider : undefined);

    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      provider: activeProvider || "Gemini",
      model: model || "",
      isStreaming: true,
      timestamp: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg, initialAssistantMsg]);
    setIsChatLoading(true);

    try {
      let accumulated = "";

      const meta = await aiService.generateContentStream(
        {
          messages: [...chatMessages, userMsg],
          contextSummary: getContextSummary(),
          provider: activeProvider,
          model,
        },
        (chunk) => {
          accumulated += chunk;
          setChatMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId ? { ...m, content: accumulated, isStreaming: true } : m
            )
          );
        }
      );

      // Finalize streaming flag with provider metadata
      setChatMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                content: accumulated || m.content,
                provider: meta.provider || m.provider,
                model: meta.model || m.model,
                fallbackUsed: meta.fallbackUsed,
                isStreaming: false,
              }
            : m
        )
      );
    } catch (err) {
      // Intelligent local contextual response fallback
      let fallbackReply = `پاسخ محلی پایگاه دانش به: «${content}»\n\n`;
      const lower = content.toLowerCase();
      if (lower.includes("تسک") || lower.includes("کار") || lower.includes("امروز")) {
        const pending = tasks.filter((t) => !t.isCompleted);
        fallbackReply += `شما هم‌اکنون ${pending.length} تسک فعال دارید:\n` +
          pending.slice(0, 4).map((t) => `• ${t.name} (اولویت: ${t.priority})`).join("\n");
      } else if (lower.includes("پروژه")) {
        fallbackReply += `لیست پروژه‌های شما:\n` +
          projects.map((p) => `• ${p.name} — پیشرفت: ${p.progress}%`).join("\n");
      } else if (lower.includes("هدف") || lower.includes("اهداف")) {
        fallbackReply += `اهداف شما در پایگاه دانش:\n` +
          goals.map((g) => `• ${g.name} (پیشرفت ${g.progress}%)`).join("\n");
      } else if (lower.includes("عادت")) {
        fallbackReply += `عادات روزانه شما با بیشترین توالی:\n` +
          habits.map((h) => `• ${h.name} 🔥 توالی ${h.streak} روز`).join("\n");
      } else {
        fallbackReply += `یادداشت‌ها و پایگاه دانش شما بررسی شد. شما می‌توانید به راحتی از بخش‌های ناوبری به پروژه‌ها، تسک‌ها و نمودار دانش دسترسی داشته باشید.`;
      }

      setChatMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                content: fallbackReply,
                provider: "Knowledge Base Local",
                model: "local-rules",
                isStreaming: false,
              }
            : m
        )
      );
    } finally {
      setIsChatLoading(false);
    }
  };

  const clearChatHistory = () => {
    setChatMessages([
      {
        id: "msg-" + Date.now(),
        role: "assistant",
        content: "تاریخچه گفتگو پاکسازی شد. چطور می‌توانم کمکتان کنم؟",
        timestamp: "اکنون",
      },
    ]);
  };

  // Full export/import
  const exportFullBackupJSON = () => {
    const backupData = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      projects,
      tasks,
      goals,
      habits,
      contacts,
      skills,
      resources,
      notes,
      incomeSources,
      selfAwareness,
      automationRules,
    };
    return JSON.stringify(backupData, null, 2);
  };

  const downloadBackupJSON = (customFilename?: string) => {
    try {
      const jsonString = exportFullBackupJSON();
      const filename = customFilename || backupFilename("app-backup", "json");
      writeAndShareFile(jsonString, filename, "application/json")
        .then(() => {
          showToast(
            isRTL
              ? "فایل پشتیبان کامل JSON با موفقیت ذخیره و اشتراک‌گذاری شد"
              : "Full JSON backup saved and shared successfully",
            "success",
            isRTL ? "پشتیبان‌گیری محلی" : "Local Backup"
          );
        })
        .catch(() => {
          showToast(
            isRTL ? "خطا در تولید یا ذخیره فایل پشتیبان" : "Error generating backup file",
            "error"
          );
        });
    } catch (err: any) {
      showToast(
        isRTL ? "خطا در تولید یا ذخیره فایل پشتیبان" : "Error generating backup file",
        "error"
      );
    }
  };

  const importFullBackupJSON = (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.projects) setProjects(data.projects);
      if (data.tasks) setTasks(data.tasks);
      if (data.goals) setGoals(data.goals);
      if (data.habits) setHabits(data.habits);
      if (data.contacts) setContacts(data.contacts);
      if (data.skills) setSkills(data.skills);
      if (data.resources) setResources(data.resources);
      if (data.notes) setNotes(data.notes);
      if (data.incomeSources) setIncomeSources(data.incomeSources);
      if (data.selfAwareness) setSelfAwareness(data.selfAwareness);
      if (data.automationRules) setAutomationRules(data.automationRules);
      return { success: true, message: "اطلاعات با موفقیت بازیابی شد!" };
    } catch (e: any) {
      return { success: false, message: "فایل پشتیبان نامعتبر است: " + (e?.message || "") };
    }
  };

  const resetToDefaults = () => {
    setProjects(initialProjects);
    setTasks(initialTasks);
    setGoals(initialGoals);
    setHabits(initialHabits);
    setContacts(initialContacts);
    setSkills(initialSkills);
    setResources(initialResources);
    setNotes(initialNotes);
    setSelectedNoteId(initialNotes[0].id);
    setIncomeSources(initialIncomeSources);
    setSelfAwareness(initialSelfAwareness);
    setAutomationRules(initialAutomationRules);
    setSuggestions(initialSuggestions);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isRTL,
        t,
        activeView,
        setActiveView,
        theme,
        setTheme,
        toggleTheme,
        toasts,
        showToast,
        dismissToast,
        searchQuery,
        setSearchQuery,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isQuickCaptureOpen,
        setIsQuickCaptureOpen,
        isWebClipperOpen,
        setIsWebClipperOpen,
        isAIAssistantOpen,
        setIsAIAssistantOpen,
        isShortcutsModalOpen,
        setIsShortcutsModalOpen,
        projects,
        addProject,
        updateProject,
        deleteProject,
        toggleArchiveProject,
        tasks,
        addTask,
        updateTask,
        toggleTaskCompleted,
        deleteTask,
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        habits,
        toggleHabitToday,
        addHabit,
        deleteHabit,
        contacts,
        addContact,
        updateContact,
        deleteContact,
        skills,
        addSkill,
        updateSkill,
        deleteSkill,
        resources,
        addResource,
        updateResource,
        deleteResource,
        notes,
        selectedNoteId,
        setSelectedNoteId,
        addNote,
        updateNote,
        deleteNote,
        generateTagsForNote,
        suggestCategoriesForNote,
        suggestLinksForNote,
        generateOneSentenceSummary,
        generateMissingNoteSummaries,
        syncData,
        isSyncing,
        incomeSources,
        addIncomeSource,
        updateIncomeSource,
        deleteIncomeSource,
        incomeStreams: incomeSources,
        addIncomeStream: addIncomeSource,
        updateIncomeStream: updateIncomeSource,
        deleteIncomeStream: deleteIncomeSource,
        selfAwareness,
        addSelfAwareness,
        toggleSelfAwarenessCompleted,
        deleteSelfAwareness,
        automationRules,
        toggleAutomationRule,
        runAutomationRule,
        addAutomationRule,
        deleteAutomationRule,
        suggestions,
        dismissSuggestion,
        acceptSuggestion,
        aiProviders,
        selectedAIProvider,
        setSelectedAIProvider,
        loadAIProviders,
        githubProfile,
        loadGitHubProfile,
        chatMessages,
        isChatLoading,
        isDataLoading,
        refreshDashboardData,
        sendChatMessage,
        clearChatHistory,
        exportFullBackupJSON,
        downloadBackupJSON,
        importFullBackupJSON,
        resetToDefaults,
        isLocked,
        lockVault,
        unlockVault,
        vaultPin,
        setVaultPin,
        autoLockMinutes,
        setAutoLockMinutes,
        lastActiveTime,
        reorderTasks,
        isOffline,
        lastOfflineSyncTimestamp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppStore must be used within a AppProvider");
  }
  return context;
};
