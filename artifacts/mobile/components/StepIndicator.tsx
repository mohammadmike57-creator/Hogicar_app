import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

interface StepIndicatorProps {
  currentStep: number;
}

const STEPS = ["Driver Info", "Payment", "Confirmed"];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const colors = useColors();
  const s = styles(colors);
  return (
    <View style={s.container}>
      {STEPS.map((step, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <React.Fragment key={step}>
            <View style={s.step}>
              <View style={[s.circle, done && s.circleDone, active && s.circleActive]}>
                {done ? (
                  <Feather name="check" size={14} color="#FFF" />
                ) : (
                  <Text style={[s.num, active && s.numActive]}>{i + 1}</Text>
                )}
              </View>
              <Text style={[s.label, active && s.labelActive, done && s.labelDone]}>{step}</Text>
            </View>
            {i < STEPS.length - 1 && (
              <View style={[s.line, done && s.lineDone]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    step: { alignItems: "center", gap: 4 },
    circle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    circleActive: { backgroundColor: colors.primary },
    circleDone: { backgroundColor: colors.success },
    num: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
    },
    numActive: { color: "#FFF" },
    label: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    labelActive: {
      color: colors.primary,
      fontFamily: "Inter_600SemiBold",
    },
    labelDone: { color: colors.success },
    line: {
      flex: 1,
      height: 2,
      backgroundColor: colors.border,
      marginBottom: 18,
      marginHorizontal: 4,
    },
    lineDone: { backgroundColor: colors.success },
  });
