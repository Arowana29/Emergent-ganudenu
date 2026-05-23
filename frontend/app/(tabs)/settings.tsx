import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '../../components/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, RADIUS } from '../../constants/theme';
import { api } from '../../services/api';
import { pinService } from '../../services/pinService';

const VERSION = '1.0.0';

export default function SettingsScreen() {
  const router = useRouter();
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [devTapCount, setDevTapCount] = useState(0);

  useEffect(() => {
    AsyncStorage.multiGet(['sms_enabled', 'notif_enabled', 'dev_mode'])
      .then(pairs => {
        setSmsEnabled(pairs[0][1] === '1');
        setNotifEnabled(pairs[1][1] !== '0');
        setDevMode(pairs[2][1] === '1');
      });
    pinService.isEnabled()
      .then(setPinEnabled);
  }, []);

  const toggle = async (key: string, val: boolean) => {
    await AsyncStorage.setItem(key, val ? '1' : '0');
  };

  const handleVersionTap = async () => {
    const newCount = devTapCount + 1;
    setDevTapCount(newCount);
    if (newCount >= 7) {
      const newDevMode = !devMode;
      setDevMode(newDevMode);
      await AsyncStorage.setItem('dev_mode', newDevMode ? '1' : '0');
      setDevTapCount(0);
      Alert.alert(
        newDevMode ? 'Developer Mode ON' : 'Developer Mode OFF',
        newDevMode ? 'Data management tools are now visible.' : 'Developer tools hidden.'
      );
    }
  };

  const togglePinLock = async (newVal: boolean) => {
    if (newVal) {
      router.push('/pin-setup');
    } else {
      await pinService.disable();
      setPinEnabled(false);
    }
  };

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      await api.seedDemoData();
      Alert.alert('සාර්ථකයි', 'Demo data loaded successfully.');
    } catch (e) {
      Alert.alert('Error', 'Failed to seed demo data.');
    } finally {
      setSeeding(false);
    }
  };

  const handleClearAllData = () => {
    Alert.alert(
      'දත්ත මකන්න | Clear All Data',
      'සියලු දේශීය දත්ත, PIN සහ සැකසුම් මකා දැමේ.\nThis will erase all local data, PIN, and settings. Continue?',
      [
        { text: 'අවලංගු කරන්න | Cancel', style: 'cancel' },
        {
          text: 'මකන්න | Clear',
          style: 'destructive',
          onPress: async () => {
            setClearing(true);
            try {
              await AsyncStorage.clear();
              await pinService.disable();
              setSmsEnabled(false);
              setNotifEnabled(true);
              setPinEnabled(false);
              setDevMode(false);
              Alert.alert(
                'සාර්ථකයි | Done',
                'සියලු දත්ත සාර්ථකව මකා දැමිණි.\nAll data cleared. Restart the app for changes to take effect.',
                [{ text: 'OK', onPress: () => router.replace('/') }]
              );
            } catch (e) {
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            } finally {
              setClearing(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.header}>සැකසුම් | Settings</Text>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>දැනුම්දීම් | Notifications</Text>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>Push Notifications</Text>
                <Text style={styles.rowSub}>දැනුම්දීම් සක්‍රීය කරන්න</Text>
              </View>
            </View>
            <Switch
              value={notifEnabled}
              onValueChange={val => { setNotifEnabled(val); toggle('notif_enabled', val); }}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="chatbubble-outline" size={20} color={COLORS.primary} />
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>SMS Alerts</Text>
                <Text style={styles.rowSub}>SMS දැනුම්දීම්</Text>
              </View>
            </View>
            <Switch
              value={smsEnabled}
              onValueChange={val => { setSmsEnabled(val); toggle('sms_enabled', val); }}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ආරක්ෂාව | Security</Text>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} />
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>PIN Lock</Text>
                <Text style={styles.rowSub}>PIN අගුලු දැමීම</Text>
              </View>
            </View>
            <Switch
              value={pinEnabled}
              onValueChange={togglePinLock}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
          {pinEnabled && (
            <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/pin-setup')}>
              <Ionicons name="key-outline" size={18} color={COLORS.primary} />
              <Text style={styles.linkText}>Change PIN | PIN වෙනස් කරන්න</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>යෙදුම ගැන | About</Text>
          <TouchableOpacity style={styles.row} onPress={handleVersionTap}>
            <View style={styles.rowLeft}>
              <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>Version</Text>
                <Text style={styles.rowSub}>v{VERSION}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} onPress={() => Linking.openURL('https://ganu-denu-privacy.netlify.app')}>
            <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.primary} />
            <Text style={styles.linkText}>Privacy Policy | රහස්‍යතා ප්‍රතිපත්තිය</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>

        {/* Developer Tools - hidden until 7 taps on version */}
        {devMode && (
          <View style={[styles.section, styles.devSection]}>
            <Text style={styles.sectionTitle}>Developer Tools</Text>
            <Text style={styles.devNote}>These options are for testing only and will not appear in production.</Text>

            <TouchableOpacity
              style={[styles.devButton, styles.seedButton]}
              onPress={handleSeedData}
              disabled={seeding}
            >
              {seeding ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Ionicons name="cloud-upload-outline" size={18} color={COLORS.white} />
                  <Text style={styles.devButtonText}>Load Demo Data | ආදර්ශ දත්ත පූරණය</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.devButton, styles.clearButton]}
              onPress={handleClearAllData}
              disabled={clearing}
            >
              {clearing ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Ionicons name="trash-outline" size={18} color={COLORS.white} />
                  <Text style={styles.devButtonText}>Clear All Data | දත්ත මකන්න</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  devSection: {
    borderWidth: 1,
    borderColor: '#FF6B35',
    backgroundColor: '#FFF8F5',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rowText: { marginLeft: 12, flex: 1 },
  rowLabel: { fontSize: 15, color: COLORS.text, fontWeight: '500' },
  rowSub: { fontSize: 12, color: COLORS.textLight, marginTop: 1 },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 10,
  },
  linkText: { flex: 1, fontSize: 14, color: COLORS.primary },
  devNote: {
    fontSize: 12,
    color: '#FF6B35',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  devButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: RADIUS.sm,
    marginVertical: 6,
    gap: 8,
  },
  seedButton: { backgroundColor: COLORS.primary },
  clearButton: { backgroundColor: '#E53935' },
  devButtonText: { color: COLORS.white, fontWeight: '600', fontSize: 14 },
});
