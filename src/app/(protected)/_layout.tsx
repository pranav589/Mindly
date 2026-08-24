import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProtectedLayout() {
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafa" }} edges={["bottom"]}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="notebook" />
      </Stack>
    </SafeAreaView>
  );
}
