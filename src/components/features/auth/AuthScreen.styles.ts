import { StyleSheet } from "react-native";

export const getStyles = (insets: { top: number; bottom: number }) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: "#f8fafa",
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
      backgroundColor: "#117864",
      borderRadius: 9999,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
      shadowColor: "#117864",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 3,
    },
    appName: {
      fontSize: 30,
      fontWeight: "bold",
      color: "#117864",
      letterSpacing: -0.5,
    },
    appTagline: {
      fontSize: 14,
      color: "#6b7280",
      marginTop: 4,
    },
    tabsRow: {
      flexDirection: "row",
      backgroundColor: "#f3f4f6",
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
      backgroundColor: "#ffffff",
      elevation: 1,
    },
    tabText: {
      fontSize: 12,
      fontWeight: "600",
    },
    tabTextActive: {
      color: "#117864",
    },
    tabTextInactive: {
      color: "#6b7280",
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
      color: "#6b7280",
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#ffffff",
      borderWidth: 1,
      borderColor: "#e0e6e6",
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
      color: "#1f2937",
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
      borderColor: "#e0e6e6",
      borderRadius: 4,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#ffffff",
    },
    checkboxChecked: {
      backgroundColor: "rgba(17, 120, 100, 0.1)",
      borderColor: "#117864",
    },
    rememberLabel: {
      fontSize: 12,
      color: "#6b7280",
    },
    forgotText: {
      fontSize: 12,
      color: "#117864",
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
      backgroundColor: "#e0e6e6",
    },
    dividerText: {
      fontSize: 12,
      color: "#9ca3af",
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
      borderColor: "#e0e6e6",
      borderRadius: 8,
      backgroundColor: "#ffffff",
    },
    socialButtonPressed: {
      backgroundColor: "#f9fafb",
    },
    socialText: {
      fontSize: 12,
      fontWeight: "600",
      color: "#374151",
    },
  });
