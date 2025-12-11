import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Wallet } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useFinance();
  const [email, setEmail] = useState('demo@example.com');
  const [name, setName] = useState('測試用戶');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      login(name, email);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
            <Wallet size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">歡迎使用 WealthFlow AI</h1>
          <p className="text-slate-500 mt-2">請登入以管理您的個人財務</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">顯示名稱</label>
            <input
              type="text"
              required
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="您的名字"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email (任意輸入)</label>
            <input
              type="email"
              required
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            進入系統
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-400">
          這是一個演示版本。數據將存儲在您的瀏覽器本地存儲中。
        </p>
      </div>
    </div>
  );
};

export default Login;