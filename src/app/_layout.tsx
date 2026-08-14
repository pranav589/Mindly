import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { loadStoredTokens } from "@/services/api";
import { AuthProvider } from "@/context/AuthContext";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import { MiniPlayer } from "@/components/MiniPlayer/MiniPlayer";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadStoredTokens().finally(() => {
      setIsReady(true);
    });
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafa" }}>
        <ActivityIndicator size="large" color="#117864" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AudioPlayerProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="auth" />
              <Stack.Screen name="(tabs)" />
            </Stack>
            <MiniPlayer />
          </GestureHandlerRootView>
        </AudioPlayerProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

