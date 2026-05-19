import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Decimal from "decimal.js";
import { useTheme } from "../../src/theme/useTheme";
import { useSettingsStore } from "../../src/store/settingsStore";
import { useFavoritesStore } from "../../src/store/favoritesStore";
import { getCategoryById } from "../../src/conversion/registry";
import { convertValue, findUnit } from "../../src/conversion/engine";
import { parseExpression } from "../../src/conversion/expressionParser";
import { formatValue, formatFraction } from "../../src/conversion/format";
import { EngineeringKeypad } from "../../src/components/EngineeringKeypad";

export default function FavoritesScreen() {
  const { colors, spacing, fontSize, fontWeight, radius } = useTheme();
  const settings = useSettingsStore();
  const { favorites, remove } = useFavoritesStore();
  const router = useRouter();

  const [activeFavId, setActiveFavId] = useState<string | null>(null);
  const [favInputs, setFavInputs] = useState<Record<string, string>>({});

  const handleKey = useCallback(
    (key: string) => {
      if (!activeFavId) return;
      setFavInputs((prev) => {
        const curr = prev[activeFavId] ?? "";
        if (key === "backspace") return { ...prev, [activeFavId]: curr.slice(0, -1) };
        if (key === "negate") return { ...prev, [activeFavId]: curr.startsWith("-") ? curr.slice(1) : "-" + curr };
        if (key === "enter") return prev;
        return { ...prev, [activeFavId]: curr + key };
      });
    },
    [activeFavId]
  );

  const favResults = useMemo(() => {
    const out: Record<string, { value: string; error: string | null }> = {};
    for (const fav of favorites) {
      const input = favInputs[fav.id] ?? "";
      if (!input.trim()) { out[fav.id] = { value: "", error: null }; continue; }
      const cat = getCategoryById(fav.categoryId);
      if (!cat) continue;
      const fromUnit = findUnit(cat, fav.sourceUnitId);
      const toUnit = fav.targetUnitId ? findUnit(cat, fav.targetUnitId) : undefined;
      if (!fromUnit || !toUnit) continue;
      const parsed = parseExpression(input);
      if (!parsed.ok) { out[fav.id] = { value: "", error: parsed.error ?? "Invalid" }; continue; }
      try {
        const result = convertValue(parsed.value, fromUnit, toUnit, cat);
        const formatted = settings.fractionMode
          ? formatFraction(result, settings.fractionDenominator)
          : formatValue(result, {
              sigFigs: settings.sigFigs,
              notation: settings.notation,
              decimalSeparator: settings.decimalSeparator,
              groupThousands: settings.groupThousands,
            });
        out[fav.id] = { value: formatted, error: null };
      } catch {
        out[fav.id] = { value: "", error: "Error" };
      }
    }
    return out;
  }, [favorites, favInputs, settings]);

  const handleDelete = (id: string, label: string) => {
    Alert.alert("Remove Favorite", `Remove "${label}" from favorites?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => remove(id) },
    ]);
  };

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
          <Text style={{ fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.text, marginBottom: 8 }}>
            No favorites yet
          </Text>
          <Text style={{ fontSize: fontSize.md, color: colors.textSecondary, textAlign: "center" }}>
            Tap ☆ on any conversion row to save it here.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <FlatList
        data={favorites}
        keyExtractor={(f) => f.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing.sm, paddingBottom: spacing.sm }}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item: fav }) => {
          const isActive = fav.id === activeFavId;
          const cat = getCategoryById(fav.categoryId);
          const fromUnit = cat ? findUnit(cat, fav.sourceUnitId) : undefined;
          const toUnit = cat && fav.targetUnitId ? findUnit(cat, fav.targetUnitId) : undefined;
          const input = favInputs[fav.id] ?? "";
          const result = favResults[fav.id];

          return (
            <Pressable
              onPress={() => setActiveFavId(isActive ? null : fav.id)}
              accessibilityLabel={`${fav.label}. ${isActive ? "Active" : "Tap to activate"}`}
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: isActive ? colors.accent : colors.border,
                  borderRadius: radius.md,
                  marginBottom: spacing.sm,
                  borderWidth: isActive ? 1.5 : 1,
                },
              ]}
            >
              {/* Header row */}
              <View style={[styles.cardHeader, { borderBottomColor: colors.border }]}>
                <Text style={{ fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: isActive ? colors.accent : colors.text, flex: 1 }}>
                  {fav.label}
                </Text>
                <Text style={{ fontSize: fontSize.xs, color: colors.textTertiary, marginRight: spacing.sm }}>
                  {cat?.name ?? fav.categoryId}
                </Text>
                <Pressable
                  onPress={() => router.push(`/category/${fav.categoryId}`)}
                  accessibilityLabel={`Open ${cat?.name ?? fav.categoryId} converter`}
                  hitSlop={8}
                >
                  <Text style={{ fontSize: fontSize.sm, color: colors.accent }}>All ›</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleDelete(fav.id, fav.label)}
                  accessibilityLabel={`Delete ${fav.label}`}
                  hitSlop={8}
                  style={{ marginLeft: spacing.md }}
                >
                  <Text style={{ fontSize: fontSize.md, color: colors.textTertiary }}>✕</Text>
                </Pressable>
              </View>

              {/* Conversion rows */}
              <View style={{ padding: spacing.sm, gap: spacing.xs }}>
                {/* FROM row */}
                <View style={[styles.convRow, { backgroundColor: colors.surfaceAlt, borderRadius: radius.sm }]}>
                  <Text
                    style={{ flex: 1, fontSize: fontSize.xl, fontWeight: fontWeight.medium, color: input ? colors.text : colors.textTertiary, paddingHorizontal: spacing.sm }}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {input || "0"}
                  </Text>
                  {input.length > 0 && (
                    <Pressable
                      onPress={() => setFavInputs((p) => ({ ...p, [fav.id]: "" }))}
                      hitSlop={8}
                      style={{ paddingHorizontal: spacing.xs }}
                    >
                      <Text style={{ color: colors.textTertiary }}>✕</Text>
                    </Pressable>
                  )}
                  <View style={[styles.unitBadge, { backgroundColor: colors.accentMuted }]}>
                    <Text style={{ fontSize: fontSize.sm, color: colors.accent, fontWeight: fontWeight.semibold }}>
                      {fromUnit?.symbol ?? fav.sourceUnitId}
                    </Text>
                  </View>
                </View>

                {/* TO row */}
                <View style={[styles.convRow, { backgroundColor: colors.background, borderRadius: radius.sm }]}>
                  <Text
                    style={{ flex: 1, fontSize: fontSize.xl, fontWeight: fontWeight.medium, color: result?.value ? colors.text : colors.textTertiary, paddingHorizontal: spacing.sm }}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {result?.error ?? result?.value ?? "—"}
                  </Text>
                  <View style={[styles.unitBadge, { backgroundColor: colors.surfaceAlt }]}>
                    <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: fontWeight.semibold }}>
                      {toUnit?.symbol ?? fav.targetUnitId}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          );
        }}
      />

      {activeFavId ? (
        <EngineeringKeypad
          onKey={handleKey}
          hapticsEnabled={settings.hapticsEnabled}
          decimalSeparator={settings.decimalSeparator}
        />
      ) : (
        <View style={{ padding: spacing.md, alignItems: "center", borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }}>
          <Text style={{ fontSize: fontSize.sm, color: colors.textTertiary }}>
            Tap a card to start converting
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  card: { overflow: "hidden" },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  convRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
  },
  unitBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    margin: 4,
    borderRadius: 6,
    minWidth: 44,
    alignItems: "center",
  },
});
