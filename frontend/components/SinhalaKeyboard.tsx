import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onInsert: (char: string) => void;
  onDelete: () => void;
  onSpace: () => void;
  onDone: () => void;
}

const PURPLE = '#5B21B6';
const PURPLE_DARK = '#4C1D95';
const PURPLE_LIGHT = '#EDE9FE';

// ═══════════════════════════════════════════════════════════════
// PHONETIC MODE: Singlish-style entry
// User taps a consonant → modifier bar shows vowel-combined options
// ═══════════════════════════════════════════════════════════════
type PhoneticBase = { si: string; en: string };

const PHONETIC_BASES: PhoneticBase[] = [
  { si: 'ක', en: 'ka' }, { si: 'ඛ', en: 'kha' }, { si: 'ග', en: 'ga' }, { si: 'ඝ', en: 'gha' },
  { si: 'ච', en: 'cha' }, { si: 'ජ', en: 'ja' }, { si: 'ට', en: 'ta' }, { si: 'ඨ', en: 'ttha' },
  { si: 'ඩ', en: 'da' }, { si: 'ණ', en: 'na' }, { si: 'ත', en: 'tha' }, { si: 'ද', en: 'dha' },
  { si: 'න', en: 'na' }, { si: 'ප', en: 'pa' }, { si: 'ඵ', en: 'pha' }, { si: 'බ', en: 'ba' },
  { si: 'භ', en: 'bha' }, { si: 'ම', en: 'ma' }, { si: 'ය', en: 'ya' }, { si: 'ර', en: 'ra' },
  { si: 'ල', en: 'la' }, { si: 'ව', en: 'va' }, { si: 'ශ', en: 'sha' }, { si: 'ෂ', en: 'sa' },
  { si: 'ස', en: 'sa' }, { si: 'හ', en: 'ha' }, { si: 'ළ', en: 'la' }, { si: 'ෆ', en: 'fa' },
  { si: 'ඟ', en: 'nga' }, { si: 'ඬ', en: 'nda' }, { si: 'ඳ', en: 'ndha' }, { si: 'ඹ', en: 'mba' },
];

// Vowel modifier signs for combining with consonants
const VOWEL_MODS = [
  { sign: '',  label: 'a',   show: '◌' },     // base
  { sign: 'ා', label: 'aa',  show: '◌ා' },
  { sign: 'ැ', label: 'ae',  show: '◌ැ' },
  { sign: 'ෑ', label: 'aae', show: '◌ෑ' },
  { sign: 'ි', label: 'i',   show: '◌ි' },
  { sign: 'ී', label: 'ii',  show: '◌ී' },
  { sign: 'ු', label: 'u',   show: '◌ු' },
  { sign: 'ූ', label: 'uu',  show: '◌ූ' },
  { sign: 'ෙ', label: 'e',   show: '◌ෙ' },
  { sign: 'ේ', label: 'ee',  show: '◌ේ' },
  { sign: 'ො', label: 'o',   show: '◌ො' },
  { sign: 'ෝ', label: 'oo',  show: '◌ෝ' },
  { sign: '්',  label: 'al', show: '◌්' },    // hal kirima
];

// Standalone vowels (when typing a vowel without consonant)
const STANDALONE_VOWELS = [
  { si: 'අ', en: 'a' }, { si: 'ආ', en: 'aa' }, { si: 'ඇ', en: 'ae' }, { si: 'ඈ', en: 'aae' },
  { si: 'ඉ', en: 'i' }, { si: 'ඊ', en: 'ii' }, { si: 'උ', en: 'u' }, { si: 'ඌ', en: 'uu' },
  { si: 'එ', en: 'e' }, { si: 'ඒ', en: 'ee' }, { si: 'ඔ', en: 'o' }, { si: 'ඕ', en: 'oo' },
  { si: 'ඓ', en: 'ai' }, { si: 'ඖ', en: 'au' }, { si: 'ං', en: 'ng' }, { si: 'ඃ', en: 'h' },
];

