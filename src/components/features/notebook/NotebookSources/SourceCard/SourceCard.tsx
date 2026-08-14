import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { styles } from "./SourceCard.styles";

interface SourceCardProps {
  source: any;
  onLongPress: (source: any) => void;
}

export function SourceCard({ source, onLongPress }: SourceCardProps) {
  const isProcessing =
    source.status === "processing" || source.status === "indexing";

  return (
    <Pressable
      onLongPress={() => onLongPress(source)}
      style={[styles.sourceCard, isProcessing && styles.processingCard]}
    >
      {/* Type Icon */}
      <View style={styles.typeIconContainer}>
        {source.type === "pdf" ? (
          <MaterialIcons name="picture-as-pdf" size={20} color="#6e7a75" />
        ) : source.type === "youtube" ? (
          <Ionicons name="play-circle-outline" size={20} color="#6e7a75" />
        ) : source.type === "image" ? (
          <Ionicons name="image-outline" size={20} color="#6e7a75" />
        ) : (
          <Ionicons name="link-outline" size={20} color="#6e7a75" />
        )}
      </View>

      {/* Source Details */}
      <View style={styles.sourceDetails}>
        <Text numberOfLines={1} style={styles.sourceName}>
          {source.name}
        </Text>
        <Text
          style={[
            styles.sourceTime,
            isProcessing
              ? styles.sourceStatusSyncing
              : source.status === "failed"
                ? styles.sourceStatusFailed
                : styles.sourceStatusSynced,
          ]}
        >
          {isProcessing
            ? "Syncing..."
            : source.status === "failed"
              ? "Failed to index"
              : `Synced ${new Date(source.createdAt).toLocaleDateString()}`}
        </Text>
      </View>

      {/* Status Indicator */}
      {isProcessing ? (
        <ActivityIndicator size="small" color="#117864" />
      ) : source.status === "failed" ? (
        <Ionicons name="close-circle" size={20} color="#dc2626" />
      ) : (
        <Ionicons name="checkmark-circle" size={20} color="#117864" />
      )}
    </Pressable>
  );
}
