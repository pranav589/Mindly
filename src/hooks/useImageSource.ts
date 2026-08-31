import { SaveFormat, useImageManipulator } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { useCustomAlert } from "@/context/CustomAlertContext";

export function useImageSource(
  notebookId: string,
  onImagePrepared: (filePayload: { uri: string; name: string; type: string }) => void
) {
  const { showAlert } = useCustomAlert();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [originalName, setOriginalName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const context = useImageManipulator(imageUri || "");

  useEffect(() => {
    if (!imageUri) return;

    const processImage = async () => {
      setIsProcessing(true);
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

        onImagePrepared(filePayload);
      } catch (err) {
        console.error("[useImageSource] Manipulation error:", err);
        showAlert({
          title: "Error",
          message: "Failed to compress captured image.",
          type: "error",
        });
      } finally {
        setImageUri(null);
        setOriginalName("");
        setIsProcessing(false);
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
        showAlert({
          title: "Permission Required",
          message: `We need permission to access your ${
            mode === "camera" ? "camera" : "photos"
          } to upload scans.`,
          type: "warning",
        });
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
      showAlert({
        title: "Error",
        message: "Failed to capture or select image.",
        type: "error",
      });
    }
  };

  return {
    uploadImageSource,
    isProcessing,
  };
}
