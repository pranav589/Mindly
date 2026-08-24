import { theme } from "@/theme/themes";
import BottomSheet from "@/components/BottomSheet";
import { useSSE } from "@/context/SSEContext";
import { apiClient } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
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

// ── Main Component ─────────────────────────────────────────────────────────────
export function NotebookChat() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [messageText, setMessageText] = useState("");
  const { isTyping, setIsTyping, streamingText, setStreamingText, lastEvent } =
    useSSE();

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

  const handleSend = () => {
    if (messageText.trim() === "") return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: messageText,
    };

    setMessages((prev) => [userMsg, ...prev]);
    setIsTyping(true);
    setStreamingText("");

    sendQueryMutation.mutate(messageText);
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
            Luma Assistant
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
            <Text style={{ marginTop: 12, color: theme.colors.textSecondary, fontSize: 14 }}>
              Loading messages...
            </Text>
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
              isTyping ? <TypingRow streamingText={streamingText} /> : null
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
              <Ionicons name="add" size={22} color={theme.colors.textSecondary} />
            </Pressable>

            <TextInput
              value={messageText}
              onChangeText={setMessageText}
              placeholder="Ask about this document..."
              style={styles.textInput}
              placeholderTextColor={theme.colors.placeholder}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />

            {messageText.trim() === "" ? (
              <Pressable
                onPress={() => alert("Voice input")}
                style={({ pressed }) => [
                  styles.inputMicButton,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Ionicons name="mic-outline" size={20} color={theme.colors.textSecondary} />
              </Pressable>
            ) : (
              <Pressable
                onPress={handleSend}
                style={({ pressed }) => [
                  styles.inputSendButton,
                  pressed && styles.inputSendButtonPressed,
                ]}
              >
                <Ionicons name="arrow-up" size={18} color={theme.colors.textLight} />
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
                  alert("Opening full source reader...");
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
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} />
          </Pressable>

          {/* Option: Audio Studio */}
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
              <Text style={styles.menuItemTitle}>Audio Studio</Text>
              <Text style={styles.menuItemSubtitle}>
                Listen to AI-generated podcasts & overviews
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} />
          </Pressable>

          {/* Option: Invite Collaborators */}
          <Pressable
            onPress={() => {
              setMenuSheetOpen(false);
              setTimeout(() => {
                alert("Invite collaborators");
              }, 300);
            }}
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.menuItemPressed,
            ]}
          >
            <View style={[styles.menuIconContainer, styles.menuIconInvite]}>
              <Ionicons name="person-add-outline" size={20} color={theme.colors.mutedGrayIcon} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuItemTitle}>Invite Collaborators</Text>
              <Text style={styles.menuItemSubtitle}>
                Share and work together on this notebook
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} />
          </Pressable>
        </View>
      </BottomSheet>
    </View>
  );
}
