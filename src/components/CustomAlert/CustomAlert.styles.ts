import { StyleSheet } from "react-native";
import { theme } from "@/theme/themes";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainerInfo: {
    backgroundColor: "rgba(17, 120, 100, 0.1)",
  },
  iconContainerSuccess: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  iconContainerWarning: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
  },
  iconContainerError: {
    backgroundColor: "rgba(220, 38, 38, 0.1)",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.textDark,
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  horizontalButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  verticalButtons: {
    flexDirection: "column",
    gap: 10,
    width: "100%",
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  buttonFullWidth: {
    width: "100%",
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
  },
  cancelButton: {
    backgroundColor: "rgba(17, 120, 100, 0.05)",
  },
  destructiveButton: {
    backgroundColor: theme.colors.textError,
  },
  confirmButtonText: {
    color: theme.colors.textLight,
    fontWeight: "600",
    fontSize: 15,
  },
  cancelButtonText: {
    color: theme.colors.textSecondary,
    fontWeight: "600",
    fontSize: 15,
  },
  destructiveButtonText: {
    color: theme.colors.textLight,
    fontWeight: "600",
    fontSize: 15,
  },
});
