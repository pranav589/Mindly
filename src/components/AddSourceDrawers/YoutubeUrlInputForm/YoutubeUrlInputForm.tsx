import React from "react";
import { Pressable, Text, View } from "react-native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { theme } from "@/theme/themes";
import { styles } from "./YoutubeUrlInputForm.styles";

interface YoutubeUrlInputFormProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
}

export function YoutubeUrlInputForm({ value, onChangeText, onSubmit }: YoutubeUrlInputFormProps) {
  return (
    <View>
      <BottomSheetTextInput
        placeholder="https://youtube.com/watch?v=..."
        placeholderTextColor={theme.colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        style={styles.drawerInput}
        autoCapitalize="none"
        keyboardType="url"
      />
      <Pressable onPress={onSubmit} style={styles.drawerSubmitButton}>
        <Text style={styles.drawerSubmitButtonText}>Next</Text>
      </Pressable>
    </View>
  );
}
