import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

const BADGES = [
  { icon: "shield" as const, label: "No Hidden Fees" },
  { icon: "clock" as const, label: "24/7 Support" },
  { icon: "x-circle" as const, label: "Free Cancellation" },
  { icon: "check-circle" as const, label: "Best Price Guarantee" },
  { icon: "lock" as const, label: "Secure Booking" },
];

export default function TrustBadges() {
  const colors = useColors();
  const s = styles(colors);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.container}
    >
      {BADGES.map((b) => (
        <View key={b.label} style={s.badge}>
          <Feather name={b.icon} size={16} color={colors.primary} />
          <Text style={s.label}>{b.label}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      gap: 8,
      paddingVertical: 4,
    },
    badge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.secondary,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    label: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: colors.primary,
    },
  });
