import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

const PRIMARY = "#1565C0";

const PAST_BOOKINGS = [
  {
    id: "CR847291",
    car: "Toyota Yaris",
    supplier: "Hertz",
    supplierInit: "Hz",
    supplierColor: "#FFD700",
    pickup: "London Heathrow",
    pickupDate: "12 Jul 2025",
    dropoff: "19 Jul 2025",
    days: 7,
    total: 252,
    status: "completed",
    rating: 9.1,
  },
  {
    id: "CR502183",
    car: "Honda CR-V",
    supplier: "Avis",
    supplierInit: "Av",
    supplierColor: "#EF5350",
    pickup: "Paris CDG Airport",
    pickupDate: "03 Mar 2025",
    dropoff: "07 Mar 2025",
    days: 4,
    total: 378,
    status: "completed",
    rating: 8.7,
  },
  {
    id: "CR391047",
    car: "Tesla Model 3",
    supplier: "Europcar",
    supplierInit: "Ec",
    supplierColor: "#1565C0",
    pickup: "Amsterdam Schiphol",
    pickupDate: "18 Jan 2025",
    dropoff: "21 Jan 2025",
    days: 3,
    total: 219,
    status: "cancelled",
    rating: null,
  },
];

const UPCOMING = [
  {
    id: "CR918472",
    car: "Mercedes C-Class",
    supplier: "Sixt",
    supplierInit: "Sx",
    supplierColor: "#FF9800",
    pickup: "Dubai International",
    pickupDate: "22 Aug 2026",
    dropoff: "29 Aug 2026",
    days: 7,
    total: 574,
    status: "upcoming",
    rating: null,
  },
];

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  completed: { label: "Completed", bg: "#F0FDF4", text: "#15803D" },
  cancelled: { label: "Cancelled", bg: "#FEF2F2", text: "#B91C1C" },
  upcoming: { label: "Upcoming", bg: "#EEF4FF", text: "#1565C0" },
};

