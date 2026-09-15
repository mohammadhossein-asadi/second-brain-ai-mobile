import {
  Project,
  Task,
  Goal,
  Habit,
  Contact,
  Skill,
  Resource,
  Note,
  IncomeSource,
  SelfAwareness,
  AutomationRule,
  ProactiveSuggestion,
} from "../types";

export const initialProjects: Project[] = [
  {
    id: "proj-1",
    name: "راه‌اندازی استارتاپ اجوکیشن آنلاین",
    description: "ایجاد پلتفرم جامع آموزش مهارت‌های نسل جدید با مدل تعاملی",
    priority: "critical",
    status: "in_progress",
    progress: 55,
    category: "business",
    startDate: "۱۴۰۳/۰۸/۰۱",
    endDate: "۱۴۰۳/۱۱/۳۰",
    icon: "🚀",
    color: "#3b82f6",
  },
  {
    id: "proj-2",
    name: "تسلط بر زبان انگلیسی (C1 Mastery)",
    description: "رسیدن به تسلط کامل در مکالمه پیشرفته، پادکست‌ها و مقالات علمی",
    priority: "high",
    status: "in_progress",
    progress: 70,
    category: "language",
    startDate: "۱۴۰۳/۰۶/۱۵",
    endDate: "۱۴۰۴/۰۳/۱۵",
    icon: "🇬🇧",
    color: "#10b981",
  },
  {
    id: "proj-3",
    name: "توسعه فردی، رهبری و فن بیان",
    description: "مطالعه کتب استراتژی، شرکت در کارگاه‌های مذاکره و سخنرانی",
    priority: "medium",
    status: "in_progress",
    progress: 35,
    category: "self_dev",
    startDate: "۱۴۰۳/۰۷/۱۰",
    endDate: "۱۴۰۳/۱۲/۲۹",
    icon: "🎯",
    color: "#f59e0b",
  },
  {
    id: "proj-4",
    name: "سیستم مدیریت مالی و سرمایه‌گذاری شخصی",
    description: "تفکیک حساب‌ها، تنوع‌بخشی به سبد سهام و بهینه‌سازی جریان نقدینگی",
    priority: "low",
    status: "not_started",
    progress: 10,
    category: "personal",
    startDate: "۱۴۰۳/۱۰/۰۱",
    endDate: "۱۴۰۴/۰۱/۳۱",
    icon: "💎",
    color: "#8b5cf6",
  },
];

