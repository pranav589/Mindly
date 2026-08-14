import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./NotebookStudio.styles";

export function NotebookStudio() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const studioTools = [
    {
      id: "roadmap",
      title: "Roadmap",
      subtitle: "Step-by-step path",
      icon: "map-outline",
      bg: "rgba(17, 120, 100, 0.08)",
      iconBg: "rgba(17, 120, 100, 0.15)",
      color: "#117864",
      route: `/notebook/${id}/roadmap`,
    },
    {
      id: "mindmap",
      title: "Mindmap",
      subtitle: "Visual concept web",
      icon: "git-merge-outline",
      bg: "rgba(218, 247, 166, 0.15)",
      iconBg: "rgba(218, 247, 166, 0.35)",
      color: "#42591a",
      route: `/notebook/${id}/mindmap`,
    },
    {
      id: "flashcard",
      title: "Flashcards",
      subtitle: "Active recall practice",
      icon: "albums-outline",
      bg: "rgba(59, 130, 246, 0.08)",
      iconBg: "rgba(59, 130, 246, 0.15)",
      color: "#2563eb",
      route: `/notebook/${id}/flashcard`,
    },
    {
      id: "quiz",
      title: "Quizzes",
      subtitle: "Test your knowledge",
      icon: "checkbox-outline",
      bg: "rgba(245, 158, 11, 0.08)",
      iconBg: "rgba(245, 158, 11, 0.15)",
      color: "#d97706",
      route: `/notebook/${id}/quiz`,
    },
  ];

  const containerInsetPadding = { paddingTop: insets.top };
  const scrollContentPadding = { paddingBottom: 100 };

  return (
    <View style={[styles.container, containerInsetPadding]}>
      <StatusBar style="dark" />

      {/* TOP HEADER */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.replace(`/notebook/${id}` as any)}
          style={({ pressed }) => [
            styles.headerButton,
            pressed && styles.pressedOpacity,
          ]}
        >
          <Ionicons name="arrow-back" size={24} color="#117864" />
        </Pressable>
        <Text style={styles.headerTitle}>Study Studio Hub</Text>
        <Pressable
          onPress={() => alert("Invite collaborators")}
          style={({ pressed }) => [
            styles.inviteButton,
            pressed && styles.pressedOpacity,
          ]}
        >
          <Ionicons name="person-add-outline" size={20} color="#117864" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={scrollContentPadding}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Header Area */}
        {/* <View style={styles.infoArea}>
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Biology 101</Text>
            </View>
            <Text style={styles.updatedText}>Updated 2h ago</Text>
          </View>
          <Text style={styles.titleText}>Cellular Respiration</Text>
          <Text style={styles.descriptionText}>
            Master concepts through interactive AI study formats generated from
            your source materials.
          </Text>
        </View> */}

        {/* Large Feature Card: Podcast Audio Overview */}
        <Pressable
          onPress={() => router.push(`/notebook/${id}/podcast` as any)}
          style={({ pressed }) => [
            styles.podcastCard,
            pressed && styles.podcastCardPressed,
          ]}
        >
          <View style={styles.podcastLeft}>
            <View style={styles.podcastIconContainer}>
              <Ionicons name="headset-outline" size={28} color="#ffffff" />
            </View>
            <View style={styles.podcastMeta}>
              <Text style={styles.podcastTitle}>Overview Podcast</Text>
              <Text style={styles.podcastSubtitle}>
                Listen to generated AI summaries
              </Text>
            </View>
          </View>
          <View style={styles.podcastRight}>
            <Ionicons name="play-circle" size={44} color="#117864" />
          </View>
        </Pressable>

        <Text style={styles.sectionTitle}>Study Assets</Text>

        {/* Grid Container */}
        <View style={styles.gridContainer}>
          {studioTools.map((tool) => (
            <Pressable
              key={tool.id}
              onPress={() => router.push(tool.route as any)}
              style={({ pressed }) => [
                styles.gridCard,
                { backgroundColor: tool.bg },
                pressed && styles.gridCardPressed,
              ]}
            >
              <View
                style={[
                  styles.cardIconContainer,
                  { backgroundColor: tool.iconBg },
                ]}
              >
                <Ionicons
                  name={tool.icon as any}
                  size={24}
                  color={tool.color}
                />
              </View>
              <Text style={[styles.cardTitle, { color: tool.color }]}>
                {tool.title}
              </Text>
              <Text style={styles.cardSubtitle}>{tool.subtitle}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
