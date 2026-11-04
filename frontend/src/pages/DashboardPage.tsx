import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import DashboardHeader from '../components/DashboardHeader';
import DashboardStats from '../components/DashboardStats';
import DashboardRecent from '../components/DashboardRecent';
import DashboardActions from '../components/DashboardActions';
import { LoadingBlock, Alert } from '../components/ui';
import type { Transaction } from '../types';

interface DashboardSummary {
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  portfolioCount: number;
  holdingsCount: number;
  recentTransactions: Transaction[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/dashboard/');
      const data = res.data ?? res;
      setSummary({
        totalValue: Number(data.totalValue ?? 0),
        totalGainLoss: Number(data.totalGainLoss ?? 0),
        totalGainLossPercent: Number(data.totalGainLossPercent ?? 0),
        portfolioCount: Number(data.portfolioCount ?? 0),
        holdingsCount: Number(data.holdingsCount ?? 0),
        recentTransactions: Array.isArray(data.recentTransactions) ? data.recentTransactions : [],
      });
    } catch (err) {
      console.error(err);
      setError('Could not load your dashboard right now. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleAddPortfolio = () => {
    navigate('/portfolios');
  };

  if (loading) {
    return <LoadingBlock label="Loading your dashboard..." />;
  }

  if (error || !summary) {
    return (
      <div className="ds-container ds-section">
        <Alert tone="danger">{error || 'No dashboard data available.'}</Alert>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin' || user?.role === 'staff';

  return (
    <div className="ds-stack-lg">
      <DashboardHeader userName={user?.username} onAddPortfolio={handleAddPortfolio} />
      <DashboardStats
        totalValue={summary.totalValue}
        totalGainLoss={summary.totalGainLoss}
        totalGainLossPercent={summary.totalGainLossPercent}
        portfolioCount={summary.portfolioCount}
        holdingsCount={summary.holdingsCount}
      />
      <DashboardRecent transactions={summary.recentTransactions} />
      <DashboardActions isAdmin={isAdmin} />
    </div>
  );
}