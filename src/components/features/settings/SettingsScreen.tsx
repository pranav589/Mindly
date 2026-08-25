import Button from "@/components/Button";
import { useAuth } from "@/hooks/useAuth";
import { theme } from "@/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getStyles } from "./SettingsScreen.styles";

let SecureStore: any = null;
try {
  SecureStore = require("expo-secure-store");
} catch (e) {
  console.warn("⚠️ expo-secure-store is not available. Storage is disabled.");
}

export default function SettingsScreen() {
  const { user, logout, isLoggingOut } = useAuth();
  const insets = useSafeAreaInsets();
  const styles = getStyles(insets);

  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [reminderHour, setReminderHour] = useState(19); // 24h default (7 PM)
  const [reminderMinute, setReminderMinute] = useState(0);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  // Temporary states for the custom picker modal
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [pickerHour12, setPickerHour12] = useState(7);
  const [pickerMinute, setPickerMinute] = useState(0);
  const [pickerIsPm, setPickerIsPm] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      if (!SecureStore) {
        setIsLoadingSettings(false);
        return;
      }
      try {
        const settingsRaw = await SecureStore.getItemAsync(
          "study_reminder_settings",
        );
        if (settingsRaw) {
          const settings = JSON.parse(settingsRaw);
          setRemindersEnabled(settings.enabled ?? true);

          const h24 = settings.hour ?? 19;
          const m = settings.minute ?? 0;
          setReminderHour(h24);
          setReminderMinute(m);

          // Set initial picker states
          setPickerHour12(h24 % 12 || 12);
          setPickerMinute(m);
          setPickerIsPm(h24 >= 12);
        }
      } catch (err) {
        console.error("Failed to load reminder settings:", err);
      } finally {
        setIsLoadingSettings(false);
      }
    }
    loadSettings();
  }, []);

  const saveSettings = async (
    enabled: boolean,
    hour: number,
    minute: number,
  ) => {
    if (!SecureStore) return;
    try {
      const settings = { enabled, hour, minute };
      await SecureStore.setItemAsync(
        "study_reminder_settings",
        JSON.stringify(settings),
      );
    } catch (err) {
      console.error("Failed to save reminder settings:", err);
    }
  };

  const handleToggleReminders = async (value: boolean) => {
    setRemindersEnabled(value);
    await saveSettings(value, reminderHour, reminderMinute);
  };

  const openTimePicker = () => {
    // Populate picker states from current values
    setPickerHour12(reminderHour % 12 || 12);
    setPickerMinute(reminderMinute);
    setPickerIsPm(reminderHour >= 12);
    setIsPickerVisible(true);
  };

  const handleSaveTime = async () => {
    // Convert 12h representation to 24h
    let h24 = pickerHour12 % 12;
    if (pickerIsPm) {
      h24 += 12;
    }
    setReminderHour(h24);
    setReminderMinute(pickerMinute);
    await saveSettings(remindersEnabled, h24, pickerMinute);
    setIsPickerVisible(false);
  };

  const adjustHour = (amount: number) => {
    let next = pickerHour12 + amount;
    if (next > 12) next = 1;
    if (next < 1) next = 12;
    setPickerHour12(next);
  };

  const adjustMinute = (amount: number) => {
    let next = pickerMinute + amount;
    if (next > 59) next = 0;
    if (next < 0) next = 55; // Steps of 5
    setPickerMinute(next);
  };

  const formatTimeDisplay = () => {
    const ampm = reminderHour >= 12 ? "PM" : "AM";
    const displayHour = reminderHour % 12 || 12;
    const displayMinute = reminderMinute.toString().padStart(2, "0");
    return `${displayHour}:${displayMinute} ${ampm}`;
  };

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Workspace Settings</Text>
        <Text style={styles.subtitle}>
          Workspace tools, profile, and integrations
        </Text>
      </View>

      {user && (
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={32} color={theme.colors.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>
      )}

      {/* Study Reminders Preferences Card */}
      {!isLoadingSettings && (
        <View style={styles.settingsCard}>
          {/* Daily Reminders Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons
                name="notifications-outline"
                size={18}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Study Reminders</Text>
              <Text style={styles.settingSublabel}>
                Get reminded when flashcards are due for review.
              </Text>
            </View>
            <Switch
              value={remindersEnabled}
              onValueChange={handleToggleReminders}
              trackColor={{ false: "#e5e7eb", true: theme.colors.primary }}
              thumbColor={Platform.OS === "android" ? "#f9fafb" : undefined}
            />
          </View>

          {/* Time Picker Trigger Row */}
          {remindersEnabled && (
            <>
              <View style={styles.divider} />
              <Pressable style={styles.settingRow} onPress={openTimePicker}>
                <View style={styles.settingIconContainer}>
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Reminder Time</Text>
                  <Text style={styles.settingSublabel}>
                    Preferred daily notification delivery window.
                  </Text>
                </View>
                <View style={styles.timeBadge}>
                  <Text style={styles.timeBadgeText}>
                    {formatTimeDisplay()}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={14}
                    color={theme.colors.primary}
                  />
                </View>
              </Pressable>
            </>
          )}
        </View>
      )}

      {/* Custom Vertical Scroll/Adjust Picker Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isPickerVisible}
        onRequestClose={() => setIsPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Reminder Time</Text>
            </View>

            <View style={styles.pickerContainer}>
              {/* Hours Column */}
              <View style={styles.pickerColumn}>
                <Pressable
                  style={styles.pickerArrow}
                  onPress={() => adjustHour(1)}
                >
                  <Ionicons
                    name="chevron-up"
                    size={24}
                    color={theme.colors.primary}
                  />
                </Pressable>
                <Text style={styles.pickerValueText}>
                  {pickerHour12.toString().padStart(2, "0")}
                </Text>
                <Pressable
                  style={styles.pickerArrow}
                  onPress={() => adjustHour(-1)}
                >
                  <Ionicons
                    name="chevron-down"
                    size={24}
                    color={theme.colors.primary}
                  />
                </Pressable>
              </View>

              <Text style={styles.pickerSeparator}>:</Text>

              {/* Minutes Column */}
              <View style={styles.pickerColumn}>
                <Pressable
                  style={styles.pickerArrow}
                  onPress={() => adjustMinute(5)}
                >
                  <Ionicons
                    name="chevron-up"
                    size={24}
                    color={theme.colors.primary}
                  />
                </Pressable>
                <Text style={styles.pickerValueText}>
                  {pickerMinute.toString().padStart(2, "0")}
                </Text>
                <Pressable
                  style={styles.pickerArrow}
                  onPress={() => adjustMinute(-5)}
                >
                  <Ionicons
                    name="chevron-down"
                    size={24}
                    color={theme.colors.primary}
                  />
                </Pressable>
              </View>

              {/* AM/PM Switch Segment Container */}
              <View style={styles.periodContainer}>
                <Pressable
                  style={[
                    styles.periodButton,
                    !pickerIsPm && styles.periodActiveButton,
                  ]}
                  onPress={() => setPickerIsPm(false)}
                >
                  <Text
                    style={[
                      styles.periodText,
                      !pickerIsPm && styles.periodActiveText,
                    ]}
                  >
                    AM
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.periodButton,
                    pickerIsPm && styles.periodActiveButton,
                  ]}
                  onPress={() => setPickerIsPm(true)}
                >
                  <Text
                    style={[
                      styles.periodText,
                      pickerIsPm && styles.periodActiveText,
                    ]}
                  >
                    PM
                  </Text>
                </Pressable>
              </View>
            </View>

            <Button onPress={handleSaveTime} style={styles.modalSaveButton}>
              Done
            </Button>
          </View>
        </View>
      </Modal>

      <View style={styles.buttonWrapper}>
        <Button variant="outline" onPress={logout} style={styles.logoutButton}>
          {isLoggingOut ? (
            <ActivityIndicator size="small" color={theme.colors.logoutRed} />
          ) : (
            <View style={styles.logoutContent}>
              <Ionicons
                name="log-out-outline"
                size={18}
                color={theme.colors.logoutRed}
              />
              <Text style={styles.logoutText}>Log Out</Text>
            </View>
          )}
        </Button>
      </View>
    </ScrollView>
  );
}
