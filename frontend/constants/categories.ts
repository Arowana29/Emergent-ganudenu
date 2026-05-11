export interface Category {
  id: string;
  sinhala: string;
  english: string;
  emoji: string;
  color: string;
  bgColor: string;
  isIncome?: boolean;
  // Quick-pick merchant suggestions shown when category is selected
  merchants?: { si: string; en: string }[];
}

export const CATEGORIES: Category[] = [
  // ── 1. Food & Drink ──
  {
    id: 'food',
    sinhala: 'ආහාර හා පාන',
    english: 'Food & Drink',
    emoji: '🍚',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    merchants: [
      { si: 'Keells Super', en: 'Keells Super' },
      { si: 'Cargills Food City', en: 'Cargills Food City' },
      { si: 'Arpico Super', en: 'Arpico Super' },
      { si: 'වෙනත්', en: 'Other' },
    ],
  },

  // ── 2. Sathi Pola (Saturday Market) — own category ──
  {
    id: 'sathipola',
    sinhala: 'සති පොළ',
    english: 'Sathi Pola',
    emoji: '🛒',
    color: '#16A34A',
    bgColor: '#DCFCE7',
  },

  // ── 3. Housing ──
  {
    id: 'housing',
    sinhala: 'නිවාස',
    english: 'Housing',
    emoji: '🏠',
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    merchants: [
      { si: 'නිවාස ණය', en: 'Home Loan EMI' },
      { si: 'කුලී', en: 'Rent' },
      { si: 'අලුත්වැඩියා', en: 'Repairs' },
    ],
  },

  // ── 4. Transport ──
  {
    id: 'transport',
    sinhala: 'ප්‍රවාහන',
    english: 'Transport',
    emoji: '🚗',
    color: '#10B981',
    bgColor: '#D1FAE5',
    merchants: [
      { si: 'PickMe', en: 'PickMe' },
      { si: 'Train', en: 'Train' },
      { si: 'Bus', en: 'Bus' },
    ],
  },

  // ── 5. Petrol ──
  {
    id: 'petrol',
    sinhala: 'ඉන්ධන',
    english: 'Petrol',
    emoji: '⛽',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    merchants: [
      { si: 'Lanka IOC', en: 'Lanka IOC' },
    ],
  },

  // ── 6. Electricity (CEB) ──
  {
    id: 'electricity',
    sinhala: 'විදුලිය',
    english: 'Electricity (CEB)',
    emoji: '💡',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    merchants: [
      { si: 'CEB', en: 'CEB' },
      { si: 'LECO', en: 'LECO' },
    ],
  },

  // ── 7. Water Bill ──
  {
    id: 'water',
    sinhala: 'ජලය',
    english: 'Water Bill',
    emoji: '💧',
    color: '#0EA5E9',
    bgColor: '#E0F2FE',
    merchants: [
      { si: 'NWSDB', en: 'NWSDB' },
    ],
  },

  // ── 8. Telecom (was "Telephone") ──
  {
    id: 'telephone',
    sinhala: 'දුරකථන',
    english: 'Telecom',
    emoji: '📞',
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
    merchants: [
      { si: 'Dialog', en: 'Dialog' },
      { si: 'Mobitel', en: 'Mobitel' },
      { si: 'Hutch', en: 'Hutch' },
      { si: 'SLT', en: 'SLT' },
      { si: 'Airtel', en: 'Airtel' },
    ],
  },

  // ── 9. Health / Medical ──
  {
    id: 'health',
    sinhala: 'සෞඛ්‍ය',
    english: 'Health / Medical',
    emoji: '🏥',
    color: '#EF4444',
    bgColor: '#FEE2E2',
    merchants: [
      { si: 'Asiri Hospital', en: 'Asiri Hospital' },
      { si: 'Nawaloka', en: 'Nawaloka' },
      { si: 'Durdens', en: 'Durdens' },
    ],
  },

  // ── 10. Education ──
  {
    id: 'education',
    sinhala: 'අධ්‍යාපන',
    english: 'Education',
    emoji: '📚',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    merchants: [
      { si: 'School', en: 'School' },
      { si: 'Tuition', en: 'Tuition' },
    ],
  },

  // ── Lifestyle ──
  {
    id: 'entertainment',
    sinhala: 'විනෝද',
    english: 'Entertainment',
    emoji: '🎭',
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
  },
  {
    id: 'clothing',
    sinhala: 'ඇඳුම්',
    english: 'Clothing',
    emoji: '👗',
    color: '#EC4899',
    bgColor: '#FCE7F3',
  },
  {
    id: 'beauty',
    sinhala: 'රූපලාවන්‍ය',
    english: 'Beauty',
    emoji: '💅',
    color: '#DB2777',
    bgColor: '#FCE7F3',
  },

  // ── Family ──
  {
    id: 'children',
    sinhala: 'ළමා වියදම්',
    english: 'Children',
    emoji: '👶',
    color: '#F472B6',
    bgColor: '#FCE7F3',
  },
  {
    id: 'religious',
    sinhala: 'ආගමික',
    english: 'Religious',
    emoji: '🙏',
    color: '#D97706',
    bgColor: '#FEF3C7',
  },

  // ── Money ──
  {
    id: 'savings',
    sinhala: 'ඉතිරිකිරීම්',
    english: 'Savings',
    emoji: '🏦',
    color: '#059669',
    bgColor: '#D1FAE5',
  },
  {
    id: 'insurance',
    sinhala: 'රක්ෂණය',
    english: 'Insurance',
    emoji: '🛡️',
    color: '#6366F1',
    bgColor: '#E0E7FF',
  },
  {
    id: 'loan',
    sinhala: 'ණය',
    english: 'Loan',
    emoji: '🏧',
    color: '#B91C1C',
    bgColor: '#FEE2E2',
  },

  // ── Other ──
  {
    id: 'business',
    sinhala: 'ව්‍යාපාර',
    english: 'Business',
    emoji: '🏪',
    color: '#0284C7',
    bgColor: '#E0F2FE',
  },
  {
    id: 'travel',
    sinhala: 'සංචාරය',
    english: 'Travel',
    emoji: '✈️',
    color: '#0891B2',
    bgColor: '#CFFAFE',
  },
  {
    id: 'other',
    sinhala: 'වෙනත්',
    english: 'Other',
    emoji: '📌',
    color: '#6B7280',
    bgColor: '#F3F4F6',
  },

  // ── Income ──
  {
    id: 'salary',
    sinhala: 'වැටුප',
    english: 'Salary',
    emoji: '💼',
    color: '#10B981',
    bgColor: '#D1FAE5',
    isIncome: true,
  },
  {
    id: 'income',
    sinhala: 'ආදායම',
    english: 'Income',
    emoji: '💰',
    color: '#059669',
    bgColor: '#D1FAE5',
    isIncome: true,
  },
  {
    id: 'freelance',
    sinhala: 'ස්වාධීන',
    english: 'Freelance',
    emoji: '💻',
    color: '#0284C7',
    bgColor: '#E0F2FE',
    isIncome: true,
  },
  {
    id: 'gift',
    sinhala: 'තෑග්ග',
    english: 'Gift',
    emoji: '🎁',
    color: '#D97706',
    bgColor: '#FEF3C7',
    isIncome: true,
  },
];

export const EXPENSE_CATEGORIES = CATEGORIES.filter(c => !c.isIncome);
export const INCOME_CATEGORIES = CATEGORIES.filter(c => c.isIncome);

export const getCategoryById = (id: string): Category =>
  CATEGORIES.find(c => c.id === id) || CATEGORIES.find(c => c.id === 'other')!;
