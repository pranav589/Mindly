import ScreenHeader from "@/components/ScreenHeader/ScreenHeader";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./QuizQuestionView.styles";

interface Question {
  id: string;
  type: "mcq" | "true_false" | "short_answer";
  questionText: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizQuestionViewProps {
  currentQuestion: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedOption: string | null;
  shortAnswer: string;
  setShortAnswer: (text: string) => void;
  isAnswered: boolean;
  onOptionPress: (opt: string) => void;
  onSubmitShortAnswer: () => void;
  onNext: () => void;
  onClose: () => void;
  isSubmitPending: boolean;
}

export function QuizQuestionView({
  currentQuestion,
  currentIndex,
  totalQuestions,
  selectedOption,
  shortAnswer,
  setShortAnswer,
  isAnswered,
  onOptionPress,
  onSubmitShortAnswer,
  onNext,
  onClose,
  isSubmitPending,
}: QuizQuestionViewProps) {
  const insets = useSafeAreaInsets();
  const containerInsetPadding = { paddingTop: insets.top };
  const isShortAnswer = currentQuestion.type === "short_answer";
  const effectiveOptions = currentQuestion.options || ["True", "False"];

  const getCardStyle = (opt: string) => {
    if (!isAnswered) {
      return opt === selectedOption
        ? [styles.optionCard, styles.correctCard]
        : styles.optionCard;
    }
    if (opt === currentQuestion.correctAnswer) {
      return [styles.optionCard, styles.correctCard];
    }
    if (opt === selectedOption) {
      return [styles.optionCard, styles.incorrectCard];
    }
    return styles.optionCard;
  };

  const getTextStyle = (opt: string) => {
    if (!isAnswered) {
      return styles.optionText;
    }
    if (opt === currentQuestion.correctAnswer) {
      return [styles.optionText, styles.correctText];
    }
    if (opt === selectedOption) {
      return [styles.optionText, styles.incorrectText];
    }
    return styles.optionText;
  };

  const isCorrectShortAnswer =
    isAnswered &&
    shortAnswer.trim().toLowerCase() ===
      (currentQuestion.correctAnswer ?? "").toLowerCase();

  const progressPctStyle = {
    width: `${((currentIndex + 1) / totalQuestions) * 100}%` as any,
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoiding}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.container, containerInsetPadding]}>
        <StatusBar style="dark" />

        <ScreenHeader title="Interactive Quiz" onBack={onClose} />

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, progressPctStyle]} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.metaRow}>
            <Text style={styles.counter}>
              Question {currentIndex + 1} of {totalQuestions}
            </Text>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>
                {currentQuestion.type === "mcq"
                  ? "Multiple Choice"
                  : currentQuestion.type === "true_false"
                    ? "True / False"
                    : "Short Answer"}
              </Text>
            </View>
          </View>

          <Text style={styles.questionText}>
            {currentQuestion.questionText}
          </Text>

          {!isShortAnswer && (
            <View style={styles.optionsContainer}>
              {effectiveOptions.map((opt, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => onOptionPress(opt)}
                  style={getCardStyle(opt)}
                >
                  <Text style={getTextStyle(opt)}>{opt}</Text>
                  {isAnswered && opt === currentQuestion.correctAnswer && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color="#2e7d32"
                      style={styles.icon}
                    />
                  )}
                  {isAnswered &&
                    opt === selectedOption &&
                    opt !== currentQuestion.correctAnswer && (
                      <Ionicons
                        name="close-circle"
                        size={18}
                        color="#c62828"
                        style={styles.icon}
                      />
                    )}
                </Pressable>
              ))}
            </View>
          )}

          {isShortAnswer && (
            <View style={styles.shortAnswerContainer}>
              <TextInput
                style={[
                  styles.shortAnswerInput,
                  isAnswered && isCorrectShortAnswer && styles.correctCard,
                  isAnswered && !isCorrectShortAnswer && styles.incorrectCard,
                ]}
                placeholder="Type your answer here…"
                placeholderTextColor="#9ca3af"
                value={shortAnswer}
                onChangeText={setShortAnswer}
                editable={!isAnswered}
                multiline
                returnKeyType="done"
                onSubmitEditing={onSubmitShortAnswer}
              />
              {!isAnswered && (
                <Pressable
                  onPress={onSubmitShortAnswer}
                  style={[
                    styles.primaryButton,
                    shortAnswer.trim() === "" && styles.buttonDisabled,
                  ]}
                  disabled={shortAnswer.trim() === ""}
                >
                  <Text style={styles.primaryButtonText}>Check Answer</Text>
                </Pressable>
              )}
            </View>
          )}

          {isAnswered && (
            <View
              style={[
                styles.explanationCard,
                isShortAnswer
                  ? isCorrectShortAnswer
                    ? styles.correctCard
                    : styles.incorrectCard
                  : selectedOption === currentQuestion.correctAnswer
                    ? styles.correctCard
                    : styles.incorrectCard,
              ]}
            >
              <Text style={styles.explanationLabel}>
                {isShortAnswer
                  ? isCorrectShortAnswer
                    ? "✓ Correct!"
                    : `✗ Correct answer: "${currentQuestion.correctAnswer}"`
                  : selectedOption === currentQuestion.correctAnswer
                    ? "✓ Correct!"
                    : `✗ Correct answer: "${currentQuestion.correctAnswer}"`}
              </Text>
              <Text style={styles.explanationText}>
                {currentQuestion.explanation}
              </Text>
            </View>
          )}

          {isAnswered && (
            <Pressable
              onPress={onNext}
              style={styles.primaryButton}
              disabled={isSubmitPending}
            >
              {isSubmitPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>
                    {currentIndex < totalQuestions - 1
                      ? "Next Question"
                      : "Finish & Submit"}
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </>
              )}
            </Pressable>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
