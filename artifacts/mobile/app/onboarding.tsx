import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  FlatList,
  Platform,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

const SLIDES = [
  {
    id: "1",
    gradient: ["#0D47A1", "#1565C0", "#1E88E5"] as [string, string, string],
    icon: "🚗",
    tag: "DISCOVER",
    title: "Find Your\nPerfect Ride",
    subtitle:
      "Search and compare thousands of car rental deals from the world's top suppliers — all in one place.",
    accentColor: "#90CAF9",
  },
  {
    id: "2",
    gradient: ["#004D40", "#00695C", "#00897B"] as [string, string, string],
    icon: "🛡️",
    tag: "TRUSTED",
    title: "No Hidden\nFees. Ever.",
    subtitle:
      "Full price transparency from search to checkout. What you see is exactly what you pay.",
    accentColor: "#80CBC4",
  },
  {
    id: "3",
    gradient: ["#4A148C", "#6A1B9A", "#8E24AA"] as [string, string, string],
    icon: "⭐",
    tag: "TOP RATED",
    title: "Premium\nSuppliers Only",
    subtitle:
      "Every partner is verified and rated. Read real reviews from thousands of travellers like you.",
    accentColor: "#CE93D8",
  },
  {
    id: "4",
    gradient: ["#1A237E", "#1565C0", "#1976D2"] as [string, string, string],
    icon: "⚡",
    tag: "INSTANT",
    title: "Booked in\nUnder 2 Minutes",
    subtitle:
      "Secure checkout, instant confirmation, and 24/7 support. Your journey starts here.",
    accentColor: "#90CAF9",
  },
];

export default function OnboardingScreen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const CONTROLS_HEIGHT = 140 + (Platform.OS === "web" ? 40 : insets.bottom);
  const SLIDE_HEIGHT = height;

  async function finish() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await AsyncStorage.setItem("@onboarding_done", "true");
    router.replace("/(tabs)");
  }

  async function skip() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await AsyncStorage.setItem("@onboarding_done", "true");
    router.replace("/(tabs)");
  }

  function next() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (activeIdx < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIdx + 1, animated: true });
    } else {
      finish();
    }
  }

  const topPad = Platform.OS === "web" ? 40 : insets.top;
  const botPad = Platform.OS === "web" ? 40 : insets.bottom;

  return (
    <View style={{ flex: 1, backgroundColor: SLIDES[activeIdx].gradient[0] }}>
      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIdx(idx);
        }}
        renderItem={({ item, index }) => (
          <Slide
            item={item}
            index={index}
            scrollX={scrollX}
            topPad={topPad}
            controlsHeight={CONTROLS_HEIGHT}
            width={width}
            height={SLIDE_HEIGHT}
          />
        )}
      />

      {/* Fixed Bottom Controls */}
      <View
        style={[
          styles.controls,
          { paddingBottom: botPad + 16, backgroundColor: "transparent" },
        ]}
      >
        {/* Dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => {
            const inputRange = [
              (i - 1) * width,
              i * width,
              (i + 1) * width,
            ];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 28, 8],
              extrapolate: "clamp",
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.35, 1, 0.35],
              extrapolate: "clamp",
            });
            return (
              <Animated.View
                key={i}
                style={[styles.dot, { width: dotWidth, opacity }]}
              />
            );
          })}
        </View>

        {/* Buttons */}
        {activeIdx < SLIDES.length - 1 ? (
          <View style={styles.btnRow}>
            <TouchableOpacity onPress={skip} style={styles.skipBtn}>
              <Text style={styles.skipText} allowFontScaling={false}>
                Skip
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={next} style={styles.nextBtn}>
              <Text style={styles.nextText} allowFontScaling={false}>
                Next  →
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={finish}
            style={styles.getStartedBtn}
            activeOpacity={0.9}
          >
            <Text style={styles.getStartedText} allowFontScaling={false}>
              Get Started
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function Slide({
  item,
  index,
  scrollX,
  topPad,
  controlsHeight,
  width,
  height,
}: {
  item: (typeof SLIDES)[0];
  index: number;
  scrollX: Animated.Value;
  topPad: number;
  controlsHeight: number;
  width: number;
  height: number;
}) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.88, 1, 0.88],
    extrapolate: "clamp",
  });

  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [24, 0, 24],
    extrapolate: "clamp",
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.2, 1, 0.2],
    extrapolate: "clamp",
  });

  const contentHeight = height - controlsHeight;

  return (
    <LinearGradient
      colors={item.gradient}
      style={{ width, height }}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 0.85, y: 1 }}
    >
      {/* Decorative background circles */}
      <View
        style={[
          styles.bgCircle,
          { width: width * 0.85, height: width * 0.85, top: -width * 0.2, right: -width * 0.25 },
        ]}
      />
      <View
        style={[
          styles.bgCircle,
          { width: width * 0.6, height: width * 0.6, bottom: controlsHeight + 20, left: -width * 0.2 },
        ]}
      />

      {/* Content centred in the slide above controls */}
      <View
        style={{
          width,
          height: contentHeight,
          paddingTop: topPad + 24,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 32,
        }}
      >
        <Animated.View
          style={{
            alignItems: "center",
            opacity,
            transform: [{ scale }, { translateY }],
            width: "100%",
          }}
        >
          {/* Tag pill */}
          <View
            style={[
              styles.tagPill,
              {
                backgroundColor: item.accentColor + "25",
                borderColor: item.accentColor + "55",
              },
            ]}
          >
            <Text
              style={[styles.tagText, { color: item.accentColor }]}
              allowFontScaling={false}
            >
              {item.tag}
            </Text>
          </View>

          {/* Icon card */}
          <View style={styles.iconCard}>
            <Text style={styles.iconEmoji}>{item.icon}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title} allowFontScaling={false}>
            {item.title}
          </Text>

          {/* Accent divider */}
          <View
            style={[styles.accentBar, { backgroundColor: item.accentColor }]}
          />

          {/* Subtitle */}
          <Text style={styles.subtitle} allowFontScaling={false}>
            {item.subtitle}
          </Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bgCircle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  tagPill: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 28,
  },
  tagText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 2.5,
  },
  iconCard: {
    width: 112,
    height: 112,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  iconEmoji: { fontSize: 54 },
  title: {
    fontSize: 38,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 46,
    letterSpacing: -0.8,
    marginBottom: 16,
  },
  accentBar: {
    width: 36,
    height: 3,
    borderRadius: 2,
    marginBottom: 18,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.72)",
    textAlign: "center",
    lineHeight: 26,
    maxWidth: 300,
  },
  controls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  skipBtn: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.35)",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  skipText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.85)",
  },
  nextBtn: {
    flex: 2,
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  nextText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#1565C0",
  },
  getStartedBtn: {
    paddingVertical: 18,
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  getStartedText: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: "#1565C0",
  },
});