export const initialTasks: Task[] = [
  {
    id: "task-1",
    name: "طراحی نقشه معماری داده و دیاگرام دیتابیس",
    description: "بررسی تمام جداول نوتیون، ارزیابی ایندکس‌ها و نگاشت روابط",
    isCompleted: true,
    status: "completed",
    priority: "high",
    dueDate: "۱۴۰۳/۰۹/۱۵",
    estimatedTime: 4,
    projectId: "proj-1",
    goalId: "goal-3",
  },
  {
    id: "task-2",
    name: "تدوین بوم مدل کسب‌وکار (Business Canvas)",
    description: "شناسایی بخش‌های مشتریان، ارزش پیشنهادی و جریان‌های درآمدی",
    isCompleted: false,
    status: "in_progress",
    priority: "critical",
    dueDate: "۱۴۰۳/۰۹/۲۰",
    estimatedTime: 6,
    projectId: "proj-1",
    goalId: "goal-2",
  },
  {
    id: "task-3",
    name: "تمرین اسپیکینگ روزانه با هوش مصنوعی و ضبط صدا",
    description: "بحث در مورد ۳ موضوع روزمره به مدت ۲۰ دقیقه",
    isCompleted: false,
    status: "not_started",
    priority: "medium",
    dueDate: "۱۴۰۳/۰۹/۱۸",
    estimatedTime: 1,
    projectId: "proj-2",
    goalId: "goal-1",
  },
  {
    id: "task-4",
    name: "مطالعه فصل ۴ و ۵ کتاب عادت‌های اتمی",
    description: "خلاصه‌برداری از قوانین چهارگانه تغییر رفتار و نوشتن در یادداشت‌ها",
    isCompleted: true,
    status: "completed",
    priority: "low",
    dueDate: "۱۴۰۳/۰۹/۱۶",
    estimatedTime: 1.5,
    projectId: "proj-3",
    goalId: "goal-4",
  },
  {
    id: "task-5",
    name: "پیگیری تماس کاری با علی محمدی درباره زیرساخت",
    description: "بررسی نیازمندی‌های مقیاس‌پذیری سرور و برآورد هزینه ماهانه",
    isCompleted: false,
    status: "in_progress",
    priority: "high",
    dueDate: "۱۴۰۳/۰۹/۲۱",
    estimatedTime: 1,
    projectId: "proj-1",
  },
  {
    id: "task-6",
    name: "مرور هفتگی وضعیت اهداف و به‌روزرسانی شاخص‌ها",
    description: "تطبیق درصد پیشرفت اهداف شش‌ماهه و تخصیص وظایف هفته پیش‌رو",
    isCompleted: false,
    status: "not_started",
    priority: "medium",
    dueDate: "۱۴۰۳/۰۹/۲۳",
    estimatedTime: 2,
    goalId: "goal-3",
  },
  {
    id: "task-7",
    name: "تمرین یوگا و مدیتیشن ۲۰ دقیقه‌ای صبحگاهی",
    description: "تمرکز بر تنفس دیافراگمی و پاکسازی ذهن قبل از شروع روز کاری",
    isCompleted: true,
    status: "completed",
    priority: "medium",
    dueDate: "۱۴۰۳/۰۹/۱۷",
    estimatedTime: 0.5,
    goalId: "goal-5",
  },
  {
    id: "task-8",
    name: "بررسی گزارش ماهانه سود و زیان پورتفوی سرمایه‌گذاری",
    description: "محاسبه بازده واقعی با در نظر گرفتن تورم و ثبت در جدول درآمد",
    isCompleted: false,
    status: "not_started",
    priority: "low",
    dueDate: "۱۴۰۳/۰۹/۳۰",
    estimatedTime: 2,
    projectId: "proj-4",
  },
];

export const initialGoals: Goal[] = [
  {
    id: "goal-1",
    name: "تسلط کامل به زبان انگلیسی و اخذ نمره عالی",
    description: "مطالعه مستمر، شرکت در آزمون‌های آزمایشی و تسلط بر واژگان تخصصی",
    progress: 75,
    timeline: "yearly",
    status: "in_progress",
    isCompleted: false,
    icon: "🎓",
    color: "#3b82f6",
    startDate: "۱۴۰۳/۰۱/۱۵",
    endDate: "۱۴۰۳/۱۲/۲۹",
  },
  {
    id: "goal-2",
    name: "راه‌اندازی نسخه آزمایشی استارتاپ (MVP)",
    description: "توسعه محصول با ۱۰ کاربر اولیه و جمع‌آوری بازخورد معنادار",
    progress: 50,
    timeline: "six_months",
    status: "in_progress",
    isCompleted: false,
    icon: "💼",
    color: "#10b981",
    startDate: "۱۴۰۳/۰۷/۰۱",
    endDate: "۱۴۰۳/۱۲/۲۹",
  },
  {
    id: "goal-3",
    name: "ساماندهی دانش فردی و راه‌اندازی پایگاه دانش دیجیتال",
    description: "پایان دادن به شلختگی یادداشت‌ها و ایجاد ارتباط هوشمند بین اطلاعات",
    progress: 85,
    timeline: "monthly",
    status: "in_progress",
    isCompleted: false,
    icon: "🧠",
    color: "#8b5cf6",
    startDate: "۱۴۰۳/۰۹/۰۱",
    endDate: "۱۴۰۳/۰۹/۳۰",
  },
  {
    id: "goal-4",
    name: "مطالعه ۲۴ جلد کتاب در سال (۲ کتاب در ماه)",
    description: "کتب مدیریت، روانشناسی، جامعه‌شناسی و فناوری‌های نوین",
    progress: 60,
    timeline: "yearly",
    status: "in_progress",
    isCompleted: false,
    icon: "📚",
    color: "#f59e0b",
    startDate: "۱۴۰۳/۰۱/۰۱",
    endDate: "۱۴۰۳/۱۲/۲۹",
  },
  {
    id: "goal-5",
    name: "ورزش منظم و حفظ تندرستی (۵ روز در هفته)",
    description: "ترکیب تمرینات قدرتی و تمرینات هوازی روزانه",
    progress: 70,
    timeline: "weekly",
    status: "in_progress",
    isCompleted: false,
    icon: "💪",
    color: "#ef4444",
    startDate: "۱۴۰۳/۰۹/۰۱",
    endDate: "۱۴۰۳/۰۹/۰۷",
  },
];

