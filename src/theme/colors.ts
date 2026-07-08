export const lightColors = {
  background: "#F5F7FA",
  card: "white",
  text: "#1A1A2E",
  textSecondary: "#8A94A6",
  textMuted: "#5C6470",
  border: "#F5F7FA",
  teal: "#0BC4BC",
  tealDark: "#089A94",
  tealLight: "#E8FAF9",
  tealMuted: "#C2F3F0",
  error: "#FF6B6B",
  errorBg: "#FFF1F0",
  warning: "#F59E0B",
  success: "#10B981",
};

export const darkColors = {
  background: "#0B0F19", // Dark, modern navy/black
  card: "#161E2D", // Slightly lighter for cards
  text: "#F1F5F9", // Off-white for high contrast but soft reading
  textSecondary: "#94A3B8", // Slate-400 for secondary text
  textMuted: "#64748B", // Slate-500
  border: "#1E293B", // Darker border
  teal: "#0BC4BC", // Same brand teal
  tealDark: "#0D9488", // Darker teal
  tealLight: "#134E4A", // Dark theme version of teal light (deep teal)
  tealMuted: "#0F766E", // Muted teal for dark mode
  error: "#F87171",
  errorBg: "#450A0A",
  warning: "#FBBF24",
  success: "#34D399",
};

export type ThemeColors = typeof lightColors;
