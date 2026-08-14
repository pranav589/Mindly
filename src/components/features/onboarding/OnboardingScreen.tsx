import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "@/components/Button";
import { getStyles } from "./OnboardingScreen.styles";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = getStyles(insets);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const slides = [
    {
      title: "Ingest Knowledge",
      description:
        "Upload documents, notes, and fragments. Our system structures the chaos into a clean, searchable base.",
      icon: "cloud-upload-outline",
      bgStyle: { backgroundColor: "rgba(162, 217, 206, 0.2)" },
      iconColor: "#117864",
    },
    {
      title: "Analyze Connections",
      description:
        "Discover hidden patterns. We automatically synthesize relationships to surface insights you might miss.",
      icon: "git-network-outline",
      bgStyle: { backgroundColor: "rgba(17, 120, 100, 0.1)" },
      iconColor: "#005d4d",
    },
    {
      title: "Study with Focus",
      description:
        "Enter a distraction-free zone. Review tailored summaries and test your comprehension in an optimized space.",
      icon: "school-outline",
      bgStyle: { backgroundColor: "rgba(218, 247, 166, 0.2)" },
      iconColor: "#42591a",
    },
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (activeIndex + 1) * SCREEN_WIDTH,
        animated: true,
      });
    } else {
      router.replace("/auth");
    }
  };

  const slideWidthStyle = { width: SCREEN_WIDTH };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Skip Button (Top Right) */}
      <View style={styles.skipRow}>
        <Pressable
          onPress={() => router.replace("/auth")}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      {/* Horizontal Carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.carousel}
      >
        {slides.map((slide, index) => (
          <View key={index} style={[styles.slide, slideWidthStyle]}>
            {/* Minimalist illustration card */}
            <View style={[styles.illustrationCard, slide.bgStyle]}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name={slide.icon as any}
                  size={48}
                  color={slide.iconColor}
                />
              </View>
            </View>

            {/* Slide Texts */}
            <View style={styles.textContainer}>
              <Text style={styles.slideTitle}>{slide.title}</Text>
              <Text style={styles.slideDescription}>{slide.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Fixed Bottom Controls */}
      <View style={styles.bottomControls}>
        {/* Pagination Dots */}
        <View style={styles.dotsRow}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <Button onPress={handleNext}>
          <Text style={styles.buttonLabel}>
            {activeIndex === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#ffffff" />
        </Button>
      </View>
    </View>
  );
}
