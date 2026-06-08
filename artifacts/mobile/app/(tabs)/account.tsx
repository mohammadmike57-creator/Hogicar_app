import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const PRIMARY = "#1565C0";

type RowIcon = React.ComponentProps<typeof Feather>["name"];

const SECTIONS = [
  {
    title: "Account",
    items: [
      { icon: "user" as RowIcon, label: "Personal Information", sub: "Name, email, phone" },
      { icon: "credit-card" as RowIcon, label: "Payment Methods", sub: "Cards & wallets" },
      { icon: "map-pin" as RowIcon, label: "Saved Locations", sub: "Home, work & more" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: "globe" as RowIcon, label: "Language & Currency", sub: "English · USD" },
      { icon: "bell" as RowIcon, label: "Notifications", sub: "Push, email & SMS" },
      { icon: "moon" as RowIcon, label: "Dark Mode", sub: "Match system settings" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: "headphones" as RowIcon, label: "Help Centre", sub: "FAQs and guides" },
      { icon: "message-square" as RowIcon, label: "Live Chat", sub: "Available 24/7" },
      { icon: "star" as RowIcon, label: "Rate the App", sub: "Share your feedback" },
    ],
  },
  {
    title: "Legal",
    items: [
      { icon: "file-text" as RowIcon, label: "Terms of Service", sub: "" },
      { icon: "shield" as RowIcon, label: "Privacy Policy", sub: "" },
      { icon: "info" as RowIcon, label: "App Version", sub: "1.0.0 (Build 100)" },
    ],
  },
];

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 54 : insets.top;

  async function handleSignOut() {
    await AsyncStorage.removeItem("@onboarding_done");
    router.replace("/onboarding");
  }

  return (
    <View style={[s.root, { paddingTop: topPad }]}>
      {/* Header */}
      <LinearGradient
        colors={["#0D47A1", "#1565C0"]}
        style={s.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={s.headerOrb} />
        <View style={s.profileRow}>
          <View style={s.avatar}>
            <Text style={s.avatarText} allowFontScaling={false}>JD</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.name} allowFontScaling={false}>John Doe</Text>
            <Text style={s.email} allowFontScaling={false}>john.doe@example.com</Text>
          </View>
          <TouchableOpacity style={s.editBtn}>
            <Feather name="edit-2" size={14} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          {[
            { val: "3", label: "Trips" },
            { val: "$1,020", label: "Spent" },
            { val: "Gold", label: "Tier" },
          ].map((st) => (
            <View key={st.label} style={s.statItem}>
              <Text style={s.statVal} allowFontScaling={false}>{st.val}</Text>
              <Text style={s.statLabel} allowFontScaling={false}>{st.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Loyalty card */}
        <View style={s.loyaltyWrap}>
          <LinearGradient
            colors={["#F59E0B", "#D97706"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.loyaltyCard}
          >
            <View style={s.loyaltyOrb} />
            <View>
              <Text style={s.loyaltyTier} allowFontScaling={false}>GOLD MEMBER</Text>
              <Text style={s.loyaltyPts} allowFontScaling={false}>2,450 points</Text>
              <Text style={s.loyaltySub} allowFontScaling={false}>550 pts to Platinum</Text>
            </View>
            <Feather name="award" size={40} color="rgba(255,255,255,0.25)" />
          </LinearGradient>
          <View style={s.loyaltyProgress}>
            <View style={s.loyaltyBar}>
              <View style={[s.loyaltyFill, { width: "82%" }]} />
            </View>
            <Text style={s.loyaltyPct} allowFontScaling={false}>82% to Platinum</Text>
          </View>
        </View>

        {/* Menu sections */}
        {SECTIONS.map((sec) => (
          <View key={sec.title} style={s.section}>
            <Text style={s.sectionTitle} allowFontScaling={false}>{sec.title}</Text>
            <View style={s.sectionCard}>
              {sec.items.map((item, i) => (
                <React.Fragment key={item.label}>
                  <TouchableOpacity style={s.row} activeOpacity={0.7}>
                    <View style={s.rowIcon}>
                      <Feather name={item.icon} size={17} color={PRIMARY} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.rowLabel} allowFontScaling={false}>{item.label}</Text>
                      {!!item.sub && (
                        <Text style={s.rowSub} allowFontScaling={false}>{item.sub}</Text>
                      )}
                    </View>
                    <Feather name="chevron-right" size={16} color="#CBD5E1" />
                  </TouchableOpacity>
                  {i < sec.items.length - 1 && <View style={s.rowDivider} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        {/* Sign out */}
        <View style={s.signOutWrap}>
          <TouchableOpacity style={s.signOutBtn} onPress={handleSignOut} activeOpacity={0.8}>
            <Feather name="log-out" size={16} color="#EF4444" />
            <Text style={s.signOutText} allowFontScaling={false}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F0F4FF" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    overflow: "hidden",
    position: "relative",
  },
  headerOrb: {
    position: "absolute",
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.06)",
    top: -50, right: -50,
  },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 20 },
  avatar: {
    width: 56, height: 56, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "rgba(255,255,255,0.3)",
  },
  avatarText: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#FFF" },
  name: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#FFF" },
  email: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)", marginTop: 2 },
  editBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  statsRow: { flexDirection: "row", gap: 8 },
  statItem: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  statVal: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#FFF" },
  statLabel: { fontSize: 10, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.65)", marginTop: 2 },

  /* Loyalty */
  loyaltyWrap: { margin: 16, marginBottom: 4 },
  loyaltyCard: {
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    position: "relative",
  },
  loyaltyOrb: {
    position: "absolute",
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.1)",
    top: -30, right: 60,
  },
  loyaltyTier: {
    fontSize: 10, fontFamily: "Inter_700Bold",
    color: "rgba(255,255,255,0.75)", letterSpacing: 2,
  },
  loyaltyPts: { fontSize: 26, fontFamily: "Inter_700Bold", color: "#FFF", marginVertical: 2 },
  loyaltySub: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.75)" },
  loyaltyProgress: { marginTop: 10 },
  loyaltyBar: {
    height: 6, backgroundColor: "#E5E7EB", borderRadius: 3, overflow: "hidden",
  },
  loyaltyFill: { height: 6, backgroundColor: "#F59E0B", borderRadius: 3 },
  loyaltyPct: {
    fontSize: 11, fontFamily: "Inter_500Medium", color: "#6B7280", marginTop: 4,
  },

  /* Sections */
  section: { paddingHorizontal: 16, paddingTop: 20 },
  sectionTitle: {
    fontSize: 12, fontFamily: "Inter_700Bold", color: "#9CA3AF",
    letterSpacing: 1, marginBottom: 8, marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#1565C0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "#EEF4FF",
    alignItems: "center", justifyContent: "center",
  },
  rowLabel: { fontSize: 14, fontFamily: "Inter_500Medium", color: "#1A1A2E" },
  rowSub: { fontSize: 11, fontFamily: "Inter_400Regular", color: "#9CA3AF", marginTop: 1 },
  rowDivider: { height: 1, backgroundColor: "#F3F4F6", marginLeft: 64 },

  /* Sign out */
  signOutWrap: { paddingHorizontal: 16, paddingTop: 20 },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: "#FEE2E2",
  },
  signOutText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#EF4444" },
});
