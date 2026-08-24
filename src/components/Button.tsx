import React, { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { theme } from "@/theme/themes";

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  style?: object;
}

export default function Button({
  onPress,
  children,
  variant = "primary",
  style,
}: ButtonProps) {
  const [pressed, setPressed] = useState(false);

  const variantStyle =
    variant === "primary"
      ? styles.variantPrimary
      : variant === "secondary"
        ? styles.variantSecondary
        : styles.variantOutline;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.base,
        variantStyle,
        variant === "primary" && styles.primaryShadow,
        variant === "secondary" && styles.secondaryShadow,
        pressed && styles.pressed,
        style,
      ]}
    >
      {typeof children === "string" ? (
        <Text
          style={[
            styles.label,
            variant === "outline"
              ? styles.labelOutline
              : variant === "secondary"
                ? styles.labelSecondary
                : styles.labelPrimary,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  variantPrimary: {
    backgroundColor: theme.colors.primary,
  },
  variantSecondary: {
    backgroundColor: theme.colors.primaryLight,
  },
  variantOutline: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
  },
  labelPrimary: {
    color: theme.colors.textLight,
  },
  labelSecondary: {
    color: theme.colors.primaryDark,
  },
  labelOutline: {
    color: theme.colors.primary,
  },
  primaryShadow: {
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  secondaryShadow: {
    shadowColor: theme.colors.primaryLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
    elevation: 1,
    shadowOpacity: 0,
  },
});
