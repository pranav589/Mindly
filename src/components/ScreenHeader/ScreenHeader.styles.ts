import { StyleSheet } from "react-native";
import { theme } from "@/theme/themes";

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderColor: theme.colors.borderMuted,
  },
  headerButton: {
    padding: 8,
    borderRadius: 9999,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: theme.colors.textHeading,
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
});
