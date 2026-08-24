import ScreenHeader from "@/components/ScreenHeader/ScreenHeader";
import { useNotifications } from "@/context/NotificationContext";
import { apiClient } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  Pressable,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlashcardItem } from "./FlashcardItem/FlashcardItem";
import { styles } from "./NotebookFlashcard.styles";

export function NotebookFlashcard() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const { sendLocalNotification } = useNotifications();
  const isGeneratingRef = useRef(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // AppState change listener for background notifications
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "background" && isGeneratingRef.current && id) {
        sendLocalNotification(
          "Drafting Flashcards",
          "Mindly is generating your active recall flashcards. We will notify you when they're ready!",
          { notebookId: id, screen: "flashcard" },
        );
      }
    };

    const appStateSub = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => appStateSub.remove();
  }, [id, sendLocalNotification]);

  const { data: cards = [], isLoading: isFetchingCards } = useQuery({
    queryKey: ["flashcards", id],
    queryFn: async () => {
      const res = await apiClient.get<any[]>(`/api/flashcards`, {
        params: { notebookId: id },
      });
      return res.data;
    },
    enabled: !!id,
  });

  const generateCardsMutation = useMutation({
    mutationFn: async () => {
      isGeneratingRef.current = true;
      const res = await apiClient.post(`/api/flashcards/generate`, {
        notebookId: id,
      });
      return res.data;
    },
    onSuccess: () => {
      isGeneratingRef.current = false;
      sendLocalNotification(
        "Flashcards Created! 🗂️",
        "New active recall flashcards have been successfully added to your notebook.",
        { notebookId: id, screen: "flashcard" },
      );
      queryClient.invalidateQueries({ queryKey: ["flashcards", id] });
    },
    onError: (err: any) => {
      isGeneratingRef.current = false;
      const backendError =
        err.response?.data?.error ||
        err.message ||
        "Failed to generate study flashcards.";
      sendLocalNotification("Flashcard Generation Failed ❌", backendError, {
        notebookId: id,
        screen: "flashcard",
      });
      console.error("Flashcard generation error:", backendError);
      Alert.alert("Error", backendError);
    },
  });

  const reviewCardMutation = useMutation({
    mutationFn: async (payload: { cardId: string; rating: number }) => {
      await apiClient.post(`/api/flashcards/${payload.cardId}/review`, {
        rating: payload.rating,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flashcards", id] });
      goToNext();
    },
    onError: () => goToNext(),
  });

  const goToNext = () => {
    setIsFlipped(false);
    if (cards.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }
  };

  const handleRate = (rating: number) => {
    const currentCard = cards[currentIndex];
    if (!currentCard) return;

    if (rating === 1) {
      // Again
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(
        () => {},
      );
    } else if (rating === 4) {
      //easy
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {},
      );
    } else {
      // Hard (2) or Good (3) - standard physical impact tap
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }

    reviewCardMutation.mutate({ cardId: currentCard._id, rating });
  };

  const handleRegenerate = () => {
    Alert.alert(
      "Regenerate Flashcards",
      "This will generate a new set of flashcards from your sources. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Regenerate",
          onPress: () => {
            generateCardsMutation.mutate();
            router.replace(`/notebook/${id}` as any);
            Alert.alert(
              "Generating Flashcards",
              "Your flashcards are being generated in the background. You'll receive a notification when they're ready!",
            );
          },
        },
      ],
    );
  };

  const containerInsetPadding = { paddingTop: insets.top };

  if (isFetchingCards || generateCardsMutation.isPending) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#117864" />
        <Text style={styles.loadingText}>
          {generateCardsMutation.isPending
            ? "Generating flashcards…"
            : "Loading cards…"}
        </Text>
      </View>
    );
  }

  if (cards.length === 0) {
    return (
      <View style={[styles.container, containerInsetPadding]}>
        <StatusBar style="dark" />
        <ScreenHeader title="Flashcards" />

        <View style={styles.centered}>
          <Ionicons name="layers-outline" size={72} color="#c8d8d5" />
          <Text style={styles.emptyTitle}>No Flashcards Yet</Text>
          <Text style={styles.emptySubtitle}>
            Generate AI flashcards from your notebook sources.
          </Text>
          <Pressable
            onPress={() => {
              generateCardsMutation.mutate();
              router.replace(`/notebook/${id}` as any);
              Alert.alert(
                "Generating Flashcards",
                "Your flashcards are being generated in the background. You'll receive a notification when they're ready!",
              );
            }}
            style={styles.primaryButton}
          >
            <Ionicons name="sparkles-outline" size={18} color="#fff" />
            <Text style={styles.primaryButtonText}>Generate Flashcards</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const currentCard = cards[currentIndex];
  const progressPctStyle = {
    width: `${((currentIndex + 1) / cards.length) * 100}%` as any,
  };

  return (
    <View style={[styles.container, containerInsetPadding]}>
      <StatusBar style="dark" />

      <ScreenHeader
        title="Flashcards"
        rightIcon="refresh-outline"
        rightAction={handleRegenerate}
      />

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, progressPctStyle]} />
      </View>

      <View style={styles.content}>
        {/* Counter */}
        <Text style={styles.counter}>
          Card {currentIndex + 1} of {cards.length}
        </Text>

        {/* Flip indicator */}
        <Text style={styles.flipHint}>
          {isFlipped ? "📖 Answer" : "❓ Question"} · tap to flip
        </Text>

        {/* 3D Flip card */}
        <FlashcardItem
          frontText={currentCard?.front || ""}
          backText={currentCard?.back || ""}
          isFlipped={isFlipped}
          onFlip={setIsFlipped}
        />

        {/* SM2 rating buttons — shown after flipping */}
        {isFlipped ? (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>How well did you know this?</Text>
            <View style={styles.ratingRow}>
              <Pressable
                onPress={() => handleRate(1)}
                style={[styles.rateBtn, styles.rateBtnAgain]}
              >
                <Text style={styles.rateBtnEmoji}>😰</Text>
                <Text style={[styles.rateBtnText, styles.rateBtnTextAgain]}>
                  Again
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handleRate(2)}
                style={[styles.rateBtn, styles.rateBtnHard]}
              >
                <Text style={styles.rateBtnEmoji}>😬</Text>
                <Text style={[styles.rateBtnText, styles.rateBtnTextHard]}>
                  Hard
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handleRate(3)}
                style={[styles.rateBtn, styles.rateBtnGood]}
              >
                <Text style={styles.rateBtnEmoji}>🙂</Text>
                <Text style={[styles.rateBtnText, styles.rateBtnTextGood]}>
                  Good
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handleRate(4)}
                style={[styles.rateBtn, styles.rateBtnEasy]}
              >
                <Text style={styles.rateBtnEmoji}>😎</Text>
                <Text style={[styles.rateBtnText, styles.rateBtnTextEasy]}>
                  Easy
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable onPress={goToNext} style={styles.skipButton}>
            <Text style={styles.skipButtonText}>Skip</Text>
            <Ionicons name="arrow-forward" size={16} color="#117864" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
