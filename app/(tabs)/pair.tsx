import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Modal,
  Share,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/theme/useTheme";
import { ALL_CATEGORIES, getCategoryById } from "../../src/conversion/registry";
import { convertValue, findUnit } from "../../src/conversion/engine";
import { parseExpression } from "../../src/conversion/expressionParser";
import { formatValue, formatFraction } from "../../src/conversion/format";
import { useSettingsStore } from "../../src/store/settingsStore";
import { useUnitPreferencesStore } from "../../src/store/unitPreferencesStore";
import { EngineeringKeypad } from "../../src/components/EngineeringKeypad";
import { PairField } from "../../src/components/PairField";
import { PairActionsBar } from "../../src/components/PairActionsBar";
import { UnitPickerModal } from "../../src/components/UnitPickerModal";

export default function PairConvertScreen() {
  const { colors, spacing, fontSize, fontWeight, radius } = useTheme();
  const settings = useSettingsStore();
  const unitPrefs = useUnitPreferencesStore();
  const router = useRouter();

  const [categoryId, setCategoryId] = useState("length");
  const [fromUnitId, setFromUnitId] = useState("foot");
  const [toUnitId, setToUnitId] = useState("meter");
  const [input, setInput] = useState("");

  const [showCatPicker, setShowCatPicker] = useState(false);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const category = getCategoryById(categoryId)!;
  const fromUnit = findUnit(category, fromUnitId);
  const toUnit = findUnit(category, toUnitId);

  const defaultApplied = useRef(false);
  useEffect(() => {
    if (defaultApplied.current) return;
    const saved = unitPrefs.prefs["length"]?.defaultPair;
    if (!saved) return;
    const cat = getCategoryById("length");
    if (cat && findUnit(cat, saved.fromUnitId) && findUnit(cat, saved.toUnitId)) {
      defaultApplied.current = true;
      setFromUnitId(saved.fromUnitId);
      setToUnitId(saved.toUnitId);
    }
  }, [unitPrefs.prefs]);

  const parsed = useMemo(() => {
    if (!input.trim()) return null;
    return parseExpression(input);
  }, [input]);

  const toValue = useMemo(() => {
    if (!parsed?.ok || !fromUnit || !toUnit) return "";
    try {
      const result = convertValue(parsed.value, fromUnit, toUnit, category);
      if (settings.fractionMode) return formatFraction(result, settings.fractionDenominator);
      return formatValue(result, {
        sigFigs: settings.sigFigs,
        notation: settings.notation,
        decimalSeparator: settings.decimalSeparator,
        groupThousands: settings.groupThousands,
      });
    } catch {
      return "";
    }
  }, [parsed, fromUnit, toUnit, category, settings]);

  const handleKey = useCallback((key: string) => {
    setInput((prev) => {
      if (key === "backspace") return prev.slice(0, -1);
      if (key === "negate") return prev.startsWith("-") ? prev.slice(1) : "-" + prev;
      if (key === "enter") return prev;
      return prev + key;
    });
  }, []);

  const handleSwap = () => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
    if (parsed?.ok && fromUnit && toUnit) {
      try {
        const result = convertValue(parsed.value, fromUnit, toUnit, category);
        setInput(result.toSignificantDigits(12).toFixed());
      } catch {
        setInput("");
      }
    } else {
      setInput("");
    }
  };

  const handleCategoryChange = (catId: string) => {
    const cat = getCategoryById(catId);
    if (!cat) return;
    setCategoryId(catId);
    const saved = unitPrefs.prefs[catId]?.defaultPair;
    if (saved && findUnit(cat, saved.fromUnitId) && findUnit(cat, saved.toUnitId)) {
      setFromUnitId(saved.fromUnitId);
      setToUnitId(saved.toUnitId);
    } else {
      setFromUnitId(cat.baseUnitId);
      const second = cat.units.find((u) => u.id !== cat.baseUnitId);
      setToUnitId(second?.id ?? cat.baseUnitId);
    }
    setInput("");
    setShowCatPicker(false);
  };

  const hasInput = !!input.trim();
  const parseError = hasInput && parsed && !parsed.ok ? parsed.error : null;

  const handleShare = useCallback(async () => {
    if (!toValue || !fromUnit || !toUnit) return;
    Share.share({ message: `${input} ${fromUnit.symbol} = ${toValue} ${toUnit.symbol}` });
  }, [input, toValue, fromUnit, toUnit]);

  const handleCopy = useCallback(async () => {
    if (toValue) await Clipboard.setStringAsync(`${toValue} ${toUnit?.symbol ?? ""}`);
  }, [toValue, toUnit]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.md }}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Category selector */}
        <Pressable
          onPress={() => setShowCatPicker(true)}
          accessibilityRole="button"
          accessibilityLabel={`Category: ${category.name}. Tap to change.`}
          style={({ pressed }) => [
            styles.catBtn,
            {
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              opacity: pressed ? 0.7 : 1,
              marginBottom: spacing.md,
            },
          ]}
        >
          <Text style={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text }}>
            {category.name}
          </Text>
          <Text style={{ color: colors.textTertiary }}>▾</Text>
        </Pressable>

        <PairField
          label="FROM"
          value={input}
          unitSymbol={fromUnit?.symbol}
          showClear={hasInput}
          onClear={() => setInput("")}
          error={parseError}
          onUnitPress={() => setShowFromPicker(true)}
        />

        {/* Swap + fraction toggle */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: spacing.md, gap: spacing.md }}>
          <Pressable
            onPress={() => settings.setFractionMode(!settings.fractionMode)}
            accessibilityLabel={settings.fractionMode ? "Switch to decimal" : "Switch to fractions"}
            style={({ pressed }) => ({
              backgroundColor: settings.fractionMode ? colors.accent : colors.surfaceAlt,
              borderRadius: radius.full,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ color: settings.fractionMode ? colors.accentText : colors.textSecondary, fontSize: fontSize.sm, fontWeight: fontWeight.medium }}>
              {settings.fractionMode ? `1/${settings.fractionDenominator}` : "1/x"}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleSwap}
            accessibilityLabel="Swap source and target units"
            style={({ pressed }) => ({
              backgroundColor: colors.surfaceAlt,
              borderRadius: radius.full,
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ fontSize: fontSize.xl, color: colors.accent }}>⇅</Text>
          </Pressable>
        </View>

        <PairField
          label="TO"
          value={toValue}
          placeholder="—"
          unitSymbol={toUnit?.symbol}
          onUnitPress={() => setShowToPicker(true)}
        />

        <PairActionsBar
          canCopy={!!toValue}
          onCopy={handleCopy}
          onShare={handleShare}
          onShowAllUnits={() => router.push(`/category/${categoryId}`)}
          onSaveDefault={() => unitPrefs.setDefaultPair(categoryId, fromUnitId, toUnitId)}
        />
      </ScrollView>

      <EngineeringKeypad
        onKey={handleKey}
        hapticsEnabled={settings.hapticsEnabled}
        decimalSeparator={settings.decimalSeparator}
      />

      {/* Category picker */}
      <Modal visible={showCatPicker} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowCatPicker(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", padding: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }}>
            <Text style={{ fontSize: fontSize.xl, fontWeight: fontWeight.semibold, color: colors.text }}>Select Category</Text>
            <Pressable onPress={() => setShowCatPicker(false)} accessibilityLabel="Close" style={{ minWidth: 44, minHeight: 44, justifyContent: "center", alignItems: "flex-end" }}>
              <Text style={{ color: colors.accent, fontSize: fontSize.lg, fontWeight: fontWeight.medium }}>Done</Text>
            </Pressable>
          </View>
          <ScrollView>
            {ALL_CATEGORIES.map((cat, index) => (
              <Pressable
                key={cat.id}
                onPress={() => handleCategoryChange(cat.id)}
                style={({ pressed }) => ({
                  padding: spacing.md,
                  borderBottomWidth: index === ALL_CATEGORIES.length - 1 ? 0 : StyleSheet.hairlineWidth,
                  borderBottomColor: colors.border,
                  backgroundColor: cat.id === categoryId ? colors.accentMuted : colors.surface,
                  opacity: pressed ? 0.7 : 1,
                })}
                accessibilityLabel={`Select ${cat.name}`}
              >
                <Text style={{ fontSize: fontSize.lg, color: colors.text, fontWeight: cat.id === categoryId ? fontWeight.semibold : fontWeight.regular }}>
                  {cat.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <UnitPickerModal
        visible={showFromPicker}
        title="From Unit"
        units={category.units}
        currentId={fromUnitId}
        onClose={() => setShowFromPicker(false)}
        onSelect={setFromUnitId}
      />
      <UnitPickerModal
        visible={showToPicker}
        title="To Unit"
        units={category.units}
        currentId={toUnitId}
        onClose={() => setShowToPicker(false)}
        onSelect={setToUnitId}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  catBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
});
