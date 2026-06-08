import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BookingProvider } from "@/context/BookingContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const BLUE = "#1565C0";
const WHITE = "#FFFFFF";

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <BookingProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen
                    name="onboarding"
                    options={{ headerShown: false, gestureEnabled: false, animation: "fade" }}
                  />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="results"
                    options={{
                      headerShown: true,
                      headerTitle: "Search Results",
                      headerBackTitle: "Back",
                      headerTintColor: BLUE,
                      headerStyle: { backgroundColor: WHITE },
                      headerShadowVisible: false,
                      headerTitleStyle: { fontFamily: "Inter_600SemiBold", fontSize: 17 },
                    }}
                  />
                  <Stack.Screen
                    name="car-details"
                    options={{
                      headerShown: true,
                      headerTitle: "",
                      headerBackTitle: "Results",
                      headerTintColor: BLUE,
                      headerStyle: { backgroundColor: WHITE },
                      headerShadowVisible: false,
                      headerTransparent: true,
                    }}
                  />
                  <Stack.Screen
                    name="checkout"
                    options={{
                      headerShown: true,
                      headerTitle: "Secure Booking",
                      headerBackTitle: "Details",
                      headerTintColor: BLUE,
                      headerStyle: { backgroundColor: WHITE },
                      headerShadowVisible: false,
                      headerTitleStyle: { fontFamily: "Inter_600SemiBold", fontSize: 17 },
                    }}
                  />
                  <Stack.Screen
                    name="confirmed"
                    options={{ headerShown: false, gestureEnabled: false }}
                  />
                </Stack>
              </BookingProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
