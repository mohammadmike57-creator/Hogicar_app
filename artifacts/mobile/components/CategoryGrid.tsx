import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useColors } from "@/hooks/useColors";
import { carCategories } from "@/data/mockCars";

interface CategoryGridProps {
  onSelect: (type: string) => void;
}

export default function CategoryGrid({ onSelect }: CategoryGridProps) {
  const colors = useColors();
  const s = styles(colors);
  return (
    <View>
      <Text style={s.sectionTitle}>Popular Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {carCategories.map((cat) => (
          <TouchableOpacity key={cat.type} style={[s.card, { backgroundColor: cat.color }]} onPress={() => onSelect(cat.type)}>
            <Text style={s.icon}>{cat.icon}</Text>
            <Text style={s.type}>{cat.type}</Text>
            <Text style={s.price}>from ${cat.startingFrom}/day</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    sectionTitle: {
      fontSize: 18,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 12,
      paddingHorizontal: 16,
    },
    scroll: {
      paddingHorizontal: 16,
      gap: 10,
    },
    card: {
      width: 110,
      borderRadius: 14,
      padding: 14,
      alignItems: "flex-start",
      justifyContent: "space-between",
    },
    icon: {
      fontSize: 28,
      marginBottom: 8,
    },
    type: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: "#1A1A2E",
      marginBottom: 4,
    },
    price: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: "#4B5563",
    },
  });
