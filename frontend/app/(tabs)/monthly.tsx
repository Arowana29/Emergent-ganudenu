import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '../../components/Icon';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, formatLKR, MONTHS_SI, MONTHS_EN } from '../../constants/theme';
import { api, Transaction, MonthStats } from '../../services/api';
import TransactionItem from '../../components/TransactionItem';

export default function MonthlyScreen() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [stats, setStats] = useState<MonthStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [txns, s] = await Promise.all([
        api.getTransactions(month, year),
        api.getStats(month, year),
      ]);
      setTransactions(txns);
      setStats(s);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    const nm = month === 12 ? 1 : month + 1;
    const ny = month === 12 ? year + 1 : year;
    if (ny > now.getFullYear() || (ny === now.getFullYear() && nm > now.getMonth() + 1)) return;
    setMonth(nm);
    if (month === 12) setYear(y => y + 1);
  };

  const handleDelete = (id: string) => {
    Alert.alert('ගනුදෙනු මකන්නද?', 'Delete this transaction?', [
      { text: 'නැහැ', style: 'cancel' },
      { text: 'ඔව්', style: 'destructive', onPress: async () => { await api.deleteTransaction(id); load(); } },
    ]);
  };

  const balanceColor = (stats?.balance ?? 0) >= 0 ? COLORS.success : COLORS.danger;
  const balanceIcon = (stats?.balance ?? 0) >= 0 ? 'trending-up' : 'trending-down';
  const statusText = (stats?.balance ?? 0) >= 0 ? '✅ ඉතිරි කිරීම හොඳයි · Saving well' : '⚠️ ඉතිරුම් අඩුයි · Low savings';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>මාසිකව</Text>
        <Text style={styles.titleEn}>Monthly Summary · සාරාංශය</Text>
      </View>

      {/* Month Navigation */}
      <View style={styles.monthNav}>
        <TouchableOpacity testID="monthly-prev-btn" onPress={prevMonth} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.monthText}>{MONTHS_SI[month - 1]} {year}</Text>
          <Text style={styles.monthTextEn}>{MONTHS_EN[month - 1]} {year}</Text>
        </View>
        <TouchableOpacity testID="monthly-next-btn" onPress={nextMonth} style={styles.navBtn}>
          <Ionicons name="chevron-forward" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 60 }} />
        ) : (
          <>
            {/* Balance Summary Card */}
            <LinearGradient
              colors={['#7C3AED', '#5B21B6']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.balCard}
            >
              <Text style={styles.balTitle}>ශේෂය · Net Balance</Text>
              <Text testID="monthly-balance" style={[styles.balAmt, { color: '#FFFFFF' }]}>
                {formatLKR(stats?.balance ?? 0)}
              </Text>
              <Text style={styles.statusTxt}>{statusText}</Text>
              <View style={styles.balRow}>
                <View style={styles.balItem}>
                  <Ionicons name="arrow-down-circle" size={18} color="#6EE7B7" />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={styles.balItemLbl}>ලැබීම් · Income</Text>
                    <Text style={styles.balItemAmt}>{formatLKR(stats?.income ?? 0)}</Text>
                  </View>
                </View>
                <View style={styles.balItem}>
                  <Ionicons name="arrow-up-circle" size={18} color="#FCA5A5" />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={styles.balItemLbl}>වියදම් · Expenses</Text>
                    <Text style={styles.balItemAmt}>{formatLKR(stats?.expenses ?? 0)}</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>

            {/* Stats Strip */}
            <View style={styles.statsStrip}>
              <View style={styles.stripItem}>
                <Text style={styles.stripNum}>{stats?.total_count ?? 0}</Text>
                <Text style={styles.stripLbl}>ගනුදෙනු · Transactions</Text>
              </View>
              <View style={styles.stripDivider} />
              <View style={styles.stripItem}>
                <Text style={[styles.stripNum, { color: COLORS.primary }]}>{stats?.sms_count ?? 0}</Text>
                <Text style={styles.stripLbl}>SMS · Auto-detected</Text>
              </View>
              <View style={styles.stripDivider} />
              <View style={styles.stripItem}>
                <Text style={[styles.stripNum, { color: COLORS.accent }]}>{stats?.categories?.length ?? 0}</Text>
                <Text style={styles.stripLbl}>වර්ග · Categories</Text>
              </View>
            </View>

            {/* Transactions */}
            <View style={styles.txnHeader}>
              <Text style={styles.txnTitle}>ගනුදෙනු ලැයිස්තුව</Text>
              <Text style={styles.txnTitleEn}>All Transactions</Text>
            </View>

            <View style={{ paddingHorizontal: 16 }}>
              {transactions.length === 0 ? (
                <Text style={styles.empty}>ගනුදෙනු නැහැ · No transactions this month</Text>
              ) : (
                transactions.map(t => (
                  <TransactionItem key={t.id} transaction={t} onDelete={handleDelete} />
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.textMain },
  titleEn: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },

  monthNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: COLORS.surface, marginHorizontal: 16, borderRadius: RADIUS.xl,
    marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  navBtn: { padding: 8, borderRadius: 20, backgroundColor: COLORS.primaryLight },
  monthText: { fontSize: 18, fontWeight: '700', color: COLORS.textMain },
  monthTextEn: { fontSize: 11, color: COLORS.textMuted },

  balCard: { marginHorizontal: 16, borderRadius: RADIUS.xxl, padding: 22, marginBottom: 16 },
  balTitle: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 6 },
  balAmt: { fontSize: 34, fontWeight: '800', marginBottom: 6 },
  statusTxt: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 18 },
  balRow: { flexDirection: 'row', justifyContent: 'space-between' },
  balItem: { flexDirection: 'row', alignItems: 'center' },
  balItemLbl: { fontSize: 10, color: 'rgba(255,255,255,0.7)' },
  balItemAmt: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },

  statsStrip: {
    flexDirection: 'row', backgroundColor: COLORS.surface,
    marginHorizontal: 16, borderRadius: RADIUS.xl, padding: 16, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  stripItem: { flex: 1, alignItems: 'center' },
  stripNum: { fontSize: 22, fontWeight: '800', color: COLORS.textMain },
  stripLbl: { fontSize: 10, color: COLORS.textMuted, textAlign: 'center', marginTop: 2 },
  stripDivider: { width: 1, backgroundColor: COLORS.border, marginVertical: 4 },

  txnHeader: { paddingHorizontal: 20, marginBottom: 10 },
  txnTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textMain },
  txnTitleEn: { fontSize: 11, color: COLORS.textMuted },
  empty: { textAlign: 'center', color: COLORS.textMuted, marginTop: 40, fontSize: 14 },
});
