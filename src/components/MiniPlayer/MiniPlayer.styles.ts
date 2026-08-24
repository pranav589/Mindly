import { StyleSheet } from "react-native";
import { theme } from "@/theme/themes";

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 110, // High enough to clear the custom tab bar and other bottom buttons
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 9999, // Floating above everything
  },
  activeIndicator: {
    position: "absolute",
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    opacity: 0.5,
  },
  closeBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: "rgba(17, 120, 100, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
});
