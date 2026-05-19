import React from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Pressable,
  Switch,
  StyleSheet,
} from "react-native";
import { useTheme } from "../../src/theme/useTheme";
import { useSettingsStore } from "../../src/store/settingsStore";
import type { Theme as ThemeSetting } from "../../src/store/settingsStore";
import type { Notation } from "../../src/conversion/format";

function Row({
  label,
  children,
  accessibilityLabel,
}: {
  label: string;
  children: React.ReactNode;
  accessibilityLabel?: string;
}) {
  const { colors, spacing, fontSize } = useTheme();
  return (
    <View
      style={[
        styles.row,
        {
          borderBottomColor: colors.border,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
        },
      ]}
      accessible
      accessibilityLabel={accessibilityLabel ?? label}
    >
      <Text style={{ fontSize: fontSize.md, color: colors.text, flex: 1 }}>{label}</Text>
      {children}
    </View>
  );
}

function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  label,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  const { colors, radius, fontSize, fontWeight, spacing } = useTheme();
  return (
    <View style={{ flexDirection: "row", gap: 4 }}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            accessibilityLabel={`${label}: ${opt.label}${active ? ", selected" : ""}`}
            accessibilityRole="button"
            style={({ pressed }) => ({
              backgroundColor: active ? colors.accent : colors.surfaceAlt,
              borderRadius: radius.sm,
              paddingHorizontal: spacing.sm,
              paddingVertical: spacing.xs,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ fontSize: fontSize.sm, color: active ? colors.accentText : colors.text, fontWeight: active ? fontWeight.semibold : fontWeight.regular }}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function SettingsScreen() {
  const { colors, spacing, fontSize, fontWeight } = useTheme();
  const settings = useSettingsStore();

  const sigFigOptions = [4, 6, 8, 10, 12].map((n) => ({ label: String(n), value: n }));
  const notationOptions: { label: string; value: Notation }[] = [
    { label: "Auto", value: "auto" },
    { label: "Normal", value: "normal" },
    { label: "Sci", value: "scientific" },
    { label: "Eng", value: "engineering" },
  ];
  const themeOptions: { label: string; value: ThemeSetting }[] = [
    { label: "System", value: "system" },
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
  ];

  const SectionHeader = ({ title }: { title: string }) => (
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
      {title.toUpperCase()}
    </Text>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <SectionHeader title="Display" />
        <View style={{ backgroundColor: colors.surface, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.border }}>
          <Row label="Significant Figures">
            <SegmentedControl
              label="Significant figures"
              options={sigFigOptions}
              value={settings.sigFigs}
              onChange={settings.setSigFigs}
            />
          </Row>
          <Row label="Notation">
            <SegmentedControl
              label="Notation"
              options={notationOptions}
              value={settings.notation}
              onChange={settings.setNotation}
            />
          </Row>
          <Row label="Group Thousands" accessibilityLabel={`Group thousands: ${settings.groupThousands ? "on" : "off"}`}>
            <Switch
              value={settings.groupThousands}
              onValueChange={settings.setGroupThousands}
              accessibilityLabel="Group thousands toggle"
            />
          </Row>
          <Row label="Show Exact Factors" accessibilityLabel={`Show exact factors: ${settings.showExactFactors ? "on" : "off"}`}>
            <Switch
              value={settings.showExactFactors}
              onValueChange={settings.setShowExactFactors}
              accessibilityLabel="Show exact factors toggle"
            />
          </Row>
          <Row label="Fraction Mode" accessibilityLabel={`Fraction mode: ${settings.fractionMode ? "on" : "off"}`}>
            <Switch
              value={settings.fractionMode}
              onValueChange={settings.setFractionMode}
              accessibilityLabel="Fraction mode toggle"
            />
          </Row>
          {settings.fractionMode && (
            <Row label="Round to" accessibilityLabel={`Round fractions to 1/${settings.fractionDenominator}`}>
              <SegmentedControl
                label="Fraction denominator"
                options={[8, 16, 32, 64, 128].map((n) => ({ label: `/${n}`, value: n }))}
                value={settings.fractionDenominator}
                onChange={settings.setFractionDenominator}
              />
            </Row>
          )}
        </View>

        <SectionHeader title="Appearance" />
        <View style={{ backgroundColor: colors.surface, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.border }}>
          <Row label="Theme">
            <SegmentedControl
              label="Theme"
              options={themeOptions}
              value={settings.theme}
              onChange={settings.setTheme}
            />
          </Row>
        </View>

        <SectionHeader title="Behavior" />
        <View style={{ backgroundColor: colors.surface, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.border }}>
          <Row label="Haptics" accessibilityLabel={`Haptics: ${settings.hapticsEnabled ? "on" : "off"}`}>
            <Switch
              value={settings.hapticsEnabled}
              onValueChange={settings.setHapticsEnabled}
              accessibilityLabel="Haptics toggle"
            />
          </Row>
        </View>

        <SectionHeader title="Privacy" />
        <View style={{ backgroundColor: colors.surface, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.border, padding: spacing.md }}>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20 }}>
            This app is designed to work offline. It has no ads, no analytics SDK, no tracking SDK, no account system, and no currency conversion API.
          </Text>
        </View>

        <SectionHeader title="About" />
        <View style={{ backgroundColor: colors.surface, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.border, padding: spacing.md }}>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>
            Engineering Unit Converter — offline, ad-free, privacy-respecting.{"\n"}
            Conversion factors sourced from NIST SP 811, BIPM SI Brochure, and NIST Appendix B.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 44,
  },
});
