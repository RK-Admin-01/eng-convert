import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "../theme/useTheme";

type Props = {
  onKey: (key: string) => void;
  hapticsEnabled?: boolean;
  decimalSeparator?: string;
};

const ROWS: string[][] = [
  ["7", "8", "9", "÷", "("],
  ["4", "5", "6", "×", ")"],
  ["1", "2", "3", "-", "^"],
  ["0", ".", "+/-", "+", "⌫"],
  ["pi", "e", "E", "/", "⏎"],
];

const KEY_VALUES: Record<string, string> = {
  "÷": "/",
  "×": "*",
  "+/-": "negate",
  "⌫": "backspace",
  "⏎": "enter",
};

function isOperator(key: string) {
  return ["÷", "×", "-", "+", "^", "(", ")", "/"].includes(key);
}

function isUtility(key: string) {
  return ["⌫", "⏎", "+/-"].includes(key);
}

function isConstant(key: string) {
  return ["pi", "e"].includes(key);
}

export function EngineeringKeypad({
  onKey,
  hapticsEnabled = false,
  decimalSeparator = ".",
}: Props) {
  const { colors, spacing, radius, fontSize, fontWeight } = useTheme();

  const handlePress = (display: string) => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    const value = KEY_VALUES[display] ?? display;
    onKey(value);
  };

  const keyLabel = (key: string) =>
    key === "." && decimalSeparator !== "." ? decimalSeparator : key;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, borderTopColor: colors.border, padding: spacing.sm },
      ]}
    >
      {ROWS.map((row) => (
        <View key={row.join("-")} style={[styles.row, { gap: spacing.sm }]}>
          {row.map((key) => {
            const op = isOperator(key);
            const utility = isUtility(key);
            const constant = isConstant(key);

            return (
              <Pressable
                key={key}
                accessibilityRole="button"
                accessibilityLabel={`Key ${keyLabel(key)}`}
                onPress={() => handlePress(key)}
                hitSlop={2}
                style={({ pressed }) => [
                  styles.key,
                  {
                    backgroundColor:
                      utility || constant ? colors.surfaceAlt : colors.surface,
                    borderRadius: radius.md,
                    opacity: pressed ? 0.55 : 1,
                  },
                ]}
              >
                <Text
                  allowFontScaling={false}
                  style={{
                    color: op ? colors.accent : colors.text,
                    fontSize: fontSize.xl,
                    fontWeight: op ? fontWeight.semibold : fontWeight.regular,
                  }}
                >
                  {keyLabel(key)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  key: {
    flex: 1,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
  },
});
