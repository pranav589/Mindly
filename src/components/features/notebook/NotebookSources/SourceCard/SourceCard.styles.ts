import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  sourceCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e0e6e6",
    borderRadius: 24,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  processingCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#a2d9ce",
  },
  typeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f2f2",
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
    color: "#191c1d",
    marginBottom: 4,
  },
  sourceTime: {
    fontSize: 11,
    fontWeight: "600",
  },
  sourceStatusSynced: {
    color: "#6e7a75",
  },
  sourceStatusSyncing: {
    color: "#117864",
  },
  sourceStatusFailed: {
    color: "#dc2626",
  },
});
