import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from 'react';
import { View, AppState } from 'react-native';
import { pinService } from '../services/pinService';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [checking, setChecking] = useState(true);
  const [locked, setLocked] = useState(false);
  const appState = useRef(AppState.currentState);

  // On app start: check if PIN is set → require unlock
  useEffect(() => {
    (async () => {
      try {
        const enabled = await pinService.isEnabled();
        setLocked(enabled);
      } catch {}
      setChecking(false);
    })();
  }, []);

  // When app becomes active after backgrounding → re-lock
  useEffect(() => {
    const sub = AppState.addEventListener('change', async (next) => {
      if (appState.current.match(/inactive|background/) && next === 'active') {
        const enabled = await pinService.isEnabled();
        if (enabled) {
          setLocked(true);
        }
      }
      appState.current = next;
    });
    return () => sub.remove();
  }, []);

  // Navigate to unlock screen when locked
  useEffect(() => {
    if (checking) return;
    const currentRoute = segments.join('/');
    if (locked && !currentRoute.includes('pin-unlock')) {
      router.replace('/pin-unlock');
    }
  }, [locked, checking, segments, router]);

  if (checking) {
    return <View style={{ flex: 1, backgroundColor: '#4C1D95' }} />;
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
        <Stack.Screen name="privacy" options={{ headerShown: false }} />
        <Stack.Screen name="pin-setup" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="pin-unlock" options={{ headerShown: false, gestureEnabled: false }} />
      </Stack>
    </>
  );
}
