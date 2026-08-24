import { theme } from "@/theme/themes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  transcriptSection: {
    marginTop: 28,
    marginBottom: 48,
  },
  topicsHeader: {
    fontSize: 12,
    fontWeight: "bold",
    color: theme.colors.textHeading,
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  transcriptList: {
    gap: 16,
  },
  transcriptRow: {
    flexDirection: "row",
    gap: 12,
    maxWidth: "85%",
  },
  rowHostA: {
    alignSelf: "flex-start",
  },
  rowHostB: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  avatarA: {
    backgroundColor: theme.colors.primarySubtle,
    borderColor: theme.colors.primaryLight,
  },
  avatarB: {
    backgroundColor: theme.colors.warningLight,
    borderColor: theme.colors.warningBorder,
  },
  avatarText: {
    fontSize: 16,
  },
  bubbleContainer: {
    gap: 4,
    flex: 1,
  },
  speakerLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: theme.colors.mutedGrayIcon,
    paddingHorizontal: 4,
  },
  bubble: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  bubbleA: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderTopLeftRadius: 2,
  },
  bubbleB: {
    backgroundColor: theme.colors.warningLight,
    borderColor: theme.colors.errorLight,
    borderTopRightRadius: 2,
  },
  bubbleText: {
    fontSize: 14,
    color: theme.colors.grayTextMuted,
    lineHeight: 20,
  },
});
