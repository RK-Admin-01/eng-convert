import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
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

export function EngineeringKeypad({ onKey, hapticsEnabled = false, decimalSeparator = "." }: Props) {
  const { colors, radius, fontSize, fontWeight } = useTheme();

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
    <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
      {ROWS.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((key) => {
            const isSpecial = ["⌫", "⏎", "+/-"].includes(key);
            const isOp = ["÷", "×", "-", "+", "^", "(", ")", "/"].includes(key);
            const isConst = ["pi", "e"].includes(key);

            return (
              <Pressable
                key={key}
                onPress={() => handlePress(key)}
                accessibilityLabel={`Key ${keyLabel(key)}`}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.key,
                  {
                    backgroundColor: isOp
                      ? colors.accentMuted
                      : isSpecial || isConst
                      ? colors.surfaceAlt
                      : colors.surface,
                    borderColor: colors.border,
                    borderRadius: radius.sm,
                    opacity: pressed ? 0.6 : 1,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: fontSize.lg,
                    fontWeight: isOp ? fontWeight.semibold : fontWeight.regular,
                    color: isOp ? colors.accent : colors.text,
                    textAlign: "center",
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
    borderTopWidth: 1,
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: 4,
    gap: 4,
    paddingTop: 4,
  },
  key: {
    flex: 1,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
});
