import { theme } from "@/theme/themes";
import { StyleSheet } from "react-native";

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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  infoArea: {
    marginBottom: 20,
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
  generatingTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.textHeading,
    marginTop: 20,
  },
  generatingSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
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
  downloadButton: {
    marginTop: 12,
    width: "100%",
    justifyContent: "center",
  },
  downloadRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  downloadIcon: {
    marginRight: 6,
  },
  savedOfflineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  savedOfflineText: {
    marginLeft: 6,
    color: theme.colors.success,
    fontWeight: "600",
    fontSize: 13,
  },
});
