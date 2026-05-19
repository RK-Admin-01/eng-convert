import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../theme/useTheme";

type QuietRowProps = {
  title: string;
  subtitle?: string;
  meta?: string;
  showChevron?: boolean;
  isLast?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function QuietRow({
  title,
  subtitle,
  meta,
  showChevron = true,
  isLast = false,
  onPress,
  accessibilityLabel,
  style,
}: QuietRowProps) {
  const { colors, spacing, fontSize, fontWeight } = useTheme();

  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={accessibilityLabel ?? title}
      onPress={onPress}
      disabled={!onPress}
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
        style,
      ]}
    >
      <View style={styles.copy}>
        <Text
          allowFontScaling
          style={{ color: colors.text, fontSize: fontSize.lg, fontWeight: fontWeight.semibold }}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            allowFontScaling
            style={{ color: colors.textSecondary, fontSize: fontSize.md, marginTop: 3 }}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {meta ? (
        <Text
          allowFontScaling
          style={{ color: colors.textTertiary, fontSize: fontSize.sm, marginLeft: spacing.md }}
          numberOfLines={1}
        >
          {meta}
        </Text>
      ) : null}

      {showChevron && onPress ? (
        <Text
          allowFontScaling={false}
          style={{ color: colors.textTertiary, fontSize: fontSize.xl, marginLeft: spacing.sm }}
        >
          ›
        </Text>
      ) : null}
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
