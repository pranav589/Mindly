import { StyleSheet } from "react-native";
import { theme } from "@/theme/themes";

export const styles = StyleSheet.create({
  messageRow: {
    marginBottom: 0,
    width: "100%",
  },
  aiMessageContainer: {
    alignSelf: "flex-start",
    maxWidth: "90%",
    flexDirection: "row",
    gap: 10,
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
    backgroundColor: theme.colors.primarySubtle,
  },
  aiBubble: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderMuted,
    borderRadius: 16,
    borderTopLeftRadius: 0,
    padding: 12,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  aiText: {
    color: theme.colors.textHeading,
    fontSize: 14,
    lineHeight: 20,
  },
  typingText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  typingIndicatorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  listeningBubble: {
    alignSelf: "flex-end",
    maxWidth: "80%",
    backgroundColor: "rgba(17, 120, 100, 0.08)",
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    borderRadius: 16,
    borderTopRightRadius: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  listeningText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "600",
  },
});
