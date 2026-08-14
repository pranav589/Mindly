import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import BottomSheet from "@/components/BottomSheet";
import { apiClient } from "@/services/api";
import { styles } from "./AddSourceDrawers.styles";

interface AddSourceDrawersProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddSourceDrawers({ isOpen, onClose }: AddSourceDrawersProps) {
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();

  const [activeInputType, setActiveInputType] = useState<
    "pdf" | "youtube" | "web" | "text" | "camera" | "image" | null
  >(null);
  const [webUrl, setWebUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [textTitle, setTextTitle] = useState("");
  const [textContent, setTextContent] = useState("");

  const createSourceMutation = useMutation({
    mutationFn: async (payload: {
      type: string;
      name?: string;
      text?: string;
      url?: string;
      file?: any;
    }) => {
      const formData = new FormData();
      formData.append("type", payload.type);
      if (payload.name) formData.append("name", payload.name);
      if (payload.text) formData.append("text", payload.text);
      if (payload.url) formData.append("url", payload.url);
      if (payload.file) {
        formData.append("file", payload.file);
      }

      const response = await apiClient.post(
        `/api/notebooks/${id}/sources`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sources", id] });
      queryClient.invalidateQueries({ queryKey: ["notebook", id] });
      // Reset inputs & close
      setWebUrl("");
      setYoutubeUrl("");
      setTextTitle("");
      setTextContent("");
      setActiveInputType(null);
      onClose();
    },
    onError: (err) => {
      console.error(err);
      Alert.alert("Error", "Failed to create source");
    },
  });

  const handlePickPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        const filePayload = {
          uri: asset.uri,
          name: asset.name || "document.pdf",
          type: asset.mimeType || "application/pdf",
        };

        onClose();

        createSourceMutation.mutate({
          type: "pdf",
          file: filePayload,
        });
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "Failed to select document");
    }
  };

  const handlePickImage = async (mode: "camera" | "image") => {
    try {
      let permissionResult;
      if (mode === "camera") {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      } else {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          `We need permission to access your ${
            mode === "camera" ? "camera" : "photos"
          } to upload scans.`
        );
        return;
      }

      let result;
      if (mode === "camera") {
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const filename = asset.fileName || `scan-${Date.now()}.jpg`;
        const mimeType = asset.mimeType || "image/jpeg";

        const filePayload = {
          uri: asset.uri,
          name: filename,
          type: mimeType,
        };

        onClose();

        createSourceMutation.mutate({
          type: "image",
          file: filePayload,
        });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to capture or select image.");
    }
  };

  const submitWebUrl = () => {
    if (!webUrl.trim()) {
      Alert.alert("Error", "Please enter a valid URL");
      return;
    }
    createSourceMutation.mutate({
      type: "url",
      url: webUrl,
      name: webUrl.split("/").pop() || "Web URL",
    });
  };

  const submitYoutubeUrl = () => {
    if (!youtubeUrl.trim()) {
      Alert.alert("Error", "Please enter a YouTube video URL");
      return;
    }
    createSourceMutation.mutate({
      type: "youtube",
      url: youtubeUrl,
      name: youtubeUrl,
    });
  };

  const submitText = () => {
    if (!textTitle.trim() || !textContent.trim()) {
      Alert.alert("Error", "Please fill in both the title and text content");
      return;
    }
    createSourceMutation.mutate({
      type: "text",
      name: textTitle,
      text: textContent,
    });
  };

  const handleClose = () => {
    setActiveInputType(null);
    onClose();
  };

  let drawerTitle = "Add Source";
  if (activeInputType === "web") drawerTitle = "Add Web URL";
  else if (activeInputType === "youtube") drawerTitle = "Add YouTube Link";
  else if (activeInputType === "text") drawerTitle = "Paste Text Content";

  const isDrawerOpen = isOpen || activeInputType !== null;

  return (
    <BottomSheet
      isOpen={isDrawerOpen}
      onClose={handleClose}
      title={drawerTitle}
    >
      {activeInputType === null && (
        <View style={styles.sourceGrid}>
          {/* PDF button */}
          <Pressable
            onPress={handlePickPdf}
            style={({ pressed }) => [
              styles.sourceButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <View style={styles.sourceIconContainer}>
              <MaterialIcons name="picture-as-pdf" size={24} color="#117864" />
            </View>
            <Text style={styles.sourceButtonText}>Upload PDF</Text>
          </Pressable>

          {/* YouTube button */}
          <Pressable
            onPress={() => {
              setActiveInputType("youtube");
            }}
            style={({ pressed }) => [
              styles.sourceButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <View style={styles.sourceIconContainer}>
              <Ionicons name="play-circle-outline" size={24} color="#117864" />
            </View>
            <Text style={styles.sourceButtonText}>YouTube Link</Text>
          </Pressable>

          {/* Web URL button */}
          <Pressable
            onPress={() => {
              setActiveInputType("web");
            }}
            style={({ pressed }) => [
              styles.sourceButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <View style={styles.sourceIconContainer}>
              <Ionicons name="link-outline" size={24} color="#117864" />
            </View>
            <Text style={styles.sourceButtonText}>Web URL</Text>
          </Pressable>

          {/* Text button */}
          <Pressable
            onPress={() => {
              setActiveInputType("text");
            }}
            style={({ pressed }) => [
              styles.sourceButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <View style={styles.sourceIconContainer}>
              <Ionicons
                name="document-text-outline"
                size={24}
                color="#117864"
              />
            </View>
            <Text style={styles.sourceButtonText}>Paste Text</Text>
          </Pressable>

          {/* Camera scan button */}
          <Pressable
            onPress={() => handlePickImage("camera")}
            style={({ pressed }) => [
              styles.sourceButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <View style={styles.sourceIconContainer}>
              <Ionicons name="camera-outline" size={24} color="#117864" />
            </View>
            <Text style={styles.sourceButtonText}>Scan (Camera)</Text>
          </Pressable>

          {/* Gallery image button */}
          <Pressable
            onPress={() => handlePickImage("image")}
            style={({ pressed }) => [
              styles.sourceButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <View style={styles.sourceIconContainer}>
              <Ionicons name="images-outline" size={24} color="#117864" />
            </View>
            <Text style={styles.sourceButtonText}>Select Image</Text>
          </Pressable>
        </View>
      )}

      {activeInputType === "web" && (
        <View>
          <TextInput
            placeholder="https://example.com/article"
            placeholderTextColor="#9ca3af"
            value={webUrl}
            onChangeText={setWebUrl}
            style={styles.drawerInput}
            autoCapitalize="none"
            keyboardType="url"
          />
          <Pressable onPress={submitWebUrl} style={styles.drawerSubmitButton}>
            <Text style={styles.drawerSubmitButtonText}>Add Source</Text>
          </Pressable>
        </View>
      )}

      {activeInputType === "youtube" && (
        <View>
          <TextInput
            placeholder="https://youtube.com/watch?v=..."
            placeholderTextColor="#9ca3af"
            value={youtubeUrl}
            onChangeText={setYoutubeUrl}
            style={styles.drawerInput}
            autoCapitalize="none"
            keyboardType="url"
          />
          <Pressable
            onPress={submitYoutubeUrl}
            style={styles.drawerSubmitButton}
          >
            <Text style={styles.drawerSubmitButtonText}>Add Source</Text>
          </Pressable>
        </View>
      )}

      {activeInputType === "text" && (
        <View>
          <TextInput
            placeholder="Title (e.g. Lecture Notes)"
            placeholderTextColor="#9ca3af"
            value={textTitle}
            onChangeText={setTextTitle}
            style={styles.drawerInputTitle}
          />
          <TextInput
            placeholder="Paste or type content here..."
            placeholderTextColor="#9ca3af"
            value={textContent}
            onChangeText={setTextContent}
            style={styles.drawerInputContent}
            multiline={true}
            textAlignVertical="top"
          />
          <Pressable onPress={submitText} style={styles.drawerSubmitButton}>
            <Text style={styles.drawerSubmitButtonText}>Add Source</Text>
          </Pressable>
        </View>
      )}
    </BottomSheet>
  );
}
