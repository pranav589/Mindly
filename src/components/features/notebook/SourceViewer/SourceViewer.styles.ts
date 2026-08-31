import { theme } from "@/theme/themes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderMuted,
    backgroundColor: theme.colors.background,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.textHeading,
    textAlign: "center",
    marginHorizontal: 8,
  },
  headerRightPlaceholder: {
    width: 40,
  },
  infoArea: {
    padding: 16,
    backgroundColor: theme.colors.gray50,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderMuted,
  },
  infoTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  infoToggle: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  viewerContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  imageViewer: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  videoViewer: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  videoPlayer: {
    width: "100%",
    height: 240,
  },
  textReader: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  textScrollView: {
    flex: 1,
  },
  textContent: {
    fontSize: 15,
    lineHeight: 24,
    color: theme.colors.text,
    paddingBottom: 40,
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: theme.colors.primarySubtle,
    borderRadius: theme.borderRadius.md,
    marginTop: 16,
    gap: 8,
  },
  copyBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.primary,
  },
});
