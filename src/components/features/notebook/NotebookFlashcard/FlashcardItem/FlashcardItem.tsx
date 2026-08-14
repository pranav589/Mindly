import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, Text } from "react-native";
import { styles } from "./FlashcardItem.styles";

interface FlashcardItemProps {
  frontText: string;
  backText: string;
  isFlipped: boolean;
  onFlip: (isFlipped: boolean) => void;
}

export function FlashcardItem({
  frontText,
  backText,
  isFlipped,
  onFlip,
}: FlashcardItemProps) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const isFlippedRef = useRef(false);

  useEffect(() => {
    // Sync flip state from parent reset triggers
    if (!isFlipped && isFlippedRef.current) {
      isFlippedRef.current = false;
      flipAnim.setValue(0);
    }
  }, [isFlipped]);

  const flip = () => {
    const toValue = isFlippedRef.current ? 0 : 1;
    isFlippedRef.current = !isFlippedRef.current;
    onFlip(isFlippedRef.current);

    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

    Animated.spring(flipAnim, {
      toValue,
      useNativeDriver: true,
      friction: 8,
      tension: 70,
    }).start();
  };

  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });
  const backRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.49, 0.5, 1],
    outputRange: [1, 1, 0, 0],
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.49, 0.5, 1],
    outputRange: [0, 0, 1, 1],
  });

  const frontAnimStyle = {
    transform: [{ rotateY: frontRotate }],
    opacity: frontOpacity,
  };

  const backAnimStyle = {
    transform: [{ rotateY: backRotate }],
    opacity: backOpacity,
  };

  return (
    <Pressable onPress={flip} style={styles.cardWrapper}>
      {/* Front face */}
      <Animated.View style={[styles.card, styles.cardFront, frontAnimStyle]}>
        <Text style={styles.cardLabel}>QUESTION</Text>
        <Text style={styles.cardText}>{frontText}</Text>
      </Animated.View>

      {/* Back face */}
      <Animated.View style={[styles.card, styles.cardBack, backAnimStyle]}>
        <Text style={[styles.cardLabel, styles.cardLabelBack]}>ANSWER</Text>
        <Text style={styles.cardText}>{backText}</Text>
      </Animated.View>
    </Pressable>
  );
}
