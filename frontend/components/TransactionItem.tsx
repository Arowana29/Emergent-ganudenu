import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, formatLKR, RADIUS } from '../constants/theme';
import { getCategoryById } from '../constants/categories';
import { Transaction } from '../services/api';

interface Props {
  transaction: Transaction;
  onDelete?: (id: string) => void;
}

const TransactionItem: React.FC<Props> = ({ transaction, onDelete }) => {
  const cat = getCategoryById(transaction.category);
  const dateObj = new Date(transaction.date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('en-US', { month: 'short' });

  return (
    <TouchableOpacity
      testID={`transaction-item-${transaction.id}`}
      onLongPress={() => onDelete && onDelete(transaction.id)}
      style={styles.row}
      activeOpacity={0.7}
    >
      <View style={[styles.iconWrap, { backgroundColor: cat.bgColor }]}>
        <Text style={styles.emoji}>{cat.emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.desc} numberOfLines={1}>{transaction.description}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.catLabel}>
            <Text style={styles.catLabelSi}>{cat.sinhala}</Text>
            <Text style={styles.catLabelEn}> · {cat.english}</Text>
          </Text>
          {transaction.from_sms && (
            <View style={styles.smsBadge}>
              <Text style={styles.smsBadgeText}>SMS</Text>
            </View>
          )}
          <Text style={styles.dateText}>{day} {month}</Text>
        </View>
      </View>
      <Text style={[styles.amount, { color: transaction.is_income ? COLORS.success : COLORS.danger }]}>
        {transaction.is_income ? '+' : '−'} {formatLKR(transaction.amount)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emoji: { fontSize: 22 },
  info: { flex: 1, marginRight: 8 },
  desc: { fontSize: 14, fontWeight: '600', color: COLORS.textMain, marginBottom: 3 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  catLabel: { fontSize: 11, color: COLORS.textMuted },
  catLabelSi: { fontSize: 11, fontWeight: '700', color: COLORS.textMain },
  catLabelEn: { fontSize: 10, color: COLORS.textMuted, fontWeight: '500' },
  smsBadge: {
    backgroundColor: '#EDE9FE',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  smsBadgeText: { fontSize: 9, color: COLORS.primary, fontWeight: '700' },
  dateText: { fontSize: 11, color: COLORS.textMuted },
  amount: { fontSize: 15, fontWeight: '700' },
});

export default TransactionItem;
