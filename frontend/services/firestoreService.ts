import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION = 'transactions';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  note?: string;
  date: string;
  is_income: boolean;
  from_sms: boolean;
  merchant?: string;
  created_at: string;
}

export interface TransactionCreate {
  amount: number;
  category: string;
  description: string;
  note?: string;
  date?: string;
  is_income: boolean;
  merchant?: string;
}

export interface MonthStats {
  income: number;
  expenses: number;
  balance: number;
  categories: { category: string; total: number; pct: number }[];
}

// Get all transactions, optionally filtered by month+year
export async function getTransactions(
  month?: number,
  year?: number
): Promise<Transaction[]> {
  const colRef = collection(db, COLLECTION);
  const snap = await getDocs(query(colRef, orderBy('date', 'desc')));
  let txs: Transaction[] = snap.docs.map(d => ({
    id: d.id,
    ...(d.data() as Omit<Transaction, 'id'>),
  }));
  if (month && year) {
    txs = txs.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() + 1 === month && d.getFullYear() === year;
    });
  }
  return txs;
}

// Add a new transaction
export async function createTransaction(
  data: TransactionCreate
): Promise<Transaction> {
  const now = new Date().toISOString();
  const payload = {
    amount: data.amount,
    category: data.category,
    description: data.description,
    note: data.note ?? '',
    date: data.date ?? now,
    is_income: data.is_income,
    from_sms: false,
    merchant: data.merchant ?? '',
    created_at: now,
  };
  const docRef = await addDoc(collection(db, COLLECTION), payload);
  return { id: docRef.id, ...payload };
}

// Delete a transaction
export async function deleteTransaction(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

// Compute monthly stats from Firestore data
export async function getStats(
  month: number,
  year: number
): Promise<MonthStats> {
  const txs = await getTransactions(month, year);
  let income = 0;
  let expenses = 0;
  const catMap: Record<string, number> = {};
  txs.forEach(t => {
    if (t.is_income) {
      income += t.amount;
    } else {
      expenses += t.amount;
      catMap[t.category] = (catMap[t.category] ?? 0) + t.amount;
    }
  });
  const categories = Object.entries(catMap).map(([category, total]) => ({
    category,
    total,
    pct: expenses > 0 ? Math.round((total / expenses) * 100) : 0,
  }));
  return { income, expenses, balance: income - expenses, categories };
}

// Seed demo data into Firestore
export async function seedDemoData(): Promise<{ seeded: number }> {
  // Clear existing
  const snap = await getDocs(collection(db, COLLECTION));
  const batch = writeBatch(db);
  snap.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();

  const now = new Date();
  const m = now.getMonth() + 1;
  const y = now.getFullYear();
  const d = (day: number) => `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}T10:00:00.000Z`;

  const seeds: TransactionCreate[] = [
    { amount: 120000, category: 'salary', description: 'වැතුනම්', is_income: true, date: d(1) },
    { amount: 35000, category: 'businessincome', description: 'ව්‍යාපාර ඇතුම්', is_income: true, date: d(5) },
    { amount: 15000, category: 'loanreceived', description: 'උැයක් ලලා', is_income: true, date: d(8) },
    { amount: 8500, category: 'food', description: 'Keells Super', merchant: 'Keells', is_income: false, date: d(2) },
    { amount: 4200, category: 'transport', description: 'ගමනාගමන', is_income: false, date: d(3) },
    { amount: 3800, category: 'electricity', description: 'CEB බිල්පත', merchant: 'CEB', is_income: false, date: d(7) },
    { amount: 1200, category: 'water', description: 'ය්', merchant: 'NWS&DB', is_income: false, date: d(7) },
    { amount: 5500, category: 'petrol', description: 'පෙට්රෝල්', is_income: false, date: d(9) },
    { amount: 6000, category: 'health', description: 'Asiri Hospital', merchant: 'Asiri', is_income: false, date: d(10) },
    { amount: 4500, category: 'education', description: 'පාසල්', is_income: false, date: d(12) },
    { amount: 2800, category: 'telephone', description: 'Dialog', merchant: 'Dialog', is_income: false, date: d(4) },
    { amount: 15000, category: 'housing', description: 'ගෙවල්', is_income: false, date: d(1) },
    { amount: 8000, category: 'loangiven', description: 'උැයක් දුන්නා', is_income: false, date: d(15) },
    { amount: 3000, category: 'charity', description: 'දාන්', is_income: false, date: d(18) },
    { amount: 4800, category: 'sathipola', description: 'Pettah සතිපල', is_income: false, date: d(20) },
  ];

  const batch2 = writeBatch(db);
  seeds.forEach(s => {
    const ref = doc(collection(db, COLLECTION));
    const now2 = new Date().toISOString();
    batch2.set(ref, {
      amount: s.amount,
      category: s.category,
      description: s.description,
      note: '',
      date: s.date ?? now2,
      is_income: s.is_income,
      from_sms: false,
      merchant: s.merchant ?? '',
      created_at: now2,
    });
  });
  await batch2.commit();
  return { seeded: seeds.length };
}

// Clear ALL transactions from Firestore
export async function clearAllData(): Promise<void> {
  const snap = await getDocs(collection(db, COLLECTION));
  const batch = writeBatch(db);
  snap.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();
}
