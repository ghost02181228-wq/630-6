import { BankAccount, StockPosition, Transaction } from '../types';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const MOCK_ACCOUNTS: BankAccount[] = [
  {
    id: 'acc_1',
    name: '主要薪轉戶',
    bankName: '中國信託',
    balance: 150000,
    currency: 'TWD',
    accountNumber: '****-1234'
  },
  {
    id: 'acc_2',
    name: '日常消費戶',
    bankName: '國泰世華',
    balance: 24500,
    currency: 'TWD',
    accountNumber: '****-5678'
  },
  {
    id: 'acc_3',
    name: '美股投資戶',
    bankName: 'Firstrade',
    balance: 5000,
    currency: 'USD',
    accountNumber: '****-9999'
  }
];

export const MOCK_STOCKS: StockPosition[] = [
  {
    id: 'stk_1',
    symbol: '2330.TW',
    name: '台積電',
    shares: 1000,
    averageCost: 550,
    currentPrice: 780,
    currency: 'TWD'
  },
  {
    id: 'stk_2',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 50,
    averageCost: 150,
    currentPrice: 175,
    currency: 'USD'
  },
  {
    id: 'stk_3',
    symbol: '0050.TW',
    name: '元大台灣50',
    shares: 2000,
    averageCost: 120,
    currentPrice: 155,
    currency: 'TWD'
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_1',
    accountId: 'acc_1',
    date: '2023-10-01',
    amount: 50000,
    type: 'income',
    category: '薪資',
    description: '十月份薪資'
  },
  {
    id: 'tx_2',
    accountId: 'acc_2',
    date: '2023-10-02',
    amount: 250,
    type: 'expense',
    category: '飲食',
    description: '午餐'
  },
  {
    id: 'tx_3',
    accountId: 'acc_2',
    date: '2023-10-05',
    amount: 1200,
    type: 'expense',
    category: '交通',
    description: '高鐵票'
  }
];