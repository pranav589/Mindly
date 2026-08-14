import React from "react";
import { Text, View } from "react-native";
import { styles } from "./PodcastTranscript.styles";

interface PodcastTurn {
  speaker: "Host A" | "Host B";
  text: string;
}

interface PodcastTranscriptProps {
  script: PodcastTurn[];
}

export function PodcastTranscript({ script }: PodcastTranscriptProps) {
  return (
    <View style={styles.transcriptSection}>
      <Text style={styles.topicsHeader}>Discussion Transcript</Text>
      <View style={styles.transcriptList}>
        {script.map((turn, idx) => {
          const isHostA =
            turn.speaker === "Host A" ||
            turn.speaker.toLowerCase().includes("host a");
          return (
            <View
              key={idx}
              style={[
                styles.transcriptRow,
                isHostA ? styles.rowHostA : styles.rowHostB,
              ]}
            >
              <View
                style={[
                  styles.avatar,
                  isHostA ? styles.avatarA : styles.avatarB,
                ]}
              >
                <Text style={styles.avatarText}>{isHostA ? "🎙️" : "🎧"}</Text>
              </View>
              <View style={styles.bubbleContainer}>
                <Text style={styles.speakerLabel}>{turn.speaker}</Text>
                <View
                  style={[
                    styles.bubble,
                    isHostA ? styles.bubbleA : styles.bubbleB,
                  ]}
                >
                  <Text style={styles.bubbleText}>{turn.text}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
