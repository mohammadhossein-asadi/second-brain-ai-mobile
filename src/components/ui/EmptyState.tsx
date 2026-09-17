import React from "react";
import { View, Pressable, Image } from "react-native";
import { T, Btn } from "./primitives";
import { useThemeColors } from "../../lib/theme";

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  icon?: React.ReactNode;
  imageSize?: "sm" | "md" | "lg";
  className?: string;
}

const EMPTY_ART = require("../../assets/images/empty_state_art_1789404987081.jpg");

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  icon,
  imageSize = "md",
}) => {
  const c = useThemeColors();
  const { isRTL } = { isRTL: false };
  const sizeMap = { sm: 100, md: 148, lg: 196 }[imageSize];

  return (
    <View
      className="items-center justify-center rounded-3xl border border-dashed p-6"
      style={{ borderColor: c.borderColor, backgroundColor: c.bgSubtle }}
    >
      {/* Illustration Card Container */}
      <View style={{ marginBottom: 20 }}>
        <View
          style={{
            width: sizeMap,
            height: sizeMap,
            borderRadius: 24,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: c.borderSubtle,
            backgroundColor: c.bgElevated,
          }}
        >
          <Image
            source={EMPTY_ART}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </View>

        {/* Optional floating icon badge */}
        {icon ? (
          <View
            style={{
              position: "absolute",
              bottom: -8,
              [isRTL ? "left" : "right"]: -8,
              width: 36,
              height: 36,
              borderRadius: 14,
              backgroundColor: c.bgSurface,
              borderWidth: 1,
              borderColor: c.borderColor,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </View>
        ) : null}
      </View>

      {/* Title */}
      <T style={{ fontSize: 16, fontWeight: "700", color: c.textPrimary }}>{title}</T>

      {/* Description */}
      {description ? (
        <T
          style={{
            marginTop: 6,
            fontSize: 12,
            color: c.textMuted,
            lineHeight: 19,
            textAlign: "center",
            maxWidth: 320,
          }}
        >
          {description}
        </T>
      ) : null}

      {/* Actions */}
      {actionLabel || secondaryActionLabel ? (
        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {actionLabel && onAction ? (
            <Btn title={actionLabel} onPress={onAction} />
          ) : null}

          {secondaryActionLabel && onSecondaryAction ? (
            <Btn
              title={secondaryActionLabel}
              onPress={onSecondaryAction}
              variant="neutral"
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
};
