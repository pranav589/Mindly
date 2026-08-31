import { useCustomAlert } from "@/context/CustomAlertContext";
import { apiClient } from "@/services/api";
import { theme } from "@/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ResizeMode, Video } from "expo-av";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Clipboard,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { styles } from "./SourceViewer.styles";

export function SourceViewer() {
  const router = useRouter();
  const { id, sourceId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { showAlert } = useCustomAlert();

  const [descriptionExpanded, setDescriptionExpanded] = useState(true);

  // Fetch source metadata details
  const {
    data: source,
    isLoading: isLoadingSource,
    error: sourceError,
  } = useQuery({
    queryKey: ["source", id, sourceId],
    queryFn: async () => {
      const res = await apiClient.get<any>(
        `/api/notebooks/${id}/sources/${sourceId}`,
      );
      return res.data;
    },
    enabled: !!id && !!sourceId,
  });

  // Query to fetch raw text content for pasted text and transcript source files
  const { data: textContent, isLoading: isLoadingTextContent } = useQuery({
    queryKey: ["source-content", source?.pathOrUrl],
    queryFn: async () => {
      if (!source?.pathOrUrl) return "";
      const res = await axios.get(source.pathOrUrl);
      return res.data;
    },
    enabled:
      !!source && (source.type === "text" || source.type === "transcript"),
  });

  const handleCopyText = () => {
    if (!textContent) return;
    Clipboard.setString(textContent);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {},
    );
    showAlert({
      title: "Copied",
      message: "Source content copied to clipboard!",
      type: "success",
    });
  };

  const containerStyle = {
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
  };

  if (isLoadingSource) {
    return (
      <View style={[styles.centered, containerStyle]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading source viewer...</Text>
      </View>
    );
  }

  if (sourceError || !source) {
    return (
      <View style={[styles.centered, containerStyle]}>
        <Ionicons
          name="alert-circle"
          size={48}
          color={theme.colors.textError}
        />
        <Text style={styles.loadingText}>Failed to load source details.</Text>
        <Pressable
          onPress={() => router.back()}
          style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: theme.colors.primary,
            borderRadius: theme.borderRadius.md,
          }}
        >
          <Text style={{ color: theme.colors.textLight, fontWeight: "600" }}>
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  const renderContent = () => {
    if (!source.pathOrUrl) {
      return (
        <View style={styles.centered}>
          <Text style={styles.loadingText}>
            No path or URL is associated with this source.
          </Text>
        </View>
      );
    }

    switch (source.type) {
      case "pdf": {
        const uri =
          Platform.OS === "ios"
            ? source.pathOrUrl
            : `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
                source.pathOrUrl,
              )}`;
        return (
          <WebView
            source={{ uri }}
            style={styles.webview}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={StyleSheet.absoluteFillObject}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </View>
            )}
          />
        );
      }
      case "url":
        return (
          <WebView
            source={{ uri: source.pathOrUrl }}
            style={styles.webview}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={StyleSheet.absoluteFillObject}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </View>
            )}
          />
        );
      case "youtube": {
        const regex =
          /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\\s]{11})/;
        const match = source.pathOrUrl.match(regex);
        const videoId = match ? match[1] : null;

        if (!videoId) {
          return (
            <View style={styles.centered}>
              <Text style={styles.loadingText}>Invalid YouTube URL format</Text>
            </View>
          );
        }

        const embedUri = `https://www.youtube.com/embed/${videoId}`;
        return <WebView source={{ uri: embedUri }} style={styles.webview} />;
      }
      case "image":
        return (
          <View style={styles.imageViewer}>
            <Image
              source={{ uri: source.pathOrUrl }}
              contentFit="contain"
              style={styles.image}
            />
          </View>
        );
      case "video":
        return (
          <View style={styles.videoViewer}>
            <Video
              source={{ uri: source.pathOrUrl }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={false}
              useNativeControls
              style={styles.videoPlayer}
            />
          </View>
        );
      case "text":
      case "transcript":
        if (isLoadingTextContent) {
          return (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>
                Fetching text reader content...
              </Text>
            </View>
          );
        }
        return (
          <View style={styles.textReader}>
            <ScrollView
              style={styles.textScrollView}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.textContent}>
                {textContent || "Empty content."}
              </Text>
            </ScrollView>
            {!!textContent && (
              <Pressable onPress={handleCopyText} style={styles.copyBtn}>
                <Ionicons
                  name="copy-outline"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text style={styles.copyBtnText}>Copy Raw Content</Text>
              </Pressable>
            )}
          </View>
        );
      default:
        return (
          <View style={styles.centered}>
            <Text style={styles.loadingText}>
              Unsupported source type: {source.type}
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Header controls */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.headerButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </Pressable>

        <Text numberOfLines={1} style={styles.headerTitle}>
          {source.name}
        </Text>

        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* Collapsible Info Panel displaying source metadata/description */}
      <View style={styles.infoArea}>
        <View style={styles.infoTitleRow}>
          <Text style={styles.infoTitle}>
            Type:{" "}
            <Text style={{ textTransform: "uppercase" }}>{source.type}</Text>
          </Text>
          {!!source.description && (
            <Pressable
              onPress={() => setDescriptionExpanded(!descriptionExpanded)}
            >
              <Text style={styles.infoToggle}>
                {descriptionExpanded ? "Hide Description" : "Show Description"}
              </Text>
            </Pressable>
          )}
        </View>
        {!!source.description && descriptionExpanded && (
          <Text style={styles.descriptionText}>{source.description}</Text>
        )}
      </View>

      {/* Main viewer viewport */}
      <View style={styles.viewerContainer}>{renderContent()}</View>
    </View>
  );
}

import { StyleSheet } from "react-native";
