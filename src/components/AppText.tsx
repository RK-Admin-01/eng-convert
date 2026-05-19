import React from "react";
import { Text, type TextProps, type TextStyle } from "react-native";
import { useTheme } from "../theme/useTheme";

type Variant =
  | "largeTitle"
  | "title"
  | "headline"
  | "body"
  | "subheadline"
  | "footnote"
  | "caption"
  | "value";

type AppTextProps = TextProps & {
  variant?: Variant;
  muted?: boolean;
  tabular?: boolean;
};

export function AppText({
  variant = "body",
  muted = false,
  tabular = false,
  style,
  ...props
}: AppTextProps) {
  const { colors, fontSize, fontWeight } = useTheme();

  const variantStyle: Record<Variant, TextStyle> = {
    largeTitle: { fontSize: fontSize.display, fontWeight: fontWeight.bold, lineHeight: 38 },
    title: { fontSize: fontSize.xxl, fontWeight: fontWeight.semibold, lineHeight: 30 },
    headline: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, lineHeight: 22 },
    body: { fontSize: fontSize.lg, fontWeight: fontWeight.regular, lineHeight: 23 },
    subheadline: { fontSize: fontSize.md, fontWeight: fontWeight.regular, lineHeight: 20 },
    footnote: { fontSize: fontSize.sm, fontWeight: fontWeight.regular, lineHeight: 18 },
    caption: { fontSize: fontSize.xs, fontWeight: fontWeight.regular, lineHeight: 15 },
    value: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.regular,
      lineHeight: 26,
      fontVariant: ["tabular-nums"],
    },
  };

  return (
    <Text
      allowFontScaling
      maxFontSizeMultiplier={1.7}
      {...props}
      style={[
        { color: muted ? colors.textSecondary : colors.text },
        variantStyle[variant],
        tabular ? { fontVariant: ["tabular-nums"] } : null,
        style,
      ]}
    />
  );
}
