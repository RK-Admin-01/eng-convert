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
import { ALL_CATEGORIES, searchCategories } from "../../src/conversion/registry";
import { useFavoritesStore } from "../../src/store/favoritesStore";
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
  const favorites = useFavoritesStore((s) => s.favorites);

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
        <ScrollView contentContainerStyle={{ padding: spacing.md }}>
          <Text style={{ color: colors.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.sm }}>
            {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
          </Text>
          {searchResults.length === 0 ? (
            <Text style={{ color: colors.textTertiary, fontSize: fontSize.md, marginTop: spacing.xl }}>
              No results for "{query}"
            </Text>
          ) : (
            searchResults.map((hit) => (
              <Pressable
                key={hit.category.id + (hit.matchedUnit?.id ?? "")}
                onPress={() => goToCategory(hit.category.id)}
                accessibilityLabel={`${hit.category.name}${hit.matchedUnit ? `, matched ${hit.matchedUnit.name}` : ""}`}
                style={({ pressed }) => [
                  styles.searchResult,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: radius.md,
                    padding: spacing.md,
                    marginBottom: spacing.sm,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text }}>
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
            ))
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
              <Text style={{ fontSize: fontSize.lg, color: colors.accent }}>‹</Text>
            </Pressable>
            <Text style={{ fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text, flex: 1 }}>
              {selectedGroupData.label}
            </Text>
          </View>
          <SearchBox value={query} onChangeText={setQuery} />
        </View>
        <ScrollView contentContainerStyle={{ padding: spacing.sm, paddingBottom: spacing.xl }}>
          <View style={styles.grid}>
            {selectedGroupData.categories.map((cat) => (
              <View key={cat.id} style={styles.gridItem}>
                <CategoryCard category={cat} onPress={() => goToCategory(cat.id)} />
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Group grid (default home) ────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={{ fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.md }}>
          Unit Converter
        </Text>
        <SearchBox value={query} onChangeText={setQuery} />
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.sm, paddingBottom: spacing.xl }}>
        {favorites.length > 0 && (
          <View style={{ paddingHorizontal: spacing.sm, marginBottom: spacing.md }}>
            <Text style={{ fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: colors.textSecondary, marginBottom: spacing.sm }}>
              FAVORITES
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {favorites.slice(0, 8).map((fav) => (
                <Pressable
                  key={fav.id}
                  onPress={() => goToCategory(fav.categoryId)}
                  accessibilityLabel={fav.label}
                  style={({ pressed }) => ({
                    backgroundColor: colors.accentMuted,
                    borderColor: colors.accent,
                    borderWidth: 1,
                    borderRadius: radius.full,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs,
                    marginRight: spacing.sm,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Text style={{ fontSize: fontSize.sm, color: colors.accent, fontWeight: fontWeight.medium }}>
                    {fav.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {grouped.map(({ group, label, description, categories }) => (
          <Pressable
            key={group}
            onPress={() => setSelectedGroup(group)}
            accessibilityRole="button"
            accessibilityLabel={`${label}, ${categories.length} categories`}
            style={({ pressed }) => [
              styles.groupCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: radius.md,
                padding: spacing.md,
                marginBottom: spacing.sm,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <View style={styles.groupCardRow}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.text }}>
                  {label}
                </Text>
                {description ? (
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 3 }} numberOfLines={1}>
                    {description}
                  </Text>
                ) : null}
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ fontSize: fontSize.xs, color: colors.textTertiary, marginBottom: 2 }}>
                  {categories.length} {categories.length === 1 ? "category" : "categories"}
                </Text>
                <Text style={{ fontSize: fontSize.lg, color: colors.textTertiary }}>›</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  groupHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  gridItem: { width: "50%", padding: 4 },
  groupCard: { borderWidth: 1 },
  groupCardRow: { flexDirection: "row", alignItems: "center" },
  searchResult: { borderWidth: 1 },
});
