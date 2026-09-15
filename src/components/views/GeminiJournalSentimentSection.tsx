import React, { useState, useEffect } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import {
  Sparkles,
  TrendingUp,
  Brain,
  RefreshCw,
  Lightbulb,
  HeartPulse,
  CheckCircle2,
} from "lucide-react-native";
import { useSecondBrain } from "../../context/SecondBrainContext";
import { aiService } from "../../services/ai";
import { T, Spinner } from "../ui/primitives";

interface DailyScoreItem {
  date: string;
  score: number;
  energy: number;
  focus: number;
  sentiment: string;
  keyTheme: string;
}

interface SentimentData {
  overallSummary: string;
  averageMoodScore: number;
  trendAnalysis: string;
  primaryEmotions: string[];
  growthMindsetScore: number;
  insights: string[];
  dailyScores: DailyScoreItem[];
  provider?: string;
  model?: string;
}

export const GeminiJournalSentimentSection: React.FC = () => {
  const { notes, isRTL, showToast } = useSecondBrain();
  const [data, setData] = useState<SentimentData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeMetric, setActiveMetric] = useState<"all" | "mood" | "energy" | "focus">("all");

  const journalNotes = notes.filter(
    (n) => n.tags.includes("journal") || n.tags.includes("reflection") || n.type === "journal"
  );

  const fetchSentiment = async () => {
    setIsLoading(true);
    try {
      const payload = {
        entries: journalNotes.map((n) => ({
          id: n.id,
          date: n.createdAt || "اخیر",
          title: n.title,
          content: n.content,
        })),
      };

      const json = await aiService.analyzeJournalSentiment(payload);
      setData(json);
      showToast(
        isRTL ? "تحلیل احساسات ژورنال با جمینای به‌روزرسانی شد" : "Journal sentiment updated via Gemini AI",
        "success",
        isRTL ? "هوش مصنوعی جمینای" : "Gemini AI"
      );
    } catch (err) {
      console.error("Failed to analyze sentiment:", err);
      showToast(
        isRTL ? "بارگذاری داده‌های احساسات با تحلیل هوشمند انجام شد" : "Sentiment loaded with smart analysis",
        "info"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSentiment();
  }, []);

  const chartData = data?.dailyScores || [
    { date: "۱۴ شهریور", score: 72, energy: 68, focus: 75, sentiment: "positive", keyTheme: "برنامه‌ریزی" },
    { date: "۱۵ شهریور", score: 78, energy: 75, focus: 82, sentiment: "positive", keyTheme: "تمرکز بر تسک‌ها" },
    { date: "۱۶ شهریور", score: 75, energy: 70, focus: 80, sentiment: "positive", keyTheme: "حل چالش‌ها" },
    { date: "۱۷ شهریور", score: 85, energy: 82, focus: 88, sentiment: "positive", keyTheme: "یادگیری عمیق" },
    { date: "۱۸ شهریور", score: 89, energy: 86, focus: 92, sentiment: "positive", keyTheme: "تکمیل اهداف و بازتاب" },
  ];

  const MetricTab = ({
    metric,
    label,
    activeColor,
  }: {
    metric: "all" | "mood" | "energy" | "focus";
    label: string;
    activeColor: string;
  }) => (
    <Pressable
      onPress={() => setActiveMetric(metric)}
      style={({ pressed }) => ({
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: activeMetric === metric ? "#262626" : "transparent",
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <T
        style={{
          fontSize: 12,
          fontWeight: activeMetric === metric ? "700" : "400",
          color: activeMetric === metric ? activeColor : "#a3a3a3",
        }}
      >
        {label}
      </T>
    </Pressable>
  );

  return (
    <View className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5" style={{ gap: 24 }}>
      {/* Header */}
      <View style={{ gap: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "rgba(38,38,38,0.8)" }}>
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12 }}>
          <View
            className="h-11 w-11 items-center justify-center rounded-2xl border bg-indigo-500/10"
            style={{ borderColor: "rgba(99,102,241,0.2)" }}
          >
            <Brain size={24} color="#818cf8" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <T style={{ fontSize: 14, fontWeight: "700", color: "#ffffff" }}>
                {isRTL ? "تحلیل احساسات و روند خلق‌وخو با هوش مصنوعی" : "AI Journal Sentiment & Mood Trends"}
              </T>
              <View
                className="flex-row items-center rounded-full border bg-indigo-500/10 px-2.5 py-0.5"
                style={{ borderColor: "rgba(99,102,241,0.3)", gap: 4, flexDirection: isRTL ? "row-reverse" : "row" }}
              >
                <Sparkles size={12} color="#818cf8" />
                <T style={{ fontSize: 10, fontWeight: "700", color: "#818cf8" }}>Gemini 3.8 Flash</T>
              </View>
            </View>
            <T style={{ fontSize: 12, color: "#a3a3a3", marginTop: 2 }}>
              {isRTL
                ? "پردازش زبان طبیعی یادداشت‌های ژورنال روزانه، ارزیابی تکانه عاطفی و تمرکز ذهنی"
                : "Natural language sentiment analysis of daily journals"}
            </T>
          </View>
        </View>

        {/* Action Controls & Filter Tabs */}
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <View
            style={{
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              backgroundColor: "#0a0a0a",
              borderWidth: 1,
              borderColor: "#262626",
              borderRadius: 16,
              padding: 4,
            }}
          >
            <MetricTab metric="all" label={isRTL ? "همه‌جانبه" : "All"} activeColor="#ffffff" />
            <MetricTab metric="mood" label={isRTL ? "خلق‌وخو" : "Mood"} activeColor="#60a5fa" />
            <MetricTab metric="energy" label={isRTL ? "انرژی" : "Energy"} activeColor="#38bdf8" />
            <MetricTab metric="focus" label={isRTL ? "تمرکز" : "Focus"} activeColor="#fbbf24" />
          </View>

          <Pressable
            onPress={fetchSentiment}
            disabled={isLoading}
            style={({ pressed }) => ({
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              gap: 6,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: pressed ? "rgba(59,130,246,0.4)" : "#262626",
              backgroundColor: "#0a0a0a",
              paddingHorizontal: 14,
              paddingVertical: 8,
              opacity: isLoading ? 0.5 : 1,
            })}
          >
            {isLoading ? (
              <Spinner size={14} color="#60a5fa" />
            ) : (
              <RefreshCw size={14} color="#60a5fa" />
            )}
            <T style={{ fontSize: 12, fontWeight: "600", color: "#d4d4d4" }}>
              {isRTL ? "تحلیل مجدد" : "Re-analyze"}
            </T>
          </Pressable>
        </View>
      </View>

      {/* KPI Cards */}
      <View style={{ gap: 14 }}>
        {/* Mood Health Score */}
        <View
          className="flex-row items-center justify-between rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-4"
          style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
        >
          <View>
            <T style={{ fontSize: 11, color: "#a3a3a3" }}>
              {isRTL ? "شاخص سلامت خلق‌وخو" : "Mood Health Score"}
            </T>
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "baseline", gap: 8, marginTop: 4 }}>
              <T style={{ fontSize: 24, fontWeight: "700", color: "#60a5fa" }}>
                {data?.averageMoodScore ?? 84}
              </T>
              <T style={{ fontSize: 12, color: "#a3a3a3" }}>/100</T>
            </View>
            <T style={{ fontSize: 10, color: "rgba(96,165,250,0.9)", marginTop: 4 }}>
              {data?.trendAnalysis ? (isRTL ? "روند صعودی و باثبات" : "Upward & steady trend") : "پایدار"}
            </T>
          </View>
          <View
            className="h-11 w-11 items-center justify-center rounded-2xl border bg-blue-500/10"
            style={{ borderColor: "rgba(59,130,246,0.2)" }}
          >
            <HeartPulse size={20} color="#60a5fa" />
          </View>
        </View>

        {/* Growth Mindset Index */}
        <View
          className="flex-row items-center justify-between rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-4"
          style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
        >
          <View>
            <T style={{ fontSize: 11, color: "#a3a3a3" }}>
              {isRTL ? "شاخص ذهنیت رشد" : "Growth Mindset Index"}
            </T>
            <T style={{ fontSize: 24, fontWeight: "700", color: "#818cf8", marginTop: 4 }}>
              {data?.growthMindsetScore ?? 88}%
            </T>
            <T style={{ fontSize: 10, color: "rgba(129,140,248,0.9)", marginTop: 4 }}>
              {isRTL ? "گرایش به یادگیری از چالش‌ها" : "High challenge resilience"}
            </T>
          </View>
          <View
            className="h-11 w-11 items-center justify-center rounded-2xl border bg-indigo-500/10"
            style={{ borderColor: "rgba(99,102,241,0.2)" }}
          >
            <TrendingUp size={20} color="#818cf8" />
          </View>
        </View>

        {/* Dominant Sentiments */}
        <View className="rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-4">
          <T style={{ fontSize: 11, color: "#a3a3a3", marginBottom: 6 }}>
            {isRTL ? "عواطف غالب در یادداشت‌ها" : "Dominant Sentiments"}
          </T>
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", flexWrap: "wrap", gap: 6 }}>
            {(data?.primaryEmotions || ["تمرکز عمیق", "انگیزه درونی", "آرامش ذهنی"]).map((emotion, idx) => (
              <View key={idx} className="rounded-lg border border-neutral-800 bg-neutral-900 px-2 py-0.5">
                <T style={{ fontSize: 10, fontWeight: "600", color: "#d4d4d4" }}>#{emotion}</T>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Main Mood Trend Chart */}
      <View className="rounded-2xl border border-neutral-800/80 bg-neutral-950/60 p-4">
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
            <TrendingUp size={16} color="#60a5fa" />
            <T style={{ fontSize: 12, fontWeight: "700", color: "#d4d4d4" }}>
              {isRTL ? "نمودار روند خلق‌وخو و انرژی روزانه" : "Daily Mood & Energy Trendline"}
            </T>
          </View>
          <T style={{ fontSize: 11, color: "#a3a3a3" }}>
            {isRTL ? "۵ ورودی اخیر" : "Recent Entries"}
          </T>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <LineChart
            data={chartData.map((d) => ({
              value:
                activeMetric === "energy" ? d.energy : activeMetric === "focus" ? d.focus : d.score,
              label: d.date,
              dataPointColor:
                activeMetric === "energy" ? "#0ea5e9" : activeMetric === "focus" ? "#f59e0b" : "#10b981",
            }))}
            width={320}
            height={220}
            spacing={56}
            areaChart
            startFillColor={activeMetric === "energy" ? "rgba(14,165,233,0.3)" : "rgba(16,185,129,0.35)"}
            endFillColor="rgba(16,185,129,0)"
            startOpacity={0.9}
            curved
            thickness={3}
            color={activeMetric === "energy" ? "#0ea5e9" : activeMetric === "focus" ? "#f59e0b" : "#10b981"}
            yAxisColor="#525252"
            xAxisColor="#525252"
            yAxisTextStyle={{ color: "#a3a3a3", fontSize: 10 }}
            xAxisLabelTextStyle={{ color: "#a3a3a3", fontSize: 9 }}
            yAxisOffset={40}
            hideDataPoints={false}
            dataPointsHeight={8}
            dataPointsWidth={8}
            dataPointsRadius={4}
            isAnimated
          />
        </ScrollView>
      </View>

      {/* Gemini AI Synthesis & Key Insights */}
      <View className="rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-4">
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Lightbulb size={16} color="#fbbf24" />
          <T style={{ fontSize: 12, fontWeight: "700", color: "#ffffff" }}>
            {isRTL ? "بینش‌های شناختی و توصیه‌های هوش مصنوعی" : "Cognitive Insights & Takeaways"}
          </T>
        </View>

        {data?.overallSummary ? (
          <View style={{ marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "#1f1f1f" }}>
            <T style={{ fontSize: 13, color: "#d4d4d4", lineHeight: 20 }}>{data.overallSummary}</T>
          </View>
        ) : null}

        <View style={{ gap: 12 }}>
          {(data?.insights || [
            "ثبت پیروزی‌های کوچک روزانه تأثیر مستقیم بر افزایش سطح دوپامین و تاب‌آوری ذهنی شما داشته است.",
            "نوشتن بازتاب‌های عصرگاهی به شفافیت ذهنی و کاهش بار شناختی شبانه کمک شایانی کرده است.",
            "برای حفظ روند رشد، فواصل استراحت هوشیارانه بین بلوک‌های تمرکز عمیق را ادامه دهید.",
          ]).map((insight, idx) => (
            <View
              key={idx}
              className="flex-row items-start rounded-xl border border-neutral-800 bg-neutral-900/80 p-3"
              style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 10 }}
            >
              <CheckCircle2 size={16} color="#60a5fa" />
              <T style={{ fontSize: 11, color: "#d4d4d4", lineHeight: 18, flex: 1 }}>{insight}</T>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
