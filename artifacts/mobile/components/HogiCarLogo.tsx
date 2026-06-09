import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, Path, Line } from "react-native-svg";

type LogoVariant = "colored" | "onDark";
type LogoSize = "xs" | "sm" | "md" | "lg" | "xl";

interface HogiCarLogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
}

const SCALE: Record<LogoSize, number> = {
  xs: 0.44,
  sm: 0.60,
  md: 0.80,
  lg: 1.0,
  xl: 1.3,
};

/* Base dimensions for "lg" */
const BASE_ICON = 44;
const BASE_TEXT_SIZE = 28;
const BASE_COM_SIZE = 14;

export default function HogiCarLogo({ variant = "colored", size = "md" }: HogiCarLogoProps) {
  const sc = SCALE[size];
  const iconSize = BASE_ICON * sc;
  const textSize = BASE_TEXT_SIZE * sc;
  const comSize = BASE_COM_SIZE * sc;

  const isDark = variant === "onDark";
  const circleColor = isDark ? "rgba(255,255,255,0.18)" : "#123C69";
  const hogiColor = isDark ? "#FFFFFF" : "#123C69";
  const carColor = "#F57C00";

  return (
    <View style={[ss.root, { gap: Math.max(4, 6 * sc) }]}>
      {/* SVG Icon */}
      <Svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 90 90"
      >
        <Circle cx="45" cy="45" r="28" fill={circleColor} />
        <Path
          d="M25 52 Q45 28 65 44"
          stroke="#F57C00"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        <Line
          x1="32"
          y1="60"
          x2="58"
          y2="60"
          stroke="#F57C00"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </Svg>

      {/* Brand text */}
      <Text style={[ss.brand, { fontSize: textSize, lineHeight: textSize * 1.2 }]} allowFontScaling={false}>
        <Text style={{ color: hogiColor }}>HOGI</Text>
        <Text style={{ color: carColor }}>CAR</Text>
        <Text style={{ color: carColor, fontSize: comSize }}>.com</Text>
      </Text>
    </View>
  );
}

const ss = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
  },
  brand: {
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
});
