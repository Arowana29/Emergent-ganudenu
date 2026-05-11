import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from './Icon';

interface Props {
  pin: string;
  onPress: (digit: string) => void;
  onDelete: () => void;
  onBiometric?: () => void;
  showBiometric?: boolean;
  biometricType?: 'fingerprint' | 'face' | string;
  maxLength?: number;
  error?: boolean;
}

export const PinPad: React.FC<Props> = ({
  pin, onPress, onDelete, onBiometric, showBiometric, biometricType, maxLength = 4, error,
}) => {
  const dots = Array.from({ length: maxLength });
  const keys: (string | null)[] = ['1','2','3','4','5','6','7','8','9'];

  return (
    <View style={styles.wrap}>
      {/* Dots */}
      <View style={[styles.dotsRow, error && styles.dotsRowError]}>
        {dots.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              pin.length > i && styles.dotFilled,
              error && pin.length > 0 && styles.dotError,
            ]}
          />
        ))}
      </View>

      {/* Number Grid */}
      <View style={styles.grid}>
        {keys.map(k => (
          <TouchableOpacity
            key={k}
            testID={`pin-${k}`}
            style={styles.key}
            onPress={() => onPress(k!)}
            activeOpacity={0.6}
          >
            <Text style={styles.keyTxt}>{k}</Text>
          </TouchableOpacity>
        ))}

        {/* Biometric (or empty) */}
        <View style={styles.key}>
          {showBiometric ? (
            <TouchableOpacity
              testID="pin-biometric"
              style={styles.bioKey}
              onPress={onBiometric}
              activeOpacity={0.6}
            >
              <Ionicons
                name={biometricType === 'face' ? 'eye' : 'lock-closed'}
                size={28}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* 0 */}
        <TouchableOpacity
          testID="pin-0"
          style={styles.key}
          onPress={() => onPress('0')}
          activeOpacity={0.6}
        >
          <Text style={styles.keyTxt}>0</Text>
        </TouchableOpacity>

        {/* Delete */}
        <TouchableOpacity
          testID="pin-del"
          style={styles.key}
          onPress={onDelete}
          activeOpacity={0.6}
        >
          <Ionicons name="backspace-outline" size={26} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },

  // Dots
  dotsRow: { flexDirection: 'row', gap: 18, marginBottom: 36 },
  dotsRowError: { transform: [{ translateX: -3 }] }, // visual shake hint
  dot: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  dotFilled: { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' },
  dotError: { backgroundColor: '#EF4444', borderColor: '#EF4444' },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 280,
    justifyContent: 'center',
    gap: 14,
  },
  key: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  keyTxt: { color: '#FFFFFF', fontSize: 28, fontWeight: '500' },
  bioKey: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(252,211,77,0.18)',
    borderWidth: 1.5, borderColor: '#FCD34D',
    alignItems: 'center', justifyContent: 'center',
  },
});

export default PinPad;
