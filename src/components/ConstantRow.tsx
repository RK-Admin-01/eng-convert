import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/useTheme";

type ConstantRowProps = {
  symbol: string;
  name: string;
  description: string;
  value: string;
  unit?: string;
  copied?: boolean;
  isLast?: boolean;
  onPress: () => void;
};

export function ConstantRow({
  symbol,
  name,
  description,
  value,
  unit,
  copied,
  isLast,
  onPress,
}: ConstantRowProps) {
  const { colors, spacing, fontSize, fontWeight } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${value} ${unit ?? ""}. Tap to copy value.`}
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
      <Text
        allowFontScaling
        style={{ width: 56, color: colors.text, fontSize: fontSize.xl, fontWeight: fontWeight.semibold }}
        numberOfLines={1}
      >
        {symbol}
      </Text>

      <View style={styles.middle}>
        <Text allowFontScaling style={{ color: colors.text, fontSize: fontSize.lg }} numberOfLines={1}>
          {name}
        </Text>
        <Text
          allowFontScaling
          style={{ color: colors.textSecondary, fontSize: fontSize.sm, marginTop: 2 }}
          numberOfLines={1}
        >
          {description}
        </Text>
      </View>

      <View style={styles.valueBlock}>
        {copied ? (
          <Text
            allowFontScaling
            style={{ color: colors.success, fontSize: fontSize.md, fontWeight: fontWeight.semibold }}
          >
            Copied
          </Text>
        ) : (
          <>
            <Text
              allowFontScaling
              adjustsFontSizeToFit
              numberOfLines={1}
              style={{ color: colors.text, fontSize: fontSize.lg, fontVariant: ["tabular-nums"] }}
            >
              {value}
            </Text>
            {unit ? (
              <Text
                allowFontScaling
                style={{ color: colors.textSecondary, fontSize: fontSize.sm, marginTop: 2 }}
                numberOfLines={1}
              >
                {unit}
              </Text>
            ) : null}
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
  },
  middle: {
    flex: 1,
    minWidth: 0,
    marginRight: 12,
  },
  valueBlock: {
    flex: 1,
    minWidth: 0,
    alignItems: "flex-end",
  },
});
