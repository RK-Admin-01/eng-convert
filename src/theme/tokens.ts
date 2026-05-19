export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
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
  background: "#F2F2F7",
  surface: "#FFFFFF",
  surfaceAlt: "#F7F7F8",
  border: "rgba(60, 60, 67, 0.18)",
  borderStrong: "rgba(60, 60, 67, 0.30)",
  text: "#111111",
  textSecondary: "rgba(60, 60, 67, 0.72)",
  textTertiary: "rgba(60, 60, 67, 0.45)",
  accent: "#007AFF",
  accentMuted: "rgba(0, 122, 255, 0.12)",
  accentText: "#FFFFFF",
  error: "#D70015",
  success: "#248A3D",
  inputBackground: "#FFFFFF",
};

export const darkColors: ColorScale = {
  background: "#000000",
  surface: "#1C1C1E",
  surfaceAlt: "#2C2C2E",
  border: "rgba(84, 84, 88, 0.45)",
  borderStrong: "rgba(84, 84, 88, 0.65)",
  text: "#F2F2F7",
  textSecondary: "rgba(235, 235, 245, 0.72)",
  textTertiary: "rgba(235, 235, 245, 0.45)",
  accent: "#0A84FF",
  accentMuted: "rgba(10, 132, 255, 0.18)",
  accentText: "#FFFFFF",
  error: "#FF453A",
  success: "#30D158",
  inputBackground: "#1C1C1E",
};

export type Colors = ColorScale;
