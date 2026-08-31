import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { loadStoredTokens } from "@/services/api";
import { onlineManager } from "@tanstack/react-query";
import * as Network from "expo-network";

WebBrowser.maybeCompleteAuthSession();
import { AuthProvider } from "@/context/AuthContext";

import { CustomAlertProvider } from "@/context/CustomAlertContext";

import { theme } from "@/theme/themes";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { initializeDatabase } from "@/db/client";

import OfflineBanner from "@/components/OfflineBanner/OfflineBanner";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Configure React Query online manager with expo-network
    onlineManager.setEventListener((setOnline) => {
      const checkState = async () => {
        try {
          const state = await Network.getNetworkStateAsync();
          setOnline(state.isConnected !== false);
        } catch (_) {}
      };

      checkState();
      const interval = setInterval(checkState, 3000);

      return () => {
        clearInterval(interval);
      };
    });

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
        <CustomAlertProvider>
          <AuthProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(protected)" />
                <Stack.Screen name="redirect" />
              </Stack>
              <OfflineBanner />
            </GestureHandlerRootView>
          </AuthProvider>
        </CustomAlertProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

