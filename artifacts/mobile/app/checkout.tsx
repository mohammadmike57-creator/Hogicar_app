import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { useColors } from "@/hooks/useColors";
import { useBooking } from "@/context/BookingContext";
import StepIndicator from "@/components/StepIndicator";

const INSURANCE_DAILY = 18;

function rentalDays(pickup: Date, dropoff: Date) {
  return Math.max(1, Math.round((dropoff.getTime() - pickup.getTime()) / 86400000));
}

function formatCard(raw: string) {
  return raw.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(raw: string) {
  const clean = raw.replace(/\D/g, "").slice(0, 4);
  if (clean.length >= 3) return clean.slice(0, 2) + "/" + clean.slice(2);
  return clean;
}

export default function CheckoutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    selectedCar, addInsurance, searchParams,
    driverName, setDriverName,
    driverEmail, setDriverEmail,
    driverPhone, setDriverPhone,
    flightNumber, setFlightNumber,
    setBookingRef,
  } = useBooking();

  const [step, setStep] = useState(0);
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const s = styles(colors);

  if (!selectedCar) { router.back(); return null; }

  const days = rentalDays(searchParams.pickupDate, searchParams.dropoffDate);
  const insuranceTotal = addInsurance ? INSURANCE_DAILY * days : 0;
  const baseTotal = selectedCar.priceTotal;
  const taxes = Math.round(baseTotal * 0.12);
  const grandTotal = baseTotal + insuranceTotal + taxes;

  function validateStep0() {
    const e: Record<string, string> = {};
    if (!driverName.trim()) e.name = "Full name is required";
    if (!driverEmail.trim() || !driverEmail.includes("@")) e.email = "Valid email is required";
    if (!driverPhone.trim() || driverPhone.length < 7) e.phone = "Valid phone number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep1() {
    const e: Record<string, string> = {};
    if (cardNum.replace(/\s/g, "").length < 16) e.card = "Valid card number is required";
    if (expiry.length < 5) e.expiry = "Valid expiry date is required";
    if (cvv.length < 3) e.cvv = "Valid CVV is required";
    if (!nameOnCard.trim()) e.nameOnCard = "Name on card is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (step === 0) {
      if (!validateStep0()) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setStep(1);
    } else if (step === 1) {
      if (!validateStep1()) return;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const ref = "CR" + Date.now().toString().slice(-6).toUpperCase();
      setBookingRef(ref);
      router.replace("/confirmed");
    }
  }

  const bottomPad = Platform.OS === "web" ? 100 : insets.bottom + 80;

  return (
    <View style={s.container}>
      <StepIndicator currentStep={step} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottomPad }} keyboardShouldPersistTaps="handled">
        {/* Booking Summary */}
        <View style={s.summaryCard}>
          <View style={s.summaryHeader}>
            <View>
              <Text style={s.summaryName}>{selectedCar.name}</Text>
              <Text style={s.summarySub}>{selectedCar.supplierName} · {selectedCar.type}</Text>
            </View>
            <View style={[s.supplierBadge, { backgroundColor: selectedCar.supplierColor + "22" }]}>
              <Text style={[s.supplierInitials, { color: selectedCar.supplierColor }]}>
                {selectedCar.supplierInitials}
              </Text>
            </View>
          </View>

          <View style={s.priceRows}>
            <PriceRow label="Base Rental" value={`$${baseTotal}`} colors={colors} />
            {addInsurance && <PriceRow label={`Full Coverage (${days} days × $${INSURANCE_DAILY})`} value={`$${insuranceTotal}`} colors={colors} />}
            <PriceRow label="Local Taxes (12%)" value={`$${taxes}`} colors={colors} />
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Total Due Now</Text>
              <Text style={s.totalValue}>${grandTotal}</Text>
            </View>
            <View style={s.deskRow}>
              <Feather name="info" size={13} color={colors.mutedForeground} />
              <Text style={s.deskText}>Nothing payable at desk</Text>
            </View>
          </View>
        </View>

        {step === 0 ? (
          <View style={s.formSection}>
            <Text style={s.formTitle}>Driver Information</Text>

            <Field
              label="Full Name *"
              value={driverName}
              onChangeText={setDriverName}
              placeholder="John Smith"
              error={errors.name}
              colors={colors}
            />
            <Field
              label="Email Address *"
              value={driverEmail}
              onChangeText={setDriverEmail}
              placeholder="john@example.com"
              keyboardType="email-address"
              error={errors.email}
              colors={colors}
            />
            <Field
              label="Phone Number *"
              value={driverPhone}
              onChangeText={setDriverPhone}
              placeholder="+1 555 000 0000"
              keyboardType="phone-pad"
              error={errors.phone}
              colors={colors}
            />
            <Field
              label="Flight Number (optional)"
              value={flightNumber}
              onChangeText={setFlightNumber}
              placeholder="BA 256"
              colors={colors}
            />
          </View>
        ) : (
          <View style={s.formSection}>
            <Text style={s.formTitle}>Payment Details</Text>

            {/* Apple/Google Pay badges */}
            <View style={s.payBadges}>
              <View style={[s.payBadge, { backgroundColor: "#000" }]}>
                <Feather name="smartphone" size={14} color="#FFF" />
                <Text style={[s.payBadgeText, { color: "#FFF" }]}>Apple Pay</Text>
              </View>
              <View style={[s.payBadge, { borderWidth: 1, borderColor: colors.border }]}>
                <Feather name="credit-card" size={14} color={colors.foreground} />
                <Text style={s.payBadgeText}>Google Pay</Text>
              </View>
            </View>

            <View style={s.orDivider}>
              <View style={s.orLine} />
              <Text style={s.orText}>or pay with card</Text>
              <View style={s.orLine} />
            </View>

            <Field
              label="Card Number *"
              value={cardNum}
              onChangeText={(v) => setCardNum(formatCard(v))}
              placeholder="1234 5678 9012 3456"
              keyboardType="number-pad"
              maxLength={19}
              error={errors.card}
              colors={colors}
              icon="credit-card"
            />
            <View style={s.twoCol}>
              <View style={{ flex: 1 }}>
                <Field
                  label="Expiry Date *"
                  value={expiry}
                  onChangeText={(v) => setExpiry(formatExpiry(v))}
                  placeholder="MM/YY"
                  keyboardType="number-pad"
                  maxLength={5}
                  error={errors.expiry}
                  colors={colors}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Field
                  label="CVV *"
                  value={cvv}
                  onChangeText={(v) => setCvv(v.replace(/\D/g, "").slice(0, 4))}
                  placeholder="123"
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                  error={errors.cvv}
                  colors={colors}
                />
              </View>
            </View>
            <Field
              label="Name on Card *"
              value={nameOnCard}
              onChangeText={setNameOnCard}
              placeholder="John Smith"
              error={errors.nameOnCard}
              colors={colors}
            />

            <View style={s.secureRow}>
              <Feather name="lock" size={14} color={colors.success} />
              <Text style={s.secureText}>Your payment is secured with 256-bit SSL encryption</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[s.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={s.nextBtn} onPress={handleNext} activeOpacity={0.85}>
          <Feather name="lock" size={16} color="#FFF" />
          <Text style={s.nextBtnText}>
            {step === 0 ? "Continue to Payment" : `Confirm & Pay $${grandTotal}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function PriceRow({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
      <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: colors.mutedForeground }}>{label}</Text>
      <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: colors.foreground }}>{value}</Text>
    </View>
  );
}

function Field({
  label, value, onChangeText, placeholder, keyboardType, error, colors, icon,
  maxLength, secureTextEntry,
}: {
  label: string; value: string; onChangeText: (v: string) => void;
  placeholder?: string; keyboardType?: any; error?: string; colors: any;
  icon?: string; maxLength?: number; secureTextEntry?: boolean;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ fontSize: 12, fontFamily: "Inter_500Medium", color: colors.mutedForeground, marginBottom: 6 }}>
        {label}
      </Text>
      <View style={{
        flexDirection: "row", alignItems: "center",
        backgroundColor: colors.input, borderRadius: 12,
        borderWidth: 1.5,
        borderColor: error ? colors.destructive : colors.border,
        paddingHorizontal: 14, gap: 8,
      }}>
        {icon && <Feather name={icon as any} size={16} color={colors.mutedForeground} />}
        <TextInput
          style={{
            flex: 1, paddingVertical: 13,
            fontSize: 15, fontFamily: "Inter_400Regular", color: colors.foreground,
          }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          keyboardType={keyboardType}
          autoCapitalize="none"
          maxLength={maxLength}
          secureTextEntry={secureTextEntry}
        />
      </View>
      {error && (
        <Text style={{ fontSize: 12, color: colors.destructive, marginTop: 4, fontFamily: "Inter_400Regular" }}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F7FB" },
    summaryCard: {
      backgroundColor: "#FFF",
      marginHorizontal: 16,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    summaryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
      paddingBottom: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    summaryName: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: colors.foreground },
    summarySub: { fontSize: 13, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: 2 },
    supplierBadge: {
      width: 36, height: 36, borderRadius: 8,
      alignItems: "center", justifyContent: "center",
    },
    supplierInitials: { fontSize: 13, fontFamily: "Inter_700Bold" },
    priceRows: { gap: 2 },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: 10,
      marginTop: 6,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    totalLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: colors.foreground },
    totalValue: { fontSize: 18, fontFamily: "Inter_700Bold", color: colors.foreground },
    deskRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 4,
    },
    deskText: { fontSize: 12, fontFamily: "Inter_400Regular", color: colors.mutedForeground },
    formSection: {
      backgroundColor: "#FFF",
      marginHorizontal: 16,
      borderRadius: 16,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    formTitle: {
      fontSize: 17,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 16,
    },
    payBadges: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 16,
    },
    payBadge: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      padding: 12,
      borderRadius: 12,
    },
    payBadgeText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    orDivider: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 16,
    },
    orLine: { flex: 1, height: 1, backgroundColor: colors.border },
    orText: { fontSize: 12, fontFamily: "Inter_400Regular", color: colors.mutedForeground },
    twoCol: { flexDirection: "row", gap: 12 },
    secureRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "#F0FDF4",
      borderRadius: 8,
      padding: 10,
      marginTop: 4,
    },
    secureText: {
      flex: 1,
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.success,
    },
    bottomBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "#FFF",
      paddingHorizontal: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 8,
    },
    nextBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: 14,
      padding: 16,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    nextBtnText: {
      color: "#FFF",
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
    },
  });
