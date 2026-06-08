import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

interface DatePickerModalProps {
  visible: boolean;
  value: Date;
  onClose: () => void;
  onSelect: (date: Date) => void;
  minDate?: Date;
  title?: string;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function DatePickerModal({
  visible,
  value,
  onClose,
  onSelect,
  minDate,
  title = "Select Date",
}: DatePickerModalProps) {
  const colors = useColors();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const min = minDate ?? today;

  const [viewMonth, setViewMonth] = useState(value.getMonth());
  const [viewYear, setViewYear] = useState(value.getFullYear());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function handleDay(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    if (d < min) return;
    onSelect(d);
    onClose();
  }

  function isSelected(day: number) {
    return (
      value.getDate() === day &&
      value.getMonth() === viewMonth &&
      value.getFullYear() === viewYear
    );
  }

  function isDisabled(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    return d < min;
  }

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  const s = styles(colors);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onClose} />
      <View style={s.sheet}>
        <View style={s.handle} />
        <Text style={s.title}>{title}</Text>

        <View style={s.navRow}>
          <TouchableOpacity onPress={prevMonth} style={s.navBtn}>
            <Feather name="chevron-left" size={20} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={s.monthLabel}>{MONTHS[viewMonth]} {viewYear}</Text>
          <TouchableOpacity onPress={nextMonth} style={s.navBtn}>
            <Feather name="chevron-right" size={20} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        <View style={s.dayHeader}>
          {DAYS.map(d => (
            <Text key={d} style={s.dayName}>{d}</Text>
          ))}
        </View>

        {rows.map((row, ri) => (
          <View key={ri} style={s.row}>
            {row.map((day, di) => {
              if (!day) return <View key={di} style={s.cell} />;
              const sel = isSelected(day);
              const dis = isDisabled(day);
              return (
                <TouchableOpacity
                  key={di}
                  style={[s.cell, sel && s.selectedCell, dis && s.disabledCell]}
                  onPress={() => handleDay(day)}
                  disabled={dis}
                >
                  <Text style={[s.dayNum, sel && s.selectedDay, dis && s.disabledDay]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        <TouchableOpacity style={s.cancelBtn} onPress={onClose}>
          <Text style={s.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
    },
    sheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      paddingBottom: 40,
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: "center",
      marginBottom: 16,
    },
    title: {
      fontSize: 18,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      textAlign: "center",
      marginBottom: 20,
    },
    navRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    navBtn: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.muted,
    },
    monthLabel: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    dayHeader: {
      flexDirection: "row",
      marginBottom: 4,
    },
    dayName: {
      flex: 1,
      textAlign: "center",
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    row: {
      flexDirection: "row",
      marginBottom: 4,
    },
    cell: {
      flex: 1,
      aspectRatio: 1,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 50,
    },
    selectedCell: {
      backgroundColor: colors.primary,
    },
    disabledCell: {
      opacity: 0.3,
    },
    dayNum: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
    },
    selectedDay: {
      color: colors.primaryForeground,
      fontFamily: "Inter_600SemiBold",
    },
    disabledDay: {
      color: colors.mutedForeground,
    },
    cancelBtn: {
      marginTop: 16,
      padding: 14,
      borderRadius: 12,
      backgroundColor: colors.muted,
      alignItems: "center",
    },
    cancelText: {
      fontSize: 15,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
  });
