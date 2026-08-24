import { theme } from "@/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "@/components/Button";
import { useAuth } from "@/hooks/useAuth";
import { getStyles } from "./AuthScreen.styles";

export default function AuthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = getStyles(insets);
  const { user, loginWithGoogle } = useAuth();

  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace("/(tabs)" as any);
    }
  }, [user]);

  const handleAuth = () => {
    router.replace("/(tabs)" as any);
  };

  const handleGoogleSignIn = async () => {
    await loginWithGoogle();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.root}
    >
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Card */}
        <View style={styles.card}>
          {/* Header/Branding */}
          <View style={styles.brandingContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="sparkles" size={28} color={theme.colors.textLight} />
            </View>
            <Text style={styles.appName}>Mindly</Text>
            <Text style={styles.appTagline}>Your Cognitive Workspace</Text>
          </View>

          {/* Auth Tabs */}
          <View style={styles.tabsRow}>
            <Pressable
              onPress={() => setIsSignIn(true)}
              style={[styles.tab, isSignIn && styles.tabActive]}
            >
              <Text
                style={[
                  styles.tabText,
                  isSignIn ? styles.tabTextActive : styles.tabTextInactive,
                ]}
              >
                Sign In
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setIsSignIn(false)}
              style={[styles.tab, !isSignIn && styles.tabActive]}
            >
              <Text
                style={[
                  styles.tabText,
                  !isSignIn ? styles.tabTextActive : styles.tabTextInactive,
                ]}
              >
                Sign Up
              </Text>
            </Pressable>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Email Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <View style={styles.inputRow}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={theme.colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="name@workspace.com"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.textInput}
                  placeholderTextColor={theme.colors.placeholder}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={styles.inputRow}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={theme.colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  style={styles.textInput}
                  placeholderTextColor={theme.colors.placeholder}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={theme.colors.textSecondary}
                  />
                </Pressable>
              </View>
            </View>

            {/* Remember Me & Forgot Password */}
            <View style={styles.rememberRow}>
              <Pressable
                onPress={() => setRememberMe(!rememberMe)}
                style={styles.rememberMe}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxChecked,
                  ]}
                >
                  {rememberMe && (
                    <Ionicons name="checkmark" size={12} color={theme.colors.primary} />
                  )}
                </View>
                <Text style={styles.rememberLabel}>Remember me</Text>
              </Pressable>

              <Pressable onPress={() => alert("Forgot password clicked")}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>
            </View>

            {/* Submit Button */}
            <Button onPress={handleAuth} style={styles.submitButton}>
              {isSignIn ? "Enter Workspace" : "Create Account"}
            </Button>
          </View>

          {/* Social Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Logins */}
          <View style={styles.socialRow}>
            <Pressable
              onPress={handleGoogleSignIn}
              style={({ pressed }) => [
                styles.socialButton,
                pressed && styles.socialButtonPressed,
              ]}
            >
              <Ionicons name="logo-google" size={18} color={theme.colors.textSecondary} />
              <Text style={styles.socialText}>Google</Text>
            </Pressable>

            <Pressable
              onPress={() => alert("Apple sign in")}
              style={({ pressed }) => [
                styles.socialButton,
                pressed && styles.socialButtonPressed,
              ]}
            >
              <Ionicons name="logo-apple" size={18} color={theme.colors.textSecondary} />
              <Text style={styles.socialText}>Apple</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
