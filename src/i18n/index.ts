export type Language = "fa" | "en";

export interface TranslationDictionary {
  common: {
    appName: string;
    appSubtitle: string;
    systemOnline: string;
    search: string;
    searchShortcut: string;
    quickCapture: string;
    aiAssistant: string;
    notifications: string;
    resetDb: string;
    resetConfirm: string;
    resetSuccess: string;
    save: string;
    cancel: string;
    delete: string;
    deleteConfirm: string;
    edit: string;
    add: string;
    filter: string;
    all: string;
    close: string;
    back: string;
    backToList: string;
    done: string;
    pending: string;
    status: string;
    priority: string;
    actions: string;
    title: string;
    description: string;
    date: string;
    dueDate: string;
    category: string;
    progress: string;
    tags: string;
    noResults: string;
    loading: string;
    language: string;
    langFa: string;
    langEn: string;
    switchLang: string;
    today: string;
    open: string;
    testRun: string;
    active: string;
    disabled: string;
    success: string;
    error: string;
  };
  priorities: {
    critical: string;
    high: string;
    medium: string;
    low: string;
  };
  statuses: {
    not_started: string;
    in_progress: string;
    completed: string;
  };
  timelines: {
    weekly: string;
    monthly: string;
    six_months: string;
    yearly: string;
  };
  categories: {
    business: string;
    language: string;
    self_dev: string;
    main: string;
    personal: string;
    work: string;
    archived: string;
  };
  nav: {
    coreSection: string;
    databaseSection: string;
    aiToolsSection: string;
    workSection: string;
    personalSection: string;
    archivedSection: string;
    recentSection: string;
    recentEmpty: string;
    foldersSection: string;
    addFolder: string;
    folderCount: string;
    reorderHint: string;
    resetOrder: string;
    localSearchPlaceholder: string;
    collapseCategory: string;
    expandCategory: string;
    manageFolders: string;
    clearRecent: string;
    dashboard: string;
    notes: string;
    tasks: string;
    projects: string;
    goals: string;
    habits: string;
    contacts: string;
    skills: string;
    resources: string;
    income: string;
    selfAwareness: string;
    aiAssistant: string;
    graph: string;
    automation: string;
    export: string;
  };
  views: {
    dashboard: {
      title: string;
      subtitle: string;
      knowledgeNodes: string;
      overdueTasks: string;
      coreObjective: string;
      goalProgress: string;
      habitsDoneToday: string;
      viewGoalsMap: string;
      velocity: string;
      longestStreak: string;
      days: string;
      streakPraise: string;
      weeklyLoad: string;
      todayHabits: string;
      urgentTasks: string;
      viewBoard: string;
      recentNotes: string;
      allNotes: string;
      activeProjects: string;
      viewProjects: string;
      refreshData: string;
      loadingData: string;
    };
    notes: {
      title: string;
      subtitle: string;
      newNote: string;
      searchPlaceholder: string;
      noNotes: string;
      untitledNote: string;
      editMode: string;
      previewMode: string;
      aiTags: string;
      aiTagging: string;
      addTag: string;
      addTagPlaceholder: string;
      noteContentPlaceholder: string;
      pinNote: string;
      unpinNote: string;
      deleteNote: string;
      updatedAt: string;
      selectNotePrompt: string;
    };
    tasks: {
      title: string;
      subtitle: string;
      newTask: string;
      tableView: string;
      kanbanView: string;
      calendarView: string;
      allStatuses: string;
      allPriorities: string;
      noTasksFound: string;
      taskTitle: string;
      project: string;
      priorityCol: string;
      dueDateCol: string;
      estTimeCol: string;
      hours: string;
      actionCol: string;
      createModalTitle: string;
      editModalTitle: string;
      taskNameLabel: string;
      taskNamePlaceholder: string;
      taskDescLabel: string;
      taskDescPlaceholder: string;
      selectProject: string;
      noProject: string;
      selectGoal: string;
      noGoal: string;
    };
    projects: {
      title: string;
      subtitle: string;
      newProject: string;
      allCategories: string;
      noProjectsFound: string;
      tasksCount: string;
      progressLabel: string;
      timeline: string;
      createModalTitle: string;
      editModalTitle: string;
      projectNameLabel: string;
      projectDescLabel: string;
      iconLabel: string;
      startDateLabel: string;
      endDateLabel: string;
    };
    goals: {
      title: string;
      subtitle: string;
      newGoal: string;
      allTimeframes: string;
      targetDate: string;
      noGoalsFound: string;
      createModalTitle: string;
      editModalTitle: string;
      goalNameLabel: string;
      goalDescLabel: string;
      timeframeLabel: string;
    };
    habits: {
      title: string;
      subtitle: string;
      newHabit: string;
      todayCompletion: string;
      currentStreak: string;
      days: string;
      last7Days: string;
      noHabitsFound: string;
      createModalTitle: string;
      habitNameLabel: string;
      habitNamePlaceholder: string;
      iconLabel: string;
      frequencyLabel: string;
      daily: string;
      weekly: string;
    };
    contacts: {
      title: string;
      subtitle: string;
      newContact: string;
      allLevels: string;
      level1: string;
      level2: string;
      level3: string;
      noContactsFound: string;
      role: string;
      lastContact: string;
      nextFollowUp: string;
      createModalTitle: string;
      editModalTitle: string;
      contactNameLabel: string;
      roleLabel: string;
      phoneLabel: string;
      emailLabel: string;
      telegramLabel: string;
      linkedinLabel: string;
      notesLabel: string;
    };
    skills: {
      title: string;
      subtitle: string;
      newSkill: string;
      allSkills: string;
      hardSkills: string;
      softSkills: string;
      levelLabel: string;
      statusLabel: string;
      learning: string;
      mastered: string;
      noSkillsFound: string;
      createModalTitle: string;
      skillNameLabel: string;
      skillTypeLabel: string;
    };
    resources: {
      title: string;
      subtitle: string;
      newResource: string;
      allTypes: string;
      books: string;
      courses: string;
      podcasts: string;
      websites: string;
      author: string;
      openLink: string;
      noResourcesFound: string;
      toRead: string;
      reading: string;
      finished: string;
      createModalTitle: string;
      resourceTitleLabel: string;
      authorLabel: string;
      urlLabel: string;
      notesLabel: string;
    };
    income: {
      title: string;
      subtitle: string;
      newIncome: string;
      allStreams: string;
      activeIncome: string;
      passiveIncome: string;
      totalMonthlyIncome: string;
      activeRate: string;
      passiveRate: string;
      currencyToman: string;
      frequencyMonthly: string;
      frequencyOneTime: string;
      frequencyProject: string;
      statusActive: string;
      statusPotential: string;
      statusPaused: string;
      noStreamsFound: string;
      createModalTitle: string;
      sourceLabel: string;
      amountLabel: string;
    };
    selfAwareness: {
      title: string;
      subtitle: string;
      newItem: string;
      allEntries: string;
      documentaries: string;
      books: string;
      articles: string;
      insights: string;
      keyInsight: string;
      impactRating: string;
      openLink: string;
      noItemsFound: string;
      createModalTitle: string;
      itemTitleLabel: string;
      insightLabel: string;
      linkLabel: string;
    };
    graph: {
      title: string;
      subtitle: string;
      synapsesCount: string;
      filterAll: string;
      filterNotes: string;
      filterProjects: string;
      zoomIn: string;
      zoomOut: string;
      resetZoom: string;
      legendTitle: string;
      notesLegend: string;
      projectsLegend: string;
      goalsLegend: string;
      nodeDetails: string;
      openItem: string;
    };
    automation: {
      title: string;
      subtitle: string;
      newRule: string;
      when: string;
      then: string;
      lastTrigger: string;
      neverTriggered: string;
      testRunButton: string;
      testRunSuccess: string;
      deleteRuleConfirm: string;
      createModalTitle: string;
      ruleNameLabel: string;
      triggerLabel: string;
      actionLabel: string;
      triggerTaskCompleted: string;
      triggerHabitStreak: string;
      triggerNoteCreated: string;
      triggerWeeklySchedule: string;
      actionRecalculate: string;
      actionReminder: string;
      actionAiTag: string;
      actionWeeklyReview: string;
    };
    export: {
      title: string;
      subtitle: string;
      descriptionText: string;
      metricsTitle: string;
      storageActive: string;
      notesMetric: string;
      tasksMetric: string;
      projectsMetric: string;
      goalsMetric: string;
      habitsMetric: string;
      exportJsonTitle: string;
      exportJsonDesc: string;
      exportJsonButton: string;
      exportMdTitle: string;
      exportMdDesc: string;
      exportMdButton: string;
      restoreTitle: string;
      restoreDesc: string;
      restoreButton: string;
      restoreSuccess: string;
      restoreError: string;
      encTitle: string;
      encDesc: string;
      encPassphraseLabel: string;
      encCreateButton: string;
      encRestoreButton: string;
      encPassTooShort: string;
      encCreateSuccess: string;
      encRestoreSuccess: string;
      encWrongPassphrase: string;
      encBadFile: string;
      resetTitle: string;
      resetDesc: string;
      resetButton: string;
    };
  };
  modals: {
    quickCapture: {
      modalTitle: string;
      tabNote: string;
      tabTask: string;
      tabIdea: string;
      tabBookmark: string;
      tabVoice: string;
      titlePlaceholder: string;
      contentPlaceholder: string;
      bookmarkUrlPlaceholder: string;
      tagsPlaceholder: string;
      addTag: string;
      relatedProject: string;
      noProject: string;
      relatedGoal: string;
      noGoal: string;
      voiceRecordingTitle: string;
      voiceRecordingDesc: string;
      voiceRecordingActive: string;
      stopVoice: string;
      startVoice: string;
      saveItem: string;
    };
    commandPalette: {
      searchPlaceholder: string;
      quickNoteAction: string;
      quickNoteSubtitle: string;
      askAiAction: string;
      askAiSubtitle: string;
      viewGraphAction: string;
      viewGraphSubtitle: string;
      navigationSection: string;
      actionsSection: string;
      settingsSection: string;
      recentSearches: string;
      frequentlyAccessed: string;
      suggestedForYou: string;
      clearAll: string;
      resourcesSection: string;
      notesSection: string;
      tasksSection: string;
      projectsSection: string;
      goalsSection: string;
      contactsSection: string;
      noResults: string;
    };
    webClipper: {
      title: string;
      subtitle: string;
      urlPlaceholder: string;
      clipButton: string;
      clipping: string;
      extractedTitle: string;
      summaryLabel: string;
      saveToNotes: string;
    };
    aiAssistant: {
      title: string;
      subtitle: string;
      connectedState: string;
      clearHistory: string;
      emptyStatePrompt: string;
      inputPlaceholder: string;
      sendButton: string;
      samplePrompt1: string;
      samplePrompt2: string;
      samplePrompt3: string;
      samplePrompt4: string;
    };
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  fa: {
    common: {
      appName: "مغز دوم",
      appSubtitle: "سیستم عامل مدیریت دانش شخصی",
      systemOnline: "سیستم آنلاین",
      search: "جستجوی هوشمند...",
      searchShortcut: "⌘K",
      quickCapture: "ثبت سریع",
      aiAssistant: "دستیار هوشمند",
      notifications: "پیشنهادهای هوشمند",
      resetDb: "بازنشانی داده‌ها",
      resetConfirm: "آیا اطمینان دارید که تمام داده‌ها به نمونه‌های اولیه بازنشانی شوند؟",
      resetSuccess: "داده‌های اولیه با موفقیت بارگذاری شدند.",
      save: "ذخیره اطلاعات",
      cancel: "انصراف",
      delete: "حذف",
      deleteConfirm: "آیا از حذف این مورد اطمینان دارید؟",
      edit: "ویرایش",
      add: "افزودن",
      filter: "فیلتر",
      all: "همه",
      close: "بستن",
      back: "بازگشت",
      backToList: "بازگشت به فهرست",
      done: "انجام شد",
      pending: "در انتظار",
      status: "وضعیت",
      priority: "اولویت",
      actions: "عملیات",
      title: "عنوان",
      description: "توضیحات",
      date: "تاریخ",
      dueDate: "موعد تحویل",
      category: "دسته‌بندی",
      progress: "پیشرفت",
      tags: "برچسب‌ها",
      noResults: "هیچ موردی یافت نشد",
      loading: "در حال پردازش...",
      language: "زبان",
      langFa: "فارسی",
      langEn: "English",
      switchLang: "تغییر زبان به انگلیسی",
      today: "امروز",
      open: "باز کردن",
      testRun: "اجرای آزمایشی",
      active: "فعال",
      disabled: "غیرفعال",
      success: "عملیات با موفقیت انجام شد",
      error: "خطایی رخ داد",
    },
    priorities: {
      critical: "بحرانی",
      high: "بالا",
      medium: "متوسط",
      low: "پایین",
    },
    statuses: {
      not_started: "شروع نشده",
      in_progress: "در حال انجام",
      completed: "تکمیل شده",
    },
    timelines: {
      weekly: "هفتگی",
      monthly: "ماهانه",
      six_months: "شش‌ماهه",
      yearly: "سالانه",
    },
    categories: {
      business: "کسب و کار",
      language: "یادگیری زبان",
      self_dev: "توسعه فردی",
      main: "پروژه‌های اصلی",
      personal: "شخصی",
      work: "کاری",
      archived: "آرشیو شده",
    },
    nav: {
      coreSection: "هسته اصلی",
      databaseSection: "پایگاه‌های دانش",
      aiToolsSection: "ابزارها و هوش مصنوعی",
      workSection: "حوزه کاری",
      personalSection: "حوزه فردی و شخصی",
      archivedSection: "آرشیو و موارد تکمیل شده",
      recentSection: "بازدیدهای اخیر",
      recentEmpty: "هنوز موردی بازدید نشده است",
      foldersSection: "پوشه‌ها و دسته‌ها",
      addFolder: "پوشه جدید",
      folderCount: "مورد",
      reorderHint: "برای تغییر ترتیب بکشید",
      resetOrder: "بازنشانی چیدمان منو",
      localSearchPlaceholder: "جستجو در این صفحه...",
      collapseCategory: "بستن دسته‌بندی",
      expandCategory: "باز کردن دسته‌بندی",
      manageFolders: "مدیریت پوشه‌ها",
      clearRecent: "پاکسازی اخیر",
      dashboard: "میز کار و خلاصه",
      notes: "یادداشت‌ها و اتم‌ها",
      tasks: "وظایف و کارها",
      projects: "پروژه‌ها",
      goals: "اهداف و چشم‌انداز",
      habits: "ردیاب عادات",
      contacts: "شبکه ارتباطات",
      skills: "ماتریس مهارت‌ها",
      resources: "منابع و مطالعات",
      income: "جریان‌های مالی",
      selfAwareness: "پایگاه خودشناسی",
      aiAssistant: "دستیار تحلیلی AI",
      graph: "گراف پیوندها",
      automation: "قوانین خودکارسازی",
      export: "پشتیبان و استخراج",
    },
    views: {
      dashboard: {
        title: "داشبورد هوشمند",
        subtitle: "مرکز هماهنگی و پایش پیوسته اهداف، پروژه‌ها و یادداشت‌ها",
        knowledgeNodes: "نود دانش",
        overdueTasks: "تسک در انتظار",
        coreObjective: "هدف محوری جاری",
        goalProgress: "میزان پیشرفت هدف",
        habitsDoneToday: "عادت‌های ثبت‌شده امروز",
        viewGoalsMap: "مشاهده نقشه اهداف",
        velocity: "توالی و پایداری عادات",
        longestStreak: "طولانی‌ترین زنجیره عادت",
        days: "روز",
        streakPraise: "توالی عادات در وضعیت مطلوب",
        weeklyLoad: "بار شناختی هفتگی",
        todayHabits: "امروز",
        urgentTasks: "وظایف فوری در اولویت",
        viewBoard: "مشاهده برد کامل",
        recentNotes: "آخرین یادداشت‌های ذخیره‌شده",
        allNotes: "مشاهده همه یادداشت‌ها",
        activeProjects: "پروژه‌های فعال",
        viewProjects: "مدیریت پروژه‌ها",
        refreshData: "به‌روزرسانی داده‌ها",
        loadingData: "در حال واکشی و پردازش داده‌ها...",
      },
      notes: {
        title: "پایگاه یادداشت‌ها",
        subtitle: "ثبت اتم‌های فکری، جلسات، خلاصه‌ها و پیوندهای مفهومی",
        newNote: "یادداشت جدید",
        searchPlaceholder: "جستجو در متن و عنوان یادداشت‌ها...",
        noNotes: "هیچ یادداشتی با این مشخصات یافت نشد",
        untitledNote: "یادداشت بدون عنوان",
        editMode: "ویرایش",
        previewMode: "پیش‌نمایش",
        aiTags: "برچسب‌گذاری و خلاصه هوشمند",
        aiTagging: "در حال تحلیل هوشمند...",
        addTag: "افزودن",
        addTagPlaceholder: "برچسب جدید...",
        noteContentPlaceholder: "شروع به نوشتن در مغز دوم کنید...",
        pinNote: "سنجاق کردن",
        unpinNote: "برداشتن سنجاق",
        deleteNote: "حذف این یادداشت",
        updatedAt: "آخرین به‌روزرسانی",
        selectNotePrompt: "یک یادداشت را برای مشاهده یا ویرایش انتخاب کنید",
      },
      tasks: {
        title: "مدیریت وظایف",
        subtitle: "سازماندهی کارها به صورت جدول، بُرد کانبان و تقویم",
        newTask: "وظیفه جدید",
        tableView: "نمای جدول",
        kanbanView: "بُرد کانبان",
        calendarView: "نمای تقویم",
        allStatuses: "همه وضعیت‌ها",
        allPriorities: "همه اولویت‌ها",
        noTasksFound: "هیچ وظیفه‌ای با فیلترهای کنونی مطابقت ندارد",
        taskTitle: "عنوان وظیفه",
        project: "پروژه",
        priorityCol: "اولویت",
        dueDateCol: "موعد",
        estTimeCol: "تخمین زمان",
        hours: "ساعت",
        actionCol: "عملیات",
        createModalTitle: "تعریف وظیفه جدید",
        editModalTitle: "ویرایش وظیفه",
        taskNameLabel: "عنوان وظیفه",
        taskNamePlaceholder: "مثال: تدوین مستندات فنی و دیاگرام معماری",
        taskDescLabel: "توضیحات و یادداشت‌ها",
        taskDescPlaceholder: "توضیحات اختیاری تکمیلی برای این وظیفه...",
        selectProject: "انتخاب پروژه مرتبط",
        noProject: "بدون پروژه مستقیم",
        selectGoal: "انتخاب هدف مرتبط",
        noGoal: "بدون هدف مستقیم",
      },
      projects: {
        title: "پروژه‌های فعال",
        subtitle: "پیگیری اهداف مقطعی با تاریخ شروع، پایان و خروجی‌های معین",
        newProject: "پروژه جدید",
        allCategories: "همه دسته‌ها",
        noProjectsFound: "هیچ پروژه‌ای در این دسته یافت نشد",
        tasksCount: "تعداد وظایف",
        progressLabel: "درصد تکمیل",
        timeline: "بازه زمانی",
        createModalTitle: "ایجاد پروژه جدید",
        editModalTitle: "ویرایش پروژه",
        projectNameLabel: "نام پروژه",
        projectDescLabel: "توضیحات و دستاورد نهایی",
        iconLabel: "آیکون یا ایموجی",
        startDateLabel: "تاریخ شروع",
        endDateLabel: "تاریخ هدف پایان",
      },
      goals: {
        title: "اهداف و چشم‌انداز",
        subtitle: "تعریف مقاصد بزرگ سالانه، فصلی و ماهانه با درصد پیشرفت",
        newGoal: "هدف جدید",
        allTimeframes: "همه بازه‌ها",
        targetDate: "موعد هدف",
        noGoalsFound: "هیچ هدفی در این بازه زمانی ثبت نشده است",
        createModalTitle: "تعریف هدف جدید",
        editModalTitle: "ویرایش هدف",
        goalNameLabel: "عنوان هدف",
        goalDescLabel: "شرح و شاخص‌های موفقیت",
        timeframeLabel: "بازه زمانی هدف",
      },
      habits: {
        title: "ردیاب عادات روزانه",
        subtitle: "تثبیت الگوهای رفتاری مثبت و حفظ زنجیره تکرار مداوم",
        newHabit: "عادت جدید",
        todayCompletion: "میزان تکمیل امروز",
        currentStreak: "زنجیره فعال",
        days: "روز",
        last7Days: "عملکرد ۷ روز گذشته",
        noHabitsFound: "هیچ عادتی ثبت نشده است",
        createModalTitle: "تعریف عادت جدید",
        habitNameLabel: "نام عادت",
        habitNamePlaceholder: "مثال: ۴۵ دقیقه مطالعه عمیق کتاب",
        iconLabel: "نماد یا ایموجی",
        frequencyLabel: "دوره تکرار",
        daily: "روزانه",
        weekly: "هفتگی",
      },
      contacts: {
        title: "شبکه ارتباطات و افراد",
        subtitle: "مدیریت روابط کلیدی، زمان‌های پیگیری و یادداشت‌های هماهنگی",
        newContact: "مخاطب جدید",
        allLevels: "همه سطوح ارتباطی",
        level1: "ارتباط نزدیک (سطح ۱)",
        level2: "ارتباط کاری/حرفه‌ای (سطح ۲)",
        level3: "شبکه گسترده (سطح ۳)",
        noContactsFound: "هیچ مخاطبی در این سطح یافت نشد",
        role: "سمت یا زمینه فعالیت",
        lastContact: "آخرین تعامل",
        nextFollowUp: "پیگیری بعدی",
        createModalTitle: "ثبت مخاطب جدید",
        editModalTitle: "ویرایش اطلاعات مخاطب",
        contactNameLabel: "نام و نام خانوادگی",
        roleLabel: "سمت / نقش",
        phoneLabel: "شماره تماس",
        emailLabel: "آدرس ایمیل",
        telegramLabel: "آیدی تلگرام",
        linkedinLabel: "پروفایل لینکدین",
        notesLabel: "یادداشت‌ها و موضوعات مشترک",
      },
      skills: {
        title: "ماتریس مهارت‌ها",
        subtitle: "ارزیابی و ارتقای مداوم شایستگی‌های فنی، فردی و مدیریتی",
        newSkill: "مهارت جدید",
        allSkills: "همه مهارت‌ها",
        hardSkills: "مهارت‌های سخت (فنی)",
        softSkills: "مهارت‌های نرم (رفتاری)",
        levelLabel: "سطح تسلط",
        statusLabel: "وضعیت یادگیری",
        learning: "در حال یادگیری فعال",
        mastered: "تثبیت‌شده و مسلط",
        noSkillsFound: "مهارتی در این بخش یافت نشد",
        createModalTitle: "ثبت مهارت جدید",
        skillNameLabel: "عنوان مهارت",
        skillTypeLabel: "نوع مهارت",
      },
      resources: {
        title: "کتابخانه منابع و مطالعات",
        subtitle: "کتاب‌ها، دوره‌ها، پادکست‌ها و مقالات مرجع برای یادگیری مستمر",
        newResource: "منبع جدید",
        allTypes: "همه قالب‌ها",
        books: "کتاب‌ها",
        courses: "دوره‌ها",
        podcasts: "پادکست‌ها",
        websites: "وب‌سایت‌ها و مقالات",
        author: "نویسنده یا ارائه‌دهنده",
        openLink: "مشاهده منبع",
        noResourcesFound: "هیچ منبعی در این دسته‌بندی یافت نشد",
        toRead: "در صف مطالعه",
        reading: "در حال مطالعه",
        finished: "تکمیل و خلاصه‌شده",
        createModalTitle: "افزودن منبع جدید",
        resourceTitleLabel: "عنوان منبع",
        authorLabel: "پدیدآورنده / ناشر",
        urlLabel: "آدرس اینترنتی یا لینک دسترسی",
        notesLabel: "نکات کلیدی یا آموخته‌ها",
      },
      income: {
        title: "جریان‌های مالی و درآمدی",
        subtitle: "تفکیک، پایش و تقویت درآمد‌های فعال و غیرفعال",
        newIncome: "جریان جدید",
        allStreams: "همه جریان‌ها",
        activeIncome: "درآمدهای فعال",
        passiveIncome: "درآمدهای غیرفعال",
        totalMonthlyIncome: "کل درآمد تخمینی ماهانه",
        activeRate: "نرخ ماهانه فعال",
        passiveRate: "نرخ ماهانه غیرفعال",
        currencyToman: "تومان",
        frequencyMonthly: "ماهانه",
        frequencyOneTime: "مقطعی / یکباره",
        frequencyProject: "پروژه‌ای",
        statusActive: "فعال و جاری",
        statusPotential: "پتانسیل در دست بررسی",
        statusPaused: "متوقف یا تعلیق‌شده",
        noStreamsFound: "هیچ جریان درآمدی یافت نشد",
        createModalTitle: "ثبت جریان مالی جدید",
        sourceLabel: "منبع یا کارفرما",
        amountLabel: "مبلغ تخمینی",
      },
      selfAwareness: {
        title: "پایگاه خودشناسی و بینش‌ها",
        subtitle: "ثبت مستندها، کتاب‌های بینش‌ساز، مقالات تفکری و تاملات فردی",
        newItem: "مورد جدید",
        allEntries: "همه موارد",
        documentaries: "مستندها",
        books: "کتاب‌های بینشی",
        articles: "مقالات تحلیلی",
        insights: "تاملات و یادداشت‌ها",
        keyInsight: "بینش و درس کلیدی",
        impactRating: "امتیاز اثرگذاری فکری",
        openLink: "مشاهده لینک مرجع",
        noItemsFound: "هیچ موردی در این بخش یافت نشد",
        createModalTitle: "ثبت بینش یا منبع خودشناسی",
        itemTitleLabel: "عنوان اثر یا موضوع تامل",
        insightLabel: "مهم‌ترین درس یا تغییر نگرش حاصل‌شده",
        linkLabel: "پیوند یا لینک اختیاری",
      },
      graph: {
        title: "گراف ارتباطات دانش",
        subtitle: "نقشه بصری پیوندها میان یادداشت‌ها، پروژه‌ها و اهداف",
        synapsesCount: "ارتباط فعال",
        filterAll: "همه موجودیت‌ها",
        filterNotes: "یادداشت‌ها",
        filterProjects: "پروژه‌ها",
        zoomIn: "بزرگنمایی",
        zoomOut: "کوچکنمایی",
        resetZoom: "بازنشانی زاویه دید",
        legendTitle: "راهنمای علائم گراف:",
        notesLegend: "یادداشت‌ها",
        projectsLegend: "پروژه‌ها",
        goalsLegend: "اهداف کلیدی",
        nodeDetails: "مشخصات نود انتخاب‌شده",
        openItem: "مشاهده جزئیات",
      },
      automation: {
        title: "مرکز خودکارسازی فرآیندها",
        subtitle: "تعریف قوانین شرطی هوشمند برای همگام‌سازی خودکار فعالیت‌ها",
        newRule: "قانون جدید",
        when: "هنگام رخ دادن رویداد:",
        then: "اقدام خودکار:",
        lastTrigger: "آخرین اجرا:",
        neverTriggered: "هنوز اجرا نشده",
        testRunButton: "اجرای آزمایشی",
        testRunSuccess: "قانون با موفقیت به صورت آزمایشی اجرا شد.",
        deleteRuleConfirm: "آیا از حذف این قانون خودکارسازی اطمینان دارید؟",
        createModalTitle: "تعریف قانون خودکارسازی جدید",
        ruleNameLabel: "عنوان قانون",
        triggerLabel: "محرک رویداد (Trigger)",
        actionLabel: "اقدام خودکار (Action)",
        triggerTaskCompleted: "هنگام تکمیل شدن یک وظیفه",
        triggerHabitStreak: "هنگام شکستن زنجیره دو روزه یک عادت",
        triggerNoteCreated: "هنگام ثبت یادداشت جدید",
        triggerWeeklySchedule: "برنامه زمان‌بندی هفتگی (جمعه‌ها)",
        actionRecalculate: "محاسبه مجدد درصد پیشرفت پروژه مرتبط",
        actionReminder: "ایجاد تسک یادآوری پیگیری فوری",
        actionAiTag: "ارسال به هوش مصنوعی جهت برچسب‌گذاری",
        actionWeeklyReview: "تولید پیش‌نویس گزارش مرور هفتگی",
      },
      export: {
        title: "مرکز پشتیبان‌گیری و انتقال داده‌ها",
        subtitle: "خروجی کامل JSON و یادداشت‌های Markdown با استانداردهای آزاد",
        descriptionText: "داده‌های شما کاملاً تحت کنترل خودتان است. در هر زمان می‌توانید کل پایگاه دانش را به عنوان فایل JSON یا یادداشت‌های Markdown استخراج کنید و در نرم‌افزارهایی مثل Obsidian، Logseq یا Notion وارد نمایید.",
        metricsTitle: "آمار و وضعیت پایگاه داده",
        storageActive: "ذخیره‌سازی محلی پایدار",
        notesMetric: "یادداشت‌ها",
        tasksMetric: "وظایف",
        projectsMetric: "پروژه‌ها",
        goalsMetric: "اهداف",
        habitsMetric: "عادت‌ها",
        exportJsonTitle: "خروجی جامع ساختاریافته (Full JSON)",
        exportJsonDesc: "یک کپی کامل از تمام جداول شامل یادداشت‌ها، پروژه‌ها، تسک‌ها، مخاطبین و تنظیمات.",
        exportJsonButton: "دانلود فایل پشتیبان (JSON)",
        exportMdTitle: "خروجی یادداشت‌ها (Markdown / Obsidian)",
        exportMdDesc: "استخراج تمام یادداشت‌ها با فرمت استاندارد Markdown برای استفاده در Obsidian یا مطالعه آفلاین.",
        exportMdButton: "دانلود یادداشت‌ها (.md)",
        restoreTitle: "بازیابی از فایل پشتیبان (Restore)",
        restoreDesc: "فایل JSON قبلی خود را بارگذاری کنید تا تمام داده‌ها فوراً همگام و بازیابی شوند.",
        restoreButton: "انتخاب فایل پشتیبان JSON",
        restoreSuccess: "داده‌ها با موفقیت بازگردانی شدند!",
        restoreError: "خطا: فایل پشتیبان نامعتبر است.",
        encTitle: "پشتیبان‌گیری رمزنگاری‌شده دو طرفه",
        encDesc: "فایل پشتیبان با AES-256-GCM روی همین دستگاه با عبارت عبور شما رمزنگاری می‌شود. بدون عبارت عبور — حتی ما — نمی‌توانیم آن را بخوانیم. فایل را در iCloud Drive، Google Drive یا هر مسیر دیگری ذخیره کنید.",
        encPassphraseLabel: "عبارت عبور پشتیبان (حداقل ۸ نویسه)",
        encCreateButton: "ساخت و اشتراک‌گذاری پشتیبان رمزنگاری‌شده",
        encRestoreButton: "بازیابی از فایل رمزنگاری‌شده",
        encPassTooShort: "عبارت عبور باید حداقل ۸ نویسه باشد.",
        encCreateSuccess: "پشتیبان رمزنگاری‌شده ساخته شد.",
        encRestoreSuccess: "بازیابی از پشتیبان رمزنگاری‌شده با موفقیت انجام شد!",
        encWrongPassphrase: "عبارت عبور اشتباه است یا فایل آسیب دیده.",
        encBadFile: "این فایل یک پشتیبان رمزنگاری‌شده معتبر نیست.",
        resetTitle: "بازنشانی به داده‌های اولیه",
        resetDesc: "پاکسازی کامل و بازنشانی به داده‌های نمونه اولیه سیستم جهت شروع دوباره.",
        resetButton: "بازنشانی کامل داده‌ها",
      },
    },
    modals: {
      quickCapture: {
        modalTitle: "ثبت سریع ورودی جدید (Quick Capture)",
        tabNote: "یادداشت",
        tabTask: "تسک",
        tabIdea: "ایده",
        tabBookmark: "بوک‌مارک",
        tabVoice: "صوت",
        titlePlaceholder: "عنوان یا تیتر اصلی...",
        contentPlaceholder: "توضیحات و متن یادداشت را وارد کنید...",
        bookmarkUrlPlaceholder: "https://example.com/article...",
        tagsPlaceholder: "افزودن برچسب (با فشردن اینتر)...",
        addTag: "افزودن برچسب",
        relatedProject: "پروژه مرتبط",
        noProject: "بدون پروژه",
        relatedGoal: "هدف مرتبط",
        noGoal: "بدون هدف",
        voiceRecordingTitle: "یادداشت صوتی هوشمند",
        voiceRecordingDesc: "روی دکمه زیر کلیک کنید تا صوت شما ثبت و تبدیل به اتم متنی شود.",
        voiceRecordingActive: "در حال ضبط صدا...",
        stopVoice: "توقف و پردازش صوت",
        startVoice: "شروع ضبط صدا",
        saveItem: "ثبت نهایی در مغز دوم",
      },
      commandPalette: {
        searchPlaceholder: "جستجو در یادداشت‌ها، وظایف، پروژه‌ها و اهداف...",
        quickNoteAction: "ثبت سریع یادداشت یا ایده جدید",
        quickNoteSubtitle: "باز کردن پنجره ثبت ورودی فوری",
        askAiAction: "پرسش و تحلیل با هوش مصنوعی",
        askAiSubtitle: "باز کردن پنل گفتگوی دستیار تحلیلی",
        viewGraphAction: "مشاهده گراف پیوندها",
        viewGraphSubtitle: "انتقال به نقشه ارتباطات دانش",
        navigationSection: "ناوبری و نماها",
        actionsSection: "اقدامات و ابزارها",
        settingsSection: "تنظیمات و ترجیحات",
        recentSearches: "جستجوهای اخیر",
        frequentlyAccessed: "نماهای پربازدید و پرتکرار",
        suggestedForYou: "پیشنهاد هوشمند برای الان",
        clearAll: "پاک کردن همه",
        resourcesSection: "منابع و مراجع",
        notesSection: "یادداشت‌ها",
        tasksSection: "وظایف",
        projectsSection: "پروژه‌ها",
        goalsSection: "اهداف",
        contactsSection: "مخاطبین",
        noResults: "هیچ نتیجه‌ای متناسب با جستجوی شما یافت نشد",
      },
      webClipper: {
        title: "استخراج هوشمند صفحات وب (Web Clipper)",
        subtitle: "وارد کردن لینک برای خلاصه‌سازی و ذخیره آن در پایگاه دانش",
        urlPlaceholder: "https://...",
        clipButton: "استخراج و تحلیل",
        clipping: "در حال پردازش و استخراج صفحه...",
        extractedTitle: "عنوان استخراج‌شده",
        summaryLabel: "خلاصه محتوا",
        saveToNotes: "ذخیره در یادداشت‌های مغز دوم",
      },
      aiAssistant: {
        title: "دستیار هوشمند مغز دوم",
        subtitle: "متصل به کلیه نودها، وظایف، پروژه‌ها و اهداف شما",
        connectedState: "اتصال به پایگاه دانش برقرار است",
        clearHistory: "پاکسازی گفتگو",
        emptyStatePrompt: "سلام! من دستیار هوشمند شما هستم. می‌توانید درباره اولویت‌بندی کارها، برنامه‌ریزی پروژه‌ها، گزارش پیشرفت یا خلاصه‌سازی یادداشت‌ها از من بپرسید.",
        inputPlaceholder: "پیام یا سوال خود را اینجا بنویسید...",
        sendButton: "ارسال پیام",
        samplePrompt1: "وظایف فوری و معوق من برای امروز چیست؟",
        samplePrompt2: "گزارش پیشرفت پروژه‌ها و اهداف جاری را ارائه بده.",
        samplePrompt3: "کدام عادت‌ها بیشترین توالی را داشته‌اند و نیاز به توجه دارند؟",
        samplePrompt4: "یک پیش‌نویس مرور هفتگی همراه با اولویت‌بندی برام بنویس.",
      },
    },
  },
  en: {
    common: {
      appName: "Second Brain",
      appSubtitle: "Personal Knowledge Operating System",
      systemOnline: "System Online",
      search: "Smart Search...",
      searchShortcut: "⌘K",
      quickCapture: "Quick Capture",
      aiAssistant: "AI Assistant",
      notifications: "Smart Suggestions",
      resetDb: "Reset Database",
      resetConfirm: "Are you sure you want to reset all data to initial defaults?",
      resetSuccess: "Initial default data restored successfully.",
      save: "Save Changes",
      cancel: "Cancel",
      delete: "Delete",
      deleteConfirm: "Are you sure you want to delete this item?",
      edit: "Edit",
      add: "Add",
      filter: "Filter",
      all: "All",
      close: "Close",
      back: "Back",
      backToList: "Back to List",
      done: "Done",
      pending: "Pending",
      status: "Status",
      priority: "Priority",
      actions: "Actions",
      title: "Title",
      description: "Description",
      date: "Date",
      dueDate: "Due Date",
      category: "Category",
      progress: "Progress",
      tags: "Tags",
      noResults: "No items found",
      loading: "Processing...",
      language: "Language",
      langFa: "فارسی",
      langEn: "English",
      switchLang: "تغییر زبان به فارسی",
      today: "Today",
      open: "Open",
      testRun: "Test Run",
      active: "Active",
      disabled: "Disabled",
      success: "Action completed successfully",
      error: "An error occurred",
    },
    priorities: {
      critical: "Critical",
      high: "High",
      medium: "Medium",
      low: "Low",
    },
    statuses: {
      not_started: "Not Started",
      in_progress: "In Progress",
      completed: "Completed",
    },
    timelines: {
      weekly: "Weekly",
      monthly: "Monthly",
      six_months: "6-Month",
      yearly: "Yearly",
    },
    categories: {
      business: "Business",
      language: "Language",
      self_dev: "Self-Development",
      main: "Main Projects",
      personal: "Personal",
      work: "Work",
      archived: "Archived",
    },
    nav: {
      coreSection: "Core Hub",
      databaseSection: "Knowledge Bases",
      aiToolsSection: "Tools & AI",
      workSection: "Work Workspace",
      personalSection: "Personal Growth",
      archivedSection: "Archived & Completed",
      recentSection: "Recent Items",
      recentEmpty: "No recent items visited yet",
      foldersSection: "Folders & Groups",
      addFolder: "New Folder",
      folderCount: "items",
      reorderHint: "Drag to reorder navigation",
      resetOrder: "Reset Menu Layout",
      localSearchPlaceholder: "Search in this view...",
      collapseCategory: "Collapse category",
      expandCategory: "Expand category",
      manageFolders: "Manage Folders",
      clearRecent: "Clear Recent",
      dashboard: "Dashboard",
      notes: "Notes & Atoms",
      tasks: "Tasks & To-Dos",
      projects: "Projects",
      goals: "Goals & Visions",
      habits: "Habit Tracker",
      contacts: "Contacts (CRM)",
      skills: "Skills Matrix",
      resources: "Library & Studies",
      income: "Income Streams",
      selfAwareness: "Self-Awareness",
      aiAssistant: "AI Copilot",
      graph: "Knowledge Graph",
      automation: "Automations",
      export: "Backup & Export",
    },
    views: {
      dashboard: {
        title: "System Dashboard",
        subtitle: "Unified coordination and real-time monitoring of goals, projects, and knowledge",
        knowledgeNodes: "Knowledge Nodes",
        overdueTasks: "Pending Tasks",
        coreObjective: "Core Active Objective",
        goalProgress: "Goal Progress",
        habitsDoneToday: "Habits Completed Today",
        viewGoalsMap: "View Goals Map",
        velocity: "Habit Velocity",
        longestStreak: "Longest Habit Streak",
        days: "Days",
        streakPraise: "Habit consistency in peak state",
        weeklyLoad: "Weekly Cognitive Load",
        todayHabits: "Today",
        urgentTasks: "Urgent Priority Stream",
        viewBoard: "View Full Board",
        recentNotes: "Recent Knowledge Ingestion",
        allNotes: "View All Notes",
        activeProjects: "Active Projects",
        viewProjects: "Manage Projects",
        refreshData: "Refresh Data",
        loadingData: "Fetching and processing data...",
      },
      notes: {
        title: "Notes & Atoms",
        subtitle: "Capture atomic thoughts, meetings, book summaries, and concept links",
        newNote: "New Note",
        searchPlaceholder: "Search notes by title or content...",
        noNotes: "No notes matched your query",
        untitledNote: "Untitled Note",
        editMode: "Edit",
        previewMode: "Preview",
        aiTags: "AI Summary & Tags",
        aiTagging: "Analyzing with AI...",
        addTag: "Add",
        addTagPlaceholder: "New tag...",
        noteContentPlaceholder: "Start capturing thoughts in your second brain...",
        pinNote: "Pin Note",
        unpinNote: "Unpin Note",
        deleteNote: "Delete Note",
        updatedAt: "Last updated",
        selectNotePrompt: "Select a note from the list to view or edit",
      },
      tasks: {
        title: "Task Management",
        subtitle: "Organize actions with Table, Kanban Board, and Calendar views",
        newTask: "New Task",
        tableView: "Table View",
        kanbanView: "Kanban Board",
        calendarView: "Calendar View",
        allStatuses: "All Statuses",
        allPriorities: "All Priorities",
        noTasksFound: "No tasks matched current filters",
        taskTitle: "Task Title",
        project: "Project",
        priorityCol: "Priority",
        dueDateCol: "Due Date",
        estTimeCol: "Est. Time",
        hours: "hrs",
        actionCol: "Actions",
        createModalTitle: "Create New Task",
        editModalTitle: "Edit Task",
        taskNameLabel: "Task Title",
        taskNamePlaceholder: "e.g. Design database schema & indexing map",
        taskDescLabel: "Description & Notes",
        taskDescPlaceholder: "Optional details and context for this task...",
        selectProject: "Related Project",
        noProject: "No linked project",
        selectGoal: "Related Goal",
        noGoal: "No linked goal",
      },
      projects: {
        title: "Active Projects",
        subtitle: "Targeted initiatives with defined start, target finish, and deliverables",
        newProject: "New Project",
        allCategories: "All Categories",
        noProjectsFound: "No projects found in this category",
        tasksCount: "Tasks",
        progressLabel: "Completion",
        timeline: "Timeline",
        createModalTitle: "Create New Project",
        editModalTitle: "Edit Project",
        projectNameLabel: "Project Name",
        projectDescLabel: "Description & Outcome",
        iconLabel: "Icon or Emoji",
        startDateLabel: "Start Date",
        endDateLabel: "Target End Date",
      },
      goals: {
        title: "Goals & Horizons",
        subtitle: "Track annual, quarterly, and monthly milestones with measured progress",
        newGoal: "New Goal",
        allTimeframes: "All Timeframes",
        targetDate: "Target Date",
        noGoalsFound: "No goals found for this timeframe",
        createModalTitle: "Define New Goal",
        editModalTitle: "Edit Goal",
        goalNameLabel: "Goal Title",
        goalDescLabel: "Description & Success Metrics",
        timeframeLabel: "Goal Horizon",
      },
      habits: {
        title: "Daily Habit Tracker",
        subtitle: "Build automatic neural loops through continuous daily streaks",
        newHabit: "New Habit",
        todayCompletion: "Today's Completion",
        currentStreak: "Current Streak",
        days: "Days",
        last7Days: "Last 7 Days Performance",
        noHabitsFound: "No habits recorded yet",
        createModalTitle: "Create New Habit",
        habitNameLabel: "Habit Name",
        habitNamePlaceholder: "e.g. 45 min deep book reading",
        iconLabel: "Icon / Emoji",
        frequencyLabel: "Frequency",
        daily: "Daily",
        weekly: "Weekly",
      },
      contacts: {
        title: "Relationship Network",
        subtitle: "Manage personal connections, cadence, and follow-up notes",
        newContact: "New Contact",
        allLevels: "All Circles",
        level1: "Inner Circle (Tier 1)",
        level2: "Professional Network (Tier 2)",
        level3: "Extended Network (Tier 3)",
        noContactsFound: "No contacts found in this tier",
        role: "Role / Profession",
        lastContact: "Last Interaction",
        nextFollowUp: "Next Follow-Up",
        createModalTitle: "Add New Contact",
        editModalTitle: "Edit Contact Information",
        contactNameLabel: "Full Name",
        roleLabel: "Role / Position",
        phoneLabel: "Phone Number",
        emailLabel: "Email Address",
        telegramLabel: "Telegram Handle",
        linkedinLabel: "LinkedIn URL",
        notesLabel: "Context & Shared Topics",
      },
      skills: {
        title: "Skills Matrix",
        subtitle: "Continually assess and level up hard and soft competencies",
        newSkill: "New Skill",
        allSkills: "All Skills",
        hardSkills: "Hard Skills (Technical)",
        softSkills: "Soft Skills (Behavioral)",
        levelLabel: "Proficiency Level",
        statusLabel: "Learning Status",
        learning: "Active Learning",
        mastered: "Mastered & Stable",
        noSkillsFound: "No skills found in this view",
        createModalTitle: "Add New Skill",
        skillNameLabel: "Skill Name",
        skillTypeLabel: "Skill Type",
      },
      resources: {
        title: "Study & Resource Library",
        subtitle: "Books, courses, podcasts, and reference articles for continuous learning",
        newResource: "New Resource",
        allTypes: "All Media Types",
        books: "Books",
        courses: "Courses",
        podcasts: "Podcasts",
        websites: "Articles & Sites",
        author: "Author / Instructor",
        openLink: "Open Resource",
        noResourcesFound: "No resources found in this category",
        toRead: "To Study",
        reading: "In Progress",
        finished: "Completed & Synthesized",
        createModalTitle: "Add New Resource",
        resourceTitleLabel: "Resource Title",
        authorLabel: "Author / Publisher",
        urlLabel: "Web Link / URL",
        notesLabel: "Key Takeaways & Notes",
      },
      income: {
        title: "Income Streams",
        subtitle: "Segment, monitor, and scale active and passive financial flows",
        newIncome: "New Stream",
        allStreams: "All Streams",
        activeIncome: "Active Income",
        passiveIncome: "Passive Income",
        totalMonthlyIncome: "Estimated Monthly Total",
        activeRate: "Active Monthly Rate",
        passiveRate: "Passive Monthly Rate",
        currencyToman: "Tomans",
        frequencyMonthly: "Monthly",
        frequencyOneTime: "One-Time",
        frequencyProject: "Project-Based",
        statusActive: "Active & Flowing",
        statusPotential: "Potential Opportunity",
        statusPaused: "Paused / Suspended",
        noStreamsFound: "No income streams found",
        createModalTitle: "Add Income Stream",
        sourceLabel: "Source or Client",
        amountLabel: "Estimated Amount",
      },
      selfAwareness: {
        title: "Self-Awareness & Insight",
        subtitle: "Documentaries, insightful books, reflective articles, and personal revelations",
        newItem: "New Entry",
        allEntries: "All Entries",
        documentaries: "Documentaries",
        books: "Insightful Books",
        articles: "Essays & Articles",
        insights: "Reflections & Journal",
        keyInsight: "Core Takeaway",
        impactRating: "Mindset Impact Rating",
        openLink: "View Reference",
        noItemsFound: "No self-awareness items found",
        createModalTitle: "Record New Insight",
        itemTitleLabel: "Title or Subject",
        insightLabel: "Primary Lesson or Paradigm Shift",
        linkLabel: "Optional URL Link",
      },
      graph: {
        title: "Knowledge Graph",
        subtitle: "Interactive spatial map linking notes, projects, and goals",
        synapsesCount: "Active Synapses",
        filterAll: "All Entities",
        filterNotes: "Notes",
        filterProjects: "Projects",
        zoomIn: "Zoom In",
        zoomOut: "Zoom Out",
        resetZoom: "Reset View",
        legendTitle: "Graph Legend:",
        notesLegend: "Notes",
        projectsLegend: "Projects",
        goalsLegend: "Key Goals",
        nodeDetails: "Selected Node Details",
        openItem: "Open Details",
      },
      automation: {
        title: "Smart Automations",
        subtitle: "Define conditional rules to auto-sync tasks, projects, and reviews",
        newRule: "New Rule",
        when: "When Event Occurs:",
        then: "Automated Action:",
        lastTrigger: "Last Execution:",
        neverTriggered: "Never Triggered",
        testRunButton: "Test Run",
        testRunSuccess: "Rule executed successfully in test mode.",
        deleteRuleConfirm: "Are you sure you want to delete this automation rule?",
        createModalTitle: "Create Automation Rule",
        ruleNameLabel: "Rule Name",
        triggerLabel: "Trigger Event",
        actionLabel: "Automated Action",
        triggerTaskCompleted: "When a Task is Marked Complete",
        triggerHabitStreak: "When a 2-Day Habit Streak Breaks",
        triggerNoteCreated: "When a New Note is Created",
        triggerWeeklySchedule: "Weekly Schedule (Fridays at 9 PM)",
        actionRecalculate: "Recalculate Linked Project Progress",
        actionReminder: "Create Urgent Follow-Up Task",
        actionAiTag: "Send to AI for Auto-Tagging",
        actionWeeklyReview: "Generate Weekly Review Draft",
      },
      export: {
        title: "Data Portability & Backup",
        subtitle: "Full JSON backup and standard Markdown exports with zero lock-in",
        descriptionText: "Your data belongs solely to you. At any time, you can extract the entire second brain as a structured JSON file or standard Markdown files for import into Obsidian, Logseq, or Notion.",
        metricsTitle: "Database Entities Overview",
        storageActive: "Persistent Local Storage Active",
        notesMetric: "Notes",
        tasksMetric: "Tasks",
        projectsMetric: "Projects",
        goalsMetric: "Goals",
        habitsMetric: "Habits",
        exportJsonTitle: "Full Structured Backup (JSON)",
        exportJsonDesc: "A complete, safe copy of all entities including notes, tasks, projects, contacts, and settings.",
        exportJsonButton: "Download JSON Backup",
        exportMdTitle: "Export Notes (Markdown / Obsidian)",
        exportMdDesc: "Export all notes and atomic thoughts in standard GFM Markdown for offline reading or Obsidian vault import.",
        exportMdButton: "Download Notes (.md)",
        restoreTitle: "Restore from Backup (JSON)",
        restoreDesc: "Upload your previous JSON backup file to instantly overwrite and restore all knowledge nodes.",
        restoreButton: "Choose Backup JSON File",
        restoreSuccess: "Data restored successfully!",
        restoreError: "Error: Invalid backup file format.",
        encTitle: "End-to-End Encrypted Backup",
        encDesc: "AES-256-GCM backup encrypted on this device with your passphrase. Nobody — including us — can read it without the passphrase. Save the file to iCloud Drive, Google Drive, or any location.",
        encPassphraseLabel: "Backup passphrase (min 8 characters)",
        encCreateButton: "Create & Share Encrypted Backup",
        encRestoreButton: "Restore from Encrypted File",
        encPassTooShort: "Passphrase must be at least 8 characters.",
        encCreateSuccess: "Encrypted backup created.",
        encRestoreSuccess: "Encrypted backup restored successfully!",
        encWrongPassphrase: "Wrong passphrase or corrupted file.",
        encBadFile: "Not a valid encrypted backup file.",
        resetTitle: "Reset to Defaults",
        resetDesc: "Clear current database and reload default starter templates for a clean start.",
        resetButton: "Reset All to Defaults",
      },
    },
    modals: {
      quickCapture: {
        modalTitle: "Quick Capture",
        tabNote: "Note",
        tabTask: "Task",
        tabIdea: "Idea",
        tabBookmark: "Bookmark",
        tabVoice: "Voice",
        titlePlaceholder: "Headline or main thought...",
        contentPlaceholder: "Type your notes or bullet points...",
        bookmarkUrlPlaceholder: "https://example.com/article...",
        tagsPlaceholder: "Add tag (press Enter)...",
        addTag: "Add Tag",
        relatedProject: "Related Project",
        noProject: "No Project",
        relatedGoal: "Related Goal",
        noGoal: "No Goal",
        voiceRecordingTitle: "Smart Audio Capture",
        voiceRecordingDesc: "Click the button below to capture speech and convert it to text.",
        voiceRecordingActive: "Recording audio...",
        stopVoice: "Stop & Transcribe",
        startVoice: "Start Voice Capture",
        saveItem: "Save to Second Brain",
      },
      commandPalette: {
        searchPlaceholder: "Search notes, tasks, projects, goals, or contacts...",
        quickNoteAction: "Quickly Capture Note or Idea",
        quickNoteSubtitle: "Open the quick capture dialog",
        askAiAction: "Ask AI Assistant",
        askAiSubtitle: "Open interactive AI intelligence panel",
        viewGraphAction: "Open Knowledge Graph",
        viewGraphSubtitle: "Switch to interactive visual graph",
        navigationSection: "Navigation",
        actionsSection: "Actions & Creation",
        settingsSection: "Settings & System",
        recentSearches: "Recent Searches",
        frequentlyAccessed: "Frequently Accessed Views",
        suggestedForYou: "Suggested for you",
        clearAll: "Clear all",
        resourcesSection: "Resources & Media",
        notesSection: "Notes",
        tasksSection: "Tasks",
        projectsSection: "Projects",
        goalsSection: "Goals",
        contactsSection: "Contacts",
        noResults: "No results matched your search",
      },
      webClipper: {
        title: "Intelligent Web Clipper",
        subtitle: "Paste a web URL to extract, summarize, and link into your knowledge base",
        urlPlaceholder: "https://...",
        clipButton: "Extract & Analyze",
        clipping: "Analyzing and fetching web page...",
        extractedTitle: "Extracted Title",
        summaryLabel: "Summary & Insights",
        saveToNotes: "Save to Second Brain Notes",
      },
      aiAssistant: {
        title: "Second Brain AI Copilot",
        subtitle: "Directly linked to all your notes, tasks, projects, and goals",
        connectedState: "Knowledge base synchronized",
        clearHistory: "Clear Chat",
        emptyStatePrompt: "Hello! I am your Second Brain Copilot. Ask me to prioritize tasks, summarize notes, review habit streaks, or plan project milestones.",
        inputPlaceholder: "Type your message or prompt here...",
        sendButton: "Send Message",
        samplePrompt1: "What are my most urgent tasks for today?",
        samplePrompt2: "Summarize progress across all active projects and goals.",
        samplePrompt3: "Which habits have the highest streaks and which need focus?",
        samplePrompt4: "Generate a weekly review draft with key next actions.",
      },
    },
  },
};
