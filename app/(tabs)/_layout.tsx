import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { useSettingsStore } from "../../src/store/settingsStore";
import { darkColors, lightColors } from "../../src/theme/tokens";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

function TabIcon({
  focused,
  color,
  size,
  active,
  inactive,
}: {
  focused: boolean;
  color: string;
  size: number;
  active: IoniconName;
  inactive: IoniconName;
}) {
  return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
}

export default function TabsLayout() {
  const systemScheme = useColorScheme();
  const themeSetting = useSettingsStore((s) => s.theme);
  const isDark =
    themeSetting === "dark" ||
    (themeSetting === "system" && systemScheme === "dark");
  const colors = isDark ? darkColors : lightColors;

  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: { fontSize: 11 },
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="pair"
        options={{
          title: "Convert",
          tabBarAccessibilityLabel: "Convert tab",
          tabBarIcon: (props) => (
            <TabIcon {...props} active="swap-horizontal" inactive="swap-horizontal-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="convert"
        options={{
          title: "Units",
          tabBarAccessibilityLabel: "All units tab",
          headerShown: false,
          tabBarIcon: (props) => (
            <TabIcon {...props} active="list" inactive="list-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="constants"
        options={{
          title: "Constants",
          tabBarAccessibilityLabel: "Constants tab",
          tabBarIcon: (props) => (
            <TabIcon {...props} active="flask" inactive="flask-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarAccessibilityLabel: "Settings tab",
          tabBarIcon: (props) => (
            <TabIcon {...props} active="settings" inactive="settings-outline" />
          ),
        }}
      />
      <Tabs.Screen name="favorites" options={{ href: null }} />
      <Tabs.Screen name="history" options={{ href: null }} />
    </Tabs>
  );
}
