import { useColorScheme } from "react-native";
import { lightColors, darkColors, spacing, radius, fontSize, fontWeight } from "./tokens";
import type { Colors } from "./tokens";
import { useSettingsStore } from "../store/settingsStore";

export type Theme = {
  colors: Colors;
  spacing: typeof spacing;
  radius: typeof radius;
  fontSize: typeof fontSize;
  fontWeight: typeof fontWeight;
  isDark: boolean;
};

export function useTheme(): Theme {
  const systemScheme = useColorScheme();
  const themeSetting = useSettingsStore((s) => s.theme);

  const isDark =
    themeSetting === "dark" ||
    (themeSetting === "system" && systemScheme === "dark");

  return {
    colors: isDark ? darkColors : lightColors,
    spacing,
    radius,
    fontSize,
    fontWeight,
    isDark,
  };
}
