import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { Car } from "@/data/mockCars";

interface VehicleCardProps {
  car: Car;
  onPress: () => void;
  rentalDays: number;
}

function carImage(key: string) {
  const map: Record<string, any> = {
    sedan: require("@/assets/images/car-sedan.png"),
    suv: require("@/assets/images/car-suv.png"),
    compact: require("@/assets/images/car-compact.png"),
    electric: require("@/assets/images/car-electric.png"),
  };
  return map[key] ?? map["sedan"];
}

function ratingLabel(r: number) {
  if (r >= 9) return "Exceptional";
  if (r >= 8.5) return "Superb";
  if (r >= 8) return "Excellent";
  if (r >= 7.5) return "Very Good";
  return "Good";
}

export default function VehicleCard({ car, onPress, rentalDays }: VehicleCardProps) {
  const colors = useColors();
  const s = styles(colors);
  const dailyRate = Math.round(car.priceTotal / rentalDays);

  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.92}>
      <View style={s.imageWrapper}>
        <Image
          source={carImage(car.images[0])}
          style={s.image}
          resizeMode="contain"
        />
        <View style={[s.typeBadge]}>
          <Text style={s.typeText}>{car.type}</Text>
        </View>
      </View>

      <View style={s.body}>
        <View style={s.headerRow}>
          <View style={s.nameBlock}>
            <Text style={s.carName}>{car.name}</Text>
            <Text style={s.orSimilar}>or similar</Text>
          </View>
          <View style={[s.supplierBadge, { backgroundColor: car.supplierColor + "22" }]}>
            <Text style={[s.supplierInitials, { color: car.supplierColor }]}>
              {car.supplierInitials}
            </Text>
          </View>
        </View>

        <View style={s.ratingRow}>
          <View style={s.ratingBadge}>
            <Text style={s.ratingNum}>{car.rating.toFixed(1)}</Text>
          </View>
          <Text style={s.ratingLabel}>{ratingLabel(car.rating)}</Text>
          <Text style={s.reviewCount}>({car.reviewCount.toLocaleString()} reviews)</Text>
        </View>

        <View style={s.specsRow}>
          <View style={s.spec}>
            <Feather name="users" size={13} color={colors.mutedForeground} />
            <Text style={s.specText}>{car.seats} seats</Text>
          </View>
          <View style={s.spec}>
            <Feather name="briefcase" size={13} color={colors.mutedForeground} />
            <Text style={s.specText}>{car.bags} bags</Text>
          </View>
          {car.hasAircon && (
            <View style={s.spec}>
              <Feather name="wind" size={13} color={colors.mutedForeground} />
              <Text style={s.specText}>A/C</Text>
            </View>
          )}
          <View style={s.spec}>
            <Feather name="settings" size={13} color={colors.mutedForeground} />
            <Text style={s.specText}>{car.transmission}</Text>
          </View>
        </View>

        <View style={s.footer}>
          <View>
            <Text style={s.totalPrice}>${car.priceTotal}</Text>
            <Text style={s.perDay}>${dailyRate}/day · {rentalDays} days</Text>
          </View>
          <TouchableOpacity style={s.dealBtn} onPress={onPress}>
            <Text style={s.dealText}>View Deal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.background,
      borderRadius: 16,
      marginHorizontal: 16,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      overflow: "hidden",
    },
    imageWrapper: {
      backgroundColor: colors.card,
      position: "relative",
    },
    image: {
      width: "100%",
      height: 160,
    },
    typeBadge: {
      position: "absolute",
      top: 10,
      left: 10,
      backgroundColor: colors.primary + "EE",
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    typeText: {
      color: "#FFF",
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
    },
    body: {
      padding: 14,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    nameBlock: {
      flex: 1,
    },
    carName: {
      fontSize: 17,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    orSimilar: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    supplierBadge: {
      width: 36,
      height: 36,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    supplierInitials: {
      fontSize: 13,
      fontFamily: "Inter_700Bold",
    },
    ratingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 10,
    },
    ratingBadge: {
      backgroundColor: colors.primary,
      borderRadius: 6,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    ratingNum: {
      color: "#FFF",
      fontSize: 12,
      fontFamily: "Inter_700Bold",
    },
    ratingLabel: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
    },
    reviewCount: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    specsRow: {
      flexDirection: "row",
      gap: 14,
      marginBottom: 14,
    },
    spec: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    specText: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    totalPrice: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    perDay: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    dealBtn: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingHorizontal: 20,
      paddingVertical: 11,
    },
    dealText: {
      color: "#FFF",
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
    },
  });
