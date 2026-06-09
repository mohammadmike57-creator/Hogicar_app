import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  Image,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HogiCarLogo from "@/components/HogiCarLogo";

const { width, height } = Dimensions.get("window");

/* ─── Slide data ────────────────────────────────────────────────── */
const SLIDES = [
  {
    id: 0,
    gradient: ["#060E1C", "#0C1E3A", "#123C69"] as [string, string, string],
    tag: "PREMIUM FLEET",
    headline: "Find Your\nPerfect Car",
    sub: "Search over 10,000 vehicles from the world's top rental suppliers in seconds.",
    image: require("../assets/images/car-sedan.png"),
    glow: "#1565C0",
  },
  {
    id: 1,
    gradient: ["#08100A", "#0C1E10", "#0D3320"] as [string, string, string],
    tag: "BEST PRICES",
    headline: "No Hidden\nFees. Ever.",
    sub: "Full price transparency from search to checkout. Compare 500+ suppliers and save up to 40%.",
    image: require("../assets/images/car-suv.png"),
    glow: "#00A86B",
  },
  {
    id: 2,
    gradient: ["#10060A", "#1E0C14", "#3D0F1F"] as [string, string, string],
    tag: "INSTANT BOOKING",
    headline: "Booked in Under\n2 Minutes",
    sub: "Secure checkout, instant confirmation, and 24/7 expert support wherever you are.",
    image: require("../assets/images/car-electric.png"),
    glow: "#F57C00",
  },
];

const SLIDE_DURATION = 2200; // ms per slide
const TOTAL = SLIDES.length;

/* ─── Main screen ───────────────────────────────────────────────── */
export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [current, setCurrent] = useState(0);

  /* Per-segment progress animations */
  const progAnims = useRef(SLIDES.map(() => new Animated.Value(0))).current;
  /* Cross-fade opacity for each slide */
  const fadeAnims = useRef(SLIDES.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))).current;
  /* Subtle car float */
  const floatAnim = useRef(new Animated.Value(0)).current;

  /* Car floating loop */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -14,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  /* Auto-play engine */
  useEffect(() => {
    let slideIndex = 0;

    function runSlide(idx: number) {
      /* Reset current segment bar */
      progAnims[idx].setValue(0);

      /* Animate the segment bar */
      Animated.timing(progAnims[idx], {
        toValue: 1,
        duration: SLIDE_DURATION,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start(({ finished }) => {
        if (!finished) return;

        const next = idx + 1;
        if (next < TOTAL) {
          /* Cross-fade to next slide */
          Animated.parallel([
            Animated.timing(fadeAnims[idx], {
              toValue: 0,
              duration: 350,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnims[next], {
              toValue: 1,
              duration: 350,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setCurrent(next);
            slideIndex = next;
            runSlide(next);
          });
        } else {
          /* All slides done → navigate to search */
          AsyncStorage.setItem("@onboarding_done", "true");
          router.replace("/(tabs)");
        }
      });
    }

    runSlide(0);
    // Cleanup handled by animation callbacks
  }, []);

  const topPad = Platform.OS === "web" ? 48 : insets.top;
  const botPad = Platform.OS === "web" ? 32 : insets.bottom;

  return (
    <View style={ss.root}>
      {/* All slides stacked — only current is opaque */}
      {SLIDES.map((slide, i) => (
        <Animated.View
          key={slide.id}
          style={[ss.slideAbs, { opacity: fadeAnims[i] }]}
          pointerEvents={i === current ? "auto" : "none"}
        >
          <LinearGradient
            colors={slide.gradient}
            style={ss.fill}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
          >
            {/* Glow behind car */}
            <View
              style={[
                ss.glow,
                {
                  backgroundColor: slide.glow + "22",
                  shadowColor: slide.glow,
                },
              ]}
            />

            {/* Top area: logo + progress */}
            <View style={[ss.topArea, { paddingTop: topPad + 12 }]}>
              <HogiCarLogo variant="onDark" size="sm" />

              {/* Story-style progress segments */}
              <View style={ss.segsRow}>
                {SLIDES.map((_, si) => (
                  <View key={si} style={ss.segTrack}>
                    {si < i ? (
                      /* Past segments: fully filled */
                      <View style={[ss.segFill, { flex: 1 }]} />
                    ) : si === i ? (
                      /* Current segment: animated */
                      <Animated.View
                        style={[
                          ss.segFill,
                          {
                            flex: progAnims[si].interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 1],
                            }),
                          },
                        ]}
                      />
                    ) : null}
                  </View>
                ))}
              </View>
            </View>

            {/* Car image — center stage */}
            <View style={ss.carStage}>
              <Animated.Image
                source={slide.image}
                style={[
                  ss.carImg,
                  { transform: [{ translateY: floatAnim }] },
                ]}
                resizeMode="contain"
              />
            </View>

            {/* Bottom content */}
            <View style={[ss.bottom, { paddingBottom: botPad + 24 }]}>
              {/* Feature tag */}
              <View style={[ss.tag, { borderColor: slide.glow + "70", backgroundColor: slide.glow + "20" }]}>
                <View style={[ss.tagDot, { backgroundColor: slide.glow }]} />
                <Text style={[ss.tagTxt, { color: slide.glow === "#F57C00" ? "#F57C00" : "#FFF" }]} allowFontScaling={false}>
                  {slide.tag}
                </Text>
              </View>

              {/* Headline */}
              <Text style={ss.headline} allowFontScaling={false}>
                {slide.headline}
              </Text>

              {/* Orange accent line */}
              <View style={ss.accent} />

              {/* Subtitle */}
              <Text style={ss.sub} allowFontScaling={false}>
                {slide.sub}
              </Text>

              {/* Slide counter */}
              <Text style={ss.counter} allowFontScaling={false}>
                {i + 1} / {TOTAL}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      ))}
    </View>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────── */
const ss = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#060E1C" },
  slideAbs: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fill: { flex: 1 },
  glow: {
    position: "absolute",
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    top: "25%",
    left: -width * 0.1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 80,
    elevation: 0,
  },
  /* Top */
  topArea: {
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 20,
    zIndex: 10,
  },
  segsRow: {
    flexDirection: "row",
    gap: 5,
    width: "100%",
  },
  segTrack: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.22)",
    overflow: "hidden",
  },
  segFill: {
    height: 3,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
  /* Car */
  carStage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  carImg: {
    width: width * 0.88,
    height: height * 0.28,
  },
  /* Bottom */
  bottom: {
    paddingHorizontal: 28,
    paddingTop: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 16,
  },
  tagDot: { width: 6, height: 6, borderRadius: 3 },
  tagTxt: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 2.5,
    color: "#FFF",
  },
  headline: {
    fontSize: 44,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    lineHeight: 52,
    letterSpacing: -1,
    marginBottom: 14,
  },
  accent: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#F57C00",
    marginBottom: 14,
  },
  sub: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.65)",
    lineHeight: 24,
    marginBottom: 20,
  },
  counter: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.35)",
    letterSpacing: 1,
  },
});
