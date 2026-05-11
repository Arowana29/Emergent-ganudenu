import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Modal, Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '../components/Icon';
import { COLORS, RADIUS, formatLKR } from '../constants/theme';
import { CATEGORIES, EXPENSE_CATEGORIES, INCOME_CATEGORIES, getCategoryById } from '../constants/categories';
import { api } from '../services/api';
import SinhalaKeyboard from '../components/SinhalaKeyboard';

export default function AddTransactionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    smsAmount?: string; smsCategory?: string; smsDesc?: string;
    smsRaw?: string; fromSms?: string;
  }>();

  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amountStr, setAmountStr] = useState('');
  const [selectedCat, setSelectedCat] = useState('food');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  // ── Custom Sinhala keyboard state ──
  const [siKbVisible, setSiKbVisible] = useState(false);
  const [siKbTarget, setSiKbTarget] = useState<'description' | 'note'>('description');

  const fromSms = params.fromSms === '1';

  useEffect(() => {
    if (fromSms && params.smsAmount) {
      setAmountStr(params.smsAmount);
      setSelectedCat(params.smsCategory ?? 'food');
      setDescription(params.smsDesc ?? '');
    }
  }, []);

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const amount = parseFloat(amountStr) || 0;

  const handleSave = async () => {
    if (amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount\nමුදල ඇතුළත් කරන්න');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description\nවිස්තරයක් ඇතුළත් කරන්න');
      return;
    }
    setSaving(true);
    try {
      await api.createTransaction({
        amount,
        category: selectedCat,
        description: description.trim(),
        note: note.trim() || undefined,
        is_income: type === 'income',
        from_sms: fromSms,
        raw_sms: params.smsRaw || undefined,
      });
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const numPad = () => {
    const append = (v: string) => {
      if (v === 'DEL') {
        setAmountStr(s => s.slice(0, -1));
      } else if (v === '.' && amountStr.includes('.')) {
        return;
      } else if (amountStr.length < 10) {
        setAmountStr(s => s + v);
      }
    };
    const keys = ['1','2','3','4','5','6','7','8','9','.','0','DEL'];
    return (
      <View style={styles.numPad}>
        {keys.map(k => (
          <TouchableOpacity
            key={k}
            testID={`numpad-${k}`}
            style={[styles.numKey, k === 'DEL' && styles.numKeyDel]}
            onPress={() => append(k)}
            activeOpacity={0.6}
          >
            {k === 'DEL' ? (
              <Ionicons name="backspace-outline" size={22} color={COLORS.danger} />
            ) : (
              <Text style={styles.numKeyTxt}>{k}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // ── Custom Sinhala keyboard handlers ──
  const openSinhalaKb = (target: 'description' | 'note') => {
    Keyboard.dismiss(); // close native keyboard
    setSiKbTarget(target);
    setSiKbVisible(true);
  };
  const kbInsert = (ch: string) => {
    if (siKbTarget === 'description') {
      setDescription(s => (s + ch).slice(0, 80));
    } else {
      setNote(s => (s + ch).slice(0, 200));
    }
  };
  const kbDelete = () => {
    if (siKbTarget === 'description') setDescription(s => s.slice(0, -1));
    else setNote(s => s.slice(0, -1));
  };
  const kbSpace = () => kbInsert(' ');
  const kbDone = () => setSiKbVisible(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity testID="back-btn" onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="close" size={24} color={COLORS.textMain} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>ගනුදෙනු එකතු කරන්න</Text>
            <Text style={styles.headerTitleEn}>Add Transaction</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {fromSms && (
          <View style={styles.smsBanner}>
            <Ionicons name="mail" size={14} color={COLORS.primary} />
            <Text style={styles.smsBannerTxt}>📩 SMS හි සිට ස්වයංක්‍රීයව · Auto-filled from SMS</Text>
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Type Toggle */}
          <View style={styles.typeToggle}>
            <TouchableOpacity
              testID="type-expense"
              style={[styles.typePill, type === 'expense' && styles.typePillExpenseActive]}
              onPress={() => { setType('expense'); setSelectedCat('food'); }}
            >
              <Text style={[styles.typePillTxt, type === 'expense' && { color: '#FFFFFF' }]}>
                ↑ වියදම · Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="type-income"
              style={[styles.typePill, type === 'income' && styles.typePillIncomeActive]}
              onPress={() => { setType('income'); setSelectedCat('salary'); }}
            >
              <Text style={[styles.typePillTxt, type === 'income' && { color: '#FFFFFF' }]}>
                ↓ ලැබීම · Income
              </Text>
            </TouchableOpacity>
          </View>

          {/* Amount Display */}
          <View style={styles.amountWrap}>
            <Text style={styles.currencyLabel}>රු.</Text>
            <Text testID="amount-display" style={[styles.amountDisplay, { color: type === 'income' ? COLORS.success : COLORS.primary }]}>
              {amountStr || '0'}
            </Text>
          </View>
          <Text style={styles.amountFormatted}>
            {amount > 0 ? formatLKR(amount) : 'මුදල ඇතුළත් කරන්න · Enter amount'}
          </Text>

          {/* Numpad */}
          {numPad()}

          {/* Category Grid */}
          <View style={styles.section}>
            <Text style={styles.sectionTitleSi}>වර්ගය <Text style={styles.sectionTitleEn}>· Category</Text></Text>
            <View style={styles.catGrid}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  testID={`cat-${cat.id}`}
                  style={[
                    styles.catItem,
                    selectedCat === cat.id && { backgroundColor: cat.color, borderColor: cat.color },
                  ]}
                  onPress={() => setSelectedCat(cat.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.catEmoji}>{cat.emoji}</Text>
                  <Text style={[styles.catSi, selectedCat === cat.id && { color: '#FFFFFF' }]} numberOfLines={1}>
                    {cat.sinhala}
                  </Text>
                  <Text style={[styles.catEn, selectedCat === cat.id && { color: 'rgba(255,255,255,0.85)' }]} numberOfLines={1}>
                    {cat.english}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Merchant Quick-Pick Chips (auto-fills description) */}
          {(() => {
            const cat = getCategoryById(selectedCat);
            if (!cat.merchants || cat.merchants.length === 0) return null;
            return (
              <View style={styles.section}>
                <Text style={styles.sectionTitleSi}>
                  ඉක්මන් තේරීම් <Text style={styles.sectionTitleEn}>· Quick Picks</Text>
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8, paddingRight: 8 }}
                >
                  {cat.merchants.map((m, i) => (
                    <TouchableOpacity
                      key={i}
                      testID={`merchant-${cat.id}-${i}`}
                      style={[
                        styles.merchantChip,
                        description === m.si && { backgroundColor: cat.color, borderColor: cat.color },
                      ]}
                      onPress={() => setDescription(m.si)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.merchantChipSi,
                        description === m.si && { color: '#FFFFFF' },
                      ]}>{m.si}</Text>
                      {m.en !== m.si && (
                        <Text style={[
                          styles.merchantChipEn,
                          description === m.si && { color: 'rgba(255,255,255,0.85)' },
                        ]}>{m.en}</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            );
          })()}

          {/* Description */}
          <View style={styles.section}>
            <View style={styles.fieldHdr}>
              <Text style={styles.sectionTitleSi}>විස්තරය <Text style={styles.sectionTitleEn}>· Description</Text></Text>
              <TouchableOpacity
                testID="open-sinhala-kb-desc"
                style={styles.kbToggleBtn}
                onPress={() => openSinhalaKb('description')}
                activeOpacity={0.75}
              >
                <Text style={styles.kbToggleSi}>සිං</Text>
                <Text style={styles.kbToggleEn}>Sinhala Keyboard</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputWrap}>
              <TextInput
                testID="description-input"
                style={styles.input}
                placeholder="eg: Keells Super, ඉන්ධන..."
                placeholderTextColor={COLORS.textMuted}
                value={description}
                onChangeText={setDescription}
                maxLength={80}
                onFocus={() => setSiKbVisible(false)}
              />
            </View>
            <View style={styles.keyboardHint}>
              <Ionicons name="language-outline" size={13} color={COLORS.primary} />
              <Text style={styles.keyboardHintTxt}>
                "සිං" තට්ටු කර in-app සිංහල keyboard එක භාවිතා කරන්න · Tap "සිං" for built-in Sinhala
              </Text>
            </View>
          </View>

          {/* Note */}
          <View style={styles.section}>
            <View style={styles.fieldHdr}>
              <Text style={styles.sectionTitleSi}>සටහන <Text style={styles.sectionTitleEn}>· Note (optional)</Text></Text>
              <TouchableOpacity
                testID="open-sinhala-kb-note"
                style={styles.kbToggleBtn}
                onPress={() => openSinhalaKb('note')}
                activeOpacity={0.75}
              >
                <Text style={styles.kbToggleSi}>සිං</Text>
                <Text style={styles.kbToggleEn}>Sinhala Keyboard</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              testID="note-input"
              style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
              placeholder="Optional note..."
              placeholderTextColor={COLORS.textMuted}
              value={note}
              onChangeText={setNote}
              multiline
              maxLength={200}
              onFocus={() => setSiKbVisible(false)}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            testID="save-transaction-btn"
            style={[styles.saveBtn, type === 'income' && { backgroundColor: COLORS.success }]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveBtnTxt}>
                ✓ {type === 'income' ? 'ලැබීම' : 'වියදම'} සුරකින්න · Save {type === 'income' ? 'Income' : 'Expense'}
              </Text>
            )}
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>

        {/* ══ Custom Sinhala Keyboard Modal ══ */}
        <Modal
          visible={siKbVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setSiKbVisible(false)}
        >
          <View style={styles.kbBackdrop}>
            <TouchableOpacity
              testID="kb-backdrop"
              style={styles.kbBackdropTouch}
              activeOpacity={1}
              onPress={() => setSiKbVisible(false)}
            />
            <View style={styles.kbContainer}>
              {/* Field preview */}
              <View style={styles.kbPreview}>
                <View style={styles.kbPreviewLeft}>
                  <Text style={styles.kbPreviewLabel}>
                    {siKbTarget === 'description' ? 'විස්තරය · Description' : 'සටහන · Note'}
                  </Text>
                  <Text style={styles.kbPreviewText} numberOfLines={2}>
                    {(siKbTarget === 'description' ? description : note) || '...'}
                  </Text>
                </View>
                <TouchableOpacity testID="kb-close-x" onPress={() => setSiKbVisible(false)} style={styles.kbCloseBtn}>
                  <Ionicons name="chevron-down" size={22} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <SinhalaKeyboard
                onInsert={kbInsert}
                onDelete={kbDelete}
                onSpace={kbSpace}
                onDone={kbDone}
              />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.inputBg, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textMain, textAlign: 'center' },
  headerTitleEn: { fontSize: 11, color: COLORS.textMuted, textAlign: 'center' },

  smsBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.primaryLight, marginHorizontal: 16, borderRadius: RADIUS.md, padding: 10, marginBottom: 8 },
  smsBannerTxt: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },

  typeToggle: { flexDirection: 'row', marginHorizontal: 16, backgroundColor: COLORS.inputBg, borderRadius: RADIUS.xl, padding: 4, marginBottom: 16 },
  typePill: { flex: 1, paddingVertical: 10, borderRadius: RADIUS.lg, alignItems: 'center' },
  typePillExpenseActive: { backgroundColor: COLORS.primary },
  typePillIncomeActive: { backgroundColor: COLORS.success },
  typePillTxt: { fontSize: 14, fontWeight: '700', color: COLORS.textMuted },

  amountWrap: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', marginBottom: 4 },
  currencyLabel: { fontSize: 24, fontWeight: '700', color: COLORS.textMuted, marginRight: 6 },
  amountDisplay: { fontSize: 52, fontWeight: '800' },
  amountFormatted: { textAlign: 'center', fontSize: 13, color: COLORS.textMuted, marginBottom: 16 },

  numPad: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 24, gap: 10, marginBottom: 16 },
  numKey: { width: '29%', paddingVertical: 16, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  numKeyDel: { backgroundColor: '#FEE2E2' },
  numKeyTxt: { fontSize: 22, fontWeight: '600', color: COLORS.textMain },

  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textMuted, marginBottom: 10 },
  sectionTitleSi: { fontSize: 15, fontWeight: '800', color: COLORS.textMain, marginBottom: 10 },
  sectionTitleEn: { fontSize: 12, fontWeight: '500', color: COLORS.textMuted },

  fieldHdr: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kbToggleBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#5B21B6', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 5, marginBottom: 10,
  },
  kbToggleSi: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  kbToggleEn: { fontSize: 9, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },

  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catItem: { width: '22%', minHeight: 88, paddingVertical: 8, paddingHorizontal: 4, borderRadius: RADIUS.lg, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: COLORS.border },
  catEmoji: { fontSize: 24, marginBottom: 3 },
  catName: { fontSize: 9, fontWeight: '600', color: COLORS.textMain, textAlign: 'center', marginTop: 3 },
  catSi: { fontSize: 12, fontWeight: '900', color: COLORS.textMain, textAlign: 'center', marginTop: 3, letterSpacing: -0.2 },
  catEn: { fontSize: 8, fontWeight: '500', color: COLORS.textMuted, textAlign: 'center', marginTop: 1 },

  // Merchant Quick Picks
  merchantChip: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    minWidth: 80,
    alignItems: 'center',
  },
  merchantChipSi: { fontSize: 13, fontWeight: '700', color: COLORS.textMain },
  merchantChipEn: { fontSize: 9, color: COLORS.textMuted, marginTop: 1 },

  input: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: 14, fontSize: 15, color: COLORS.textMain, borderWidth: 1, borderColor: COLORS.border },
  inputWrap: { marginBottom: 6 },
  keyboardHint: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.primaryLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7 },
  keyboardHintTxt: { fontSize: 10, color: COLORS.primary, fontWeight: '500', flex: 1, lineHeight: 14 },

  saveBtn: { marginHorizontal: 16, backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, padding: 18, alignItems: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  saveBtnTxt: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },

  // ── Sinhala Keyboard Modal ──
  kbBackdrop: { flex: 1, backgroundColor: 'rgba(17,24,39,0.4)', justifyContent: 'flex-end' },
  kbBackdropTouch: { flex: 1 },
  kbContainer: { backgroundColor: '#F1F0F8', borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
  kbPreview: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
    paddingHorizontal: 14, paddingVertical: 10,
  },
  kbPreviewLeft: { flex: 1 },
  kbPreviewLabel: { fontSize: 11, color: '#6B7280', fontWeight: '600', marginBottom: 2 },
  kbPreviewText: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  kbCloseBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
});