// ═══════════════════════════════════════════════════════════════
// WIJESEKARA MODE: Direct character grid (existing behavior)
// ═══════════════════════════════════════════════════════════════
const WIJ_VOWELS = ['අ','ආ','ඇ','ඈ','ඉ','ඊ','උ','ඌ','එ','ඒ','ඓ','ඔ','ඕ','ඖ','ං','ඃ'];
const WIJ_SIGNS  = ['ා','ැ','ෑ','ි','ී','ු','ූ','ෙ','ේ','ො','ෝ','ෞ','ෘ','ෲ','්','ෟ'];
const WIJ_CONS   = [
  'ක','ඛ','ග','ඝ','ඞ','ච','ඡ','ජ','ඣ','ඤ','ට','ඨ','ඩ','ඪ','ණ',
  'ත','ථ','ද','ධ','න','ප','ඵ','බ','භ','ම','ය','ර','ල','ව','ශ',
  'ෂ','ස','හ','ළ','ෆ','ඟ','ඬ','ඳ','ඹ',
];

// ═══════════════════════════════════════════════════════════════

const SinhalaKeyboard: React.FC<Props> = ({ onInsert, onDelete, onSpace, onDone }) => {
  const [mode, setMode] = useState<'phonetic' | 'wijesekara'>('phonetic');
  const [wijTab, setWijTab] = useState<'vowels' | 'signs' | 'consonants'>('consonants');
  const [activeBase, setActiveBase] = useState<PhoneticBase | null>(null);

  // ── Phonetic: tap consonant → show vowel mods, tap vowel → close picker
  const handlePhoneticPress = (base: PhoneticBase) => {
    setActiveBase(base);
  };
  const handleVowelMod = (modSign: string) => {
    if (!activeBase) return;
    onInsert(activeBase.si + modSign);
    setActiveBase(null);
  };
  const handleVowel = (v: string) => onInsert(v);

  // ── Wijesekara
  const wijChars = wijTab === 'vowels' ? WIJ_VOWELS : wijTab === 'signs' ? WIJ_SIGNS : WIJ_CONS;

  return (
    <View style={styles.keyboard}>
      {/* ══ Mode Toggle (Phonetic ↔ Wijesekara) ══ */}
      <View style={styles.modeToggle}>
        <TouchableOpacity
          testID="kb-mode-phonetic"
          style={[styles.modeBtn, mode === 'phonetic' && styles.modeBtnActive]}
          onPress={() => { setMode('phonetic'); setActiveBase(null); }}
          activeOpacity={0.7}
        >
          <Text style={[styles.modeSi, mode === 'phonetic' && styles.modeTxtActive]}>සිංගලිෂ්</Text>
          <Text style={[styles.modeEn, mode === 'phonetic' && styles.modeSubActive]}>Singlish (Phonetic)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="kb-mode-wijesekara"
          style={[styles.modeBtn, mode === 'wijesekara' && styles.modeBtnActive]}
          onPress={() => { setMode('wijesekara'); setActiveBase(null); }}
          activeOpacity={0.7}
        >
          <Text style={[styles.modeSi, mode === 'wijesekara' && styles.modeTxtActive]}>විජේසේකර</Text>
          <Text style={[styles.modeEn, mode === 'wijesekara' && styles.modeSubActive]}>Wijesekara</Text>
        </TouchableOpacity>
      </View>

      {/* ══ PHONETIC MODE ══ */}
      {mode === 'phonetic' && (
        <View>
          {/* Vowel modifier bar (appears when consonant is selected) */}
          {activeBase ? (
            <View style={styles.modBar}>
              <Text style={styles.modBarLabel}>
                <Text style={styles.modBarHi}>{activeBase.si}</Text> + ස්වර →
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 5, paddingRight: 8 }}>
                {VOWEL_MODS.map((m, i) => (
                  <TouchableOpacity
                    key={i}
                    testID={`kb-mod-${m.label}`}
                    style={styles.modKey}
                    onPress={() => handleVowelMod(m.sign)}
                    activeOpacity={0.6}
                  >
                    <Text style={styles.modChar}>{activeBase.si + m.sign}</Text>
                    <Text style={styles.modLabel}>{m.label}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  testID="kb-mod-cancel"
                  style={[styles.modKey, { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }]}
                  onPress={() => setActiveBase(null)}
                >
                  <Ionicons name="close" size={18} color="#DC2626" />
                </TouchableOpacity>
              </ScrollView>
            </View>
          ) : (
            <View style={styles.hintBar}>
              <Ionicons name="information-circle-outline" size={14} color={PURPLE} />
              <Text style={styles.hintTxt}>අකුරක් තෝරන්න → ස්වර එකතු කරන්න · Tap a letter, then add vowel</Text>
            </View>
          )}

          {/* Standalone vowels row */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.vowelRow}>
            {STANDALONE_VOWELS.map((v, i) => (
              <TouchableOpacity
                key={i}
                testID={`kb-vow-${i}`}
                style={styles.vowelKey}
                onPress={() => handleVowel(v.si)}
                activeOpacity={0.6}
              >
                <Text style={styles.vowelChar}>{v.si}</Text>
                <Text style={styles.vowelLabel}>{v.en}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Consonant grid (with Singlish hint) */}
          <View style={styles.phoneticGrid}>
            {PHONETIC_BASES.map((b, i) => (
              <TouchableOpacity
                key={i}
                testID={`kb-base-${i}`}
                style={[styles.phKey, activeBase?.si === b.si && styles.phKeyActive]}
                onPress={() => handlePhoneticPress(b)}
                activeOpacity={0.6}
              >
                <Text style={[styles.phChar, activeBase?.si === b.si && { color: '#fff' }]}>{b.si}</Text>
                <Text style={[styles.phHint, activeBase?.si === b.si && { color: 'rgba(255,255,255,0.85)' }]}>{b.en}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* ══ WIJESEKARA MODE ══ */}
      {mode === 'wijesekara' && (
        <View>
          <View style={styles.tabs}>
            <TouchableOpacity
              testID="kb-tab-consonants"
              style={[styles.tabBtn, wijTab === 'consonants' && styles.tabActive]}
              onPress={() => setWijTab('consonants')}
            >
              <Text style={[styles.tabSi, wijTab === 'consonants' && styles.tabTxtActive]}>ව්‍යාංජන</Text>
              <Text style={[styles.tabEn, wijTab === 'consonants' && styles.tabSubActive]}>Consonants</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="kb-tab-vowels"
              style={[styles.tabBtn, wijTab === 'vowels' && styles.tabActive]}
              onPress={() => setWijTab('vowels')}
            >
              <Text style={[styles.tabSi, wijTab === 'vowels' && styles.tabTxtActive]}>ස්වර</Text>
              <Text style={[styles.tabEn, wijTab === 'vowels' && styles.tabSubActive]}>Vowels</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="kb-tab-signs"
              style={[styles.tabBtn, wijTab === 'signs' && styles.tabActive]}
              onPress={() => setWijTab('signs')}
            >
              <Text style={[styles.tabSi, wijTab === 'signs' && styles.tabTxtActive]}>ලකුණු</Text>
              <Text style={[styles.tabEn, wijTab === 'signs' && styles.tabSubActive]}>Signs</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {wijChars.map((char, i) => (
              <TouchableOpacity
                key={i}
                testID={`kb-char-${i}`}
                style={[styles.key, wijTab === 'signs' && styles.signKey]}
                onPress={() => onInsert(char)}
                activeOpacity={0.55}
              >
                <Text style={[styles.keyChar, wijTab === 'signs' && styles.signChar]}>{char}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* ══ Control Row (Space / Delete / Done) ══ */}
      <View style={styles.controlRow}>
        <TouchableOpacity testID="kb-space" style={styles.spaceKey} onPress={onSpace} activeOpacity={0.7}>
          <Ionicons name="remove-outline" size={18} color="#6B7280" />
          <Text style={styles.spaceTxt}>හිදෙස · Space</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="kb-delete" style={styles.deleteKey} onPress={onDelete} activeOpacity={0.6}>
          <Ionicons name="backspace-outline" size={22} color="#DC2626" />
        </TouchableOpacity>
        <TouchableOpacity testID="kb-done" style={styles.doneKey} onPress={onDone} activeOpacity={0.7}>
          <Text style={styles.doneTxt}>✓ Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  keyboard: {
    backgroundColor: '#F1F0F8',
    borderTopWidth: 1.5,
    borderTopColor: '#DDD6FE',
    paddingTop: 8,
    paddingHorizontal: 8,
    paddingBottom: 14,
  },

  // ── Mode Toggle (top) ──
  modeToggle: {
    flexDirection: 'row', gap: 5, marginBottom: 8,
    backgroundColor: '#E5E7EB', borderRadius: 10, padding: 3,
  },
  modeBtn: { flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: 8 },
  modeBtnActive: { backgroundColor: PURPLE_DARK },
  modeSi: { fontSize: 12, fontWeight: '800', color: '#374151' },
  modeTxtActive: { color: '#fff' },
  modeEn: { fontSize: 8, color: '#9CA3AF', marginTop: 1 },
  modeSubActive: { color: 'rgba(255,255,255,0.85)' },

  // ── Phonetic Mode ──
  hintBar: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: PURPLE_LIGHT, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 5, marginBottom: 6,
  },
  hintTxt: { fontSize: 10, color: PURPLE, fontWeight: '600', flex: 1 },

  modBar: {
    backgroundColor: PURPLE_LIGHT, borderRadius: 8,
    paddingVertical: 6, paddingHorizontal: 6, marginBottom: 6,
  },
  modBarLabel: { fontSize: 10, color: PURPLE_DARK, fontWeight: '600', marginBottom: 4, paddingLeft: 2 },
  modBarHi: { fontSize: 14, fontWeight: '800' },
  modKey: {
    width: 48, height: 44, borderRadius: 8, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#C4B5FD',
    alignItems: 'center', justifyContent: 'center',
  },
  modChar: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  modLabel: { fontSize: 8, color: '#9CA3AF', marginTop: 1 },

  vowelRow: { gap: 4, paddingHorizontal: 2, paddingBottom: 6 },
  vowelKey: {
    width: 42, height: 42, borderRadius: 8, backgroundColor: '#FFF8E1',
    borderWidth: 1, borderColor: '#FCD34D',
    alignItems: 'center', justifyContent: 'center',
  },
  vowelChar: { fontSize: 16, fontWeight: '700', color: '#92400E' },
  vowelLabel: { fontSize: 7, color: '#B45309', marginTop: 0 },

  phoneticGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 8 },
  phKey: {
    width: '12.1%',
    aspectRatio: 0.92,
    backgroundColor: '#fff', borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  phKeyActive: { backgroundColor: PURPLE, borderColor: PURPLE },
  phChar: { fontSize: 17, fontWeight: '700', color: '#1F2937' },
  phHint: { fontSize: 8, color: '#9CA3AF', marginTop: 1 },

  // ── Wijesekara Mode ──
  tabs: { flexDirection: 'row', gap: 5, marginBottom: 6 },
  tabBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 7,
    borderRadius: 8, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  tabActive: { backgroundColor: PURPLE, borderColor: PURPLE },
  tabSi: { fontSize: 12, fontWeight: '700', color: '#374151' },
  tabTxtActive: { color: '#fff' },
  tabEn: { fontSize: 9, color: '#9CA3AF', marginTop: 1 },
  tabSubActive: { color: 'rgba(255,255,255,0.85)' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 8 },
  key: {
    width: '12.1%',
    aspectRatio: 0.95,
    backgroundColor: '#fff', borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 0.5, borderColor: '#E5E7EB',
  },
  signKey: { backgroundColor: '#EDE9FE', borderColor: '#C4B5FD' },
  keyChar: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
  signChar: { fontSize: 17, color: PURPLE },

  // ── Controls ──
  controlRow: { flexDirection: 'row', gap: 6, height: 42, marginTop: 4 },
  spaceKey: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', borderRadius: 8, gap: 5,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  spaceTxt: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  deleteKey: {
    width: 50, backgroundColor: '#FEE2E2', borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  doneKey: {
    width: 70, backgroundColor: PURPLE_DARK, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  doneTxt: { color: '#fff', fontWeight: '800', fontSize: 13 },
});

export default SinhalaKeyboard;
