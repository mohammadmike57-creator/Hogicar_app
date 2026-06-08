import { Tabs } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PRIMARY = "#1565C0";
const INACTIVE = "#9CA3AF";
const BG = "#FFFFFF";

type IconName = React.ComponentProps<typeof Feather>["name"];

const TABS: { name: string; icon: IconName; label: string }[] = [
  { name: "index", icon: "search", label: "Search" },
  { name: "bookings", icon: "bookmark", label: "My Bookings" },
  { name: "account", icon: "user", label: "Account" },
];

function TabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const botPad = Platform.OS === "web" ? 8 : insets.bottom;

  return (
    <View style={[s.bar, { paddingBottom: botPad }]}>
      {state.routes.map((route: any, i: number) => {
        const focused = state.index === i;
        const tab = TABS[i];
        if (!tab) return null;
        return (
          <TabItem
            key={route.key}
            icon={tab.icon}
            label={tab.label}
            focused={focused}
            onPress={() => {
              if (!focused) {
                navigation.navigate(route.name, route.params);
              }
            }}
          />
        );
      })}
    </View>
  );
}

function TabItem({
  icon, label, focused, onPress,
}: {
  icon: IconName; label: string; focused: boolean; onPress: () => void;
}) {
  return (
    <View style={s.tabItem} accessible onTouchEnd={onPress}>
      <View style={[s.iconWrap, focused && s.iconWrapActive]}>
        <Feather name={icon} size={focused ? 22 : 20} color={focused ? PRIMARY : INACTIVE} />
      </View>
      <Text
        style={[s.label, focused && s.labelActive]}
        allowFontScaling={false}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="bookings" />
      <Tabs.Screen name="account" />
    </Tabs>
  );
}

const s = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: BG,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
    paddingBottom: 4,
  },
  iconWrap: {
    width: 44,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: {
    backgroundColor: "#EEF4FF",
  },
  label: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    color: INACTIVE,
    letterSpacing: 0.2,
  },
  labelActive: {
    color: PRIMARY,
    fontFamily: "Inter_600SemiBold",
  },
});
