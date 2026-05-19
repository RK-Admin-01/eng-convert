import { useEffect } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { useSettingsStore } from "../src/store/settingsStore";
import { useFavoritesStore } from "../src/store/favoritesStore";
import { useHistoryStore } from "../src/store/historyStore";
import { useUnitPreferencesStore } from "../src/store/unitPreferencesStore";
import { darkColors, lightColors } from "../src/theme/tokens";

export default function RootLayout() {
  const systemScheme = useColorScheme();
  const loadSettings = useSettingsStore((s) => s.load);
  const loadFavorites = useFavoritesStore((s) => s.load);
  const loadHistory = useHistoryStore((s) => s.load);
  const loadUnitPrefs = useUnitPreferencesStore((s) => s.load);
  const themeSetting = useSettingsStore((s) => s.theme);

  const isDark =
    themeSetting === "dark" ||
    (themeSetting === "system" && systemScheme === "dark");

  const colors = isDark ? darkColors : lightColors;

  useEffect(() => {
    loadSettings();
    loadFavorites();
    loadHistory();
    loadUnitPrefs();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "600" },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="category/[id]"
          options={{ title: "", headerBackTitle: "Back" }}
        />
      </Stack>
    </View>
  );
}
