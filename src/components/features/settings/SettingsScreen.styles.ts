import { theme } from "@/theme/themes";
import { StyleSheet } from "react-native";

export const getStyles = (insets: { top: number; bottom: number }) =>
  StyleSheet.create({
    scrollContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      paddingHorizontal: 24,
      paddingTop: insets.top > 0 ? insets.top + 20 : 80,
      paddingBottom: insets.bottom > 0 ? insets.bottom + 40 : 60,
    },
    header: {
      alignItems: "center",
      marginBottom: 40,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.primary,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.mutedGrayIcon,
      marginTop: 8,
      textAlign: "center",
    },
    profileCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
      shadowColor: theme.colors.black,
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
      color: theme.colors.textHeading,
    },
    userEmail: {
      fontSize: 14,
      color: theme.colors.mutedGrayIcon,
      marginTop: 4,
    },
    buttonWrapper: {
      width: "100%",
      marginTop: 16,
    },
    logoutButton: {
      borderColor: theme.colors.borderMuted,
    },
    logoutContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    logoutText: {
      color: theme.colors.logoutRed,
      fontWeight: "600",
      fontSize: 14,
    },
    settingsCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
      padding: 16,
      marginTop: 20,
      marginBottom: "auto",
    },
    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 4,
    },
    settingIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "rgba(17, 120, 100, 0.08)",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    settingInfo: {
      flex: 1,
      justifyContent: "center",
    },
    settingLabel: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.colors.textHeading,
    },
    settingSublabel: {
      fontSize: 12,
      color: theme.colors.mutedGrayIcon,
      marginTop: 2,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.borderMuted,
      marginVertical: 12,
    },
    timeBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(17, 120, 100, 0.05)",
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "rgba(17, 120, 100, 0.1)",
      gap: 4,
    },
    timeBadgeText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.primary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      alignItems: "center",
      justifyContent: "center",
    },
    modalContent: {
      width: "80%",
      backgroundColor: theme.colors.surface,
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
      alignItems: "center",
    },
    modalHeader: {
      marginBottom: 20,
      width: "100%",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.textHeading,
      textAlign: "center",
    },
    pickerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      marginVertical: 16,
    },
    pickerColumn: {
      alignItems: "center",
      width: 50,
    },
    pickerArrow: {
      padding: 8,
    },
    pickerValueText: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.textHeading,
      marginVertical: 4,
    },
    pickerSeparator: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.borderMuted,
      marginBottom: 6,
    },
    periodContainer: {
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
      borderRadius: 12,
      overflow: "hidden",
      width: 60,
    },
    periodButton: {
      paddingVertical: 8,
      alignItems: "center",
      backgroundColor: theme.colors.surface,
    },
    periodActiveButton: {
      backgroundColor: "rgba(17, 120, 100, 0.1)",
    },
    periodText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.mutedGrayIcon,
    },
    periodActiveText: {
      color: theme.colors.primary,
    },
    modalSaveButton: {
      marginTop: 20,
      width: "100%",
    },
  });
