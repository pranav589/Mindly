import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafa",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: "#6e7a75",
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#e0e6e6",
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#117864",
    flex: 1,
    textAlign: "center",
  },
  headerPlaceholder: {
    width: 40,
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: "#f8fafa",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  generatingTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginTop: 20,
  },
  generatingSubtitle: {
    fontSize: 13,
    color: "#6e7a75",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6e7a75",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 20,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#117864",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  sheetContent: {
    paddingVertical: 4,
    gap: 16,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  diffBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  diffBadgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  diffGreen: {
    backgroundColor: "#e8f5e9",
    borderColor: "#a5d6a7",
  },
  diffOrange: {
    backgroundColor: "#fff3e0",
    borderColor: "#ffcc80",
  },
  diffRed: {
    backgroundColor: "#ffebee",
    borderColor: "#ef9a9a",
  },
  textGreen: {
    color: "#2e7d32",
  },
  textOrange: {
    color: "#ef6c00",
  },
  textRed: {
    color: "#c62828",
  },
  sourceTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#e8f5f3",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sourceTagText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#117864",
  },
  nodeDescription: {
    fontSize: 15,
    color: "#1f2937",
    lineHeight: 22,
    fontWeight: "500",
  },
  section: {
    gap: 6,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#6e7a75",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionText: {
    fontSize: 13,
    color: "#4b5563",
    lineHeight: 18,
  },
  bulletRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    paddingLeft: 4,
  },
  bulletSymbol: {
    fontSize: 14,
    color: "#117864",
    fontWeight: "bold",
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: "#4b5563",
    lineHeight: 18,
  },
  exampleBox: {
    backgroundColor: "#f4f6f6",
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#117864",
  },
  exampleText: {
    fontSize: 13,
    color: "#374151",
    fontStyle: "italic",
    lineHeight: 18,
  },
  questionText: {
    fontSize: 13,
    color: "#4b5563",
    lineHeight: 18,
    fontStyle: "italic",
    paddingLeft: 4,
  },
  sheetDoneButton: {
    marginTop: 24,
  },
  pressedOpacity: {
    opacity: 0.9,
  },
});
