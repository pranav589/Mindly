import { theme } from "@/theme/themes";
import Button from "@/components/Button";
import { apiClient } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useCustomAlert } from "@/context/CustomAlertContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddSourceDrawers } from "@/components/AddSourceDrawers/AddSourceDrawers";
import { styles } from "./NotebookSources.styles";
import { SourceCard } from "./SourceCard/SourceCard";

export function NotebookSources() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { showAlert } = useCustomAlert();

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
      showAlert({
        title: "Error",
        message: "Failed to delete source",
        type: "error",
      });
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
      showAlert({
        title: "Success",
        message: "Source queued for sync!",
        type: "success",
      });
    },
    onError: (err: any) => {
      console.error(err);
      showAlert({
        title: "Error",
        message: err.response?.data?.error || "Failed to sync source",
        type: "error",
      });
    },
  });

  const handleSourceActions = (source: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

    showAlert({
      title: "Source Actions",
      message: `Choose an action for "${source.name}"`,
      type: "info",
      buttons: [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sync Source",
          onPress: () => reindexSourceMutation.mutate(source._id),
        },
        {
          text: "Delete Source",
          style: "destructive",
          onPress: () => {
            showAlert({
              title: "Confirm Delete",
              message: `Are you sure you want to delete "${source.name}"? This cannot be undone.`,
              type: "warning",
              buttons: [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => deleteSourceMutation.mutate(source._id),
                },
              ]
            });
          },
        },
      ],
    });
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(`/notebook/${id}` as any);
    }
  };

  const handleNavigateToChat = () => {
    router.push(`/notebook/${id}` as any);
  };

  const handleShowCollaborationAlert = () => {
    showAlert({
      title: "Coming Soon",
      message: "Collaboration features are coming soon!",
      type: "info",
    });
  };

  const handleOpenDrawer = () => setDrawerVisible(true);
  const handleCloseDrawer = () => setDrawerVisible(false);

  const handleSourcePress = (source: any) => {
    if (source.status === "completed") {
      router.push(`/notebook/${id}/source-viewer?sourceId=${source._id}` as any);
    } else if (source.status === "failed") {
      showAlert({
        title: "Sync Failed",
        message: `Error: ${source.error || "Unknown error occurred"}`,
        type: "error",
      });
    } else {
      showAlert({
        title: "Syncing",
        message: "This source is currently being indexed. Please wait until it's finished.",
        type: "info",
      });
    }
  };

  const containerInsetStyle = { paddingTop: insets.top };
  const scrollContentStyle = { paddingBottom: 100 };

  return (
    <View style={[styles.container, containerInsetStyle]}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable
          onPress={handleGoBack}
          style={({ pressed }) => [
            styles.headerButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </Pressable>

        <Text numberOfLines={1} style={styles.headerTitle}>
          {notebookTitle}
        </Text>

        <View style={styles.headerRight}>
          <Pressable
            onPress={handleNavigateToChat}
            style={({ pressed }) => [
              styles.headerButton,
              styles.chatIcon,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={22}
              color={theme.colors.primary}
            />
          </Pressable>
          <Pressable
            onPress={handleShowCollaborationAlert}
            style={({ pressed }) => [
              styles.headerButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons name="person-add-outline" size={22} color={theme.colors.primary} />
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
          <Pressable
            onPress={handleOpenDrawer}
            style={({ pressed }) => [
              styles.sectionAddButton,
              pressed && styles.sectionAddButtonPressed,
            ]}
          >
            <Ionicons name="add" size={20} color={theme.colors.primary} />
          </Pressable>
        </View>

        <View style={styles.sourcesList}>
          {sources.map((source: any) => (
            <SourceCard
              key={source._id}
              source={source}
              onPress={() => handleSourcePress(source)}
              onLongPress={handleSourceActions}
            />
          ))}
        </View>

        {/* Action Button to Open Drawer */}
        <Pressable
          onPress={handleOpenDrawer}
          style={({ pressed }) => [
            styles.addNewButton,
            pressed && styles.addNewButtonPressed,
          ]}
        >
          <Ionicons name="add" size={18} color={theme.colors.primaryDark} />
          <Text style={styles.addNewButtonText}>Add New Source</Text>
        </Pressable>

        {/* Chat with AI Button */}
        <Button
          onPress={handleNavigateToChat}
          style={styles.chatButton}
        >
          <Ionicons name="chatbubbles-outline" size={18} color={theme.colors.textLight} />
          <Text style={styles.chatButtonLabel}>Chat with Assistant</Text>
        </Button>
      </ScrollView>

      {/* ADD SOURCE DRAWERS SUB-COMPONENT */}
      <AddSourceDrawers
        isOpen={drawerVisible}
        onClose={handleCloseDrawer}
      />
    </View>
  );
}
