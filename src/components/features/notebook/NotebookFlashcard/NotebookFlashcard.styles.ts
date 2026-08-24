import { StyleSheet } from "react-native";
import { theme } from "@/theme/themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: theme.colors.textSecondary,
    fontSize: 14,
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
    flex: 1,
    padding: 24,
    paddingBottom: 48,
  },
  counter: {
    fontSize: 13,
    fontWeight: "bold",
    color: theme.colors.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  flipHint: {
    fontSize: 12,
    color: theme.colors.textMuted,
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
    color: theme.colors.textSecondary,
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
    backgroundColor: theme.colors.errorLight,
    borderColor: theme.colors.errorBorder,
  },
  rateBtnTextAgain: {
    color: theme.colors.accentRed,
  },
  rateBtnHard: {
    backgroundColor: theme.colors.warningLight,
    borderColor: theme.colors.warningBorder,
  },
  rateBtnTextHard: {
    color: theme.colors.accentOrange,
  },
  rateBtnGood: {
    backgroundColor: theme.colors.successLight,
    borderColor: theme.colors.successBorder,
  },
  rateBtnTextGood: {
    color: theme.colors.accentGreen,
  },
  rateBtnEasy: {
    backgroundColor: theme.colors.infoLight,
    borderColor: theme.colors.infoBorder,
  },
  rateBtnTextEasy: {
    color: theme.colors.infoText,
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    width: "100%",
    marginTop: "auto",
  },
  skipButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.textHeading,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
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
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
  },
  primaryButtonText: {
    color: theme.colors.textLight,
    fontWeight: "bold",
    fontSize: 15,
  },
});