type TabKey = "upcoming" | "past";

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<TabKey>("upcoming");
  const topPad = Platform.OS === "web" ? 54 : insets.top;

  const list = tab === "upcoming" ? UPCOMING : PAST_BOOKINGS;

  return (
    <View style={[s.root, { paddingTop: topPad }]}>
      {/* Header gradient */}
      <LinearGradient
        colors={["#0D47A1", "#1565C0"]}
        style={s.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={s.headerOrb} />
        <Text style={s.headerTitle} allowFontScaling={false}>My Bookings</Text>
        <Text style={s.headerSub} allowFontScaling={false}>
          {UPCOMING.length} upcoming · {PAST_BOOKINGS.filter(b => b.status === "completed").length} completed
        </Text>

        {/* Tabs */}
        <View style={s.tabRow}>
          {(["upcoming", "past"] as TabKey[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[s.tab, tab === t && s.tabActive]}
              onPress={() => setTab(t)}
            >
              <Text
                style={[s.tabText, tab === t && s.tabTextActive]}
                allowFontScaling={false}
              >
                {t === "upcoming" ? "Upcoming" : "Past Bookings"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {list.length === 0 ? (
          <EmptyState tab={tab} />
        ) : (
          list.map((b) => (
            <BookingCard key={b.id} booking={b} />
          ))
        )}

        {tab === "upcoming" && (
          <TouchableOpacity
            style={s.newBtn}
            onPress={() => router.push("/(tabs)")}
          >
            <LinearGradient
              colors={["#1565C0", "#1976D2"]}
              style={s.newBtnGrad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Feather name="plus" size={18} color="#FFF" />
              <Text style={s.newBtnText} allowFontScaling={false}>Book a New Car</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

function BookingCard({ booking }: { booking: typeof PAST_BOOKINGS[0] }) {
  const cfg = STATUS_CONFIG[booking.status];
  return (
    <View style={s.card}>
      {/* Top row */}
      <View style={s.cardTop}>
        <View style={[s.supplierBadge, { backgroundColor: booking.supplierColor + "22" }]}>
          <Text style={[s.supplierInit, { color: booking.supplierColor }]} allowFontScaling={false}>
            {booking.supplierInit}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.carName} allowFontScaling={false}>{booking.car}</Text>
          <Text style={s.supplierName} allowFontScaling={false}>{booking.supplier}</Text>
        </View>
        <View style={[s.statusChip, { backgroundColor: cfg.bg }]}>
          <Text style={[s.statusText, { color: cfg.text }]} allowFontScaling={false}>{cfg.label}</Text>
        </View>
      </View>

      {/* Details */}
      <View style={s.detailsRow}>
        <DetailItem icon="map-pin" text={booking.pickup} />
        <View style={s.detailDivider} />
        <DetailItem icon="calendar" text={`${booking.pickupDate} → ${booking.dropoff}`} />
        <View style={s.detailDivider} />
        <DetailItem icon="clock" text={`${booking.days} days`} />
      </View>

      {/* Footer */}
      <View style={s.cardFooter}>
        <View>
          <Text style={s.refLabel} allowFontScaling={false}>REF #{booking.id}</Text>
          <Text style={s.totalText} allowFontScaling={false}>${booking.total} total</Text>
        </View>
        {booking.status === "completed" && (
          <TouchableOpacity style={s.actionBtn}>
            <Feather name="refresh-cw" size={13} color={PRIMARY} />
            <Text style={s.actionBtnText} allowFontScaling={false}>Rebook</Text>
          </TouchableOpacity>
        )}
        {booking.status === "upcoming" && (
          <TouchableOpacity style={s.actionBtn}>
            <Feather name="eye" size={13} color={PRIMARY} />
            <Text style={s.actionBtnText} allowFontScaling={false}>View Details</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function DetailItem({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={s.detailItem}>
      <Feather name={icon} size={11} color="#9CA3AF" />
      <Text style={s.detailText} allowFontScaling={false} numberOfLines={1}>{text}</Text>
    </View>
  );
}

function EmptyState({ tab }: { tab: TabKey }) {
  return (
    <View style={s.empty}>
      <View style={s.emptyIcon}>
        <Feather name="bookmark" size={36} color="#CBD5E1" />
      </View>
      <Text style={s.emptyTitle} allowFontScaling={false}>
        {tab === "upcoming" ? "No upcoming trips" : "No past bookings"}
      </Text>
      <Text style={s.emptySub} allowFontScaling={false}>
        {tab === "upcoming"
          ? "Ready for your next adventure? Start searching for the perfect car."
          : "Your completed bookings will appear here."}
      </Text>
      {tab === "upcoming" && (
        <TouchableOpacity style={s.emptyBtn} onPress={() => router.push("/(tabs)")}>
          <Text style={s.emptyBtnText} allowFontScaling={false}>Search Cars</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F0F4FF" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    overflow: "hidden",
    position: "relative",
  },
  headerOrb: {
    position: "absolute",
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.06)",
    top: -50, right: -40,
  },
  headerTitle: { fontSize: 24, fontFamily: "Inter_700Bold", color: "#FFF", marginBottom: 4 },
  headerSub: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)", marginBottom: 16 },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 14,
    padding: 4,
    alignSelf: "flex-start",
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  tabActive: { backgroundColor: "#FFFFFF" },
  tabText: { fontSize: 13, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.7)" },
  tabTextActive: { color: PRIMARY, fontFamily: "Inter_700Bold" },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#1565C0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  supplierBadge: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
  },
  supplierInit: { fontSize: 15, fontFamily: "Inter_700Bold" },
  carName: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#1A1A2E" },
  supplierName: { fontSize: 12, fontFamily: "Inter_400Regular", color: "#6B7280", marginTop: 1 },
  statusChip: {
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5,
  },
  statusText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  detailsRow: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 12,
    gap: 8,
    marginBottom: 14,
  },
  detailItem: { flexDirection: "row", alignItems: "center", gap: 7 },
  detailText: { fontSize: 12, fontFamily: "Inter_400Regular", color: "#4B5563", flex: 1 },
  detailDivider: { height: 1, backgroundColor: "#E5E7EB" },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  refLabel: { fontSize: 10, fontFamily: "Inter_500Medium", color: "#9CA3AF", letterSpacing: 0.5 },
  totalText: { fontSize: 17, fontFamily: "Inter_700Bold", color: "#1A1A2E" },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#EEF4FF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: PRIMARY },
  newBtn: { borderRadius: 18, overflow: "hidden", marginTop: 4 },
  newBtnGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
  },
  newBtnText: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#FFF" },
  empty: { alignItems: "center", paddingTop: 60, paddingHorizontal: 32, gap: 12 },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: "#F1F5F9",
    alignItems: "center", justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#1A1A2E" },
  emptySub: {
    fontSize: 14, fontFamily: "Inter_400Regular", color: "#6B7280",
    textAlign: "center", lineHeight: 22,
  },
  emptyBtn: {
    marginTop: 8,
    backgroundColor: PRIMARY,
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#FFF" },
});
