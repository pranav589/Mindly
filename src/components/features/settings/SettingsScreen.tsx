import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "@/components/Button";
import { useAuth } from "@/hooks/useAuth";
import { getStyles } from "./SettingsScreen.styles";

export default function SettingsScreen() {
  const { user, logout, isLoggingOut } = useAuth();
  const insets = useSafeAreaInsets();
  const styles = getStyles(insets);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workspace Settings</Text>
        <Text style={styles.subtitle}>
          Workspace tools, profile, and integrations
        </Text>
      </View>

      {user && (
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={32} color="#117864" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>
      )}

      <View style={styles.buttonWrapper}>
        <Button variant="outline" onPress={logout} style={styles.logoutButton}>
          {isLoggingOut ? (
            <ActivityIndicator size="small" color="#c0392b" />
          ) : (
            <View style={styles.logoutContent}>
              <Ionicons name="log-out-outline" size={18} color="#c0392b" />
              <Text style={styles.logoutText}>Log Out</Text>
            </View>
          )}
        </Button>
      </View>
    </View>
  );
}
