import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EXPO_URL = 'exp://ganu-launch.preview.emergentagent.com';
// QR code generated via api.qrserver.com (free public API, no key required)
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=12&data=${encodeURIComponent(EXPO_URL)}`;

export default function QRScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titleSi}>Ganu Denu</Text>
        <Text style={styles.titleEn}>Expo Go QR Code</Text>

        <View style={styles.qrBox}>
          <Image source={{ uri: QR_URL }} style={styles.qr} resizeMode="contain" />
        </View>

        <Text style={styles.stepSi}>📱 Expo Go App එකෙන් මෙය scan කරන්න</Text>
        <Text style={styles.stepEn}>Open Expo Go → Tap "Scan QR Code"</Text>

        <View style={styles.divider} />

        <Text style={styles.altSi}>Scan කරන්න බැරි නම් මෙය copy කරන්න:</Text>
        <Text style={styles.altEn}>Or paste this URL into Expo Go (Enter URL manually):</Text>

        <Pressable
          style={styles.urlBox}
          onPress={() => Linking.openURL(EXPO_URL)}
        >
          <Text style={styles.urlText} selectable>{EXPO_URL}</Text>
          <Text style={styles.tapHint}>Tap to open in Expo Go</Text>
        </Pressable>

        <View style={styles.help}>
          <Text style={styles.helpTitle}>📋 Steps:</Text>
          <Text style={styles.helpStep}>1. Expo Go app එක ෆෝන් එකේ open කරන්න</Text>
          <Text style={styles.helpStep}>2. "Scan QR Code" button එක click කරන්න</Text>
          <Text style={styles.helpStep}>3. ඉහත QR එක phone camera එකට පෙන්වන්න</Text>
          <Text style={styles.helpStep}>4. App එක load වෙයි → "Ganu Denu" එක open වෙයි ✓</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#4C1D95' },
  container: { padding: 24, alignItems: 'center' },

  titleSi: { fontSize: 32, fontWeight: '800', color: '#FFFFFF', marginTop: 8 },
  titleEn: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 28 },

  qrBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  qr: { width: 280, height: 280 },

  stepSi: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginTop: 24, textAlign: 'center' },
  stepEn: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4, textAlign: 'center' },

  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: '100%',
    marginVertical: 24,
  },

  altSi: { fontSize: 14, fontWeight: '700', color: '#FCD34D', textAlign: 'center' },
  altEn: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 4, marginBottom: 12, textAlign: 'center' },

  urlBox: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#FCD34D',
    alignItems: 'center',
  },
  urlText: { fontFamily: 'monospace', fontSize: 13, color: '#FFFFFF', textAlign: 'center' },
  tapHint: { fontSize: 10, color: '#FCD34D', marginTop: 6, fontWeight: '600' },

  help: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    width: '100%',
  },
  helpTitle: { fontSize: 14, fontWeight: '800', color: '#FFFFFF', marginBottom: 10 },
  helpStep: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 6, lineHeight: 18 },
});
