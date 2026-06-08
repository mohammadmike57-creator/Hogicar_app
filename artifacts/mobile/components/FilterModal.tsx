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
import { FilterState } from "@/context/BookingContext";

interface FilterModalProps {
  visible: boolean;
  filters: FilterState;
  onClose: () => void;
  onApply: (f: FilterState) => void;
}

const SUPPLIERS = ["Hertz", "Avis", "Europcar", "Budget", "Sixt"];
const RATINGS = [
  { label: "Exceptional (9+)", value: 9 },
  { label: "Superb (8.5+)", value: 8.5 },
  { label: "Excellent (8+)", value: 8 },
  { label: "Very Good (7.5+)", value: 7.5 },
  { label: "Any", value: 0 },
];

export default function FilterModal({ visible, filters, onClose, onApply }: FilterModalProps) {
  const colors = useColors();
  const [f, setF] = useState<FilterState>(filters);
  const s = styles(colors);

  function toggleSupplier(name: string) {
    setF(prev => ({
      ...prev,
      suppliers: prev.suppliers.includes(name)
        ? prev.suppliers.filter(s => s !== name)
        : [...prev.suppliers, name],
    }));
  }

  function reset() {
    setF({
      transmission: "All",
      fuelType: "All",
      minRating: 0,
      suppliers: [],
      fuelPolicy: "All",
      maxDeposit: 2000,
    });
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onClose} />
      <View style={s.sheet}>
        <View style={s.handle} />
        <View style={s.titleRow}>
          <Text style={s.title}>Filter Results</Text>
          <TouchableOpacity onPress={reset}>
            <Text style={s.reset}>Reset All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Section label="Transmission" colors={colors}>
            <ToggleRow
              options={["All", "Automatic", "Manual"]}
              value={f.transmission}
              onSelect={(v) => setF(prev => ({ ...prev, transmission: v as FilterState["transmission"] }))}
              colors={colors}
            />
          </Section>

          <Section label="Fuel Type" colors={colors}>
            <ToggleRow
              options={["All", "Petrol", "Diesel", "Electric", "Hybrid"]}
              value={f.fuelType}
              onSelect={(v) => setF(prev => ({ ...prev, fuelType: v as FilterState["fuelType"] }))}
              colors={colors}
            />
          </Section>

          <Section label="Supplier Rating" colors={colors}>
            {RATINGS.map(r => (
              <TouchableOpacity
                key={r.value}
                style={s.ratingRow}
                onPress={() => setF(prev => ({ ...prev, minRating: r.value }))}
              >
                <View style={[s.radio, f.minRating === r.value && s.radioSelected]}>
                  {f.minRating === r.value && <View style={s.radioDot} />}
                </View>
                <Text style={s.ratingLabel}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </Section>

          <Section label="Rental Company" colors={colors}>
            <View style={s.chipRow}>
              {SUPPLIERS.map(name => (
                <TouchableOpacity
                  key={name}
                  style={[s.chip, f.suppliers.includes(name) && s.chipSelected]}
                  onPress={() => toggleSupplier(name)}
                >
                  <Text style={[s.chipText, f.suppliers.includes(name) && s.chipTextSelected]}>
                    {name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Section>

          <Section label="Fuel Policy" colors={colors}>
            <ToggleRow
              options={["All", "Full-to-Full", "Same-to-Same"]}
              value={f.fuelPolicy}
              onSelect={(v) => setF(prev => ({ ...prev, fuelPolicy: v as FilterState["fuelPolicy"] }))}
              colors={colors}
            />
          </Section>
        </ScrollView>

        <TouchableOpacity style={s.applyBtn} onPress={() => { onApply(f); onClose(); }}>
          <Text style={s.applyText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

function Section({ label, children, colors }: { label: string; children: React.ReactNode; colors: any }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 15, fontFamily: "Inter_600SemiBold", color: colors.foreground, marginBottom: 12 }}>
        {label}
      </Text>
      {children}
    </View>
  );
}

function ToggleRow({ options, value, onSelect, colors }: { options: string[]; value: string; onSelect: (v: string) => void; colors: any }) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {options.map(o => (
        <TouchableOpacity
          key={o}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 20,
            borderWidth: 1.5,
            borderColor: value === o ? colors.primary : colors.border,
            backgroundColor: value === o ? colors.secondary : "transparent",
          }}
          onPress={() => onSelect(o)}
        >
          <Text style={{
            fontSize: 13,
            fontFamily: "Inter_500Medium",
            color: value === o ? colors.primary : colors.mutedForeground,
          }}>
            {o}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
    sheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      paddingBottom: 40,
      maxHeight: "85%",
    },
    handle: {
      width: 36, height: 4, borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: "center", marginBottom: 16,
    },
    titleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    title: { fontSize: 18, fontFamily: "Inter_600SemiBold", color: colors.foreground },
    reset: { fontSize: 14, fontFamily: "Inter_500Medium", color: colors.primary },
    ratingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 8,
    },
    radio: {
      width: 20, height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    radioSelected: { borderColor: colors.primary },
    radioDot: {
      width: 10, height: 10,
      borderRadius: 5,
      backgroundColor: colors.primary,
    },
    ratingLabel: {
      fontSize: 14, fontFamily: "Inter_400Regular", color: colors.foreground,
    },
    chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    chip: {
      paddingHorizontal: 14, paddingVertical: 8,
      borderRadius: 20, borderWidth: 1.5,
      borderColor: colors.border,
    },
    chipSelected: { borderColor: colors.primary, backgroundColor: colors.secondary },
    chipText: { fontSize: 13, fontFamily: "Inter_500Medium", color: colors.mutedForeground },
    chipTextSelected: { color: colors.primary },
    applyBtn: {
      backgroundColor: colors.primary,
      borderRadius: 14,
      padding: 16,
      alignItems: "center",
      marginTop: 16,
    },
    applyText: {
      color: colors.primaryForeground,
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
    },
  });
