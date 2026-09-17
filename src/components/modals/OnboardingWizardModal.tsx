import React, { useState } from "react";
import { View, Pressable, ScrollView, Modal } from "react-native";
import {
  Sparkles,
  CheckCircle2,
  Brain,
  Keyboard,
  ArrowRight,
  ArrowLeft,
  X,
  Layers,
  FolderGit2,
  Compass,
  Zap,
  Bot,
  Moon,
  Sun,
  Languages,
  FileText,
} from "lucide-react-native";
import { useSecondBrain } from "../../context/SecondBrainContext";
import { ActiveView } from "../../types";
import { playAutoSaveChime } from "../../utils/audio";
import { T } from "../ui/primitives";

export const OnboardingWizardModal: React.FC = () => {
  const {
    isOnboardingOpen,
    setIsOnboardingOpen,
    isRTL,
    language,
    toggleLanguage,
    theme,
    toggleTheme,
    activeView,
    setActiveView,
    showToast,
  } = useSecondBrain();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedInitialView, setSelectedInitialView] = useState<ActiveView>("dashboard");

  const isFa = language === "fa";

  const totalSteps = 4;

  const stepsMeta = [
    {
      id: "welcome",
      titleFa: "خوش‌آمدید به مغز دوم",
      titleEn: "Welcome to Second Brain AI",
      icon: Brain,
    },
    {
      id: "features",
      titleFa: "ارکان و ویژگی‌های کلیدی",
      titleEn: "Core Features & Architecture",
      icon: Layers,
    },
    {
      id: "shortcuts",
      titleFa: "ابزارهای سریع و لمسی",
      titleEn: "Supercharged Touch & Actions",
      icon: Keyboard,
    },
    {
      id: "personalize",
      titleFa: "شخصی‌سازی و شروع به کار",
      titleEn: "Personalize & Launch",
      icon: Sparkles,
    },
  ];

  if (!isOnboardingOpen) return null;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    setIsOnboardingOpen(false);
    if (selectedInitialView !== activeView) {
      setActiveView(selectedInitialView);
    }
    playAutoSaveChime(0.1);
    showToast(
      isFa
        ? "به مغز دوم خوش آمدید! هر زمان مایل باشید می‌توانید مجدداً تور را مشاهده کنید."
        : "Welcome to Second Brain! You can revisit this tour anytime from the header menu.",
      "success",
      isFa ? "آماده به کار" : "Ready to Go",
      4000
    );
  };

  const StepIcon = stepsMeta[currentStep].icon;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={handleFinish} statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: "rgba(2,6,23,0.88)", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <View
          style={{
            width: "100%",
            maxWidth: 560,
            maxHeight: "92%",
            borderRadius: 16,
            backgroundColor: "#0f172a",
            borderWidth: 1,
            borderColor: "#1e293b",
            overflow: "hidden",
          }}
        >
          {/* Top Progress Bar & Header */}
          <View style={{ paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "rgba(30,41,59,0.8)" }}>
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 10 }}>
                <View style={{ padding: 8, borderRadius: 12, backgroundColor: "rgba(59,130,246,0.15)" }}>
                  <StepIcon size={20} color="#60a5fa" />
                </View>
                <View>
                  <T style={{ fontSize: 11, fontWeight: "700", color: "#60a5fa", letterSpacing: 1 }}>
                    {isFa ? `گام ${currentStep + 1} از ${totalSteps}` : `Step ${currentStep + 1} of ${totalSteps}`}
                  </T>
                  <T style={{ fontSize: 15, fontWeight: "700", color: "#ffffff" }}>
                    {isFa ? stepsMeta[currentStep].titleFa : stepsMeta[currentStep].titleEn}
                  </T>
                </View>
              </View>

              <Pressable onPress={handleFinish} style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 4 }}>
                <T style={{ fontSize: 12, color: "#94a3b8" }}>{isFa ? "رد کردن" : "Skip"}</T>
                <X size={14} color="#94a3b8" />
              </Pressable>
            </View>

            {/* Stepper */}
            <View style={{ flexDirection: "row", gap: 8 }}>
              {stepsMeta.map((_, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => setCurrentStep(idx)}
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor:
                      idx === currentStep
                        ? "#2563eb"
                        : idx < currentStep
                        ? "rgba(59,130,246,0.4)"
                        : "#1e293b",
                  }}
                />
              ))}
            </View>
          </View>

          {/* Step Content */}
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 16 }}>
            {/* STEP 1: Welcome */}
            {currentStep === 0 && (
              <View style={{ gap: 16 }}>
                <View
                  style={{
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    gap: 16,
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor: "rgba(23,37,84,0.2)",
                    borderWidth: 1,
                    borderColor: "rgba(30,58,138,0.4)",
                  }}
                >
                  <View
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 16,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#2563eb",
                    }}
                  >
                    <Brain size={32} color="#ffffff" />
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <T style={{ fontSize: 15, fontWeight: "700", color: "#ffffff" }}>
                      {isFa ? "مغز دوم؛ پایگاه متمرکز اندیشه و اقدام شما" : "Your Digital Cognitive Second Brain"}
                    </T>
                    <T style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 20 }}>
                      {isFa
                        ? "این سیستم با الهام از متدولوژی P.A.R.A و متد CODE طراحی شده تا تمام یادداشت‌ها، پروژه‌ها و وظایف خود را در محیطی امن و بدون حواس‌پرتی سازماندهی کنید."
                        : "Your mind is for having ideas, not holding them. Built upon the P.A.R.A and CODE methodologies to turn spontaneous thoughts into active execution."}
                    </T>
                  </View>
                </View>

                <View style={{ gap: 8 }}>
                  <T style={{ fontSize: 12, fontWeight: "600", color: "#94a3b8" }}>
                    {isFa ? "چرخه عملکردی ۴ گانه (C.O.D.E):" : "The 4-Step C.O.D.E Lifecycle:"}
                  </T>
                  {[
                    { icon: <Zap size={16} color="#34d399" />, title: isFa ? "۱. ثبت سریع (Capture)" : "1. Capture Fast", desc: isFa ? "ثبت بی‌درنگ افکار و ایده‌ها با دکمه ثبت سریع" : "Instantly record insights and tasks via quick capture" },
                    { icon: <FolderGit2 size={16} color="#818cf8" />, title: isFa ? "۲. سازماندهی (Organize)" : "2. Organize by Action", desc: isFa ? "دسته‌بندی پوشه‌ای و تخصیص تسک‌ها به پروژه‌های فعال" : "P.A.R.A folders: Projects, Areas, Resources, Archives" },
                    { icon: <Bot size={16} color="#fbbf24" />, title: isFa ? "۳. پالایش هوشمند (Distill)" : "3. Distill with AI", desc: isFa ? "خلاصه‌سازی تک‌جمله‌ای، تولید تگ‌ها و لینک‌سازی خودکار" : "Smart summaries, tag generation, and auto-linking" },
                    { icon: <CheckCircle2 size={16} color="#60a5fa" />, title: isFa ? "۴. اقدام و اجرا (Express)" : "4. Express & Execute", desc: isFa ? "پیگیری روزانه، اهداف، ماتریس اولویت و زنجیره عادت‌ها" : "Eisenhower matrix, streak trackers, and project outcomes" },
                  ].map((pillar, idx) => (
                    <View
                      key={idx}
                      style={{
                        flexDirection: isRTL ? "row-reverse" : "row",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: 12,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: "rgba(30,41,59,0.8)",
                        backgroundColor: "rgba(30,41,59,0.3)",
                      }}
                    >
                      {pillar.icon}
                      <View style={{ flex: 1 }}>
                        <T style={{ fontSize: 12, fontWeight: "700", color: "#e2e8f0" }}>{pillar.title}</T>
                        <T style={{ fontSize: 11, color: "#94a3b8", marginTop: 2, lineHeight: 17 }}>{pillar.desc}</T>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* STEP 2: Core Features */}
            {currentStep === 1 && (
              <View style={{ gap: 12 }}>
                {[
                  { icon: <FileText size={16} color="#60a5fa" />, color: "#60a5fa", title: isFa ? "پایگاه یادداشت‌ها و Zettelkasten" : "Knowledge Vault & Daily Notes", desc: isFa ? "ویرایشگر روان مارک‌داون، یادداشت روزانه سریع با یک کلیک، قالب‌های ساخت‌یافته و ارتباط لینک‌های دوطرفه." : "Rich markdown editor, one-click daily logs, smart reusable templates, and bi-directional linking." },
                  { icon: <CheckCircle2 size={16} color="#34d399" />, color: "#34d399", title: isFa ? "ماتریس تسک‌ها و پروژه‌ها" : "Task Matrix & Project Engine", desc: isFa ? "اولویت‌بندی فوری/مهم، سازماندهی کانبان، اتصال تسک‌ها به پروژه‌ها و یادآورهای تاریخ سررسید." : "Eisenhower quadrant prioritization, Kanban workflows, milestone tracking, and overdue reminders." },
                  { icon: <Compass size={16} color="#c084fc" />, color: "#c084fc", title: isFa ? "گراف تعاملی و خودکارسازی" : "Interactive Graph & Workflows", desc: isFa ? "نقشه شبکه ارتباطات دو بعدی بین مفاهیم همراه با موتور خودکارسازی قواعد." : "Visual synapse network of ideas, plus an event-driven automation engine." },
                ].map((f, idx) => (
                  <View
                    key={idx}
                    style={{
                      padding: 14,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: "#1e293b",
                      backgroundColor: "#0b1220",
                      gap: 6,
                    }}
                  >
                    <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
                      {f.icon}
                      <T style={{ fontSize: 12, fontWeight: "600", color: f.color }}>{f.title}</T>
                    </View>
                    <T style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 19 }}>{f.desc}</T>
                  </View>
                ))}

                {/* Privacy banner */}
                <View
                  style={{
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    gap: 12,
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: "rgba(30,41,59,0.5)",
                    borderWidth: 1,
                    borderColor: "rgba(51,65,85,0.6)",
                  }}
                >
                  <T style={{ fontSize: 12, color: "#cbd5e1", flex: 1, lineHeight: 18 }}>
                    {isFa
                      ? "امن و آفلاین: تمام داده‌های شما به‌صورت محلی روی دستگاه ذخیره می‌شوند و همیشه در دسترسند."
                      : "Privacy-first & Offline: Your data remains locally stored on-device and persists without internet requirements."}
                  </T>
                </View>
              </View>
            )}

            {/* STEP 3: Essential Actions (touch equivalents) */}
            {currentStep === 2 && (
              <View style={{ gap: 10 }}>
                <T style={{ fontSize: 12, color: "#94a3b8", lineHeight: 18 }}>
                  {isFa
                    ? "این ابزارهای اصلی را به خاطر بسپارید — همه از نوار بالای صفحه در دسترس‌اند:"
                    : "These power tools live in the header — always one tap away:"}
                </T>

                {[
                  { icon: <Bot size={16} color="#818cf8" />, title: isFa ? "پالت دستورات و جستجوی سراسری" : "Command Palette & Universal Search", desc: isFa ? "جستجو در کل پایگاه داده و اجرای فرمان‌ها" : "Instant search across all notes, tasks and actions" },
                  { icon: <Zap size={16} color="#34d399" />, title: isFa ? "ثبت سریع ایده یا وظیفه" : "Quick Capture", desc: isFa ? "یادداشت ایده در ۱ ثانیه بدون ترک صفحه کنونی" : "Capture any thought in 1 second without leaving view" },
                  { icon: <Keyboard size={16} color="#fbbf24" />, title: isFa ? "حالت تمرکز" : "Focus Mode", desc: isFa ? "پنهان‌سازی سایدبار و نوارها برای تمرکز بیشتر" : "Distraction-free view hiding all chrome" },
                ].map((s, idx) => (
                  <View
                    key={idx}
                    style={{
                      flexDirection: isRTL ? "row-reverse" : "row",
                      alignItems: "center",
                      gap: 10,
                      padding: 12,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: "rgba(30,41,59,0.8)",
                      backgroundColor: "rgba(30,41,59,0.4)",
                    }}
                  >
                    <View style={{ padding: 6, borderRadius: 10, backgroundColor: "rgba(59,130,246,0.1)" }}>{s.icon}</View>
                    <View style={{ flex: 1 }}>
                      <T style={{ fontSize: 12, fontWeight: "700", color: "#ffffff" }}>{s.title}</T>
                      <T style={{ fontSize: 11, color: "#94a3b8" }}>{s.desc}</T>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* STEP 4: Personalize */}
            {currentStep === 3 && (
              <View style={{ gap: 14 }}>
                <T style={{ fontSize: 12, fontWeight: "600", color: "#94a3b8" }}>
                  {isFa ? "سفارشی‌سازی تنظیمات اولیه:" : "Initial Workspace Preferences:"}
                </T>

                {/* Language */}
                <View
                  style={{
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 14,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "rgba(30,41,59,0.8)",
                    backgroundColor: "rgba(30,41,59,0.3)",
                  }}
                >
                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 10 }}>
                    <Languages size={16} color="#60a5fa" />
                    <View>
                      <T style={{ fontSize: 12, fontWeight: "700", color: "#ffffff" }}>
                        {isFa ? "زبان برنامه" : "App Language"}
                      </T>
                      <T style={{ fontSize: 10, color: "#64748b" }}>
                        {isFa ? "راست‌چین یا چپ‌چین" : "Persian (RTL) / English (LTR)"}
                      </T>
                    </View>
                  </View>
                  <Pressable
                    onPress={toggleLanguage}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#334155",
                      backgroundColor: "#1e293b",
                    }}
                  >
                    <T style={{ fontSize: 12, fontWeight: "600", color: "#e2e8f0" }}>
                      {isFa ? "فارسی (FA)" : "English (EN)"}
                    </T>
                  </Pressable>
                </View>

                {/* Theme */}
                <View
                  style={{
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 14,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "rgba(30,41,59,0.8)",
                    backgroundColor: "rgba(30,41,59,0.3)",
                  }}
                >
                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 10 }}>
                    {theme === "dark" ? <Moon size={16} color="#818cf8" /> : <Sun size={16} color="#f59e0b" />}
                    <View>
                      <T style={{ fontSize: 12, fontWeight: "700", color: "#ffffff" }}>
                        {isFa ? "پوسته دیداری" : "Visual Theme"}
                      </T>
                      <T style={{ fontSize: 10, color: "#64748b" }}>
                        {theme === "dark" ? (isFa ? "حالت تاریک" : "Dark Mode") : isFa ? "حالت روشن" : "Light Mode"}
                      </T>
                    </View>
                  </View>
                  <Pressable
                    onPress={toggleTheme}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#334155",
                      backgroundColor: "#1e293b",
                    }}
                  >
                    <T style={{ fontSize: 12, fontWeight: "600", color: "#e2e8f0" }}>
                      {theme === "dark" ? (isFa ? "تاریک 🌙" : "Dark 🌙") : isFa ? "روشن ☀️" : "Light ☀️"}
                    </T>
                  </Pressable>
                </View>

                {/* Starting View */}
                <View style={{ gap: 8 }}>
                  <T style={{ fontSize: 12, fontWeight: "600", color: "#cbd5e1" }}>
                    {isFa ? "صفحه پیش‌فرض برای شروع:" : "Choose your primary start page:"}
                  </T>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {(
                      [
                        { view: "dashboard" as ActiveView, icon: <Brain size={16} color="#60a5fa" />, label: isFa ? "داشبورد" : "Dashboard" },
                        { view: "tasks" as ActiveView, icon: <CheckCircle2 size={16} color="#34d399" />, label: isFa ? "تسک‌ها" : "Tasks" },
                        { view: "notes" as ActiveView, icon: <FileText size={16} color="#38bdf8" />, label: isFa ? "یادداشت‌ها" : "Notes" },
                      ]
                    ).map((opt) => {
                      const isSel = selectedInitialView === opt.view;
                      return (
                        <Pressable
                          key={opt.view}
                          onPress={() => setSelectedInitialView(opt.view)}
                          style={{
                            flex: 1,
                            padding: 10,
                            borderRadius: 12,
                            borderWidth: 1,
                            alignItems: "center",
                            borderColor: isSel ? "#2563eb" : "#1e293b",
                            backgroundColor: isSel ? "rgba(23,37,84,0.4)" : "#0b1220",
                          }}
                        >
                          {opt.icon}
                          <T
                            style={{
                              fontSize: 12,
                              marginTop: 4,
                              fontWeight: isSel ? "700" : "400",
                              color: isSel ? "#93c5fd" : "#94a3b8",
                            }}
                          >
                            {opt.label}
                          </T>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    gap: 12,
                    padding: 14,
                    borderRadius: 12,
                    backgroundColor: "rgba(37,99,235,0.1)",
                    borderWidth: 1,
                    borderColor: "rgba(59,130,246,0.2)",
                  }}
                >
                  <Sparkles size={20} color="#60a5fa" />
                  <T style={{ fontSize: 12, color: "#cbd5e1", flex: 1, lineHeight: 18 }}>
                    {isFa
                      ? "همه چیز آماده است! با دکمه پایانی شروع کنید."
                      : "You're all set! Press 'Launch' below to begin your flow state."}
                  </T>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Footer Navigation Bar */}
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: "rgba(30,41,59,0.8)",
              paddingHorizontal: 20,
              paddingVertical: 14,
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              {currentStep > 0 ? (
                <Pressable
                  onPress={handlePrev}
                  style={({ pressed }) => ({
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    gap: 6,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 12,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  {isRTL ? <ArrowRight size={14} color="#cbd5e1" /> : <ArrowLeft size={14} color="#cbd5e1" />}
                  <T style={{ fontSize: 12, fontWeight: "600", color: "#cbd5e1" }}>
                    {isFa ? "گام قبلی" : "Back"}
                  </T>
                </Pressable>
              ) : null}
            </View>

            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
              {currentStep < totalSteps - 1 ? (
                <Pressable
                  onPress={handleNext}
                  style={({ pressed }) => ({
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    gap: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 12,
                    backgroundColor: pressed ? "#1d4ed8" : "#2563eb",
                  })}
                >
                  <T style={{ fontSize: 12, fontWeight: "700", color: "#ffffff" }}>
                    {isFa ? "گام بعدی" : "Next Step"}
                  </T>
                  {isRTL ? <ArrowLeft size={14} color="#ffffff" /> : <ArrowRight size={14} color="#ffffff" />}
                </Pressable>
              ) : (
                <Pressable
                  onPress={handleFinish}
                  style={({ pressed }) => ({
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    gap: 8,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 12,
                    backgroundColor: pressed ? "#4f46e5" : "#4338ca",
                  })}
                >
                  <Sparkles size={16} color="#ffffff" />
                  <T style={{ fontSize: 12, fontWeight: "700", color: "#ffffff" }}>
                    {isFa ? "شروع کار با مغز دوم" : "Launch My Second Brain"}
                  </T>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
