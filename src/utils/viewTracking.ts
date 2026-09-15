import { ActiveView } from "../types";
import { storage } from "../lib/storage";

export interface ViewStats {
  id: ActiveView;
  count: number;
  lastVisited: number;
}

const STORAGE_KEY = "app_view_frequencies";

const DEFAULT_FREQUENCIES: Record<string, { count: number; lastVisited: number }> = {
  notes: { count: 34, lastVisited: Date.now() - 1000 * 60 * 5 },
  tasks: { count: 29, lastVisited: Date.now() - 1000 * 60 * 15 },
  dashboard: { count: 25, lastVisited: Date.now() - 1000 * 60 * 10 },
  projects: { count: 18, lastVisited: Date.now() - 1000 * 60 * 60 },
  habits: { count: 16, lastVisited: Date.now() - 1000 * 60 * 30 },
  resources: { count: 14, lastVisited: Date.now() - 1000 * 60 * 120 },
  graph: { count: 11, lastVisited: Date.now() - 1000 * 60 * 180 },
  contacts: { count: 8, lastVisited: Date.now() - 1000 * 60 * 300 },
  goals: { count: 9, lastVisited: Date.now() - 1000 * 60 * 250 },
  automation: { count: 6, lastVisited: Date.now() - 1000 * 60 * 400 },
  skills: { count: 5, lastVisited: Date.now() - 1000 * 60 * 500 },
  income: { count: 4, lastVisited: Date.now() - 1000 * 60 * 600 },
  "self-awareness": { count: 7, lastVisited: Date.now() - 1000 * 60 * 350 },
  export: { count: 3, lastVisited: Date.now() - 1000 * 60 * 800 },
};

export function recordViewAccess(viewId: ActiveView): void {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    const map: Record<string, { count: number; lastVisited: number }> = raw
      ? JSON.parse(raw)
      : { ...DEFAULT_FREQUENCIES };

    if (!map[viewId]) {
      map[viewId] = { count: 1, lastVisited: Date.now() };
    } else {
      map[viewId] = {
        count: (map[viewId].count || 0) + 1,
        lastVisited: Date.now(),
      };
    }
    storage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (err) {
    console.error("Failed to record view access", err);
  }
}

export function getFrequentlyAccessedViews(limit = 6): ViewStats[] {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    const map: Record<string, { count: number; lastVisited: number }> = raw
      ? JSON.parse(raw)
      : { ...DEFAULT_FREQUENCIES };

    // Ensure all registered ActiveViews have at least default weight
    Object.keys(DEFAULT_FREQUENCIES).forEach((key) => {
      if (!map[key]) {
        map[key] = DEFAULT_FREQUENCIES[key];
      }
    });

    const now = Date.now();
    const stats = Object.entries(map).map(([id, val]) => {
      const hoursAgo = Math.max(0.1, (now - (val.lastVisited || 0)) / (1000 * 60 * 60));
      const recencyBoost = Math.max(0, 12 - Math.min(hoursAgo, 12));
      const score = (val.count || 0) * 1.5 + recencyBoost;
      return {
        id: id as ActiveView,
        count: val.count || 0,
        lastVisited: val.lastVisited || 0,
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ id, count, lastVisited }) => ({ id, count, lastVisited }));

    return stats;
  } catch {
    return [
      { id: "notes", count: 34, lastVisited: Date.now() },
      { id: "tasks", count: 29, lastVisited: Date.now() },
      { id: "dashboard", count: 25, lastVisited: Date.now() },
      { id: "projects", count: 18, lastVisited: Date.now() },
      { id: "habits", count: 16, lastVisited: Date.now() },
      { id: "resources", count: 14, lastVisited: Date.now() },
    ];
  }
}

export interface TimePrediction {
  suggestedView: ActiveView;
  badgeText: string;
  reason: string;
}

export function getSmartTimePrediction(isRTL: boolean): TimePrediction {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return {
      suggestedView: "tasks",
      badgeText: isRTL ? "پیشنهاد صبحگاهی" : "Morning Focus",
      reason: isRTL
        ? "بررسی و اولویت‌بندی صف وظایف و عادت‌های امروز"
        : "Review priority task queue and active habits",
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      suggestedView: "projects",
      badgeText: isRTL ? "تمرکز عمیق" : "Deep Work Sprint",
      reason: isRTL
        ? "پیشبرد مراحل کلیدی پروژه‌ها و یادداشت‌های مرتبط"
        : "Advance project milestones and active knowledge",
    };
  } else if (hour >= 17 && hour < 22) {
    return {
      suggestedView: "dashboard",
      badgeText: isRTL ? "مرور روزانه" : "Daily Review",
      reason: isRTL
        ? "بررسی شاخص‌های کلیدی عملکرد و اهداف محقق‌شده"
        : "Review key metrics, completed goals, and habits",
    };
  } else {
    return {
      suggestedView: "notes",
      badgeText: isRTL ? "تخلیه ذهن شبانه" : "Nightly Brain Dump",
      reason: isRTL
        ? "ثبت سریع افکار و ایده‌های خلاقانه برای فردا"
        : "Capture quick thoughts and ideas for tomorrow",
    };
  }
}
