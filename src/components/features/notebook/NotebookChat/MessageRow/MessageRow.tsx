import { theme } from "@/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import * as Speech from "expo-speech";
import { styles } from "./MessageRow.styles";
import { Message } from "../types";

interface MessageRowProps {
  msg: Message;
  onCitationClick: (citation: any) => void;
}

export const MessageRow = React.memo(
  ({ msg, onCitationClick }: MessageRowProps) => {
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Stop speaking if component unmounts
    useEffect(() => {
      return () => {
        Speech.stop();
      };
    }, []);

    const handleSpeak = async () => {
      try {
        const speaking = await Speech.isSpeakingAsync();
        if (speaking) {
          await Speech.stop();
          if (isSpeaking) {
            setIsSpeaking(false);
            return;
          }
        }

        setIsSpeaking(true);
        Speech.speak(msg.text, {
          onDone: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false),
          onStopped: () => setIsSpeaking(false),
        });
      } catch (err) {
        console.warn("Speech playback error:", err);
        setIsSpeaking(false);
      }
    };

    const renderMessageTextWithCitations = (
      text: string,
      citations: any[] = [],
    ) => {
      if (!citations || citations.length === 0) {
        return <Text style={styles.aiText}>{text}</Text>;
      }

      const regex = /(\[[^\]]+\]\(#cite-\d+\))/g;
      const parts = text.split(regex);

      return (
        <Text style={styles.aiText}>
          {parts.map((part, index) => {
            const match = part.match(/^\[([^\]]+)\]\(#cite-(\d+)\)$/);
            if (match) {
              const label = match[1];
              const citeIndex = parseInt(match[2], 10);
              const citation =
                citations.find((c) => c.index === citeIndex) ||
                citations[citeIndex - 1];
              if (citation) {
                return (
                  <Text
                    key={index}
                    style={styles.clickableCitation}
                    onPress={() => onCitationClick(citation)}
                  >
                    [{label}]
                  </Text>
                );
              }
            }
            return part;
          })}
        </Text>
      );
    };

    return (
      <View style={styles.messageRow}>
        {msg.sender === "user" ? (
          <View style={styles.userBubble}>
            <Text style={styles.userText}>{msg.text}</Text>
          </View>
        ) : (
          <View style={styles.aiMessageContainer}>
            <View style={styles.aiAvatar}>
              <Ionicons
                name="hardware-chip-outline"
                size={16}
                color={theme.colors.primaryDark}
              />
            </View>

            <View style={styles.aiBubble}>
              {renderMessageTextWithCitations(msg.text, msg.citations ?? [])}
              <View style={styles.aiBubbleFooter}>
                <Pressable onPress={handleSpeak} style={styles.speakButton}>
                  <Ionicons
                    name={isSpeaking ? "volume-medium" : "volume-medium-outline"}
                    size={16}
                    color={isSpeaking ? theme.colors.primary : theme.colors.mutedGrayIcon}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  },
);
