import React, { useState } from "react";
import { SafeAreaView, SectionList, StyleSheet, Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../src/theme/useTheme";
import { useSettingsStore } from "../../src/store/settingsStore";
import { CONSTANTS, CONSTANT_GROUPS } from "../../src/conversion/constants";
import { ConstantRow } from "../../src/components/ConstantRow";

export default function ConstantsScreen() {
  const { colors, spacing, fontSize, fontWeight, radius } = useTheme();
  const settings = useSettingsStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const sections = CONSTANT_GROUPS.map((g) => ({
    title: g.label,
    data: CONSTANTS.filter((c) => c.group === g.key),
  }));

  const handleCopy = async (id: string, value: string) => {
    await Clipboard.setStringAsync(value);
    if (settings.hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 1500);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: spacing.md, paddingBottom: 40 }}
        contentInsetAdjustmentBehavior="automatic"
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <Text
            style={{
              fontSize: fontSize.sm,
              fontWeight: fontWeight.semibold,
              color: colors.textSecondary,
              letterSpacing: 0.4,
              textTransform: "uppercase",
              paddingHorizontal: spacing.md,
              paddingBottom: spacing.sm,
            }}
          >
            {section.title}
          </Text>
        )}
        renderSectionFooter={() => <View style={{ height: spacing.xl }} />}
        renderItem={({ item: c, index, section }) => (
          <ConstantRow
            symbol={c.symbol}
            name={c.name}
            description={c.description}
            value={c.value}
            unit={c.unit}
            copied={copiedId === c.id}
            isLast={index === section.data.length - 1}
            onPress={() => handleCopy(c.id, c.value)}
          />
        )}
        ListHeaderComponent={
          <View style={{ marginHorizontal: spacing.md, marginBottom: spacing.md }}>
            <Text style={{ fontSize: fontSize.xs, color: colors.textTertiary }}>
              Tap any row to copy value to clipboard.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
});
