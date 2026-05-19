import React from "react";
import {
  ActionSheetIOS,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../theme/useTheme";

type PairActionsBarProps = {
  canCopy: boolean;
  onCopy: () => void;
  onShare: () => void;
  onShowAllUnits: () => void;
  onSaveDefault: () => void;
};

export function PairActionsBar({
  canCopy,
  onCopy,
  onShare,
  onShowAllUnits,
  onSaveDefault,
}: PairActionsBarProps) {
  const { colors, spacing, radius, fontSize, fontWeight } = useTheme();

  const openMore = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: "More Actions",
          options: ["Share", "All Units", "Save as Default Pair", "Cancel"],
          cancelButtonIndex: 3,
        },
        (index) => {
          if (index === 0) onShare();
          if (index === 1) onShowAllUnits();
          if (index === 2) onSaveDefault();
        }
      );
      return;
    }
    Alert.alert("More Actions", undefined, [
      { text: "Share", onPress: onShare },
      { text: "All Units", onPress: onShowAllUnits },
      { text: "Save as Default Pair", onPress: onSaveDefault },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <View style={[styles.row, { gap: spacing.sm, paddingHorizontal: spacing.md }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Copy result"
        accessibilityState={{ disabled: !canCopy }}
        disabled={!canCopy}
        onPress={onCopy}
        style={({ pressed }) => [
          styles.copyButton,
          {
            backgroundColor: canCopy ? colors.accent : colors.surfaceAlt,
            borderRadius: radius.md,
            opacity: !canCopy ? 0.45 : pressed ? 0.65 : 1,
          },
        ]}
      >
        <Text
          allowFontScaling
          style={{
            color: canCopy ? colors.accentText : colors.textTertiary,
            fontSize: fontSize.lg,
            fontWeight: fontWeight.semibold,
          }}
        >
          Copy
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="More actions"
        onPress={openMore}
        style={({ pressed }) => [
          styles.moreButton,
          { backgroundColor: colors.surfaceAlt, borderRadius: radius.md, opacity: pressed ? 0.6 : 1 },
        ]}
      >
        <Text
          allowFontScaling={false}
          style={{ color: colors.text, fontSize: fontSize.xl, fontWeight: fontWeight.semibold }}
        >
          •••
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  copyButton: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  moreButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
});
