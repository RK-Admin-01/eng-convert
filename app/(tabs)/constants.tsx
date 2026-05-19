import React, { useState } from "react";
import {
  View,
  Text,
  SectionList,
  Pressable,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../src/theme/useTheme";
import { useSettingsStore } from "../../src/store/settingsStore";
import { CONSTANTS, CONSTANT_GROUPS } from "../../src/conversion/constants";

export default function ConstantsScreen() {
  const { colors, spacing, fontSize, fontWeight } = useTheme();
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
        contentContainerStyle={{ paddingBottom: 40 }}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <Text
            style={{
              fontSize: fontSize.xs,
              fontWeight: fontWeight.semibold,
              color: colors.textSecondary,
              paddingHorizontal: spacing.md,
              paddingTop: spacing.lg,
              paddingBottom: spacing.xs,
            }}
          >
            {section.title.toUpperCase()}
          </Text>
        )}
        renderSectionFooter={() => (
          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border }} />
        )}
        renderItem={({ item: c, index, section }) => {
          const isCopied = copiedId === c.id;
          const isLast = index === section.data.length - 1;
          return (
            <Pressable
              onPress={() => handleCopy(c.id, c.value)}
              accessibilityLabel={`${c.name}, ${c.value} ${c.unit}. Tap to copy value.`}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                backgroundColor: colors.surface,
                borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
                borderBottomColor: colors.border,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              {/* Symbol */}
              <View style={{ width: 54 }}>
                <Text
                  style={{ fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.accent }}
                  numberOfLines={1}
                >
                  {c.symbol}
                </Text>
              </View>

              {/* Name + description */}
              <View style={{ flex: 1, marginHorizontal: spacing.sm }}>
                <Text style={{ fontSize: fontSize.sm, color: colors.text }} numberOfLines={1}>
                  {c.name}
                </Text>
                <Text style={{ fontSize: fontSize.xs, color: colors.textTertiary, marginTop: 1 }} numberOfLines={1}>
                  {c.description}
                </Text>
              </View>

              {/* Value + unit */}
              <View style={{ alignItems: "flex-end", maxWidth: 130 }}>
                {isCopied ? (
                  <Text style={{ fontSize: fontSize.sm, color: colors.accent, fontWeight: fontWeight.semibold }}>
                    Copied
                  </Text>
                ) : (
                  <>
                    <Text
                      style={{ fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.text }}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {c.value}
                    </Text>
                    {c.unit ? (
                      <Text style={{ fontSize: fontSize.xs, color: colors.textTertiary, marginTop: 1 }}>
                        {c.unit}
                      </Text>
                    ) : null}
                  </>
                )}
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
});
