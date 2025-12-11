import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, Trash2, Landmark, CreditCard } from 'lucide-react';

const Accounts: React.FC = () => {
  const { accounts, addAccount, deleteAccount } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bankName: '',
    balance: 0,
    currency: 'TWD',
    accountNumber: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAccount(formData);
    setShowForm(false);
    setFormData({
      name: '',
      bankName: '',
      balance: 0,
      currency: 'TWD',
      accountNumber: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">銀行帳戶管理</h2>
          <p className="text-slate-500">管理您的銀行帳戶、現金與信用卡。</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? '取消' : <><Plus size={18} /> 新增帳戶</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 animate-fade-in-down">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">帳戶名稱</label>
              <input 
                required
                type="text" 
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="例如：薪轉戶"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">銀行名稱</label>
              <input 
                required
                type="text" 
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="例如：中國信託"
                value={formData.bankName}
                onChange={e => setFormData({...formData, bankName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">帳號末四碼</label>
              <input 
                type="text" 
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="****-1234"
                value={formData.accountNumber}
                onChange={e => setFormData({...formData, accountNumber: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">幣別</label>
              <select 
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.currency}
                onChange={e => setFormData({...formData, currency: e.target.value})}
              >
                <option value="TWD">TWD - 新台幣</option>
                <option value="USD">USD - 美金</option>
                <option value="JPY">JPY - 日幣</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">初始餘額</label>
              <input 
                required
                type="number" 
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.balance}
                onChange={e => setFormData({...formData, balance: parseFloat(e.target.value)})}
              />
            </div>
            <div className="md:col-span-2 flex justify-end mt-2">
              <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                儲存帳戶
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative group">
            <button 
              onClick={() => deleteAccount(acc.id)}
              className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={18} />
            </button>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <Landmark size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800">{acc.name}</h3>
                <p className="text-sm text-slate-500">{acc.bankName} • {acc.accountNumber}</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500 mb-1">當前餘額</p>
              <p className="text-2xl font-bold text-primary">
                {acc.currency} ${acc.balance.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
        
        {accounts.length === 0 && (
          <div className="col-span-full py-10 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
            <CreditCard className="mx-auto mb-2 opacity-50" size={48} />
            <p>尚未新增任何帳戶</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts;