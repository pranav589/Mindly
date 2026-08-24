import { StyleSheet } from "react-native";
import { theme } from "@/theme/themes";

export const getStyles = (insets: { top: number; bottom: number }) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scroll: {
      paddingHorizontal: 24,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      paddingTop: insets.top + 20,
      paddingBottom: insets.bottom + 20,
    },
    card: {
      width: "100%",
      borderWidth: 1,
      borderRadius: 24,
      padding: 24,
      marginBottom: 32,
      backgroundColor: "rgba(255, 255, 255, 0.75)",
      borderColor: "rgba(255, 255, 255, 0.4)",
      shadowColor: "rgba(17, 120, 100, 0.1)",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 32,
      elevation: 4,
    },
    brandingContainer: {
      alignItems: "center",
      marginBottom: 24,
    },
    logoCircle: {
      width: 64,
      height: 64,
      backgroundColor: theme.colors.primary,
      borderRadius: 9999,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 3,
    },
    appName: {
      fontSize: 30,
      fontWeight: "bold",
      color: theme.colors.primary,
      letterSpacing: -0.5,
    },
    appTagline: {
      fontSize: 14,
      color: theme.colors.gray500,
      marginTop: 4,
    },
    tabsRow: {
      flexDirection: "row",
      backgroundColor: theme.colors.gray100,
      borderRadius: 8,
      padding: 4,
      marginBottom: 24,
    },
    tab: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 6,
      alignItems: "center",
    },
    tabActive: {
      backgroundColor: theme.colors.surface,
      elevation: 1,
    },
    tabText: {
      fontSize: 12,
      fontWeight: "600",
    },
    tabTextActive: {
      color: theme.colors.primary,
    },
    tabTextInactive: {
      color: theme.colors.gray500,
    },
    formContainer: {
      gap: 16,
    },
    fieldGroup: {
      gap: 4,
    },
    fieldLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.gray500,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    inputIcon: {
      marginRight: 8,
    },
    textInput: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.text,
    },
    eyeButton: {
      padding: 4,
    },
    rememberRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 4,
    },
    rememberMe: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    checkbox: {
      width: 16,
      height: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 4,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.surface,
    },
    checkboxChecked: {
      backgroundColor: "rgba(17, 120, 100, 0.1)",
      borderColor: theme.colors.primary,
    },
    rememberLabel: {
      fontSize: 12,
      color: theme.colors.gray500,
    },
    forgotText: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    submitButton: {
      marginTop: 16,
    },
    dividerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 24,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border,
    },
    dividerText: {
      fontSize: 12,
      color: theme.colors.gray400,
      paddingHorizontal: 12,
    },
    socialRow: {
      flexDirection: "row",
      gap: 12,
    },
    socialButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      backgroundColor: theme.colors.surface,
    },
    socialButtonPressed: {
      backgroundColor: theme.colors.gray50,
    },
    socialText: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.gray700,
    },
  });
