import { theme } from "@/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import * as Network from "expo-network";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./OfflineBanner.styles";

export default function OfflineBanner() {
  const insets = useSafeAreaInsets();
  const [isOffline, setIsOffline] = useState(false);
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // getNetworkStateAsync is accurate on-demand on Android physical devices.
    // The addNetworkStateListener sometimes fires with stale data (known expo-network
    // Android bug), so we poll every 3s as the reliable source of truth.
    const checkState = async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        setIsOffline(state.isConnected === false);
      } catch (_) {}
    };

    checkState();

    const interval = setInterval(checkState, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOffline ? insets.top + 8 : -100,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [isOffline, insets.top]);

  return (
    <Animated.View style={[styles.container, { top: slideAnim }]}>
      <Ionicons name="wifi-outline" size={12} color={theme.colors.textLight} />
      <Text style={styles.text}>Offline</Text>
    </Animated.View>
  );
}
