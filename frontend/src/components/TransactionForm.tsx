import { useState } from 'react';
import type { Stock } from '../types';
import { Button } from './ui';

interface NewTransactionData {
  portfolioId: number;
  stockId: number;
  transactionType: 'buy' | 'sell';
  shares: number;
  pricePerShare: number;
  fees: number;
  transactionDate: string;
}

interface TransactionFormProps {
  portfolioId: string;
  stocks: Stock[];
  onSubmit: (data: NewTransactionData) => Promise<void> | void;
}

function TransactionForm({ portfolioId, stocks, onSubmit }: TransactionFormProps) {
  const [stockId, setStockId] = useState<string>(stocks[0] ? String(stocks[0].id) : '');
  const [transactionType, setTransactionType] = useState<'buy' | 'sell'>('buy');
  const [shares, setShares] = useState('');
  const [pricePerShare, setPricePerShare] = useState('');
  const [fees, setFees] = useState('0');
  const [transactionDate, setTransactionDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedStock = stocks.find((s) => String(s.id) === stockId);

  const handleStockChange = (value: string) => {
    setStockId(value);
    const stock = stocks.find((s) => String(s.id) === value);
    if (stock && !pricePerShare) {
      setPricePerShare(String(stock.currentPrice));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!stockId) {
      setError('Choose a stock for this transaction.');
      return;
    }
    const sharesNum = Number(shares);
    const priceNum = Number(pricePerShare);
    const feesNum = Number(fees) || 0;
    if (!sharesNum || sharesNum <= 0) {
      setError('Shares must be a positive number.');
      return;
    }
    if (!priceNum || priceNum <= 0) {
      setError('Price per share must be a positive number.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        portfolioId: Number(portfolioId),
        stockId: Number(stockId),
        transactionType,
        shares: sharesNum,
        pricePerShare: priceNum,
        fees: feesNum,
        transactionDate: new Date(transactionDate).toISOString(),
      });
      setShares('');
      setPricePerShare('');
      setFees('0');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not record the transaction.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="ds-form" onSubmit={handleSubmit}>
      {error && (
        <div className="ds-alert" role="alert" style={{ borderColor: 'var(--color-danger)' }}>
          {error}
        </div>
      )}

      <div className="ds-form-row">
        <div className="ds-field">
          <label className="ds-label" htmlFor="tx-stock">Stock</label>
          <select
            id="tx-stock"
            className="input"
            value={stockId}
            onChange={(e) => handleStockChange(e.target.value)}
          >
            {stocks.length === 0 && <option value="">No stocks available</option>}
            {stocks.map((stock) => (
              <option key={stock.id} value={stock.id}>
                {stock.ticker} — {stock.companyName}
              </option>
            ))}
          </select>
          {selectedStock && (
            <p className="ds-help">Current price: ${Number(selectedStock.currentPrice).toFixed(2)} · {selectedStock.sector}</p>
          )}
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="tx-type">Type</label>
          <select
            id="tx-type"
            className="input"
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value as 'buy' | 'sell')}
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>
      </div>

      <div className="ds-form-row">
        <div className="ds-field">
          <label className="ds-label" htmlFor="tx-shares">Shares</label>
          <input
            id="tx-shares"
            className="input"
            type="number"
            min="0"
            step="0.0001"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            placeholder="0.0000"
            required
          />
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="tx-price">Price per share ($)</label>
          <input
            id="tx-price"
            className="input"
            type="number"
            min="0"
            step="0.01"
            value={pricePerShare}
            onChange={(e) => setPricePerShare(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div className="ds-form-row">
        <div className="ds-field">
          <label className="ds-label" htmlFor="tx-fees">Fees ($)</label>
          <input
            id="tx-fees"
            className="input"
            type="number"
            min="0"
            step="0.01"
            value={fees}
            onChange={(e) => setFees(e.target.value)}
          />
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="tx-date">Date</label>
          <input
            id="tx-date"
            className="input"
            type="date"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="ds-form-actions">
        <Button type="submit" variant="primary" disabled={submitting || stocks.length === 0}>
          {submitting ? 'Recording…' : transactionType === 'buy' ? 'Record buy' : 'Record sell'}
        </Button>
      </div>
    </form>
  );
}

export default TransactionForm;
export { TransactionForm };