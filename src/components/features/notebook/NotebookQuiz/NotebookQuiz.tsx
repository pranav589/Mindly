import { theme } from "@/theme/themes";
import { useNotifications } from "@/context/NotificationContext";
import { apiClient } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, AppState, Text, View } from "react-native";
import { styles } from "./NotebookQuiz.styles";
import { QuizHomeView } from "./QuizHomeView/QuizHomeView";
import { QuizQuestionView } from "./QuizQuestionView/QuizQuestionView";
import { QuizResultsView } from "./QuizResultsView/QuizResultsView";

import { offlineCache } from "@/services/offlineCache";

// ── Types ──────────────────────────────────────────────────────────────────────
type QuestionType = "mcq" | "true_false" | "short_answer";

interface Question {
  id: string;
  type: QuestionType;
  questionText: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

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

export function NotebookQuiz() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();

  const { sendLocalNotification } = useNotifications();
  const isGeneratingRef = useRef(false);

  // Quiz state
  const [view, setView] = useState<"home" | "quiz" | "results">("home");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [shortAnswer, setShortAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [lastAttempt, setLastAttempt] = useState<Attempt | null>(null);

  // Listen to AppState transitions for backgrounding notice
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "background" && isGeneratingRef.current && id) {
        sendLocalNotification(
          "Building Quiz Syllabus",
          "Mindly is generating your study questions. We will notify you when it's ready!",
          { notebookId: id, screen: "quiz" },
        );
      }
    };

    const appStateSub = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => appStateSub.remove();
  }, [id, sendLocalNotification]);

  // ── API ──────────────────────────────────────────────────────────────────────
  const { data: quizzes = [], isLoading: isFetchingQuiz } = useQuery({
    queryKey: ["quizzes", id],
    queryFn: async () => {
      try {
        const res = await apiClient.get<any[]>(`/api/quizzes`, {
          params: { notebookId: id },
        });
        if (id && res.data && res.data.length > 0) {
          // Cache the actual questions array of the active quiz
          const activeQ = res.data[0];
          await offlineCache.cacheQuizzes(id as string, activeQ.questions || []);
        }
        return res.data;
      } catch (err) {
        if (id) {
          const cachedQuestions = await offlineCache.getCachedQuizzes(id as string);
          if (cachedQuestions && cachedQuestions.length > 0) {
            return [{
              _id: `offline_quiz_${id}`,
              questions: cachedQuestions.map((q: any) => ({
                id: q.id,
                type: "mcq",
                questionText: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation || "",
              })),
            }];
          }
        }
        throw err;
      }
    },
    enabled: !!id,
  });

  const activeQuiz = quizzes[0];
  const questions: Question[] = activeQuiz?.questions || [];
  const currentQuestion = questions[currentIndex];

  // History of attempts for the current quiz
  const { data: attempts = [], isLoading: isFetchingAttempts } = useQuery({
    queryKey: ["quizAttempts", activeQuiz?._id],
    queryFn: async () => {
      const quizId = activeQuiz?._id;
      if (!quizId) return [];
      const res = await apiClient.get<Attempt[]>(
        `/api/quizzes/${quizId}/attempts`,
      );
      return res.data;
    },
    enabled: !!activeQuiz?._id,
  });

  const generateQuizMutation = useMutation({
    mutationFn: async () => {
      isGeneratingRef.current = true;
      const res = await apiClient.post(`/api/quizzes/generate`, {
        notebookId: id,
      });
      return res.data;
    },
    onSuccess: () => {
      isGeneratingRef.current = false;
      sendLocalNotification(
        "Quiz Generated! 🧠",
        "Your study questions are ready to test your knowledge.",
        { notebookId: id, screen: "quiz" },
      );
      queryClient.invalidateQueries({ queryKey: ["quizzes", id] });
    },
    onError: (err: any) => {
      isGeneratingRef.current = false;
      const backendError = err.response?.data?.error || err.message || "Failed to generate study quiz.";
      sendLocalNotification(
        "Quiz Generation Failed ❌",
        backendError,
        { notebookId: id, screen: "quiz" },
      );
      console.error("Quiz generation error:", backendError);
      Alert.alert("Error", backendError);
    },
  });

  const submitAttemptMutation = useMutation({
    mutationFn: async (answers: GradedAnswer[]) => {
      const res = await apiClient.post<Attempt>(
        `/api/quizzes/${activeQuiz._id}/attempts`,
        { answers },
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["quizAttempts", activeQuiz._id],
      });
      queryClient.invalidateQueries({ queryKey: ["quizAttemptsAll", id] });
      setLastAttempt(data);
      setView("results");
    },
    onError: (err) => {
      console.error(err);
      Alert.alert("Error", "Failed to submit quiz attempt");
    },
  });

  // ── Actions ──────────────────────────────────────────────────────────────────
  const startQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShortAnswer("");
    setIsAnswered(false);
    setUserAnswers([]);
    setLastAttempt(null);
    setView("quiz");
  };

  const handleOptionPress = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const correct = opt === currentQuestion.correctAnswer;

    Haptics.notificationAsync(
      correct
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error,
    ).catch(() => {});

    const answerPayload: GradedAnswer = {
      questionId: currentQuestion.id,
      userAnswer: opt,
      isCorrect: correct,
    };
    setUserAnswers((prev) => [...prev, answerPayload]);
  };

  const handleSubmitShortAnswer = () => {
    if (isAnswered || shortAnswer.trim() === "") return;
    setIsAnswered(true);

    const correct =
      shortAnswer.trim().toLowerCase() ===
      currentQuestion.correctAnswer.trim().toLowerCase();

    // Trigger haptic response based on correct/incorrect input
    Haptics.notificationAsync(
      correct
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error,
    ).catch(() => {});

    const answerPayload: GradedAnswer = {
      questionId: currentQuestion.id,
      userAnswer: shortAnswer.trim(),
      isCorrect: correct,
    };
    setUserAnswers((prev) => [...prev, answerPayload]);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShortAnswer("");
      setIsAnswered(false);
    } else {
      submitAttemptMutation.mutate(userAnswers);
    }
  };

  if (isFetchingQuiz || generateQuizMutation.isPending) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>
          {generateQuizMutation.isPending
            ? "Generating Quiz…"
            : "Loading Quiz…"}
        </Text>
      </View>
    );
  }

  if (view === "home") {
    return (
      <QuizHomeView
        notebookId={id as string}
        activeQuiz={activeQuiz}
        questions={questions}
        attempts={attempts}
        startQuiz={startQuiz}
        onRegenerate={() => {
          generateQuizMutation.mutate();
          router.replace(`/notebook/${id}` as any);
          Alert.alert(
            "Generating Quiz",
            "Your practice quiz is being generated in the background. You'll receive a notification when it's ready!"
          );
        }}
      />
    );
  }

  if (view === "results" && lastAttempt) {
    return (
      <QuizResultsView
        lastAttempt={lastAttempt}
        questions={questions}
        onRetake={startQuiz}
        onGoHome={() => setView("home")}
      />
    );
  }

  if (!currentQuestion) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar />
      <QuizQuestionView
        currentQuestion={currentQuestion}
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        selectedOption={selectedOption}
        shortAnswer={shortAnswer}
        setShortAnswer={setShortAnswer}
        isAnswered={isAnswered}
        onOptionPress={handleOptionPress}
        onSubmitShortAnswer={handleSubmitShortAnswer}
        onNext={handleNext}
        onClose={() => setView("home")}
        isSubmitPending={submitAttemptMutation.isPending}
      />
    </View>
  );
}
