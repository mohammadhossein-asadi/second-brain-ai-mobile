import React from "react";
import { View } from "react-native";

const B = ({ h, w, br = 8, style, bg }: { h: number; w: number | `${number}%`; br?: number; style?: any; bg?: string }) => (
  <View
    style={[
      { height: h, width: w as number, borderRadius: br, backgroundColor: bg || "#262626" },
      style,
    ]}
  />
);

export const CoreObjectiveSkeleton: React.FC = () => (
  <View
    className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6"
  >
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
      <B h={14} w={128} br={999} />
      <B h={20} w={48} br={999} bg="rgba(59,130,246,0.2)" />
    </View>

    <B h={28} w="75%" br={12} style={{ marginBottom: 12 }} />
    <B h={28} w="50%" br={12} bg="rgba(38,38,38,0.8)" style={{ marginBottom: 16 }} />

    <View style={{ gap: 8, marginTop: 8 }}>
      <B h={12} w="100%" br={6} bg="rgba(38,38,38,0.6)" />
      <B h={12} w="83%" br={6} bg="rgba(38,38,38,0.6)" />
    </View>

    <View style={{ marginTop: 24, height: 8, width: "100%", borderRadius: 999, backgroundColor: "#262626", overflow: "hidden" }}>
      <View style={{ height: "100%", borderRadius: 999, backgroundColor: "rgba(59,130,246,0.4)", width: "66%" }} />
    </View>

    <View
      style={{
        marginTop: 32,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: "rgba(38,38,38,0.8)",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <View style={{ flexDirection: "row", gap: 32 }}>
        <View>
          <B h={32} w={56} br={8} bg="rgba(59,130,246,0.2)" style={{ marginBottom: 4 }} />
          <B h={12} w={80} br={6} bg="rgba(38,38,38,0.8)" />
        </View>
        <View>
          <B h={32} w={56} br={8} style={{ marginBottom: 4 }} />
          <B h={12} w={96} br={6} bg="rgba(38,38,38,0.8)" />
        </View>
      </View>
      <B h={36} w={128} br={12} />
    </View>
  </View>
);

export const HabitStreakSkeleton: React.FC = () => (
  <View className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5">
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      <B h={40} w={40} br={16} bg="rgba(245,158,11,0.1)" />
      <B h={12} w={80} br={999} />
    </View>

    <View style={{ marginTop: 16 }}>
      <B h={12} w={96} br={6} bg="rgba(38,38,38,0.8)" style={{ marginBottom: 8 }} />
      <B h={36} w={80} br={8} />
      <View style={{ marginTop: 12, flexDirection: "row", alignItems: "center", gap: 8 }}>
        <B h={12} w={12} br={999} bg="rgba(59,130,246,0.3)" />
        <B h={12} w={144} br={6} bg="rgba(59,130,246,0.2)" />
      </View>
    </View>
  </View>
);

export const WeeklyLoadSkeleton: React.FC = () => (
  <View className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5">
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <B h={12} w={96} br={999} />
      <B h={16} w={16} br={4} />
    </View>

    <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 6, height: 64, paddingTop: 8 }}>
      <View style={{ flex: 1, backgroundColor: "rgba(38,38,38,0.7)", height: "35%", borderRadius: 6 }} />
      <View style={{ flex: 1, backgroundColor: "rgba(38,38,38,0.7)", height: "60%", borderRadius: 6 }} />
      <View style={{ flex: 1, backgroundColor: "rgba(59,130,246,0.3)", height: "85%", borderRadius: 6 }} />
      <View style={{ flex: 1, backgroundColor: "rgba(38,38,38,0.7)", height: "50%", borderRadius: 6 }} />
      <View style={{ flex: 1, backgroundColor: "rgba(38,38,38,0.7)", height: "30%", borderRadius: 6 }} />
      <View style={{ flex: 1, backgroundColor: "rgba(38,38,38,0.7)", height: "70%", borderRadius: 6 }} />
      <View style={{ flex: 1, backgroundColor: "rgba(96,165,250,0.4)", height: "80%", borderRadius: 6 }} />
    </View>

    <View style={{ marginTop: 12, flexDirection: "row", justifyContent: "space-between" }}>
      <B h={10} w={56} br={4} bg="rgba(38,38,38,0.8)" />
      <B h={10} w={64} br={4} bg="rgba(59,130,246,0.3)" />
    </View>
  </View>
);

