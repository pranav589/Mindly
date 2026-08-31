import { theme } from "@/theme/themes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { useCustomAlert } from "@/context/CustomAlertContext";
import BottomSheet from "@/components/BottomSheet";
import { useImageSource } from "@/hooks/useImageSource";
import { apiClient } from "@/services/api";

// Import split sub-components
import { SourceOptionsGrid } from "./SourceOptionsGrid/SourceOptionsGrid";
import { WebUrlInputForm } from "./WebUrlInputForm/WebUrlInputForm";
import { YoutubeUrlInputForm } from "./YoutubeUrlInputForm/YoutubeUrlInputForm";
import { TextInputForm } from "./TextInputForm/TextInputForm";
import { UploadDetailsForm } from "./UploadDetailsForm/UploadDetailsForm";

interface AddSourceDrawersProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PendingUpload {
  type: "pdf" | "youtube" | "web" | "text" | "image" | "video";
  file?: any;
  url?: string;
  text?: string;
  defaultName: string;
}

export function AddSourceDrawers({ isOpen, onClose }: AddSourceDrawersProps) {
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const { showAlert } = useCustomAlert();

  const [activeInputType, setActiveInputType] = useState<
    "pdf" | "youtube" | "web" | "text" | "camera" | "image" | "video" | null
  >(null);
  const [webUrl, setWebUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [textTitle, setTextTitle] = useState("");
  const [textContent, setTextContent] = useState("");

  const [pendingUpload, setPendingUpload] = useState<PendingUpload | null>(null);
  const [sourceName, setSourceName] = useState("");
  const [sourceDescription, setSourceDescription] = useState("");

  const onImagePrepared = (filePayload: any) => {
    const defaultName = filePayload.name ? filePayload.name.split(".")[0] : "Scan Image";
    setPendingUpload({
      type: "image",
      file: filePayload,
      defaultName,
    });
    setSourceName(defaultName);
    setSourceDescription("");
    setActiveInputType(null);
  };

  const { uploadImageSource, isProcessing: isImageProcessing } = useImageSource(
    id as string,
    onImagePrepared
  );

  const createSourceMutation = useMutation({
    mutationFn: async (payload: {
      type: string;
      name: string;
      description?: string;
      text?: string;
      url?: string;
      file?: any;
    }) => {
      const formData = new FormData();
      formData.append("type", payload.type);
      formData.append("name", payload.name);
      if (payload.description) {
        formData.append("description", payload.description);
      }
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
      setPendingUpload(null);
      setSourceName("");
      setSourceDescription("");
      setActiveInputType(null);
      onClose();
    },
    onError: (err) => {
      console.error(err);
      showAlert({
        title: "Error",
        message: "Failed to create source",
        type: "error",
      });
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

        const defaultName = asset.name ? asset.name.split(".")[0] : "Document";
        setPendingUpload({
          type: "pdf",
          file: filePayload,
          defaultName,
        });
        setSourceName(defaultName);
        setSourceDescription("");
        setActiveInputType(null);
      }
    } catch (error) {
      console.error("Error picking document:", error);
      showAlert({
        title: "Error",
        message: "Failed to select document",
        type: "error",
      });
    }
  };

  const handlePickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        const filePayload = {
          uri: asset.uri,
          name: asset.name || "video.mp4",
          type: asset.mimeType || "video/mp4",
        };

        const defaultName = asset.name ? asset.name.split(".")[0] : "Video";
        setPendingUpload({
          type: "video",
          file: filePayload,
          defaultName,
        });
        setSourceName(defaultName);
        setSourceDescription("");
        setActiveInputType(null);
      }
    } catch (error) {
      console.error("Error picking video:", error);
      showAlert({
        title: "Error",
        message: "Failed to select video file",
        type: "error",
      });
    }
  };

  const handleWebUrlNext = () => {
    if (!webUrl.trim()) {
      showAlert({
        title: "Error",
        message: "Please enter a valid URL",
        type: "error",
      });
      return;
    }
    const cleanUrl = webUrl.trim();
    let defaultName = "Web Page";
    try {
      const urlObj = new URL(cleanUrl);
      defaultName = urlObj.hostname || "Web Page";
    } catch (e) {}

    setPendingUpload({
      type: "web",
      url: cleanUrl,
      defaultName,
    });
    setSourceName(defaultName);
    setSourceDescription("");
    setActiveInputType(null);
  };

  const handleYoutubeUrlNext = () => {
    if (!youtubeUrl.trim()) {
      showAlert({
        title: "Error",
        message: "Please enter a YouTube video URL",
        type: "error",
      });
      return;
    }
    setPendingUpload({
      type: "youtube",
      url: youtubeUrl.trim(),
      defaultName: "YouTube Video",
    });
    setSourceName("YouTube Video");
    setSourceDescription("");
    setActiveInputType(null);
  };

  const handleTextNext = () => {
    if (!textTitle.trim() || !textContent.trim()) {
      showAlert({
        title: "Error",
        message: "Please fill in both the title and text content",
        type: "error",
      });
      return;
    }
    setPendingUpload({
      type: "text",
      text: textContent.trim(),
      defaultName: textTitle.trim(),
    });
    setSourceName(textTitle.trim());
    setSourceDescription("");
    setActiveInputType(null);
  };

  const submitPendingUpload = () => {
    if (!pendingUpload) return;
    if (!sourceName.trim()) {
      showAlert({
        title: "Error",
        message: "Source name is required",
        type: "error",
      });
      return;
    }

    createSourceMutation.mutate({
      type: pendingUpload.type === "web" ? "url" : pendingUpload.type,
      name: sourceName.trim(),
      description: sourceDescription.trim() || undefined,
      url: pendingUpload.url,
      text: pendingUpload.text,
      file: pendingUpload.file,
    });
  };

  const handleClose = () => {
    setActiveInputType(null);
    setPendingUpload(null);
    setSourceName("");
    setSourceDescription("");
    onClose();
  };

  let drawerTitle = "Add Source";
  if (pendingUpload !== null) {
    drawerTitle = `Source Details (${pendingUpload.type.toUpperCase()})`;
  } else if (activeInputType === "web") {
    drawerTitle = "Add Web URL";
  } else if (activeInputType === "youtube") {
    drawerTitle = "Add YouTube Link";
  } else if (activeInputType === "text") {
    drawerTitle = "Paste Text Content";
  }

  const isDrawerOpen = isOpen || activeInputType !== null || pendingUpload !== null;

  return (
    <BottomSheet
      isOpen={isDrawerOpen}
      onClose={handleClose}
      title={drawerTitle}
    >
      {isImageProcessing && (
        <View style={{ padding: 24, alignItems: "center" }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 12, color: theme.colors.textMuted }}>Processing captured image...</Text>
        </View>
      )}

      {!isImageProcessing && pendingUpload !== null && (
        <UploadDetailsForm
          name={sourceName}
          description={sourceDescription}
          onChangeName={setSourceName}
          onChangeDescription={setSourceDescription}
          onSubmit={submitPendingUpload}
          isPending={createSourceMutation.isPending}
        />
      )}

      {!isImageProcessing && pendingUpload === null && activeInputType === null && (
        <SourceOptionsGrid
          onPickPdf={handlePickPdf}
          onPickVideo={handlePickVideo}
          onSelectType={(type) => setActiveInputType(type)}
          onSelectImageSource={(mode) => uploadImageSource(mode)}
        />
      )}

      {!isImageProcessing && pendingUpload === null && activeInputType === "web" && (
        <WebUrlInputForm
          value={webUrl}
          onChangeText={setWebUrl}
          onSubmit={handleWebUrlNext}
        />
      )}

      {!isImageProcessing && pendingUpload === null && activeInputType === "youtube" && (
        <YoutubeUrlInputForm
          value={youtubeUrl}
          onChangeText={setYoutubeUrl}
          onSubmit={handleYoutubeUrlNext}
        />
      )}

      {!isImageProcessing && pendingUpload === null && activeInputType === "text" && (
        <TextInputForm
          title={textTitle}
          content={textContent}
          onChangeTitle={setTextTitle}
          onChangeContent={setTextContent}
          onSubmit={handleTextNext}
        />
      )}
    </BottomSheet>
  );
}
