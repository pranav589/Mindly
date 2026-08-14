import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafa",
  },
  keyboardAvoiding: {
    flex: 1,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
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
    padding: 24,
    paddingBottom: 48,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  counter: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#117864",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  typeBadge: {
    backgroundColor: "#e8f5f3",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#117864",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 24,
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e0e6e6",
    backgroundColor: "#ffffff",
  },
  optionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    flex: 1,
  },
  icon: {
    marginLeft: 8,
  },
  correctCard: {
    backgroundColor: "#e8f5e9",
    borderColor: "#2e7d32",
  },
  correctText: {
    color: "#2e7d32",
  },
  incorrectCard: {
    backgroundColor: "#ffebee",
    borderColor: "#c62828",
  },
  incorrectText: {
    color: "#c62828",
  },
  shortAnswerContainer: {
    marginBottom: 24,
  },
  shortAnswerInput: {
    borderWidth: 1.5,
    borderColor: "#e0e6e6",
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#fff",
    minHeight: 100,
    textAlignVertical: "top",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#117864",
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: "100%",
    marginTop: 12,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  explanationCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    borderColor: "#e0e6e6",
    backgroundColor: "#fff",
  },
  explanationLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 6,
  },
  explanationText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
});
