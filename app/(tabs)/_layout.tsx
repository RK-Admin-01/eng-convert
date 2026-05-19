import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { useSettingsStore } from "../../src/store/settingsStore";
import { darkColors, lightColors } from "../../src/theme/tokens";

export default function TabsLayout() {
  const systemScheme = useColorScheme();
  const themeSetting = useSettingsStore((s) => s.theme);
  const isDark =
    themeSetting === "dark" ||
    (themeSetting === "system" && systemScheme === "dark");
  const colors = isDark ? darkColors : lightColors;

  return (
    <Tabs
      initialRouteName="pair"
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="pair"
        options={{ title: "Pair Convert", tabBarLabel: "Pair", tabBarAccessibilityLabel: "Pair convert tab" }}
      />
      <Tabs.Screen
        name="index"
        options={{ title: "Convert", tabBarLabel: "All Units", tabBarAccessibilityLabel: "All units tab", headerShown: false }}
      />
      <Tabs.Screen
        name="favorites"
        options={{ title: "Favorites", tabBarLabel: "Favorites", tabBarAccessibilityLabel: "Favorites tab" }}
      />
      <Tabs.Screen
        name="history"
        options={{ title: "History", tabBarLabel: "History", tabBarAccessibilityLabel: "History tab" }}
      />
      <Tabs.Screen
        name="constants"
        options={{ title: "Constants", tabBarLabel: "Constants", tabBarAccessibilityLabel: "Constants tab" }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: "Settings", tabBarLabel: "Settings", tabBarAccessibilityLabel: "Settings tab" }}
      />
    </Tabs>
  );
}
