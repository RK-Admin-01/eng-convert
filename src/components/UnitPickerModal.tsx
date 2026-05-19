import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTheme } from "../theme/useTheme";
import type { Unit } from "../conversion/types";

type UnitPickerModalProps = {
  visible: boolean;
  title?: string;
  units: Unit[];
  currentId: string;
  onClose: () => void;
  onSelect: (id: string) => void;
};

export function UnitPickerModal({
  visible,
  title = "Select Unit",
  units,
  currentId,
  onClose,
  onSelect,
}: UnitPickerModalProps) {
  const { colors, spacing, radius, fontSize, fontWeight } = useTheme();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return units;
    return units.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.symbol.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
    );
  }, [query, units]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === "ios" ? "pageSheet" : "fullScreen"}
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.header,
            { borderBottomColor: colors.border, paddingHorizontal: spacing.md },
          ]}
        >
          <Text
            allowFontScaling
            style={{ color: colors.text, fontSize: fontSize.xl, fontWeight: fontWeight.semibold }}
          >
            {title}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={() => { setQuery(""); onClose(); }}
            style={styles.doneButton}
          >
            <Text
              allowFontScaling
              style={{ color: colors.accent, fontSize: fontSize.lg, fontWeight: fontWeight.medium }}
            >
              Done
            </Text>
          </Pressable>
        </View>

        <View style={{ padding: spacing.md }}>
          <View
            style={[
              styles.search,
              { backgroundColor: colors.surfaceAlt, borderRadius: radius.lg, paddingHorizontal: spacing.md },
            ]}
          >
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search units"
              placeholderTextColor={colors.textTertiary}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              clearButtonMode="while-editing"
              style={{ flex: 1, minHeight: 44, color: colors.text, fontSize: fontSize.lg }}
            />
          </View>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(unit) => unit.id}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
          renderItem={({ item, index }) => {
            const selected = item.id === currentId;
            const isLast = index === filtered.length - 1;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`Select ${item.name}`}
                onPress={() => { setQuery(""); onSelect(item.id); onClose(); }}
                style={({ pressed }) => [
                  styles.row,
                  {
                    backgroundColor: colors.surface,
                    borderBottomColor: colors.border,
                    borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
                    opacity: pressed ? 0.55 : 1,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.md,
                  },
                ]}
              >
                <Text
                  allowFontScaling
                  style={{ width: 72, color: colors.text, fontSize: fontSize.lg, fontWeight: fontWeight.semibold }}
                  numberOfLines={1}
                >
                  {item.symbol}
                </Text>
                <Text
                  allowFontScaling
                  style={{ flex: 1, color: colors.text, fontSize: fontSize.lg }}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                {selected ? (
                  <Text
                    allowFontScaling={false}
                    style={{ color: colors.accent, fontSize: fontSize.xl, fontWeight: fontWeight.semibold }}
                  >
                    ✓
                  </Text>
                ) : null}
              </Pressable>
            );
          }}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  doneButton: {
    marginLeft: "auto",
    minWidth: 64,
    minHeight: 44,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  search: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
  },
  row: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
  },
});
