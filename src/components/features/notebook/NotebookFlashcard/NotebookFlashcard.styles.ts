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
  progressTrack: {
    height: 4,
    backgroundColor: "#e0e6e6",
  },
  progressFill: {
    height: 4,
    backgroundColor: "#117864",
    borderRadius: 2,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingBottom: 48,
  },
  counter: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#117864",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  flipHint: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
    marginBottom: 24,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  ratingContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: "auto",
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6e7a75",
    marginBottom: 16,
  },
  ratingRow: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
    justifyContent: "space-between",
  },
  rateBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  rateBtnEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  rateBtnText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  rateBtnAgain: {
    backgroundColor: "#ffebee",
    borderColor: "#ef9a9a",
  },
  rateBtnTextAgain: {
    color: "#c62828",
  },
  rateBtnHard: {
    backgroundColor: "#fff3e0",
    borderColor: "#ffcc80",
  },
  rateBtnTextHard: {
    color: "#ef6c00",
  },
  rateBtnGood: {
    backgroundColor: "#e8f5e9",
    borderColor: "#a5d6a7",
  },
  rateBtnTextGood: {
    color: "#2e7d32",
  },
  rateBtnEasy: {
    backgroundColor: "#e3f2fd",
    borderColor: "#90caf9",
  },
  rateBtnTextEasy: {
    color: "#1565c0",
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#117864",
    width: "100%",
    marginTop: "auto",
  },
  skipButtonText: {
    color: "#117864",
    fontSize: 14,
    fontWeight: "bold",
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
});
