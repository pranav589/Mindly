import BottomSheet from "@/components/BottomSheet";
import { useCustomAlert } from "@/context/CustomAlertContext";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { apiClient } from "@/services/api";
import { offlineCache } from "@/services/offlineCache";
import { theme } from "@/theme/themes";
import { formatDate } from "@/utils/dates";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getStyles } from "./DashboardScreen.styles";

interface BottomSheetItem {
  id: string;
  title: string;
  icon: React.ComponentProps<typeof Ionicons>["name"] | string;
  isPrimary?: boolean;
  disabled?: boolean;
  actionType: "create" | "coming_soon";
}

const DRAWER_ITEMS: BottomSheetItem[] = [
  {
    id: "new-blank",
    title: "New Blank Notebook",
    icon: "document-text-outline",
    isPrimary: true,
    actionType: "create",
  },
  {
    id: "import-drive",
    title: "Import from Drive",
    icon: "cloud-upload-outline",
    disabled: true,
    actionType: "coming_soon",
  },
  {
    id: "scan-document",
    title: "Scan Document",
    icon: "scan-outline",
    disabled: true,
    actionType: "coming_soon",
  },
  {
    id: "share-workspace",
    title: "Share Workspace",
    icon: "share-social-outline",
    disabled: true,
    actionType: "coming_soon",
  },
];

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const styles = getStyles(insets);
  const { user } = useAuth();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const { showAlert } = useCustomAlert();
  const [newNotebookName, setNewNotebookName] = useState("");
  const [cachedNotebookIds, setCachedNotebookIds] = useState<Set<string>>(
    new Set(),
  );

  const { data: notebooks = [] } = useQuery({
    queryKey: ["notebooks", debouncedSearchQuery],
    queryFn: async () => {
      try {
        const url = debouncedSearchQuery
          ? `/api/notebooks?q=${encodeURIComponent(debouncedSearchQuery)}`
          : "/api/notebooks";
        const response = await apiClient.get<any[]>(url);
        const list = response.data;
        for (const nb of list) {
          await offlineCache.cacheNotebook(nb._id, nb.name || "Notebook");
        }
        return list;
      } catch (err) {
        const cached = await offlineCache.getCachedNotebooks();
        if (cached && cached.length > 0) {
          let mapped = cached.map((c) => ({
            _id: c.notebookId,
            name: c.title,
            isOfflineOnly: true,
          }));
          if (debouncedSearchQuery) {
            const queryLower = debouncedSearchQuery.toLowerCase();
            mapped = mapped.filter((item) =>
              item.name.toLowerCase().includes(queryLower),
            );
          }
          return mapped;
        }
        throw err;
      }
    },
  });

  React.useEffect(() => {
    offlineCache.getCachedNotebooks().then((list) => {
      const ids = new Set(list.map((n) => n.notebookId));
      setCachedNotebookIds(ids);
    });
  }, [notebooks]);

  const createNotebookMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await apiClient.post("/api/notebooks", { name });
      return response.data;
    },
    onSuccess: (newNotebook) => {
      queryClient.invalidateQueries({ queryKey: ["notebooks"] });
      router.push(`/notebook/${newNotebook._id}` as any);
    },
    onError: (err) => {
      console.error(err);
      showAlert({
        title: "Error",
        message: "Failed to create notebook",
        type: "error",
      });
    },
  });

  const handleCreateNotebook = () => {
    setNewNotebookName("");
    setCreateModalVisible(true);
  };

  const submitNewNotebook = () => {
    const trimmedName = newNotebookName.trim();
    if (!trimmedName) {
      showAlert({
        title: "Error",
        message: "Please enter a notebook name",
        type: "error",
      });
      return;
    }
    setCreateModalVisible(false);
    createNotebookMutation.mutate(trimmedName);
  };

  const defaultAvatar =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80";
  const userAvatar = user?.avatarUrl || defaultAvatar;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: userAvatar,
            }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.workspaceText}>Workspace</Text>
            <Text style={styles.workspaceType}>{user?.name}</Text>
          </View>
        </View>
        <Pressable
          onPress={() => setDrawerVisible(true)}
          style={({ pressed }) => [
            styles.headerAddButton,
            pressed && styles.headerAddButtonPressed,
          ]}
        >
          <Ionicons name="add" size={24} color={theme.colors.primary} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* GLOBAL SEARCH BAR */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={20}
            color={theme.colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search notebooks, sources..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholderTextColor={theme.colors.placeholder}
          />
          <Pressable style={styles.micButton}>
            <Ionicons
              name="mic-outline"
              size={20}
              color={theme.colors.textSecondary}
            />
          </Pressable>
        </View>

        {/* RECENT NOTEBOOKS SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Notebooks</Text>
        </View>

        {/* Notebooks Grid */}
        <View style={styles.grid}>
          {notebooks.map((notebook: any) => {
            const iconBg = {
              backgroundColor: notebook.bgColor || "rgba(162, 217, 206, 0.2)",
            };
            return (
              <Pressable
                key={notebook._id}
                onPress={() => router.push(`/notebook/${notebook._id}` as any)}
                style={({ pressed }) => [
                  styles.notebookCard,
                  pressed && styles.notebookCardPressed,
                ]}
              >
                {/* Icon Container */}
                <View style={[styles.notebookIconContainer, iconBg]}>
                  <MaterialIcons
                    name={(notebook.icon || "book") as any}
                    size={20}
                    color={
                      notebook.theme === "tertiary"
                        ? theme.colors.onboardingTertiary
                        : theme.colors.primaryDark
                    }
                  />
                </View>

                {/* Title */}
                <Text numberOfLines={2} style={styles.notebookTitle}>
                  {notebook.name}
                </Text>

                <View style={styles.noteBookMetaData}>
                  <View style={styles.metaItem}>
                    <Ionicons
                      name="time-outline"
                      size={12}
                      color={theme.colors.textSecondary}
                    />
                    <Text style={styles.metaText}>
                      {formatDate(notebook.createdAt)}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons
                      name="document-text-outline"
                      size={12}
                      color={theme.colors.textSecondary}
                    />
                    <Text style={styles.metaText}>
                      {notebook.sourcesCount || 0}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}

          {/* Add Notebook Card */}
          <Pressable
            onPress={() => setDrawerVisible(true)}
            style={({ pressed }) => [
              styles.addNotebookCard,
              pressed && styles.addNotebookCardPressed,
            ]}
          >
            <View style={styles.addNotebookIconContainer}>
              <Ionicons
                name="add"
                size={24}
                color={theme.colors.textSecondary}
              />
            </View>
            <Text style={styles.addNotebookText}>Blank Notebook</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* CREATE NEW BOTTOM SHEET DRAWER */}
      <BottomSheet
        isOpen={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        title="Create New"
      >
        {DRAWER_ITEMS.map((item) => {
          const isCreate = item.actionType === "create";
          return (
            <Pressable
              key={item.id}
              disabled={item.disabled}
              onPress={
                isCreate
                  ? () => {
                      setDrawerVisible(false);
                      handleCreateNotebook();
                    }
                  : undefined
              }
              style={({ pressed }) => [
                styles.drawerItem,
                item.disabled && styles.drawerItemDisabled,
                pressed && !item.disabled && styles.drawerItemPressed,
              ]}
            >
              <View
                style={[
                  styles.drawerItemIconContainer,
                  item.isPrimary && styles.drawerItemIconContainerPrimary,
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={
                    item.isPrimary
                      ? theme.colors.primary
                      : theme.colors.textMuted
                  }
                />
              </View>
              <Text style={styles.drawerItemText}>{item.title}</Text>
              {item.disabled && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>Coming Soon</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </BottomSheet>

      {/* CREATE NOTEBOOK MODAL */}
      <Modal
        visible={createModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Notebook</Text>
            <Text style={styles.modalSubtitle}>
              Enter a name for your notebook:
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. History Exam Notes"
              placeholderTextColor={theme.colors.textMuted}
              value={newNotebookName}
              onChangeText={setNewNotebookName}
              autoFocus={true}
              onSubmitEditing={submitNewNotebook}
            />
            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => setCreateModalVisible(false)}
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.modalCancelButton,
                  pressed && styles.modalCancelButtonPressed,
                ]}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={submitNewNotebook}
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.modalCreateButton,
                  pressed && styles.modalCreateButtonPressed,
                ]}
              >
                <Text style={styles.modalCreateButtonText}>Create</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
