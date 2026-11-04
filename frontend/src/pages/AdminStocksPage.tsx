import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getStockList, createStock, updateStock } from '../api';
import type { Stock } from '../types';
import AdminStocksHeader from '../components/AdminStocksHeader';
import AdminStocksStats from '../components/AdminStocksStats';
import AdminStocksRecent from '../components/AdminStocksRecent';
import AdminStocksActions from '../components/AdminStocksActions';
import StockAdminTable from '../components/StockAdminTable';
import StockForm from '../components/StockForm';
import { LoadingBlock, Alert, Section } from '../components/ui';

export default function AdminStocksPage() {
  const { user } = useAuth();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchStocks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStockList();
      setStocks(data);
    } catch (err) {
      console.error(err);
      setError('Could not load the stock catalog. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  const handleAddStock = useCallback(() => {
    setShowForm(true);
  }, []);

  const handleCreateStock = useCallback(
    async (data: { ticker: string; companyName: string; sector: string; currentPrice: number }) => {
      const created = await createStock(data);
      setStocks((prev) =>
        [...prev, created].sort((a, b) => a.ticker.localeCompare(b.ticker))
      );
      setShowForm(false);
    },
    []
  );

  const handleUpdatePrice = useCallback(async (id: number, currentPrice: number) => {
    const updated = await updateStock(id, { currentPrice });
    setStocks((prev) => prev.map((s) => (s.id === id ? updated : s)));
  }, []);

  if (loading) {
    return <LoadingBlock label="Loading the stock catalog..." />;
  }

  return (
    <div className="ds-stack ds-stack-lg">
      <AdminStocksHeader userName={user?.username} onAddStock={handleAddStock} />

      {error && <Alert tone="danger">{error}</Alert>}

      <AdminStocksStats stocks={stocks} />

      {showForm && (
        <Section title="Add a new stock" tight>
          <StockForm onSubmit={handleCreateStock} />
        </Section>
      )}

      <Section title="Manage stocks" tight>
        <StockAdminTable stocks={stocks} onUpdatePrice={handleUpdatePrice} />
      </Section>

      <AdminStocksRecent stocks={stocks} />

      <AdminStocksActions onAddStock={handleAddStock} onRefresh={fetchStocks} />
    </div>
  );
}
