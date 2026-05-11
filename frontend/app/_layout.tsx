import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Keep splash visible until fonts are loaded
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  // Preload Ionicons font — fixes "Font file for ionicons is empty" error on Expo Go
  const [fontsLoaded, fontError] = useFonts({
    ...Ionicons.font,
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
      setReady(true);
    }
  }, [fontsLoaded, fontError]);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: '#4C1D95', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '800', marginBottom: 8 }}>ගණු දෙනු</Text>
        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 24 }}>Ganu Denu</Text>
        <ActivityIndicator color="#FFFFFF" size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-transaction"
          options={{ headerShown: false, presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="qr" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
