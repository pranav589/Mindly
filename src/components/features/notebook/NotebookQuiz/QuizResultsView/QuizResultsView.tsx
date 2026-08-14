import ScreenHeader from "@/components/ScreenHeader/ScreenHeader";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./QuizResultsView.styles";

interface GradedAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
}

interface Attempt {
  _id: string;
  score: number;
  totalQuestions: number;
  answers: GradedAnswer[];
  createdAt: string;
}

interface Question {
  id: string;
  questionText: string;
  correctAnswer: string;
  explanation: string;
  type: string;
}

interface QuizResultsViewProps {
  lastAttempt: Attempt;
  questions: Question[];
  onRetake: () => void;
  onGoHome: () => void;
}

export function QuizResultsView({
  lastAttempt,
  questions,
  onRetake,
  onGoHome,
}: QuizResultsViewProps) {
  const insets = useSafeAreaInsets();
  const pct = Math.round(
    (lastAttempt.score / lastAttempt.totalQuestions) * 100,
  );
  const emoji = pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪";
  const grade =
    pct >= 80 ? "Excellent!" : pct >= 50 ? "Good effort!" : "Keep practicing!";

  const pctFillStyle = {
    width: `${pct}%` as any,
    backgroundColor: pct >= 70 ? "#117864" : pct >= 40 ? "#f57c00" : "#c62828",
  };

  const textCorrectStyle = { color: "#2e7d32" };
  const textIncorrectStyle = { color: "#c62828" };

  const containerInsetPadding = { paddingTop: insets.top };

  return (
    <View style={[styles.container, containerInsetPadding]}>
      <StatusBar />
      <ScreenHeader title="Results" onBack={onGoHome} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.scoreCard}>
          <Text style={styles.emojiText}>{emoji}</Text>
          <Text style={styles.gradeText}>{grade}</Text>
          <Text style={styles.scoreBig}>
            {lastAttempt.score}/{lastAttempt.totalQuestions}
          </Text>
          <Text style={styles.scorePercent}>{pct}%</Text>

          <View style={styles.resultBarTrack}>
            <View style={[styles.resultBarFill, pctFillStyle]} />
          </View>
        </View>

        <Text style={styles.historySectionTitle}>Question Breakdown</Text>
        {questions.map((q, i) => {
          const graded = lastAttempt.answers.find((a) => a.questionId === q.id);
          const correct = graded?.isCorrect ?? false;
          return (
            <View
              key={i}
              style={[
                styles.breakdownCard,
                correct ? styles.correctCard : styles.incorrectCard,
              ]}
            >
              <View style={styles.breakdownHeader}>
                <Ionicons
                  name={correct ? "checkmark-circle" : "close-circle"}
                  size={20}
                  color={correct ? "#2e7d32" : "#c62828"}
                />
                <Text
                  style={[
                    styles.breakdownQ,
                    correct ? textCorrectStyle : textIncorrectStyle,
                  ]}
                >
                  Q{i + 1} ·{" "}
                  {q.type === "mcq"
                    ? "MCQ"
                    : q.type === "true_false"
                      ? "True/False"
                      : "Short Answer"}
                </Text>
              </View>
              <Text style={styles.breakdownQuestion}>{q.questionText}</Text>
              {graded?.userAnswer ? (
                <Text style={styles.breakdownYour}>
                  Your answer:{" "}
                  <Text style={styles.breakdownYourText}>
                    {graded.userAnswer}
                  </Text>
                </Text>
              ) : null}
              {!correct && (
                <Text style={styles.breakdownCorrect}>
                  Correct:{" "}
                  <Text style={styles.breakdownYourText}>
                    {q.correctAnswer}
                  </Text>
                </Text>
              )}
              <Text style={styles.breakdownExplanation}>{q.explanation}</Text>
            </View>
          );
        })}

        <Pressable onPress={onRetake} style={styles.primaryButton}>
          <Ionicons name="refresh" size={18} color="#fff" />
          <Text style={styles.primaryButtonText}>Retake Quiz</Text>
        </Pressable>
        <Pressable onPress={onGoHome} style={styles.outlineButton}>
          <Ionicons name="home-outline" size={18} color="#117864" />
          <Text style={styles.outlineButtonText}>Back to Home</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
