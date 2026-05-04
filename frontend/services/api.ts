const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL ?? '';

// Debug log on import — will appear in Expo Go console
if (typeof console !== 'undefined') {
  console.log('[API] EXPO_PUBLIC_BACKEND_URL =', BASE_URL || '(empty!)');
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  note?: string;
  date: string;
  is_income: boolean;
  from_sms: boolean;
  raw_sms?: string;
  merchant?: string;
  created_at: string;
}

export interface MonthStats {
  income: number;
  expenses: number;
  balance: number;
  total_count: number;
  sms_count: number;
  categories: { category: string; amount: number; pct: number }[];
}

export interface TrendItem {
  month: number;
  year: number;
  label: string;
  income: number;
  expenses: number;
}

export interface TransactionCreate {
  amount: number;
  category: string;
  description: string;
  note?: string;
  date?: string;
  is_income?: boolean;
  from_sms?: boolean;
  raw_sms?: string;
  merchant?: string;
}

export const api = {
  async getTransactions(month?: number, year?: number): Promise<Transaction[]> {
    const params = month && year ? `?month=${month}&year=${year}` : '';
    const res = await fetch(`${BASE_URL}/api/transactions${params}`);
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
  },

  async createTransaction(data: TransactionCreate): Promise<Transaction> {
    const res = await fetch(`${BASE_URL}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create transaction');
    return res.json();
  },

  async deleteTransaction(id: string): Promise<void> {
    await fetch(`${BASE_URL}/api/transactions/${id}`, { method: 'DELETE' });
  },

  async getStats(month: number, year: number): Promise<MonthStats> {
    const res = await fetch(`${BASE_URL}/api/stats?month=${month}&year=${year}`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  async getTrends(): Promise<TrendItem[]> {
    const res = await fetch(`${BASE_URL}/api/stats/trends`);
    if (!res.ok) throw new Error('Failed to fetch trends');
    return res.json();
  },

  async seedData(): Promise<{ seeded: number; message: string }> {
    const res = await fetch(`${BASE_URL}/api/seed`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to seed data');
    return res.json();
  },
};
