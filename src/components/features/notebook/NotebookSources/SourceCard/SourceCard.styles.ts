import { StyleSheet } from "react-native";
import { theme } from "@/theme/themes";

export const styles = StyleSheet.create({
  sourceCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 24,
    marginBottom: 12,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  processingCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primaryLight,
  },
  typeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gray100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  sourceDetails: {
    flex: 1,
    justifyContent: "center",
    marginRight: 12,
  },
  sourceName: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  sourceTime: {
    fontSize: 11,
    fontWeight: "600",
  },
  sourceStatusSynced: {
    color: theme.colors.textSecondary,
  },
  sourceStatusSyncing: {
    color: theme.colors.primary,
  },
  sourceStatusFailed: {
    color: theme.colors.textError,
  },
});
