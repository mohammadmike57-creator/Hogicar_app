import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { useColors } from "@/hooks/useColors";
import { useBooking } from "@/context/BookingContext";
import TrustBadges from "@/components/TrustBadges";
import CategoryGrid from "@/components/CategoryGrid";
import DatePickerModal from "@/components/DatePickerModal";
import { searchLocations, Location } from "@/data/mockLocations";

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

  const [pickupQuery, setPickupQuery] = useState(searchParams.pickupLocation);
  const [returnQuery, setReturnQuery] = useState(searchParams.returnLocation);
  const [locationModal, setLocationModal] = useState<"pickup" | "return" | null>(null);
  const [locationResults, setLocationResults] = useState<Location[]>(searchLocations(""));
  const [showPickupDate, setShowPickupDate] = useState(false);
  const [showDropoffDate, setShowDropoffDate] = useState(false);
  const [showPickupTime, setShowPickupTime] = useState(false);
  const [showDropoffTime, setShowDropoffTime] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  function handleSearch() {
    if (!pickupQuery) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSearchParams({
      ...searchParams,
      pickupLocation: pickupQuery,
      returnLocation: searchParams.sameReturnLocation ? pickupQuery : returnQuery,
    });
    router.push("/results");
  }

  function openLocationModal(type: "pickup" | "return") {
    const q = type === "pickup" ? pickupQuery : returnQuery;
    setLocationResults(searchLocations(q));
    setLocationModal(type);
  }

  function onLocationSearch(q: string) {
    if (locationModal === "pickup") setPickupQuery(q);
    else setReturnQuery(q);
    setLocationResults(searchLocations(q));
  }

  function selectLocation(loc: Location) {
    if (locationModal === "pickup") {
      setPickupQuery(loc.name);
      if (searchParams.sameReturnLocation) setReturnQuery(loc.name);
    } else {
      setReturnQuery(loc.name);
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
            <Text style={s.greeting}>Find your perfect ride</Text>
            <Text style={s.sub}>Compare 1000s of car rental deals</Text>
          </View>
          <View style={s.avatar}>
            <Feather name="user" size={20} color={colors.primary} />
          </View>
        </View>

        {/* Search Card */}
        <View style={s.searchCard}>
          <Text style={s.cardTitle}>Search Cars</Text>

          {/* Pickup Location */}
          <TouchableOpacity style={s.inputRow} onPress={() => openLocationModal("pickup")}>
            <Feather name="map-pin" size={18} color={colors.primary} />
            <View style={s.inputContent}>
              <Text style={s.inputLabel}>Pickup Location</Text>
              <Text style={[s.inputValue, !pickupQuery && s.placeholder]}>
                {pickupQuery || "City, airport or station"}
              </Text>
            </View>
            <Feather name="chevron-down" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>

          {/* Same location toggle */}
          <TouchableOpacity
            style={s.sameLocRow}
            onPress={() => {
              setSearchParams({ ...searchParams, sameReturnLocation: !searchParams.sameReturnLocation });
              if (!searchParams.sameReturnLocation) setReturnQuery(pickupQuery);
            }}
          >
            <View style={[s.toggle, searchParams.sameReturnLocation && s.toggleOn]}>
              <View style={[s.toggleThumb, searchParams.sameReturnLocation && s.toggleThumbOn]} />
            </View>
            <Text style={s.sameLocText}>Return car to same location</Text>
          </TouchableOpacity>

          {/* Return Location */}
          {!searchParams.sameReturnLocation && (
            <TouchableOpacity style={s.inputRow} onPress={() => openLocationModal("return")}>
              <Feather name="map-pin" size={18} color={colors.mutedForeground} />
              <View style={s.inputContent}>
                <Text style={s.inputLabel}>Return Location</Text>
                <Text style={[s.inputValue, !returnQuery && s.placeholder]}>
                  {returnQuery || "City, airport or station"}
                </Text>
              </View>
              <Feather name="chevron-down" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}

          <View style={s.divider} />

          {/* Dates Row */}
          <View style={s.dateRow}>
            <TouchableOpacity style={s.dateBlock} onPress={() => setShowPickupDate(true)}>
              <Feather name="calendar" size={16} color={colors.primary} />
              <View>
                <Text style={s.inputLabel}>Pickup</Text>
                <Text style={s.dateValue}>{formatDate(searchParams.pickupDate)}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={s.timeBlock} onPress={() => setShowPickupTime(true)}>
              <Feather name="clock" size={16} color={colors.mutedForeground} />
              <Text style={s.timeValue}>{searchParams.pickupTime}</Text>
            </TouchableOpacity>
          </View>

          <View style={s.dateRow}>
            <TouchableOpacity style={s.dateBlock} onPress={() => setShowDropoffDate(true)}>
              <Feather name="calendar" size={16} color={colors.mutedForeground} />
              <View>
                <Text style={s.inputLabel}>Drop-off · {days} {days === 1 ? "day" : "days"}</Text>
                <Text style={s.dateValue}>{formatDate(searchParams.dropoffDate)}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={s.timeBlock} onPress={() => setShowDropoffTime(true)}>
              <Feather name="clock" size={16} color={colors.mutedForeground} />
              <Text style={s.timeValue}>{searchParams.dropoffTime}</Text>
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
          >
            <Feather name="user" size={16} color={colors.mutedForeground} />
            <Text style={s.ageText}>Driver aged 30–65</Text>
            <View style={[s.toggle, !searchParams.driverAgeUnder30OrOver65 && s.toggleOn]}>
              <View style={[s.toggleThumb, !searchParams.driverAgeUnder30OrOver65 && s.toggleThumbOn]} />
            </View>
          </TouchableOpacity>

          {searchParams.driverAgeUnder30OrOver65 && (
            <View style={s.ageInputRow}>
              <Text style={s.ageLabel}>Driver's age</Text>
              <View style={s.ageCounter}>
                <TouchableOpacity
                  onPress={() => setSearchParams({ ...searchParams, driverAge: Math.max(18, searchParams.driverAge - 1) })}
                  style={s.counterBtn}
                >
                  <Feather name="minus" size={16} color={colors.foreground} />
                </TouchableOpacity>
                <Text style={s.ageNum}>{searchParams.driverAge}</Text>
                <TouchableOpacity
                  onPress={() => setSearchParams({ ...searchParams, driverAge: Math.min(99, searchParams.driverAge + 1) })}
                  style={s.counterBtn}
                >
                  <Feather name="plus" size={16} color={colors.foreground} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Search Button */}
          <TouchableOpacity style={s.searchBtn} onPress={handleSearch} activeOpacity={0.85}>
            <Feather name="search" size={18} color="#FFF" />
            <Text style={s.searchBtnText}>Search Cars</Text>
          </TouchableOpacity>
        </View>

        {/* Trust Badges */}
        <TrustBadges />

        {/* Categories */}
        <View style={{ marginTop: 24, marginBottom: 32 }}>
          <CategoryGrid
            onSelect={(type) => {
              setSearchParams({ ...searchParams, pickupLocation: pickupQuery || "London Heathrow Airport" });
              router.push("/results");
            }}
          />
        </View>
      </ScrollView>

      {/* Location Modal */}
      <Modal visible={!!locationModal} transparent animationType="slide" onRequestClose={() => setLocationModal(null)}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setLocationModal(null)} />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={s.locationSheet}>
          <View style={s.handle} />
          <Text style={s.locationTitle}>
            {locationModal === "pickup" ? "Pickup Location" : "Return Location"}
          </Text>
          <View style={s.locationSearch}>
            <Feather name="search" size={16} color={colors.mutedForeground} />
            <TextInput
              style={s.locationInput}
              value={locationModal === "pickup" ? pickupQuery : returnQuery}
              onChangeText={onLocationSearch}
              placeholder="Search city or airport..."
              placeholderTextColor={colors.mutedForeground}
              autoFocus
            />
          </View>
          <FlatList
            data={locationResults}
            keyExtractor={(l) => l.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={s.locationItem} onPress={() => selectLocation(item)}>
                <View style={s.locationIcon}>
                  <Feather name={item.type === "airport" ? "navigation" : "map-pin"} size={16} color={colors.primary} />
                </View>
                <View>
                  <Text style={s.locationName}>{item.name}</Text>
                  <Text style={s.locationSub}>{item.subtitle}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
          />
        </KeyboardAvoidingView>
      </Modal>

      {/* Time Picker — Pickup */}
      <Modal visible={showPickupTime} transparent animationType="slide" onRequestClose={() => setShowPickupTime(false)}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setShowPickupTime(false)} />
        <View style={s.timeSheet}>
          <View style={s.handle} />
          <Text style={s.locationTitle}>Pickup Time</Text>
          <FlatList
            data={TIMES}
            keyExtractor={(t) => t}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[s.timeItem, searchParams.pickupTime === item && s.timeItemSelected]}
                onPress={() => { setSearchParams({ ...searchParams, pickupTime: item }); setShowPickupTime(false); }}
              >
                <Text style={[s.timeItemText, searchParams.pickupTime === item && s.timeItemTextSelected]}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* Time Picker — Dropoff */}
      <Modal visible={showDropoffTime} transparent animationType="slide" onRequestClose={() => setShowDropoffTime(false)}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setShowDropoffTime(false)} />
        <View style={s.timeSheet}>
          <View style={s.handle} />
          <Text style={s.locationTitle}>Drop-off Time</Text>
          <FlatList
            data={TIMES}
            keyExtractor={(t) => t}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[s.timeItem, searchParams.dropoffTime === item && s.timeItemSelected]}
                onPress={() => { setSearchParams({ ...searchParams, dropoffTime: item }); setShowDropoffTime(false); }}
              >
                <Text style={[s.timeItemText, searchParams.dropoffTime === item && s.timeItemTextSelected]}>{item}</Text>
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
          const newDropoff = d > searchParams.dropoffDate
            ? new Date(d.getTime() + 7 * 86400000)
            : searchParams.dropoffDate;
          setSearchParams({ ...searchParams, pickupDate: d, dropoffDate: newDropoff });
        }}
      />
      <DatePickerModal
        visible={showDropoffDate}
        value={searchParams.dropoffDate}
        minDate={searchParams.pickupDate}
        title="Drop-off Date"
        onClose={() => setShowDropoffDate(false)}
        onSelect={(d) => setSearchParams({ ...searchParams, dropoffDate: d })}
      />
    </View>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 20,
    },
    greeting: { fontSize: 24, fontFamily: "Inter_700Bold", color: colors.foreground },
    sub: { fontSize: 14, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: 2 },
    avatar: {
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: colors.secondary,
      alignItems: "center", justifyContent: "center",
    },
    searchCard: {
      backgroundColor: "#FFF",
      marginHorizontal: 16,
      borderRadius: 20,
      padding: 18,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 5,
      marginBottom: 20,
    },
    cardTitle: {
      fontSize: 17,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 16,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    inputContent: { flex: 1 },
    inputLabel: { fontSize: 11, fontFamily: "Inter_400Regular", color: colors.mutedForeground },
    inputValue: { fontSize: 15, fontFamily: "Inter_500Medium", color: colors.foreground, marginTop: 1 },
    placeholder: { color: colors.mutedForeground },
    sameLocRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 10,
    },
    sameLocText: { fontSize: 13, fontFamily: "Inter_400Regular", color: colors.foreground, flex: 1 },
    toggle: {
      width: 40, height: 22, borderRadius: 11,
      backgroundColor: colors.border,
      justifyContent: "center",
      paddingHorizontal: 2,
    },
    toggleOn: { backgroundColor: colors.primary },
    toggleThumb: {
      width: 18, height: 18, borderRadius: 9,
      backgroundColor: "#FFF",
    },
    toggleThumbOn: { alignSelf: "flex-end" },
    divider: { height: 1, backgroundColor: colors.border, marginVertical: 8 },
    dateRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 8,
    },
    dateBlock: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    dateValue: {
      fontSize: 14,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
    },
    timeBlock: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.muted,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 7,
    },
    timeValue: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
    },
    ageRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 8,
    },
    ageText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", color: colors.foreground },
    ageInputRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 8,
    },
    ageLabel: { fontSize: 14, fontFamily: "Inter_500Medium", color: colors.foreground },
    ageCounter: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: colors.muted,
      borderRadius: 10,
      paddingHorizontal: 4,
      paddingVertical: 4,
    },
    counterBtn: {
      width: 32, height: 32, borderRadius: 8,
      backgroundColor: "#FFF",
      alignItems: "center", justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      elevation: 1,
    },
    ageNum: { fontSize: 18, fontFamily: "Inter_600SemiBold", color: colors.foreground, minWidth: 30, textAlign: "center" },
    searchBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: 14,
      padding: 16,
      marginTop: 16,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    searchBtnText: { color: "#FFF", fontSize: 16, fontFamily: "Inter_600SemiBold" },
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
    locationSheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      maxHeight: "80%",
    },
    handle: {
      width: 36, height: 4, borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: "center", marginBottom: 16,
    },
    locationTitle: {
      fontSize: 18, fontFamily: "Inter_600SemiBold",
      color: colors.foreground, marginBottom: 14,
    },
    locationSearch: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: colors.muted,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      marginBottom: 12,
    },
    locationInput: {
      flex: 1,
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
    },
    locationItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    locationIcon: {
      width: 36, height: 36, borderRadius: 10,
      backgroundColor: colors.secondary,
      alignItems: "center", justifyContent: "center",
    },
    locationName: { fontSize: 14, fontFamily: "Inter_500Medium", color: colors.foreground },
    locationSub: { fontSize: 12, fontFamily: "Inter_400Regular", color: colors.mutedForeground },
    timeSheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      maxHeight: "60%",
    },
    timeItem: {
      padding: 14,
      borderRadius: 10,
      marginBottom: 4,
    },
    timeItemSelected: { backgroundColor: colors.secondary },
    timeItemText: { fontSize: 16, fontFamily: "Inter_400Regular", color: colors.foreground, textAlign: "center" },
    timeItemTextSelected: { fontFamily: "Inter_600SemiBold", color: colors.primary },
  });
