import { theme } from "@/theme/themes";
import { useGlobalAudioPlayer } from "@/context/AudioPlayerContext";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { styles } from "./MiniPlayer.styles";

export function MiniPlayer() {
  const router = useRouter();
  const pathname = usePathname();
  const { trackInfo, isPlaying, dismiss } = useGlobalAudioPlayer();

  if (!trackInfo || pathname.includes("/podcast")) return null;

  const handleNavigateToPodcast = () => {
    router.push(`/notebook/${trackInfo.notebookId}/podcast`);
  };

  const handleLongPress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dismiss();
  };

  return (
    <Pressable
      style={styles.container}
      onPress={handleNavigateToPodcast}
      onLongPress={handleLongPress}
      delayLongPress={600}
    >
      {isPlaying && <View style={styles.activeIndicator} />}

      <Ionicons
        name={isPlaying ? "headset-outline" : "pause-circle-outline"}
        size={28}
        color={theme.colors.textLight}
      />
      <Pressable onPress={dismiss} style={styles.closeBadge}>
        <Ionicons name="close" size={14} color={theme.colors.textSecondary} />
      </Pressable>
    </Pressable>
  );
}
