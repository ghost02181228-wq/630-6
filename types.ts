export type TransactionType = 'income' | 'expense';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  balance: number;
  currency: string;
  accountNumber: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
}

export interface StockPosition {
  id: string;
  symbol: string; // e.g., 2330.TW or AAPL
  name: string;
  shares: number;
  averageCost: number;
  currentPrice: number; // Simulated real-time price
  currency: string;
}

export interface FinancialContextType {
  user: User | null;
  login: (name: string, email: string) => void;
  logout: () => void;
  accounts: BankAccount[];
  transactions: Transaction[];
  stocks: StockPosition[];
  addAccount: (account: Omit<BankAccount, 'id'>) => void;
  deleteAccount: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addStock: (stock: Omit<StockPosition, 'id'>) => void;
  updateStockPrice: (id: string, newPrice: number) => void;
  removeStock: (id: string) => void;
  loading: boolean;
}

export const CATEGORIES = {
  expense: ['飲食', '交通', '居住', '娛樂', '醫療', '教育', '其他支出'],
  income: ['薪資', '獎金', '投資收益', '兼職', '其他收入']
};