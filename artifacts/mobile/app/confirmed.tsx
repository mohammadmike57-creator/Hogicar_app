import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { useColors } from "@/hooks/useColors";
import { useBooking } from "@/context/BookingContext";

const INSURANCE_DAILY = 18;

function rentalDays(pickup: Date, dropoff: Date) {
  return Math.max(1, Math.round((dropoff.getTime() - pickup.getTime()) / 86400000));
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function ConfirmedScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { selectedCar, addInsurance, searchParams, bookingRef, driverName, driverEmail } = useBooking();
  const s = styles(colors);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 8 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  if (!selectedCar) {
    router.replace("/");
    return null;
  }

  const days = rentalDays(searchParams.pickupDate, searchParams.dropoffDate);
  const insuranceTotal = addInsurance ? INSURANCE_DAILY * days : 0;
  const baseTotal = selectedCar.priceTotal;
  const taxes = Math.round(baseTotal * 0.12);
  const grandTotal = baseTotal + insuranceTotal + taxes;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 50 : insets.bottom + 20;

  return (
    <View style={[s.container, { paddingTop: topPad }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: bottomPad }} showsVerticalScrollIndicator={false}>
        {/* Success Animation */}
        <View style={s.successSection}>
          <Animated.View style={[s.checkCircle, { transform: [{ scale: scaleAnim }] }]}>
            <Feather name="check" size={40} color="#FFF" />
          </Animated.View>
          <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
            <Text style={s.confirmedTitle}>Booking Confirmed!</Text>
            <Text style={s.confirmedSub}>Your car has been reserved successfully</Text>
            <View style={s.refBadge}>
              <Text style={s.refLabel}>Booking Reference</Text>
              <Text style={s.refNum}>{bookingRef}</Text>
            </View>
          </Animated.View>
        </View>

        {/* Email notice */}
        <Animated.View style={[s.emailNotice, { opacity: fadeAnim }]}>
          <Feather name="mail" size={16} color={colors.primary} />
          <Text style={s.emailText}>
            Confirmation sent to <Text style={s.emailBold}>{driverEmail || "your email"}</Text>
          </Text>
        </Animated.View>

        {/* Booking Details */}
        <View style={s.detailCard}>
          <Text style={s.detailTitle}>Booking Details</Text>

          <DetailRow icon="user" label="Driver" value={driverName || "Driver"} colors={colors} />
          <DetailRow icon="truck" label="Vehicle" value={`${selectedCar.name} or similar`} colors={colors} />
          <DetailRow icon="tag" label="Supplier" value={selectedCar.supplierName} colors={colors} />
          <DetailRow icon="map-pin" label="Pickup" value={searchParams.pickupLocation || "Airport"} colors={colors} />
          <DetailRow icon="navigation" label="Counter" value={selectedCar.pickupType} colors={colors} />
          <DetailRow icon="calendar" label="Pickup Date" value={`${formatDate(searchParams.pickupDate)} at ${searchParams.pickupTime}`} colors={colors} />
          <DetailRow icon="calendar" label="Return Date" value={`${formatDate(searchParams.dropoffDate)} at ${searchParams.dropoffTime}`} colors={colors} />
          <DetailRow icon="clock" label="Duration" value={`${days} ${days === 1 ? "day" : "days"}`} colors={colors} />
          {addInsurance && <DetailRow icon="shield" label="Coverage" value="Full Coverage Insurance" colors={colors} />}
        </View>

        {/* Price Summary */}
        <View style={s.detailCard}>
          <Text style={s.detailTitle}>Price Summary</Text>
          <SummaryRow label="Base Rental" value={`$${baseTotal}`} colors={colors} />
          {addInsurance && <SummaryRow label="Full Coverage" value={`$${insuranceTotal}`} colors={colors} />}
          <SummaryRow label="Taxes & Fees" value={`$${taxes}`} colors={colors} />
          <View style={s.totalDivider} />
          <View style={s.totalFinalRow}>
            <Text style={s.totalFinalLabel}>Total Charged</Text>
            <Text style={s.totalFinalValue}>${grandTotal}</Text>
          </View>
        </View>

        {/* Important Info */}
        <View style={s.infoBox}>
          <Feather name="info" size={16} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={s.infoTitle}>Important Pickup Info</Text>
            <Text style={s.infoText}>
              Please bring your booking confirmation, a valid driver's license, and the credit card used for booking. A deposit of ${selectedCar.deposit} will be held at pickup.
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={s.actions}>
          <TouchableOpacity
            style={s.homeBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.replace("/");
            }}
          >
            <Feather name="home" size={18} color={colors.primary} />
            <Text style={s.homeBtnText}>Back to Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.newSearchBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.replace("/");
            }}
          >
            <Feather name="search" size={18} color="#FFF" />
            <Text style={s.newSearchText}>New Search</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function DetailRow({ icon, label, value, colors }: { icon: any; label: string; value: string; colors: any }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <Feather name={icon} size={15} color={colors.primary} style={{ marginTop: 1 }} />
      <Text style={{ flex: 0.4, fontSize: 13, fontFamily: "Inter_400Regular", color: colors.mutedForeground }}>{label}</Text>
      <Text style={{ flex: 0.6, fontSize: 13, fontFamily: "Inter_500Medium", color: colors.foreground, textAlign: "right" }}>{value}</Text>
    </View>
  );
}

function SummaryRow({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 5 }}>
      <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: colors.mutedForeground }}>{label}</Text>
      <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: colors.foreground }}>{value}</Text>
    </View>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F7FB" },
    successSection: {
      alignItems: "center",
      paddingVertical: 36,
      paddingHorizontal: 24,
      gap: 16,
    },
    checkCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "#15803D",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#15803D",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 8,
    },
    confirmedTitle: {
      fontSize: 26,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginTop: 8,
    },
    confirmedSub: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      marginTop: 4,
    },
    refBadge: {
      marginTop: 16,
      backgroundColor: colors.secondary,
      borderRadius: 14,
      paddingHorizontal: 20,
      paddingVertical: 12,
      alignItems: "center",
    },
    refLabel: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.primary,
      letterSpacing: 0.5,
    },
    refNum: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
      letterSpacing: 2,
      marginTop: 2,
    },
    emailNotice: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.secondary,
      marginHorizontal: 16,
      borderRadius: 10,
      padding: 12,
      marginBottom: 16,
    },
    emailText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.primary,
      flex: 1,
    },
    emailBold: {
      fontFamily: "Inter_600SemiBold",
    },
    detailCard: {
      backgroundColor: "#FFF",
      marginHorizontal: 16,
      borderRadius: 16,
      padding: 16,
      marginBottom: 14,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 2,
    },
    detailTitle: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 12,
    },
    totalDivider: { height: 1, backgroundColor: colors.border, marginVertical: 8 },
    totalFinalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    totalFinalLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: colors.foreground },
    totalFinalValue: { fontSize: 20, fontFamily: "Inter_700Bold", color: colors.foreground },
    infoBox: {
      flexDirection: "row",
      gap: 10,
      backgroundColor: colors.secondary,
      marginHorizontal: 16,
      borderRadius: 12,
      padding: 14,
      marginBottom: 20,
    },
    infoTitle: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
      marginBottom: 4,
    },
    infoText: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      lineHeight: 18,
    },
    actions: {
      flexDirection: "row",
      gap: 10,
      marginHorizontal: 16,
      marginBottom: 10,
    },
    homeBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      padding: 14,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    homeBtnText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },
    newSearchBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      padding: 14,
      borderRadius: 14,
      backgroundColor: colors.primary,
    },
    newSearchText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: "#FFF",
    },
  });
