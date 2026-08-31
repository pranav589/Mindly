import BottomSheet from "@/components/BottomSheet";
import { useCustomAlert } from "@/context/CustomAlertContext";
import { useSSE } from "@/context/SSEContext";
import { apiClient } from "@/services/api";
import { theme } from "@/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import * as Haptics from "expo-haptics";
import { useNetworkState } from "expo-network";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MessageRow } from "./MessageRow/MessageRow";
import { styles } from "./NotebookChat.styles";
import { CitationData, Message } from "./types";
import { TypingRow } from "./TypingRow/TypingRow";

const EMPTY_STATE = [
  {
    text: "Summarize the key topics",
    icon: "document-text-outline" as const,
    bg: theme.colors.greenLight,
    iconBg: theme.colors.greenLightIcon,
    color: theme.colors.primary,
  },
  {
    text: "Generate 5 practice questions",
    icon: "help-circle-outline" as const,
    bg: theme.colors.yellowLight,
    iconBg: theme.colors.yellowLightIcon,
    color: theme.colors.onboardingTertiary,
  },
  {
    text: "Explain the main concepts simply",
    icon: "bulb-outline" as const,
    bg: theme.colors.blueLight,
    iconBg: theme.colors.blueLightIcon,
    color: theme.colors.accentBlue,
  },
  {
    text: "Find the most important keywords",
    icon: "key-outline" as const,
    bg: theme.colors.orangeLight,
    iconBg: theme.colors.orangeLightIcon,
    color: theme.colors.studioOrange,
  },
];

