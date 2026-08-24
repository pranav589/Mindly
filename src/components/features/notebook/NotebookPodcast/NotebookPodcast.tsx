import { theme } from "@/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenHeader from "@/components/ScreenHeader/ScreenHeader";
import { useSSE } from "@/context/SSEContext";
import { API_BASE_URL, apiClient } from "@/services/api";
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

  const { data: notebook, isLoading: isLoadingNotebook } =
    useQuery<NotebookData>({
      queryKey: ["notebook", id],
      queryFn: async () => {
        const res = await apiClient.get<{ notebook: NotebookData }>(
          `/api/notebooks/${id}`,
        );
        return res.data.notebook;
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
      console.warn("Podcast generation error:", err?.response?.data?.error || err.message);
      Alert.alert(
        "Error",
        err?.response?.data?.error ?? "Failed to initiate podcast generation.",
      );
    },
  });

  const isGenerating =
    notebook?.podcastStatus === "generating" ||
    generatePodcastMutation.isPending;

  const handleRegeneratePress = () => {
    Alert.alert(
      "Regenerate Podcast",
      "This will generate a new host script and rebuild the audio dialogue files. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Regenerate",
          onPress: () => {
            generatePodcastMutation.mutate();
            router.replace(`/notebook/${id}` as any);
            Alert.alert(
              "Generating Podcast",
              "Your AI podcast discussion is being generated in the background. You'll receive a notification when it's ready!"
            );
          },
        },
      ],
    );
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
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.generatingTitle}>Structuring Audio Discussion</Text>
        <Text style={styles.generatingSubtitle}>
          {progressText ||
            "Analyzing notebook materials and drafting discussion script..."}
        </Text>
      </View>
    );
  }

  if (!notebook?.podcast || !notebook.podcast.audioUrl) {
    return (
      <View style={[styles.container, containerInsetPadding]}>
        <StatusBar style="dark" />
        <ScreenHeader title="Audio Overview" />

        <View style={styles.centered}>
          <Ionicons name="mic-outline" size={72} color={theme.colors.lightGrayIcon} />
          <Text style={styles.emptyTitle}>No Audio Overview Yet</Text>
          <Text style={styles.emptySubtitle}>
            Generate an AI conversational podcast dialog summarizing the
            materials in this notebook.
          </Text>
          <Pressable
            onPress={() => {
              generatePodcastMutation.mutate();
              router.replace(`/notebook/${id}` as any);
              Alert.alert(
                "Generating Podcast",
                "Your AI podcast discussion is being generated in the background. You'll receive a notification when it's ready!"
              );
            }}
            style={styles.primaryButton}
          >
            <Ionicons name="sparkles-outline" size={18} color={theme.colors.textLight} />
            <Text style={styles.primaryButtonText}>
              Generate Audio Overview
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const audioUrl = notebook.podcast.audioUrl;
  const fullAudioUrl = audioUrl.startsWith("http")
    ? audioUrl
    : `${API_BASE_URL}${audioUrl}`;

  const script = notebook.podcast.script || [];

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
          </View>
          <Text style={styles.titleText}>Podcast Discussion</Text>
          <Text style={styles.descriptionText}>
            Listen to Host A and Host B overview and synthesize the concepts in
            your notebook.
          </Text>
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
