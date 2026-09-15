import React, { useState } from "react";
import { Pressable, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { WifiOff, RefreshCw, X, Database } from "lucide-react-native";
import { useSecondBrain } from "../../context/SecondBrainContext";
import { T, TBold } from "./primitives";

export const OfflineBanner: React.FC = () => {
  const { isOffline, lastOfflineSyncTimestamp, isRTL, showToast, syncData } = useSecondBrain();
  const [dismissed, setDismissed] = useState(false);

  if (!isOffline || dismissed) return null;

  const handleCheckConnection = async () => {
    const state = await NetInfo.fetch();
    if (state.isConnected && state.isInternetReachable !== false) {
      // Back online — resync (native equivalent of the web page reload)
      syncData();
    } else {
      showToast(
        isRTL
          ? "هنوز اتصالی به اینترنت یافت نشد. همچنان از حافظه محلی استفاده می‌شود."
          : "Still offline. Continuing to use local cache.",
        "info"
      );
    }
  };

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        zIndex: 40,
        elevation: 40,
        alignItems: isRTL ? "flex-end" : "flex-start",
      }}
    >
      <View
        style={{
          flexDirection: isRTL ? "row-reverse" : "row",
          alignItems: "center",
          gap: 12,
          width: "100%",
          maxWidth: 448,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "rgba(245,158,11,0.4)",
          backgroundColor: "rgba(23,23,23,0.95)",
          padding: 14,
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            flexShrink: 0,
            borderRadius: 12,
            backgroundColor: "rgba(245,158,11,0.15)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <WifiOff size={20} color="#fbbf24" />
        </View>

        <View style={{ flex: 1, minWidth: 0 }}>
          <View
            style={{
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Database size={14} color="#fbbf24" />
            <TBold style={{ fontSize: 12, color: "#fbbf24" }}>
              {isRTL ? "حالت آفلاین فعال است" : "Offline Mode Active"}
            </TBold>
          </View>
          <T
            style={{ marginTop: 2, fontSize: 11, color: "#a3a3a3", lineHeight: 14 }}
            numberOfLines={2}
          >
            {isRTL
              ? `داده‌های کش‌شده محلی در دسترس هستند (آخرین همگام‌سازی: ${lastOfflineSyncTimestamp}).`
              : `Cached data loaded from local storage (Last sync: ${lastOfflineSyncTimestamp}).`}
          </T>
        </View>

        <View
          style={{
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            gap: 4,
            flexShrink: 0,
          }}
        >
          <Pressable
            onPress={handleCheckConnection}
            hitSlop={4}
            style={({ pressed }) => ({
              width: 32,
              height: 32,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#262626",
              backgroundColor: "rgba(38,38,38,0.8)",
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <RefreshCw size={14} color="#d4d4d4" />
          </Pressable>
          <Pressable
            onPress={() => setDismissed(true)}
            hitSlop={4}
            style={({ pressed }) => ({
              width: 32,
              height: 32,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <X size={14} color="#a3a3a3" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};
