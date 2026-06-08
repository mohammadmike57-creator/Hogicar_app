import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  FlatList,
  Platform,
  useWindowDimensions,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

/* ── Slide data ─────────────────────────────────────────────────── */
const SLIDES = [
  {
    id: "1",
    gradient: ["#050D1A", "#0A1628", "#0D47A1"] as [string, string, string],
    orb1: "#1565C0",
    orb2: "#1E88E5",
    tag: "DISCOVER",
    title: "Find Your\nPerfect Ride",
    subtitle: "Search and compare 10,000+ car deals from the world's top suppliers.",
    accentColor: "#4FC3F7",
    CardComponent: SearchMockup,
  },
  {
    id: "2",
    gradient: ["#04130F", "#061A14", "#00695C"] as [string, string, string],
    orb1: "#00796B",
    orb2: "#00BCD4",
    tag: "TRANSPARENT",
    title: "No Hidden\nFees. Ever.",
    subtitle: "Full price transparency from search to checkout. Zero surprises.",
    accentColor: "#80CBC4",
    CardComponent: PriceMockup,
  },
  {
    id: "3",
    gradient: ["#0D0616", "#160920", "#4A148C"] as [string, string, string],
    orb1: "#6A1B9A",
    orb2: "#E040FB",
    tag: "TOP RATED",
    title: "Premium\nSuppliers Only",
    subtitle: "Every partner is verified and rated by real travellers like you.",
    accentColor: "#CE93D8",
    CardComponent: RatingsMockup,
  },
  {
    id: "4",
    gradient: ["#060812", "#0B1020", "#1A237E"] as [string, string, string],
    orb1: "#1565C0",
    orb2: "#00BCD4",
    tag: "INSTANT",
    title: "Booked in\nUnder 2 Minutes",
    subtitle: "Secure checkout and instant confirmation. Your journey starts here.",
    accentColor: "#90CAF9",
    CardComponent: ConfirmedMockup,
  },
];

/* ── Floating animation hook ─────────────────────────────────────── */
function useFloat(amplitude: number, duration: number, delay = 0) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const t = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, delay);
    return () => clearTimeout(t);
  }, []);
  return anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, amplitude],
  });
}

