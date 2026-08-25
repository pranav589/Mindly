import { setAuthTokens } from "@/services/api";
import { theme } from "@/theme/themes";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { styles } from "./OAuthRedirectScreen.styles";

export default function OAuthRedirectScreen() {
  const params = useLocalSearchParams<{
    accessToken?: string;
    refreshToken?: string;
  }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();

    const { accessToken, refreshToken } = params;

    if (accessToken && refreshToken) {
      setAuthTokens(accessToken, refreshToken);

      queryClient
        .refetchQueries({ queryKey: ["authMe"] })
        .then(() => {
          router.replace("/(protected)/(tabs)");
        })
        .catch(() => {
          router.replace("/(protected)/(tabs)");
        });
    } else {
      console.warn("[OAuthRedirect] No tokens in redirect URL.");
      router.replace("/(auth)/onboarding");
    }
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}
