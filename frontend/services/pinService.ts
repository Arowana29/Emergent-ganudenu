/**
 * PIN Lock service — stores hashed PIN securely & verifies on app start.
 *
 * Uses expo-secure-store (encrypted on Android Keystore / iOS Keychain).
 * PIN is hashed using a simple hash (sufficient for local-only auth).
 */
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

const PIN_KEY = 'ganu_denu_pin_hash';
const PIN_ENABLED_KEY = 'ganu_denu_pin_enabled';
const BIOMETRIC_KEY = 'ganu_denu_biometric_enabled';

// Simple hash for local PIN storage (this is local-only, server never sees PIN)
function hashPin(pin: string): string {
  // djb2 hash — fast & unique for 4-6 digit numeric PINs
  let h = 5381;
  for (let i = 0; i < pin.length; i++) {
    h = ((h << 5) + h) + pin.charCodeAt(i);
  }
  return `gd_${Math.abs(h).toString(36)}_${pin.length}`;
}

export const pinService = {
  /** Check if PIN lock is currently enabled */
  async isEnabled(): Promise<boolean> {
    try {
      const v = await SecureStore.getItemAsync(PIN_ENABLED_KEY);
      return v === '1';
    } catch {
      return false;
    }
  },

  /** Check if biometric (fingerprint/face) is enabled in app settings */
  async isBiometricEnabled(): Promise<boolean> {
    try {
      const v = await SecureStore.getItemAsync(BIOMETRIC_KEY);
      return v === '1';
    } catch {
      return false;
    }
  },

  /** Save a new PIN (hashed) and enable lock */
  async setPin(pin: string): Promise<void> {
    if (pin.length < 4) throw new Error('PIN must be at least 4 digits');
    const hash = hashPin(pin);
    await SecureStore.setItemAsync(PIN_KEY, hash);
    await SecureStore.setItemAsync(PIN_ENABLED_KEY, '1');
  },

  /** Verify a PIN attempt against stored hash */
  async verifyPin(pin: string): Promise<boolean> {
    try {
      const stored = await SecureStore.getItemAsync(PIN_KEY);
      if (!stored) return false;
      return stored === hashPin(pin);
    } catch {
      return false;
    }
  },

  /** Disable PIN lock and remove stored hash */
  async disable(): Promise<void> {
    await SecureStore.deleteItemAsync(PIN_KEY);
    await SecureStore.setItemAsync(PIN_ENABLED_KEY, '0');
    await SecureStore.setItemAsync(BIOMETRIC_KEY, '0');
  },

  /** Toggle biometric usage (requires PIN to be set first) */
  async setBiometric(enabled: boolean): Promise<boolean> {
    if (enabled) {
      const supported = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!supported || !enrolled) return false;
    }
    await SecureStore.setItemAsync(BIOMETRIC_KEY, enabled ? '1' : '0');
    return true;
  },

  /** Check if device supports biometrics */
  async biometricSupported(): Promise<{ supported: boolean; enrolled: boolean; type: string }> {
    try {
      const supported = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      let typeStr = 'biometric';
      if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) typeStr = 'fingerprint';
      else if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) typeStr = 'face';
      return { supported, enrolled, type: typeStr };
    } catch {
      return { supported: false, enrolled: false, type: 'none' };
    }
  },

  /** Prompt biometric authentication */
  async authenticateBiometric(): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Ganu Denu unlock කරන්න',
        cancelLabel: 'PIN භාවිතා කරන්න',
        fallbackLabel: 'PIN භාවිතා කරන්න',
      });
      return result.success;
    } catch {
      return false;
    }
  },
};
