import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafa" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: { marginTop: 12, color: "#6e7a75", fontSize: 14 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#e0e6e6",
  },
  headerButton: { padding: 8 },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#117864",
    flex: 1,
    textAlign: "center",
  },

  content: { padding: 20, paddingBottom: 48, gap: 20 },

  // Stats
  statsRow: { flexDirection: "row", gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e6e6",
    shadowColor: "#117864",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: { fontSize: 24, fontWeight: "900", color: "#111827" },
  statLabel: {
    fontSize: 11,
    color: "#6e7a75",
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
    backgroundColor: "#e8f5f3",
    borderRadius: 12,
    padding: 12,
  },
  quizSectionTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#117864",
  },
  quizAttemptCount: { fontSize: 11, color: "#6e7a75", fontWeight: "600" },

  // Attempt card
  attemptCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e0e6e6",
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
  attemptDate: { fontSize: 12, color: "#6e7a75", marginBottom: 6 },

  miniBarTrack: { height: 4, backgroundColor: "#e0e6e6", borderRadius: 2 },
  miniBarFill: { height: 4, borderRadius: 2 },

  attemptScoreBox: { alignItems: "flex-end" },
  attemptScore: { fontSize: 15, fontWeight: "800" },
  attemptPct: { fontSize: 11, fontWeight: "600" },

  // Breakdown (expanded)
  breakdown: {
    borderTopWidth: 1,
    borderTopColor: "#e0e6e6",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 14,
    backgroundColor: "#fafcfc",
  },
  breakdownRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  breakdownQuestion: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  breakdownAnswer: { fontSize: 12, color: "#6e7a75" },
  breakdownCorrect: { fontSize: 12, color: "#c62828", marginTop: 2 },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6e7a75",
    textAlign: "center",
    marginTop: 8,
  },
});
