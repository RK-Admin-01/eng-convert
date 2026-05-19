import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/useTheme";

type PairFieldProps = {
  label: "FROM" | "TO";
  value: string;
  unitSymbol?: string;
  placeholder?: string;
  error?: string | null;
  showClear?: boolean;
  onClear?: () => void;
  onUnitPress: () => void;
};

export function PairField({
  label,
  value,
  unitSymbol,
  placeholder = "0",
  error,
  showClear,
  onClear,
  onUnitPress,
}: PairFieldProps) {
  const { colors, spacing, radius, fontSize, fontWeight } = useTheme();

  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text
        allowFontScaling
        style={{
          color: colors.textSecondary,
          fontSize: fontSize.sm,
          fontWeight: fontWeight.semibold,
          marginBottom: spacing.xs,
          marginHorizontal: spacing.md,
          letterSpacing: 0.4,
        }}
      >
        {label}
      </Text>

      <View
        style={[
          styles.field,
          { backgroundColor: colors.surface, borderRadius: radius.lg, paddingLeft: spacing.md },
        ]}
      >
        <Text
          allowFontScaling
          adjustsFontSizeToFit
          numberOfLines={1}
          style={{
            flex: 1,
            color: value ? colors.text : colors.textTertiary,
            fontSize: fontSize.display,
            fontVariant: ["tabular-nums"],
          }}
        >
          {value || placeholder}
        </Text>

        {showClear && onClear ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear input"
            onPress={onClear}
            style={styles.clearButton}
          >
            <Text allowFontScaling={false} style={{ color: colors.textTertiary, fontSize: fontSize.lg }}>
              ✕
            </Text>
          </Pressable>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Change ${label.toLowerCase()} unit`}
          onPress={onUnitPress}
          style={({ pressed }) => [
            styles.unitButton,
            { opacity: pressed ? 0.55 : 1, paddingHorizontal: spacing.md },
          ]}
        >
          <Text
            allowFontScaling
            numberOfLines={1}
            style={{ color: colors.accent, fontSize: fontSize.xl, fontWeight: fontWeight.semibold }}
          >
            {unitSymbol ?? ""} ▾
          </Text>
        </Pressable>
      </View>

      {error ? (
        <Text
          allowFontScaling
          style={{
            color: colors.error,
            fontSize: fontSize.sm,
            marginTop: spacing.xs,
            marginHorizontal: spacing.md,
          }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    minHeight: 88,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  clearButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  unitButton: {
    minWidth: 72,
    minHeight: 88,
    alignItems: "center",
    justifyContent: "center",
  },
});
