import { useGlobalAudioPlayer } from "@/context/AudioPlayerContext";
import { theme } from "@/theme/themes";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "./PodcastAudioPlayer.styles";

interface PodcastAudioPlayerProps {
  fullAudioUrl: string;
}

export function PodcastAudioPlayer({ fullAudioUrl }: PodcastAudioPlayerProps) {
  const { id } = useLocalSearchParams();
  const notebookId = id as string;

  const {
    trackInfo,
    loadTrack,
    isPlaying,
    currentTime,
    duration: totalDuration,
    playbackRate: playbackSpeed,
    play,
    pause,
    skip,
    setPlaybackRate,
  } = useGlobalAudioPlayer();

  const waveformBarsCount = 36;
  const [heights, setHeights] = useState<number[]>([]);

  useEffect(() => {
    const initialHeights = Array.from({ length: waveformBarsCount }).map(
      () => Math.floor(Math.random() * 50) + 15,
    );
    setHeights(initialHeights);
  }, []);

  useEffect(() => {
    let animationInterval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      animationInterval = setInterval(() => {
        setHeights((prev) =>
          prev.map((h) => {
            const delta = Math.floor(Math.random() * 14) - 7;
            const nextH = h + delta;
            return Math.max(10, Math.min(80, nextH));
          }),
        );
      }, 150);
    }
    return () => clearInterval(animationInterval);
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      if (!trackInfo || trackInfo.url !== fullAudioUrl) {
        loadTrack(
          fullAudioUrl,
          "Overview Podcast",
          "AI-generated discussion",
          notebookId,
          true,
        );
      } else {
        play();
      }
    }
  };

  const handleSkip = (seconds: number) => {
    skip(seconds);
  };

  const handleSpeedToggle = () => {
    const speeds = [1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackRate(nextSpeed);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage =
    totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  const progressWidthStyle = {
    width: `${progressPercentage}%` as any,
  };

  return (
    <View style={styles.playerCard}>
      <View style={styles.playerCardHeader}>
        <View style={styles.podcastIconContainer}>
          <Ionicons name="mic" size={24} color={theme.colors.textLight} />
        </View>
        <View>
          <Text style={styles.podcastTitle}>Overview Podcast</Text>
          <Text style={styles.podcastSubtitle}>AI-generated discussion</Text>
        </View>
      </View>

      {/* Immersive Player Area (Dark background) */}
      <View style={styles.immersivePlayer}>
        <View style={[styles.glowElement, styles.glowTopRight]} />
        <View style={[styles.glowElement, styles.glowBottomLeft]} />

        {/* Waveform Visualization */}
        <View style={styles.waveformContainer}>
          {heights.map((h, index) => {
            const isActive =
              index / waveformBarsCount <= progressPercentage / 100;
            const barHeightStyle = { height: `${h}%` as any };
            return (
              <View
                key={index}
                style={[
                  styles.waveformBar,
                  isActive
                    ? styles.waveformBarActive
                    : styles.waveformBarInactive,
                  barHeightStyle,
                ]}
              />
            );
          })}
        </View>

        {/* Progress Bar (Scrubber) */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressTimeText}>
              {formatTime(currentTime)}
            </Text>
            <Text style={styles.progressTimeText}>
              {formatTime(totalDuration)}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, progressWidthStyle]} />
          </View>
        </View>

        {/* Playback Controls */}
        <View style={styles.controlsRow}>
          {/* Playback Speed toggle */}
          <Pressable onPress={handleSpeedToggle} style={styles.speedButton}>
            <Text style={styles.speedText}>{playbackSpeed}x</Text>
          </Pressable>

          {/* Central controls */}
          <View style={styles.centralControls}>
            <Pressable onPress={() => handleSkip(-10)}>
              <MaterialIcons
                name="replay-10"
                size={32}
                color={theme.colors.textLight}
              />
            </Pressable>

            <Pressable onPress={handlePlayPause} style={styles.playButtonGlow}>
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={28}
                color={theme.colors.textLight}
                style={
                  isPlaying ? styles.playIconNoOffset : styles.playIconOffset
                }
              />
            </Pressable>

            <Pressable onPress={() => handleSkip(10)}>
              <MaterialIcons
                name="forward-10"
                size={32}
                color={theme.colors.textLight}
              />
            </Pressable>
          </View>

          <View style={styles.placeholder} />
        </View>
      </View>
    </View>
  );
}
