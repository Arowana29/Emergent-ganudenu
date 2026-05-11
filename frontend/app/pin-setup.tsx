import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '../components/Icon';
import { PinPad } from '../components/PinPad';
import { pinService } from '../services/pinService';

const DEEP_PURPLE = '#4C1D95';
const PURPLE = '#5B21B6';

export default function PinSetupScreen() {
  const router = useRouter();
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [pin, setPin] = useState('');
  const [createdPin, setCreatedPin] = useState('');
  const [error, setError] = useState(false);
  const [bioSupport, setBioSupport] = useState<{ supported: boolean; enrolled: boolean; type: string }>({
    supported: false, enrolled: false, type: 'none',
  });

  useEffect(() => {
    pinService.biometricSupported().then(setBioSupport);
  }, []);

  const handleDigit = (d: string) => {
    setError(false);
    if (pin.length >= 4) return;
    const newPin = pin + d;
    setPin(newPin);

    if (newPin.length === 4) {
      if (step === 'create') {
        setTimeout(() => {
          setCreatedPin(newPin);
          setPin('');
          setStep('confirm');
        }, 250);
      } else {
        // Confirm step
        setTimeout(() => {
          if (newPin === createdPin) {
            handleSave(newPin);
          } else {
            setError(true);
            setTimeout(() => {
              setPin('');
              setError(false);
            }, 600);
          }
        }, 250);
      }
    }
  };

  const handleDelete = () => {
    setError(false);
    setPin(p => p.slice(0, -1));
  };

  const handleSave = async (finalPin: string) => {
    try {
      await pinService.setPin(finalPin);
      // Ask about biometric if supported
      if (bioSupport.supported && bioSupport.enrolled) {
        Alert.alert(
          'Biometric සක්‍රීය කරන්නද?',
          bioSupport.type === 'face'
            ? 'Face ID භාවිතා කරලා quick unlock කරන්න ද?'
            : 'Fingerprint භාවිතා කරලා quick unlock කරන්න ද?',
          [
            { text: 'No · එපා', style: 'cancel', onPress: () => router.back() },
            {
              text: 'Yes · ඔව්',
              onPress: async () => {
                await pinService.setBiometric(true);
                router.back();
              },
            },
          ]
        );
      } else {
        Alert.alert('✓ PIN saved', 'ඔබේ PIN එක ආරක්ෂිතව save උනා', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (e) {
      Alert.alert('Error', String(e));
    }
  };

  const reset = () => {
    setStep('create');
    setPin('');
    setCreatedPin('');
    setError(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity testID="back-btn" onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Text style={{ fontSize: 36 }}>{step === 'create' ? '🔒' : '✓'}</Text>
        </View>

        <Text style={styles.titleSi}>
          {step === 'create' ? 'PIN එක සකසන්න' : 'PIN එක තහවුරු කරන්න'}
        </Text>
        <Text style={styles.titleEn}>
          {step === 'create' ? 'Set up PIN' : 'Confirm PIN'}
        </Text>

        <Text style={styles.subtitle}>
          {step === 'create'
            ? 'ඉලක්කම් 4ක PIN එකක් enter කරන්න\n(Enter a 4-digit PIN)'
            : error
              ? '⚠ PIN දෙක match වෙන්නෙ නෑ\n(PINs don\'t match — try again)'
              : 'නැවත PIN එක ඇතුළත් කරන්න\n(Re-enter your PIN)'}
        </Text>

        {step === 'confirm' && !error && (
          <TouchableOpacity onPress={reset} style={styles.resetBtn}>
            <Text style={styles.resetTxt}>← Start over</Text>
          </TouchableOpacity>
        )}

        <View style={{ flex: 1, justifyContent: 'center' }}>
          <PinPad
            pin={pin}
            onPress={handleDigit}
            onDelete={handleDelete}
            error={error}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DEEP_PURPLE },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingTop: 4, paddingBottom: 8,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  content: { flex: 1, alignItems: 'center', paddingHorizontal: 20, paddingTop: 20 },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 18,
  },
  titleSi: { fontSize: 24, fontWeight: '900', color: '#FFFFFF', textAlign: 'center' },
  titleEn: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4, marginBottom: 12 },
  subtitle: {
    fontSize: 13, color: 'rgba(255,255,255,0.85)',
    textAlign: 'center', lineHeight: 19, marginBottom: 10, paddingHorizontal: 20,
  },
  resetBtn: { paddingVertical: 6, paddingHorizontal: 12 },
  resetTxt: { color: '#FCD34D', fontSize: 12, fontWeight: '600' },
});
