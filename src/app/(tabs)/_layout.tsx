import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Platform, View, ActivityIndicator, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";

const TabsLayout = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#117864" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#117864",
          tabBarInactiveTintColor: "#6e7a75",
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            position: "absolute",
            bottom: insets.bottom + 10,
            backgroundColor: "#ffffff",
            marginHorizontal: "10%",
            borderRadius: 48,
            height: 68,
            borderTopWidth: 0,
            shadowColor: "#117864",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
            paddingBottom: Platform.OS === "ios" ? 8 : 10,
            paddingTop: 8,
            zIndex: 1,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: "Dashboard",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafa",
  },
});

export default TabsLayout;
