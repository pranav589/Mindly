import Button from "@/components/Button";
import { apiClient } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddSourceDrawers } from "@/components/AddSourceDrawers/AddSourceDrawers";
import { styles } from "./NotebookSources.styles";
import { SourceCard } from "./SourceCard/SourceCard";

export function NotebookSources() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [drawerVisible, setDrawerVisible] = useState(false);

  // Fetch notebook details
  const { data: notebook } = useQuery({
    queryKey: ["notebook", id],
    queryFn: async () => {
      const res = await apiClient.get<{ notebook: any }>(
        `/api/notebooks/${id}`,
      );
      return res.data.notebook;
    },
    enabled: !!id,
  });

  const notebookTitle = notebook?.name || "Notebook Detail";

  // Fetch sources list
  const { data: sources = [] } = useQuery({
    queryKey: ["sources", id],
    queryFn: async () => {
      const res = await apiClient.get<any[]>(`/api/notebooks/${id}/sources`);
      return res.data;
    },
    enabled: !!id,
  });

  // Delete Source Mutation
  const deleteSourceMutation = useMutation({
    mutationFn: async (sourceId: string) => {
      await apiClient.delete(`/api/notebooks/${id}/sources/${sourceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sources", id] });
      queryClient.invalidateQueries({ queryKey: ["notebook", id] });
    },
    onError: (err) => {
      console.error(err);
      Alert.alert("Error", "Failed to delete source");
    },
  });

  // Re-index Source Mutation
  const reindexSourceMutation = useMutation({
    mutationFn: async (sourceId: string) => {
      await apiClient.post(`/api/notebooks/${id}/sources/${sourceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sources", id] });
      queryClient.invalidateQueries({ queryKey: ["notebook", id] });
      Alert.alert("Success", "Source queued for re-indexing!");
    },
    onError: (err: any) => {
      console.error(err);
      Alert.alert("Error", err.response?.data?.error || "Failed to re-index source");
    },
  });

  const handleSourceActions = (source: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

    Alert.alert(
      "Source Actions",
      `Choose an action for "${source.name}"`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Re-index (Sync to Vector DB)",
          onPress: () => reindexSourceMutation.mutate(source._id),
        },
        {
          text: "Delete Source",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Confirm Delete",
              `Are you sure you want to delete "${source.name}"? This cannot be undone.`,
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => deleteSourceMutation.mutate(source._id),
                },
              ]
            );
          },
        },
      ],
    );
  };

  const containerInsetStyle = { paddingTop: insets.top };
  const scrollContentStyle = { paddingBottom: 100 };

  return (
    <View style={[styles.container, containerInsetStyle]}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace(`/notebook/${id}` as any);
            }
          }}
          style={({ pressed }) => [
            styles.headerButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Ionicons name="arrow-back" size={24} color="#117864" />
        </Pressable>

        <Text numberOfLines={1} style={styles.headerTitle}>
          {notebookTitle}
        </Text>

        <View style={styles.headerRight}>
          <Pressable
            onPress={() => router.push(`/notebook/${id}` as any)}
            style={({ pressed }) => [
              styles.headerButton,
              styles.chatIcon,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={22}
              color="#117864"
            />
          </Pressable>
          <Pressable
            onPress={() => alert("Invite collaborators")}
            style={({ pressed }) => [
              styles.headerButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons name="person-add-outline" size={22} color="#117864" />
          </Pressable>
        </View>
      </View>

      {/*  MAIN SOURCE LIST AREA */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={scrollContentStyle}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sources</Text>
          <Pressable onPress={() => alert("Select mode")}>
            <Text style={styles.selectText}>Select</Text>
          </Pressable>
        </View>

        <View style={styles.sourcesList}>
          {sources.map((source: any) => (
            <SourceCard
              key={source._id}
              source={source}
              onLongPress={handleSourceActions}
            />
          ))}
        </View>

        {/* Action Button to Open Drawer */}
        <Pressable
          onPress={() => setDrawerVisible(true)}
          style={({ pressed }) => [
            styles.addNewButton,
            pressed && styles.addNewButtonPressed,
          ]}
        >
          <Ionicons name="add" size={18} color="#005d4d" />
          <Text style={styles.addNewButtonText}>Add New Source</Text>
        </Pressable>

        {/* Chat with AI Button */}
        <Button
          onPress={() => router.push(`/notebook/${id}` as any)}
          style={styles.chatButton}
        >
          <Ionicons name="chatbubbles-outline" size={18} color="#ffffff" />
          <Text style={styles.chatButtonLabel}>Chat with Assistant</Text>
        </Button>
      </ScrollView>

      {/* ADD SOURCE DRAWERS SUB-COMPONENT */}
      <AddSourceDrawers
        isOpen={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </View>
  );
}
