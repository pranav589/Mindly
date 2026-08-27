import { theme } from "@/theme/themes";
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
  Pressable,
  Text,
  View,
} from "react-native";
import { useBackgroundNotification } from "@/hooks/useBackgroundNotification";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlashcardItem } from "./FlashcardItem/FlashcardItem";
import { styles } from "./NotebookFlashcard.styles";

import { offlineCache } from "@/services/offlineCache";

export function NotebookFlashcard() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const {
    sendLocalNotification,
    scheduleStudyReminder,
    cancelStudyReminder,
    requestNotificationPermissions,
  } = useNotifications();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Fetch notebook details
  const { data: notebook } = useQuery({
    queryKey: ["notebook", id],
    queryFn: async () => {
      try {
        const res = await apiClient.get<{ notebook: any }>(`/api/notebooks/${id}`);
        const nb = res.data.notebook;
        if (id && nb) {
          await offlineCache.cacheNotebook(id as string, nb.name || "Notebook");
        }
        return nb;
      } catch (err) {
        if (id) {
          const cachedList = await offlineCache.getCachedNotebooks();
          const match = cachedList.find(n => n.notebookId === id);
          if (match) {
            return { id: match.notebookId, name: match.title };
          }
        }
        throw err;
      }
    },
    enabled: !!id,
  });
  const { data: cards = [], isLoading: isFetchingCards } = useQuery({
    queryKey: ["flashcards", id],
    queryFn: async () => {
      try {
        const res = await apiClient.get<any[]>(`/api/flashcards`, {
          params: { notebookId: id },
        });
        if (id) {
          await offlineCache.cacheFlashcards(id as string, res.data);
        }
        return res.data;
      } catch (err) {
        if (id) {
          const cached = await offlineCache.getCachedFlashcards(id as string);
          if (cached && cached.length > 0) {
            return cached.map(c => ({
              ...c,
              _id: c.id,
              nextReview: c.dueDate ? c.dueDate.toISOString() : null,
            }));
          }
        }
        throw err;
      }
    },
    enabled: !!id,
  });

  const getEarliestNextReviewDate = (flashcards: any[]) => {
    if (!flashcards || flashcards.length === 0) return null;
    const now = Date.now();
    let earliest = null;
    for (const card of flashcards) {
      const nextReviewVal = card.nextReview || card.dueDate;
      if (nextReviewVal) {
        const reviewTime = new Date(nextReviewVal).getTime();
        if (!isNaN(reviewTime) && reviewTime > now) {
          if (!earliest || reviewTime < earliest) {
            earliest = reviewTime;
          }
        }
      }
    }
    return earliest ? new Date(earliest) : null;
  };

  // Reschedule study reminder whenever cards list or notebook details update
  useEffect(() => {
    if (!notebook || !cards || cards.length === 0) return;
    const earliestDate = getEarliestNextReviewDate(cards);
    // Fallback to tomorrow if no future date calculated
    const targetDate = earliestDate || new Date(Date.now() + 24 * 60 * 60 * 1000);

    scheduleStudyReminder(
      id as string,
      notebook.name || "Notebook",
      targetDate
    );
  }, [cards, notebook, id, scheduleStudyReminder]);



  const generateCardsMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post(`/api/flashcards/generate`, {
        notebookId: id,
      });
      return res.data;
    },
    onSuccess: () => {
      sendLocalNotification(
        "Flashcards Created! 🗂️",
        "New active recall flashcards have been successfully added to your notebook.",
        { notebookId: id, screen: "flashcard" },
      );
      queryClient.invalidateQueries({ queryKey: ["flashcards", id] });
    },
    onError: (err: any) => {
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

  useBackgroundNotification(
    generateCardsMutation.isPending,
    "Drafting Flashcards",
    "Mindly is generating your active recall flashcards. We will notify you when they're ready!",
    id as string,
    "flashcard"
  );

  const reviewCardMutation = useMutation({
    mutationFn: async (payload: { cardId: string; rating: number }) => {
      try {
        await apiClient.post(`/api/flashcards/${payload.cardId}/review`, {
          rating: payload.rating,
        });
      } catch (err) {
        console.warn("[Flashcard] Offline review. Running SM2 local calculation...");
        const currentCard = cards.find((c) => c._id === payload.cardId || c.id === payload.cardId);
        if (currentCard) {
          let interval = currentCard.interval || 0;
          let ease = currentCard.ease || 2.5;
          let repetitions = currentCard.repetitions || 0;
          let dueDate = new Date();

          const rating = payload.rating;
          let q = 3;
          if (rating === 1) q = 1;
          else if (rating === 2) q = 3;
          else if (rating === 3) q = 4;
          else if (rating === 4) q = 5;

          if (q >= 3) {
            if (repetitions === 0) {
              interval = 1;
            } else if (repetitions === 1) {
              interval = 6;
            } else {
              interval = Math.round(interval * ease);
            }
            repetitions += 1;
          } else {
            repetitions = 0;
            interval = 1;
          }

          ease = ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
          if (ease < 1.3) ease = 1.3;

          dueDate = new Date(Date.now() + interval * 24 * 60 * 60 * 1000);

          await offlineCache.updateFlashcardSM2(
            payload.cardId,
            interval,
            ease,
            repetitions,
            dueDate
          );
        }
      }
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

  const handleGenerateFlashcards = async () => {
    await requestNotificationPermissions();
    generateCardsMutation.mutate();
    router.replace(`/notebook/${id}` as any);
    Alert.alert(
      "Generating Flashcards",
      "Your flashcards are being generated in the background. You'll receive a notification when they're ready!",
    );
  };

  const handleRegenerate = () => {
    Alert.alert(
      "Regenerate Flashcards",
      "This will generate a new set of flashcards from your sources. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Regenerate",
          onPress: handleGenerateFlashcards,
        },
      ],
    );
  };

  const containerInsetPadding = { paddingTop: insets.top };

  if (isFetchingCards || generateCardsMutation.isPending) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
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
          <Ionicons name="layers-outline" size={72} color={theme.colors.lightGrayIcon} />
          <Text style={styles.emptyTitle}>No Flashcards Yet</Text>
          <Text style={styles.emptySubtitle}>
            Generate AI flashcards from your notebook sources.
          </Text>
          <Pressable
            onPress={handleGenerateFlashcards}
            style={styles.primaryButton}
          >
            <Ionicons name="sparkles-outline" size={18} color={theme.colors.textLight} />
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
            <Ionicons name="arrow-forward" size={16} color={theme.colors.primary} />
          </Pressable>
        )}
      </View>
    </View>
  );
}
