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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
    flex: 1,
    textAlign: "center",
  },
  headerPlaceholder: {
    width: 40,
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
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
    backgroundColor: theme.colors.successLight,
    borderColor: theme.colors.successBorder,
  },
  diffOrange: {
    backgroundColor: theme.colors.warningLight,
    borderColor: theme.colors.warningBorder,
  },
  diffRed: {
    backgroundColor: theme.colors.errorLight,
    borderColor: theme.colors.errorBorder,
  },
  textGreen: {
    color: theme.colors.accentGreen,
  },
  textOrange: {
    color: theme.colors.accentOrange,
  },
  textRed: {
    color: theme.colors.accentRed,
  },
  sourceTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.primarySubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sourceTagText: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  nodeDescription: {
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 22,
    fontWeight: "500",
  },
  section: {
    gap: 6,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionText: {
    fontSize: 13,
    color: theme.colors.gray700,
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
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.gray700,
    lineHeight: 18,
  },
  exampleBox: {
    backgroundColor: theme.colors.gray50,
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  exampleText: {
    fontSize: 13,
    color: theme.colors.text,
    fontStyle: "italic",
    lineHeight: 18,
  },
  questionText: {
    fontSize: 13,
    color: theme.colors.gray500,
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
