import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { CATEGORIES, TransactionType } from '../types';
import { Plus, Search, Filter, Trash2 } from 'lucide-react';

const Transactions: React.FC = () => {
  const { transactions, accounts, addTransaction, deleteTransaction } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  
  const [formData, setFormData] = useState({
    accountId: accounts[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    type: 'expense' as TransactionType,
    category: CATEGORIES.expense[0],
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaction(formData);
    setShowForm(false);
    setFormData({ ...formData, amount: 0, description: '' });
  };

  const filteredTransactions = transactions.filter(t => 
    filterType === 'all' ? true : t.type === filterType
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">收支紀錄</h2>
          <p className="text-slate-500">詳細記錄每一筆消費與收入。</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          disabled={accounts.length === 0}
          className="flex items-center gap-2 bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {showForm ? '取消' : <><Plus size={18} /> 記一筆</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">類型</label>
              <div className="flex rounded-lg border border-slate-300 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'expense', category: CATEGORIES.expense[0]})}
                  className={`flex-1 py-2 text-sm font-medium ${formData.type === 'expense' ? 'bg-red-500 text-white' : 'bg-white text-slate-600'}`}
                >
                  支出
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'income', category: CATEGORIES.income[0]})}
                  className={`flex-1 py-2 text-sm font-medium ${formData.type === 'income' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-600'}`}
                >
                  收入
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">帳戶</label>
              <select 
                required
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.accountId}
                onChange={e => setFormData({...formData, accountId: e.target.value})}
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name} ({acc.currency})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">日期</label>
              <input 
                required
                type="date"
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">分類</label>
              <select 
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {(formData.type === 'expense' ? CATEGORIES.expense : CATEGORIES.income).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">金額</label>
              <input 
                required
                type="number"
                min="0"
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">備註</label>
              <input 
                type="text"
                className="w-full p-2 border border-slate-300 rounded-lg"
                placeholder="例如：午餐"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="lg:col-span-3 flex justify-end">
              <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                儲存紀錄
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex gap-2">
            <button 
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-full text-sm ${filterType === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              全部
            </button>
            <button 
              onClick={() => setFilterType('income')}
              className={`px-3 py-1 rounded-full text-sm ${filterType === 'income' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              收入
            </button>
            <button 
              onClick={() => setFilterType('expense')}
              className={`px-3 py-1 rounded-full text-sm ${filterType === 'expense' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              支出
            </button>
          </div>
          <div className="text-sm text-slate-500 flex items-center gap-1">
             <Filter size={14} /> {filteredTransactions.length} 筆資料
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-medium">
              <tr>
                <th className="px-6 py-3">日期</th>
                <th className="px-6 py-3">類別</th>
                <th className="px-6 py-3">描述</th>
                <th className="px-6 py-3">帳戶</th>
                <th className="px-6 py-3 text-right">金額</th>
                <th className="px-6 py-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">{tx.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">{tx.description}</td>
                  <td className="px-6 py-4 text-slate-500">
                    {accounts.find(a => a.id === tx.accountId)?.name}
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => deleteTransaction(tx.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                    無符合條件的紀錄
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;