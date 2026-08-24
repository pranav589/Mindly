import { theme } from "@/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { styles } from "./TypingRow.styles";

interface TypingRowProps {
  streamingText: string;
}

export const TypingRow = React.memo(({ streamingText }: TypingRowProps) => {
  return (
    <View style={styles.messageRow}>
      <View style={styles.aiMessageContainer}>
        <View style={styles.aiAvatar}>
          <Ionicons name="hardware-chip-outline" size={16} color={theme.colors.primaryDark} />
        </View>
        <View style={styles.aiBubble}>
          {streamingText ? (
            <Text style={styles.aiText}>{streamingText}</Text>
          ) : (
            <View style={styles.typingIndicatorRow}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={styles.typingText}>Assistant is thinking...</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
});
