import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
  Platform,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useBooking } from "@/context/BookingContext";
import TrustBadges from "@/components/TrustBadges";
import CategoryGrid from "@/components/CategoryGrid";
import DatePickerModal from "@/components/DatePickerModal";
import LocationSearchModal from "@/components/LocationSearchModal";
import { Location } from "@/data/mockLocations";

const { width } = Dimensions.get("window");

const TIMES = [
  "06:00","07:00","08:00","09:00","10:00","11:00",
  "12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00",
];

function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
function rentalDays(a: Date, b: Date) {
  return Math.max(1, Math.round((b.getTime() - a.getTime()) / 86400000));
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { searchParams, setSearchParams } = useBooking();

  const [locationModal, setLocationModal] = useState<"pickup" | "return" | null>(null);
  const [showPickupDate, setShowPickupDate] = useState(false);
  const [showDropoffDate, setShowDropoffDate] = useState(false);
  const [showPickupTime, setShowPickupTime] = useState(false);
  const [showDropoffTime, setShowDropoffTime] = useState(false);

  const topPad = Platform.OS === "web" ? 54 : insets.top;

  useEffect(() => {
    (async () => {
      const done = await AsyncStorage.getItem("@onboarding_done");
      if (!done) router.replace("/onboarding");
    })();
  }, []);

  function handleSearch() {
    if (!searchParams.pickupLocation) { setLocationModal("pickup"); return; }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/results");
  }

  function handleLocationSelect(loc: Location) {
    if (locationModal === "pickup") {
      setSearchParams({
        ...searchParams,
        pickupLocation: loc.name,
        returnLocation: searchParams.sameReturnLocation ? loc.name : searchParams.returnLocation,
      });
    } else {
      setSearchParams({ ...searchParams, returnLocation: loc.name });
    }
    setLocationModal(null);
  }

  const days = rentalDays(searchParams.pickupDate, searchParams.dropoffDate);
  const hasPickup = !!searchParams.pickupLocation;

  return (
    <View style={[s.root, { paddingTop: topPad }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* ── Hero gradient header ─────────────────────────────────── */}
        <LinearGradient
          colors={["#0D47A1", "#1565C0", "#1976D2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.hero}
        >
          {/* Decorative orbs */}
          <View style={s.heroOrb1} />
          <View style={s.heroOrb2} />

          {/* Top bar */}
          <View style={s.topBar}>
            <View>
              <Text style={s.heroGreet} allowFontScaling={false}>Welcome back 👋</Text>
              <Text style={s.heroTitle} allowFontScaling={false}>Find your perfect car</Text>
            </View>
            <TouchableOpacity style={s.avatarBtn}>
              <Feather name="bell" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Stats row */}
          <View style={s.statsRow}>
            {[
              { val: "10,000+", label: "Cars" },
              { val: "150+", label: "Locations" },
              { val: "4.9★", label: "Rated" },
            ].map((st) => (
              <View key={st.label} style={s.statItem}>
                <Text style={s.statVal} allowFontScaling={false}>{st.val}</Text>
                <Text style={s.statLabel} allowFontScaling={false}>{st.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* ── Search widget — overlaps hero ───────────────────────── */}
        <View style={s.cardWrapper}>
          <View style={s.searchCard}>
            {/* Section label */}
            <View style={s.cardTopRow}>
              <Text style={s.cardTitle} allowFontScaling={false}>Search Cars</Text>
              <View style={[s.liveChip]}>
                <View style={s.liveDot} />
                <Text style={s.liveText} allowFontScaling={false}>Live deals</Text>
              </View>
            </View>

            {/* Pickup location */}
            <TouchableOpacity style={s.locField} onPress={() => setLocationModal("pickup")} activeOpacity={0.75}>
              <View style={[s.locIcon, { backgroundColor: "#EEF4FF" }]}>
                <Feather name="map-pin" size={15} color="#1565C0" />
              </View>
              <View style={s.locText}>
                <Text style={s.locLabel} allowFontScaling={false}>Pickup location</Text>
                <Text
                  style={[s.locValue, !hasPickup && s.locPlaceholder]}
                  numberOfLines={1}
                  allowFontScaling={false}
                >
                  {searchParams.pickupLocation || "City, airport or station"}
                </Text>
              </View>
              <Feather name="chevron-right" size={16} color="#CBD5E1" />
            </TouchableOpacity>

            {/* Connector line + same-location toggle */}
            <View style={s.connectorRow}>
              <View style={s.connectorLine} />
              <TouchableOpacity
                style={s.sameToggle}
                onPress={() => {
                  const next = !searchParams.sameReturnLocation;
                  setSearchParams({ ...searchParams, sameReturnLocation: next, returnLocation: next ? searchParams.pickupLocation : "" });
                }}
              >
                <View style={[s.toggleTrack, searchParams.sameReturnLocation && s.toggleTrackOn]}>
                  <View style={[s.toggleThumb, searchParams.sameReturnLocation && s.toggleThumbOn]} />
                </View>
                <Text style={s.sameText} allowFontScaling={false}>Same return location</Text>
              </TouchableOpacity>
            </View>

            {/* Return location */}
            {!searchParams.sameReturnLocation && (
              <TouchableOpacity style={s.locField} onPress={() => setLocationModal("return")} activeOpacity={0.75}>
                <View style={[s.locIcon, { backgroundColor: "#F3F4F6" }]}>
                  <Feather name="map-pin" size={15} color="#6B7280" />
                </View>
                <View style={s.locText}>
                  <Text style={s.locLabel} allowFontScaling={false}>Return location</Text>
                  <Text
                    style={[s.locValue, !searchParams.returnLocation && s.locPlaceholder]}
                    numberOfLines={1}
                    allowFontScaling={false}
                  >
                    {searchParams.returnLocation || "Different city or airport"}
                  </Text>
                </View>
                <Feather name="chevron-right" size={16} color="#CBD5E1" />
              </TouchableOpacity>
            )}

            <View style={s.divider} />

            {/* Date + time row */}
            <View style={s.datesRow}>
              {/* Pickup date/time */}
              <View style={s.dateGroup}>
                <Text style={s.dateGroupLabel} allowFontScaling={false}>PICKUP</Text>
                <TouchableOpacity style={s.dateChip} onPress={() => setShowPickupDate(true)}>
                  <Feather name="calendar" size={13} color="#1565C0" />
                  <Text style={s.dateChipText} allowFontScaling={false}>{formatDate(searchParams.pickupDate)}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.timeChip} onPress={() => setShowPickupTime(true)}>
                  <Feather name="clock" size={12} color="#6B7280" />
                  <Text style={s.timeChipText} allowFontScaling={false}>{searchParams.pickupTime}</Text>
                </TouchableOpacity>
              </View>

              {/* Duration badge */}
              <View style={s.durationBadge}>
                <Feather name="arrow-right" size={12} color="#1565C0" />
                <Text style={s.durationText} allowFontScaling={false}>{days}d</Text>
              </View>

              {/* Drop-off date/time */}
              <View style={[s.dateGroup, { alignItems: "flex-end" }]}>
                <Text style={s.dateGroupLabel} allowFontScaling={false}>DROP-OFF</Text>
                <TouchableOpacity style={s.dateChip} onPress={() => setShowDropoffDate(true)}>
                  <Feather name="calendar" size={13} color="#6B7280" />
                  <Text style={[s.dateChipText, { color: "#374151" }]} allowFontScaling={false}>{formatDate(searchParams.dropoffDate)}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.timeChip} onPress={() => setShowDropoffTime(true)}>
                  <Feather name="clock" size={12} color="#6B7280" />
                  <Text style={s.timeChipText} allowFontScaling={false}>{searchParams.dropoffTime}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={s.divider} />

            {/* Driver age */}
            <TouchableOpacity
              style={s.ageRow}
              onPress={() => setSearchParams({ ...searchParams, driverAgeUnder30OrOver65: !searchParams.driverAgeUnder30OrOver65 })}
              activeOpacity={0.75}
            >
              <View style={[s.locIcon, { backgroundColor: "#F3F4F6" }]}>
                <Feather name="user" size={14} color="#6B7280" />
              </View>
              <Text style={s.ageText} allowFontScaling={false}>Driver age 30–65 years</Text>
              <View style={[s.toggleTrack, !searchParams.driverAgeUnder30OrOver65 && s.toggleTrackOn]}>
                <View style={[s.toggleThumb, !searchParams.driverAgeUnder30OrOver65 && s.toggleThumbOn]} />
              </View>
            </TouchableOpacity>

            {searchParams.driverAgeUnder30OrOver65 && (
              <View style={s.agePicker}>
                <Text style={s.agePickerLabel} allowFontScaling={false}>Driver's age</Text>
                <View style={s.ageCounter}>
                  <TouchableOpacity
                    style={s.counterBtn}
                    onPress={() => setSearchParams({ ...searchParams, driverAge: Math.max(18, searchParams.driverAge - 1) })}
                  >
                    <Feather name="minus" size={14} color="#1565C0" />
                  </TouchableOpacity>
                  <Text style={s.counterNum} allowFontScaling={false}>{searchParams.driverAge}</Text>
                  <TouchableOpacity
                    style={s.counterBtn}
                    onPress={() => setSearchParams({ ...searchParams, driverAge: Math.min(99, searchParams.driverAge + 1) })}
                  >
                    <Feather name="plus" size={14} color="#1565C0" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Search CTA */}
            <TouchableOpacity style={s.searchBtn} onPress={handleSearch} activeOpacity={0.88}>
              <LinearGradient
                colors={["#1565C0", "#1976D2", "#42A5F5"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={s.searchBtnGrad}
              >
                <Feather name="search" size={18} color="#FFF" />
                <Text style={s.searchBtnText} allowFontScaling={false}>Search Cars</Text>
                <View style={s.searchBtnArrow}>
                  <Feather name="arrow-right" size={16} color="#1565C0" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Trust badges ─────────────────────────────────────────── */}
        <View style={{ marginTop: 20 }}>
          <TrustBadges />
        </View>

        {/* ── Section heading ──────────────────────────────────────── */}
        <View style={s.sectionHead}>
          <Text style={s.sectionTitle} allowFontScaling={false}>Browse by category</Text>
          <TouchableOpacity>
            <Text style={s.sectionLink} allowFontScaling={false}>View all</Text>
          </TouchableOpacity>
        </View>

        {/* ── Category grid ─────────────────────────────────────────── */}
        <CategoryGrid
          onSelect={(_type: string) => {
            if (searchParams.pickupLocation) router.push("/results");
            else setLocationModal("pickup");
          }}
        />

        {/* ── Why choose us ─────────────────────────────────────────── */}
        <View style={s.sectionHead}>
          <Text style={s.sectionTitle} allowFontScaling={false}>Why choose us</Text>
        </View>
        <View style={s.whyGrid}>
          {[
            { icon: "shield" as const, title: "No Hidden Fees", body: "The price you see is the price you pay. Always.", color: "#EEF4FF" },
            { icon: "zap" as const, title: "Instant Booking", body: "Confirm your car in under 2 minutes.", color: "#FFF7ED" },
            { icon: "star" as const, title: "Top Rated", body: "Every supplier verified by real travellers.", color: "#F0FDF4" },
            { icon: "headphones" as const, title: "24/7 Support", body: "Our team is always here to help you.", color: "#FDF4FF" },
          ].map((w) => (
            <View key={w.title} style={[s.whyCard, { backgroundColor: w.color }]}>
              <View style={s.whyIconWrap}>
                <Feather name={w.icon} size={20} color="#1565C0" />
              </View>
              <Text style={s.whyTitle} allowFontScaling={false}>{w.title}</Text>
              <Text style={s.whyBody} allowFontScaling={false}>{w.body}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ── Modals ──────────────────────────────────────────────────── */}
      <LocationSearchModal
        visible={locationModal === "pickup"}
        title="Pickup Location"
        onClose={() => setLocationModal(null)}
        onSelect={handleLocationSelect}
      />
      <LocationSearchModal
        visible={locationModal === "return"}
        title="Return Location"
        onClose={() => setLocationModal(null)}
        onSelect={handleLocationSelect}
      />

      <Modal visible={showPickupTime} transparent animationType="slide" onRequestClose={() => setShowPickupTime(false)}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setShowPickupTime(false)} />
        <View style={[s.timeSheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View style={s.handle} />
          <Text style={s.sheetTitle} allowFontScaling={false}>Pickup Time</Text>
          <FlatList
            data={TIMES}
            keyExtractor={(t) => t}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[s.timeItem, searchParams.pickupTime === item && s.timeItemSel]}
                onPress={() => { setSearchParams({ ...searchParams, pickupTime: item }); setShowPickupTime(false); }}
              >
                <Text style={[s.timeItemTxt, searchParams.pickupTime === item && s.timeItemTxtSel]} allowFontScaling={false}>{item}</Text>
                {searchParams.pickupTime === item && <Feather name="check" size={16} color="#1565C0" />}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      <Modal visible={showDropoffTime} transparent animationType="slide" onRequestClose={() => setShowDropoffTime(false)}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setShowDropoffTime(false)} />
        <View style={[s.timeSheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View style={s.handle} />
          <Text style={s.sheetTitle} allowFontScaling={false}>Drop-off Time</Text>
          <FlatList
            data={TIMES}
            keyExtractor={(t) => t}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[s.timeItem, searchParams.dropoffTime === item && s.timeItemSel]}
                onPress={() => { setSearchParams({ ...searchParams, dropoffTime: item }); setShowDropoffTime(false); }}
              >
                <Text style={[s.timeItemTxt, searchParams.dropoffTime === item && s.timeItemTxtSel]} allowFontScaling={false}>{item}</Text>
                {searchParams.dropoffTime === item && <Feather name="check" size={16} color="#1565C0" />}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      <DatePickerModal
        visible={showPickupDate}
        value={searchParams.pickupDate}
        title="Pickup Date"
        onClose={() => setShowPickupDate(false)}
        onSelect={(d) => {
          const newDrop = d >= searchParams.dropoffDate ? new Date(d.getTime() + 7 * 86400000) : searchParams.dropoffDate;
          setSearchParams({ ...searchParams, pickupDate: d, dropoffDate: newDrop });
        }}
      />
      <DatePickerModal
        visible={showDropoffDate}
        value={searchParams.dropoffDate}
        minDate={new Date(searchParams.pickupDate.getTime() + 86400000)}
        title="Drop-off Date"
        onClose={() => setShowDropoffDate(false)}
        onSelect={(d) => setSearchParams({ ...searchParams, dropoffDate: d })}
      />
    </View>
  );
}

/* ── Styles ───────────────────────────────────────────────────────── */
const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F0F4FF" },

    /* Hero */
    hero: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 64,
      overflow: "hidden",
      position: "relative",
    },
    heroOrb1: {
      position: "absolute",
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: "rgba(255,255,255,0.07)",
      top: -60,
      right: -60,
    },
    heroOrb2: {
      position: "absolute",
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: "rgba(255,255,255,0.05)",
      bottom: 20,
      left: -30,
    },
    topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 },
    heroGreet: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)", marginBottom: 3 },
    heroTitle: { fontSize: 24, fontFamily: "Inter_700Bold", color: "#FFFFFF", lineHeight: 30 },
    avatarBtn: {
      width: 40, height: 40, borderRadius: 12,
      backgroundColor: "rgba(255,255,255,0.15)",
      alignItems: "center", justifyContent: "center",
      borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
    },
    statsRow: { flexDirection: "row", gap: 0 },
    statItem: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 10,
      backgroundColor: "rgba(255,255,255,0.1)",
      borderRadius: 12,
      marginHorizontal: 4,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.12)",
    },
    statVal: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
    statLabel: { fontSize: 10, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)", marginTop: 1 },

    /* Search card — overlap hero */
    cardWrapper: { paddingHorizontal: 16, marginTop: -36 },
    searchCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 24,
      padding: 18,
      shadowColor: "#1565C0",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.14,
      shadowRadius: 24,
      elevation: 10,
    },
    cardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
    cardTitle: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#1A1A2E" },
    liveChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: "#F0FDF4",
      borderRadius: 20,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: "#BBF7D0",
    },
    liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#22C55E" },
    liveText: { fontSize: 10, fontFamily: "Inter_600SemiBold", color: "#15803D" },

    /* Location fields */
    locField: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 10,
    },
    locIcon: {
      width: 36, height: 36, borderRadius: 10,
      alignItems: "center", justifyContent: "center",
    },
    locText: { flex: 1 },
    locLabel: { fontSize: 10, fontFamily: "Inter_500Medium", color: "#9CA3AF", letterSpacing: 0.3 },
    locValue: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#1A1A2E", marginTop: 2 },
    locPlaceholder: { fontFamily: "Inter_400Regular", color: "#9CA3AF" },

    connectorRow: { flexDirection: "row", alignItems: "center", gap: 10, marginLeft: 0, paddingVertical: 4 },
    connectorLine: { width: 36, height: 1, backgroundColor: "#E5E7EB", marginLeft: 0 },
    sameToggle: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
    sameText: { fontSize: 12, fontFamily: "Inter_400Regular", color: "#6B7280" },

    toggleTrack: {
      width: 38, height: 22, borderRadius: 11,
      backgroundColor: "#E5E7EB",
      justifyContent: "center",
      paddingHorizontal: 2,
    },
    toggleTrackOn: { backgroundColor: "#1565C0" },
    toggleThumb: {
      width: 18, height: 18, borderRadius: 9,
      backgroundColor: "#FFF",
      shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2, shadowRadius: 2, elevation: 2,
    },
    toggleThumbOn: { alignSelf: "flex-end" },
    divider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 8 },

    /* Dates */
    datesRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 4,
    },
    dateGroup: { flex: 1, gap: 6 },
    dateGroupLabel: { fontSize: 9, fontFamily: "Inter_700Bold", color: "#9CA3AF", letterSpacing: 1.5 },
    dateChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: "#EEF4FF",
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 8,
      alignSelf: "flex-start",
    },
    dateChipText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#1565C0" },
    timeChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: "#F9FAFB",
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 6,
      alignSelf: "flex-start",
      borderWidth: 1,
      borderColor: "#E5E7EB",
    },
    timeChipText: { fontSize: 12, fontFamily: "Inter_500Medium", color: "#374151" },
    durationBadge: {
      alignItems: "center",
      gap: 2,
      paddingHorizontal: 6,
    },
    durationText: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#1565C0" },

    /* Age */
    ageRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8 },
    ageText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", color: "#374151" },
    agePicker: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 6,
      paddingLeft: 48,
    },
    agePickerLabel: { fontSize: 13, fontFamily: "Inter_500Medium", color: "#374151" },
    ageCounter: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#EEF4FF",
      borderRadius: 12,
      overflow: "hidden",
    },
    counterBtn: { width: 34, height: 34, alignItems: "center", justifyContent: "center" },
    counterNum: {
      fontSize: 16, fontFamily: "Inter_700Bold", color: "#1565C0",
      minWidth: 36, textAlign: "center",
    },

    /* Search CTA */
    searchBtn: { marginTop: 14, borderRadius: 18, overflow: "hidden" },
    searchBtnGrad: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 16,
      paddingHorizontal: 24,
    },
    searchBtnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#FFF", flex: 1, textAlign: "center" },
    searchBtnArrow: {
      width: 30, height: 30, borderRadius: 15,
      backgroundColor: "#FFF",
      alignItems: "center", justifyContent: "center",
    },

    /* Sections */
    sectionHead: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 12,
    },
    sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#1A1A2E" },
    sectionLink: { fontSize: 13, fontFamily: "Inter_500Medium", color: "#1565C0" },

    /* Why grid */
    whyGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: 12,
      gap: 8,
      marginBottom: 8,
    },
    whyCard: {
      width: (width - 40) / 2,
      borderRadius: 16,
      padding: 14,
      marginHorizontal: 4,
    },
    whyIconWrap: {
      width: 40, height: 40, borderRadius: 12,
      backgroundColor: "#EEF4FF",
      alignItems: "center", justifyContent: "center",
      marginBottom: 10,
    },
    whyTitle: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#1A1A2E", marginBottom: 4 },
    whyBody: { fontSize: 11, fontFamily: "Inter_400Regular", color: "#6B7280", lineHeight: 16 },

    /* Modals */
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
    timeSheet: {
      backgroundColor: "#FFF",
      borderTopLeftRadius: 24, borderTopRightRadius: 24,
      padding: 20, maxHeight: "60%",
    },
    handle: {
      width: 36, height: 4, borderRadius: 2,
      backgroundColor: "#E5E7EB",
      alignSelf: "center", marginBottom: 16,
    },
    sheetTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold", color: "#1A1A2E", marginBottom: 12 },
    timeItem: {
      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
      padding: 14, borderRadius: 12, marginBottom: 2,
    },
    timeItemSel: { backgroundColor: "#EEF4FF" },
    timeItemTxt: { fontSize: 16, fontFamily: "Inter_400Regular", color: "#1A1A2E" },
    timeItemTxtSel: { fontFamily: "Inter_600SemiBold", color: "#1565C0" },
  });
