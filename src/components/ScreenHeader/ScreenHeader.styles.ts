import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#f8fafa",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  headerButton: {
    padding: 8,
    borderRadius: 9999,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#111827",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
});
