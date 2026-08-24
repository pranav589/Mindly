import { theme } from "@/theme/themes";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";
import { getStyles } from "./OnboardingScreen.styles";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = getStyles(insets);
  const { user, loginWithGoogle } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (user) {
      router.replace("/(tabs)" as any);
    }
  }, [user]);

  const slides = [
    {
      title: "Welcome to Mindly",
      description:
        "Your dedicated 'second brain' for capturing, organizing, and synthesizing information.",
      image: require("../../../../assets/images/onboarding/welcome.jpg"),
      buttonText: "Get Started",
    },
    {
      title: "Gather Everything\nIn One Place",
      description:
        "Easily import notes, articles, research papers, PDFs, images, and audio. Mindly accepts diverse formats.",
      image: require("../../../../assets/images/onboarding/gather.jpg"),
      buttonText: "Next",
    },
    {
      title: "Unlock AI-\nInsights & Synthesis",
      description:
        "Let Mindly analyze your content to generate summaries, identify key concepts, link related ideas, and answer questions",
      image: require("../../../../assets/images/onboarding/ai.jpg"),
      buttonText: "Next",
    },
    {
      title: "Discover &\nConnect Ideas",
      description:
        "Navigate your personalized knowledge graph. Find obscure links and watch your understanding grow.",
      image: require("../../../../assets/images/onboarding/graph.jpg"),
      buttonText: "Continue with Google",
    },
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const handleNext = async () => {
    if (activeIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (activeIndex + 1) * SCREEN_WIDTH,
        animated: true,
      });
    } else {
      await loginWithGoogle();
    }
  };

  const handleSkip = () => {
    scrollViewRef.current?.scrollTo({
      x: (slides.length - 1) * SCREEN_WIDTH,
      animated: true,
    });
  };

  const slideWidthStyle = { width: SCREEN_WIDTH };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Skip Button (Top Right) */}
      <View style={styles.skipRow}>
        {activeIndex < slides.length - 1 ? (
          <Pressable
            onPress={handleSkip}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        ) : null}
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
            {/* Header Logo */}
            <View style={styles.logoContainer}>
              <FontAwesome6
                name="brain"
                size={22}
                color={theme.colors.primary}
              />
              <Text style={styles.logoText}>Mindly</Text>
            </View>

            {/* Slide Texts */}
            <View style={styles.textContainer}>
              <Text style={styles.slideTitle}>{slide.title}</Text>
              <Text style={styles.slideDescription}>{slide.description}</Text>
            </View>

            {/* Illustration */}
            <View style={styles.illustrationContainer}>
              <Image source={slide.image} style={styles.illustrationImage} />
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
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.85 : 1 },
          ]}
        >
          {activeIndex === slides.length - 1 && (
            <Ionicons
              name="logo-google"
              size={18}
              color={theme.colors.textLight}
            />
          )}
          <Text style={styles.buttonLabel}>
            {slides[activeIndex].buttonText}
          </Text>
          {activeIndex < slides.length - 1 && (
            <Ionicons
              name="arrow-forward"
              size={16}
              color={theme.colors.textLight}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}
