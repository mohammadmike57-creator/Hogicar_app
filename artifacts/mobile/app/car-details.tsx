import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { useColors } from "@/hooks/useColors";
import { useBooking } from "@/context/BookingContext";
import ImageCarousel from "@/components/ImageCarousel";
import InsuranceWidget from "@/components/InsuranceWidget";

const INSURANCE_DAILY = 18;

const INCLUDED = [
  "Third-Party Liability",
  "Theft Protection",
  "Collision Damage Waiver",
  "Unlimited Mileage",
  "Breakdown Assistance",
];
const EXTRA = [
  "Full Coverage Insurance",
  "GPS Navigation",
  "Child Safety Seat",
  "Additional Driver",
];

function rentalDays(pickup: Date, dropoff: Date) {
  return Math.max(1, Math.round((dropoff.getTime() - pickup.getTime()) / 86400000));
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function ratingLabel(r: number) {
  if (r >= 9) return "Exceptional";
  if (r >= 8.5) return "Superb";
  if (r >= 8) return "Excellent";
  if (r >= 7.5) return "Very Good";
  return "Good";
}

export default function CarDetailsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { selectedCar, addInsurance, setAddInsurance, searchParams } = useBooking();
  const s = styles(colors);

  if (!selectedCar) {
    router.back();
    return null;
  }

  const days = rentalDays(searchParams.pickupDate, searchParams.dropoffDate);
  const insuranceTotal = addInsurance ? INSURANCE_DAILY * days : 0;
  const total = selectedCar.priceTotal + insuranceTotal;
  const bottomPad = Platform.OS === "web" ? 100 : insets.bottom + 80;

  function handleBook() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/checkout");
  }

  return (
    <View style={s.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad }}
      >
        <ImageCarousel images={selectedCar.images} />

        <View style={s.headerSection}>
          <View style={s.titleRow}>
            <View style={s.nameBlock}>
              <Text style={s.carName}>{selectedCar.name}</Text>
              <Text style={s.orSimilar}>or similar · {selectedCar.type}</Text>
            </View>
            <View style={[s.supplierBadge, { backgroundColor: selectedCar.supplierColor + "22" }]}>
              <Text style={[s.supplierInitials, { color: selectedCar.supplierColor }]}>
                {selectedCar.supplierInitials}
              </Text>
            </View>
          </View>

          <View style={s.ratingRow}>
            <View style={s.ratingBadge}>
              <Text style={s.ratingNum}>{selectedCar.rating.toFixed(1)}</Text>
            </View>
            <Text style={s.ratingLabel}>{ratingLabel(selectedCar.rating)}</Text>
            <Text style={s.reviewCount}>({selectedCar.reviewCount.toLocaleString()} reviews)</Text>
          </View>

          {/* Specs Grid */}
          <View style={s.specsGrid}>
            <SpecItem icon="users" label={`${selectedCar.seats} seats`} colors={colors} />
            <SpecItem icon="briefcase" label={`${selectedCar.bags} bags`} colors={colors} />
            <SpecItem icon="settings" label={selectedCar.transmission} colors={colors} />
            {selectedCar.hasAircon && <SpecItem icon="wind" label="Air con" colors={colors} />}
            <SpecItem icon="droplet" label={selectedCar.fuelType} colors={colors} />
            <SpecItem icon="map" label={selectedCar.mileage} colors={colors} />
          </View>
        </View>

        {/* Location Details */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Pickup Details</Text>
          <View style={s.locationCard}>
            <View style={s.locationRow}>
              <View style={s.locationIcon}>
                <Feather name="map-pin" size={16} color={colors.primary} />
              </View>
              <View>
                <Text style={s.locationLabel}>Pickup location</Text>
                <Text style={s.locationValue}>{searchParams.pickupLocation || "Airport Terminal"}</Text>
              </View>
            </View>
            <View style={s.locationDivider} />
            <View style={s.locationRow}>
              <View style={s.locationIcon}>
                <Feather name="navigation" size={16} color={colors.primary} />
              </View>
              <View>
                <Text style={s.locationLabel}>Counter type</Text>
                <Text style={s.locationValue}>{selectedCar.pickupType}</Text>
              </View>
            </View>
            <View style={s.locationDivider} />
            <View style={s.infoRow}>
              <View style={s.infoItem}>
                <Text style={s.infoLabel}>Pickup</Text>
                <Text style={s.infoValue}>{formatDate(searchParams.pickupDate)} {searchParams.pickupTime}</Text>
              </View>
              <View style={s.infoItem}>
                <Text style={s.infoLabel}>Return</Text>
                <Text style={s.infoValue}>{formatDate(searchParams.dropoffDate)} {searchParams.dropoffTime}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* What's Included */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>What's Included</Text>
          <View style={s.inclusionCard}>
            {INCLUDED.map((item) => (
              <View key={item} style={s.inclusionRow}>
                <Feather name="check-circle" size={16} color={colors.success} />
                <Text style={s.inclusionText}>{item}</Text>
              </View>
            ))}
          </View>
          <Text style={[s.sectionTitle, { marginTop: 16 }]}>What's Extra</Text>
          <View style={s.inclusionCard}>
            {EXTRA.map((item) => (
              <View key={item} style={s.inclusionRow}>
                <Feather name="plus-circle" size={16} color={colors.mutedForeground} />
                <Text style={[s.inclusionText, { color: colors.mutedForeground }]}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Insurance Widget */}
        <Text style={[s.sectionTitle, { paddingHorizontal: 16 }]}>Add Protection</Text>
        <InsuranceWidget
          added={addInsurance}
          onToggle={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setAddInsurance(!addInsurance);
          }}
          pricePerDay={INSURANCE_DAILY}
        />
      </ScrollView>

      {/* Bottom Book Bar */}
      <View style={[s.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View>
          <Text style={s.totalLabel}>Total Price</Text>
          <Text style={s.totalPrice}>${total}</Text>
          <Text style={s.totalSub}>{days} days · all fees included</Text>
        </View>
        <TouchableOpacity style={s.bookBtn} onPress={handleBook} activeOpacity={0.85}>
          <Text style={s.bookBtnText}>Book Now</Text>
          <Feather name="arrow-right" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SpecItem({ icon, label, colors }: { icon: any; label: string; colors: any }) {
  return (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.muted,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 8,
    }}>
      <Feather name={icon} size={14} color={colors.mutedForeground} />
      <Text style={{ fontSize: 12, fontFamily: "Inter_500Medium", color: colors.foreground }}>
        {label}
      </Text>
    </View>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    headerSection: {
      padding: 16,
      backgroundColor: "#FFF",
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    titleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    nameBlock: { flex: 1 },
    carName: { fontSize: 22, fontFamily: "Inter_700Bold", color: colors.foreground },
    orSimilar: { fontSize: 13, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: 2 },
    supplierBadge: {
      width: 40, height: 40, borderRadius: 10,
      alignItems: "center", justifyContent: "center",
    },
    supplierInitials: { fontSize: 14, fontFamily: "Inter_700Bold" },
    ratingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 14,
    },
    ratingBadge: {
      backgroundColor: colors.primary,
      borderRadius: 6,
      paddingHorizontal: 7,
      paddingVertical: 3,
    },
    ratingNum: { color: "#FFF", fontSize: 13, fontFamily: "Inter_700Bold" },
    ratingLabel: { fontSize: 14, fontFamily: "Inter_500Medium", color: colors.foreground },
    reviewCount: { fontSize: 12, fontFamily: "Inter_400Regular", color: colors.mutedForeground },
    specsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    section: { padding: 16 },
    sectionTitle: {
      fontSize: 17,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 12,
    },
    locationCard: {
      backgroundColor: "#FFF",
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    locationRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 14,
    },
    locationIcon: {
      width: 36, height: 36,
      borderRadius: 10,
      backgroundColor: colors.secondary,
      alignItems: "center",
      justifyContent: "center",
    },
    locationLabel: { fontSize: 11, fontFamily: "Inter_400Regular", color: colors.mutedForeground },
    locationValue: { fontSize: 14, fontFamily: "Inter_500Medium", color: colors.foreground },
    locationDivider: { height: 1, backgroundColor: colors.border, marginHorizontal: 14 },
    infoRow: {
      flexDirection: "row",
      padding: 14,
      gap: 20,
    },
    infoItem: { flex: 1 },
    infoLabel: { fontSize: 11, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginBottom: 2 },
    infoValue: { fontSize: 13, fontFamily: "Inter_500Medium", color: colors.foreground },
    inclusionCard: {
      backgroundColor: "#FFF",
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      gap: 10,
    },
    inclusionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    inclusionText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
    },
    bottomBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "#FFF",
      borderTopWidth: 1,
      borderTopColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingTop: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 8,
    },
    totalLabel: { fontSize: 12, fontFamily: "Inter_400Regular", color: colors.mutedForeground },
    totalPrice: { fontSize: 26, fontFamily: "Inter_700Bold", color: colors.foreground },
    totalSub: { fontSize: 11, fontFamily: "Inter_400Regular", color: colors.mutedForeground },
    bookBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingHorizontal: 24,
      paddingVertical: 14,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    bookBtnText: { color: "#FFF", fontSize: 16, fontFamily: "Inter_600SemiBold" },
  });
