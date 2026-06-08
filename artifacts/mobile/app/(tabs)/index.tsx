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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useColors } from "@/hooks/useColors";
import { useBooking } from "@/context/BookingContext";
import TrustBadges from "@/components/TrustBadges";
import CategoryGrid from "@/components/CategoryGrid";
import DatePickerModal from "@/components/DatePickerModal";
import LocationSearchModal from "@/components/LocationSearchModal";
import { Location } from "@/data/mockLocations";

const TIMES = [
  "06:00","07:00","08:00","09:00","10:00","11:00",
  "12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00",
];

function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function rentalDays(pickup: Date, dropoff: Date) {
  return Math.max(1, Math.round((dropoff.getTime() - pickup.getTime()) / 86400000));
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { searchParams, setSearchParams } = useBooking();
  const s = styles(colors);

  const [locationModal, setLocationModal] = useState<"pickup" | "return" | null>(null);
  const [showPickupDate, setShowPickupDate] = useState(false);
  const [showDropoffDate, setShowDropoffDate] = useState(false);
  const [showPickupTime, setShowPickupTime] = useState(false);
  const [showDropoffTime, setShowDropoffTime] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  // Check if onboarding has been seen
  useEffect(() => {
    (async () => {
      const done = await AsyncStorage.getItem("@onboarding_done");
      if (!done) {
        router.replace("/onboarding");
      }
    })();
  }, []);

  function handleSearch() {
    if (!searchParams.pickupLocation) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/results");
  }

  function handleLocationSelect(loc: Location) {
    if (locationModal === "pickup") {
      const newReturn = searchParams.sameReturnLocation ? loc.name : searchParams.returnLocation;
      setSearchParams({ ...searchParams, pickupLocation: loc.name, returnLocation: newReturn });
    } else {
      setSearchParams({ ...searchParams, returnLocation: loc.name });
    }
    setLocationModal(null);
  }

  const days = rentalDays(searchParams.pickupDate, searchParams.dropoffDate);

  return (
    <View style={[s.container, { paddingTop: topPad }]}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting} allowFontScaling={false}>Find your perfect ride</Text>
            <Text style={s.sub} allowFontScaling={false}>Compare 1000s of car rental deals</Text>
          </View>
          <View style={s.avatar}>
            <Feather name="user" size={20} color={colors.primary} />
          </View>
        </View>

        {/* Search Card */}
        <View style={s.searchCard}>
          <Text style={s.cardTitle} allowFontScaling={false}>Search Cars</Text>

          {/* Pickup Location */}
          <TouchableOpacity
            style={s.inputRow}
            onPress={() => setLocationModal("pickup")}
            activeOpacity={0.7}
          >
            <View style={s.fieldIcon}>
              <Feather name="map-pin" size={16} color={colors.primary} />
            </View>
            <View style={s.inputContent}>
              <Text style={s.inputLabel} allowFontScaling={false}>Pickup Location</Text>
              <Text
                style={[s.inputValue, !searchParams.pickupLocation && s.placeholder]}
                allowFontScaling={false}
                numberOfLines={1}
              >
                {searchParams.pickupLocation || "City, airport or station"}
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.border} />
          </TouchableOpacity>

          {/* Same location toggle */}
          <TouchableOpacity
            style={s.sameLocRow}
            onPress={() => {
              const next = !searchParams.sameReturnLocation;
              setSearchParams({
                ...searchParams,
                sameReturnLocation: next,
                returnLocation: next ? searchParams.pickupLocation : "",
              });
            }}
            activeOpacity={0.7}
          >
            <View style={[s.toggle, searchParams.sameReturnLocation && s.toggleOn]}>
              <View style={[s.toggleThumb, searchParams.sameReturnLocation && s.toggleThumbOn]} />
            </View>
            <Text style={s.sameLocText} allowFontScaling={false}>Return car to same location</Text>
          </TouchableOpacity>

          {/* Return Location */}
          {!searchParams.sameReturnLocation && (
            <TouchableOpacity
              style={s.inputRow}
              onPress={() => setLocationModal("return")}
              activeOpacity={0.7}
            >
              <View style={[s.fieldIcon, { backgroundColor: colors.muted }]}>
                <Feather name="map-pin" size={16} color={colors.mutedForeground} />
              </View>
              <View style={s.inputContent}>
                <Text style={s.inputLabel} allowFontScaling={false}>Return Location</Text>
                <Text
                  style={[s.inputValue, !searchParams.returnLocation && s.placeholder]}
                  allowFontScaling={false}
                  numberOfLines={1}
                >
                  {searchParams.returnLocation || "City, airport or station"}
                </Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.border} />
            </TouchableOpacity>
          )}

          <View style={s.divider} />

          {/* Dates */}
          <View style={s.dateRow}>
            <TouchableOpacity style={s.dateBlock} onPress={() => setShowPickupDate(true)} activeOpacity={0.7}>
              <View style={[s.fieldIcon, { backgroundColor: colors.secondary }]}>
                <Feather name="calendar" size={15} color={colors.primary} />
              </View>
              <View>
                <Text style={s.inputLabel} allowFontScaling={false}>Pickup</Text>
                <Text style={s.dateValue} allowFontScaling={false}>{formatDate(searchParams.pickupDate)}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={s.timeChip} onPress={() => setShowPickupTime(true)} activeOpacity={0.7}>
              <Feather name="clock" size={13} color={colors.primary} />
              <Text style={s.timeValue} allowFontScaling={false}>{searchParams.pickupTime}</Text>
            </TouchableOpacity>
          </View>

          <View style={s.dateSep} />

          <View style={s.dateRow}>
            <TouchableOpacity style={s.dateBlock} onPress={() => setShowDropoffDate(true)} activeOpacity={0.7}>
              <View style={[s.fieldIcon, { backgroundColor: colors.muted }]}>
                <Feather name="calendar" size={15} color={colors.mutedForeground} />
              </View>
              <View>
                <Text style={s.inputLabel} allowFontScaling={false}>Drop-off · {days} {days === 1 ? "day" : "days"}</Text>
                <Text style={s.dateValue} allowFontScaling={false}>{formatDate(searchParams.dropoffDate)}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={s.timeChip} onPress={() => setShowDropoffTime(true)} activeOpacity={0.7}>
              <Feather name="clock" size={13} color={colors.primary} />
              <Text style={s.timeValue} allowFontScaling={false}>{searchParams.dropoffTime}</Text>
            </TouchableOpacity>
          </View>

          <View style={s.divider} />

          {/* Driver Age */}
          <TouchableOpacity
            style={s.ageRow}
            onPress={() => setSearchParams({
              ...searchParams,
              driverAgeUnder30OrOver65: !searchParams.driverAgeUnder30OrOver65,
            })}
            activeOpacity={0.7}
          >
            <View style={[s.fieldIcon, { backgroundColor: colors.muted }]}>
              <Feather name="user" size={15} color={colors.mutedForeground} />
            </View>
            <Text style={s.ageText} allowFontScaling={false}>Driver aged 30–65</Text>
            <View style={[s.toggle, !searchParams.driverAgeUnder30OrOver65 && s.toggleOn]}>
              <View style={[s.toggleThumb, !searchParams.driverAgeUnder30OrOver65 && s.toggleThumbOn]} />
            </View>
          </TouchableOpacity>

          {searchParams.driverAgeUnder30OrOver65 && (
            <View style={s.ageInputRow}>
              <Text style={s.ageLabel} allowFontScaling={false}>Driver's age</Text>
              <View style={s.ageCounter}>
                <TouchableOpacity
                  onPress={() => setSearchParams({ ...searchParams, driverAge: Math.max(18, searchParams.driverAge - 1) })}
                  style={s.counterBtn}
                >
                  <Feather name="minus" size={15} color={colors.foreground} />
                </TouchableOpacity>
                <Text style={s.ageNum} allowFontScaling={false}>{searchParams.driverAge}</Text>
                <TouchableOpacity
                  onPress={() => setSearchParams({ ...searchParams, driverAge: Math.min(99, searchParams.driverAge + 1) })}
                  style={s.counterBtn}
                >
                  <Feather name="plus" size={15} color={colors.foreground} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Search Button */}
          <TouchableOpacity
            style={[s.searchBtn, !searchParams.pickupLocation && s.searchBtnDisabled]}
            onPress={handleSearch}
            activeOpacity={0.85}
          >
            <Feather name="search" size={18} color="#FFF" />
            <Text style={s.searchBtnText} allowFontScaling={false}>Search Cars</Text>
          </TouchableOpacity>
        </View>

        {/* Trust Badges */}
        <View style={{ marginTop: 20 }}>
          <TrustBadges />
        </View>

        {/* Categories */}
        <View style={{ marginTop: 24, marginBottom: 40 }}>
          <CategoryGrid
            onSelect={() => {
              if (searchParams.pickupLocation) {
                router.push("/results");
              } else {
                setLocationModal("pickup");
              }
            }}
          />
        </View>
      </ScrollView>

      {/* Location Search Modal (full screen, professional) */}
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

      {/* Time Picker — Pickup */}
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
                style={[s.timeItem, searchParams.pickupTime === item && s.timeItemSelected]}
                onPress={() => { setSearchParams({ ...searchParams, pickupTime: item }); setShowPickupTime(false); }}
              >
                <Text style={[s.timeItemText, searchParams.pickupTime === item && s.timeItemTextSelected]} allowFontScaling={false}>
                  {item}
                </Text>
                {searchParams.pickupTime === item && <Feather name="check" size={16} color={colors.primary} />}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* Time Picker — Dropoff */}
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
                style={[s.timeItem, searchParams.dropoffTime === item && s.timeItemSelected]}
                onPress={() => { setSearchParams({ ...searchParams, dropoffTime: item }); setShowDropoffTime(false); }}
              >
                <Text style={[s.timeItemText, searchParams.dropoffTime === item && s.timeItemTextSelected]} allowFontScaling={false}>
                  {item}
                </Text>
                {searchParams.dropoffTime === item && <Feather name="check" size={16} color={colors.primary} />}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* Date Pickers */}
      <DatePickerModal
        visible={showPickupDate}
        value={searchParams.pickupDate}
        title="Pickup Date"
        onClose={() => setShowPickupDate(false)}
        onSelect={(d) => {
          const newDropoff = d >= searchParams.dropoffDate
            ? new Date(d.getTime() + 7 * 86400000)
            : searchParams.dropoffDate;
          setSearchParams({ ...searchParams, pickupDate: d, dropoffDate: newDropoff });
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

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F7FB" },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 20,
    },
    greeting: { fontSize: 24, fontFamily: "Inter_700Bold", color: "#1A1A2E" },
    sub: { fontSize: 14, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: 2 },
    avatar: {
      width: 42, height: 42, borderRadius: 21,
      backgroundColor: colors.secondary,
      alignItems: "center", justifyContent: "center",
      borderWidth: 1.5, borderColor: colors.primary + "30",
    },
    searchCard: {
      backgroundColor: "#FFF",
      marginHorizontal: 16,
      borderRadius: 22,
      padding: 18,
      shadowColor: "#1565C0",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
      elevation: 6,
      marginBottom: 8,
    },
    cardTitle: {
      fontSize: 17,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: 14,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 10,
    },
    fieldIcon: {
      width: 34, height: 34, borderRadius: 10,
      backgroundColor: colors.secondary,
      alignItems: "center", justifyContent: "center",
    },
    inputContent: { flex: 1 },
    inputLabel: { fontSize: 11, fontFamily: "Inter_500Medium", color: colors.mutedForeground },
    inputValue: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: colors.foreground, marginTop: 1 },
    placeholder: { color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
    sameLocRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 8,
    },
    sameLocText: { fontSize: 13, fontFamily: "Inter_400Regular", color: colors.foreground, flex: 1 },
    toggle: {
      width: 44, height: 24, borderRadius: 12,
      backgroundColor: colors.border,
      justifyContent: "center",
      paddingHorizontal: 2,
    },
    toggleOn: { backgroundColor: colors.primary },
    toggleThumb: {
      width: 20, height: 20, borderRadius: 10,
      backgroundColor: "#FFF",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 2,
      elevation: 2,
    },
    toggleThumbOn: { alignSelf: "flex-end" },
    divider: { height: 1, backgroundColor: colors.border + "80", marginVertical: 4 },
    dateSep: { height: 1, backgroundColor: colors.border + "40", marginVertical: 2, marginLeft: 46 },
    dateRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 8,
    },
    dateBlock: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    dateValue: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginTop: 1,
    },
    timeChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: colors.secondary,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    timeValue: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },
    ageRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 10,
    },
    ageText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", color: colors.foreground },
    ageInputRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 8,
      paddingLeft: 46,
    },
    ageLabel: { fontSize: 14, fontFamily: "Inter_500Medium", color: colors.foreground },
    ageCounter: {
      flexDirection: "row",
      alignItems: "center",
      gap: 0,
      backgroundColor: colors.muted,
      borderRadius: 12,
      overflow: "hidden",
    },
    counterBtn: {
      width: 36, height: 36,
      alignItems: "center", justifyContent: "center",
    },
    ageNum: {
      fontSize: 17, fontFamily: "Inter_700Bold", color: colors.foreground,
      minWidth: 42, textAlign: "center",
    },
    searchBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: 16,
      padding: 16,
      marginTop: 14,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 6,
    },
    searchBtnDisabled: { opacity: 0.6 },
    searchBtnText: { color: "#FFF", fontSize: 16, fontFamily: "Inter_700Bold" },
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
    timeSheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      maxHeight: "60%",
    },
    handle: {
      width: 36, height: 4, borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: "center", marginBottom: 16,
    },
    sheetTitle: {
      fontSize: 18, fontFamily: "Inter_600SemiBold",
      color: colors.foreground, marginBottom: 12,
    },
    timeItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 14,
      borderRadius: 12,
      marginBottom: 2,
    },
    timeItemSelected: { backgroundColor: colors.secondary },
    timeItemText: {
      fontSize: 16, fontFamily: "Inter_400Regular",
      color: colors.foreground,
    },
    timeItemTextSelected: { fontFamily: "Inter_600SemiBold", color: colors.primary },
  });
