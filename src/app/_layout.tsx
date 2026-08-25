import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { loadStoredTokens } from "@/services/api";

WebBrowser.maybeCompleteAuthSession();
import { AuthProvider } from "@/context/AuthContext";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { MiniPlayer } from "@/components/MiniPlayer/MiniPlayer";

import { theme } from "@/theme/themes";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { initializeDatabase } from "@/db/client";

import OfflineBanner from "@/components/OfflineBanner/OfflineBanner";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    Promise.all([
      loadStoredTokens(),
      initializeDatabase().catch((e) => console.error("DB init failed:", e)),
    ]).finally(() => {
      setIsReady(true);
    });
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AudioPlayerProvider>
            <NotificationProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(protected)" />
                  <Stack.Screen name="redirect" />
                </Stack>
                <OfflineBanner />
                <MiniPlayer />
              </GestureHandlerRootView>
            </NotificationProvider>
          </AudioPlayerProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

