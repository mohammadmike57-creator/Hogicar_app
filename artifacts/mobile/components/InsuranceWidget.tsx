import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

interface InsuranceWidgetProps {
  added: boolean;
  onToggle: () => void;
  pricePerDay: number;
}

const BENEFITS = [
  "Deductible reduced to $0",
  "Window & tyre damage covered",
  "Roadside assistance 24/7",
  "Personal accident insurance",
];

export default function InsuranceWidget({ added, onToggle, pricePerDay }: InsuranceWidgetProps) {
  const colors = useColors();
  const s = styles(colors);
  return (
    <View style={[s.card, added && s.cardActive]}>
      <View style={s.header}>
        <View style={s.iconBg}>
          <Feather name="shield" size={22} color={added ? colors.primary : colors.mutedForeground} />
        </View>
        <View style={s.titleBlock}>
          <Text style={s.title}>Full Coverage Insurance</Text>
          <Text style={s.price}>+${pricePerDay}/day extra</Text>
        </View>
        <TouchableOpacity
          style={[s.checkbox, added && s.checkboxActive]}
          onPress={onToggle}
        >
          {added && <Feather name="check" size={14} color="#FFF" />}
        </TouchableOpacity>
      </View>

      <View style={s.benefits}>
        {BENEFITS.map((b) => (
          <View key={b} style={s.benefitRow}>
            <Feather name="check-circle" size={14} color={colors.success} />
            <Text style={s.benefitText}>{b}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={[s.addBtn, added && s.addBtnActive]} onPress={onToggle}>
        <Text style={[s.addBtnText, added && s.addBtnTextActive]}>
          {added ? "Protection Added" : "Add Protection"}
        </Text>
        {added && <Feather name="check" size={16} color={colors.primary} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1.5,
      borderColor: colors.border,
      margin: 16,
    },
    cardActive: {
      borderColor: colors.primary,
      backgroundColor: colors.secondary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 14,
    },
    iconBg: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    titleBlock: { flex: 1 },
    title: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    price: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    checkboxActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    benefits: {
      gap: 8,
      marginBottom: 16,
    },
    benefitRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    benefitText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
    },
    addBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: 12,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    addBtnActive: {
      backgroundColor: "transparent",
    },
    addBtnText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },
    addBtnTextActive: {
      color: colors.primary,
    },
  });
