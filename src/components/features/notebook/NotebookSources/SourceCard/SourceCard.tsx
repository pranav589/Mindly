import { theme } from "@/theme/themes";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { styles } from "./SourceCard.styles";

const TYPE_ICONS: Record<
  string,
  { library: "Ionicons" | "MaterialIcons"; name: string }
> = {
  pdf: { library: "MaterialIcons", name: "picture-as-pdf" },
  youtube: { library: "Ionicons", name: "play-circle-outline" },
  image: { library: "Ionicons", name: "image-outline" },
  video: { library: "Ionicons", name: "videocam-outline" },
  text: { library: "Ionicons", name: "document-text-outline" },
  transcript: { library: "Ionicons", name: "document-text-outline" },
};

interface SourceCardProps {
  source: any;
  onPress: () => void;
  onLongPress: (source: any) => void;
}

export function SourceCard({ source, onPress, onLongPress }: SourceCardProps) {
  const isProcessing =
    source.status === "processing" || source.status === "indexing";

  const iconConfig = TYPE_ICONS[source.type] || {
    library: "Ionicons",
    name: "link-outline",
  };
  const IconComponent =
    iconConfig.library === "MaterialIcons" ? MaterialIcons : Ionicons;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={() => onLongPress(source)}
      style={[styles.sourceCard, isProcessing && styles.processingCard]}
    >
      {/* Type Icon */}
      <View style={styles.typeIconContainer}>
        <IconComponent
          name={iconConfig.name as any}
          size={20}
          color={theme.colors.textSecondary}
        />
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
        <ActivityIndicator size="small" color={theme.colors.primary} />
      ) : source.status === "failed" ? (
        <Ionicons name="close-circle" size={20} color={theme.colors.textError} />
      ) : null}
    </Pressable>
  );
}
