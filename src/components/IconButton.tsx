import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useTheme } from "../theme/useTheme";

type IconButtonProps = {
  label: string;
  accessibilityLabel: string;
  onPress: () => void;
  disabled?: boolean;
};

export function IconButton({ label, accessibilityLabel, onPress, disabled }: IconButtonProps) {
  const { colors, fontSize } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { opacity: disabled ? 0.35 : pressed ? 0.55 : 1 },
      ]}
    >
      <Text allowFontScaling={false} style={{ color: colors.textTertiary, fontSize: fontSize.lg }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
