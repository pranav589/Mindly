import { StyleSheet } from "react-native";

export const getStyles = (insets: { top: number; bottom: number }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f8fafa",
      paddingHorizontal: 24,
      justifyContent: "space-between",
      paddingTop: insets.top > 0 ? insets.top + 20 : 80,
      paddingBottom: insets.bottom > 0 ? insets.bottom + 20 : 40,
    },
    header: {
      alignItems: "center",
      marginBottom: 40,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#117864",
      textAlign: "center",
    },
    subtitle: {
      fontSize: 14,
      color: "#6b7280",
      marginTop: 8,
      textAlign: "center",
    },
    profileCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#ffffff",
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#e5e7eb",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
      marginBottom: "auto",
      marginTop: 20,
    },
    avatarCircle: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "rgba(17, 120, 100, 0.1)",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    profileInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#111827",
    },
    userEmail: {
      fontSize: 14,
      color: "#6b7280",
      marginTop: 4,
    },
    buttonWrapper: {
      width: "100%",
    },
    logoutButton: {
      borderColor: "#e5e7eb",
    },
    logoutContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    logoutText: {
      color: "#c0392b",
      fontWeight: "600",
      fontSize: 14,
    },
  });
