import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Transactions from './pages/Transactions';
import Portfolio from './pages/Portfolio';
import Reports from './pages/Reports';
import Login from './pages/Login';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user, loading } = useFinance();
  
  if (loading) return <div className="flex h-screen items-center justify-center text-slate-400">Loading...</div>;
  
  return user ? element : <Navigate to="/login" />;
};

const AppContent: React.FC = () => {
  const { user } = useFinance();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        
        <Route path="/" element={<PrivateRoute element={<Layout><Dashboard /></Layout>} />} />
        <Route path="/accounts" element={<PrivateRoute element={<Layout><Accounts /></Layout>} />} />
        <Route path="/transactions" element={<PrivateRoute element={<Layout><Transactions /></Layout>} />} />
        <Route path="/portfolio" element={<PrivateRoute element={<Layout><Portfolio /></Layout>} />} />
        <Route path="/reports" element={<PrivateRoute element={<Layout><Reports /></Layout>} />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
};

export default App;