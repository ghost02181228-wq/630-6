import React, { useMemo, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TrendingUp, TrendingDown, DollarSign, Activity, Bot } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getFinancialAdvice } from '../services/geminiService';

const Dashboard: React.FC = () => {
  const { accounts, transactions, stocks } = useFinance();
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const totalBalance = useMemo(() => 
    accounts.reduce((sum, acc) => 
      sum + (acc.currency === 'USD' ? acc.balance * 30 : acc.balance), 0
    ), 
  [accounts]);

  const stockValue = useMemo(() => 
    stocks.reduce((sum, stk) => 
      sum + (stk.currentPrice * stk.shares * (stk.currency === 'USD' ? 30 : 1)), 0
    ), 
  [stocks]);

  const totalAssets = totalBalance + stockValue;

  const monthlyIncome = useMemo(() => 
    transactions
      .filter(t => t.type === 'income' && new Date(t.date).getMonth() === new Date().getMonth())
      .reduce((sum, t) => sum + t.amount, 0),
  [transactions]);

  const monthlyExpense = useMemo(() => 
    transactions
      .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth())
      .reduce((sum, t) => sum + t.amount, 0),
  [transactions]);

  const chartData = [
    { name: '現金存款', value: totalBalance },
    { name: '股票投資', value: stockValue },
  ];
  const COLORS = ['#4f46e5', '#10b981'];

  const handleAskAI = async () => {
    setLoadingAdvice(true);
    const summary = `
      總資產: ${totalAssets} TWD
      現金: ${totalBalance} TWD
      股票市值: ${stockValue} TWD
      本月收入: ${monthlyIncome} TWD
      本月支出: ${monthlyExpense} TWD
      主要持股: ${stocks.map(s => s.name).join(', ')}
    `;
    const advice = await getFinancialAdvice(summary);
    setAiAdvice(advice);
    setLoadingAdvice(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">財務總覽</h2>
          <p className="text-slate-500">歡迎回來，這是您的即時財務狀況。</p>
        </div>
        <button 
          onClick={handleAskAI}
          disabled={loadingAdvice}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all disabled:opacity-50"
        >
          <Bot size={18} />
          {loadingAdvice ? 'AI 分析中...' : 'AI 財務健檢'}
        </button>
      </div>

      {aiAdvice && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 mb-3 text-indigo-800 font-semibold">
            <Bot size={20} />
            <h3>AI 顧問建議</h3>
          </div>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">{aiAdvice}</p>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">總資產 (估計)</p>
              <p className="text-2xl font-bold text-slate-800">${totalAssets.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">現金結餘</p>
              <p className="text-2xl font-bold text-slate-800">${totalBalance.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">本月收入</p>
              <p className="text-2xl font-bold text-emerald-600">+${monthlyIncome.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <TrendingDown size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">本月支出</p>
              <p className="text-2xl font-bold text-red-500">-${monthlyExpense.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-lg mb-4 text-slate-800">近期交易</h3>
          <div className="space-y-4">
            {transactions.slice(0, 5).map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {tx.type === 'income' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{tx.description || tx.category}</p>
                    <p className="text-xs text-slate-500">{tx.date} • {accounts.find(a => a.id === tx.accountId)?.name}</p>
                  </div>
                </div>
                <span className={`font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="font-bold text-lg mb-4 text-slate-800">資產配置</h3>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;