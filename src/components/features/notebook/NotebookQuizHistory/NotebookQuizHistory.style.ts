import { StyleSheet } from "react-native";
import { theme } from "@/theme/themes";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: { marginTop: 12, color: theme.colors.textSecondary, fontSize: 14 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  headerButton: { padding: 8 },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
    flex: 1,
    textAlign: "center",
  },

  content: { padding: 20, paddingBottom: 48, gap: 20 },

  // Stats
  statsRow: { flexDirection: "row", gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: { fontSize: 24, fontWeight: "900", color: theme.colors.textHeading },
  statLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Quiz group
  quizSection: { gap: 10 },
  quizSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.colors.primarySubtle,
    borderRadius: 12,
    padding: 12,
  },
  quizSectionTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  quizAttemptCount: { fontSize: 11, color: theme.colors.textSecondary, fontWeight: "600" },

  // Attempt card
  attemptCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  attemptRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  rankText: { fontSize: 12, fontWeight: "800" },
  attemptDate: { fontSize: 12, color: theme.colors.textSecondary, marginBottom: 6 },

  miniBarTrack: { height: 4, backgroundColor: theme.colors.border, borderRadius: 2 },
  miniBarFill: { height: 4, borderRadius: 2 },

  attemptScoreBox: { alignItems: "flex-end" },
  attemptScore: { fontSize: 15, fontWeight: "800" },
  attemptPct: { fontSize: 11, fontWeight: "600" },

  // Breakdown (expanded)
  breakdown: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 14,
    backgroundColor: theme.colors.gray50,
  },
  breakdownRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  breakdownQuestion: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textHeading,
    marginBottom: 2,
  },
  breakdownAnswer: { fontSize: 12, color: theme.colors.textSecondary },
  breakdownCorrect: { fontSize: 12, color: theme.colors.accentRed, marginTop: 2 },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.textHeading,
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },
});
