import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import React, { createContext, useContext, useState } from "react";

interface TrackInfo {
  url: string;
  title: string;
  subtitle: string;
  notebookId: string;
}

interface AudioPlayerContextType {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  trackInfo: TrackInfo | null;
  loadTrack: (
    url: string,
    title: string,
    subtitle: string,
    notebookId: string,
    shouldPlay?: boolean,
  ) => void;
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => void;
  skip: (seconds: number) => void;
  setPlaybackRate: (rate: number) => void;
  dismiss: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType>({
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  playbackRate: 1.0,
  trackInfo: null,
  loadTrack: () => {},
  play: () => {},
  pause: () => {},
  seekTo: () => {},
  skip: () => {},
  setPlaybackRate: () => {},
  dismiss: () => {},
});

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [trackInfo, setTrackInfo] = useState<TrackInfo | null>(null);

  // Initialize the audio player once (stably) with null
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);

  const isPlaying = status?.playing ?? false;
  const currentTime = status?.currentTime ?? 0;
  const duration = status?.duration ?? 0;
  const playbackRate = player?.playbackRate ?? 1.0;

  const loadTrack = async (
    url: string,
    title: string,
    subtitle: string,
    notebookId: string,
    shouldPlay: boolean = true,
  ) => {
    try {
      // Configure audio mode for background playback
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        interruptionMode: "doNotMix",
      });

      setTrackInfo({ url, title, subtitle, notebookId });
      player.replace({ uri: url });

      if (shouldPlay) {
        player.play();
      }

      // Delay registering lock screen controls to ensure the audio session is fully active
      setTimeout(() => {
        try {
          player.setActiveForLockScreen(true, {
            title,
            artist: subtitle,
          });
          console.log(
            "⚡ [AudioPlayerContext] Registered lock screen metadata successfully",
          );
        } catch (err) {
          console.error("Failed to set active for lock screen:", err);
        }
      }, 500);
    } catch (error) {
      console.error("[AudioPlayerContext] Error loading track:", error);
    }
  };

  const play = () => {
    player.play();
  };

  const pause = () => {
    player.pause();
  };

  const seekTo = (seconds: number) => {
    const bounded = Math.max(0, Math.min(duration, seconds));
    player.seekTo(bounded);
  };

  const skip = (seconds: number) => {
    const target = currentTime + seconds;
    seekTo(target);
  };

  const setPlaybackRate = (rate: number) => {
    player.shouldCorrectPitch = true;
    player.playbackRate = rate;
  };

  const dismiss = () => {
    player.pause();
    player.setActiveForLockScreen(false);
    setTrackInfo(null);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        isPlaying,
        currentTime,
        duration,
        playbackRate,
        trackInfo,
        loadTrack,
        play,
        pause,
        seekTo,
        skip,
        setPlaybackRate,
        dismiss,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useGlobalAudioPlayer = () => useContext(AudioPlayerContext);
