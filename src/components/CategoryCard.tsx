import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import { useTheme } from "../theme/useTheme";
import type { Category } from "../conversion/types";

type Props = {
  category: Category;
  onPress: () => void;
};

export function CategoryCard({ category, onPress }: Props) {
  const { colors, radius, spacing, fontSize, fontWeight } = useTheme();

  const previewUnits = category.units
    .filter((u) => !u.legacy)
    .slice(0, 4)
    .map((u) => u.symbol)
    .join("  ");

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${category.name} converter`}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.md,
          padding: spacing.md,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Text
        style={{
          fontSize: fontSize.md,
          fontWeight: fontWeight.semibold,
          color: colors.text,
          marginBottom: spacing.xs,
        }}
        numberOfLines={1}
      >
        {category.name}
      </Text>
      {previewUnits ? (
        <Text
          style={{
            fontSize: fontSize.xs,
            color: colors.textTertiary,
            letterSpacing: 0.3,
          }}
          numberOfLines={1}
        >
          {previewUnits}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    flex: 1,
    minHeight: 64,
  },
});
