import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { searchLocations, Location, popularLocations } from "@/data/mockLocations";

const { height } = Dimensions.get("window");

const RECENT: Location[] = [
  { id: "lhr", name: "London Heathrow Airport", subtitle: "LHR · London, UK", type: "airport" },
  { id: "cdg", name: "Paris Charles de Gaulle", subtitle: "CDG · Paris, France", type: "airport" },
  { id: "jfk", name: "New York JFK Airport", subtitle: "JFK · New York, USA", type: "airport" },
];

interface Props {
  visible: boolean;
  title: string;
  onClose: () => void;
  onSelect: (loc: Location) => void;
}

export default function LocationSearchModal({ visible, title, onClose, onSelect }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [hasQuery, setHasQuery] = useState(false);
  const s = styles(colors);

  useEffect(() => {
    if (visible) {
      setQuery("");
      setResults([]);
      setHasQuery(false);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(bgAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => inputRef.current?.focus(), 100);
      });
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(bgAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  function handleSearch(text: string) {
    setQuery(text);
    setHasQuery(text.length > 0);
    setResults(searchLocations(text));
  }

  function handleSelect(loc: Location) {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 250,
      useNativeDriver: true,
    }).start();
    onSelect(loc);
  }

  function handleClose() {
    inputRef.current?.blur();
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: height, duration: 280, useNativeDriver: true }),
      Animated.timing(bgAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(onClose);
  }

  const topPad = Platform.OS === "web" ? 20 : insets.top;
  const botPad = Platform.OS === "web" ? 20 : insets.bottom;

  const displayList = hasQuery ? results : popularLocations.slice(0, 8);
  const airports = displayList.filter((l) => l.type === "airport");
  const cities = displayList.filter((l) => l.type === "city");

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Backdrop */}
      <Animated.View
        style={[StyleSheet.absoluteFill, s.backdrop, { opacity: bgAnim }]}
        pointerEvents="auto"
      >
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          s.sheet,
          {
            paddingTop: topPad,
            paddingBottom: botPad,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={0}
        >
          {/* Header */}
          <View style={s.header}>
            <TouchableOpacity style={s.closeBtn} onPress={handleClose}>
              <Feather name="x" size={20} color={colors.foreground} />
            </TouchableOpacity>
            <Text style={s.headerTitle}>{title}</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Search Input */}
          <View style={s.searchBox}>
            <View style={s.searchIcon}>
              <Feather name="search" size={18} color={colors.primary} />
            </View>
            <TextInput
              ref={inputRef}
              style={s.searchInput}
              value={query}
              onChangeText={handleSearch}
              placeholder="City, airport or station..."
              placeholderTextColor={colors.mutedForeground}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              allowFontScaling={false}
              fontSize={16}
            />
            {query.length > 0 && (
              <TouchableOpacity
                onPress={() => { setQuery(""); setHasQuery(false); setResults([]); }}
                style={s.clearBtn}
              >
                <Feather name="x-circle" size={18} color={colors.mutedForeground} />
              </TouchableOpacity>
            )}
          </View>

          {/* Results */}
          <FlatList
            data={[]}
            keyExtractor={() => ""}
            renderItem={() => null}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={() => (
              <View>
                {/* Recent searches — only when no query */}
                {!hasQuery && (
                  <View style={s.section}>
                    <View style={s.sectionHeader}>
                      <Feather name="clock" size={14} color={colors.mutedForeground} />
                      <Text style={s.sectionTitle}>Recent Searches</Text>
                    </View>
                    {RECENT.map((loc) => (
                      <LocationRow
                        key={loc.id}
                        loc={loc}
                        onPress={handleSelect}
                        colors={colors}
                        isRecent
                      />
                    ))}
                  </View>
                )}

                {/* Airports */}
                {airports.length > 0 && (
                  <View style={s.section}>
                    <View style={s.sectionHeader}>
                      <Feather name="navigation" size={14} color={colors.mutedForeground} />
                      <Text style={s.sectionTitle}>Airports</Text>
                    </View>
                    {airports.map((loc) => (
                      <LocationRow
                        key={loc.id}
                        loc={loc}
                        onPress={handleSelect}
                        colors={colors}
                        query={query}
                      />
                    ))}
                  </View>
                )}

                {/* Cities */}
                {cities.length > 0 && (
                  <View style={s.section}>
                    <View style={s.sectionHeader}>
                      <Feather name="map-pin" size={14} color={colors.mutedForeground} />
                      <Text style={s.sectionTitle}>Cities</Text>
                    </View>
                    {cities.map((loc) => (
                      <LocationRow
                        key={loc.id}
                        loc={loc}
                        onPress={handleSelect}
                        colors={colors}
                        query={query}
                      />
                    ))}
                  </View>
                )}

                {hasQuery && results.length === 0 && (
                  <View style={s.empty}>
                    <Feather name="search" size={36} color={colors.border} />
                    <Text style={s.emptyTitle}>No results found</Text>
                    <Text style={s.emptySub}>Try a different city or airport name</Text>
                  </View>
                )}
              </View>
            )}
          />
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

function LocationRow({
  loc, onPress, colors, isRecent = false, query = "",
}: {
  loc: Location; onPress: (l: Location) => void; colors: any; isRecent?: boolean; query?: string;
}) {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingVertical: 13,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border + "60",
      }}
      onPress={() => onPress(loc)}
      activeOpacity={0.7}
    >
      <View style={{
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: isRecent ? colors.muted : colors.secondary,
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Feather
          name={isRecent ? "clock" : loc.type === "airport" ? "navigation" : "map-pin"}
          size={17}
          color={isRecent ? colors.mutedForeground : colors.primary}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 15,
          fontFamily: "Inter_500Medium",
          color: colors.foreground,
          marginBottom: 2,
        }} numberOfLines={1}>
          {loc.name}
        </Text>
        <Text style={{
          fontSize: 12,
          fontFamily: "Inter_400Regular",
          color: colors.mutedForeground,
        }}>
          {loc.subtitle}
        </Text>
      </View>
      <Feather name="chevron-right" size={16} color={colors.border} />
    </TouchableOpacity>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    backdrop: {
      backgroundColor: "rgba(0,0,0,0.55)",
    },
    sheet: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    closeBtn: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      fontSize: 17,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    searchBox: {
      flexDirection: "row",
      alignItems: "center",
      margin: 16,
      backgroundColor: colors.muted,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: colors.primary + "40",
      paddingHorizontal: 14,
      paddingVertical: 4,
      gap: 10,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    searchIcon: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: colors.secondary,
      alignItems: "center",
      justifyContent: "center",
    },
    searchInput: {
      flex: 1,
      paddingVertical: 12,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
    },
    clearBtn: {
      padding: 4,
    },
    section: {
      marginTop: 6,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 8,
    },
    sectionTitle: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      letterSpacing: 0.8,
      textTransform: "uppercase",
    },
    empty: {
      alignItems: "center",
      paddingVertical: 60,
      gap: 8,
    },
    emptyTitle: {
      fontSize: 18,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    emptySub: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
  });
