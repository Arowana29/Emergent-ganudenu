import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl, Modal, Alert, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { COLORS, RADIUS, formatLKR, MONTHS_SI, MONTHS_EN } from '../../constants/theme';
import { CATEGORIES, getCategoryById } from '../../constants/categories';
import { api, Transaction, MonthStats } from '../../services/api';
import TransactionItem from '../../components/TransactionItem';

const DEMO_SMS = {
  bank: 'BOC Bank',
  raw: 'BOC Bank: Debit Rs.3,500.00. Keells Super Colombo. Ref:TXN2847B. Available: Rs.62,300.00',
  amount: 3500,
  merchant: 'Keells Super Colombo',
  category: 'food',
};

export default function HomeScreen() {
  const router = useRouter();
  const now = new Date();
  const [stats, setStats] = useState<MonthStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSms, setShowSms] = useState(false);

  const load = useCallback(async () => {
    try {
      const [txns, s] = await Promise.all([
        api.getTransactions(now.getMonth() + 1, now.getFullYear()),
        api.getStats(now.getMonth() + 1, now.getFullYear()),
      ]);
      setTransactions(txns);
      setStats(s);
    } catch (e) {
      console.error('Load error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { setLoading(true); load(); }, [load]));
  const onRefresh = () => { setRefreshing(true); load(); };

  const greeting = () => {
    const h = now.getHours();
    if (h < 12) return { si: 'ශුභ උදෑසනක්', en: 'Good morning' };
    if (h < 17) return { si: 'ශුභ දහවලක්', en: 'Good afternoon' };
    return { si: 'ශුභ සන්ධ්‍යාවක්', en: 'Good evening' };
  };

  const handleDelete = (id: string) => {
    Alert.alert('ගනුදෙනු මකන්නද?', 'Delete this transaction?', [
      { text: 'නැහැ · Cancel', style: 'cancel' },
      {
        text: 'ඔව් · Delete', style: 'destructive',
        onPress: async () => {
          await api.deleteTransaction(id);
          load();
        },
      },
    ]);
  };

  const filtered = selectedCat === 'all'
    ? transactions.slice(0, 10)
    : transactions.filter(t => t.category === selectedCat).slice(0, 10);

  const g = greeting();
  const monthLabel = `${MONTHS_SI[now.getMonth()]} ${now.getFullYear()}`;
  const monthLabelEn = `${MONTHS_EN[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{g.si} · {g.en} 🙏</Text>
            <Text style={styles.appName}>ගණු දෙනු</Text>
            <Text style={styles.appNameEn}>Ganu Denu · Money Manager</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              testID="sms-demo-btn"
              style={styles.iconBtn}
              onPress={() => setShowSms(true)}
            >
              <Ionicons name="mail-outline" size={22} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity testID="notification-btn" style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={22} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Card */}
        <LinearGradient
          colors={['#7C3AED', '#5B21B6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balCard}
        >
          <Image
            source={{ uri: 'https://static.prod-images.emergentagent.com/jobs/bc976d05-1dba-4d30-84c2-777793e168b1/images/77af85ae5d9736ef631dc386d91041594e842114add44a4a1b06809d387385b2.png' }}
            style={styles.cardBg}
          />
          <View style={styles.cardContent}>
            <Text style={styles.balLabel}>මාසික ශේෂය</Text>
            <Text style={styles.balLabelEn}>{monthLabel} · {monthLabelEn}</Text>
            {loading ? (
              <ActivityIndicator color="#fff" size="large" style={{ marginVertical: 12 }} />
            ) : (
              <Text testID="balance-amount" style={styles.balAmount}>
                {formatLKR(stats?.balance ?? 0)}
              </Text>
            )}
            <View style={styles.incExpRow}>
              <View style={styles.incExpItem}>
                <View style={styles.incDot} />
                <View>
                  <Text style={styles.incExpLabel}>ලැබීම් · Income</Text>
                  <Text style={styles.incExpAmount}>{formatLKR(stats?.income ?? 0)}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.incExpItem}>
                <View style={styles.expDot} />
                <View>
                  <Text style={styles.incExpLabel}>වියදම් · Expenses</Text>
                  <Text style={styles.incExpAmount}>{formatLKR(stats?.expenses ?? 0)}</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{stats?.total_count ?? 0}</Text>
            <Text style={styles.statLbl}>ගනුදෙනු</Text>
            <Text style={styles.statLblEn}>Transactions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: COLORS.primary }]}>{stats?.sms_count ?? 0}</Text>
            <Text style={styles.statLbl}>SMS සිට</Text>
            <Text style={styles.statLblEn}>Auto-SMS</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: COLORS.accent }]}>
              {stats?.categories?.length ?? 0}
            </Text>
            <Text style={styles.statLbl}>වර්ගය</Text>
            <Text style={styles.statLblEn}>Categories</Text>
          </View>
        </View>

        {/* Category Filter */}
        <Text style={styles.sectionTitle}>
          <Text style={styles.sectionTitleSi}>මෑත ගනුදෙනු  </Text>
          <Text style={styles.sectionTitleEn}>Recent Transactions</Text>
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        >
          <TouchableOpacity
            testID="cat-chip-all"
            style={[styles.chip, selectedCat === 'all' && styles.chipActive]}
            onPress={() => setSelectedCat('all')}
          >
            <Text style={[styles.chipTxt, selectedCat === 'all' && styles.chipTxtActive]}>📋 සියල්ල</Text>
          </TouchableOpacity>
          {CATEGORIES.slice(0, 10).map(cat => (
            <TouchableOpacity
              key={cat.id}
              testID={`cat-chip-${cat.id}`}
              style={[styles.chip, selectedCat === cat.id && styles.chipActive, selectedCat === cat.id && { backgroundColor: cat.color }]}
              onPress={() => setSelectedCat(cat.id)}
            >
              <Text style={[styles.chipTxt, selectedCat === cat.id && styles.chipTxtActive]}>
                {cat.emoji} {cat.sinhala}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Transactions List */}
        <View style={styles.listWrap}>
          {loading ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginTop: 32 }} />
          ) : filtered.length === 0 ? (
            <View style={styles.emptyState} testID="empty-state">
              <Image
                source={{ uri: 'https://static.prod-images.emergentagent.com/jobs/bc976d05-1dba-4d30-84c2-777793e168b1/images/2b6dae5363ccdbe83ffb599e9aae39dcf3f83eefe4cc55e7ecea50ddb44e80b3.png' }}
                style={styles.emptyImg}
              />
              <Text style={styles.emptyTitle}>ගනුදෙනු නැහැ</Text>
              <Text style={styles.emptySubtitle}>No transactions yet</Text>
              <TouchableOpacity
                testID="add-first-btn"
                style={styles.addFirstBtn}
                onPress={() => router.push('/add-transaction')}
              >
                <Text style={styles.addFirstTxt}>+ ගනුදෙනු එකතු කරන්න · Add Transaction</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filtered.map(t => (
              <TransactionItem key={t.id} transaction={t} onDelete={handleDelete} />
            ))
          )}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* SMS Demo Bottom Sheet */}
      <Modal visible={showSms} transparent animationType="slide">
        <TouchableOpacity style={styles.overlay} onPress={() => setShowSms(false)} activeOpacity={1}>
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={styles.sheet}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetHeader}>
                <View style={styles.smsBadgeWrap}>
                  <Ionicons name="mail" size={20} color={COLORS.accentDark} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.sheetTitle}>📩 SMS ගනුදෙනු හඳුනා ගැනිණි</Text>
                  <Text style={styles.sheetSubtitle}>Transaction Detected · {DEMO_SMS.bank}</Text>
                </View>
              </View>
              <View style={styles.smsRaw}>
                <Text style={styles.smsRawTxt}>{DEMO_SMS.raw}</Text>
              </View>
              <Text style={styles.smsAmount}>{formatLKR(DEMO_SMS.amount)}</Text>
              <Text style={styles.smsMerchant}>{DEMO_SMS.merchant}</Text>
              <View style={styles.sheetBtns}>
                <TouchableOpacity
                  testID="sms-add-btn"
                  style={styles.sheetAddBtn}
                  onPress={() => {
                    setShowSms(false);
                    router.push({
                      pathname: '/add-transaction',
                      params: {
                        smsAmount: DEMO_SMS.amount,
                        smsCategory: DEMO_SMS.category,
                        smsDesc: DEMO_SMS.merchant,
                        smsRaw: DEMO_SMS.raw,
                        fromSms: '1',
                      },
                    });
                  }}
                >
                  <Text style={styles.sheetAddTxt}>+ වියදමට එකතු කරන්න · Add Expense</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  testID="sms-dismiss-btn"
                  style={styles.sheetDismissBtn}
                  onPress={() => setShowSms(false)}
                >
                  <Text style={styles.sheetDismissTxt}>ඉවත් කරන්න · Dismiss</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  greeting: { fontSize: 12, color: COLORS.textMuted, marginBottom: 2 },
  appName: { fontSize: 26, fontWeight: '800', color: COLORS.textMain },
  appNameEn: { fontSize: 11, color: COLORS.textMuted, marginTop: 1 },
  headerIcons: { flexDirection: 'row', gap: 8, marginTop: 8 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },

  balCard: { marginHorizontal: 16, marginBottom: 16, borderRadius: RADIUS.xxl, overflow: 'hidden', minHeight: 160 },
  cardBg: { position: 'absolute', width: '100%', height: '100%', opacity: 0.12, resizeMode: 'cover' },
  cardContent: { padding: 22 },
  balLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 2 },
  balLabelEn: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 6 },
  balAmount: { fontSize: 36, fontWeight: '800', color: '#FFFFFF', marginBottom: 16 },
  incExpRow: { flexDirection: 'row', alignItems: 'center' },
  incExpItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  incDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#6EE7B7' },
  expDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FCA5A5' },
  incExpLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)' },
  incExpAmount: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  divider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 12 },

  statsRow: { flexDirection: 'row', marginHorizontal: 16, gap: 10, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: 14, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  statNum: { fontSize: 22, fontWeight: '800', color: COLORS.textMain },
  statLbl: { fontSize: 11, fontWeight: '600', color: COLORS.textMain, marginTop: 2 },
  statLblEn: { fontSize: 9, color: COLORS.textMuted, marginTop: 1 },

  sectionTitle: { paddingHorizontal: 20, marginBottom: 10 },
  sectionTitleSi: { fontSize: 16, fontWeight: '700', color: COLORS.textMain },
  sectionTitleEn: { fontSize: 12, color: COLORS.textMuted },

  chipScroll: { marginBottom: 14 },
  chip: { backgroundColor: COLORS.inputBg, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  chipActive: { backgroundColor: COLORS.primary },
  chipTxt: { fontSize: 13, color: COLORS.textMuted, fontWeight: '500' },
  chipTxtActive: { color: '#FFFFFF', fontWeight: '700' },

  listWrap: { paddingHorizontal: 16 },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyImg: { width: 160, height: 160, resizeMode: 'contain', opacity: 0.7 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textMain, marginTop: 16 },
  emptySubtitle: { fontSize: 13, color: COLORS.textMuted, marginTop: 4 },
  addFirstBtn: { marginTop: 20, backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, paddingHorizontal: 24, paddingVertical: 14 },
  addFirstTxt: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },

  // SMS Sheet
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 36 },
  sheetHandle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  smsBadgeWrap: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center' },
  sheetTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textMain },
  sheetSubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  smsRaw: { backgroundColor: COLORS.inputBg, borderRadius: RADIUS.md, padding: 12, marginBottom: 16 },
  smsRawTxt: { fontFamily: 'monospace', fontSize: 11, color: COLORS.textMuted, lineHeight: 17 },
  smsAmount: { fontSize: 28, fontWeight: '800', color: COLORS.primary, textAlign: 'center', marginBottom: 4 },
  smsMerchant: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginBottom: 20 },
  sheetBtns: { gap: 10 },
  sheetAddBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, padding: 16, alignItems: 'center' },
  sheetAddTxt: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  sheetDismissBtn: { backgroundColor: COLORS.inputBg, borderRadius: RADIUS.lg, padding: 14, alignItems: 'center' },
  sheetDismissTxt: { color: COLORS.textMuted, fontWeight: '600', fontSize: 14 },
});
