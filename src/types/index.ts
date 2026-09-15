export type Priority = "critical" | "high" | "medium" | "low";
export type Status = "not_started" | "in_progress" | "completed";
export type GoalTimeline = "weekly" | "monthly" | "six_months" | "yearly";
export type GoalTimeframe = GoalTimeline;
export type ProjectCategory = "main" | "personal" | "self_dev" | "business" | "language";
export type ContactLevel = "good" | "pending" | "needs_start" | "connecting" | "needs_more" | 1 | 2 | 3;
export type FriendshipDuration = "old_friend" | "new_friend";
export type SkillType = "hard" | "soft";
export type ResourceType = "book" | "course" | "podcast" | "pdf" | "website";
export type IncomeType = "active" | "inactive" | "passive";
export type IncomeStatus = "excellent" | "good" | "average" | "active" | "potential" | "paused";
export type SelfAwarenessType = "documentary" | "article" | "book" | "video" | "reflection";
export type NoteType = "note" | "meeting" | "idea" | "journal" | "reference" | "bookmark" | "book_summary";

export interface Project {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  status: Status;
  progress: number; // 0 - 100
  category: ProjectCategory;
  startDate?: string;
  endDate?: string;
  icon?: string;
  color?: string;
  tags?: string[];
  tasksCount?: number;
  completedTasksCount?: number;
  isArchived?: boolean;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  isCompleted: boolean;
  status: Status;
  priority: Priority;
  dueDate?: string;
  estimatedTime?: number; // hours
  projectId?: string;
  goalId?: string;
  noteId?: string;
  createdAt?: string;
  completedAt?: string;
  reminderSet?: boolean;
  reminderTime?: string;
}

export interface Goal {
  id: string;
  name: string;
  description?: string;
  progress: number; // 0 - 100
  timeline: GoalTimeline;
  timeframe?: GoalTimeline;
  status: Status;
  isCompleted: boolean;
  icon?: string;
  color?: string;
  startDate?: string;
  endDate?: string;
  targetDate?: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  frequency: "daily" | "weekly";
  isActive: boolean;
  streak: number;
  logs: Record<string, boolean>; // date "YYYY-MM-DD" -> boolean
  completedDates?: string[];
}

export interface Contact {
  id: string;
  name: string;
  friendshipDuration?: FriendshipDuration;
  level: ContactLevel;
  role?: string;
  company?: string;
  phone?: string;
  email?: string;
  instagram?: string;
  telegramId?: string;
  telegram?: string;
  linkedin?: string;
  lastContacted?: string;
  nextFollowUp?: string;
  notes?: string;
  avatar?: string;
  tags?: string[];
}

export interface Skill {
  id: string;
  name: string;
  type: SkillType;
  level: number; // 1 - 10
  value?: number; // 1 - 10
  startDate?: string;
  status: Status | "learning" | "mastered";
  isCompleted?: boolean;
  description?: string;
}

export interface Resource {
  id: string;
  name?: string;
  title?: string;
  author?: string;
  type?: ResourceType;
  skillType?: SkillType;
  resourceType?: ResourceType;
  status: Status | "to_read" | "reading" | "finished";
  duration?: number; // hours
  date?: string;
  rating?: number;
  isCompleted?: boolean;
  skillId?: string;
  url?: string;
  notes?: string;
  description?: string;
  tags?: string[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  category?: string;
  isPinned: boolean;
  isArchived: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  summary?: string;
  linkedNoteIds?: string[];
  linkedProjectIds?: string[];
  linkedContactIds?: string[];
}

export interface SuggestedLink {
  targetId: string;
  targetType: "project" | "contact";
  title: string;
  subtitle?: string;
  confidence: number;
  reason: string;
  matchedSnippet?: string;
}

export interface SuggestedLinksResult {
  links: SuggestedLink[];
  provider?: string;
  model?: string;
}

export interface SuggestedCategory {
  name: string;
  nameFa: string;
  confidence?: number;
  reason?: string;
}

export interface SuggestedCategoriesResult {
  primaryCategory: string;
  primaryCategoryFa?: string;
  suggestedCategories: SuggestedCategory[];
  tags?: string[];
  urgencyLevel?: "low" | "medium" | "high" | "urgent";
  provider?: string;
  model?: string;
}

export interface IncomeSource {
  id: string;
  name?: string;
  source?: string;
  type: IncomeType;
  status: IncomeStatus;
  amount: number;
  currency: string;
  frequency: "monthly" | "yearly" | "project" | "one_time" | "project_based";
  notes?: string;
}
export type IncomeStream = IncomeSource;

export interface SelfAwareness {
  id: string;
  name?: string;
  title?: string;
  isCompleted?: boolean;
  type: SelfAwarenessType;
  link?: string;
  topic?: string;
  date?: string;
  notes?: string;
  keyInsights?: string;
  impactRating?: number;
}
export type SelfAwarenessItem = SelfAwareness;

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  category: "productivity" | "ai" | "organization" | "health";
  triggerType: "on_create" | "on_update" | "on_schedule";
  isActive: boolean;
  runCount: number;
  lastRunAt?: string;
}

export interface ProactiveSuggestion {
  id: string;
  type: "link" | "tag" | "task" | "review" | "reminder" | "attention";
  title: string;
  description: string;
  confidence: number;
  actionText?: string;
  resolved?: boolean;
}

export interface AIProviderInfo {
  id: string;
  name: string;
  nameFa: string;
  type: "gemini" | "openai-compatible" | "github";
  baseURL?: string;
  defaultModel: string;
  models: string[];
  isConfigured: boolean;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  provider?: string;
  model?: string;
  fallbackUsed?: boolean;
  isStreaming?: boolean;
  sources?: Array<{
    type: string;
    title: string;
    id: string;
  }>;
}

export type ActiveView =
  | "dashboard"
  | "tasks"
  | "projects"
  | "goals"
  | "habits"
  | "contacts"
  | "skills"
  | "resources"
  | "notes"
  | "income"
  | "self-awareness"
  | "graph"
  | "automation"
  | "export";

export type ToastType = "success" | "info" | "warning" | "error";

export interface Toast {
  id: string;
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
}
