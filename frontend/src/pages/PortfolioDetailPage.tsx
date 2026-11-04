import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Section, LoadingBlock } from '../components/ui';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import PortfolioDetailMedia from '../components/PortfolioDetailMedia';
import PortfolioDetailFacts from '../components/PortfolioDetailFacts';
import PortfolioDetailRelated from '../components/PortfolioDetailRelated';
import HoldingsTable from '../components/HoldingsTable';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import { usePortfolio } from '../contexts/PortfolioContext';
import { getPortfolio, getTransactionList, getHoldingList, getStockList } from '../api';
import type { Portfolio, Transaction, Stock } from '../types';
import type { Holding } from '../components/HoldingsTable.tsx';

export default function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { portfolios, fetchPortfolios } = usePortfolio();

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const loadPortfolio = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const p = await getPortfolio(id);
      setPortfolio(p);
    } catch (err) {
      setError('Could not load this portfolio. It may have been removed.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadHoldings = useCallback(async () => {
    if (!id) return;
    try {
      const h = await getHoldingList();
      setHoldings(
        h.filter((item: any) => item.portfolioId === undefined || String(item.portfolioId) === String(id))
      );
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  const loadTransactions = useCallback(async () => {
    if (!id) return;
    try {
      const t = await getTransactionList();
      setTransactions(t.filter((tx: any) => String(tx.portfolioId) === String(id)));
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  const loadStocks = useCallback(async () => {
    try {
      const s = await getStockList();
      setStocks(s);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => { loadPortfolio(); }, [loadPortfolio]);
  useEffect(() => { loadHoldings(); }, [loadHoldings]);
  useEffect(() => { loadTransactions(); }, [loadTransactions]);
  useEffect(() => { loadStocks(); }, [loadStocks]);
  useEffect(() => { fetchPortfolios(); }, [fetchPortfolios]);

  const totalValue = holdings.reduce((sum, h: any) => {
    const value = Number(h.marketValue ?? h.currentValue ?? Number(h.shares ?? 0) * Number(h.currentPrice ?? 0));
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);

  const handleTransactionSaved = () => {
    setShowForm(false);
    loadHoldings();
    loadTransactions();
  };

  if (loading) {
    return (
      <div className="ds-container">
        <LoadingBlock label="Loading portfolio..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="ds-container">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="ds-container">
        <EmptyState message="This portfolio could not be found." />
      </div>
    );
  }

  const holdingsCountByPortfolio: Record<string, number> = {
    [String(portfolio.id)]: holdings.length,
  };

  return (
    <div className="ds-stack-lg">
      <PortfolioDetailMedia
        portfolio={portfolio}
        totalValue={totalValue}
        holdingsCount={holdings.length}
        onAddTransaction={() => setShowForm((v) => !v)}
      />

      {showForm && (
        <Section title="Record a transaction" tight>
          <TransactionForm
            portfolioId={String(portfolio.id)}
            stocks={stocks}
            onSubmit={handleTransactionSaved}
          />
        </Section>
      )}

      <PortfolioDetailFacts
        portfolio={portfolio}
        holdings={holdings}
        transactionsCount={transactions.length}
      />

      <Section title="Current holdings" tight>
        {holdings.length === 0 ? (
          <EmptyState message="No holdings yet. Record a buy transaction to build this portfolio." />
        ) : (
          <HoldingsTable holdings={holdings} />
        )}
      </Section>

      <Section title="Transaction history" tight>
        {transactions.length === 0 ? (
          <EmptyState message="No buy or sell transactions recorded for this portfolio yet." />
        ) : (
          <TransactionList transactions={transactions} />
        )}
      </Section>

      <PortfolioDetailRelated
        portfolios={portfolios}
        currentPortfolioId={portfolio.id}
        holdingsCountByPortfolio={holdingsCountByPortfolio}
      />
    </div>
  );
}