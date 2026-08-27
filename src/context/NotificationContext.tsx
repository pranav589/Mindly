import { useAuth } from "@/hooks/useAuth";
import { theme } from "@/theme/themes";
import { useRouter } from "expo-router";
import React, { createContext, useContext, useEffect } from "react";
import { Platform } from "react-native";

let Notifications: any = null;
try {
  Notifications = require("expo-notifications");
} catch (e) {
  console.warn(
    "⚠️ expo-notifications native module is not available. Notifications are disabled.",
  );
}

let SecureStore: any = null;
try {
  SecureStore = require("expo-secure-store");
} catch (e) {
  console.warn("⚠️ expo-secure-store is not available. Storage is disabled.");
}

interface NotificationContextType {
  sendLocalNotification: (
    title: string,
    body: string,
    data?: Record<string, any>,
  ) => Promise<string | undefined>;
  scheduleStudyReminder: (
    notebookId: string,
    notebookName: string,
    nextReviewDate: Date,
  ) => Promise<void>;
  cancelStudyReminder: (notebookId: string) => Promise<void>;
  requestNotificationPermissions: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType>({
  sendLocalNotification: async () => undefined,
  scheduleStudyReminder: async () => {},
  cancelStudyReminder: async () => {},
  requestNotificationPermissions: async () => false,
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Configure foreground notification presentation options
  useEffect(() => {
    if (!Notifications) return;
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }, []);

  // Configure Android channels on mount if permission is already granted
  useEffect(() => {
    if (!Notifications || !isAuthenticated) return;
    async function checkAndConfigureChannels() {
      // Just check permissions, do NOT request them auto-prompting on login
      const { status } = await Notifications.getPermissionsAsync();

      if (status === "granted") {
        // Configure Android channel
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: theme.colors.primary,
          });
        }
      }
    }

    checkAndConfigureChannels();
  }, [isAuthenticated]);

  // Listen for user tapping a notification (Deep Linking)
  useEffect(() => {
    if (!Notifications) return;
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response: any) => {
        try {
          const data = response.notification.request.content.data;
          console.log(
            "⚡ [Notification Response] Tapped notification with data:",
            data,
          );

          if (data && data.notebookId && data.screen) {
            // Push directly to targeted page
            router.push(`/notebook/${data.notebookId}/${data.screen}`);
          }
        } catch (err) {
          console.error("Failed to parse notification deep-linking data:", err);
        }
      },
    );

    return () => subscription.remove();
  }, [router]);

  const requestNotificationPermissions = async (): Promise<boolean> => {
    if (!Notifications) return false;
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus === "granted") {
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: theme.colors.primary,
          });
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to request notification permissions:", err);
      return false;
    }
  };

  // Helper to send/schedule local notification immediately
  const sendLocalNotification = async (
    title: string,
    body: string,
    data: Record<string, any> = {},
  ) => {
    if (!Notifications) {
      console.warn(
        "⚠️ Cannot send local notification: expo-notifications is not available.",
      );
      return undefined;
    }
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: null, // trigger immediately
      });
      return id;
    } catch (err) {
      console.error("Failed to schedule local notification:", err);
    }
  };

  const cancelStudyReminder = async (notebookId: string) => {
    if (!Notifications || !SecureStore) return;
    try {
      const key = `study_reminder_${notebookId}`;
      const scheduledId = await SecureStore.getItemAsync(key);
      if (scheduledId) {
        await Notifications.cancelScheduledNotificationAsync(scheduledId);
        await SecureStore.deleteItemAsync(key);
        console.log(
          `Cancelled study reminder notification for notebook: ${notebookId}`,
        );
      }
    } catch (err) {
      console.error("Failed to cancel study reminder:", err);
    }
  };

  const scheduleStudyReminder = async (
    notebookId: string,
    notebookName: string,
    nextReviewDate: Date,
  ) => {
    if (!Notifications || !SecureStore) return;
    try {
      // Contextually request/ensure permissions before scheduling
      const hasPermission = await requestNotificationPermissions();
      if (!hasPermission) {
        console.log("⚠️ Cannot schedule study reminder: permissions not granted.");
        return;
      }

      // Cancel existing notification for this notebook
      await cancelStudyReminder(notebookId);

      // Fetch global study reminder settings
      const settingsRaw = await SecureStore.getItemAsync(
        "study_reminder_settings",
      );
      let settings = { enabled: true, hour: 19, minute: 0 }; // Default 7:00 PM
      if (settingsRaw) {
        try {
          settings = JSON.parse(settingsRaw);
        } catch (parseErr) {
          console.warn(
            "Failed to parse study reminder settings, using default.",
          );
        }
      }

      if (!settings.enabled) {
        console.log("Study reminders are disabled in settings.");
        return;
      }

      // Calculate target review date
      const targetDate = new Date(nextReviewDate);
      targetDate.setHours(settings.hour);
      targetDate.setMinutes(settings.minute);
      targetDate.setSeconds(0);
      targetDate.setMilliseconds(0);

      // If targetDate is in the past, push it to tomorrow or next valid day
      const now = new Date();
      if (targetDate.getTime() <= now.getTime()) {
        targetDate.setDate(targetDate.getDate() + 1);
      }

      // Schedule the calendar trigger notification
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Study Reminder 📚",
          body: `Time to review your flashcards for "${notebookName}"! Keep up your streak.`,
          data: { notebookId, screen: "flashcard" },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: targetDate,
        },
      });

      // Store scheduled notification ID
      const key = `study_reminder_${notebookId}`;
      await SecureStore.setItemAsync(key, notificationId);
      console.log(
        `Scheduled study reminder for "${notebookName}" at ${targetDate.toString()} (ID: ${notificationId})`,
      );
    } catch (err) {
      console.error("Failed to schedule study reminder:", err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        sendLocalNotification,
        scheduleStudyReminder,
        cancelStudyReminder,
        requestNotificationPermissions,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
