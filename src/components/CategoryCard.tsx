import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/useTheme";
import type { Category } from "../conversion/types";

type Props = {
  category: Category;
  onPress: () => void;
  isLast?: boolean;
};

export function CategoryCard({ category, onPress, isLast = false }: Props) {
  const { colors, spacing, fontSize, fontWeight } = useTheme();

  const previewUnits = category.units
    .filter((u) => !u.legacy)
    .slice(0, 4)
    .map((u) => u.symbol)
    .join("  ");

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${category.name}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
          borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
          opacity: pressed ? 0.55 : 1,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
        },
      ]}
    >
      <View style={styles.copy}>
        <Text
          allowFontScaling
          style={{ color: colors.text, fontSize: fontSize.lg, fontWeight: fontWeight.semibold }}
          numberOfLines={1}
        >
          {category.name}
        </Text>
        {previewUnits ? (
          <Text
            allowFontScaling
            style={{ color: colors.textSecondary, fontSize: fontSize.md, marginTop: 3 }}
            numberOfLines={1}
          >
            {previewUnits}
          </Text>
        ) : null}
      </View>
      <Text
        allowFontScaling={false}
        style={{ color: colors.textTertiary, fontSize: fontSize.xl, marginLeft: spacing.sm }}
      >
        ›
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
});
