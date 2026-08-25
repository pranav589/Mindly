import { theme } from "@/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, Text, View } from "react-native";
import { styles } from "./TypingRow.styles";

interface TypingRowProps {
  streamingText: string;
  isListening?: boolean;
}

export const TypingRow = React.memo(({ streamingText, isListening }: TypingRowProps) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isListening) {
      pulseAnim.setValue(1);
      return;
    }
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.35, duration: 550, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 550, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [isListening]);

  if (isListening) {
    return (
      <View style={[styles.messageRow, { alignItems: "flex-end" }]}>
        <View style={styles.listeningBubble}>
          <View style={styles.typingIndicatorRow}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Ionicons name="mic" size={16} color={theme.colors.primary} />
            </Animated.View>
            <Text style={styles.listeningText}>
              Listening...
            </Text>
          </View>
        </View>
      </View>
    );
  }

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
