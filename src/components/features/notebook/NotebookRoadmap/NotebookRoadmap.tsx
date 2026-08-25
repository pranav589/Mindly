import { theme } from "@/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheet from "@/components/BottomSheet";
import { useSSE } from "@/context/SSEContext";
import { apiClient } from "@/services/api";
import { styles } from "./NotebookRoadmap.styles";

interface RoadmapNode {
  id: string;
  concept: string;
  description: string;
  sourceName?: string;
  sourceType?: string;
  url?: string;
  timestamp?: number;
  reason?: string;
}

interface NotebookData {
  _id: string;
  name: string;
  roadmap?: {
    title: string;
    description: string;
    nodes: RoadmapNode[];
  };
  roadmapStatus?: "idle" | "generating";
}

import { offlineCache } from "@/services/offlineCache";

export function NotebookRoadmap() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { lastEvent } = useSSE();

  const [activeSource, setActiveSource] = useState<RoadmapNode | null>(null);
  const [sourceSheetOpen, setSourceSheetOpen] = useState(false);

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
            await offlineCache.cacheNotebook(id as string, nb.name || "Notebook");
            if (nb.roadmap) {
              await offlineCache.cacheRoadmap(id as string, nb.roadmap);
            }
          }
          return nb;
        } catch (err) {
          if (id) {
            const cachedList = await offlineCache.getCachedNotebooks();
            const match = cachedList.find((n) => n.notebookId === id);
            if (match) {
              const cachedRoadmap = await offlineCache.getCachedRoadmap(id as string);
              return {
                _id: match.notebookId,
                name: match.title,
                roadmap: cachedRoadmap || undefined,
                roadmapStatus: "idle",
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
    if (lastEvent?.event?.type === "roadmap:complete") {
      queryClient.invalidateQueries({ queryKey: ["notebook", id] });
    }
  }, [lastEvent, id, queryClient]);

  const generateRoadmapMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post(`/api/roadmap`, { notebookId: id });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notebook", id] });
    },
    onError: (err: any) => {
      console.warn("Roadmap generation error:", err?.response?.data?.error || err.message);
      Alert.alert(
        "Error",
        err?.response?.data?.error ?? "Failed to initiate roadmap generation.",
      );
    },
  });

  const isGenerating =
    notebook?.roadmapStatus === "generating" ||
    generateRoadmapMutation.isPending;

  const handleRegenerate = () => {
    Alert.alert(
      "Regenerate Roadmap",
      "This will analyze your current documents and construct a new learning syllabus. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Regenerate",
          onPress: () => {
            generateRoadmapMutation.mutate();
            router.replace(`/notebook/${id}` as any);
            Alert.alert(
              "Generating Roadmap",
              "Your personalized syllabus roadmap is being generated in the background. You'll receive a notification when it's ready!"
            );
          },
        },
      ],
    );
  };

  const containerInsetPadding = { paddingTop: insets.top };
  const scrollContentPadding = { paddingBottom: 60 };

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
        <Text style={styles.generatingTitle}>Generating Study Roadmap</Text>
        <Text style={styles.generatingSubtitle}>
          {progressText ||
            "Analyzing notebook materials and mapping learning path..."}
        </Text>
      </View>
    );
  }

  if (
    !notebook?.roadmap ||
    !notebook.roadmap.nodes ||
    notebook.roadmap.nodes.length === 0
  ) {
    return (
      <View style={[styles.container, containerInsetPadding]}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Syllabus Roadmap</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.centered}>
          <Ionicons name="map-outline" size={72} color={theme.colors.lightGrayIcon} />
          <Text style={styles.emptyTitle}>No Roadmap Yet</Text>
          <Text style={styles.emptySubtitle}>
            Create a custom step-by-step study syllabus mapped directly from
            your uploaded notebook sources.
          </Text>
          <Pressable
            onPress={() => {
              generateRoadmapMutation.mutate();
              router.replace(`/notebook/${id}` as any);
              Alert.alert(
                "Generating Roadmap",
                "Your personalized syllabus roadmap is being generated in the background. You'll receive a notification when it's ready!"
              );
            }}
            style={styles.primaryButton}
          >
            <Ionicons name="sparkles-outline" size={18} color={theme.colors.textLight} />
            <Text style={styles.primaryButtonText}>Generate Study Roadmap</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const { title, description, nodes } = notebook.roadmap;

  return (
    <View style={[styles.container, containerInsetPadding]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Syllabus Roadmap</Text>
        <Pressable onPress={handleRegenerate} style={styles.headerButton}>
          <Ionicons name="refresh-outline" size={22} color={theme.colors.primary} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={scrollContentPadding}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{title || "Study Roadmap"}</Text>
        <Text style={styles.subtitle}>
          {description ||
            "Follow this structured timeline to master the concepts in your notebook."}
        </Text>

        <View style={styles.timeline}>
          {nodes.map((step, index) => {
            let iconName: any = "school-outline";
            const lowerDesc = step.description.toLowerCase();
            const lowerConcept = step.concept.toLowerCase();
            if (lowerDesc.includes("intro") || lowerConcept.includes("intro")) {
              iconName = "book-outline";
            } else if (
              lowerDesc.includes("energy") ||
              lowerDesc.includes("atp") ||
              lowerDesc.includes("power")
            ) {
              iconName = "flash-outline";
            } else if (
              lowerDesc.includes("cycle") ||
              lowerDesc.includes("repeat") ||
              lowerDesc.includes("process")
            ) {
              iconName = "sync-outline";
            } else if (
              lowerDesc.includes("finish") ||
              lowerDesc.includes("exam") ||
              lowerDesc.includes("conclusion")
            ) {
              iconName = "ribbon-outline";
            } else if (index === 0) {
              iconName = "play-outline";
            } else if (index === nodes.length - 1) {
              iconName = "checkmark-done-circle-outline";
            }

            return (
              <View key={step.id || index} style={styles.timelineStep}>
                <View style={styles.markerContainer}>
                  <View style={styles.iconCircle}>
                    <Ionicons name={iconName} size={18} color={theme.colors.primary} />
                  </View>
                  {index < nodes.length - 1 && (
                    <View style={styles.connectorLine} />
                  )}
                </View>
                <View style={styles.card}>
                  <Text style={styles.stepTitle}>
                    Step {index + 1}: {step.concept}
                  </Text>
                  <Text style={styles.stepDesc}>{step.description}</Text>

                  {step.reason && (
                    <View style={styles.reasonBox}>
                      <Ionicons name="bulb-outline" size={14} color={theme.colors.grayTextLight} />
                      <Text style={styles.reasonText}>{step.reason}</Text>
                    </View>
                  )}

                  {step.sourceName && (
                    <Pressable
                      onPress={() => {
                        setActiveSource(step);
                        setSourceSheetOpen(true);
                      }}
                      style={({ pressed }) => [
                        styles.sourceTag,
                        pressed && styles.sourceTagPressed,
                      ]}
                    >
                      <Ionicons
                        name="document-outline"
                        size={12}
                        color={theme.colors.primary}
                      />
                      <Text style={styles.sourceTagText} numberOfLines={1}>
                        Source: {step.sourceName}
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* SOURCE DETAILS BOTTOM SHEET */}
      <BottomSheet
        isOpen={sourceSheetOpen}
        onClose={() => setSourceSheetOpen(false)}
        title="Source Reference Details"
      >
        {activeSource && (
          <View style={styles.sheetContent}>
            <View style={styles.metaCard}>
              <Ionicons
                name={
                  activeSource.sourceType === "youtube"
                    ? "logo-youtube"
                    : "document-text-outline"
                }
                size={20}
                color={
                  activeSource.sourceType === "youtube" ? theme.colors.accentRed : theme.colors.primary
                }
              />
              <View style={styles.metaTextContainer}>
                <Text style={styles.metaTitle}>{activeSource.sourceName}</Text>
                <Text style={styles.metaSubtitle}>
                  {activeSource.sourceType === "pdf" && activeSource.timestamp
                    ? `Page ${activeSource.timestamp}`
                    : activeSource.sourceType === "youtube" &&
                        activeSource.timestamp
                      ? `Timestamp: ${Math.floor(activeSource.timestamp / 60)}m ${activeSource.timestamp % 60}s`
                      : `Type: ${activeSource.sourceType || "Document"}`}
                </Text>
              </View>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Study Context</Text>
              <Text style={styles.detailVal}>
                This source material supports learning{" "}
                <Text style={styles.detailConceptBold}>
                  {activeSource.concept}
                </Text>
                .
              </Text>
            </View>

            {activeSource.reason && (
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Study Rationale</Text>
                <Text style={styles.detailVal}>{activeSource.reason}</Text>
              </View>
            )}

            {activeSource.url ? (
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>URL / Link</Text>
                <Text style={[styles.detailVal, styles.detailValLink]}>
                  {activeSource.url}
                </Text>
              </View>
            ) : null}

            <Pressable
              onPress={() => setSourceSheetOpen(false)}
              style={({ pressed }) => [
                styles.primaryButton,
                styles.sheetDoneButton,
                pressed && styles.pressedOpacity,
              ]}
            >
              <Text style={styles.primaryButtonText}>Done</Text>
            </Pressable>
          </View>
        )}
      </BottomSheet>
    </View>
  );
}

function useSSEProgress(notebookId: string) {
  const queryClient = useQueryClient();
  return (
    queryClient.getQueryData<string>(["roadmap:progress", notebookId]) || ""
  );
}
