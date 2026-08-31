import React from "react";
import { Pressable, Text, View, ActivityIndicator } from "react-native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { theme } from "@/theme/themes";
import { styles } from "./UploadDetailsForm.styles";

interface UploadDetailsFormProps {
  name: string;
  description: string;
  onChangeName: (text: string) => void;
  onChangeDescription: (text: string) => void;
  onSubmit: () => void;
  isPending: boolean;
}

export function UploadDetailsForm({
  name,
  description,
  onChangeName,
  onChangeDescription,
  onSubmit,
  isPending,
}: UploadDetailsFormProps) {
  return (
    <View>
      <Text style={styles.formLabel}>Source Name</Text>
      <BottomSheetTextInput
        placeholder="Name your source"
        placeholderTextColor={theme.colors.textMuted}
        value={name}
        onChangeText={onChangeName}
        style={styles.drawerInput}
      />

      <Text style={styles.formLabel}>Description (Optional)</Text>
      <BottomSheetTextInput
        placeholder="Describe the content..."
        placeholderTextColor={theme.colors.textMuted}
        value={description}
        onChangeText={onChangeDescription}
        style={styles.drawerInputContent}
        multiline={true}
        numberOfLines={4}
        textAlignVertical="top"
      />

      <Pressable
        onPress={onSubmit}
        disabled={isPending}
        style={({ pressed }) => [
          styles.drawerSubmitButton,
          { opacity: (pressed || isPending) ? 0.7 : 1 },
        ]}
      >
        {isPending ? (
          <ActivityIndicator color={theme.colors.textLight} size="small" />
        ) : (
          <Text style={styles.drawerSubmitButtonText}>Add to Notebook</Text>
        )}
      </Pressable>
    </View>
  );
}
