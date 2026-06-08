import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";

function Shimmer({ style }: { style: any }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });
  return <Animated.View style={[style, { opacity }]} />;
}

export default function SkeletonCard() {
  const colors = useColors();
  const s = styles(colors);
  return (
    <View style={s.card}>
      <Shimmer style={s.image} />
      <View style={s.body}>
        <View style={s.row}>
          <Shimmer style={s.title} />
          <Shimmer style={s.badge} />
        </View>
        <Shimmer style={s.rating} />
        <View style={s.specs}>
          {[0, 1, 2, 3].map(i => <Shimmer key={i} style={s.spec} />)}
        </View>
        <View style={s.footer}>
          <View>
            <Shimmer style={s.price} />
            <Shimmer style={s.sub} />
          </View>
          <Shimmer style={s.btn} />
        </View>
      </View>
    </View>
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
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
      overflow: "hidden",
    },
    image: { width: "100%", height: 140, backgroundColor: colors.muted },
    body: { padding: 14 },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
    title: { width: 140, height: 18, borderRadius: 6, backgroundColor: colors.muted },
    badge: { width: 36, height: 36, borderRadius: 8, backgroundColor: colors.muted },
    rating: { width: 160, height: 14, borderRadius: 6, backgroundColor: colors.muted, marginBottom: 12 },
    specs: { flexDirection: "row", gap: 12, marginBottom: 14 },
    spec: { width: 56, height: 14, borderRadius: 6, backgroundColor: colors.muted },
    footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
    price: { width: 80, height: 24, borderRadius: 6, backgroundColor: colors.muted, marginBottom: 4 },
    sub: { width: 100, height: 12, borderRadius: 4, backgroundColor: colors.muted },
    btn: { width: 90, height: 40, borderRadius: 10, backgroundColor: colors.muted },
  });
