import React, { useState } from "react";
import { Pressable, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Sparkles, Quote, Copy, Check, RefreshCw } from "lucide-react-native";
import { useAppStore } from "../../context/AppContext";
import { useThemeColors } from "../../lib/theme";
import { T, TBold } from "../ui/primitives";

interface AffirmationItem {
  id: string;
  category: { fa: string; en: string };
  quote: { fa: string; en: string };
  author: { fa: string; en: string };
}

const AFFIRMATION_COLLECTION: AffirmationItem[] = [
  {
    id: "aff-1",
    category: { fa: "سیستم و انضباط شخصی", en: "Systems & Discipline" },
    quote: {
      fa: "ذهن شما برای خلق ایده‌هاست، نه برای انبار کردن آن‌ها. سیستم‌های بیرونی بسازید تا ذهنتان آزاد باشد.",
      en: "Your mind is for having ideas, not holding them. Build external systems to keep your mind clear.",
    },
    author: { fa: "دیوید آلن (Getting Things Done)", en: "David Allen" },
  },
  {
    id: "aff-2",
    category: { fa: "خرده‌عادت‌ها و رشد مستمر", en: "Atomic Habits" },
    quote: {
      fa: "شما به سطح اهداف‌تان صعود نمی‌کنید، بلکه به سطح سیستم‌ها و عادت‌های روزمره‌تان فرود می‌آیید.",
      en: "You do not rise to the level of your goals. You fall to the level of your systems.",
    },
    author: { fa: "جیمز کلیر", en: "James Clear" },
  },
  {
    id: "aff-3",
    category: { fa: "تمرکز ژرف و کار عمیق", en: "Deep Work & Focus" },
    quote: {
      fa: "تمرکز یعنی نه گفتن به صد ایده فوق‌العاده دیگر، تا بتوان فقط روی مهم‌ترین هدف تمام انرژی را گذاشت.",
      en: "Focus is saying no to a hundred other good ideas to pour all your energy into what matters most.",
    },
    author: { fa: "استیو جابز", en: "Steve Jobs" },
  },
  {
    id: "aff-4",
    category: { fa: "حکمت و خودآگاهی", en: "Wisdom & Clarity" },
    quote: {
      fa: "آرامش درونی از آن لحظه‌ای آغاز می‌شود که بر آنچه در کنترل شماست تمرکز کنید و مابقی را رها سازید.",
      en: "True peace begins the moment you focus on what you can control, and release the rest.",
    },
    author: { fa: "اپیکتتوس / مکتب رواقی", en: "Epictetus" },
  },
  {
    id: "aff-5",
    category: { fa: "خلاقیت و اندیشه ناب", en: "Creativity & Insight" },
    quote: {
      fa: "ایده‌ها در انزوا شکوفا نمی‌شوند؛ پیوند دادن مفاهیم به ظاهر نامربوط است که جرقه نوآوری را می‌زند.",
      en: "Creativity is just connecting things. When you connect distant concepts, innovation is born.",
    },
    author: { fa: "پایگاه دانش و شبکه دانش", en: "Knowledge Base Philosophy" },
  },
  {
    id: "aff-6",
    category: { fa: "اقدام و شجاعت", en: "Action & Momentum" },
    quote: {
      fa: "بهترین زمان برای کاشتن یک درخت بیست سال پیش بود؛ دومین زمان عالی همین الان است.",
      en: "The best time to plant a tree was 20 years ago. The second best time is right now.",
    },
    author: { fa: "ضرب‌المثل کهن خردورزی", en: "Ancient Proverb" },
  },
];

