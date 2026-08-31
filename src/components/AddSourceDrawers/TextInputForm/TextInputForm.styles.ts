import { StyleSheet } from "react-native";
import { theme } from "@/theme/themes";

export const styles = StyleSheet.create({
  drawerInputTitle: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.borderMuted,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 16,
    fontSize: 14,
    color: theme.colors.textHeading,
    marginBottom: 12,
    backgroundColor: theme.colors.gray50,
  },
  drawerInputContent: {
    width: "100%",
    height: 160,
    borderWidth: 1,
    borderColor: theme.colors.borderMuted,
    borderRadius: theme.borderRadius.md,
    padding: 16,
    fontSize: 14,
    color: theme.colors.textHeading,
    marginBottom: 16,
    backgroundColor: theme.colors.gray50,
  },
  drawerSubmitButton: {
    width: "100%",
    height: 48,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  drawerSubmitButtonText: {
    color: theme.colors.textLight,
    fontSize: 14,
    fontWeight: "bold",
  },
});
