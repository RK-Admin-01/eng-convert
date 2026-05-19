import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "../theme/useTheme";

type Props = {
  onKey: (key: string) => void;
  hapticsEnabled?: boolean;
  decimalSeparator?: string;
};

const SCI_ROWS: string[][] = [
  ["7", "8", "9", "÷", "("],
  ["4", "5", "6", "×", ")"],
  ["1", "2", "3", "-", "^"],
  ["0", ".", "+/-", "+", "⌫"],
  ["pi", "e", "E", "/", "⏎"],
];

// Basic numpad — digits, decimal, negate, backspace, enter
const BASIC_ROWS: string[][] = [
  ["7", "8", "9", "⌫"],
  ["4", "5", "6", "+/-"],
  ["1", "2", "3", "⏎"],
  [".", "0"],
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
  const [sciMode, setSciMode] = useState(true);

  const handlePress = (display: string) => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    const value = KEY_VALUES[display] ?? display;
    onKey(value);
  };

  const keyLabel = (key: string) =>
    key === "." && decimalSeparator !== "." ? decimalSeparator : key;

  const rows = sciMode ? SCI_ROWS : BASIC_ROWS;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, borderTopColor: colors.border, padding: spacing.sm },
      ]}
    >
      {/* Mode toggle */}
      <View style={[styles.toggleRow, { marginBottom: spacing.sm }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={sciMode ? "Switch to basic numpad" : "Switch to scientific keypad"}
          onPress={() => setSciMode((v) => !v)}
          style={({ pressed }) => [
            styles.togglePill,
            {
              backgroundColor: colors.surfaceAlt,
              borderRadius: radius.full,
              opacity: pressed ? 0.6 : 1,
            },
          ]}
        >
          <Text
            allowFontScaling={false}
            style={[
              styles.toggleSegment,
              {
                color: !sciMode ? colors.text : colors.textTertiary,
                fontWeight: !sciMode ? fontWeight.semibold : fontWeight.regular,
                fontSize: fontSize.sm,
              },
            ]}
          >
            123
          </Text>
          <Text
            allowFontScaling={false}
            style={[
              styles.toggleSegment,
              {
                color: sciMode ? colors.text : colors.textTertiary,
                fontWeight: sciMode ? fontWeight.semibold : fontWeight.regular,
                fontSize: fontSize.sm,
              },
            ]}
          >
            SCI
          </Text>
        </Pressable>
      </View>

      {rows.map((row, rowIndex) => {
        const isLastRow = !sciMode && rowIndex === rows.length - 1;

        return (
          <View key={rowIndex} style={[styles.row, { gap: spacing.sm }]}>
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
                    isLastRow && key === "0" ? styles.keyWide : null,
                    {
                      backgroundColor: utility || constant ? colors.surfaceAlt : colors.surface,
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

            {/* Spacer for basic mode last row to balance the layout */}
            {isLastRow && (
              <View style={styles.keySpacer} />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  toggleRow: {
    alignItems: "center",
  },
  togglePill: {
    flexDirection: "row",
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  toggleSegment: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    minWidth: 52,
    textAlign: "center",
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
  keyWide: {
    flex: 2,
  },
  keySpacer: {
    flex: 1,
  },
});
