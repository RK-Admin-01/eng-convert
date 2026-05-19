export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  display: 32,
} as const;

export const fontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};

type ColorScale = {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  borderStrong: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  accent: string;
  accentMuted: string;
  accentText: string;
  error: string;
  success: string;
  inputBackground: string;
};

export const lightColors: ColorScale = {
  background: "#F8F8F8",
  surface: "#FFFFFF",
  surfaceAlt: "#F0F0F0",
  border: "#E0E0E0",
  borderStrong: "#C0C0C0",
  text: "#111111",
  textSecondary: "#555555",
  textTertiary: "#888888",
  accent: "#0066CC",
  accentMuted: "#E6F0FF",
  accentText: "#FFFFFF",
  error: "#CC2200",
  success: "#1A7A3C",
  inputBackground: "#FFFFFF",
};

export const darkColors: ColorScale = {
  background: "#0E0E0E",
  surface: "#1A1A1A",
  surfaceAlt: "#242424",
  border: "#2E2E2E",
  borderStrong: "#404040",
  text: "#F2F2F2",
  textSecondary: "#AAAAAA",
  textTertiary: "#666666",
  accent: "#4D9EFF",
  accentMuted: "#1A2D45",
  accentText: "#FFFFFF",
  error: "#FF6B6B",
  success: "#4CAF7A",
  inputBackground: "#1A1A1A",
};

export type Colors = ColorScale;
