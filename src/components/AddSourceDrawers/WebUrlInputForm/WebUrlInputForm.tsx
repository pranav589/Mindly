import React from "react";
import { Pressable, Text, View } from "react-native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { theme } from "@/theme/themes";
import { styles } from "./WebUrlInputForm.styles";

interface WebUrlInputFormProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
}

export function WebUrlInputForm({ value, onChangeText, onSubmit }: WebUrlInputFormProps) {
  return (
    <View>
      <BottomSheetTextInput
        placeholder="https://example.com/article"
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
