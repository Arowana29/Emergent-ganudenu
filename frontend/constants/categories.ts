export interface Category {
  id: string;
  sinhala: string;
  english: string;
  emoji: string;
  color: string;
  bgColor: string;
  isIncome?: boolean;
}

export const CATEGORIES: Category[] = [
  // ── Daily essentials ──
  { id: 'food',          sinhala: 'ආහාර',           english: 'Food & Drink',  emoji: '🍚', color: '#F59E0B', bgColor: '#FEF3C7' },
  { id: 'housing',       sinhala: 'නිවාස',           english: 'Housing',       emoji: '🏠', color: '#7C3AED', bgColor: '#EDE9FE' },
  { id: 'transport',     sinhala: 'ගමන් වියදම්',     english: 'Transport',     emoji: '🚗', color: '#10B981', bgColor: '#D1FAE5' },
  { id: 'petrol',        sinhala: 'ඉන්ධන',          english: 'Petrol',        emoji: '⛽', color: '#DC2626', bgColor: '#FEE2E2' },

  // ── Utilities (separated CEB & Water) ──
  { id: 'electricity',   sinhala: 'විදුලිය',         english: 'Electricity (CEB)', emoji: '💡', color: '#F59E0B', bgColor: '#FEF3C7' },
  { id: 'water',         sinhala: 'ජලය',             english: 'Water Bill',    emoji: '💧', color: '#0EA5E9', bgColor: '#E0F2FE' },

  // ── Health & Education ──
  { id: 'health',        sinhala: 'සෞඛ්‍යය',         english: 'Health',        emoji: '🏥', color: '#EF4444', bgColor: '#FEE2E2' },
  { id: 'education',     sinhala: 'අධ්‍යාපනය',       english: 'Education',     emoji: '📚', color: '#3B82F6', bgColor: '#DBEAFE' },

  // ── Lifestyle ──
  { id: 'entertainment', sinhala: 'විනෝද',           english: 'Entertainment', emoji: '🎭', color: '#8B5CF6', bgColor: '#EDE9FE' },
  { id: 'clothing',      sinhala: 'ඇඳුම්',           english: 'Clothing',      emoji: '👗', color: '#EC4899', bgColor: '#FCE7F3' },
  { id: 'beauty',        sinhala: 'රූපලාවන්‍ය',      english: 'Beauty',        emoji: '💅', color: '#DB2777', bgColor: '#FCE7F3' },
  { id: 'social',        sinhala: 'ඇසුරු',           english: 'Social',        emoji: '🎀', color: '#A855F7', bgColor: '#F3E8FF' },

  // ── Family ──
  { id: 'children',      sinhala: 'ළමා වියදම්',      english: 'Children',      emoji: '👶', color: '#F472B6', bgColor: '#FCE7F3' },
  { id: 'religious',     sinhala: 'ආගමික',           english: 'Religious',     emoji: '🙏', color: '#D97706', bgColor: '#FEF3C7' },

  // ── Money ──
  { id: 'savings',       sinhala: 'ඉතිරිකිරීම්',     english: 'Savings',       emoji: '🏦', color: '#059669', bgColor: '#D1FAE5' },
  { id: 'insurance',     sinhala: 'රක්ෂණය',          english: 'Insurance',     emoji: '🛡️', color: '#6366F1', bgColor: '#E0E7FF' },
  { id: 'loan',          sinhala: 'ණය',              english: 'Loan',          emoji: '🏧', color: '#B91C1C', bgColor: '#FEE2E2' },

  // ── Other ──
  { id: 'business',      sinhala: 'ව්‍යාපාර',        english: 'Business',      emoji: '🏪', color: '#0284C7', bgColor: '#E0F2FE' },
  { id: 'digital',       sinhala: 'ඩිජිටල්',         english: 'Digital',       emoji: '📲', color: '#0EA5E9', bgColor: '#E0F2FE' },
  { id: 'travel',        sinhala: 'සංචාරය',          english: 'Travel',        emoji: '✈️', color: '#0891B2', bgColor: '#CFFAFE' },
  { id: 'garden',        sinhala: 'ගෙවත්ත',          english: 'Garden',        emoji: '🌿', color: '#16A34A', bgColor: '#DCFCE7' },
  { id: 'subscriptions', sinhala: 'දායකත්ව',         english: 'Subscriptions', emoji: '🔁', color: '#7C3AED', bgColor: '#EDE9FE' },
  { id: 'other',         sinhala: 'වෙනත්',           english: 'Other',         emoji: '📌', color: '#6B7280', bgColor: '#F3F4F6' },

  // ── Income ──
  { id: 'salary',        sinhala: 'වැටුප',           english: 'Salary',        emoji: '💼', color: '#10B981', bgColor: '#D1FAE5', isIncome: true },
  { id: 'income',        sinhala: 'ආදායම',           english: 'Income',        emoji: '💰', color: '#059669', bgColor: '#D1FAE5', isIncome: true },
  { id: 'freelance',     sinhala: 'ස්වාධීන',         english: 'Freelance',     emoji: '💻', color: '#0284C7', bgColor: '#E0F2FE', isIncome: true },
  { id: 'gift',          sinhala: 'තෑග්ග',           english: 'Gift',          emoji: '🎁', color: '#D97706', bgColor: '#FEF3C7', isIncome: true },
];

export const EXPENSE_CATEGORIES = CATEGORIES.filter(c => !c.isIncome);
export const INCOME_CATEGORIES = CATEGORIES.filter(c => c.isIncome);

export const getCategoryById = (id: string): Category =>
  CATEGORIES.find(c => c.id === id) || CATEGORIES.find(c => c.id === 'other')!;
