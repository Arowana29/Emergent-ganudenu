import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '../../components/Icon';
import { useFocusEffect, useRouter } from 'expo-router';
import { COLORS, RADIUS, formatLKR, MONTHS_SI, MONTHS_EN } from '../../constants/theme';
import { CATEGORIES, getCategoryById } from '../../constants/categories';
import { api, Transaction, MonthStats } from '../../services/api';
import TransactionItem from '../../components/TransactionItem';

const DEEP_PURPLE = '#4C1D95';
const MID_PURPLE = '#5B21B6';

const DEMO_SMS = {
  bank: 'BOC Bank',
  raw: 'Debit Rs.3,500.00. Keells Super Colombo. Ref:TXN2847B',
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
  const [showSms, setShowSms] = useState(true);

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

  const greeting = () => 'ආයුබෝවන් 🙏';

  const handleDelete = (id: string) => {
    Alert.alert('ගනුදෙනු මකන්නද?', 'Delete this transaction?', [
      { text: 'නැහැ · Cancel', style: 'cancel' },
      { text: 'ඔව් · Delete', style: 'destructive', onPress: async () => { await api.deleteTransaction(id); load(); } },
    ]);
  };

  const filtered = selectedCat === 'all'
    ? transactions.slice(0, 10)
    : transactions.filter(t => t.category === selectedCat).slice(0, 10);

  const monthLabel = `${MONTHS_SI[now.getMonth()]} ${now.getFullYear()}`;
  const monthLabelEn = `${MONTHS_EN[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFFFFF" />}
      >
        {/* ══ DEEP PURPLE HEADER ══ */}
        <View style={styles.headerZone}>
          {/* Title Row */}
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.greeting}>{greeting()}</Text>
              <View style={styles.titleLine}>
                <Text style={styles.appTitleSi}>ගණු දෙනු</Text>
                <Text style={styles.titleSep}> · </Text>
                <Text style={styles.appTitleEn}>Ganu Denu</Text>
              </View>
              <Text style={styles.appSubtitle}>Money Manager 🇱🇰</Text>
            </View>
            <View style={styles.iconRow}>
              <TouchableOpacity testID="search-btn" style={styles.iconCircle}>
                <Ionicons name="search" size={20} color={DEEP_PURPLE} />
              </TouchableOpacity>
              <TouchableOpacity testID="notif-btn" style={styles.iconCircle}>
                <Ionicons name="notifications" size={20} color={DEEP_PURPLE} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Balance */}
          <View style={styles.balZone}>
            <Text style={styles.balLabelSi}>මාසික ශේෂය</Text>
            <Text style={styles.balLabelEn}>Monthly Balance · {monthLabel}</Text>
            {loading
              ? <ActivityIndicator color="#fff" size="large" style={{ marginVertical: 10 }} />
              : <Text testID="balance-amount" style={styles.balAmount}>
                  රු. {Math.round(stats?.balance ?? 0).toLocaleString('en-US')}
                </Text>
            }
            <View style={styles.incExpRow}>
              <View style={styles.incBox}>
                <Text style={styles.boxTopLabel}>ලැබීම් · Income</Text>
                <Text style={styles.incAmt}>
                  රු. {Math.round(stats?.income ?? 0).toLocaleString('en-US')}
                </Text>
              </View>
              <View style={styles.expBox}>
                <Text style={styles.boxTopLabel}>වියදම් · Expenses</Text>
                <Text style={styles.expAmt}>
                  රු. {Math.round(stats?.expenses ?? 0).toLocaleString('en-US')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ══ LIGHT CONTENT ══ */}
        <View style={styles.contentZone}>

          {/* SMS Banner - always visible inline */}
          {showSms && (
            <View testID="sms-banner" style={styles.smsBanner}>
              <View style={styles.smsIconBox}>
                <Ionicons name="briefcase" size={22} color="#D97706" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.smsTitleSi}>SMS ගනුදෙනු හඳුනා ගැනීම</Text>
                <Text style={styles.smsTitleEn}>Transaction Detected · {DEMO_SMS.bank}</Text>
                <Text style={styles.smsBodyTxt}>{DEMO_SMS.raw}</Text>
                <View style={styles.smsBtnRow}>
                  <TouchableOpacity
                    testID="sms-add-btn"
                    style={styles.smsAddBtn}
                    onPress={() => {
                      setShowSms(false);
                      router.push({
                        pathname: '/add-transaction',
                        params: { smsAmount: DEMO_SMS.amount, smsCategory: DEMO_SMS.category, smsDesc: DEMO_SMS.merchant, fromSms: '1' },
                      });
                    }}
                  >
                    <Text style={styles.smsAddTxt}>+ වියදමට එකතු කරන්න</Text>
                  </TouchableOpacity>
                  <TouchableOpacity testID="sms-dismiss-btn" style={styles.smsDismissBtn} onPress={() => setShowSms(false)}>
                    <Text style={styles.smsDismissTxt}>ඉවත් කරන්න</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNum}>{stats?.total_count ?? 0}</Text>
              <Text style={styles.statSi}>ගනුදෙනු</Text>
              <Text style={styles.statEn}>Transactions</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNum, { color: MID_PURPLE }]}>{stats?.sms_count ?? 0}</Text>
              <Text style={styles.statSi}>SMS සිට</Text>
              <Text style={styles.statEn}>Auto-detected</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNum, { color: '#F59E0B' }]}>{stats?.categories?.length ?? 0}</Text>
              <Text style={styles.statSi}>ශ්‍රේණිය</Text>
              <Text style={styles.statEn}>Categories</Text>
            </View>
          </View>

          {/* Categories Section */}
          <View style={styles.secHdr}>
            <Text style={styles.secSi}>ශ්‍රේණිය</Text>
            <Text style={styles.secEn}>Categories</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 4 }}
            style={{ marginBottom: 20 }}
          >
            <TouchableOpacity
              testID="cat-all"
              style={[styles.catChip, selectedCat === 'all' && styles.catChipSel]}
              onPress={() => setSelectedCat('all')}
            >
              <Text style={styles.catEmoji}>📋</Text>
              <Text style={[styles.catSi, selectedCat === 'all' && { color: '#fff' }]}>සියල්ල</Text>
              <Text style={[styles.catEn, selectedCat === 'all' && { color: 'rgba(255,255,255,0.7)' }]}>All</Text>
            </TouchableOpacity>
            {CATEGORIES.filter(c => !c.isIncome).map(cat => (
              <TouchableOpacity
                key={cat.id}
                testID={`cat-chip-${cat.id}`}
                style={[styles.catChip, selectedCat === cat.id && { backgroundColor: cat.color, borderColor: cat.color }]}
                onPress={() => setSelectedCat(cat.id)}
              >
                <Text style={styles.catEmoji}>{cat.emoji}</Text>
                <Text style={[styles.catSi, selectedCat === cat.id && { color: '#fff' }]}>{cat.sinhala}</Text>
                <Text style={[styles.catEn, selectedCat === cat.id && { color: 'rgba(255,255,255,0.7)' }]}>{cat.english}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Transactions */}
          <View style={styles.secHdr}>
            <Text style={styles.secSi}>මෑත ගනුදෙනු</Text>
            <Text style={styles.secEn}>Recent Transactions</Text>
          </View>
          <View style={{ paddingHorizontal: 16 }}>
            {loading ? (
              <ActivityIndicator color={MID_PURPLE} style={{ marginTop: 32 }} />
            ) : filtered.length === 0 ? (
              <View style={styles.emptyBox} testID="empty-state">
                <Text style={styles.emptyEmoji}>💰</Text>
                <Text style={styles.emptyTitle}>ගනුදෙනු නැහැ</Text>
                <Text style={styles.emptySubtitle}>No transactions yet</Text>
                <TouchableOpacity testID="add-first-btn" style={styles.addFirstBtn} onPress={() => router.push('/add-transaction')}>
                  <Text style={styles.addFirstTxt}>+ ගනුදෙනු එකතු කරන්න · Add Transaction</Text>
                </TouchableOpacity>
              </View>
            ) : (
              filtered.map(t => <TransactionItem key={t.id} transaction={t} onDelete={handleDelete} />)
            )}
          </View>
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DEEP_PURPLE },

  // ── Header Zone (deep purple) ──
  headerZone: { backgroundColor: DEEP_PURPLE, paddingBottom: 28 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: 10, marginBottom: 18 },
  greeting: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 3 },
  titleLine: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap' },
  appTitleSi: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.3 },
  appTitleEn: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.3 },
  titleSep: { fontSize: 26, fontWeight: '700', color: 'rgba(255,255,255,0.65)' },
  appSubtitle: { fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 3 },
  iconRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },

  // Balance
  balZone: { paddingHorizontal: 20 },
  balLabelSi: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 2 },
  balLabelEn: { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6 },
  balAmount: { fontSize: 42, fontWeight: '800', color: '#FFFFFF', marginBottom: 16 },
  incExpRow: { flexDirection: 'row', gap: 12 },
  incBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  expBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  boxTopLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 5 },
  incAmt: { fontSize: 18, fontWeight: '800', color: '#4ADE80' },
  expAmt: { fontSize: 18, fontWeight: '800', color: '#F87171' },

  // ── Content Zone (light) ──
  contentZone: { backgroundColor: '#F5F3FF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, minHeight: 600 },

  // SMS Banner
  smsBanner: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFFBEB', borderWidth: 1.5, borderColor: '#FCD34D', borderRadius: 16, padding: 14, marginHorizontal: 16, marginBottom: 16 },
  smsIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center' },
  smsTitleSi: { fontSize: 13, fontWeight: '800', color: '#92400E', marginBottom: 1 },
  smsTitleEn: { fontSize: 11, color: '#B45309', marginBottom: 5 },
  smsBodyTxt: { fontSize: 11, color: '#78350F', lineHeight: 16, marginBottom: 10, fontFamily: 'monospace' },
  smsBtnRow: { flexDirection: 'row', gap: 8 },
  smsAddBtn: { flex: 1, backgroundColor: '#F59E0B', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, alignItems: 'center' },
  smsAddTxt: { color: '#FFFFFF', fontWeight: '800', fontSize: 11 },
  smsDismissBtn: { backgroundColor: '#FEF3C7', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#FCD34D' },
  smsDismissTxt: { color: '#92400E', fontWeight: '600', fontSize: 11 },

  // Stats
  statsRow: { flexDirection: 'row', marginHorizontal: 16, gap: 10, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, alignItems: 'center', shadowColor: MID_PURPLE, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  statNum: { fontSize: 26, fontWeight: '800', color: '#1F2937' },
  statSi: { fontSize: 12, fontWeight: '700', color: '#1F2937', marginTop: 2 },
  statEn: { fontSize: 9, color: '#9CA3AF', marginTop: 1 },

  // Section Headers
  secHdr: { paddingHorizontal: 20, marginBottom: 12 },
  secSi: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  secEn: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },

  // Category Chips (LARGE squares like reference)
  catChip: { width: 78, minHeight: 86, backgroundColor: '#FFFFFF', borderRadius: 16, alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 4, borderWidth: 1.5, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  catChipSel: { backgroundColor: MID_PURPLE, borderColor: MID_PURPLE },
  catEmoji: { fontSize: 26, marginBottom: 6 },
  catSi: { fontSize: 13, fontWeight: '900', color: '#1F2937', textAlign: 'center', letterSpacing: -0.2 },
  catEn: { fontSize: 8, fontWeight: '500', color: '#9CA3AF', textAlign: 'center', marginTop: 2 },

  // Empty state
  emptyBox: { alignItems: 'center', paddingVertical: 48 },
  emptyEmoji: { fontSize: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginTop: 12 },
  emptySubtitle: { fontSize: 13, color: '#9CA3AF', marginTop: 4 },
  addFirstBtn: { marginTop: 20, backgroundColor: MID_PURPLE, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 14 },
  addFirstTxt: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});
