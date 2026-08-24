import { StyleSheet } from "react-native";
import { theme } from "@/theme/themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    backgroundColor: theme.colors.border,
  },
  progressFill: {
    height: 4,
    backgroundColor: theme.colors.primary,
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
    color: theme.colors.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  typeBadge: {
    backgroundColor: theme.colors.primarySubtle,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.textHeading,
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
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  optionText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
  },
  icon: {
    marginLeft: 8,
  },
  correctCard: {
    backgroundColor: theme.colors.successLight,
    borderColor: theme.colors.accentGreen,
  },
  correctText: {
    color: theme.colors.accentGreen,
  },
  incorrectCard: {
    backgroundColor: theme.colors.errorLight,
    borderColor: theme.colors.accentRed,
  },
  incorrectText: {
    color: theme.colors.accentRed,
  },
  shortAnswerContainer: {
    marginBottom: 24,
  },
  shortAnswerInput: {
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: theme.colors.textHeading,
    backgroundColor: theme.colors.surface,
    minHeight: 100,
    textAlignVertical: "top",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: "100%",
    marginTop: 12,
  },
  primaryButtonText: {
    color: theme.colors.textLight,
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
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  explanationLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 6,
  },
  explanationText: {
    fontSize: 14,
    color: theme.colors.gray500,
    lineHeight: 20,
  },
});
