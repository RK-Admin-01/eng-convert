import React from "react";
import { TextInput, View, Pressable, Text, StyleSheet } from "react-native";
import { useTheme } from "../theme/useTheme";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
};

export function SearchBox({ value, onChangeText, placeholder = "Search unit or category", autoFocus }: Props) {
  const { colors, radius, spacing, fontSize } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceAlt,
          borderColor: colors.border,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
        },
      ]}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        autoFocus={autoFocus}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        clearButtonMode="while-editing"
        accessibilityLabel="Search input"
        style={[
          styles.input,
          {
            color: colors.text,
            fontSize: fontSize.md,
          },
        ]}
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText("")}
          accessibilityLabel="Clear search"
          hitSlop={8}
        >
          <Text style={{ color: colors.textTertiary, fontSize: fontSize.md }}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    height: 44,
  },
  input: {
    flex: 1,
    height: "100%",
  },
});
