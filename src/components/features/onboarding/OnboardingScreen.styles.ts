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
      height: 40,
    },
    skipText: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.colors.gray500,
    },
    carousel: {
      flex: 1,
    },
    slide: {
      flex: 1,
      justifyContent: "space-between",
      paddingHorizontal: 24,
      alignItems: "center",
      paddingBottom: 20,
    },
    logoContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      marginTop: 10,
    },
    logoText: {
      fontSize: 18,
      fontWeight: "800",
      color: theme.colors.textDark,
    },
    textContainer: {
      alignItems: "center",
      paddingHorizontal: 16,
      marginTop: 20,
    },
    slideTitle: {
      fontSize: 28,
      fontWeight: "800",
      color: theme.colors.textDark,
      textAlign: "center",
      marginBottom: 12,
      lineHeight: 36,
    },
    slideDescription: {
      fontSize: 14,
      color: theme.colors.gray500,
      textAlign: "center",
      lineHeight: 22,
      maxWidth: 320,
    },
    illustrationContainer: {
      width: "100%",
      aspectRatio: 1.1,
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 10,
    },
    illustrationImage: {
      width: "90%",
      height: "90%",
      resizeMode: "contain",
    },
    bottomControls: {
      paddingHorizontal: 24,
      paddingBottom: 24,
      paddingTop: 10,
      alignItems: "center",
      width: "100%",
    },
    dotsRow: {
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
      marginBottom: 24,
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
    button: {
      width: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      height: 48,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    buttonLabel: {
      color: theme.colors.textLight,
      fontWeight: "700",
      fontSize: 15,
    },
  });
