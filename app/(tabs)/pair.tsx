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
import Decimal from "decimal.js";
import { useTheme } from "../../src/theme/useTheme";
import { ALL_CATEGORIES, getCategoryById } from "../../src/conversion/registry";
import { convertValue, findUnit } from "../../src/conversion/engine";
import { parseExpression } from "../../src/conversion/expressionParser";
import { formatValue, formatFraction } from "../../src/conversion/format";
import { useSettingsStore } from "../../src/store/settingsStore";
import { useUnitPreferencesStore } from "../../src/store/unitPreferencesStore";
import { EngineeringKeypad } from "../../src/components/EngineeringKeypad";

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

  // Apply saved default pair once the store finishes loading from AsyncStorage
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
      if (settings.fractionMode) {
        return formatFraction(result, settings.fractionDenominator);
      }
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
    const newFrom = toUnitId;
    const newTo = fromUnitId;
    setFromUnitId(newFrom);
    setToUnitId(newTo);
    // Carry numeric result across as new input
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

  const handlePaste = useCallback(async () => {
    const text = await Clipboard.getStringAsync();
    const cleaned = text.trim().replace(/[^\d.\-+*/^()eEpi ]/g, "");
    if (cleaned) setInput(cleaned);
  }, []);

  const handleShare = useCallback(async () => {
    if (!toValue || !fromUnit || !toUnit) return;
    Share.share({ message: `${input} ${fromUnit.symbol} = ${toValue} ${toUnit.symbol}` });
  }, [input, toValue, fromUnit, toUnit]);

  const UnitPickerModal = ({ visible, onClose, onSelect, currentId }: {
    visible: boolean; onClose: () => void; onSelect: (id: string) => void; currentId: string;
  }) => (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", padding: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }}>
          <Text style={{ fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.text }}>Select Unit</Text>
          <Pressable onPress={onClose} accessibilityLabel="Close"><Text style={{ color: colors.accent }}>Done</Text></Pressable>
        </View>
        <ScrollView>
          {category.units.map((u) => (
            <Pressable key={u.id} onPress={() => { onSelect(u.id); onClose(); }}
              style={({ pressed }) => ({ padding: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border, backgroundColor: u.id === currentId ? colors.accentMuted : colors.background, flexDirection: "row", justifyContent: "space-between", opacity: pressed ? 0.7 : 1 })}
              accessibilityLabel={`Select ${u.name}`}>
              <View>
                <Text style={{ fontSize: fontSize.md, fontWeight: fontWeight.medium, color: colors.text }}>{u.symbol}</Text>
                <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{u.name}</Text>
              </View>
              {u.id === currentId && <Text style={{ color: colors.accent, fontSize: fontSize.lg }}>✓</Text>}
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.md }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Category selector */}
        <Pressable
          onPress={() => setShowCatPicker(true)}
          accessibilityLabel={`Category: ${category.name}. Tap to change.`}
          style={({ pressed }) => [styles.catBtn, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md, opacity: pressed ? 0.7 : 1 }]}
        >
          <Text style={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text }}>{category.name}</Text>
          <Text style={{ color: colors.textTertiary }}>▾</Text>
        </Pressable>

        {/* FROM display */}
        <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: fontSize.xs }]}>FROM</Text>
        <View style={[styles.field, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md }]}>
          <Pressable onLongPress={handlePaste} style={{ flex: 1 }} accessibilityLabel={`Input: ${input || "0"}. Long press to paste.`}>
            <Text
              style={{ fontSize: fontSize.xxl, fontWeight: fontWeight.medium, color: hasInput ? colors.text : colors.textTertiary, padding: spacing.md }}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {input || "0"}
            </Text>
          </Pressable>
          {hasInput && (
            <Pressable onPress={() => setInput("")} hitSlop={8} style={{ padding: spacing.md }}>
              <Text style={{ color: colors.textTertiary, fontSize: fontSize.lg }}>✕</Text>
            </Pressable>
          )}
          <Pressable onPress={() => setShowFromPicker(true)} accessibilityLabel={`From unit: ${fromUnit?.name}. Tap to change.`} style={{ padding: spacing.md }}>
            <Text style={{ fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.accent }}>{fromUnit?.symbol} ▾</Text>
          </Pressable>
        </View>

        {parseError && (
          <Text style={{ color: colors.error, fontSize: fontSize.sm, marginTop: spacing.xs }}>{parseError}</Text>
        )}

        {/* Swap + fraction toggle */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: spacing.sm, gap: spacing.md }}>
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

          <Pressable
            onPress={handleSwap}
            accessibilityLabel="Swap source and target units"
            style={({ pressed }) => ({ backgroundColor: colors.accentMuted, borderRadius: radius.full, width: 44, height: 44, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.7 : 1 })}
          >
            <Text style={{ fontSize: fontSize.xl, color: colors.accent }}>⇅</Text>
          </Pressable>
        </View>

        {/* TO display */}
        <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: fontSize.xs }]}>TO</Text>
        <View style={[styles.field, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, borderRadius: radius.md }]}>
          <Text
            style={{ flex: 1, fontSize: fontSize.xxl, fontWeight: fontWeight.medium, color: colors.text, padding: spacing.md }}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {toValue || "—"}
          </Text>
          <Pressable onPress={() => setShowToPicker(true)} accessibilityLabel={`To unit: ${toUnit?.name}. Tap to change.`} style={{ padding: spacing.md }}>
            <Text style={{ fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.accent }}>{toUnit?.symbol} ▾</Text>
          </Pressable>
        </View>

        {/* Action buttons */}
        <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.md }}>
          <Pressable
            onPress={async () => {
              if (toValue) await Clipboard.setStringAsync(`${toValue} ${toUnit?.symbol ?? ""}`);
            }}
            accessibilityLabel="Copy result"
            style={({ pressed }) => [styles.actionBtn, { backgroundColor: colors.accentMuted, borderRadius: radius.md, opacity: pressed ? 0.7 : 1, flex: 1 }]}
          >
            <Text style={{ color: colors.accent, fontWeight: fontWeight.medium }}>Copy</Text>
          </Pressable>
          <Pressable
            onPress={handleShare}
            accessibilityLabel="Share result"
            style={({ pressed }) => [styles.actionBtn, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.md, opacity: pressed ? 0.7 : 1, flex: 1 }]}
          >
            <Text style={{ color: colors.text, fontWeight: fontWeight.medium }}>Share</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push(`/category/${categoryId}`)}
            accessibilityLabel="Show all units for this category"
            style={({ pressed }) => [styles.actionBtn, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.md, opacity: pressed ? 0.7 : 1, flex: 1 }]}
          >
            <Text style={{ color: colors.text, fontWeight: fontWeight.medium }}>All Units</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => unitPrefs.setDefaultPair(categoryId, fromUnitId, toUnitId)}
          accessibilityLabel={`Save as default pair for ${category.name}`}
          style={({ pressed }) => [styles.actionBtn, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.md, marginTop: spacing.sm, opacity: pressed ? 0.7 : 1 }]}
        >
          <Text style={{ color: colors.textSecondary, fontSize: fontSize.sm }}>
            Save as Default Pair for {category.name}
          </Text>
        </Pressable>
      </ScrollView>

      <EngineeringKeypad
        onKey={handleKey}
        hapticsEnabled={settings.hapticsEnabled}
        decimalSeparator={settings.decimalSeparator}
      />

      {/* Category picker */}
      <Modal visible={showCatPicker} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", padding: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }}>
            <Text style={{ fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.text }}>Select Category</Text>
            <Pressable onPress={() => setShowCatPicker(false)} accessibilityLabel="Close"><Text style={{ color: colors.accent }}>Done</Text></Pressable>
          </View>
          <ScrollView>
            {ALL_CATEGORIES.map((cat) => (
              <Pressable key={cat.id} onPress={() => handleCategoryChange(cat.id)}
                style={({ pressed }) => ({ padding: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border, backgroundColor: cat.id === categoryId ? colors.accentMuted : colors.background, opacity: pressed ? 0.7 : 1 })}
                accessibilityLabel={`Select ${cat.name}`}>
                <Text style={{ fontSize: fontSize.md, color: colors.text, fontWeight: cat.id === categoryId ? fontWeight.semibold : fontWeight.regular }}>{cat.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <UnitPickerModal visible={showFromPicker} onClose={() => setShowFromPicker(false)} onSelect={setFromUnitId} currentId={fromUnitId} />
      <UnitPickerModal visible={showToPicker} onClose={() => setShowToPicker(false)} onSelect={setToUnitId} currentId={toUnitId} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  catBtn: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, padding: 12, marginBottom: 12 },
  fieldLabel: { fontWeight: "600", marginBottom: 4 },
  field: { flexDirection: "row", alignItems: "center", borderWidth: 1 },
  actionBtn: { padding: 12, alignItems: "center", justifyContent: "center" },
});
