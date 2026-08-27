import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/theme/themes";
import { CustomAlertOptions } from "@/context/CustomAlertContext";
import { styles } from "./CustomAlert.styles";

interface CustomAlertProps {
  visible: boolean;
  options: CustomAlertOptions | null;
  onClose: () => void;
}

export function CustomAlert({ visible, options, onClose }: CustomAlertProps) {
  if (!options) return null;

  const { title, message, buttons, type = "info" } = options;

  const handleButtonPress = async (onPress?: () => void | Promise<void>) => {
    onClose();
    if (onPress) {
      await onPress();
    }
  };

  // Get status icon and color configuration
  const getStatusConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: "checkmark-circle" as const,
          color: theme.colors.success,
          bgStyle: styles.iconContainerSuccess,
        };
      case "warning":
        return {
          icon: "warning" as const,
          color: theme.colors.warning,
          bgStyle: styles.iconContainerWarning,
        };
      case "error":
        return {
          icon: "alert-circle" as const,
          color: theme.colors.textError,
          bgStyle: styles.iconContainerError,
        };
      case "info":
      default:
        return {
          icon: "information-circle" as const,
          color: theme.colors.primary,
          bgStyle: styles.iconContainerInfo,
        };
    }
  };

  const statusConfig = getStatusConfig();

  // If no buttons provided, default to a single "OK" button
  const alertButtons = buttons && buttons.length > 0
    ? buttons
    : [{ text: "OK", style: "default" as const }];

  const isTwoButtons = alertButtons.length === 2;
  const buttonContainerStyle = isTwoButtons
    ? styles.horizontalButtons
    : styles.verticalButtons;

  const buttonStyle = isTwoButtons ? styles.button : styles.buttonFullWidth;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Status Icon */}
          <View style={[styles.iconContainer, statusConfig.bgStyle]}>
            <Ionicons
              name={statusConfig.icon}
              size={32}
              color={statusConfig.color}
            />
          </View>

          {/* Text Content */}
          <Text style={styles.title}>{title}</Text>
          {message && <Text style={styles.message}>{message}</Text>}

          {/* Button Layout */}
          <View style={buttonContainerStyle}>
            {alertButtons.map((btn, index) => {
              const isCancel = btn.style === "cancel";
              const isDestructive = btn.style === "destructive";

              let btnStyle = styles.confirmButton;
              let btnTextStyle = styles.confirmButtonText;

              if (isCancel) {
                btnStyle = styles.cancelButton;
                btnTextStyle = styles.cancelButtonText;
              } else if (isDestructive) {
                btnStyle = styles.destructiveButton;
                btnTextStyle = styles.destructiveButtonText;
              }

              return (
                <Pressable
                  key={index}
                  onPress={() => handleButtonPress(btn.onPress)}
                  style={[buttonStyle, btnStyle]}
                >
                  <Text style={btnTextStyle}>{btn.text}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}
