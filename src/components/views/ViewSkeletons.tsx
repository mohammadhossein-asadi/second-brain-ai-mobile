import React from "react";
import { View } from "react-native";

/**
 * Skeleton loading states for major views in Second Brain (mobile).
 */

const B = ({ h, w, br = 8, style, bg }: { h: number; w: number | `${number}%`; br?: number; style?: any; bg?: string }) => (
  <View
    style={[
      { height: h, width: w as number, borderRadius: br, backgroundColor: bg || "#262626" },
      style,
    ]}
  />
);

export const TasksSkeleton: React.FC = () => {
  return (
    <View className="gap-6 pb-12">
      {/* Reminder Banner Skeleton */}
      <View
        className="w-full rounded-3xl border border-neutral-800 bg-neutral-900/50 p-4"
        style={{ height: 96, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <B h={40} w={40} br={16} bg="rgba(38,38,38,0.7)" />
          <View style={{ gap: 8 }}>
            <B h={16} w={240} br={8} bg="rgba(38,38,38,0.8)" />
            <B h={12} w={280} br={6} bg="rgba(38,38,38,0.5)" />
          </View>
        </View>
        <B h={36} w={112} br={12} bg="rgba(38,38,38,0.6)" />
      </View>

      {/* Controls Bar Skeleton */}
      <View style={{ gap: 12 }}>
        <View
          className="items-center rounded-2xl border border-neutral-800 bg-neutral-900/80 p-1"
          style={{ flexDirection: "row", height: 40, width: 256, gap: 4 }}
        >
          <B h={32} w="32%" br={12} bg="rgba(38,38,38,0.7)" />
          <B h={32} w="32%" br={12} bg="rgba(38,38,38,0.4)" />
          <B h={32} w="32%" br={12} bg="rgba(38,38,38,0.4)" />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <B h={36} w={112} br={12} bg="rgba(38,38,38,0.7)" />
          <B h={36} w={112} br={12} bg="rgba(38,38,38,0.7)" />
          <B h={36} w={112} br={12} bg="rgba(37,99,235,0.5)" />
        </View>
      </View>

      {/* List Skeleton */}
      <View className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-4" style={{ gap: 12 }}>
        <View
          className="w-full rounded-xl bg-neutral-800/40"
          style={{ height: 40, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, gap: 16 }}
        >
          <B h={16} w={32} br={4} />
          <B h={16} w={48} br={4} />
          <B h={16} w={192} br={4} />
          <View style={{ flex: 1 }} />
          <B h={16} w={64} br={4} />
        </View>

        {Array.from({ length: 6 }).map((_, i) => (
          <View
            key={i}
            className="w-full rounded-2xl border border-neutral-800/50 bg-neutral-950/40"
            style={{ height: 56, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, gap: 16 }}
          >
            <B h={20} w={20} br={4} />
            <B h={20} w={20} br={8} />
            <View style={{ flex: 1, gap: 6 }}>
              <B h={16} w="60%" br={4} bg="rgba(38,38,38,0.9)" />
              <B h={12} w="40%" br={4} bg="rgba(38,38,38,0.4)" />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <B h={28} w={28} br={8} />
              <B h={28} w={28} br={8} />
              <B h={28} w={28} br={8} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export const NotesSkeleton: React.FC = () => {
  return (
    <View className="pb-12" style={{ gap: 20 }}>
      {/* Note List skeleton */}
      <View className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-4" style={{ gap: 12 }}>
        <B h={40} w="100%" br={16} bg="rgba(38,38,38,0.7)" />
        <View style={{ flexDirection: "row", gap: 6 }}>
          <B h={28} w={64} br={12} bg="rgba(38,38,38,0.6)" />
          <B h={28} w={80} br={12} bg="rgba(38,38,38,0.4)" />
          <B h={28} w={64} br={12} bg="rgba(38,38,38,0.4)" />
          <B h={28} w={80} br={12} bg="rgba(38,38,38,0.4)" />
        </View>

        <View style={{ gap: 10 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <View key={i} className="rounded-2xl border border-neutral-800/60 bg-neutral-950/40 p-3.5" style={{ gap: 8 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <B h={16} w="60%" br={4} bg="rgba(38,38,38,0.9)" />
                <B h={12} w={48} br={4} bg="rgba(38,38,38,0.4)" />
              </View>
              <B h={12} w="100%" br={4} bg="rgba(38,38,38,0.5)" />
              <B h={12} w="80%" br={4} bg="rgba(38,38,38,0.4)" />
              <View style={{ flexDirection: "row", gap: 4, paddingTop: 4 }}>
                <B h={16} w={48} br={4} bg="rgba(38,38,38,0.6)" />
                <B h={16} w={56} br={4} bg="rgba(38,38,38,0.6)" />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Editor skeleton */}
      <View className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6" style={{ gap: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: "#262626",
            paddingBottom: 16,
          }}
        >
          <View style={{ gap: 8, flex: 1 }}>
            <B h={28} w="66%" br={12} bg="rgba(38,38,38,0.8)" />
            <B h={12} w="33%" br={6} bg="rgba(38,38,38,0.5)" />
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <B h={36} w={80} br={12} bg="rgba(38,38,38,0.7)" />
            <B h={36} w={96} br={12} bg="rgba(38,38,38,0.7)" />
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <B h={24} w={80} br={999} bg="rgba(38,38,38,0.6)" />
          <B h={24} w={96} br={999} bg="rgba(38,38,38,0.6)" />
          <B h={24} w={64} br={999} bg="rgba(38,38,38,0.6)" />
        </View>

        <View
          className="w-full rounded-xl bg-neutral-800/40"
          style={{ height: 36, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, gap: 8 }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <B key={i} h={20} w={20} br={4} bg="rgba(38,38,38,0.7)" />
          ))}
        </View>

        <View style={{ gap: 12 }}>
          <B h={16} w="100%" br={4} bg="rgba(38,38,38,0.6)" />
          <B h={16} w="91%" br={4} bg="rgba(38,38,38,0.6)" />
          <B h={16} w="80%" br={4} bg="rgba(38,38,38,0.5)" />
          <B h={16} w="100%" br={4} bg="rgba(38,38,38,0.6)" />
          <B h={16} w="66%" br={4} bg="rgba(38,38,38,0.4)" />
          <B h={64} w="100%" br={12} bg="rgba(38,38,38,0.3)" />
          <B h={16} w="83%" br={4} bg="rgba(38,38,38,0.6)" />
          <B h={16} w="75%" br={4} bg="rgba(38,38,38,0.5)" />
        </View>
      </View>
    </View>
  );
};

export const ProjectsSkeleton: React.FC = () => {
  return (
    <View className="gap-6 pb-12">
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        <B h={40} w={96} br={12} bg="rgba(38,38,38,0.8)" />
        <B h={40} w={96} br={12} bg="rgba(38,38,38,0.5)" />
        <B h={40} w={96} br={12} bg="rgba(38,38,38,0.5)" />
        <B h={40} w={96} br={12} bg="rgba(38,38,38,0.5)" />
        <B h={40} w={128} br={12} bg="rgba(37,99,235,0.5)" />
      </View>

      <View className="gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <View
            key={i}
            className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6"
            style={{ gap: 20, justifyContent: "space-between" }}
          >
            <View>
              <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <B h={44} w={44} br={16} bg="rgba(38,38,38,0.7)" />
                  <View style={{ gap: 6 }}>
                    <B h={16} w={112} br={8} bg="rgba(38,38,38,0.9)" />
                    <B h={12} w={64} br={6} bg="rgba(38,38,38,0.5)" />
                  </View>
                </View>
                <B h={24} w={64} br={999} bg="rgba(38,38,38,0.6)" />
              </View>
              <View style={{ gap: 8, marginTop: 16 }}>
                <B h={12} w="100%" br={4} bg="rgba(38,38,38,0.6)" />
                <B h={12} w="80%" br={4} bg="rgba(38,38,38,0.4)" />
              </View>
            </View>

            <View style={{ gap: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "rgba(38,38,38,0.8)" }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <B h={12} w={56} br={4} bg="rgba(38,38,38,0.6)" />
                <B h={12} w={32} br={4} bg="rgba(38,38,38,0.8)" />
              </View>
              <B h={8} w="100%" br={999} />
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 4 }}>
                <B h={16} w={80} br={4} bg="rgba(38,38,38,0.5)" />
                <B h={16} w={96} br={4} bg="rgba(38,38,38,0.5)" />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export const GoalsSkeleton: React.FC = () => {
  return (
    <View className="gap-6 pb-12">
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        <B h={40} w={96} br={12} bg="rgba(38,38,38,0.8)" />
        <B h={40} w={96} br={12} bg="rgba(38,38,38,0.5)" />
        <B h={40} w={96} br={12} bg="rgba(38,38,38,0.5)" />
        <B h={40} w={128} br={12} bg="rgba(37,99,235,0.5)" />
      </View>

      <View className="gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <View
            key={i}
            className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6"
            style={{ gap: 20, justifyContent: "space-between" }}
          >
            <View>
              <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                <B h={24} w={80} br={999} bg="rgba(38,38,38,0.7)" />
                <View style={{ flexDirection: "row", gap: 6 }}>
                  <B h={24} w={24} br={8} />
                  <B h={24} w={24} br={8} />
                </View>
              </View>
              <B h={20} w="75%" br={8} bg="rgba(38,38,38,0.9)" style={{ marginTop: 16 }} />
              <B h={12} w="100%" br={4} bg="rgba(38,38,38,0.5)" style={{ marginTop: 8 }} />
            </View>

            <View style={{ gap: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "rgba(38,38,38,0.8)" }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <B h={12} w={64} br={4} bg="rgba(38,38,38,0.6)" />
                <B h={12} w={40} br={4} bg="rgba(38,38,38,0.8)" />
              </View>
              <B h={8} w="100%" br={999} />
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 4 }}>
                <B h={16} w={96} br={4} bg="rgba(38,38,38,0.5)" />
                <B h={16} w={80} br={4} bg="rgba(38,38,38,0.5)" />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export const HabitsSkeleton: React.FC = () => {
  return (
    <View className="gap-6 pb-12">
      {/* Header Card Skeleton */}
      <View
        className="w-full rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6"
        style={{ height: 96, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <B h={44} w={44} br={16} bg="rgba(38,38,38,0.7)" />
          <View style={{ gap: 6 }}>
            <B h={16} w={160} br={8} bg="rgba(38,38,38,0.9)" />
            <B h={12} w={224} br={4} bg="rgba(38,38,38,0.5)" />
          </View>
        </View>
        <B h={40} w={112} br={12} bg="rgba(37,99,235,0.5)" />
      </View>

      {/* Heatmap Section Skeleton */}
      <View className="w-full rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6" style={{ height: 160, gap: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <B h={16} w={144} br={4} bg="rgba(38,38,38,0.8)" />
          <B h={12} w={112} br={4} bg="rgba(38,38,38,0.4)" />
        </View>
        <B h={80} w="100%" br={16} bg="rgba(38,38,38,0.3)" />
      </View>

      {/* Habits List Skeleton */}
      <View className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-4" style={{ gap: 12 }}>
        <View
          className="w-full rounded-xl bg-neutral-800/40"
          style={{ height: 48, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, justifyContent: "space-between" }}
        >
          <B h={16} w={144} br={4} />
          <B h={16} w={80} br={4} />
          <B h={16} w={48} br={4} />
        </View>

        {Array.from({ length: 4 }).map((_, i) => (
          <View
            key={i}
            className="w-full rounded-2xl border border-neutral-800/50 bg-neutral-950/40"
            style={{ height: 64, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <B h={32} w={32} br={12} />
              <B h={16} w={128} br={4} bg="rgba(38,38,38,0.9)" />
            </View>
            <B h={24} w={64} br={999} bg="rgba(38,38,38,0.6)" />
            <B h={28} w={28} br={8} />
          </View>
        ))}
      </View>
    </View>
  );
};

export const IncomeSkeleton: React.FC = () => {
  return (
    <View className="gap-6 pb-12">
      {/* 3 Summary Cards */}
      <View style={{ gap: 16 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <View key={i} className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5" style={{ gap: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <B h={12} w={96} br={4} bg="rgba(38,38,38,0.7)" />
              <B h={32} w={32} br={12} />
            </View>
            <B h={28} w={144} br={8} bg="rgba(38,38,38,0.9)" />
            <B h={12} w={112} br={4} bg="rgba(38,38,38,0.4)" />
          </View>
        ))}
      </View>

      {/* Tabs and Add Button */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <B h={40} w={96} br={12} bg="rgba(38,38,38,0.8)" />
          <B h={40} w={96} br={12} bg="rgba(38,38,38,0.5)" />
          <B h={40} w={96} br={12} bg="rgba(38,38,38,0.5)" />
        </View>
        <B h={40} w={128} br={12} bg="rgba(37,99,235,0.5)" />
      </View>

      {/* Income Stream Cards Grid */}
      <View className="gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6" style={{ gap: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <B h={24} w={80} br={999} bg="rgba(38,38,38,0.6)" />
              <B h={24} w={24} br={8} />
            </View>
            <B h={20} w={160} br={8} bg="rgba(38,38,38,0.9)" />
            <B h={28} w={128} br={8} bg="rgba(38,38,38,0.8)" />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 8,
                borderTopWidth: 1,
                borderTopColor: "#262626",
              }}
            >
              <B h={16} w={64} br={4} bg="rgba(38,38,38,0.5)" />
              <B h={16} w={64} br={4} bg="rgba(38,38,38,0.5)" />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export const ContactsSkeleton: React.FC = () => {
  return (
    <View className="gap-6 pb-12">
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <B h={40} w={256} br={16} bg="rgba(38,38,38,0.7)" />
        <B h={40} w={128} br={12} bg="rgba(37,99,235,0.5)" />
      </View>

      <View className="gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6" style={{ gap: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <B h={48} w={48} br={16} />
              <View style={{ gap: 6, flex: 1 }}>
                <B h={16} w={112} br={8} bg="rgba(38,38,38,0.9)" />
                <B h={12} w={80} br={4} bg="rgba(38,38,38,0.5)" />
              </View>
            </View>
            <View style={{ gap: 8, paddingTop: 8 }}>
              <B h={16} w="100%" br={4} bg="rgba(38,38,38,0.4)" />
              <B h={16} w="75%" br={4} bg="rgba(38,38,38,0.4)" />
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 6,
                paddingTop: 8,
                borderTopWidth: 1,
                borderTopColor: "#262626",
              }}
            >
              <B h={20} w={56} br={999} bg="rgba(38,38,38,0.6)" />
              <B h={20} w={64} br={999} bg="rgba(38,38,38,0.6)" />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export const GenericViewSkeleton: React.FC<{ title?: string }> = () => {
  return (
    <View className="gap-6 pb-12">
      {/* Header Banner */}
      <View
        className="w-full rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6"
        style={{ height: 96, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <B h={44} w={44} br={16} bg="rgba(38,38,38,0.7)" />
          <View style={{ gap: 6 }}>
            <B h={20} w={160} br={8} bg="rgba(38,38,38,0.9)" />
            <B h={12} w={256} br={4} bg="rgba(38,38,38,0.5)" />
          </View>
        </View>
        <B h={40} w={112} br={12} bg="rgba(37,99,235,0.5)" />
      </View>

      {/* Cards Grid */}
      <View className="gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6" style={{ gap: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <B h={24} w={80} br={999} bg="rgba(38,38,38,0.6)" />
              <B h={24} w={24} br={8} />
            </View>
            <B h={20} w={160} br={8} bg="rgba(38,38,38,0.9)" />
            <View style={{ gap: 8 }}>
              <B h={12} w="100%" br={4} bg="rgba(38,38,38,0.6)" />
              <B h={12} w="80%" br={4} bg="rgba(38,38,38,0.4)" />
            </View>
            <B h={8} w="100%" br={999} />
          </View>
        ))}
      </View>
    </View>
  );
};
