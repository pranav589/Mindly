import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  playerCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e0e6e6",
    borderRadius: 28,
    padding: 20,
    shadowColor: "#117864",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4,
  },
  playerCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },
  podcastIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#117864",
    alignItems: "center",
    justifyContent: "center",
  },
  podcastTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  podcastSubtitle: {
    fontSize: 12,
    color: "#9ca3af",
  },
  immersivePlayer: {
    backgroundColor: "#191c1d",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  glowElement: {
    position: "absolute",
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  glowTopRight: {
    top: 0,
    right: 0,
    backgroundColor: "rgba(17, 120, 100, 0.2)",
  },
  glowBottomLeft: {
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(162, 217, 206, 0.15)",
  },
  waveformContainer: {
    height: 80,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 2.5,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  waveformBar: {
    width: 3,
    borderRadius: 9999,
  },
  waveformBarActive: {
    backgroundColor: "#9bf3da",
  },
  waveformBarInactive: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  progressBarContainer: {
    width: "100%",
    marginBottom: 20,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  progressTimeText: {
    fontSize: 10,
    color: "#9ca3af",
  },
  progressTrack: {
    height: 6,
    width: "100%",
    borderRadius: 9999,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  progressFill: {
    height: "100%",
    borderRadius: 9999,
    backgroundColor: "#9bf3da",
  },
  controlsRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  speedButton: {
    width: 48,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  speedText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#9bf3da",
  },
  centralControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  playButtonGlow: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#117864",
    alignItems: "center",
    justifyContent: "center",
  },
  playIconOffset: {
    marginLeft: 3,
  },
  playIconNoOffset: {
    marginLeft: 0,
  },
  placeholder: {
    width: 40,
  },
});
