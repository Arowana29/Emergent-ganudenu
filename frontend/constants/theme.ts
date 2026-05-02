export const COLORS = {
  bg: '#FAFAFA',
  surface: '#FFFFFF',
  primary: '#7C3AED',
  primaryDark: '#5B21B6',
  primaryLight: '#EDE9FE',
  accent: '#F59E0B',
  accentDark: '#D97706',
  textMain: '#0A0A0A',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981',
  danger: '#EF4444',
  inputBg: '#F3F4F6',
  cardShadowColor: 'rgba(124, 58, 237, 0.25)',
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const FONT = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  h: 34,
};

export const formatLKR = (amount: number): string =>
  `රු. ${Math.round(amount).toLocaleString('en-US')}`;

export const MONTHS_SI = [
  'ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්',
  'මැයි', 'ජූනි', 'ජූලි', 'අගෝස්තු',
  'සැප්තැම්බර්', 'ඔක්තෝම්බර්', 'නොවැම්බර්', 'දෙසැම්බර්',
];

export const MONTHS_EN = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
];
