import { StyleSheet } from "react-native";
import { theme } from "@/theme/themes";

export const styles = StyleSheet.create({
  sourceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
    paddingVertical: 12,
  },
  sourceButton: {
    width: "48%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: theme.colors.gray50,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderMuted,
    gap: 8,
  },
  sourceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primarySubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  sourceButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
  },
});