// Helper to get today's date formatted as YYYY-MM-DD
export function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getDateOffsetKey(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export const initialHabits: Habit[] = [
  {
    id: "habit-1",
    name: "ژورنال‌نویسی روزانه",
    icon: "✍️",
    frequency: "daily",
    isActive: true,
    streak: 14,
    logs: {
      [getDateOffsetKey(0)]: true,
      [getDateOffsetKey(-1)]: true,
      [getDateOffsetKey(-2)]: true,
      [getDateOffsetKey(-3)]: true,
      [getDateOffsetKey(-4)]: true,
      [getDateOffsetKey(-5)]: true,
      [getDateOffsetKey(-6)]: true,
    },
  },
  {
    id: "habit-2",
    name: "ورزش و فعالیت بدنی",
    icon: "🏃‍♂️",
    frequency: "daily",
    isActive: true,
    streak: 6,
    logs: {
      [getDateOffsetKey(0)]: true,
      [getDateOffsetKey(-1)]: true,
      [getDateOffsetKey(-2)]: true,
      [getDateOffsetKey(-3)]: true,
      [getDateOffsetKey(-4)]: false,
      [getDateOffsetKey(-5)]: true,
      [getDateOffsetKey(-6)]: true,
    },
  },
  {
    id: "habit-3",
    name: "بیدار شدن ساعت ۷ صبح",
    icon: "⏰",
    frequency: "daily",
    isActive: true,
    streak: 9,
    logs: {
      [getDateOffsetKey(0)]: true,
      [getDateOffsetKey(-1)]: true,
      [getDateOffsetKey(-2)]: true,
      [getDateOffsetKey(-3)]: true,
      [getDateOffsetKey(-4)]: true,
      [getDateOffsetKey(-5)]: false,
      [getDateOffsetKey(-6)]: true,
    },
  },
  {
    id: "habit-4",
    name: "مدیتیشن و تنفس عمیق",
    icon: "🧘‍♀️",
    frequency: "daily",
    isActive: true,
    streak: 3,
    logs: {
      [getDateOffsetKey(0)]: false,
      [getDateOffsetKey(-1)]: true,
      [getDateOffsetKey(-2)]: true,
      [getDateOffsetKey(-3)]: true,
      [getDateOffsetKey(-4)]: false,
      [getDateOffsetKey(-5)]: false,
      [getDateOffsetKey(-6)]: true,
    },
  },
  {
    id: "habit-5",
    name: "مطالعه ۳۰ دقیقه کتاب",
    icon: "📖",
    frequency: "daily",
    isActive: true,
    streak: 11,
    logs: {
      [getDateOffsetKey(0)]: true,
      [getDateOffsetKey(-1)]: true,
      [getDateOffsetKey(-2)]: true,
      [getDateOffsetKey(-3)]: true,
      [getDateOffsetKey(-4)]: true,
      [getDateOffsetKey(-5)]: true,
      [getDateOffsetKey(-6)]: false,
    },
  },
];

export const initialContacts: Contact[] = [
  {
    id: "contact-1",
    name: "مهندس علی محمدی",
    friendshipDuration: "old_friend",
    level: "good",
    phone: "۰۹۱۲۱۱۱۱۱۱۱",
    email: "ali.mohammadi@example.com",
    telegramId: "@ali_tech",
    instagram: "@ali.mohammadi",
    nextFollowUp: "۱۴۰۳/۰۹/۲۵",
    notes: "مدیر فنی توانمند، مشاور در حوزه معماری ابری و سرورهای توزیع‌شده",
  },
  {
    id: "contact-2",
    name: "سارا احمدی",
    friendshipDuration: "new_friend",
    level: "connecting",
    phone: "۰۹۱۳۲۲۲۲۲۲۲",
    email: "sara.ahmadi@example.com",
    telegramId: "@sara_designer",
    instagram: "@sara_ux",
    nextFollowUp: "۱۴۰۳/۰۹/۲۰",
    notes: "طراح ارشد محصول و متخصص تجربه کاربری، همکاری در بخش دیزاین سیستم",
  },
  {
    id: "contact-3",
    name: "دکتر رضایی",
    friendshipDuration: "old_friend",
    level: "good",
    phone: "۰۹۱۴۳۳۳۳۳۳۳",
    telegramId: "@dr_rezaei",
    nextFollowUp: "۱۴۰۳/۱۰/۰۵",
    notes: "استاد راهنما و منتور توسعه فردی و استراتژی‌های مدیریت تیم",
  },
  {
    id: "contact-4",
    name: "پویا کریمی",
    friendshipDuration: "new_friend",
    level: "needs_start",
    phone: "۰۹۱۲۴۴۴۴۴۴۴",
    telegramId: "@pouya_growth",
    instagram: "@pouya.growth",
    nextFollowUp: "۱۴۰۳/۰۹/۱۸",
    notes: "متخصص پرفورمنس مارکتینگ و جذب مشتری در استارتاپ‌های نوپا",
  },
  {
    id: "contact-5",
    name: "مریم حسینی",
    friendshipDuration: "old_friend",
    level: "needs_more",
    phone: "۰۹۱۹۵۵۵۵۵۵۵",
    email: "maryam.hosseini@example.com",
    nextFollowUp: "۱۴۰۳/۰۹/۲۸",
    notes: "هم‌دانشگاهی قدیمی، پژوهشگر داده و هوش مصنوعی",
  },
];

export const initialSkills: Skill[] = [
  {
    id: "skill-1",
    name: "برنامه‌نویسی TypeScript و React",
    type: "hard",
    level: 8,
    value: 9,
    startDate: "۱۴۰۱/۰۲/۰۱",
    status: "in_progress",
    isCompleted: false,
    description: "توسعه وب‌اپلیکیشن‌های پیشرفته با تایپ‌های دقیق و معماری ماژولار",
  },
  {
    id: "skill-2",
    name: "اصول و تکنیک‌های مذاکره و متقاعدسازی",
    type: "soft",
    level: 6,
    value: 10,
    startDate: "۱۴۰۲/۰۸/۱۵",
    status: "in_progress",
    isCompleted: false,
    description: "تکنیک‌های مذاکره برد-برد و مدیریت تعارض‌های تجاری",
  },
  {
    id: "skill-3",
    name: "طراحی رابط کاربری و تجربه کاربری (UI/UX)",
    type: "hard",
    level: 7,
    value: 8,
    startDate: "۱۴۰۲/۰۱/۱۰",
    status: "in_progress",
    isCompleted: false,
    description: "طراحی کامپوننت‌های مدرن، ارگونومی دیجیتال و پروتوتایپ در فیگما",
  },
  {
    id: "skill-4",
    name: "مکالمه روان و نگارش تجاری انگلیسی",
    type: "hard",
    level: 7,
    value: 9,
    startDate: "۱۴۰۱/۰۶/۰۱",
    status: "in_progress",
    isCompleted: false,
    description: "تسلط بر ارائه‌های بین‌المللی و شرکت در جلسات بدون لکنت",
  },
  {
    id: "skill-5",
    name: "مدیریت زمان و تمرکز عمیق (Deep Work)",
    type: "soft",
    level: 8,
    value: 9,
    startDate: "۱۴۰۲/۰۴/۰۱",
    status: "completed",
    isCompleted: true,
    description: "حذف حواس‌پرتی‌ها، بلوک‌بندی زمانی و افزایش خروجی روزانه",
  },
];

export const initialResources: Resource[] = [
  {
    id: "res-1",
    name: "کتاب کار عمیق (Deep Work - Cal Newport)",
    skillType: "soft",
    resourceType: "book",
    status: "completed",
    duration: 10,
    date: "۱۴۰۳/۰۲/۱۵",
    isCompleted: true,
    skillId: "skill-5",
    notes: "قوانین تمرکز در دنیای پر از حواس‌پرتی‌های دیجیتال",
  },
  {
    id: "res-2",
    name: "دوره جامع React & Next.js با تایپ‌اسکریپت",
    skillType: "hard",
    resourceType: "course",
    status: "in_progress",
    duration: 40,
    date: "۱۴۰۳/۰۸/۰۱",
    isCompleted: false,
    skillId: "skill-1",
    url: "https://frontendmasters.com",
    notes: "پوشش کامل سرور کامپوننت‌ها و معماری‌های مدرن",
  },
  {
    id: "res-3",
    name: "کتاب هنر شفاف اندیشیدن (رولف دوبلی)",
    skillType: "soft",
    resourceType: "book",
    status: "completed",
    duration: 8,
    date: "۱۴۰۳/۰۵/۲۰",
    isCompleted: true,
    notes: "بررسی ۹۹ خطای شناختی رایج در تصمیم‌گیری‌ها",
  },
  {
    id: "res-4",
    name: "پادکست Huberman Lab (بهینه‌سازی خواب و تمرکز)",
    skillType: "soft",
    resourceType: "podcast",
    status: "in_progress",
    duration: 15,
    date: "۱۴۰۳/۰۹/۰۱",
    isCompleted: false,
    url: "https://hubermanlab.com",
    notes: "بینش‌های عصب‌شناختی برای افزایش کارایی مغز و انرژی پایدار",
  },
  {
    id: "res-5",
    name: "کتاب Never Split the Difference (کریس واس)",
    skillType: "soft",
    resourceType: "book",
    status: "in_progress",
    duration: 12,
    date: "۱۴۰۳/۰۷/۱۰",
    isCompleted: false,
    skillId: "skill-2",
    notes: "تکنیک‌های مذاکره از زبان مذاکره‌کننده ارشد گروگان‌گیری FBI",
  },
];

export const initialNotes: Note[] = [
  {
    id: "note-1",
    title: "مفهوم و ساختار پایگاه دانش شخصی (CODE Framework)",
    content: `# ساختار سیستم پایگاه دانش (Building a Knowledge Base)

متدولوژی CODE از تیاگو فورته شامل چهار گام اساسی است:

1. **Capture (ثبت)**: ذخیره ایده‌ها، نقل‌قول‌ها، خلاصه جلسات و یافته‌ها بدون معطلی.
2. **Organize (سازماندهی)**: چیدمان بر اساس پروژه و اقدام‌پذیری (متد PARA).
3. **Distill (تقطیر)**: برجسته‌سازی نکات طلایی و خلاصه کردن به اصل مطلب.
4. **Express (بیان و اقدام)**: تبدیل دانش به خروجی واقعی، پروژه‌ها و اثرگذاری.

> مغز شما جای پردازش و خلق ایده‌هاست، نه انباری برای نگهداری فایل‌ها و یادآوری قرارها!

### حوزه‌های کلیدی برای من:
- پیشرفت استارتاپ و محصولات دیجیتال
- توسعه عادات روزانه و نظم شخصی
- سلامت جسم و بهداشت خواب`,
    type: "note",
    category: "Personal",
    isPinned: true,
    isArchived: false,
    tags: ["مغز_دوم", "بهره_وری", "یادگیری", "روش_شناسی"],
    createdAt: "۱۴۰۳/۰۹/۰۱",
    updatedAt: "۱۴۰۳/۰۹/۱۵",
    summary: "اصول چهارگانه CODE تیاگو فورته برای سازماندهی دانش و آزادسازی ذهن",
  },
  {
    id: "note-2",
    title: "ایده‌های محوری برای محصول آموزشی و استارتاپ",
    content: `# ایده‌های استارتاپ EdTech

- ایجاد محیط یادگیری مبتنی بر پروژه واقعی (Project-based)
- دستیار هوش مصنوعی راهنما برای رفع اشکال ۲۴ ساعته دانش‌پژوهان
- سیستم گیمیفیکیشن و توالی‌های یادگیری شبیه دولینگو اما برای مهارت‌های شغلی
- صدور سرتیفیکیت‌های قابل اعتبارسنجی روی شبکه

### مخاطب هدف:
دانشجویان و کارشناسانی که به دنبال ارتقای مهارت در کمترین زمان با بالاترین بازده هستند.`,
    type: "idea",
    category: "Ideas",
    isPinned: true,
    isArchived: false,
    tags: ["استارتاپ", "ایده", "آموزش", "بیزنس"],
    createdAt: "۱۴۰۳/۰۹/۰۸",
    updatedAt: "۱۴۰۳/۰۹/۱۴",
    summary: "ایده‌های کلیدی برای راه‌اندازی پلتفرم نسل جدید یادگیری تعاملی",
  },
  {
    id: "note-3",
    title: "خلاصه کتاب عادت‌های اتمی (Atomic Habits)",
    content: `# نکات کلیدی کتاب عادت‌های اتمی - جیمز کلیر

تغییرات کوچک ۱ درصدی در طول زمان نتایج شگفت‌انگیزی رقم می‌زنند.

### ۴ قانون تغییر رفتار:
1. **آن را آشکار کنید** (طراحی محیط، نشانه‌های بصری واضح).
2. **آن را جذاب کنید** (پیوست کردن کارهای ضروری به لذت‌ها).
3. **آن را ساده کنید** (قانون ۲ دقیقه، کاهش اصطکاک شروع).
4. **آن را رضایت‌بخش کنید** (پاداش فوری، ردیاب عادت و تیک زدن).

> شما به سطح اهدافتان صعود نمی‌کنید؛ بلکه به سطح سیستم‌هایتان سقوط می‌کنید!`,
    type: "reference",
    category: "Study",
    isPinned: false,
    isArchived: false,
    tags: ["کتاب", "عادت", "روانشناسی", "توسعه_فردی"],
    createdAt: "۱۴۰۳/۰۸/۱۵",
    updatedAt: "۱۴۰۳/۰۹/۱۰",
    summary: "قوانین چهارگانه ایجاد عادت‌های خوب و ترک عادت‌های مخرب",
  },
  {
    id: "note-4",
    title: "جلسه همفکری هفتگی تیم فنی و طراحی",
    content: `# صورت‌جلسه هماهنگی فنی

**تاریخ**: ۱۴۰۳/۰۹/۱۲  
**حاضرین**: من، مهندس محمدی، سارا احمدی

### تصمیمات اتخاذ شده:
- تمرکز بر طراحی واکنش‌گرا و تجربه کاربری بی‌نقص در موبایل
- کاهش وابستگی‌های حجیم در فرانت‌اند برای بهبود سرعت بارگذاری
- ارائه نسخه اولیه MVP در پایان ماه جاری برای تست اولیه

### تسک‌های تعیین‌شده:
1. آماده‌سازی نمونه بوم کسب‌وکار (توسط من)
2. بهینه‌سازی دیتابیس و روابط مدل‌ها (توسط مهندس محمدی)`,
    type: "meeting",
    category: "Work",
    isPinned: false,
    isArchived: false,
    tags: ["جلسه", "تیم", "استارتاپ", "برنامه_ریزی"],
    createdAt: "۱۴۰۳/۰۹/۱۲",
    updatedAt: "۱403/۰۹/۱۲",
    summary: "خلاصه جلسه فنی پیرامون آماده‌سازی معماری و MVP",
  },
  {
    id: "note-5",
    title: "تکنیک‌های مذاکره و اثرگذاری اجتماعی",
    content: `# تکنیک‌های طلایی کتاب Never Split the Difference

- **آینه‌کاری (Mirroring)**: تکرار ۱ تا ۳ کلمه آخر طرف مقابل برای ایجاد حس همدردی و جلب اطلاعات بیشتر.
- **برچسب‌گذاری احساسی (Labeling)**: گفتن «به نظر می‌رسد از این موضوع نگرانید...» برای خاموش کردن هیجانات منفی.
- **پرسش‌های کالیبره‌شده**: به جای «چرا»، از «چطور می‌توانم این را انجام دهم؟» استفاده کنید تا طرف مقابل را به فکر حل مشکل بیندازید.`,
    type: "note",
    category: "Personal",
    isPinned: false,
    isArchived: false,
    tags: ["مذاکره", "ارتباطات", "مهارت_نرم"],
    createdAt: "۱۴۰۳/۰۹/۰۴",
    updatedAt: "۱۴۰۳/۰۹/۰۴",
    summary: "خلاصه روش‌های برتر مذاکره روانشناختی و همدردی تاکتیکی",
  },
];

export const initialIncomeSources: IncomeSource[] = [
  {
    id: "inc-1",
    name: "قرارداد مشاوره فنی و طراحی نرم‌افزار",
    type: "active",
    status: "excellent",
    amount: 35000000,
    currency: "تومان",
    frequency: "monthly",
    notes: "همکاری ثابت ماهانه در حوزه ارزیابی معماری و نظارت بر کد",
  },
  {
    id: "inc-2",
    name: "پروژه‌های فریلنسری توسعه وب و طراحی UI",
    type: "active",
    status: "good",
    amount: 18000000,
    currency: "تومان",
    frequency: "project",
    notes: "طراحی رابط کاربری و پیاده‌سازی وب‌سایت‌های سفارشی شرکتی",
  },
  {
    id: "inc-3",
    name: "سرمایه‌گذاری در صندوق‌های درآمد ثابت و سهام",
    type: "inactive",
    status: "average",
    amount: 6500000,
    currency: "تومان",
    frequency: "monthly",
    notes: "جریان درآمد انفعالی و سود تقسیمی اوراق بهادار",
  },
];

export const initialSelfAwareness: SelfAwareness[] = [
  {
    id: "self-1",
    name: "مستند سیاره ما (Our Planet) - تنوع زیستی",
    isCompleted: true,
    type: "documentary",
    link: "https://www.netflix.com",
    topic: "حیات وحش و محیط زیست",
    date: "۱۴۰۳/۰۸/۲۲",
    notes: "یادآوری اهمیت تعادل اکولوژیکی و جایگاه انسان در هستی",
  },
  {
    id: "self-2",
    name: "مقاله روانشناسی رواقی‌گری (Stoicism) در عصر پرشتاب",
    isCompleted: true,
    type: "article",
    topic: "روانشناسی و فلسفه زندگی",
    date: "۱۴۰۳/۰۹/۰۵",
    notes: "کنترل آنچه در توان ماست و رها کردن امور غیرقابل کنترل برای آرامش درون",
  },
  {
    id: "self-3",
    name: "مستند ذهن انسان (The Mind, Explained)",
    isCompleted: false,
    type: "documentary",
    topic: "عصب‌شناسی و تمرکز ذهن",
    date: "۱۴۰۳/۰۹/۲۴",
    notes: "مکانیسم‌های فیزیولوژیکی حافظه و اثر مدیتیشن بر قشر جلوی مغز",
  },
  {
    id: "self-4",
    name: "کتاب انسان در جستجوی معنی (ویکتور فرانکل)",
    isCompleted: true,
    type: "book",
    topic: "معنادرمانی و خودشناسی عمیق",
    date: "۱۴۰۳/۰۷/۱۵",
    notes: "هر انسانی که چرایی برای زندگی داشته باشد با هر چگونه‌ای خواهد ساخت",
  },
];

export const initialAutomationRules: AutomationRule[] = [
  {
    id: "rule-1",
    name: "استخراج خودکار تسک از جلسات",
    description: "وقتی یادداشتی با نوع «جلسه» ثبت شد، موارد اقدام‌پذیر را به عنوان تسک ایجاد کن",
    category: "productivity",
    triggerType: "on_create",
    isActive: true,
    runCount: 4,
    lastRunAt: "۱۴۰۳/۰۹/۱۲",
  },
  {
    id: "rule-2",
    name: "برچسب‌گذاری و دسته‌بندی خودکار ایده‌ها",
    description: "ایده‌های جدید را بر اساس محتوا تحلیل و تگ‌های هوشمند به آن‌ها الحاق کن",
    category: "ai",
    triggerType: "on_create",
    isActive: true,
    runCount: 9,
    lastRunAt: "۱۴۰۳/۰۹/۱۴",
  },
  {
    id: "rule-3",
    name: "هشدار تسک‌های نزدیک به موعد انجام",
    description: "تسک‌هایی که تا ۲۴ ساعت آینده باید تحویل شوند را در اولویت قرار بده",
    category: "productivity",
    triggerType: "on_schedule",
    isActive: true,
    runCount: 18,
    lastRunAt: "۱۴۰۳/۰۹/۱۷",
  },
  {
    id: "rule-4",
    name: "اعلان تکمیل پروژه و بازنگری نتایج",
    description: "به محض ۱۰۰٪ شدن پیشرفت پروژه، جشن موفقیت و خلاصه دستاوردها را آماده کن",
    category: "productivity",
    triggerType: "on_update",
    isActive: true,
    runCount: 2,
    lastRunAt: "۱۴۰۳/۰۸/۳۰",
  },
  {
    id: "rule-5",
    name: "پیشنهاد لینک‌های دوطرفه بین یادداشت‌ها",
    description: "کشف شباهت‌های معنایی بین یادداشت‌ها و پیشنهاد اتصال گراف دانش",
    category: "ai",
    triggerType: "on_create",
    isActive: true,
    runCount: 15,
    lastRunAt: "۱۴۰۳/۰۹/۱۵",
  },
  {
    id: "rule-6",
    name: "ثبت توالی طلایی عادات (Streak Milestones)",
    description: "در صورت رسیدن به توالی ۷ یا ۱۴ روزه عادت، پیام تشویقی و بازخورد ارسال کن",
    category: "health",
    triggerType: "on_update",
    isActive: true,
    runCount: 5,
    lastRunAt: "۱۴۰۳/۰۹/۱۷",
  },
  {
    id: "rule-7",
    name: "تهیه پیش‌نویس مرور هفتگی در روزهای جمعه",
    description: "تجمیع خودکار آمار هفتگی و آماده‌سازی پیشنهادهای اختصاصی برای هفته جدید",
    category: "productivity",
    triggerType: "on_schedule",
    isActive: true,
    runCount: 6,
    lastRunAt: "۱۴۰۳/۰۹/۱۶",
  },
  {
    id: "rule-8",
    name: "یادآوری پیگیری مخاطبین شبکه ارتباطی",
    description: "در موعد تعیین‌شده برای پیگیری هر دوست یا همکار، نوتیفیکیشن ثبت کن",
    category: "organization",
    triggerType: "on_schedule",
    isActive: true,
    runCount: 8,
    lastRunAt: "۱۴۰۳/۰۹/۱۵",
  },
];

export const initialSuggestions: ProactiveSuggestion[] = [
  {
    id: "sug-1",
    type: "attention",
    title: "۳ تسک با اولویت بالا برای امروز موعد دارند",
    description: "تسک‌های مربوط به استارتاپ و تمرین انگلیسی نیازمند اقدام فوری شما هستند.",
    confidence: 0.95,
    actionText: "مشاهده تسک‌های امروز",
  },
  {
    id: "sug-2",
    type: "link",
    title: "ارتباط کشف‌شده بین «پایگاه دانش» و «کتاب عادت‌های اتمی»",
    description: "بخش سیستم‌های ردیابی عادت در هر دو یادداشت هم‌پوشانی دارند. مایلید لینک دوطرفه ایجاد شود؟",
    confidence: 0.88,
    actionText: "ایجاد پیوند دوطرفه",
  },
  {
    id: "sug-3",
    type: "reminder",
    title: "موعد پیگیری ارتباط کاری با سارا احمدی",
    description: "بررسی هماهنگی در خصوص پروتوتایپ‌های طراحی تا فردا مقرر شده بود.",
    confidence: 0.91,
    actionText: "مشاهده کارت مخاطب",
  },
];
