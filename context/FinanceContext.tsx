import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  FinancialContextType, 
  User, 
  BankAccount, 
  Transaction, 
  StockPosition 
} from '../types';
import { MOCK_ACCOUNTS, MOCK_TRANSACTIONS, MOCK_STOCKS, generateId } from '../services/mockData';

const FinanceContext = createContext<FinancialContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

// Simulation of LocalStorage persistence to mimic DB behavior
const STORAGE_KEYS = {
  USER: 'wf_user',
  ACCOUNTS: 'wf_accounts',
  TRANSACTIONS: 'wf_transactions',
  STOCKS: 'wf_stocks'
};

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stocks, setStocks] = useState<StockPosition[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize Data
  useEffect(() => {
    const loadData = () => {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const storedAccounts = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      const storedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      const storedStocks = localStorage.getItem(STORAGE_KEYS.STOCKS);

      if (storedUser) setUser(JSON.parse(storedUser));
      
      // Load or Seed Data
      if (storedAccounts) {
        setAccounts(JSON.parse(storedAccounts));
      } else {
        setAccounts(MOCK_ACCOUNTS);
      }

      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      } else {
        setTransactions(MOCK_TRANSACTIONS);
      }

      if (storedStocks) {
        setStocks(JSON.parse(storedStocks));
      } else {
        setStocks(MOCK_STOCKS);
      }
      
      setLoading(false);
    };

    // Simulate network delay
    setTimeout(loadData, 500);
  }, []);

  // Sync to LocalStorage (Simulating DB writes)
  useEffect(() => { if (!loading) localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts)); }, [accounts, loading]);
  useEffect(() => { if (!loading) localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions)); }, [transactions, loading]);
  useEffect(() => { if (!loading) localStorage.setItem(STORAGE_KEYS.STOCKS, JSON.stringify(stocks)); }, [stocks, loading]);
  useEffect(() => { if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)); }, [user]);

  const login = (name: string, email: string) => {
    const newUser = { id: generateId(), name, email };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const addAccount = (account: Omit<BankAccount, 'id'>) => {
    const newAccount = { ...account, id: generateId() };
    setAccounts([...accounts, newAccount]);
  };

  const deleteAccount = (id: string) => {
    setAccounts(accounts.filter(a => a.id !== id));
    // Also cleanup related transactions in a real app
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTx = { ...transaction, id: generateId() };
    setTransactions([newTx, ...transactions]);
    
    // Update account balance
    const amount = transaction.type === 'income' ? transaction.amount : -transaction.amount;
    setAccounts(prev => prev.map(acc => 
      acc.id === transaction.accountId 
        ? { ...acc, balance: acc.balance + amount }
        : acc
    ));
  };

  const deleteTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (tx) {
      // Revert balance
      const amount = tx.type === 'income' ? -tx.amount : tx.amount;
      setAccounts(prev => prev.map(acc => 
        acc.id === tx.accountId 
          ? { ...acc, balance: acc.balance + amount }
          : acc
      ));
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const addStock = (stock: Omit<StockPosition, 'id'>) => {
    setStocks([...stocks, { ...stock, id: generateId() }]);
  };

  const updateStockPrice = (id: string, newPrice: number) => {
    setStocks(stocks.map(s => s.id === id ? { ...s, currentPrice: newPrice } : s));
  };

  const removeStock = (id: string) => {
    setStocks(stocks.filter(s => s.id !== id));
  };

  return (
    <FinanceContext.Provider value={{
      user, login, logout,
      accounts, transactions, stocks,
      addAccount, deleteAccount,
      addTransaction, deleteTransaction,
      addStock, updateStockPrice, removeStock,
      loading
    }}>
      {children}
    </FinanceContext.Provider>
  );
};