import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  cardWrapper: {
    width: "100%",
    height: 320,
    position: "relative",
    marginBottom: 40,
  },
  card: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 28,
    padding: 28,
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden",
    borderWidth: 1,
    borderColor: "#e0e6e6",
    backgroundColor: "#ffffff",
    shadowColor: "#117864",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  cardFront: {
    zIndex: 1,
  },
  cardBack: {
    backgroundColor: "#fff",
  },
  cardLabel: {
    position: "absolute",
    top: 24,
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1.5,
    color: "#117864",
  },
  cardText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2c3e50",
    lineHeight: 30,
  },
  cardLabelBack: {
    color: "#2e7d32",
  },
});
