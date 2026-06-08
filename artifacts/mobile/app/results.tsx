import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { useColors } from "@/hooks/useColors";
import { useBooking, SortBy } from "@/context/BookingContext";
import { mockCars, Car } from "@/data/mockCars";
import VehicleCard from "@/components/VehicleCard";
import FilterModal from "@/components/FilterModal";
import SkeletonCard from "@/components/SkeletonCard";

function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
function rentalDays(pickup: Date, dropoff: Date) {
  return Math.max(1, Math.round((dropoff.getTime() - pickup.getTime()) / 86400000));
}

const SORT_TABS: { label: string; key: SortBy }[] = [
  { label: "Cheapest", key: "cheapest" },
  { label: "Best Rated", key: "best_rated" },
  { label: "Closest", key: "closest" },
];

export default function ResultsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { searchParams, filters, setFilters, sortBy, setSortBy, setSelectedCar } = useBooking();
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const s = styles(colors);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const days = rentalDays(searchParams.pickupDate, searchParams.dropoffDate);

  const filtered = useMemo(() => {
    let cars = [...mockCars];
    if (filters.transmission !== "All") cars = cars.filter(c => c.transmission === filters.transmission);
    if (filters.fuelType !== "All") cars = cars.filter(c => c.fuelType === filters.fuelType);
    if (filters.minRating > 0) cars = cars.filter(c => c.rating >= filters.minRating);
    if (filters.suppliers.length > 0) cars = cars.filter(c => filters.suppliers.includes(c.supplierName));
    if (filters.fuelPolicy !== "All") cars = cars.filter(c => c.fuelPolicy === filters.fuelPolicy);
    cars = cars.filter(c => c.deposit <= filters.maxDeposit);

    if (sortBy === "cheapest") cars.sort((a, b) => a.priceTotal - b.priceTotal);
    else if (sortBy === "best_rated") cars.sort((a, b) => b.rating - a.rating);
    else cars.sort((a, b) => a.pricePerDay - b.pricePerDay);

    return cars;
  }, [filters, sortBy]);

  function handleCarPress(car: Car) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCar(car);
    router.push("/car-details");
  }

  const activeFilters =
    (filters.transmission !== "All" ? 1 : 0) +
    (filters.fuelType !== "All" ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    filters.suppliers.length +
    (filters.fuelPolicy !== "All" ? 1 : 0);

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[s.container, { paddingBottom: bottomPad }]}>
      {/* Sticky Search Summary */}
      <View style={s.summaryBar}>
        <View style={s.summaryInfo}>
          <Text style={s.summaryLocation} numberOfLines={1}>
            {searchParams.pickupLocation || "Any Location"}
          </Text>
          <Text style={s.summaryDates}>
            {formatDate(searchParams.pickupDate)} – {formatDate(searchParams.dropoffDate)} · {days} {days === 1 ? "day" : "days"}
          </Text>
        </View>
        <TouchableOpacity style={s.editBtn} onPress={() => router.back()}>
          <Text style={s.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Sort Tabs + Filter */}
      <View style={s.controlRow}>
        <View style={s.sortTabs}>
          {SORT_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[s.sortTab, sortBy === tab.key && s.sortTabActive]}
              onPress={() => setSortBy(tab.key)}
            >
              <Text style={[s.sortTabText, sortBy === tab.key && s.sortTabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={s.filterBtn} onPress={() => setShowFilters(true)}>
          <Feather name="sliders" size={16} color={activeFilters > 0 ? colors.primaryForeground : colors.foreground} />
          {activeFilters > 0 && (
            <View style={s.filterBadge}>
              <Text style={s.filterBadgeText}>{activeFilters}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Results count */}
      {!loading && (
        <Text style={s.resultCount}>{filtered.length} cars available</Text>
      )}

      {loading ? (
        <FlatList
          data={[0, 1, 2, 3]}
          keyExtractor={(i) => String(i)}
          renderItem={() => <SkeletonCard />}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      ) : filtered.length === 0 ? (
        <View style={s.empty}>
          <Feather name="search" size={48} color={colors.border} />
          <Text style={s.emptyTitle}>No cars found</Text>
          <Text style={s.emptySub}>Try adjusting your filters</Text>
          <TouchableOpacity
            style={s.clearBtn}
            onPress={() => setFilters({ transmission: "All", fuelType: "All", minRating: 0, suppliers: [], fuelPolicy: "All", maxDeposit: 2000 })}
          >
            <Text style={s.clearText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => (
            <VehicleCard car={item} onPress={() => handleCarPress(item)} rentalDays={days} />
          )}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FilterModal
        visible={showFilters}
        filters={filters}
        onClose={() => setShowFilters(false)}
        onApply={setFilters}
      />
    </View>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F7FB" },
    summaryBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFF",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    summaryInfo: { flex: 1 },
    summaryLocation: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    summaryDates: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
    },
    editBtn: {
      backgroundColor: colors.secondary,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    editText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.primary,
    },
    controlRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: "#FFF",
      gap: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sortTabs: { flex: 1, flexDirection: "row", gap: 6 },
    sortTab: {
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sortTabActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    sortTabText: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    sortTabTextActive: {
      color: "#FFF",
    },
    filterBtn: {
      width: 38,
      height: 38,
      borderRadius: 10,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    filterBadge: {
      position: "absolute",
      top: -4,
      right: -4,
      backgroundColor: colors.primary,
      borderRadius: 8,
      width: 16,
      height: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    filterBadgeText: {
      color: "#FFF",
      fontSize: 10,
      fontFamily: "Inter_700Bold",
    },
    resultCount: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 2,
    },
    empty: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: 40,
    },
    emptyTitle: {
      fontSize: 20,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    emptySub: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    clearBtn: {
      marginTop: 12,
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    clearText: {
      color: "#FFF",
      fontSize: 14,
      fontFamily: "Inter_500Medium",
    },
  });
