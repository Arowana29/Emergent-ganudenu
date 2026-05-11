import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { PinPad } from '../components/PinPad';
import { pinService } from '../services/pinService';

const DEEP_PURPLE = '#4C1D95';

export default function PinUnlockScreen() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [bio, setBio] = useState({ enabled: false, type: 'fingerprint' });

  const tryBiometric = useCallback(async () => {
    const bioEnabled = await pinService.isBiometricEnabled();
    const bioInfo = await pinService.biometricSupported();
    if (bioEnabled && bioInfo.supported && bioInfo.enrolled) {
      setBio({ enabled: true, type: bioInfo.type });
      const ok = await pinService.authenticateBiometric();
      if (ok) {
        router.replace('/');
      }
    }
  }, [router]);

  useEffect(() => {
    tryBiometric();
  }, [tryBiometric]);

  const handleDigit = (d: string) => {
    setError(false);
    if (pin.length >= 4) return;
    const newPin = pin + d;
    setPin(newPin);

    if (newPin.length === 4) {
      setTimeout(async () => {
        const ok = await pinService.verifyPin(newPin);
        if (ok) {
          router.replace('/');
        } else {
          setError(true);
          const a = attempts + 1;
          setAttempts(a);
          if (a >= 5) {
            Alert.alert('🔒 අවසරයන් අවසන්', '5වර වැරදී. App එක මත්තටම් lock වෙයි.', [{ text: 'OK' }]);
          }
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 600);
        }
      }, 200);
    }
  };

  const handleDelete = () => {
    setError(false);
    setPin(p => p.slice(0, -1));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Text style={{ fontSize: 44 }}>🔒</Text>
        </View>

        <Text style={styles.titleSi}>Ganu Denu unlock කරන්න</Text>
        <Text style={styles.titleEn}>Enter your PIN to unlock</Text>

        {error && (
          <Text style={styles.errorTxt}>⚠ වැරදි PIN · Wrong PIN ({attempts}/5)</Text>
        )}

        <View style={{ flex: 1, justifyContent: 'center' }}>
          <PinPad
            pin={pin}
            onPress={handleDigit}
            onDelete={handleDelete}
            onBiometric={tryBiometric}
            showBiometric={bio.enabled}
            biometricType={bio.type}
            error={error}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DEEP_PURPLE },
  content: { flex: 1, alignItems: 'center', paddingTop: 60, paddingHorizontal: 20 },
  iconCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  titleSi: { fontSize: 26, fontWeight: '900', color: '#FFFFFF', textAlign: 'center' },
  titleEn: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 4, marginBottom: 14 },
  errorTxt: { color: '#FCA5A5', fontSize: 13, marginBottom: 6, fontWeight: '600' },
});
