import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { SSEProvider } from "@/context/SSEContext";
import { useAuth } from "@/hooks/useAuth";

export default function NotebookLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafa" }}>
        <ActivityIndicator size="large" color="#117864" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SSEProvider notebookId={id as string}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="sources" />
        <Stack.Screen name="studio" />
        <Stack.Screen name="podcast" />
        <Stack.Screen name="roadmap" />
        <Stack.Screen name="mindmap" />
        <Stack.Screen name="flashcard" />
        <Stack.Screen name="quiz" />
        <Stack.Screen name="quiz-history" />
      </Stack>
    </SSEProvider>
  );
}
