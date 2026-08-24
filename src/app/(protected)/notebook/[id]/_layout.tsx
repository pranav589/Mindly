import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { SSEProvider } from "@/context/SSEContext";

export default function NotebookLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();

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
