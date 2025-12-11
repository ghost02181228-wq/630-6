import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { RefreshCw, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

const Portfolio: React.FC = () => {
  const { stocks, addStock, removeStock, updateStockPrice } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    shares: 0,
    averageCost: 0,
    currency: 'TWD'
  });
  const [refreshing, setRefreshing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStock({ ...formData, currentPrice: formData.averageCost }); // Init current price as cost
    setShowForm(false);
    setFormData({ symbol: '', name: '', shares: 0, averageCost: 0, currency: 'TWD' });
  };

  // Simulate updating stock prices
  const handleRefreshPrices = () => {
    setRefreshing(true);
    setTimeout(() => {
      stocks.forEach(stock => {
        // Random fluctuation between -2% and +2%
        const change = 1 + (Math.random() * 0.04 - 0.02);
        updateStockPrice(stock.id, Math.round(stock.currentPrice * change * 100) / 100);
      });
      setRefreshing(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">投資組合</h2>
          <p className="text-slate-500">追蹤台股、美股持倉損益。</p>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={handleRefreshPrices}
            className={`flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 ${refreshing ? 'animate-pulse' : ''}`}
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? '更新中' : '更新股價'}
          </button>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {showForm ? '取消' : <><Plus size={18} /> 新增持股</>}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">代號</label>
              <input 
                required
                type="text" 
                placeholder="例如 2330.TW"
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.symbol}
                onChange={e => setFormData({...formData, symbol: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">名稱</label>
              <input 
                required
                type="text" 
                placeholder="例如 台積電"
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">股數</label>
              <input 
                required
                type="number" 
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.shares}
                onChange={e => setFormData({...formData, shares: parseFloat(e.target.value)})}
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">平均成本</label>
              <input 
                required
                type="number" 
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.averageCost}
                onChange={e => setFormData({...formData, averageCost: parseFloat(e.target.value)})}
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">幣別</label>
              <select 
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.currency}
                onChange={e => setFormData({...formData, currency: e.target.value})}
              >
                <option value="TWD">TWD</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div className="lg:col-span-5 flex justify-end">
              <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                新增
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stocks.map(stock => {
          const marketValue = stock.shares * stock.currentPrice;
          const costBasis = stock.shares * stock.averageCost;
          const profit = marketValue - costBasis;
          const percent = (profit / costBasis) * 100;
          const isPositive = profit >= 0;

          return (
            <div key={stock.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {isPositive ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{stock.name}</h3>
                    <p className="text-sm text-slate-500 font-mono">{stock.symbol}</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeStock(stock.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-500">持有股數</p>
                  <p className="font-medium text-slate-800">{stock.shares}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">現價</p>
                  <p className="font-medium text-slate-800">{stock.currency} {stock.currentPrice}</p>
                </div>
                 <div>
                  <p className="text-xs text-slate-500">成本均價</p>
                  <p className="font-medium text-slate-800">{stock.currency} {stock.averageCost}</p>
                </div>
                 <div>
                  <p className="text-xs text-slate-500">市值</p>
                  <p className="font-medium text-slate-800">{stock.currency} {marketValue.toLocaleString()}</p>
                </div>
              </div>

              <div className={`p-3 rounded-lg flex justify-between items-center ${isPositive ? 'bg-emerald-50' : 'bg-red-50'}`}>
                <span className={`text-sm font-medium ${isPositive ? 'text-emerald-700' : 'text-red-700'}`}>未實現損益</span>
                <div className="text-right">
                  <p className={`font-bold ${isPositive ? 'text-emerald-700' : 'text-red-700'}`}>
                    {isPositive ? '+' : ''}{profit.toLocaleString()} {stock.currency}
                  </p>
                  <p className={`text-xs ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}{percent.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Portfolio;