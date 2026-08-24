export const theme = {
  colors: {
    // Brand Colors
    primary: "#117864",       // Core green
    primaryLight: "#a2d9ce",  // Light mint green
    primaryDark: "#005d4d",   // Dark forest green
    primarySubtle: "rgba(162, 217, 206, 0.35)", // Semi-transparent mint for backgrounds

    // UI Colors
    background: "#f8fafa",    // Main app background
    surface: "#ffffff",       // Cards, modals, sheets
    border: "#e0e6e6",        // Light separator borders
    borderMuted: "#e5e7eb",   // Gray borders

    // Text Colors
    text: "#1f2937",          // Default body text
    textDark: "#030712",      // High contrast heading text
    textHeading: "#111827",   // Modal titles / section titles
    textSecondary: "#6e7a75", // Subtitles / description text
    textMuted: "#9ca3af",     // Placeholders / disabled text
    textLight: "#ffffff",     // Contrast text on primary backgrounds
    textError: "#dc2626",     // Error notifications or states

    // Gray scale helpers
    gray50: "#f9fafb",
    gray100: "#f3f4f6",
    gray200: "#e5e7eb",
    gray300: "#d1d5db",
    gray400: "#9ca3af",
    gray500: "#6e7a75",
    gray700: "#374151",
    gray900: "#111827",

    // Accent Statuses
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",

    // Specialized Logic and Icon Colors
    placeholder: "#bdc9c4",
    lightGrayIcon: "#c8d8d5",
    accentGreen: "#2e7d32",     // Success green text/border
    accentOrange: "#f57c00",    // Warning orange text/border
    accentRed: "#c62828",       // High-priority red text/border
    accentBlue: "#2563eb",      // Blue tags/buttons
    onboardingTertiary: "#42591a",
    studioBlue: "#2563eb",
    studioOrange: "#d97706",
    logoutRed: "#c0392b",
    mutedGrayIcon: "#6b7280",
    grayTextMuted: "#4b5563",
    grayTextLight: "#85929e",
    grayTextMedium: "#5d6d7e",
    successLight: "#e8f5e9",
    successBorder: "#a5d6a7",
    warningLight: "#fff3e0",
    warningBorder: "#ffcc80",
    infoLight: "#e3f2fd",
    infoBorder: "#90caf9",
    infoText: "#1565c0",
    errorLight: "#ffebee",
    errorBorder: "#ef9a9a",
    black: "#000000",
    highlightBg: "rgba(218, 247, 166, 0.4)",
    highlightText: "#131f00",
    immersiveBackground: "#191c1d",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
  },
};

export type AppTheme = typeof theme;