export const DailyAffirmation: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { isRTL, showToast } = useAppStore();
  const c = useThemeColors();
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    return dayOfYear % AFFIRMATION_COLLECTION.length;
  });
  const [isCopied, setIsCopied] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const currentAffirmation = AFFIRMATION_COLLECTION[currentIndex];

  const handleNext = () => {
    setIsRotating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % AFFIRMATION_COLLECTION.length);
      setIsRotating(false);
    }, 200);
  };

  const handleCopy = async () => {
    const textToCopy = `«${isRTL ? currentAffirmation.quote.fa : currentAffirmation.quote.en}» — ${
      isRTL ? currentAffirmation.author.fa : currentAffirmation.author.en
    }`;

    try {
      await Clipboard.setStringAsync(textToCopy);
      setIsCopied(true);
      showToast(
        isRTL ? "جمله الهام‌بخش در کلیپ‌بورد کپی شد" : "Daily affirmation copied to clipboard",
        "success",
        isRTL ? "کپی شد" : "Copied"
      );
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <View
      className={className}
      style={{
        borderRadius: 24,
        borderWidth: 1,
        borderColor: c.borderColor,
        backgroundColor: c.cardSurface,
        padding: 20,
        overflow: "hidden",
      }}
    >
      {/* Decorative Quote Mark Background Watermark */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          bottom: -24,
          right: isRTL ? undefined : -24,
          left: isRTL ? -24 : undefined,
          opacity: 0.05,
        }}
      >
        <Quote size={128} color={c.accentBlue} style={{ transform: [{ rotate: "12deg" }] }} />
      </View>

      {/* Header & Category Badge */}
      <View
        style={{
          flexDirection: isRTL ? "row-reverse" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <View
          style={{
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 12,
              backgroundColor: "rgba(245,158,11,0.1)",
              borderWidth: 1,
              borderColor: "rgba(245,158,11,0.2)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles size={16} color="#f59e0b" />
          </View>
          <View>
            <TBold
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: c.textMuted,
              }}
            >
              {isRTL ? "الهام‌بخش و نگرش روز" : "Daily Affirmation & Mindset"}
            </TBold>
            <T style={{ fontSize: 12, fontWeight: "600", color: c.accentBlue }}>
              {isRTL ? currentAffirmation.category.fa : currentAffirmation.category.en}
            </T>
          </View>
        </View>

        {/* Action buttons */}
        <View
          style={{
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Pressable
            onPress={handleCopy}
            style={({ pressed }) => ({
              width: 32,
              height: 32,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: c.borderColor,
              backgroundColor: c.bgElevated,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            {isCopied ? (
              <Check size={14} color="#3b82f6" />
            ) : (
              <Copy size={14} color={c.textSecondary} />
            )}
          </Pressable>

          <Pressable
            onPress={handleNext}
            style={({ pressed }) => ({
              height: 32,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: c.borderColor,
              backgroundColor: c.bgElevated,
              paddingHorizontal: 10,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: isRTL ? "row-reverse" : "row",
              gap: 6,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <RefreshCw size={12} color={c.textSecondary} />
            <T style={{ fontSize: 11, fontWeight: "600", color: c.textSecondary }}>
              {isRTL ? "جمله بعدی" : "Next"}
            </T>
          </Pressable>
        </View>
      </View>

      {/* Quote Body */}
      <View style={{ marginVertical: 8 }}>
        <T
          style={{
            fontSize: 14,
            fontWeight: "500",
            lineHeight: 22,
            color: c.textPrimary,
            fontStyle: "italic",
            opacity: isRotating ? 0.5 : 1,
          }}
        >
          «{isRTL ? currentAffirmation.quote.fa : currentAffirmation.quote.en}»
        </T>
      </View>

      {/* Author attribution */}
      <View
        style={{
          flexDirection: isRTL ? "row-reverse" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 8,
        }}
      >
        <View
          style={{
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <View style={{ width: 12, height: 4, borderRadius: 2, backgroundColor: "#3b82f6" }} />
          <T style={{ fontSize: 12, fontWeight: "600", color: c.textSecondary }}>
            {isRTL ? currentAffirmation.author.fa : currentAffirmation.author.en}
          </T>
        </View>

        <T style={{ fontSize: 10, color: c.textMuted }}>
          {currentIndex + 1}/{AFFIRMATION_COLLECTION.length}
        </T>
      </View>
    </View>
  );
};
