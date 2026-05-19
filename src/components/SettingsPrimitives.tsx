import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/useTheme";

type SettingsSectionProps = {
  title: string;
  children?: React.ReactNode;
  footer?: string;
};

export function SettingsSection({ title, children, footer }: SettingsSectionProps) {
  const { colors, spacing, radius, fontSize, fontWeight } = useTheme();

  return (
    <View style={{ marginBottom: spacing.xl }}>
      <Text
        allowFontScaling
        style={{
          color: colors.textSecondary,
          fontSize: fontSize.sm,
          fontWeight: fontWeight.semibold,
          letterSpacing: 0.4,
          marginBottom: spacing.sm,
          marginHorizontal: spacing.md,
          textTransform: "uppercase",
        }}
      >
        {title}
      </Text>

      {children ? (
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            overflow: "hidden",
            marginHorizontal: spacing.md,
          }}
        >
          {children}
        </View>
      ) : null}

      {footer ? (
        <Text
          allowFontScaling
          style={{
            color: colors.textSecondary,
            fontSize: fontSize.sm,
            lineHeight: 19,
            marginTop: spacing.sm,
            marginHorizontal: spacing.md,
          }}
        >
          {footer}
        </Text>
      ) : null}
    </View>
  );
}

type SettingsRowProps = {
  label: string;
  children: React.ReactNode;
  isLast?: boolean;
};

export function SettingsRow({ label, children, isLast = false }: SettingsRowProps) {
  const { colors, spacing, fontSize } = useTheme();

  return (
    <View
      style={[
        styles.row,
        {
          borderBottomColor: colors.border,
          borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
          paddingHorizontal: spacing.md,
        },
      ]}
    >
      <Text
        allowFontScaling
        style={{ flex: 1, color: colors.text, fontSize: fontSize.lg, marginRight: spacing.md }}
      >
        {label}
      </Text>
      {children}
    </View>
  );
}

type SegmentOption<T extends string | number> = { label: string; value: T };

type MinimalSegmentedControlProps<T extends string | number> = {
  label: string;
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function MinimalSegmentedControl<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: MinimalSegmentedControlProps<T>) {
  const { colors, spacing, radius, fontSize, fontWeight } = useTheme();

  return (
    <View
      accessibilityRole="tablist"
      style={[
        styles.segmentContainer,
        { backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: 2 },
      ]}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={String(option.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={`${label}: ${option.label}`}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.segment,
              {
                backgroundColor: selected ? colors.surface : "transparent",
                borderRadius: radius.sm,
                opacity: pressed ? 0.55 : 1,
                paddingHorizontal: spacing.sm,
              },
            ]}
          >
            <Text
              allowFontScaling
              style={{
                color: selected ? colors.text : colors.textSecondary,
                fontSize: fontSize.md,
                fontWeight: selected ? fontWeight.semibold : fontWeight.regular,
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  segmentContainer: {
    flexDirection: "row",
  },
  segment: {
    minHeight: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