// ── Main Component ─────────────────────────────────────────────────────────────
export function NotebookChat() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { showAlert } = useCustomAlert();

  const networkState = useNetworkState();
  const isOffline = networkState.isConnected === false;

  const [messageText, setMessageText] = useState("");
  const { isTyping, setIsTyping, streamingText, setStreamingText, lastEvent } =
    useSSE();

  const [isRecording, setIsRecording] = useState(false);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const isBusyRef = useRef(false);
  const startTimeRef = useRef<number>(0);

  const toggleRecording = async () => {
    if (isBusyRef.current || isOffline) return;
    isBusyRef.current = true;

    try {
      if (!isRecording) {
        const { status } = await requestRecordingPermissionsAsync();
        if (status !== "granted") {
          showAlert({
            title: "Permission Required",
            message: "Microphone permission is required to record audio.",
            type: "warning",
          });
          return;
        }

        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });

        await recorder.prepareToRecordAsync();
        recorder.record();

        startTimeRef.current = Date.now();
        setIsRecording(true);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(
          () => {},
        );
      } else {
        setIsRecording(false);

        const elapsed = Date.now() - startTimeRef.current;
        if (elapsed < 800) {
          await new Promise((r) => setTimeout(r, 800 - elapsed));
        }

        await recorder.stop();

        await new Promise((resolve) => setTimeout(resolve, 300));

        const uri = recorder.uri;
        if (uri) {
          await uploadAudioAndTranscribe(uri);
        }

        await setAudioModeAsync({ allowsRecording: false }).catch(() => {});
      }
    } catch (err) {
      console.error("Failed to stop recording:", err);
      await setAudioModeAsync({ allowsRecording: false }).catch(() => {});
      setIsRecording(false);
    } finally {
      isBusyRef.current = false;
    }
  };

  const uploadAudioAndTranscribe = async (uri: string) => {
    try {
      setIsTyping(true);
      const formData = new FormData();
      const filename = uri.split("/").pop() || "recording.wav";
      const match = /\.(\w+)$/.exec(filename);
      const ext = match ? match[1].toLowerCase() : "wav";
      const mimeMap: Record<string, string> = {
        m4a: "audio/mp4",
        mp4: "audio/mp4",
        mp3: "audio/mpeg",
        ogg: "audio/ogg",
        wav: "audio/wav",
      };
      const type = mimeMap[ext] ?? `audio/${ext}`;

      const cleanUri = uri.startsWith("file://")
        ? uri
        : uri.startsWith("file:/")
          ? uri.replace("file:/", "file:///")
          : `file://${uri}`;

      // console.log("Transcribing audio file:", {
      //   originalUri: uri,
      //   cleanUri,
      //   type,
      //   filename,
      // });

      formData.append("file", {
        uri: cleanUri,
        name: filename,
        type,
      } as any);

      const res = await apiClient.post<{ text: string }>(
        "/api/transcribe",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      let sentQuery = false;
      if (res.data?.text) {
        sendMessage(res.data.text);
        sentQuery = true;
      }
      if (!sentQuery) {
        setIsTyping(false);
      }
    } catch (err) {
      console.error("Failed to transcribe audio:", err);
      showAlert({
        title: "Error",
        message: "Failed to transcribe audio. Please try again.",
        type: "error",
      });
      setIsTyping(false);
    }
  };

  const [citationSheetOpen, setCitationSheetOpen] = useState(false);
  const [menuSheetOpen, setMenuSheetOpen] = useState(false);

  const [activeCitation, setActiveCitation] = useState<CitationData | null>(
    null,
  );

  const [messages, setMessages] = useState<Message[]>([]);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [behavior, setBehavior] = useState<"padding" | "height" | undefined>(
    Platform.OS === "ios" ? "padding" : undefined,
  );

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardVisible(true);
      if (Platform.OS === "android") {
        setBehavior("padding");
      }
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardVisible(false);
      if (Platform.OS === "android") {
        setBehavior(undefined);
      }
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

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

  // Fetch chat history
  const { data: historyData, isLoading: isHistoryLoading } = useQuery({
    queryKey: ["messages", id],
    queryFn: async () => {
      const res = await apiClient.get<any[]>(`/api/notebooks/${id}/messages`);
      return res.data;
    },
    enabled: !!id,
  });

  // Sync database messages with local view state
  useEffect(() => {
    if (historyData) {
      const formatted = historyData.map((m: any) => ({
        id: m._id,
        sender: m.role === "user" ? ("user" as const) : ("ai" as const),
        text: m.content,
        citations: m.sources, // Full sources array
      }));
      setMessages([...formatted].reverse());
    }
  }, [historyData]);

  // Optimistically append complete AI responses from SSE to messages state immediately,
  // falling back to standard refetch for older backends.
  useEffect(() => {
    if (!lastEvent) return;
    const { event } = lastEvent;
    console.log(
      `⚡ [UI LASTEVENT EFFECT] Received event: ${event.type} at: ${new Date().toISOString()}`,
    );

    if (event.type === "query:complete") {
      if (event.content) {
        const newMsg: Message = {
          id: event.messageId || Math.random().toString(),
          sender: "ai",
          text: event.content,
          citations: event.sources,
        };
        // Check if message is already appended to prevent duplicates
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [newMsg, ...prev];
        });

        // Refetch query in the background silently
        queryClient.invalidateQueries({ queryKey: ["messages", id] });
      } else {
        // Fallback: older backend behavior
        queryClient.invalidateQueries({ queryKey: ["messages", id] });
      }
    }
  }, [lastEvent, id, queryClient]);

  const sendQueryMutation = useMutation({
    mutationFn: async (queryText: string) => {
      const clientMessageId = Math.random().toString();
      await apiClient.post("/api/query", {
        query: queryText,
        notebookId: id,
        clientMessageId,
      });
    },
  });

  const handleCitationClick = useCallback((citation: any) => {
    const sourceName =
      citation.source || citation.sourceName || "Unknown Source";
    const pageVal =
      citation.metadata?.page ||
      citation.metadata?.pageNumber ||
      citation.pageNumber;
    const page = pageVal ? `Page ${pageVal}` : "Unknown Page";
    const text = citation.text || citation.content || "";

    setActiveCitation({
      id: citation.id || citation.index || Math.random().toString(),
      sourceName,
      page,
      context: text,
      highlightedText: "",
    });
    setCitationSheetOpen(true);
  }, []);

  const sendMessage = (text: string) => {
    if (text.trim() === "") return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text,
    };

    setMessages((prev) => [userMsg, ...prev]);
    setIsTyping(true);
    setStreamingText("");

    sendQueryMutation.mutate(text);
  };

  const handleSend = () => {
    if (messageText.trim() === "") return;
    sendMessage(messageText);
    setMessageText("");
  };

  const renderItem = useCallback(
    ({ item }: { item: Message }) => {
      return <MessageRow msg={item} onCitationClick={handleCitationClick} />;
    },
    [handleCitationClick],
  );

  const keyExtractor = useCallback((item: Message) => item.id, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* TOP HEADER */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.replace("/(tabs)" as any)}
          style={({ pressed }) => [
            styles.headerButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text numberOfLines={1} style={styles.headerTitleText}>
            Mindly Assistant
          </Text>
          <Text style={styles.headerSubtitleText}>{notebookTitle}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* CHAT MESSAGES CONTAINER */}
      <KeyboardAvoidingView
        behavior={behavior}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        style={styles.chatWrapper}
      >
        {isHistoryLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text
              style={{
                marginTop: 12,
                color: theme.colors.textSecondary,
                fontSize: 14,
              }}
            >
              Loading messages...
            </Text>
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateHeader}>
              <Ionicons
                name="chatbubbles-outline"
                size={48}
                color={theme.colors.primary}
              />
              <Text style={styles.emptyStateTitle}>
                How can I help you today?
              </Text>
              <Text style={styles.emptyStateSubtitle}>
                Ask a question about your sources, request a summary, or quiz
                yourself.
              </Text>
            </View>
            <View style={styles.suggestionsContainer}>
              {EMPTY_STATE.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={() => sendMessage(item.text)}
                  style={({ pressed }) => [
                    styles.suggestionCard,
                    { backgroundColor: item.bg },
                    pressed && styles.suggestionCardPressed,
                  ]}
                >
                  <View
                    style={[
                      styles.suggestionCardIcon,
                      { backgroundColor: item.iconBg },
                    ]}
                  >
                    <Ionicons name={item.icon} size={18} color={item.color} />
                  </View>
                  <Text numberOfLines={3} style={styles.suggestionCardText}>
                    {item.text}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            data={messages}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={{ paddingTop: 24, paddingBottom: 24 }}
            showsVerticalScrollIndicator={true}
            style={styles.chatScroll}
            inverted={true}
            ListHeaderComponent={
              isRecording ? (
                <TypingRow streamingText="" isListening={true} />
              ) : isTyping ? (
                <TypingRow streamingText={streamingText} />
              ) : null
            }
            initialNumToRender={30}
            windowSize={11}
          />
        )}

        {/* INPUT PANEL */}
        <View
          style={[
            styles.inputPanel,
            {
              paddingBottom: isKeyboardVisible ? 12 : 10,
            },
          ]}
        >
          <View style={styles.inputRow}>
            <Pressable
              onPress={() => setMenuSheetOpen(true)}
              style={({ pressed }) => [
                styles.inputAddButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Ionicons
                name="add"
                size={22}
                color={theme.colors.textSecondary}
              />
            </Pressable>

            <TextInput
              value={messageText}
              onChangeText={setMessageText}
              placeholder={
                isOffline
                  ? "Chat is disabled offline"
                  : "Ask about this document..."
              }
              editable={!isOffline}
              style={[styles.textInput, isOffline && { opacity: 0.5 }]}
              placeholderTextColor={theme.colors.placeholder}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />

            {messageText.trim() === "" ? (
              <Pressable
                onPress={toggleRecording}
                disabled={isTyping || isOffline}
                style={({ pressed }) => [
                  styles.inputMicButton,
                  (pressed || isRecording) && {
                    backgroundColor: "rgba(17, 120, 100, 0.15)",
                    borderRadius: 18,
                  },
                  (isTyping || isOffline) && { opacity: 0.4 },
                ]}
              >
                <Ionicons
                  name={isRecording ? "mic" : "mic-outline"}
                  size={20}
                  color={
                    isRecording
                      ? theme.colors.primary
                      : theme.colors.textSecondary
                  }
                />
              </Pressable>
            ) : (
              <Pressable
                onPress={handleSend}
                disabled={isOffline}
                style={({ pressed }) => [
                  styles.inputSendButton,
                  pressed && !isOffline && styles.inputSendButtonPressed,
                  isOffline && { opacity: 0.4 },
                ]}
              >
                <Ionicons
                  name="arrow-up"
                  size={18}
                  color={theme.colors.textLight}
                />
              </Pressable>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* CITATION BOTTOM SHEET */}
      <BottomSheet
        isOpen={citationSheetOpen}
        onClose={() => setCitationSheetOpen(false)}
        title="Source Reference"
      >
        {activeCitation && (
          <View style={styles.citationSheetContent}>
            {/* Source Meta info */}
            <View style={styles.citationMetaCard}>
              <Ionicons
                name="document-text-outline"
                size={16}
                color={theme.colors.primary}
              />
              <View>
                <Text style={styles.citationMetaTitle}>
                  {activeCitation.sourceName}
                </Text>
                <Text style={styles.citationMetaSubtitle}>
                  {activeCitation.page}
                </Text>
              </View>
            </View>

            {/* Context snippet with highlight */}
            <View style={styles.citationContextCard}>
              <Text style={styles.citationContextText}>
                {activeCitation.context}
                <Text style={styles.highlightText}>
                  {activeCitation.highlightedText}
                </Text>
              </Text>
            </View>

            {/* Actions inside sheet */}
            <View style={styles.citationActionsRow}>
              <Pressable
                onPress={() => {
                  setCitationSheetOpen(false);
                  showAlert({
                    title: "Coming Soon",
                    message: "The full source reader is coming soon!",
                    type: "info",
                  });
                }}
                style={({ pressed }) => [
                  styles.citationPrimaryButton,
                  pressed && styles.citationPrimaryButtonPressed,
                ]}
              >
                <Text style={styles.citationPrimaryButtonText}>
                  Open Full Source
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setCitationSheetOpen(false)}
                style={({ pressed }) => [
                  styles.citationSecondaryButton,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Text style={styles.citationSecondaryButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        )}
      </BottomSheet>

      {/* OPTIONS MENU BOTTOM SHEET */}
      <BottomSheet
        isOpen={menuSheetOpen}
        onClose={() => setMenuSheetOpen(false)}
        title="Notebook Options"
      >
        <View style={styles.menuSheetContent}>
          {/* Option: Sources */}
          <Pressable
            onPress={() => {
              setMenuSheetOpen(false);
              router.push(`/notebook/${id}/sources` as any);
            }}
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.menuItemPressed,
            ]}
          >
            <View style={[styles.menuIconContainer, styles.menuIconSources]}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuItemTitle}>Sources</Text>
              <Text style={styles.menuItemSubtitle}>
                Manage PDFs, links, and documents
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={theme.colors.textMuted}
            />
          </Pressable>

          {/* Option: Studio Hub */}
          <Pressable
            onPress={() => {
              setMenuSheetOpen(false);
              router.push(`/notebook/${id}/studio` as any);
            }}
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.menuItemPressed,
            ]}
          >
            <View style={[styles.menuIconContainer, styles.menuIconStudio]}>
              <Ionicons
                name="musical-notes-outline"
                size={20}
                color={theme.colors.onboardingTertiary}
              />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuItemTitle}>Studio Hub</Text>
              <Text style={styles.menuItemSubtitle}>
                Generate podcasts, quizzes, flashcards, mindmaps & roadmaps
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={theme.colors.textMuted}
            />
          </Pressable>

          {/* Option: Invite Collaborators */}
          <Pressable
            onPress={() => {
              setMenuSheetOpen(false);
              setTimeout(() => {
                showAlert({
                  title: "Coming Soon",
                  message: "Collaboration features are coming soon!",
                  type: "info",
                });
              }, 300);
            }}
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.menuItemPressed,
            ]}
          >
            <View style={[styles.menuIconContainer, styles.menuIconInvite]}>
              <Ionicons
                name="person-add-outline"
                size={20}
                color={theme.colors.mutedGrayIcon}
              />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuItemTitle}>Invite Collaborators</Text>
              <Text style={styles.menuItemSubtitle}>
                Share and work together on this notebook
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={theme.colors.textMuted}
            />
          </Pressable>
        </View>
      </BottomSheet>
    </View>
  );
}
