import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert, ActivityIndicator, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '../../components/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, RADIUS } from '../../constants/theme';
import { api } from '../../services/api';

const VERSION = '1.0.0';

export default function SettingsScreen() {
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    AsyncStorage.multiGet(['sms_enabled', 'notif_enabled', 'pin_enabled']).then(pairs => {
      setSmsEnabled(pairs[0][1] === '1');
      setNotifEnabled(pairs[1][1] !== '0');
      setPinEnabled(pairs[2][1] === '1');
    });
  }, []);

  const toggle = async (key: string, val: boolean) => {
    await AsyncStorage.setItem(key, val ? '1' : '0');
  };

  const handleSeed = async () => {
    Alert.alert(
      'Demo Data Load කරන්නද?',
      'This will CLEAR all current data and add sample Sri Lankan transactions. Continue?',
      [
        { text: 'නැහැ · Cancel', style: 'cancel' },
        {
          text: 'ඔව් · Load Demo',
          onPress: async () => {
            setSeeding(true);
            try {
              const r = await api.seedData();
              Alert.alert('✅ සාර්ථකයි!', `${r.seeded} demo transactions loaded!\nDemo data ලැබුණා!`);
            } catch (e) {
              Alert.alert('Error', 'Failed to load demo data');
            } finally {
              setSeeding(false);
            }
          },
        },
      ]
    );
  };

  const SettingRow = ({
    icon, iconColor, label, labelEn, children, onPress, testID,
  }: {
    icon: string; iconColor: string; label: string; labelEn: string;
    children?: React.ReactNode; onPress?: () => void; testID?: string;
  }) => (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={styles.row}
    >
      <View style={[styles.rowIcon, { backgroundColor: iconColor + '20' }]}>
        <Ionicons name={icon as any} size={20} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowEn}>{labelEn}</Text>
      </View>
      {children}
      {!children && onPress && <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />}
    </TouchableOpacity>
  );

  const SectionTitle = ({ si, en }: { si: string; en: string }) => (
    <View style={styles.sectionHdr}>
      <Text style={styles.sectionLbl}>{si}</Text>
      <Text style={styles.sectionEn}>{en}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <Text style={styles.title}>සැකසීම්</Text>
          <Text style={styles.titleEn}>Settings · Customize your experience</Text>
        </View>

        {/* Automation */}
        <SectionTitle si="ස්වයංක්‍රීය ලක්ෂණ" en="Automation Features" />
        <View style={styles.card}>
          <SettingRow
            testID="sms-toggle-row"
            icon="mail" iconColor={COLORS.primary}
            label="📱 SMS හඳුනාගැනීම"
            labelEn="Auto SMS bank transaction detection"
          >
            <Switch
              testID="sms-toggle"
              value={smsEnabled}
              onValueChange={v => { setSmsEnabled(v); toggle('sms_enabled', v); }}
              trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
              thumbColor={smsEnabled ? COLORS.primary : '#f4f3f4'}
            />
          </SettingRow>
          <View style={styles.rowDivider} />
          <SettingRow
            testID="notif-toggle-row"
            icon="notifications" iconColor={COLORS.accent}
            label="🔔 දැනුම්දීම්"
            labelEn="Push notifications"
          >
            <Switch
              testID="notif-toggle"
              value={notifEnabled}
              onValueChange={v => { setNotifEnabled(v); toggle('notif_enabled', v); }}
              trackColor={{ false: COLORS.border, true: '#FEF3C7' }}
              thumbColor={notifEnabled ? COLORS.accent : '#f4f3f4'}
            />
          </SettingRow>
        </View>

        {/* Data */}
        <SectionTitle si="දත්ත සහ ආරක්ෂාව" en="Data & Security" />
        <View style={styles.card}>
          <SettingRow
            testID="demo-data-btn"
            icon="flask" iconColor="#8B5CF6"
            label="🎯 Demo Data Load කරන්න"
            labelEn="Load sample Sri Lankan transactions"
            onPress={handleSeed}
          >
            {seeding ? <ActivityIndicator size="small" color={COLORS.primary} /> : undefined}
          </SettingRow>
          <View style={styles.rowDivider} />
          <SettingRow
            testID="export-btn"
            icon="download-outline" iconColor={COLORS.success}
            label="📊 CSV ගොනුව"
            labelEn="Export all transactions"
            onPress={() => Alert.alert('Coming Soon', 'CSV export will be available soon!\nCSV export ඉදිරියේදී එයි!')}
          />
          <View style={styles.rowDivider} />
          <SettingRow
            testID="backup-btn"
            icon="cloud-upload-outline" iconColor="#0284C7"
            label="☁️ Cloud Backup"
            labelEn="Google Drive backup (coming soon)"
            onPress={() => Alert.alert('Firebase Sync', 'Cloud backup coming soon!\nFirebase sync ඉදිරියේදී!')}
          />
          <View style={styles.rowDivider} />
          <SettingRow
            testID="pin-toggle-row"
            icon="lock-closed" iconColor={COLORS.danger}
            label="🔒 PIN අගුල"
            labelEn="App lock with PIN"
          >
            <Switch
              testID="pin-toggle"
              value={pinEnabled}
              onValueChange={v => { setPinEnabled(v); toggle('pin_enabled', v); }}
              trackColor={{ false: COLORS.border, true: '#FEE2E2' }}
              thumbColor={pinEnabled ? COLORS.danger : '#f4f3f4'}
            />
          </SettingRow>
        </View>

        {/* Firebase Section */}
        <SectionTitle si="Firebase සම්බන්ධය" en="Cloud Sync Setup" />
        <View style={[styles.card, styles.firebaseCard]}>
          <Ionicons name="cloud" size={32} color={COLORS.primary} style={{ marginBottom: 10 }} />
          <Text style={styles.firebaseTitle}>Firebase Sync</Text>
          <Text style={styles.firebaseDesc}>
            Cloud sync with Firebase Firestore saves your data safely.{'\n'}
            Firebase Firestore cloud sync ඉදිරියේදී enabled වේ.
          </Text>
          <TouchableOpacity
            testID="firebase-setup-btn"
            style={styles.firebaseBtn}
            onPress={() => Linking.openURL('https://console.firebase.google.com/')}
          >
            <Text style={styles.firebaseBtnTxt}>Firebase Console → Setup</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <SectionTitle si="යෙදුම ගැන" en="About App" />
        <View style={styles.card}>
          <View style={styles.aboutWrap}>
            <Text style={styles.aboutAppName}>Ganu Denu</Text>
            <Text style={styles.aboutSinhala}>ගණු දෙනු · Money Manager</Text>
            <Text style={styles.aboutVersion}>Version {VERSION}</Text>
            <Text style={styles.aboutTagline}>Made with ❤️ for Sri Lanka 🇱🇰</Text>
            <Text style={styles.aboutDesc}>
              Sinhala money manager for Sri Lankan families.{'\n'}
              ශ්‍රී ලාංකීය පවුල් සඳහා සිංහල මුදල් කළමනාකරු.
            </Text>

            <View style={styles.divider} />

            <Text style={styles.contactTitle}>📬 Contact / සම්බන්ධ වන්න</Text>
            <TouchableOpacity
              testID="email-business-btn"
              style={styles.contactRow}
              onPress={() => Linking.openURL('mailto:sismathtrading@kamfa.net')}
            >
              <Ionicons name="briefcase-outline" size={16} color={COLORS.primary} />
              <Text style={styles.contactEmail}>sismathtrading@kamfa.net</Text>
              <Text style={styles.contactBadge}>Business</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="email-gmail-btn"
              style={styles.contactRow}
              onPress={() => Linking.openURL('mailto:silshabir@gmail.com')}
            >
              <Ionicons name="mail-outline" size={16} color="#EA4335" />
              <Text style={styles.contactEmail}>silshabir@gmail.com</Text>
              <Text style={[styles.contactBadge, { backgroundColor: '#FDECEA', color: '#EA4335' }]}>Gmail</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <Text style={styles.copyright}>
              © 2025 Ganu Denu · ගණු දෙනු{'\n'}
              All Rights Reserved · සියලු හිමිකම් ඇවිරිණි{'\n'}
              Developed in UAE 🇦🇪 for Sri Lanka 🇱🇰
            </Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 16 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.textMain },
  titleEn: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },

  sectionHdr: { paddingHorizontal: 20, marginTop: 6, marginBottom: 8 },
  sectionLbl: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  sectionEn: { fontSize: 10, color: COLORS.textMuted },

  card: { marginHorizontal: 16, backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  rowIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  rowLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textMain },
  rowEn: { fontSize: 11, color: COLORS.textMuted, marginTop: 1 },
  rowDivider: { height: 1, backgroundColor: COLORS.border, marginLeft: 68 },

  firebaseCard: { alignItems: 'center', padding: 24 },
  firebaseTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textMain, marginBottom: 8 },
  firebaseDesc: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center', lineHeight: 18, marginBottom: 16 },
  firebaseBtn: { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.lg, paddingHorizontal: 24, paddingVertical: 12 },
  firebaseBtnTxt: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },

  aboutWrap: { alignItems: 'center', padding: 24 },
  aboutAppName: { fontSize: 24, fontWeight: '800', color: COLORS.primary, marginBottom: 2 },
  aboutSinhala: { fontSize: 14, fontWeight: '600', color: COLORS.textMuted, marginBottom: 6 },
  aboutVersion: { fontSize: 13, color: COLORS.textMuted, marginBottom: 6 },
  aboutTagline: { fontSize: 14, fontWeight: '600', color: COLORS.accent, marginBottom: 10 },
  aboutDesc: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center', lineHeight: 18, marginBottom: 4 },
  divider: { width: '100%', height: 1, backgroundColor: COLORS.border, marginVertical: 16 },
  contactTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textMain, marginBottom: 10, alignSelf: 'flex-start' },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, alignSelf: 'flex-start' },
  contactEmail: { fontSize: 13, color: COLORS.primary, fontWeight: '600', textDecorationLine: 'underline' },
  contactBadge: { backgroundColor: COLORS.primaryLight, color: COLORS.primary, fontSize: 10, fontWeight: '700', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  copyright: { fontSize: 11, color: COLORS.textMuted, textAlign: 'center', lineHeight: 18 },
});
