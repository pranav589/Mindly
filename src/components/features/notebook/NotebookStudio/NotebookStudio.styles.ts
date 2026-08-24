import { StyleSheet } from "react-native";
import { theme } from "@/theme/themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: theme.colors.background,
  },
  headerButton: {
    padding: 8,
    borderRadius: 9999,
  },
  headerTitle: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 18,
    color: theme.colors.primary,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  inviteButton: {
    padding: 8,
    borderRadius: 9999,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  infoArea: {
    marginBottom: 24,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "rgba(218, 247, 166, 0.2)",
  },
  tagText: {
    fontSize: 10,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  updatedText: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  podcastCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 24,
    padding: 16,
    marginBottom: 28,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4,
  },
  podcastCardPressed: {
    opacity: 0.95,
  },
  podcastLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  podcastIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  podcastMeta: {
    justifyContent: "center",
  },
  podcastTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: theme.colors.textHeading,
  },
  podcastSubtitle: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  podcastRight: {
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.textHeading,
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },
  gridCard: {
    width: "48%",
    borderRadius: 24,
    padding: 18,
    minHeight: 148,
    justifyContent: "flex-end",
  },
  gridCardPressed: {
    transform: [{ scale: 0.97 }],
  },
  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  pressedOpacity: {
    opacity: 0.7,
  },
});
