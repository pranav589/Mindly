import ScreenHeader from "@/components/ScreenHeader/ScreenHeader";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./QuizHomeView.styles";

interface Attempt {
  _id: string;
  score: number;
  totalQuestions: number;
  createdAt: string;
}

interface QuizHomeViewProps {
  notebookId: string;
  activeQuiz: any;
  questions: any[];
  attempts: Attempt[];
  startQuiz: () => void;
  onRegenerate: () => void;
}

export function QuizHomeView({
  notebookId,
  activeQuiz,
  questions,
  attempts,
  startQuiz,
  onRegenerate,
}: QuizHomeViewProps) {
  const insets = useSafeAreaInsets();

  const router = useRouter();

  const bestAttempt = attempts.reduce<Attempt | null>(
    (best, a) =>
      !best || a.score / a.totalQuestions > best.score / best.totalQuestions
        ? a
        : best,
    null,
  );

  const viewAllAttempts = () => {
    router.push(`/notebook/${notebookId}/quiz-history`);
  };

  const handleRegeneratePress = () => {
    Alert.alert(
      "Regenerate Quiz",
      "This will create a new quiz from your sources. The old quiz history will be preserved.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Regenerate",
          onPress: onRegenerate,
        },
      ],
    );
  };

  const containerInsetPadding = { paddingTop: insets.top };

  return (
    <View style={[styles.container, containerInsetPadding]}>
      <StatusBar />
      <ScreenHeader
        title="Quiz"
        rightIcon="time-outline"
        rightAction={viewAllAttempts}
      />

      <ScrollView contentContainerStyle={[styles.content, styles.centered]}>
        <Ionicons name="school-outline" size={72} color="#117864" />

        {!activeQuiz ? (
          <>
            <Text style={styles.emptyTitle}>No Quiz Yet</Text>
            <Text style={styles.emptySubtitle}>
              Generate an AI-powered quiz from your notebook sources.
            </Text>
            <Pressable onPress={onRegenerate} style={styles.primaryButton}>
              <Ionicons name="sparkles-outline" size={18} color="#fff" />
              <Text style={styles.primaryButtonText}>Generate Quiz</Text>
            </Pressable>
          </>
        ) : (
          <>
            <View style={styles.titleContainer}>
              <Text style={styles.emptyTitle}>{activeQuiz.title}</Text>
              <Text style={styles.emptySubtitle}>
                {questions.length} questions
              </Text>
            </View>

            {bestAttempt && (
              <View style={styles.scoreCard}>
                <Text style={styles.scoreLabel}>Best Score</Text>
                <Text style={styles.scoreBig}>
                  {bestAttempt.score}/{bestAttempt.totalQuestions}
                </Text>
                <Text style={styles.scorePercent}>
                  {Math.round(
                    (bestAttempt.score / bestAttempt.totalQuestions) * 100,
                  )}
                  %
                </Text>
              </View>
            )}

            {attempts.length > 0 && (
              <View style={styles.historySection}>
                <View style={styles.historySectionRow}>
                  <Text style={styles.historySectionTitle}>
                    Recent Attempts
                  </Text>
                  <Pressable onPress={viewAllAttempts}>
                    <Text style={styles.historyViewAll}>View all →</Text>
                  </Pressable>
                </View>
                {attempts.slice(0, 3).map((a, i) => {
                  const pct = Math.round((a.score / a.totalQuestions) * 100);
                  const color =
                    pct >= 70 ? "#2e7d32" : pct >= 40 ? "#f57c00" : "#c62828";
                  const dotColor = { backgroundColor: color };
                  const scoreColor = { color };
                  return (
                    <View key={a._id} style={styles.historyRow}>
                      <View style={[styles.historyDot, dotColor]} />
                      <Text style={styles.historyAttemptLabel}>
                        Attempt {attempts.length - i}
                      </Text>
                      <Text style={[styles.historyScore, scoreColor]}>
                        {a.score}/{a.totalQuestions} ({pct}%)
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            <Pressable onPress={startQuiz} style={styles.primaryButton}>
              <Ionicons name="play" size={18} color="#fff" />
              <Text style={styles.primaryButtonText}>
                {attempts.length > 0 ? "Retake Quiz" : "Start Quiz"}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleRegeneratePress}
              style={styles.outlineButton}
            >
              <Ionicons name="refresh-outline" size={18} color="#117864" />
              <Text style={styles.outlineButtonText}>Regenerate Quiz</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}
