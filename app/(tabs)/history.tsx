import React from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Decimal from "decimal.js";
import { useTheme } from "../../src/theme/useTheme";
import { useHistoryStore } from "../../src/store/historyStore";
import { useSettingsStore } from "../../src/store/settingsStore";
import { getCategoryById } from "../../src/conversion/registry";
import { findUnit } from "../../src/conversion/engine";
import { formatValue, formatFraction } from "../../src/conversion/format";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function HistoryScreen() {
  const { colors, spacing, fontSize, fontWeight, radius } = useTheme();
  const history = useHistoryStore();
  const settings = useSettingsStore();
  const router = useRouter();

  const handleClear = () => {
    Alert.alert("Clear History", "Remove all conversion history?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: history.clear },
    ]);
  };

  if (history.entries.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: colors.textTertiary, fontSize: fontSize.md }}>No history yet</Text>
          <Text style={{ color: colors.textTertiary, fontSize: fontSize.sm, marginTop: spacing.xs }}>
            Press ⏎ in the converter to save entries
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={history.entries}
        keyExtractor={(e) => e.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListFooterComponent={
          <Pressable
            onPress={handleClear}
            accessibilityLabel="Clear all history"
            style={({ pressed }) => ({
              margin: spacing.md,
              padding: spacing.md,
              backgroundColor: colors.surfaceAlt,
              borderRadius: radius.md,
              alignItems: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ color: colors.error, fontSize: fontSize.md, fontWeight: fontWeight.medium }}>
              Clear History
            </Text>
          </Pressable>
        }
        renderItem={({ item: entry }) => {
          const category = getCategoryById(entry.categoryId);
          const unit = category ? findUnit(category, entry.sourceUnitId) : undefined;

          const resultPreview = entry.topResults
            ?.slice(0, 3)
            .map((r) => {
              if (!category) return null;
              const u = findUnit(category, r.unitId);
              if (!u) return null;
              try {
                const formatted = settings.fractionMode
                  ? formatFraction(new Decimal(r.value), settings.fractionDenominator)
                  : formatValue(new Decimal(r.value), {
                      sigFigs: settings.sigFigs,
                      notation: settings.notation,
                      decimalSeparator: settings.decimalSeparator,
                      groupThousands: settings.groupThousands,
                    });
                return `${formatted} ${u.symbol}`;
              } catch {
                return null;
              }
            })
            .filter(Boolean)
            .join("  ·  ");

          return (
            <Pressable
              onPress={() => router.push(`/category/${entry.categoryId}`)}
              accessibilityLabel={`${category?.name ?? entry.categoryId}: ${entry.inputValue} ${unit?.symbol ?? entry.sourceUnitId}`}
              style={({ pressed }) => ({
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                backgroundColor: colors.surface,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: fontSize.xs, color: colors.textTertiary, marginBottom: 2 }}>
                    {category?.name ?? entry.categoryId}
                  </Text>
                  <Text style={{ fontSize: fontSize.lg, fontWeight: fontWeight.medium, color: colors.text }}>
                    {entry.inputValue}{" "}
                    <Text style={{ fontWeight: fontWeight.regular, color: colors.textSecondary }}>
                      {unit?.symbol ?? entry.sourceUnitId}
                    </Text>
                  </Text>
                  {resultPreview ? (
                    <Text
                      style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 }}
                      numberOfLines={1}
                    >
                      {resultPreview}
                    </Text>
                  ) : null}
                </View>
                <View style={{ alignItems: "flex-end", marginLeft: spacing.sm }}>
                  <Text style={{ fontSize: fontSize.xs, color: colors.textTertiary }}>
                    {timeAgo(entry.timestamp)}
                  </Text>
                  <Text style={{ fontSize: fontSize.lg, color: colors.textTertiary, marginTop: 2 }}>›</Text>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}
