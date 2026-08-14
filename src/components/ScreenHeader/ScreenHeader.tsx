import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "./ScreenHeader.styles";

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  rightIcon?: string;
  rightAction?: () => void;
  rightIconType?: "ionicons" | "material";
}

export default function ScreenHeader({
  title,
  onBack,
  rightIcon,
  rightAction,
  rightIconType = "ionicons",
}: ScreenHeaderProps) {
  const router = useRouter();

  const handleBack = onBack || (() => router.back());

  return (
    <View style={styles.header}>
      <Pressable onPress={handleBack} style={styles.headerButton}>
        <Ionicons name="arrow-back" size={24} color="#117864" />
      </Pressable>

      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>

      {rightIcon && rightAction ? (
        <Pressable onPress={rightAction} style={styles.headerButton}>
          {rightIconType === "material" ? (
            <MaterialIcons
              name={rightIcon as any}
              size={22}
              color="#117864"
            />
          ) : (
            <Ionicons name={rightIcon as any} size={22} color="#117864" />
          )}
        </Pressable>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}