/* ── Main screen ─────────────────────────────────────────────────── */
export default function OnboardingScreen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const flatRef = useRef<FlatList>(null);
  const [idx, setIdx] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const botPad = Platform.OS === "web" ? 40 : insets.bottom;
  const CTRL_H = 130 + botPad;

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (idx < SLIDES.length - 1)
      flatRef.current?.scrollToIndex({ index: idx + 1, animated: true });
    else finish();
  }

  const slide = SLIDES[idx];

  return (
    <View style={{ flex: 1, backgroundColor: slide.gradient[0] }}>
      <Animated.FlatList
        ref={flatRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(e) => {
          setIdx(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        keyExtractor={(s) => s.id}
        renderItem={({ item, index }) => (
          <SlideView
            slide={item}
            index={index}
            scrollX={scrollX}
            width={width}
            height={height}
            ctrlH={CTRL_H}
            topPad={Platform.OS === "web" ? 48 : insets.top}
          />
        )}
      />

      {/* Controls — always on top */}
      <View
        style={[
          ss.ctrl,
          { paddingBottom: botPad + 20, backgroundColor: "transparent" },
        ]}
      >
        {/* Dots */}
        <View style={ss.dots}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const w = scrollX.interpolate({ inputRange, outputRange: [6, 28, 6], extrapolate: "clamp" });
            const op = scrollX.interpolate({ inputRange, outputRange: [0.3, 1, 0.3], extrapolate: "clamp" });
            return (
              <Animated.View
                key={i}
                style={[
                  ss.dot,
                  { width: w, opacity: op, backgroundColor: SLIDES[i].accentColor },
                ]}
              />
            );
          })}
        </View>

        {idx < SLIDES.length - 1 ? (
          <View style={ss.btnRow}>
            <TouchableOpacity onPress={skip} style={ss.skipBtn}>
              <Text style={ss.skipTxt} allowFontScaling={false}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={next} style={ss.nextBtn} activeOpacity={0.88}>
              <Text style={ss.nextTxt} allowFontScaling={false}>Next</Text>
              <Feather name="arrow-right" size={18} color="#1565C0" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={finish} style={ss.gsBtn} activeOpacity={0.88}>
            <Text style={ss.gsTxt} allowFontScaling={false}>Get Started</Text>
            <Feather name="arrow-right" size={20} color="#1565C0" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

/* ── Single slide ────────────────────────────────────────────────── */
function SlideView({
  slide, index, scrollX, width, height, ctrlH, topPad,
}: {
  slide: typeof SLIDES[0]; index: number; scrollX: Animated.Value;
  width: number; height: number; ctrlH: number; topPad: number;
}) {
  const inR: [number, number, number] = [(index - 1) * width, index * width, (index + 1) * width];

  /* 3-D card transforms driven by scroll position */
  const cardRotY = scrollX.interpolate({ inputRange: inR, outputRange: ["45deg", "0deg", "-45deg"], extrapolate: "clamp" });
  const cardScale = scrollX.interpolate({ inputRange: inR, outputRange: [0.7, 1, 0.7], extrapolate: "clamp" });
  const cardOp = scrollX.interpolate({ inputRange: inR, outputRange: [0, 1, 0], extrapolate: "clamp" });

  /* Text fade + lift */
  const txtOp = scrollX.interpolate({ inputRange: inR, outputRange: [0, 1, 0], extrapolate: "clamp" });
  const txtTY = scrollX.interpolate({ inputRange: inR, outputRange: [32, 0, 32], extrapolate: "clamp" });

  /* Background orb parallax */
  const orb1X = scrollX.interpolate({ inputRange: inR, outputRange: [-60, 0, 60], extrapolate: "clamp" });
  const orb2X = scrollX.interpolate({ inputRange: inR, outputRange: [60, 0, -60], extrapolate: "clamp" });

  /* Persistent float */
  const bobY = useFloat(-14, 2400, index * 300);
  const tiltX = useFloat(3, 3000, index * 200);

  const { CardComponent } = slide;
  const CONTENT_H = height - ctrlH;

  return (
    <LinearGradient colors={slide.gradient} style={{ width, height }} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }}>
      {/* Animated background orbs */}
      <Animated.View
        style={[
          ss.orb,
          {
            width: width * 1.1,
            height: width * 1.1,
            borderRadius: width,
            backgroundColor: slide.orb1 + "30",
            top: -width * 0.35,
            left: -width * 0.25,
            transform: [{ translateX: orb1X }],
          },
        ]}
      />
      <Animated.View
        style={[
          ss.orb,
          {
            width: width * 0.85,
            height: width * 0.85,
            borderRadius: width,
            backgroundColor: slide.orb2 + "22",
            bottom: ctrlH + 20,
            right: -width * 0.3,
            transform: [{ translateX: orb2X }],
          },
        ]}
      />

      {/* Content area */}
      <View style={{ width, height: CONTENT_H, paddingTop: topPad + 16, alignItems: "center", justifyContent: "center" }}>
        {/* Tag */}
        <Animated.View style={[ss.tagPill, { borderColor: slide.accentColor + "50", backgroundColor: slide.accentColor + "15", opacity: txtOp, transform: [{ translateY: txtTY }] }]}>
          <View style={[ss.tagDot, { backgroundColor: slide.accentColor }]} />
          <Text style={[ss.tagTxt, { color: slide.accentColor }]} allowFontScaling={false}>{slide.tag}</Text>
        </Animated.View>

        {/* 3-D Hero Card */}
        <Animated.View
          style={{
            opacity: cardOp,
            transform: [
              { perspective: 900 },
              { rotateY: cardRotY },
              { scale: cardScale },
              { translateY: bobY },
            ],
            marginVertical: 16,
          }}
        >
          <CardComponent accentColor={slide.accentColor} width={width} />
        </Animated.View>

        {/* Title */}
        <Animated.Text
          style={[ss.title, { color: "#FFF", opacity: txtOp, transform: [{ translateY: txtTY }] }]}
          allowFontScaling={false}
        >
          {slide.title}
        </Animated.Text>

        {/* Accent line */}
        <Animated.View style={[ss.accentLine, { backgroundColor: slide.accentColor, opacity: txtOp }]} />

        {/* Subtitle */}
        <Animated.Text style={[ss.subtitle, { opacity: txtOp, transform: [{ translateY: txtTY }] }]} allowFontScaling={false}>
          {slide.subtitle}
        </Animated.Text>
      </View>
    </LinearGradient>
  );
}

/* ── Mockup cards ─────────────────────────────────────────────────── */
function SearchMockup({ accentColor, width }: { accentColor: string; width: number }) {
  const CARD_W = Math.min(width * 0.82, 340);
  return (
    <View style={[mc.card, { width: CARD_W, borderColor: accentColor + "30" }]}>
      <View style={mc.cardHeader}>
        <View style={[mc.dot2, { backgroundColor: "#FF5F57" }]} />
        <View style={[mc.dot2, { backgroundColor: "#FEBC2E" }]} />
        <View style={[mc.dot2, { backgroundColor: "#28C840" }]} />
        <Text style={mc.cardHeaderTxt} allowFontScaling={false}>car rental search</Text>
      </View>
      <View style={mc.field}>
        <View style={[mc.fieldIcon, { backgroundColor: accentColor + "25" }]}>
          <Feather name="map-pin" size={11} color={accentColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={mc.fieldLabel} allowFontScaling={false}>PICKUP</Text>
          <Text style={mc.fieldVal} allowFontScaling={false}>London Heathrow Airport</Text>
        </View>
      </View>
      <View style={mc.sep} />
      <View style={{ flexDirection: "row", gap: 8 }}>
        <View style={[mc.field, { flex: 1 }]}>
          <View style={[mc.fieldIcon, { backgroundColor: "#FFFFFF10" }]}>
            <Feather name="calendar" size={11} color="#AAA" />
          </View>
          <View>
            <Text style={mc.fieldLabel} allowFontScaling={false}>FROM</Text>
            <Text style={mc.fieldVal} allowFontScaling={false}>12 Jul · 10:00</Text>
          </View>
        </View>
        <View style={[mc.field, { flex: 1 }]}>
          <View style={[mc.fieldIcon, { backgroundColor: "#FFFFFF10" }]}>
            <Feather name="calendar" size={11} color="#AAA" />
          </View>
          <View>
            <Text style={mc.fieldLabel} allowFontScaling={false}>TO</Text>
            <Text style={mc.fieldVal} allowFontScaling={false}>19 Jul · 10:00</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={[mc.searchBtn, { backgroundColor: accentColor }]}>
        <Feather name="search" size={13} color="#0A1628" />
        <Text style={[mc.searchBtnTxt, { color: "#0A1628" }]} allowFontScaling={false}>Search 1,248 cars</Text>
      </TouchableOpacity>
      {/* Floating tags */}
      <View style={mc.tagsRow}>
        {["🚗 $21/day", "⚡ $73/day", "🚙 $51/day"].map((t) => (
          <View key={t} style={[mc.floatTag, { borderColor: accentColor + "40" }]}>
            <Text style={[mc.floatTagTxt, { color: accentColor }]} allowFontScaling={false}>{t}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function PriceMockup({ accentColor, width }: { accentColor: string; width: number }) {
  const CARD_W = Math.min(width * 0.82, 340);
  const rows = [
    { label: "Base Rental (7 days)", val: "$189", icon: "truck" as const },
    { label: "Full Coverage Insurance", val: "$36", icon: "shield" as const },
    { label: "Airport Surcharge", val: "$18", icon: "navigation" as const },
    { label: "Local Taxes (12%)", val: "$27", icon: "percent" as const },
  ];
  return (
    <View style={[mc.card, { width: CARD_W, borderColor: accentColor + "30" }]}>
      <View style={mc.cardHeader}>
        <Feather name="dollar-sign" size={14} color={accentColor} />
        <Text style={[mc.cardHeaderTxt, { color: accentColor }]} allowFontScaling={false}>Price Breakdown</Text>
      </View>
      {rows.map((r) => (
        <View key={r.label} style={mc.priceRow}>
          <View style={[mc.fieldIcon, { backgroundColor: accentColor + "18" }]}>
            <Feather name={r.icon} size={10} color={accentColor} />
          </View>
          <Text style={mc.priceLabel} allowFontScaling={false}>{r.label}</Text>
          <Text style={mc.priceVal} allowFontScaling={false}>{r.val}</Text>
        </View>
      ))}
      <View style={mc.priceDivider} />
      <View style={mc.priceTotal}>
        <Text style={mc.priceTotalLabel} allowFontScaling={false}>Total Due Now</Text>
        <Text style={[mc.priceTotalVal, { color: accentColor }]} allowFontScaling={false}>$270</Text>
      </View>
      <View style={[mc.noBadge, { backgroundColor: accentColor + "20", borderColor: accentColor + "40" }]}>
        <Feather name="check-circle" size={11} color={accentColor} />
        <Text style={[mc.noBadgeTxt, { color: accentColor }]} allowFontScaling={false}>No hidden fees — guaranteed</Text>
      </View>
    </View>
  );
}

function RatingsMockup({ accentColor, width }: { accentColor: string; width: number }) {
  const CARD_W = Math.min(width * 0.82, 340);
  const suppliers = [
    { name: "Hertz", init: "Hz", color: "#FFD700", rating: 9.1, label: "Exceptional", reviews: "1.2k" },
    { name: "Avis", init: "Av", color: "#EF5350", rating: 8.7, label: "Superb", reviews: "987" },
    { name: "Sixt", init: "Sx", color: "#FF9800", rating: 9.4, label: "Exceptional", reviews: "674" },
  ];
  return (
    <View style={[mc.card, { width: CARD_W, borderColor: accentColor + "30" }]}>
      <View style={mc.cardHeader}>
        <Feather name="award" size={14} color={accentColor} />
        <Text style={[mc.cardHeaderTxt, { color: accentColor }]} allowFontScaling={false}>Verified Suppliers</Text>
      </View>
      {suppliers.map((s) => (
        <View key={s.name} style={mc.supplierRow}>
          <View style={[mc.supplierBadge, { backgroundColor: s.color + "25" }]}>
            <Text style={[mc.supplierInit, { color: s.color }]} allowFontScaling={false}>{s.init}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={mc.supplierName} allowFontScaling={false}>{s.name}</Text>
            <Text style={mc.supplierLabel} allowFontScaling={false}>{s.label} · {s.reviews} reviews</Text>
          </View>
          <View style={[mc.ratingChip, { backgroundColor: "#1565C0" }]}>
            <Text style={mc.ratingNum} allowFontScaling={false}>{s.rating}</Text>
          </View>
        </View>
      ))}
      <View style={[mc.noBadge, { backgroundColor: accentColor + "20", borderColor: accentColor + "40" }]}>
        <Feather name="users" size={11} color={accentColor} />
        <Text style={[mc.noBadgeTxt, { color: accentColor }]} allowFontScaling={false}>15,000+ verified traveller reviews</Text>
      </View>
    </View>
  );
}

function ConfirmedMockup({ accentColor, width }: { accentColor: string; width: number }) {
  const CARD_W = Math.min(width * 0.82, 340);
  return (
    <View style={[mc.card, { width: CARD_W, borderColor: accentColor + "30", alignItems: "center" }]}>
      <View style={[mc.confirmIcon, { backgroundColor: "#15803D20", borderColor: "#15803D50" }]}>
        <Feather name="check" size={28} color="#4ADE80" />
      </View>
      <Text style={mc.confirmTitle} allowFontScaling={false}>Booking Confirmed!</Text>
      <View style={[mc.refBox, { backgroundColor: accentColor + "15", borderColor: accentColor + "30" }]}>
        <Text style={mc.refLabel} allowFontScaling={false}>BOOKING REFERENCE</Text>
        <Text style={[mc.refNum, { color: accentColor }]} allowFontScaling={false}>CR·847291</Text>
      </View>
      {[
        { icon: "truck" as const, label: "Toyota Yaris · Hertz" },
        { icon: "map-pin" as const, label: "London Heathrow Airport" },
        { icon: "calendar" as const, label: "12 Jul → 19 Jul · 7 days" },
      ].map((r) => (
        <View key={r.label} style={mc.confirmRow}>
          <Feather name={r.icon} size={12} color={accentColor} />
          <Text style={mc.confirmRowTxt} allowFontScaling={false}>{r.label}</Text>
        </View>
      ))}
      <View style={[mc.noBadge, { backgroundColor: "#15803D20", borderColor: "#15803D40", marginTop: 8 }]}>
        <Feather name="mail" size={11} color="#4ADE80" />
        <Text style={[mc.noBadgeTxt, { color: "#4ADE80" }]} allowFontScaling={false}>Confirmation sent to your email</Text>
      </View>
    </View>
  );
}

/* ── Style sheets ─────────────────────────────────────────────────── */
const ss = StyleSheet.create({
  orb: { position: "absolute" },
  tagPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 12,
  },
  tagDot: { width: 6, height: 6, borderRadius: 3 },
  tagTxt: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 2.5 },
  title: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    lineHeight: 44,
    letterSpacing: -0.8,
    marginTop: 8,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  accentLine: { width: 32, height: 3, borderRadius: 2, marginBottom: 10 },
  subtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.68)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 36,
  },
  ctrl: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  dots: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6, marginBottom: 18 },
  dot: { height: 8, borderRadius: 4 },
  btnRow: { flexDirection: "row", gap: 10 },
  skipBtn: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.28)",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  skipTxt: { fontSize: 15, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.8)" },
  nextBtn: {
    flex: 2.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  nextTxt: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#1565C0" },
  gsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  gsTxt: { fontSize: 17, fontFamily: "Inter_700Bold", color: "#1565C0" },
});

const mc = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.6,
    shadowRadius: 32,
    elevation: 20,
    backdropFilter: "blur(20px)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  dot2: { width: 8, height: 8, borderRadius: 4 },
  cardHeaderTxt: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 0.5,
    flex: 1,
    marginLeft: 2,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 5,
  },
  fieldIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldLabel: {
    fontSize: 9,
    fontFamily: "Inter_600SemiBold",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 1,
  },
  fieldVal: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: "#FFF",
    marginTop: 1,
  },
  sep: { height: 1, backgroundColor: "rgba(255,255,255,0.08)", marginVertical: 8 },
  searchBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 10,
  },
  searchBtnTxt: { fontSize: 13, fontFamily: "Inter_700Bold" },
  tagsRow: { flexDirection: "row", gap: 6, marginTop: 10, flexWrap: "wrap" },
  floatTag: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  floatTagTxt: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 6 },
  priceLabel: { flex: 1, fontSize: 11, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)" },
  priceVal: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#FFF" },
  priceDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.12)", marginVertical: 8 },
  priceTotal: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 4 },
  priceTotalLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#FFF" },
  priceTotalVal: { fontSize: 22, fontFamily: "Inter_700Bold" },
  noBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginTop: 10,
  },
  noBadgeTxt: { fontSize: 11, fontFamily: "Inter_500Medium" },
  supplierRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 7 },
  supplierBadge: {
    width: 34, height: 34, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
  },
  supplierInit: { fontSize: 13, fontFamily: "Inter_700Bold" },
  supplierName: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#FFF" },
  supplierLabel: { fontSize: 10, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.5)", marginTop: 1 },
  ratingChip: {
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
    alignItems: "center", justifyContent: "center",
  },
  ratingNum: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#FFF" },
  confirmIcon: {
    width: 64, height: 64, borderRadius: 32,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1.5,
    marginBottom: 10,
  },
  confirmTitle: { fontSize: 17, fontFamily: "Inter_700Bold", color: "#FFF", marginBottom: 12 },
  refBox: {
    borderWidth: 1, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 10,
    alignItems: "center",
    marginBottom: 12,
    width: "100%",
  },
  refLabel: { fontSize: 9, fontFamily: "Inter_600SemiBold", color: "rgba(255,255,255,0.45)", letterSpacing: 1.5 },
  refNum: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: 3, marginTop: 2 },
  confirmRow: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingVertical: 4, width: "100%",
  },
  confirmRowTxt: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.75)" },
});
