import React from "react";
import { View, Text, Pressable, StyleSheet, AccessibilityInfo } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useTheme } from "../theme/useTheme";
import type { Unit } from "../conversion/types";

type Props = {
  unit: Unit;
  formattedValue: string;
  isActive: boolean;
  isHidden?: boolean;
  isFavorite?: boolean;
  exactFactor?: string;
  onPress: () => void;
  onLongPress: () => void;
  onToggleFavorite?: () => void;
  error?: string;
};

export function ConversionRow({
  unit,
  formattedValue,
  isActive,
  isHidden,
  isFavorite,
  exactFactor,
  onPress,
  onLongPress,
  onToggleFavorite,
  error,
}: Props) {
  const { colors, spacing, fontSize, fontWeight, radius } = useTheme();

  if (isHidden) return null;

  const handleCopy = async () => {
    if (!formattedValue || error) return;
    await Clipboard.setStringAsync(`${formattedValue} ${unit.symbol}`);
    AccessibilityInfo.announceForAccessibility(`Copied ${formattedValue} ${unit.name}`);
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={handleCopy}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={`${unit.name}, ${formattedValue || "no value"} ${unit.symbol}`}
      accessibilityHint="Long press to copy"
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
          opacity: pressed ? 0.55 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.activeIndicator,
          { backgroundColor: isActive ? colors.accent : "transparent", borderRadius: radius.full },
        ]}
      />

      <View style={styles.left}>
        <Text
          allowFontScaling
          style={{ color: colors.text, fontSize: fontSize.lg, fontWeight: fontWeight.semibold }}
          numberOfLines={1}
        >
          {unit.symbol}
        </Text>
        <Text
          allowFontScaling
          style={{ color: colors.textSecondary, fontSize: fontSize.sm, marginTop: 2 }}
          numberOfLines={1}
        >
          {unit.name}
        </Text>
        {exactFactor != null ? (
          <Text
            allowFontScaling
            style={{ color: colors.textTertiary, fontSize: fontSize.xs, marginTop: 2 }}
            numberOfLines={1}
          >
            {exactFactor}
          </Text>
        ) : null}
      </View>

      <View style={styles.right}>
        {error ? (
          <Text allowFontScaling style={{ color: colors.error, fontSize: fontSize.md }} numberOfLines={1}>
            {error}
          </Text>
        ) : (
          <Text
            allowFontScaling
            adjustsFontSizeToFit
            numberOfLines={1}
            style={{
              color: colors.text,
              fontSize: fontSize.xl,
              fontVariant: ["tabular-nums"],
            }}
          >
            {formattedValue || "—"}
          </Text>
        )}
      </View>

      {onToggleFavorite ? (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: !!isFavorite }}
          accessibilityLabel={isFavorite ? "Remove favorite" : "Add favorite"}
          onPress={onToggleFavorite}
          style={styles.favoriteButton}
        >
          <Ionicons
            name={isFavorite ? "star" : "star-outline"}
            color={isFavorite ? colors.accent : colors.textTertiary}
            size={22}
          />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  activeIndicator: {
    width: 4,
    height: 28,
    marginRight: 12,
  },
  left: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  right: {
    flex: 1.2,
    minWidth: 0,
    alignItems: "flex-end",
  },
  favoriteButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
});
