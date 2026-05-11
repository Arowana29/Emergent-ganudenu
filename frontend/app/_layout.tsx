import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

// Keep splash visible until fonts are loaded
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  // Load Ionicons font from local asset bundle — avoids "Font file empty" error on Expo Go
  // when font is loaded via Metro tunnel (which can corrupt binary transfers)
  const [fontsLoaded, fontError] = useFonts({
    Ionicons: require('../assets/fonts/Ionicons.ttf'),
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
      // Show app even if font fails — text-based UI still works
      setReady(true);
      if (fontError) {
        // eslint-disable-next-line no-console
        console.warn('[Fonts] Ionicons load error (using fallback):', fontError);
      }
    }
  }, [fontsLoaded, fontError]);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: '#4C1D95', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '800', marginBottom: 6, letterSpacing: -0.5 }}>
          ගණු දෙනු
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, marginBottom: 28 }}>Ganu Denu</Text>
        <ActivityIndicator color="#FFFFFF" size="large" />
        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 16 }}>
          පූරණය වෙමින් · Loading...
        </Text>
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
