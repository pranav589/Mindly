import { StyleSheet } from "react-native";
import { theme } from "@/theme/themes";

export const styles = StyleSheet.create({
  messageRow: {
    marginBottom: 16,
    width: "100%",
  },
  userBubble: {
    alignSelf: "flex-end",
    maxWidth: "85%",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderTopRightRadius: 0,
  },
  userText: {
    color: theme.colors.textLight,
    fontSize: 14,
    lineHeight: 20,
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
  clickableCitation: {
    color: theme.colors.primaryDark,
    fontWeight: "bold",
    fontSize: 12,
    backgroundColor: "rgba(162, 217, 206, 0.3)",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    overflow: "hidden",
    marginHorizontal: 2,
  },
});
