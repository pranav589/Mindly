import { apiClient } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SaveFormat, useImageManipulator } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export function useImageSource(notebookId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [originalName, setOriginalName] = useState<string>("");

  const context = useImageManipulator(imageUri || "");

  const uploadMutation = useMutation({
    mutationFn: async (filePayload: {
      uri: string;
      name: string;
      type: string;
    }) => {
      const formData = new FormData();
      formData.append("type", "image");
      formData.append("file", filePayload as any);

      const response = await apiClient.post(
        `/api/notebooks/${notebookId}/sources`,
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
      queryClient.invalidateQueries({ queryKey: ["sources", notebookId] });
      queryClient.invalidateQueries({ queryKey: ["notebook", notebookId] });
      if (onSuccess) onSuccess();
    },
    onError: (err) => {
      console.error("[useImageSource] Upload error:", err);
      Alert.alert("Error", "Failed to upload image source.");
    },
  });

  useEffect(() => {
    if (!imageUri) return;

    const processImage = async () => {
      try {
        context.resize({ width: 1200 });

        const rendered = await context.renderAsync();
        const saved = await rendered.saveAsync({
          compress: 0.7,
          format: SaveFormat.JPEG,
        });

        const filename =
          originalName.toLowerCase().endsWith(".jpg") ||
          originalName.toLowerCase().endsWith(".jpeg")
            ? originalName
            : `${originalName}.jpg`;

        const filePayload = {
          uri: saved.uri,
          name: filename,
          type: "image/jpeg",
        };

        uploadMutation.mutate(filePayload);
      } catch (err) {
        console.error("[useImageSource] Manipulation error:", err);
        Alert.alert("Error", "Failed to compress captured image.");
      } finally {
        setImageUri(null);
        setOriginalName("");
      }
    };

    processImage();
  }, [imageUri]);

  const uploadImageSource = async (mode: "camera" | "image") => {
    try {
      let permissionResult;
      if (mode === "camera") {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      } else {
        permissionResult =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          `We need permission to access your ${
            mode === "camera" ? "camera" : "photos"
          } to upload scans.`,
        );
        return;
      }

      let result;
      if (mode === "camera") {
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          quality: 1, // Keep high original quality, compress explicitly in hook
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          quality: 1,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const originalAsset = result.assets[0];
        setOriginalName(originalAsset.fileName || `scan-${Date.now()}.jpg`);
        setImageUri(originalAsset.uri);
      }
    } catch (error) {
      console.error("[useImageSource] Error selecting/capturing image:", error);
      Alert.alert("Error", "Failed to capture or select image.");
    }
  };

  return {
    uploadImageSource,
    isUploading: uploadMutation.isPending || !!imageUri,
    error: uploadMutation.error,
  };
}
