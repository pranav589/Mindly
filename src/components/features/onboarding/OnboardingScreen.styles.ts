import { StyleSheet } from "react-native";
import { theme } from "@/theme/themes";

export const getStyles = (insets: { top: number; bottom: number }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    },
    skipRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingHorizontal: 24,
      paddingVertical: 8,
    },
    skipText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.textMuted,
    },
    carousel: {
      flex: 1,
    },
    slide: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 32,
      alignItems: "center",
    },
    illustrationCard: {
      width: "100%",
      aspectRatio: 1,
      borderRadius: 32,
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
      marginBottom: 48,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    iconCircle: {
      width: 96,
      height: 96,
      borderRadius: 9999,
      backgroundColor: theme.colors.surface,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: theme.colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 1,
    },
    textContainer: {
      alignItems: "center",
      paddingHorizontal: 16,
    },
    slideTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.primary,
      textAlign: "center",
      marginBottom: 16,
    },
    slideDescription: {
      fontSize: 14,
      color: theme.colors.gray500,
      textAlign: "center",
      lineHeight: 24,
      maxWidth: 280,
    },
    bottomControls: {
      paddingHorizontal: 24,
      paddingBottom: 32,
      paddingTop: 16,
      alignItems: "center",
    },
    dotsRow: {
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
      marginBottom: 32,
    },
    dot: {
      height: 6,
      borderRadius: 9999,
    },
    dotActive: {
      width: 24,
      backgroundColor: theme.colors.primary,
    },
    dotInactive: {
      width: 6,
      backgroundColor: theme.colors.borderMuted,
    },
    buttonLabel: {
      color: theme.colors.textLight,
      fontWeight: "600",
      fontSize: 14,
    },
  });
