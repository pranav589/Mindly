import ScreenHeader from "@/components/ScreenHeader/ScreenHeader";
import { useCustomAlert } from "@/context/CustomAlertContext";
import { useNotifications } from "@/context/NotificationContext";
import { useSSE } from "@/context/SSEContext";
import { API_BASE_URL, apiClient } from "@/services/api";
import { offlineCache } from "@/services/offlineCache";
import { theme } from "@/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  documentDirectory,
  downloadAsync,
  getInfoAsync,
} from "expo-file-system/legacy";
import { useNetworkState } from "expo-network";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./NotebookPodcast.styles";
import { PodcastAudioPlayer } from "./PodcastAudioPlayer/PodcastAudioPlayer";
import { PodcastTranscript } from "./PodcastTranscript/PodcastTranscript";

interface PodcastTurn {
  speaker: "Host A" | "Host B";
  text: string;
}

interface NotebookData {
  _id: string;
  name: string;
  podcast?: {
    audioUrl: string;
    script: PodcastTurn[];
  };
  podcastStatus?: "idle" | "generating";
}

export function NotebookPodcast() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { lastEvent } = useSSE();
  const { requestNotificationPermissions } = useNotifications();
  const { showAlert } = useCustomAlert();

  const networkState = useNetworkState();
  const isOffline = networkState.isConnected === false;

  const [downloading, setDownloading] = useState(false);
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [localScript, setLocalScript] = useState<PodcastTurn[]>([]);

  // Load cached podcast if any on mount or connectivity change
  useEffect(() => {
    if (!id) return;
    offlineCache.getCachedPodcast(id as string).then((cached) => {
      if (cached && cached.localUri) {
        getInfoAsync(cached.localUri).then((info) => {
          if (info.exists) {
            setLocalUri(cached.localUri);
            if (cached.script) {
              setLocalScript(cached.script);
            }
          } else {
            setLocalUri(null);
          }
        });
      }
    });
  }, [id, isOffline]);

  const { data: notebook, isLoading: isLoadingNotebook } =
    useQuery<NotebookData>({
      queryKey: ["notebook", id],
      queryFn: async () => {
        try {
          const res = await apiClient.get<{ notebook: NotebookData }>(
            `/api/notebooks/${id}`,
          );
          const nb = res.data.notebook;
          if (id && nb) {
            await offlineCache.cacheNotebook(
              id as string,
              nb.name || "Notebook",
            );
          }
          return nb;
        } catch (err) {
          if (id) {
            const cachedList = await offlineCache.getCachedNotebooks();
            const match = cachedList.find((n) => n.notebookId === id);
            if (match) {
              // Try to populate cached script
              const cachedPodcast = await offlineCache.getCachedPodcast(
                id as string,
              );
              return {
                _id: match.notebookId,
                name: match.title,
                podcast: cachedPodcast
                  ? {
                      audioUrl: cachedPodcast.localUri,
                      script: cachedPodcast.script,
                    }
                  : undefined,
                podcastStatus: "idle",
              };
            }
          }
          throw err;
        }
      },
      enabled: !!id,
    });

  const progressText = useSSEProgress(id as string);

  useEffect(() => {
    if (lastEvent?.event?.type === "podcast:complete") {
      queryClient.invalidateQueries({ queryKey: ["notebook", id] });
    }
  }, [lastEvent, id, queryClient]);

  const generatePodcastMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post(`/api/podcast`, { notebookId: id });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notebook", id] });
    },
    onError: (err: any) => {
      console.warn(
        "Podcast generation error:",
        err?.response?.data?.error || err.message,
      );
      showAlert({
        title: "Error",
        message:
          err?.response?.data?.error ??
          "Failed to initiate podcast generation.",
        type: "error",
      });
    },
  });

  const isGenerating =
    notebook?.podcastStatus === "generating" ||
    generatePodcastMutation.isPending;

  const handleGeneratePodcast = async () => {
    if (isOffline) {
      showAlert({
        title: "Offline",
        message: "Cannot generate podcasts in offline mode.",
        type: "warning",
      });
      return;
    }
    await requestNotificationPermissions();
    generatePodcastMutation.mutate();
    router.replace(`/notebook/${id}` as any);
    showAlert({
      title: "Generating Podcast",
      message:
        "Your AI podcast discussion is being generated in the background. You'll receive a notification when it's ready!",
      type: "info",
    });
  };

  const handleRegeneratePress = () => {
    if (isOffline) {
      showAlert({
        title: "Offline",
        message: "Cannot regenerate podcasts in offline mode.",
        type: "warning",
      });
      return;
    }
    showAlert({
      title: "Regenerate Podcast",
      message:
        "This will generate a new host script and rebuild the audio dialogue files. Continue?",
      type: "warning",
      buttons: [
        { text: "Cancel", style: "cancel" },
        {
          text: "Regenerate",
          onPress: handleGeneratePodcast,
        },
      ],
    });
  };

  const handleDownload = async () => {
    if (!notebook?.podcast?.audioUrl || !id) return;
    setDownloading(true);
    try {
      const remoteUrl = notebook.podcast.audioUrl.startsWith("http")
        ? notebook.podcast.audioUrl
        : `${API_BASE_URL}${notebook.podcast.audioUrl}`;

      const targetPath = `${documentDirectory}podcast_${id}.mp3`;
      const result = await downloadAsync(remoteUrl, targetPath);

      if (result.status === 200) {
        await offlineCache.cachePodcast(
          id as string,
          result.uri,
          notebook.podcast.script || [],
        );
        setLocalUri(result.uri);
        setLocalScript(notebook.podcast.script || []);
        showAlert({
          title: "Success",
          message: "Podcast downloaded successfully for offline listening! 💾",
          type: "success",
        });
      } else {
        throw new Error("Download failed");
      }
    } catch (error) {
      console.error("Failed to download podcast:", error);
      showAlert({
        title: "Error",
        message: "Failed to download podcast audio.",
        type: "error",
      });
    } finally {
      setDownloading(false);
    }
  };

  const containerInsetPadding = { paddingTop: insets.top };
  const scrollContentPadding = { paddingBottom: 100 };

  if (isLoadingNotebook) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading notebook details…</Text>
      </View>
    );
  }

  if (isGenerating) {
    return (
      <View style={[styles.container, containerInsetPadding]}>
        <StatusBar style="dark" />
        <ScreenHeader title="Structuring Audio Discussion" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.generatingSubtitle}>
            {progressText ||
              "Analyzing notebook materials and drafting discussion script..."}
          </Text>
        </View>
      </View>
    );
  }

  if (isOffline && !localUri) {
    return (
      <View style={[styles.container, containerInsetPadding]}>
        <StatusBar style="dark" />
        <ScreenHeader title="Audio Overview" />
        <View style={styles.centered}>
          <Ionicons
            name="wifi-outline"
            size={72}
            color={theme.colors.lightGrayIcon}
          />
          <Text style={styles.emptyTitle}>Offline Mode</Text>
          <Text style={styles.emptySubtitle}>
            This podcast has not been downloaded yet. Connect to the internet to
            listen to it.
          </Text>
        </View>
      </View>
    );
  }

  if (!notebook?.podcast || !notebook.podcast.audioUrl) {
    return (
      <View style={[styles.container, containerInsetPadding]}>
        <StatusBar style="dark" />
        <ScreenHeader title="Audio Overview" />

        <View style={styles.centered}>
          <Ionicons
            name="mic-outline"
            size={72}
            color={theme.colors.lightGrayIcon}
          />
          <Text style={styles.emptyTitle}>No Audio Overview Yet</Text>
          <Text style={styles.emptySubtitle}>
            Generate an AI conversational podcast dialog summarizing the
            materials in this notebook.
          </Text>
          <Pressable
            onPress={handleGeneratePodcast}
            style={styles.primaryButton}
          >
            <Ionicons
              name="sparkles-outline"
              size={18}
              color={theme.colors.textLight}
            />
            <Text style={styles.primaryButtonText}>
              Generate Audio Overview
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const audioUrl = notebook.podcast.audioUrl;
  const fullAudioUrl = localUri
    ? localUri
    : audioUrl.startsWith("http")
      ? audioUrl
      : `${API_BASE_URL}${audioUrl}`;

  const script = notebook.podcast.script || localScript || [];

  return (
    <View style={[styles.container, containerInsetPadding]}>
      <StatusBar style="dark" />

      <ScreenHeader
        title="Audio Overview"
        rightIcon="refresh-outline"
        rightAction={handleRegeneratePress}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={scrollContentPadding}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Header Area */}
        <View style={styles.infoArea}>
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{notebook.name}</Text>
            </View>
            {localUri && (
              <View
                style={[
                  styles.tag,
                  { backgroundColor: "rgba(16, 185, 129, 0.15)" },
                ]}
              >
                <Text style={[styles.tagText, { color: "#10b981" }]}>
                  💾 Offline Ready
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.titleText}>Podcast Discussion</Text>
          <Text style={styles.descriptionText}>
            Listen to Host A and Host B overview and synthesize the concepts in
            your notebook.
          </Text>

          {!localUri ? (
            <Pressable
              onPress={handleDownload}
              disabled={downloading}
              style={[styles.primaryButton, styles.downloadButton]}
            >
              {downloading ? (
                <ActivityIndicator
                  size="small"
                  color={theme.colors.textLight}
                />
              ) : (
                <View style={styles.downloadRow}>
                  <Ionicons
                    name="download-outline"
                    size={18}
                    color={theme.colors.textLight}
                    style={styles.downloadIcon}
                  />
                  <Text style={styles.primaryButtonText}>
                    Download for Offline Listening
                  </Text>
                </View>
              )}
            </Pressable>
          ) : (
            <View style={styles.savedOfflineRow}>
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={theme.colors.success}
              />
              <Text style={styles.savedOfflineText}>Saved Offline</Text>
            </View>
          )}
        </View>

        {/* Audio Overview Podcast Player Card */}
        <PodcastAudioPlayer fullAudioUrl={fullAudioUrl} />

        {/* Podcast Transcript section */}
        {script.length > 0 && <PodcastTranscript script={script} />}
      </ScrollView>
    </View>
  );
}

function useSSEProgress(notebookId: string) {
  const queryClient = useQueryClient();
  return (
    queryClient.getQueryData<string>(["podcast:progress", notebookId]) || ""
  );
}
