import { StyleSheet } from "react-native";
import { theme } from "@/theme/themes";

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 16,
    zIndex: 9999,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: theme.colors.error, 
    borderWidth: 1,
    borderColor: theme.colors.errorBorder,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  text: {
    color: theme.colors.textLight,
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 4,
  },
});
