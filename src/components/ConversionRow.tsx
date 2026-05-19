import React from "react";
import { View, Text, Pressable, StyleSheet, AccessibilityInfo } from "react-native";
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
      accessibilityLabel={`${unit.name}, ${formattedValue || "—"}, double tap to use as input unit`}
      accessibilityHint="Long press to copy"
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: isActive ? colors.accentMuted : colors.surface,
          borderBottomColor: colors.border,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View style={styles.left}>
        <Text
          style={{
            fontSize: fontSize.xl,
            fontWeight: fontWeight.semibold,
            color: isActive ? colors.accent : colors.text,
            minWidth: 60,
          }}
          numberOfLines={1}
        >
          {unit.symbol}
        </Text>
        <Text
          style={{
            fontSize: fontSize.sm,
            color: colors.textSecondary,
            marginTop: 2,
          }}
          numberOfLines={1}
        >
          {unit.name}
        </Text>
        {exactFactor != null && (
          <Text
            style={{
              fontSize: fontSize.xs,
              color: colors.textTertiary,
              marginTop: 2,
            }}
            numberOfLines={1}
          >
            {exactFactor}
          </Text>
        )}
      </View>

      <View style={styles.right}>
        {error ? (
          <Text style={{ fontSize: fontSize.sm, color: colors.error }}>{error}</Text>
        ) : (
          <Text
            style={{
              fontSize: fontSize.xl,
              fontWeight: fontWeight.medium,
              color: isActive ? colors.accent : colors.text,
              textAlign: "right",
            }}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {formattedValue || "—"}
          </Text>
        )}
      </View>

      {onToggleFavorite && (
        <Pressable
          onPress={onToggleFavorite}
          hitSlop={8}
          accessibilityLabel={isFavorite ? "Remove from favorites" : "Add to favorites"}
          style={{ marginLeft: spacing.sm, padding: spacing.xs }}
        >
          <Text style={{ fontSize: fontSize.lg, color: isFavorite ? colors.accent : colors.textTertiary }}>
            {isFavorite ? "★" : "☆"}
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  left: {
    flex: 1,
    marginRight: 8,
  },
  right: {
    flex: 1.2,
    alignItems: "flex-end",
  },
});