export const UrgentTasksSkeleton: React.FC = () => (
  <View className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5">
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          paddingBottom: 8,
          borderBottomWidth: 1,
          borderBottomColor: "#262626",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <B h={16} w={16} br={4} bg="rgba(59,130,246,0.3)" />
          <B h={14} w={128} br={999} />
        </View>
        <B h={12} w={96} br={4} bg="rgba(38,38,38,0.8)" />
      </View>

      <View style={{ gap: 10 }}>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: "rgba(38,38,38,0.6)",
              paddingBottom: 8,
              paddingHorizontal: 8,
              paddingVertical: 6,
              minHeight: 44,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
              <B h={20} w={20} br={8} />
              <B h={14} w={`${60 + (i % 3) * 15}%` as `${number}%`} br={6} bg="rgba(38,38,38,0.8)" />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <B h={20} w={48} br={999} />
              <B h={12} w={40} br={4} bg="rgba(38,38,38,0.6)" />
            </View>
          </View>
        ))}
      </View>
    </View>

    <View
      style={{
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "rgba(38,38,38,0.6)",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <B h={12} w={80} br={4} bg="rgba(38,38,38,0.8)" />
      <B h={14} w={40} br={4} bg="rgba(59,130,246,0.3)" />
    </View>
  </View>
);

export const QuickCaptureSkeleton: React.FC = () => (
  <View className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5">
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
      <B h={40} w={40} br={16} bg="rgba(79,70,229,0.3)" />
      <B h={16} w={16} br={4} />
    </View>

    <View style={{ marginTop: 16 }}>
      <B h={12} w={64} br={4} style={{ marginBottom: 8 }} />
      <B h={20} w={128} br={6} style={{ marginBottom: 8 }} />
      <B h={12} w={176} br={4} bg="rgba(38,38,38,0.6)" />
    </View>
  </View>
);

export const AIAssistantSkeleton: React.FC = () => (
  <View className="items-center justify-center rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5">
    <View
      style={{
        width: 48,
        height: 48,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#262626",
        backgroundColor: "#0a0a0a",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
      }}
    >
      <B h={24} w={24} br={999} bg="rgba(59,130,246,0.3)" />
    </View>
    <B h={16} w={96} br={4} style={{ marginBottom: 8 }} />
    <B h={12} w={112} br={4} bg="rgba(38,38,38,0.6)" />
  </View>
);

export const ActiveProjectsSkeleton: React.FC = () => (
  <View className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5">
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#262626",
        paddingBottom: 12,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <B h={16} w={16} br={4} bg="rgba(99,102,241,0.3)" />
        <B h={14} w={112} br={999} />
      </View>
      <B h={12} w={80} br={4} bg="rgba(38,38,38,0.8)" />
    </View>

    <View style={{ gap: 12 }}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} className="rounded-2xl border border-neutral-800/80 bg-neutral-950/60 p-4">
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
              <B h={20} w={20} br={4} />
              <B h={14} w={112} br={4} />
            </View>
            <B h={14} w={40} br={4} bg="rgba(59,130,246,0.2)" />
          </View>

          <View style={{ marginTop: 14, height: 6, width: "100%", borderRadius: 999, backgroundColor: "#262626", overflow: "hidden" }}>
            <View style={{ height: "100%", borderRadius: 999, backgroundColor: "rgba(99,102,241,0.4)", width: `${40 + i * 15}%` }} />
          </View>

          <View style={{ marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <B h={12} w={64} br={4} bg="rgba(38,38,38,0.6)" />
            <B h={16} w={48} br={999} />
          </View>
        </View>
      ))}
    </View>
  </View>
);

