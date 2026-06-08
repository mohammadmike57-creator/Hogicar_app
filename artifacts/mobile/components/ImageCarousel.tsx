import React, { useRef, useState } from "react";
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useColors } from "@/hooks/useColors";

const { width } = Dimensions.get("window");

function carImage(key: string) {
  const map: Record<string, any> = {
    sedan: require("@/assets/images/car-sedan.png"),
    suv: require("@/assets/images/car-suv.png"),
    compact: require("@/assets/images/car-compact.png"),
    electric: require("@/assets/images/car-electric.png"),
  };
  return map[key] ?? map["sedan"];
}

interface ImageCarouselProps {
  images: string[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const colors = useColors();
  const [activeIdx, setActiveIdx] = useState(0);
  const ref = useRef<FlatList>(null);
  const s = styles(colors);

  return (
    <View style={s.wrapper}>
      <FlatList
        ref={ref}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIdx(idx);
        }}
        renderItem={({ item }) => (
          <View style={s.slide}>
            <Image
              source={carImage(item)}
              style={s.image}
              resizeMode="contain"
            />
          </View>
        )}
      />
      <View style={s.dots}>
        {images.map((_, i) => (
          <TouchableOpacity
            key={i}
            style={[s.dot, i === activeIdx && s.activeDot]}
            onPress={() => {
              ref.current?.scrollToIndex({ index: i, animated: true });
              setActiveIdx(i);
            }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.card,
    },
    slide: {
      width,
      height: 220,
      alignItems: "center",
      justifyContent: "center",
    },
    image: {
      width: width * 0.85,
      height: 200,
    },
    dots: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 12,
    },
    dot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: colors.border,
    },
    activeDot: {
      backgroundColor: colors.primary,
      width: 20,
    },
  });
