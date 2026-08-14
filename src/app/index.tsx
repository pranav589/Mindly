import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (user) {
      router.replace("/(tabs)");
    } else {
      router.replace("/onboarding");
    }
  }, [user, isLoading]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafa" }}>
      <ActivityIndicator size="large" color="#117864" />
    </View>
  );
}
