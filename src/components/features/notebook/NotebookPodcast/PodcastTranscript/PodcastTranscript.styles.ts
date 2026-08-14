import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  transcriptSection: {
    marginTop: 28,
    marginBottom: 48,
  },
  topicsHeader: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111827",
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
    backgroundColor: "#e8f5f3",
    borderColor: "#a2d9ce",
  },
  avatarB: {
    backgroundColor: "#fbf3e6",
    borderColor: "#f5cba7",
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
    color: "#6b7280",
    paddingHorizontal: 4,
  },
  bubble: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  bubbleA: {
    backgroundColor: "#ffffff",
    borderColor: "#e0e6e6",
    borderTopLeftRadius: 2,
  },
  bubbleB: {
    backgroundColor: "#fef8f0",
    borderColor: "#fadbd8",
    borderTopRightRadius: 2,
  },
  bubbleText: {
    fontSize: 14,
    color: "#2c3e50",
    lineHeight: 20,
  },
});
