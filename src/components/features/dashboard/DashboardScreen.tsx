import { theme } from "@/theme/themes";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
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
import BottomSheet from "@/components/BottomSheet";
import { apiClient } from "@/services/api";
import { getStyles } from "./DashboardScreen.styles";

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const styles = getStyles(insets);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState("");

  const { data: notebooks = [] } = useQuery({
    queryKey: ["notebooks"],
    queryFn: async () => {
      const response = await apiClient.get<any[]>("/api/notebooks");
      return response.data;
    },
  });

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
      Alert.alert("Error", "Failed to create notebook");
    },
  });

  const handleCreateNotebook = () => {
    setNewNotebookName("");
    setCreateModalVisible(true);
  };

  const submitNewNotebook = () => {
    const trimmedName = newNotebookName.trim();
    if (!trimmedName) {
      Alert.alert("Error", "Please enter a notebook name");
      return;
    }
    setCreateModalVisible(false);
    createNotebookMutation.mutate(trimmedName);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
            }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.workspaceText}>Workspace</Text>
            <Pressable style={styles.workspaceSelector}>
              <Text style={styles.workspaceType}>Personal</Text>
              <Ionicons name="chevron-down" size={14} color={theme.colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.headerSearchButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Ionicons name="search-outline" size={22} color={theme.colors.primaryDark} />
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
            <Ionicons name="mic-outline" size={20} color={theme.colors.textSecondary} />
          </Pressable>
        </View>

        {/* RECENT NOTEBOOKS SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Notebooks</Text>
          <Pressable
            style={({ pressed }) => [
              styles.filterButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons name="filter-outline" size={20} color={theme.colors.textSecondary} />
          </Pressable>
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
                      notebook.theme === "tertiary" ? theme.colors.onboardingTertiary : theme.colors.primaryDark
                    }
                  />
                </View>

                {/* Title */}
                <Text numberOfLines={2} style={styles.notebookTitle}>
                  {notebook.name}
                </Text>
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
              <Ionicons name="add" size={24} color={theme.colors.textSecondary} />
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
        {/* Action Buttons */}
        <Pressable
          onPress={() => {
            setDrawerVisible(false);
            handleCreateNotebook();
          }}
          style={({ pressed }) => [
            styles.drawerItem,
            pressed && styles.drawerItemPressed,
          ]}
        >
          <View
            style={[
              styles.drawerItemIconContainer,
              styles.drawerItemIconContainerPrimary,
            ]}
          >
            <Ionicons name="document-text-outline" size={20} color={theme.colors.primary} />
          </View>
          <Text style={styles.drawerItemText}>New Blank Notebook</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setDrawerVisible(false);
            alert("Importing...");
          }}
          style={({ pressed }) => [
            styles.drawerItem,
            pressed && styles.drawerItemPressed,
          ]}
        >
          <View style={styles.drawerItemIconContainer}>
            <Ionicons name="cloud-upload-outline" size={20} color={theme.colors.textSecondary} />
          </View>
          <Text style={styles.drawerItemText}>Import from Drive</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setDrawerVisible(false);
            alert("Scanning...");
          }}
          style={({ pressed }) => [
            styles.drawerItem,
            pressed && styles.drawerItemPressed,
          ]}
        >
          <View style={styles.drawerItemIconContainer}>
            <Ionicons name="scan-outline" size={20} color={theme.colors.textSecondary} />
          </View>
          <Text style={styles.drawerItemText}>Scan Document</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setDrawerVisible(false);
            alert("Sharing...");
          }}
          style={({ pressed }) => [
            styles.drawerItem,
            pressed && styles.drawerItemPressed,
          ]}
        >
          <View style={styles.drawerItemIconContainer}>
            <Ionicons name="share-social-outline" size={20} color={theme.colors.textSecondary} />
          </View>
          <Text style={styles.drawerItemText}>Share Workspace</Text>
        </Pressable>
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
