import { theme } from "@/theme/themes";
import { useRouter } from "expo-router";
import React, { createContext, useContext, useEffect } from "react";
import { Platform } from "react-native";
import { useAuth } from "@/hooks/useAuth";

let Notifications: any = null;
try {
  Notifications = require("expo-notifications");
} catch (e) {
  console.warn("⚠️ expo-notifications native module is not available. Notifications are disabled.");
}

interface NotificationContextType {
  sendLocalNotification: (
    title: string,
    body: string,
    data?: Record<string, any>,
  ) => Promise<string | undefined>;
}

const NotificationContext = createContext<NotificationContextType>({
  sendLocalNotification: async () => undefined,
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

  // Request permissions and configure Android channels on mount
  useEffect(() => {
    if (!Notifications || !isAuthenticated) return;
    async function configureNotifications() {
      // Request permissions
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("⚠️ Notification permissions not granted!");
        return;
      }

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

    configureNotifications();
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

  // Helper to send/schedule local notification immediately
  const sendLocalNotification = async (
    title: string,
    body: string,
    data: Record<string, any> = {},
  ) => {
    if (!Notifications) {
      console.warn("⚠️ Cannot send local notification: expo-notifications is not available.");
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

  return (
    <NotificationContext.Provider value={{ sendLocalNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

