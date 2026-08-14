import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiClient } from "@/services/api";
import { styles } from "./NotebookQuizHistory.style";

// ── Types ──────────────────────────────────────────────────────────────────────
interface GradedAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
}

interface Attempt {
  _id: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  answers: GradedAnswer[];
  createdAt: string;
}

interface Quiz {
  _id: string;
  title: string;
  questions: {
    id: string;
    questionText: string;
    correctAnswer: string;
    explanation: string;
    type: string;
  }[];
  createdAt: string;
}

// ── Component ──────────────────────────────────────────────────────────────────
export function NotebookQuizHistory() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // notebook ID
  const insets = useSafeAreaInsets();

  const [expandedAttemptId, setExpandedAttemptId] = useState<string | null>(
    null,
  );

  // All quizzes for this notebook
  const { data: quizzes = [], isLoading: loadingQuizzes } = useQuery({
    queryKey: ["quizzes", id],
    queryFn: async () => {
      const res = await apiClient.get<Quiz[]>(`/api/quizzes`, {
        params: { notebookId: id },
      });
      return res.data;
    },
    enabled: !!id,
  });

  // All attempts across all quizzes for this notebook
  const { data: attempts = [], isLoading: loadingAttempts } = useQuery({
    queryKey: ["quizAttemptsAll", id],
    queryFn: async () => {
      const res = await apiClient.get<Attempt[]>(`/api/quizzes/all/attempts`, {
        params: { notebookId: id },
      });
      return res.data;
    },
    enabled: !!id,
  });

  const isLoading = loadingQuizzes || loadingAttempts;

  // Group attempts by quiz
  const attemptsByQuiz: Record<string, Attempt[]> = {};
  for (const attempt of attempts) {
    if (!attemptsByQuiz[attempt.quizId]) attemptsByQuiz[attempt.quizId] = [];
    attemptsByQuiz[attempt.quizId].push(attempt);
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const pctColor = (pct: number) =>
    pct >= 70 ? "#2e7d32" : pct >= 40 ? "#f57c00" : "#c62828";

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#117864" />
        <Text style={styles.loadingText}>Loading history…</Text>
      </View>
    );
  }

  if (attempts.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="#117864" />
          </Pressable>
          <Text style={styles.headerTitle}>Quiz History</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centered}>
          <Ionicons name="time-outline" size={64} color="#c8d8d5" />
          <Text style={styles.emptyTitle}>No Attempts Yet</Text>
          <Text style={styles.emptySubtitle}>
            Complete a quiz to see your history here.
          </Text>
        </View>
      </View>
    );
  }

  const totalAttempts = attempts.length;
  const avgScore =
    attempts.reduce((sum, a) => sum + a.score / a.totalQuestions, 0) /
    totalAttempts;
  const bestAttempt = attempts.reduce((best, a) =>
    a.score / a.totalQuestions > best.score / best.totalQuestions ? a : best,
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#117864" />
        </Pressable>
        <Text style={styles.headerTitle}>Quiz History</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Summary stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalAttempts}</Text>
            <Text style={styles.statLabel}>Attempts</Text>
          </View>
          <View style={styles.statCard}>
            <Text
              style={[styles.statValue, { color: pctColor(avgScore * 100) }]}
            >
              {Math.round(avgScore * 100)}%
            </Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: "#117864" }]}>
              {Math.round(
                (bestAttempt.score / bestAttempt.totalQuestions) * 100,
              )}
              %
            </Text>
            <Text style={styles.statLabel}>Best Score</Text>
          </View>
        </View>

        {/* Attempts grouped by quiz */}
        {quizzes.map((quiz) => {
          const quizAttempts = attemptsByQuiz[quiz._id];
          if (!quizAttempts || quizAttempts.length === 0) return null;

          return (
            <View key={quiz._id} style={styles.quizSection}>
              <View style={styles.quizSectionHeader}>
                <Ionicons
                  name="document-text-outline"
                  size={16}
                  color="#117864"
                />
                <Text style={styles.quizSectionTitle} numberOfLines={1}>
                  {quiz.title}
                </Text>
                <Text style={styles.quizAttemptCount}>
                  {quizAttempts.length} attempt
                  {quizAttempts.length !== 1 ? "s" : ""}
                </Text>
              </View>

              {quizAttempts.map((attempt, idx) => {
                const pct = Math.round(
                  (attempt.score / attempt.totalQuestions) * 100,
                );
                const color = pctColor(pct);
                const isExpanded = expandedAttemptId === attempt._id;

                return (
                  <View key={attempt._id} style={styles.attemptCard}>
                    {/* Attempt row */}
                    <Pressable
                      onPress={() =>
                        setExpandedAttemptId(isExpanded ? null : attempt._id)
                      }
                      style={styles.attemptRow}
                    >
                      {/* Rank badge */}
                      <View
                        style={[
                          styles.rankBadge,
                          { backgroundColor: color + "22" },
                        ]}
                      >
                        <Text style={[styles.rankText, { color }]}>
                          #{quizAttempts.length - idx}
                        </Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.attemptDate}>
                          {formatDate(attempt.createdAt)}
                        </Text>
                        {/* Mini bar */}
                        <View style={styles.miniBarTrack}>
                          <View
                            style={[
                              styles.miniBarFill,
                              { width: `${pct}%`, backgroundColor: color },
                            ]}
                          />
                        </View>
                      </View>

                      <View style={styles.attemptScoreBox}>
                        <Text style={[styles.attemptScore, { color }]}>
                          {attempt.score}/{attempt.totalQuestions}
                        </Text>
                        <Text style={[styles.attemptPct, { color }]}>
                          {pct}%
                        </Text>
                      </View>

                      <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={16}
                        color="#9ca3af"
                        style={{ marginLeft: 8 }}
                      />
                    </Pressable>

                    {/* Expandable breakdown */}
                    {isExpanded && (
                      <View style={styles.breakdown}>
                        {quiz.questions.map((q, qi) => {
                          const graded = attempt.answers.find(
                            (a) => a.questionId === q.id,
                          );
                          const correct = graded?.isCorrect ?? false;
                          return (
                            <View key={qi} style={styles.breakdownRow}>
                              <Ionicons
                                name={
                                  correct ? "checkmark-circle" : "close-circle"
                                }
                                size={16}
                                color={correct ? "#2e7d32" : "#c62828"}
                              />
                              <View style={{ flex: 1 }}>
                                <Text
                                  style={styles.breakdownQuestion}
                                  numberOfLines={2}
                                >
                                  {q.questionText}
                                </Text>
                                <Text style={styles.breakdownAnswer}>
                                  Your answer:{" "}
                                  <Text style={{ fontWeight: "700" }}>
                                    {graded?.userAnswer || "—"}
                                  </Text>
                                </Text>
                                {!correct && (
                                  <Text style={styles.breakdownCorrect}>
                                    Correct:{" "}
                                    <Text style={{ fontWeight: "700" }}>
                                      {q.correctAnswer}
                                    </Text>
                                  </Text>
                                )}
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          );
        })}

        {/* Quizzes that have no attempts yet */}
        {quizzes
          .filter(
            (q) => !attemptsByQuiz[q._id] || attemptsByQuiz[q._id].length === 0,
          )
          .map((quiz) => (
            <View key={quiz._id} style={[styles.quizSection, { opacity: 0.5 }]}>
              <View style={styles.quizSectionHeader}>
                <Ionicons
                  name="document-text-outline"
                  size={16}
                  color="#117864"
                />
                <Text style={styles.quizSectionTitle}>{quiz.title}</Text>
                <Text style={styles.quizAttemptCount}>No attempts</Text>
              </View>
            </View>
          ))}
      </ScrollView>
    </View>
  );
}
