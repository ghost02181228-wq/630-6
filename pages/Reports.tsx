import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Reports: React.FC = () => {
  const { transactions } = useFinance();

  // Aggregate data by month
  const dataByMonth = transactions.reduce((acc, curr) => {
    const month = curr.date.substring(0, 7); // YYYY-MM
    if (!acc[month]) {
      acc[month] = { name: month, income: 0, expense: 0 };
    }
    if (curr.type === 'income') {
      acc[month].income += curr.amount;
    } else {
      acc[month].expense += curr.amount;
    }
    return acc;
  }, {} as Record<string, { name: string; income: number; expense: number }>);

  const chartData = Object.values(dataByMonth).sort((a, b) => a.name.localeCompare(b.name));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-200 shadow-lg rounded-lg">
          <p className="font-bold text-slate-700 mb-2">{label}</p>
          <p className="text-emerald-600">收入: ${payload[0].value?.toLocaleString()}</p>
          <p className="text-red-500">支出: ${payload[1].value?.toLocaleString()}</p>
          <p className="text-indigo-600 border-t border-slate-100 mt-1 pt-1">
            結餘: ${((payload[0].value as number) - (payload[1].value as number)).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">財務報表</h2>
        <p className="text-slate-500">視覺化分析您的收支趨勢。</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-lg mb-6 text-slate-800">月度收支趨勢</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: '#f1f5f9'}} />
              <Legend wrapperStyle={{paddingTop: '20px'}} />
              <Bar dataKey="income" name="收入" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="支出" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Placeholder for future charts */}
         <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-xl text-center text-indigo-400">
            <p>更多報表功能（如類別圓餅圖、年度比較）開發中...</p>
         </div>
      </div>
    </div>
  );
};

export default Reports;