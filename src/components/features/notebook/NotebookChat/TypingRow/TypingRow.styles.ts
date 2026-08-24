import { StyleSheet } from "react-native";

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
    backgroundColor: "rgba(162, 217, 206, 0.35)",
  },
  aiBubble: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    borderTopLeftRadius: 0,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  aiText: {
    color: "#111827",
    fontSize: 14,
    lineHeight: 20,
  },
  typingText: {
    fontSize: 12,
    color: "#9ca3af",
  },
  typingIndicatorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