export const DailyHabitsSkeleton: React.FC = () => (
  <View className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5">
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#262626",
          paddingBottom: 12,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <B h={16} w={16} br={4} bg="rgba(59,130,246,0.3)" />
          <B h={14} w={96} br={999} />
        </View>
        <B h={12} w={64} br={4} bg="rgba(38,38,38,0.8)" />
      </View>

      <View style={{ gap: 8 }}>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "rgba(10,10,10,0.6)",
              borderWidth: 1,
              borderColor: "rgba(38,38,38,0.8)",
              padding: 10,
              borderRadius: 12,
              minHeight: 44,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
              <B h={20} w={20} br={6} />
              <B h={16} w={16} br={999} />
              <B h={14} w={128} br={4} bg="rgba(38,38,38,0.8)" />
            </View>
            <B h={16} w={48} br={999} bg="rgba(245,158,11,0.2)" />
          </View>
        ))}
      </View>
    </View>

    <View
      style={{
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#262626",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <B h={12} w={112} br={4} bg="rgba(38,38,38,0.8)" />
      <B h={14} w={40} br={4} bg="rgba(59,130,246,0.3)" />
    </View>
  </View>
);

export const RecentNotesSkeleton: React.FC = () => (
  <View className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5">
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#262626",
        paddingBottom: 12,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <B h={16} w={16} br={4} bg="rgba(59,130,246,0.3)" />
        <B h={14} w={128} br={999} />
      </View>
      <B h={12} w={96} br={4} bg="rgba(38,38,38,0.8)" />
    </View>

    <View style={{ gap: 12 }}>
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          className="rounded-2xl border border-neutral-800/80 bg-neutral-950/60 p-4"
          style={{ minHeight: 105, justifyContent: "space-between" }}
        >
          <View>
            <B h={14} w="75%" br={4} style={{ marginBottom: 8 }} />
            <B h={10} w="100%" br={4} bg="rgba(38,38,38,0.6)" style={{ marginBottom: 4 }} />
            <B h={10} w="66%" br={4} bg="rgba(38,38,38,0.6)" />
          </View>
          <View style={{ marginTop: 12, flexDirection: "row", gap: 6 }}>
            <B h={16} w={48} br={4} bg="#171717" />
            <B h={16} w={56} br={4} bg="#171717" />
          </View>
        </View>
      ))}
    </View>
  </View>
);

export const DashboardHeaderSkeleton: React.FC = () => (
  <View style={{ gap: 16, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: "rgba(38,38,38,0.8)" }}>
    <View style={{ gap: 8 }}>
      <B h={28} w={240} br={12} />
      <B h={14} w={320} br={6} bg="rgba(38,38,38,0.6)" />
    </View>

    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      <B h={32} w={112} br={999} bg="#171717" style={{ borderWidth: 1, borderColor: "#262626" }} />
      <B h={32} w={112} br={999} bg="#171717" style={{ borderWidth: 1, borderColor: "#262626" }} />
      <B h={32} w={112} br={999} bg="#171717" style={{ borderWidth: 1, borderColor: "#262626" }} />
    </View>
  </View>
);

export const DashboardSkeleton: React.FC = () => {
  return (
    <View className="gap-6 pb-12">
      <DashboardHeaderSkeleton />

      <View className="gap-5">
        <CoreObjectiveSkeleton />
        <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
          <View style={{ flex: 1, minWidth: "45%" }}>
            <HabitStreakSkeleton />
          </View>
          <View style={{ flex: 1, minWidth: "45%" }}>
            <WeeklyLoadSkeleton />
          </View>
        </View>
        <UrgentTasksSkeleton />
        <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
          <View style={{ flex: 1, minWidth: "45%" }}>
            <QuickCaptureSkeleton />
          </View>
          <View style={{ flex: 1, minWidth: "45%" }}>
            <AIAssistantSkeleton />
          </View>
        </View>
      </View>

      <View className="gap-5">
        <ActiveProjectsSkeleton />
        <DailyHabitsSkeleton />
      </View>

      <RecentNotesSkeleton />
    </View>
  );
};
