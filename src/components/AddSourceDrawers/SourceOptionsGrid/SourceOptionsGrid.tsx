import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { theme } from "@/theme/themes";
import { styles } from "./SourceOptionsGrid.styles";

interface SourceOptionsGridProps {
  onPickPdf: () => void;
  onPickVideo: () => void;
  onSelectType: (type: "web" | "youtube" | "text") => void;
  onSelectImageSource: (mode: "camera" | "image") => void;
}

interface OptionItem {
  key: string;
  label: string;
  icon: string;
  iconLibrary: "Ionicons" | "MaterialIcons";
  onPress: () => void;
}

export function SourceOptionsGrid({
  onPickPdf,
  onPickVideo,
  onSelectType,
  onSelectImageSource,
}: SourceOptionsGridProps) {
  const options: OptionItem[] = [
    {
      key: "pdf",
      label: "Upload PDF",
      icon: "picture-as-pdf",
      iconLibrary: "MaterialIcons",
      onPress: onPickPdf,
    },
    {
      key: "youtube",
      label: "YouTube Link",
      icon: "play-circle-outline",
      iconLibrary: "Ionicons",
      onPress: () => onSelectType("youtube"),
    },
    {
      key: "web",
      label: "Web URL",
      icon: "link-outline",
      iconLibrary: "Ionicons",
      onPress: () => onSelectType("web"),
    },
    {
      key: "text",
      label: "Paste Text",
      icon: "document-text-outline",
      iconLibrary: "Ionicons",
      onPress: () => onSelectType("text"),
    },
    {
      key: "camera",
      label: "Scan (Camera)",
      icon: "camera-outline",
      iconLibrary: "Ionicons",
      onPress: () => onSelectImageSource("camera"),
    },
    {
      key: "image",
      label: "Select Image",
      icon: "images-outline",
      iconLibrary: "Ionicons",
      onPress: () => onSelectImageSource("image"),
    },
    {
      key: "video",
      label: "Upload Video",
      icon: "videocam-outline",
      iconLibrary: "Ionicons",
      onPress: onPickVideo,
    },
  ];

  return (
    <View style={styles.sourceGrid}>
      {options.map((item) => {
        const IconComponent =
          item.iconLibrary === "MaterialIcons" ? MaterialIcons : Ionicons;
        return (
          <Pressable
            key={item.key}
            onPress={item.onPress}
            style={({ pressed }) => [
              styles.sourceButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <View style={styles.sourceIconContainer}>
              <IconComponent
                name={item.icon as any}
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.sourceButtonText}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
