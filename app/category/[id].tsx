import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Modal,
  ScrollView,
  Share,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useNavigation } from "expo-router";
import Decimal from "decimal.js";
import { useTheme } from "../../src/theme/useTheme";
import { ConversionRow } from "../../src/components/ConversionRow";
import { EngineeringKeypad } from "../../src/components/EngineeringKeypad";
import { getCategoryById } from "../../src/conversion/registry";
import { convertAll, findUnit } from "../../src/conversion/engine";
import { parseExpression } from "../../src/conversion/expressionParser";
import { formatValue, formatFraction } from "../../src/conversion/format";
import { useSettingsStore } from "../../src/store/settingsStore";
import { useFavoritesStore } from "../../src/store/favoritesStore";
import { useUnitPreferencesStore } from "../../src/store/unitPreferencesStore";
import { useHistoryStore } from "../../src/store/historyStore";
import type { Unit } from "../../src/conversion/types";

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { colors, spacing, fontSize, fontWeight, radius } = useTheme();
  const settings = useSettingsStore();
  const favorites = useFavoritesStore();
  const unitPrefs = useUnitPreferencesStore();
  const history = useHistoryStore();

  const category = getCategoryById(id ?? "");

  const [input, setInput] = useState("");
  const [activeUnitId, setActiveUnitId] = useState<string>(() => {
    const saved = unitPrefs.prefs[id ?? ""]?.lastActiveUnitId;
    if (saved && category && findUnit(category, saved)) return saved;
    return category?.baseUnitId ?? "";
  });
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Persist last active unit
  useEffect(() => {
    if (id && activeUnitId) unitPrefs.setLastActiveUnit(id, activeUnitId);
  }, [activeUnitId, id]);

  const prefs = unitPrefs.prefs[id ?? ""] ?? {};
  const hiddenIds = new Set(prefs.hidden ?? []);

  // Build the ordered unit list, respecting saved order
  const orderedUnits = useMemo(() => {
    if (!category) return [];
    const savedOrder = prefs.order;
    if (savedOrder) {
      const ordered: Unit[] = [];
      for (const unitId of savedOrder) {
        const u = findUnit(category, unitId);
        if (u) ordered.push(u);
      }
      for (const u of category.units) {
        if (!savedOrder.includes(u.id)) ordered.push(u);
      }
      return ordered;
    }
    return category.units;
  }, [category, prefs.order]);

  // Header: title + Edit/Done button
  useEffect(() => {
    if (!category) return;
    navigation.setOptions({
      title: category.name,
      headerRight: () => (
        <Pressable
          onPress={() => setEditMode((e) => !e)}
          accessibilityLabel={editMode ? "Done editing" : "Edit unit order and visibility"}
          hitSlop={8}
          style={{ paddingHorizontal: 4 }}
        >
          <Text style={{ color: colors.accent, fontSize: fontSize.md, fontWeight: fontWeight.medium }}>
            {editMode ? "Done" : "Edit"}
          </Text>
        </Pressable>
      ),
    });
  }, [category?.name, editMode, colors.accent]);

  // ── Conversion logic ─────────────────────────────────────────────────────────

  const parseResult = useMemo(() => {
    if (!input.trim()) return null;
    return parseExpression(input);
  }, [input]);

  const results = useMemo(() => {
    if (!category || !parseResult?.ok) return [];
    const srcUnit = findUnit(category, activeUnitId);
    if (!srcUnit) return [];
    return convertAll(parseResult.value, srcUnit, category);
  }, [category, parseResult, activeUnitId]);

  const resultMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const r of results) m[r.unit.id] = r.value;
    return m;
  }, [results]);

  const handleKey = useCallback(
    (key: string) => {
      setInput((prev) => {
        if (key === "backspace") return prev.slice(0, -1);
        if (key === "negate") return prev.startsWith("-") ? prev.slice(1) : "-" + prev;
        if (key === "enter") {
          if (parseResult?.ok) {
            const topResults = results
              .filter((r) => r.unit.id !== activeUnitId)
              .slice(0, 4)
              .map((r) => ({ unitId: r.unit.id, value: r.value }));
            history.push({ categoryId: id ?? "", sourceUnitId: activeUnitId, inputValue: prev, topResults });
          }
          return prev;
        }
        return prev + key;
      });
    },
    [parseResult, id, activeUnitId, results, history]
  );

  const handlePaste = useCallback(async () => {
    const text = await Clipboard.getStringAsync();
    const cleaned = text.trim().replace(/[^\d.\-+*/^()eEpi ]/g, "");
    if (cleaned) setInput(cleaned);
  }, []);

  const handleShare = useCallback(async () => {
    if (!input.trim() || !parseResult?.ok || results.length === 0) return;
    const activeUnit = findUnit(category!, activeUnitId);
    const lines = results
      .filter((r) => !hiddenIds.has(r.unit.id))
      .slice(0, 6)
      .map((r) => {
        const v = settings.fractionMode
          ? formatFraction(new Decimal(r.value), settings.fractionDenominator)
          : formatValue(new Decimal(r.value), { sigFigs: settings.sigFigs, notation: settings.notation });
        return `${v} ${r.unit.symbol}`;
      })
      .join("\n");
    Share.share({ message: `${input} ${activeUnit?.symbol ?? activeUnitId}\n\n${lines}` });
  }, [input, parseResult, results, activeUnitId, hiddenIds, settings, category]);

  const handleRowPress = useCallback(
    (unit: Unit) => {
      const rawValue = resultMap[unit.id];
      if (!rawValue) {
        setActiveUnitId(unit.id);
        return;
      }
      setInput(new Decimal(rawValue).toSignificantDigits(12).toFixed());
      setActiveUnitId(unit.id);
    },
    [resultMap]
  );

  // ── Favorites ─────────────────────────────────────────────────────────────────

  const isFavorite = useCallback(
    (unitId: string) =>
      favorites.favorites.some(
        (f) => f.categoryId === id && f.sourceUnitId === activeUnitId && f.targetUnitId === unitId
      ),
    [favorites.favorites, id, activeUnitId]
  );

  const toggleFavorite = useCallback(
    (unit: Unit) => {
      const activeUnit = category?.units.find((u) => u.id === activeUnitId);
      const existing = favorites.favorites.find(
        (f) => f.categoryId === id && f.sourceUnitId === activeUnitId && f.targetUnitId === unit.id
      );
      if (existing) {
        favorites.remove(existing.id);
      } else {
        favorites.add({
          label: `${activeUnit?.symbol ?? activeUnitId} → ${unit.symbol}`,
          categoryId: id ?? "",
          sourceUnitId: activeUnitId,
          targetUnitId: unit.id,
          mode: "allResults",
        });
      }
    },
    [category, favorites, id, activeUnitId]
  );

  // ── Edit mode actions ─────────────────────────────────────────────────────────

  const moveUnit = useCallback(
    (index: number, direction: "up" | "down") => {
      const arr = [...orderedUnits.map((u) => u.id)];
      const swapWith = direction === "up" ? index - 1 : index + 1;
      if (swapWith < 0 || swapWith >= arr.length) return;
      [arr[index], arr[swapWith]] = [arr[swapWith], arr[index]];
      unitPrefs.setOrder(id ?? "", arr);
    },
    [orderedUnits, id, unitPrefs]
  );

  const toggleHidden = useCallback(
    (unitId: string) => {
      if (hiddenIds.has(unitId)) {
        unitPrefs.showUnit(id ?? "", unitId);
      } else {
        unitPrefs.hideUnit(id ?? "", unitId);
      }
    },
    [hiddenIds, id, unitPrefs]
  );

  const restoreDefaults = useCallback(() => {
    unitPrefs.resetCategory(id ?? "");
  }, [id, unitPrefs]);

  // ── Guards ────────────────────────────────────────────────────────────────────

  if (!category) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: colors.textSecondary }}>Category not found</Text>
      </View>
    );
  }

  const activeUnit = findUnit(category, activeUnitId);
  const hasInput = !!input.trim();
  const parseError = hasInput && parseResult && !parseResult.ok ? parseResult.error : null;

  // ── Edit mode render ──────────────────────────────────────────────────────────

  if (editMode) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <FlatList
          data={orderedUnits}
          keyExtractor={(u) => u.id}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListHeaderComponent={
            <View style={{ padding: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }}>
              <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>
                Use ↑ ↓ to reorder. Tap Visible / Hidden to toggle.
              </Text>
            </View>
          }
          ListFooterComponent={
            <Pressable
              onPress={restoreDefaults}
              accessibilityLabel="Restore default unit order and show all units"
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
                Restore Defaults
              </Text>
            </Pressable>
          }
          renderItem={({ item: unit, index }) => {
            const isHidden = hiddenIds.has(unit.id);
            const isFirst = index === 0;
            const isLast = index === orderedUnits.length - 1;
            return (
              <View
                style={[
                  styles.editRow,
                  {
                    backgroundColor: isHidden ? colors.surfaceAlt : colors.surface,
                    borderBottomColor: colors.border,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                  },
                ]}
              >
                {/* Move buttons */}
                <View style={styles.moveButtons}>
                  <Pressable
                    onPress={() => moveUnit(index, "up")}
                    disabled={isFirst}
                    accessibilityLabel={`Move ${unit.name} up`}
                    hitSlop={6}
                    style={({ pressed }) => ({
                      width: 32,
                      height: 32,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: radius.sm,
                      backgroundColor: isFirst ? "transparent" : colors.surfaceAlt,
                      opacity: isFirst ? 0.2 : pressed ? 0.6 : 1,
                    })}
                  >
                    <Text style={{ fontSize: fontSize.md, color: colors.textSecondary }}>↑</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => moveUnit(index, "down")}
                    disabled={isLast}
                    accessibilityLabel={`Move ${unit.name} down`}
                    hitSlop={6}
                    style={({ pressed }) => ({
                      width: 32,
                      height: 32,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: radius.sm,
                      backgroundColor: isLast ? "transparent" : colors.surfaceAlt,
                      opacity: isLast ? 0.2 : pressed ? 0.6 : 1,
                    })}
                  >
                    <Text style={{ fontSize: fontSize.md, color: colors.textSecondary }}>↓</Text>
                  </Pressable>
                </View>

                {/* Unit info */}
                <View style={{ flex: 1, marginHorizontal: spacing.md }}>
                  <Text style={{ fontSize: fontSize.md, fontWeight: fontWeight.medium, color: isHidden ? colors.textTertiary : colors.text }}>
                    {unit.symbol}
                  </Text>
                  <Text style={{ fontSize: fontSize.sm, color: colors.textTertiary }} numberOfLines={1}>
                    {unit.name}
                  </Text>
                </View>

                {/* Hide/show toggle */}
                <Pressable
                  onPress={() => toggleHidden(unit.id)}
                  accessibilityLabel={isHidden ? `Show ${unit.name}` : `Hide ${unit.name}`}
                  style={({ pressed }) => ({
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs,
                    borderRadius: radius.full,
                    backgroundColor: isHidden ? colors.surfaceAlt : colors.accentMuted,
                    borderWidth: 1,
                    borderColor: isHidden ? colors.border : colors.accent,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Text style={{ fontSize: fontSize.sm, color: isHidden ? colors.textTertiary : colors.accent, fontWeight: fontWeight.medium }}>
                    {isHidden ? "Hidden" : "Visible"}
                  </Text>
                </Pressable>
              </View>
            );
          }}
        />
      </SafeAreaView>
    );
  }

  // ── Normal mode render ────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Input card */}
      <View
        style={[
          styles.inputCard,
          { backgroundColor: colors.surface, borderBottomColor: colors.border, padding: spacing.md },
        ]}
      >
        <View style={styles.inputRow}>
          <Pressable
            onLongPress={handlePaste}
            accessibilityLabel={`Input: ${input || "0"}. Long press to paste.`}
            style={{ flex: 1 }}
          >
            <Text
              style={{
                fontSize: fontSize.display,
                fontWeight: fontWeight.medium,
                color: hasInput ? colors.text : colors.textTertiary,
              }}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {input || "0"}
            </Text>
          </Pressable>
          {hasInput && (
            <Pressable onPress={handleShare} accessibilityLabel="Share result" hitSlop={8} style={{ marginLeft: spacing.sm }}>
              <Text style={{ color: colors.textTertiary, fontSize: fontSize.md }}>↗</Text>
            </Pressable>
          )}
          {hasInput && (
            <Pressable onPress={() => setInput("")} accessibilityLabel="Clear input" hitSlop={8} style={{ marginLeft: spacing.sm }}>
              <Text style={{ color: colors.textTertiary, fontSize: fontSize.lg }}>✕</Text>
            </Pressable>
          )}
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: spacing.xs, gap: spacing.sm }}>
          <Pressable
            onPress={() => setShowUnitPicker(true)}
            accessibilityLabel={`Active unit: ${activeUnit?.name ?? activeUnitId}. Tap to change.`}
            style={({ pressed }) => ({
              backgroundColor: colors.accentMuted,
              borderRadius: radius.full,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ color: colors.accent, fontWeight: fontWeight.semibold, fontSize: fontSize.md }}>
              {activeUnit?.symbol ?? activeUnitId} ▾
            </Text>
          </Pressable>

          <Pressable
            onPress={() => settings.setFractionMode(!settings.fractionMode)}
            accessibilityLabel={settings.fractionMode ? "Switch to decimal" : "Switch to fractions"}
            style={({ pressed }) => ({
              backgroundColor: settings.fractionMode ? colors.accent : colors.surfaceAlt,
              borderRadius: radius.full,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
              borderWidth: 1,
              borderColor: settings.fractionMode ? colors.accent : colors.border,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ color: settings.fractionMode ? colors.accentText : colors.textSecondary, fontSize: fontSize.sm, fontWeight: fontWeight.medium }}>
              {settings.fractionMode ? `1/${settings.fractionDenominator}` : "1/x"}
            </Text>
          </Pressable>
        </View>

        {parseError && (
          <Text style={{ color: colors.error, fontSize: fontSize.sm, marginTop: spacing.xs }}>
            {parseError}
          </Text>
        )}
      </View>

      {/* Results list — hidden units are filtered out */}
      <FlatList
        data={orderedUnits.filter((u) => !hiddenIds.has(u.id))}
        keyExtractor={(u) => u.id}
        style={{ flex: 1 }}
        renderItem={({ item: unit }) => {
          const rawValue = resultMap[unit.id];
          const formattedValue =
            rawValue && parseResult?.ok
              ? settings.fractionMode
                ? formatFraction(new Decimal(rawValue), settings.fractionDenominator)
                : formatValue(new Decimal(rawValue), {
                    sigFigs: settings.sigFigs,
                    notation: settings.notation,
                    decimalSeparator: settings.decimalSeparator,
                    groupThousands: settings.groupThousands,
                  })
              : "";

          const exactFactor = (() => {
            if (!settings.showExactFactors) return undefined;
            if (unit.id === activeUnitId) return undefined;
            if (unit.kind !== "linear" || activeUnit?.kind !== "linear") return undefined;
            const sm = activeUnit?.toBase?.multiplier;
            const tm = unit.toBase?.multiplier;
            if (!sm || !tm) return undefined;
            const f = new Decimal(sm).div(new Decimal(tm));
            const formatted = formatValue(f, { sigFigs: 6, notation: "auto" });
            return `× ${formatted}`;
          })();

          return (
            <ConversionRow
              unit={unit}
              formattedValue={formattedValue}
              exactFactor={exactFactor}
              isActive={unit.id === activeUnitId}
              isFavorite={isFavorite(unit.id)}
              onPress={() => handleRowPress(unit)}
              onLongPress={() => {}}
              onToggleFavorite={() => toggleFavorite(unit)}
            />
          );
        }}
      />

      <EngineeringKeypad
        onKey={handleKey}
        hapticsEnabled={settings.hapticsEnabled}
        decimalSeparator={settings.decimalSeparator}
      />

      {/* Unit picker modal */}
      <Modal visible={showUnitPicker} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: spacing.md,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: colors.border,
            }}
          >
            <Text style={{ fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.text }}>
              Select Unit
            </Text>
            <Pressable onPress={() => setShowUnitPicker(false)} accessibilityLabel="Close unit picker" hitSlop={8}>
              <Text style={{ color: colors.accent, fontSize: fontSize.md }}>Done</Text>
            </Pressable>
          </View>
          <ScrollView>
            {orderedUnits.map((unit) => (
              <Pressable
                key={unit.id}
                onPress={() => { setActiveUnitId(unit.id); setShowUnitPicker(false); }}
                accessibilityLabel={`Select ${unit.name} (${unit.symbol})`}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: spacing.md,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.border,
                  backgroundColor: unit.id === activeUnitId ? colors.accentMuted : colors.background,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View>
                  <Text style={{ fontSize: fontSize.md, fontWeight: fontWeight.medium, color: colors.text }}>
                    {unit.symbol}
                  </Text>
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{unit.name}</Text>
                </View>
                {unit.id === activeUnitId && (
                  <Text style={{ color: colors.accent, fontSize: fontSize.lg }}>✓</Text>
                )}
              </Pressable>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inputCard: { borderBottomWidth: StyleSheet.hairlineWidth },
  inputRow: { flexDirection: "row", alignItems: "center" },
  editRow: { flexDirection: "row", alignItems: "center", borderBottomWidth: StyleSheet.hairlineWidth },
  moveButtons: { gap: 4 },
});
