import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#f8fafa",
  },
  headerButton: {
    padding: 8,
    borderRadius: 9999,
  },
  headerTitle: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 18,
    color: "#117864",
    textAlign: "center",
    paddingHorizontal: 16,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatIcon: {
    marginRight: 4,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  selectText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#117864",
  },
  sourcesList: {
    gap: 12,
  },
  addNewButton: {
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(162, 217, 206, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    backgroundColor: "rgba(162, 217, 206, 0.15)",
  },
  addNewButtonPressed: {
    backgroundColor: "rgba(162, 217, 206, 0.3)",
    transform: [{ scale: 0.97 }],
  },
  addNewButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#005d4d",
  },
  chatButton: {
    marginTop: 16,
  },
  chatButtonLabel: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
});
