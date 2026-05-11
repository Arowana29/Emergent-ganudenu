import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '../../components/Icon';
import { COLORS, RADIUS, formatLKR, MONTHS_SI, MONTHS_EN } from '../../constants/theme';
import { getCategoryById } from '../../constants/categories';
import { api, MonthStats, TrendItem } from '../../services/api';
import DonutChart from '../../components/DonutChart';
import BarChart from '../../components/BarChart';

const { width } = Dimensions.get('window');

export default function ReportsScreen() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [stats, setStats] = useState<MonthStats | null>(null);
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'expense' | 'income'>('expense');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, t] = await Promise.all([
        api.getStats(month, year),
        api.getTrends(),
      ]);
      setStats(s);
      setTrends(t);
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
    setMonth(nm); if (month === 12) setYear(y => y + 1);
  };

  const chartData = (stats?.categories ?? []).slice(0, 6).map(c => ({
    value: c.amount,
    color: getCategoryById(c.category).color,
  }));

  const savingsRate = stats && stats.income > 0
    ? Math.round((stats.balance / stats.income) * 100)
    : 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>වාර්තා</Text>
          <Text style={styles.titleEn}>Reports · Spending Analysis</Text>
        </View>

        {/* Month Nav */}
        <View style={styles.monthNav}>
          <TouchableOpacity testID="prev-month-btn" onPress={prevMonth} style={styles.navBtn}>
            <Ionicons name="chevron-back" size={22} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.monthLabel}>{MONTHS_SI[month - 1]} {year}</Text>
            <Text style={styles.monthLabelEn}>{MONTHS_EN[month - 1]} {year}</Text>
          </View>
          <TouchableOpacity testID="next-month-btn" onPress={nextMonth} style={styles.navBtn}>
            <Ionicons name="chevron-forward" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 60 }} />
        ) : (
          <>
            {/* Summary Cards */}
            <View style={styles.summaryRow}>
              <View style={[styles.sumCard, { borderLeftColor: COLORS.success }]}>
                <Text style={styles.sumAmt}>{formatLKR(stats?.income ?? 0)}</Text>
                <Text style={styles.sumLbl}>ලැබීම්</Text>
                <Text style={styles.sumEn}>Income</Text>
              </View>
              <View style={[styles.sumCard, { borderLeftColor: COLORS.danger }]}>
                <Text style={[styles.sumAmt, { color: COLORS.danger }]}>{formatLKR(stats?.expenses ?? 0)}</Text>
                <Text style={styles.sumLbl}>වියදම්</Text>
                <Text style={styles.sumEn}>Expenses</Text>
              </View>
              <View style={[styles.sumCard, { borderLeftColor: COLORS.primary }]}>
                <Text style={[styles.sumAmt, { color: COLORS.primary }]}>{savingsRate}%</Text>
                <Text style={styles.sumLbl}>ඉතිරි</Text>
                <Text style={styles.sumEn}>Saved</Text>
              </View>
            </View>

            {/* Donut Chart Section */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>ශ්‍රේණි බෙදීම</Text>
              <Text style={styles.cardTitleEn}>Spending by Category</Text>
              {chartData.length > 0 ? (
                <View style={styles.chartWrap}>
                  <DonutChart data={chartData} size={180} strokeWidth={36} />
                  <View style={styles.donutCenter}>
                    <Text style={styles.donutTotal}>{formatLKR(stats?.expenses ?? 0)}</Text>
                    <Text style={styles.donutLbl}>වියදම්</Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.noData}>දත්ත නැහැ · No data</Text>
              )}

              {/* Category Legend */}
              <View style={{ marginTop: 16 }}>
                {(stats?.categories ?? []).slice(0, 6).map((c, i) => {
                  const cat = getCategoryById(c.category);
                  return (
                    <View key={i} style={styles.legendRow}>
                      <View style={[styles.legendDot, { backgroundColor: cat.color }]} />
                      <Text style={styles.legendEmoji}>{cat.emoji}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.legendName}>{cat.sinhala}</Text>
                        <Text style={styles.legendEn}>{cat.english}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.legendAmt}>{formatLKR(c.amount)}</Text>
                        <Text style={styles.legendPct}>{c.pct}%</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Bar Chart - 6 month trend */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>මාසික ප්‍රවණතාව</Text>
              <Text style={styles.cardTitleEn}>6-Month Spending Trend</Text>
              <View style={{ marginTop: 12 }}>
                <BarChart data={trends} width={width - 48} />
              </View>
              <View style={styles.barLegend}>
                <View style={styles.barLegendItem}>
                  <View style={[styles.barLegendDot, { backgroundColor: '#10B981' }]} />
                  <Text style={styles.barLegendTxt}>ලැබීම් · Income</Text>
                </View>
                <View style={styles.barLegendItem}>
                  <View style={[styles.barLegendDot, { backgroundColor: COLORS.primary }]} />
                  <Text style={styles.barLegendTxt}>වියදම් · Expenses</Text>
                </View>
              </View>
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

  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: COLORS.surface, marginHorizontal: 16, borderRadius: RADIUS.xl, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  navBtn: { padding: 8, borderRadius: 20, backgroundColor: COLORS.primaryLight },
  monthLabel: { fontSize: 17, fontWeight: '700', color: COLORS.textMain },
  monthLabelEn: { fontSize: 11, color: COLORS.textMuted, textAlign: 'center' },

  summaryRow: { flexDirection: 'row', marginHorizontal: 16, gap: 10, marginBottom: 16 },
  sumCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: 14, borderLeftWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  sumAmt: { fontSize: 14, fontWeight: '800', color: COLORS.textMain, marginBottom: 4 },
  sumLbl: { fontSize: 11, fontWeight: '600', color: COLORS.textMain },
  sumEn: { fontSize: 9, color: COLORS.textMuted },

  card: { marginHorizontal: 16, backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textMain },
  cardTitleEn: { fontSize: 11, color: COLORS.textMuted, marginBottom: 4 },

  chartWrap: { alignItems: 'center', justifyContent: 'center', marginVertical: 12, position: 'relative' },
  donutCenter: { position: 'absolute', alignItems: 'center' },
  donutTotal: { fontSize: 16, fontWeight: '800', color: COLORS.textMain },
  donutLbl: { fontSize: 10, color: COLORS.textMuted },
  noData: { textAlign: 'center', color: COLORS.textMuted, marginVertical: 24 },

  legendRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendEmoji: { fontSize: 16, marginRight: 8 },
  legendName: { fontSize: 13, fontWeight: '600', color: COLORS.textMain },
  legendEn: { fontSize: 10, color: COLORS.textMuted },
  legendAmt: { fontSize: 13, fontWeight: '700', color: COLORS.textMain },
  legendPct: { fontSize: 11, color: COLORS.primary },

  barLegend: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 12 },
  barLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  barLegendDot: { width: 10, height: 10, borderRadius: 3 },
  barLegendTxt: { fontSize: 11, color: COLORS.textMuted },
});
