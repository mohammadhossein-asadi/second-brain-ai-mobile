import React, { useCallback, useState } from "react";
import { RefreshControl, ScrollViewProps } from "react-native";
import { useSecondBrain } from "../../context/SecondBrainContext";
import { useThemeColors } from "../../lib/theme";
import { ScrollView } from "./primitives";

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh?: () => Promise<void> | void;
  disabled?: boolean;
  /** Override the refreshing indicator state (defaults to context isSyncing + local trigger). */
  refreshing?: boolean;
  contentContainerStyle?: ScrollViewProps["contentContainerStyle"];
  style?: ScrollViewProps["style"];
  showsVerticalScrollIndicator?: boolean;
}

/**
 * Native replacement for the web's custom touch-based PullToRefresh.
 * Returns a RefreshControl element ready to be passed to any ScrollView's
 * `refreshControl` prop: `refreshControl={useRefreshControl(refreshing, onRefresh)}`.
 */
export function useRefreshControl(refreshing: boolean, onRefresh?: () => void) {
  const c = useThemeColors();
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={c.accentBlue}
      colors={[c.accentBlue]}
      progressBackgroundColor={c.bgSurface}
    />
  );
}

/**
 * Thin wrapper around ScrollView + RefreshControl with the same API/behavior as
 * the web component: pulls `syncData`/`isSyncing` from context by default, or
 * uses the provided `onRefresh`. It is the scroll container on mobile (the web
 * version wrapped the scrollable `<main>`), so children should not add another
 * top-level ScrollView when possible.
 */
export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  disabled = false,
  refreshing: refreshingProp,
  contentContainerStyle,
  style,
  showsVerticalScrollIndicator = true,
}) => {
  const { syncData, isSyncing } = useSecondBrain();
  const [localRefreshing, setLocalRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (disabled) return;
    setLocalRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      } else {
        await syncData();
      }
    } catch (err) {
      console.error("Pull to refresh error:", err);
    } finally {
      setLocalRefreshing(false);
    }
  }, [disabled, onRefresh, syncData]);

  const refreshing = refreshingProp ?? (isSyncing || localRefreshing);

  return (
    <ScrollView
      style={[{ flex: 1 }, style]}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      refreshControl={useRefreshControl(refreshing, disabled ? undefined : handleRefresh)}
    >
      {children}
    </ScrollView>
  );
};
