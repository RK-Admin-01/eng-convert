import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Pressable,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/theme/useTheme";
import { SearchBox } from "../../src/components/SearchBox";
import { CategoryCard } from "../../src/components/CategoryCard";
import { QuietRow } from "../../src/components/QuietRow";
import { ALL_CATEGORIES, searchCategories } from "../../src/conversion/registry";
import type { CategoryGroup } from "../../src/conversion/types";

const GROUP_ORDER: CategoryGroup[] = [
  "common",
  "mechanical",
  "fluids",
  "thermal",
  "electrical",
  "dataTimeAngles",
];

const GROUP_LABELS: Record<CategoryGroup, string> = {
  common: "Common",
  mechanical: "Mechanical",
  fluids: "Fluids",
  thermal: "Thermal",
  electrical: "Electrical",
  dataTimeAngles: "Data / Time / Angles",
  other: "Other",
};

const GROUP_DESCRIPTIONS: Record<CategoryGroup, string> = {
  common: "Length, area, volume, mass, temperature, time",
  mechanical: "Force, pressure, torque, energy, power, density",
  fluids: "Flow, viscosity",
  thermal: "Conductivity, heat flux, specific heat",
  electrical: "Voltage, current, resistance, frequency",
  dataTimeAngles: "Storage, angles",
  other: "",
};

export default function HomeScreen() {
  const { colors, spacing, fontSize, fontWeight, radius } = useTheme();
  const [query, setQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<CategoryGroup | null>(null);
  const router = useRouter();

  const searchResults = useMemo(() => {
    if (!query.trim()) return null;
    return searchCategories(query);
  }, [query]);

  const grouped = useMemo(
    () =>
      GROUP_ORDER.map((group) => ({
        group,
        label: GROUP_LABELS[group],
        description: GROUP_DESCRIPTIONS[group],
        categories: ALL_CATEGORIES.filter((c) => c.group === group),
      })).filter((g) => g.categories.length > 0),
    []
  );

  const selectedGroupData = useMemo(
    () => grouped.find((g) => g.group === selectedGroup) ?? null,
    [grouped, selectedGroup]
  );

  const goToCategory = (categoryId: string) => {
    router.push(`/category/${categoryId}`);
  };

  // ── Search results ──────────────────────────────────────────────────────────
  if (searchResults) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <SearchBox value={query} onChangeText={setQuery} autoFocus />
        </View>
        <ScrollView
          contentContainerStyle={{ padding: spacing.md }}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
        >
          <Text style={{ color: colors.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.sm }}>
            {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
          </Text>
          {searchResults.length === 0 ? (
            <Text style={{ color: colors.textTertiary, fontSize: fontSize.md, marginTop: spacing.xl }}>
              No results for "{query}"
            </Text>
          ) : (
            <View style={{ borderRadius: radius.lg, overflow: "hidden", backgroundColor: colors.surface }}>
              {searchResults.map((hit, index) => (
                <Pressable
                  key={hit.category.id + (hit.matchedUnit?.id ?? "")}
                  onPress={() => goToCategory(hit.category.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`${hit.category.name}${hit.matchedUnit ? `, matched ${hit.matchedUnit.name}` : ""}`}
                  style={({ pressed }) => ({
                    backgroundColor: colors.surface,
                    borderBottomColor: colors.border,
                    borderBottomWidth: index === searchResults.length - 1 ? 0 : StyleSheet.hairlineWidth,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.md,
                    opacity: pressed ? 0.55 : 1,
                  })}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.text }}>
                      {hit.category.name}
                    </Text>
                    <Text style={{ fontSize: fontSize.xs, color: colors.textTertiary }}>
                      {GROUP_LABELS[hit.category.group]}
                    </Text>
                  </View>
                  {hit.matchedUnit && (
                    <Text style={{ fontSize: fontSize.sm, color: colors.accent, marginTop: 2 }}>
                      {hit.matchedUnit.symbol} · {hit.matchedUnit.name}
                    </Text>
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Category list for a selected group ──────────────────────────────────────
  if (selectedGroup && selectedGroupData) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <View style={styles.groupHeader}>
            <Pressable
              onPress={() => setSelectedGroup(null)}
              accessibilityLabel="Back to groups"
              hitSlop={12}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, marginRight: spacing.md })}
            >
              <Text style={{ fontSize: fontSize.xl, color: colors.accent }}>‹</Text>
            </Pressable>
            <Text style={{ fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text, flex: 1 }}>
              {selectedGroupData.label}
            </Text>
          </View>
          <SearchBox value={query} onChangeText={setQuery} />
        </View>
        <ScrollView
          contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ borderRadius: radius.lg, overflow: "hidden", backgroundColor: colors.surface }}>
            {selectedGroupData.categories.map((cat, index) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onPress={() => goToCategory(cat.id)}
                isLast={index === selectedGroupData.categories.length - 1}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Group list (default home) ────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={{ fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.md }}>
          Unit Converter
        </Text>
        <SearchBox value={query} onChangeText={setQuery} />
      </View>
      <ScrollView
        contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ borderRadius: radius.lg, overflow: "hidden", backgroundColor: colors.surface }}>
          {grouped.map(({ group, label, description, categories }, index) => (
            <QuietRow
              key={group}
              title={label}
              subtitle={description}
              meta={`${categories.length} ${categories.length === 1 ? "category" : "categories"}`}
              isLast={index === grouped.length - 1}
              onPress={() => setSelectedGroup(group)}
              accessibilityLabel={`${label}, ${categories.length} categories`}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  groupHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
});
