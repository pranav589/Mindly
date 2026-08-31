import React from "react";
import { Pressable, Text, View } from "react-native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { theme } from "@/theme/themes";
import { styles } from "./TextInputForm.styles";

interface TextInputFormProps {
  title: string;
  content: string;
  onChangeTitle: (text: string) => void;
  onChangeContent: (text: string) => void;
  onSubmit: () => void;
}

export function TextInputForm({
  title,
  content,
  onChangeTitle,
  onChangeContent,
  onSubmit,
}: TextInputFormProps) {
  return (
    <View>
      <BottomSheetTextInput
        placeholder="Title (e.g. Lecture Notes)"
        placeholderTextColor={theme.colors.textMuted}
        value={title}
        onChangeText={onChangeTitle}
        style={styles.drawerInputTitle}
      />
      <BottomSheetTextInput
        placeholder="Paste or type content here..."
        placeholderTextColor={theme.colors.textMuted}
        value={content}
        onChangeText={onChangeContent}
        style={styles.drawerInputContent}
        multiline={true}
        textAlignVertical="top"
      />
      <Pressable onPress={onSubmit} style={styles.drawerSubmitButton}>
        <Text style={styles.drawerSubmitButtonText}>Next</Text>
      </Pressable>
    </View>
  );
}
