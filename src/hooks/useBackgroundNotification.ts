import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { useNotifications } from "@/context/NotificationContext";

export function useBackgroundNotification(
  isProcessing: boolean,
  title: string,
  body: string,
  notebookId: string,
  screen: string
) {
  const { sendLocalNotification } = useNotifications();
  const hasNotifiedInProcessRef = useRef(false);
  const prevIsProcessingRef = useRef(false);
  const isProcessingRef = useRef(isProcessing);

  useEffect(() => {
    isProcessingRef.current = isProcessing;
    
    // Reset the notification flag when processing transitions from false -> true
    if (isProcessing && !prevIsProcessingRef.current) {
      hasNotifiedInProcessRef.current = false;
    }
    prevIsProcessingRef.current = isProcessing;
  }, [isProcessing]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (
        nextAppState === "background" &&
        isProcessingRef.current &&
        notebookId &&
        !hasNotifiedInProcessRef.current
      ) {
        hasNotifiedInProcessRef.current = true;
        sendLocalNotification(title, body, { notebookId, screen });
      }
    };

    const appStateSub = AppState.addEventListener("change", handleAppStateChange);
    return () => appStateSub.remove();
  }, [title, body, notebookId, screen, sendLocalNotification]);
}
