import React from "react";
import { ScrollView, SafeAreaView, Switch, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/theme/useTheme";
import { useSettingsStore } from "../../src/store/settingsStore";
import { QuietRow } from "../../src/components/QuietRow";
import {
  SettingsSection,
  SettingsRow,
  MinimalSegmentedControl,
} from "../../src/components/SettingsPrimitives";
import type { Theme as ThemeSetting } from "../../src/store/settingsStore";
import type { Notation } from "../../src/conversion/format";

export default function SettingsScreen() {
  const { colors, spacing } = useTheme();
  const settings = useSettingsStore();
  const router = useRouter();

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
  const denomOptions = [8, 16, 32, 64, 128].map((n) => ({ label: `/${n}`, value: n }));

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ paddingTop: spacing.md, paddingBottom: spacing.xxl }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <SettingsSection title="Display">
          <SettingsRow label="Significant Figures">
            <MinimalSegmentedControl
              label="Significant figures"
              options={sigFigOptions}
              value={settings.sigFigs}
              onChange={settings.setSigFigs}
            />
          </SettingsRow>
          <SettingsRow label="Notation">
            <MinimalSegmentedControl
              label="Notation"
              options={notationOptions}
              value={settings.notation}
              onChange={settings.setNotation}
            />
          </SettingsRow>
          <SettingsRow label="Group Thousands">
            <Switch value={settings.groupThousands} onValueChange={settings.setGroupThousands} />
          </SettingsRow>
          <SettingsRow label="Show Exact Factors">
            <Switch value={settings.showExactFactors} onValueChange={settings.setShowExactFactors} />
          </SettingsRow>
          <SettingsRow label="Fraction Mode" isLast={!settings.fractionMode}>
            <Switch value={settings.fractionMode} onValueChange={settings.setFractionMode} />
          </SettingsRow>
          {settings.fractionMode && (
            <SettingsRow label="Round to" isLast>
              <MinimalSegmentedControl
                label="Fraction denominator"
                options={denomOptions}
                value={settings.fractionDenominator}
                onChange={settings.setFractionDenominator}
              />
            </SettingsRow>
          )}
        </SettingsSection>

        <SettingsSection title="Appearance">
          <SettingsRow label="Theme" isLast>
            <MinimalSegmentedControl
              label="Theme"
              options={themeOptions}
              value={settings.theme}
              onChange={settings.setTheme}
            />
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="Behavior">
          <SettingsRow label="Haptics" isLast>
            <Switch value={settings.hapticsEnabled} onValueChange={settings.setHapticsEnabled} />
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="Saved">
          <QuietRow
            title="Favorites"
            subtitle="Saved unit pairs"
            onPress={() => router.push("/favorites")}
          />
          <QuietRow
            title="History"
            subtitle="Recent conversions"
            isLast
            onPress={() => router.push("/history")}
          />
        </SettingsSection>

        <SettingsSection
          title="Privacy"
          footer="Works offline. No ads, analytics SDK, tracking SDK, account system, or currency conversion API."
        />

        <SettingsSection
          title="About"
          footer={"Engineering Unit Converter — offline, ad-free, privacy-respecting.\nConversion factors sourced from NIST SP 811, BIPM SI Brochure, and NIST Appendix B."}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
});
