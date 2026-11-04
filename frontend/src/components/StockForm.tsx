import { useState, FormEvent } from 'react';
import { createStock } from '../api';
import { Button } from './ui';
import { Icon } from './icons';
import type { Stock } from '../types';

interface StockFormProps {
  onSubmit: (stock: Stock) => void;
}

const SECTORS = [
  'Technology',
  'Healthcare',
  'Financials',
  'Energy',
  'Consumer Discretionary',
  'Consumer Staples',
  'Industrials',
  'Utilities',
  'Real Estate',
  'Materials',
  'Communication Services',
];

export function StockForm({ onSubmit }: StockFormProps) {
  const [ticker, setTicker] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState(SECTORS[0]);
  const [currentPrice, setCurrentPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setTicker('');
    setCompanyName('');
    setSector(SECTORS[0]);
    setCurrentPrice('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedTicker = ticker.trim().toUpperCase();
    const trimmedName = companyName.trim();
    const price = Number(currentPrice);

    if (!trimmedTicker) {
      setError('Ticker symbol is required.');
      return;
    }
    if (!trimmedName) {
      setError('Company name is required.');
      return;
    }
    if (!currentPrice || Number.isNaN(price) || price < 0) {
      setError('Enter a valid current price.');
      return;
    }

    setSubmitting(true);
    try {
      const stock = await createStock({
        ticker: trimmedTicker,
        companyName: trimmedName,
        sector,
        currentPrice: price,
      });
      onSubmit(stock);
      resetForm();
    } catch (err: any) {
      setError(err?.message || 'Could not add this stock. It may already exist.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="ds-form" onSubmit={handleSubmit}>
      {error && (
        <div className="ds-alert" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
          {error}
        </div>
      )}
      <div className="ds-form-row">
        <div className="ds-field">
          <label className="ds-label" htmlFor="stock-ticker">
            Ticker
          </label>
          <input
            id="stock-ticker"
            className="input"
            placeholder="e.g. AAPL"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            maxLength={10}
            required
          />
        </div>
        <div className="ds-field">
          <label className="ds-label" htmlFor="stock-price">
            Current price (USD)
          </label>
          <input
            id="stock-price"
            className="input"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="stock-company">
          Company name
        </label>
        <input
          id="stock-company"
          className="input"
          placeholder="e.g. Apple Inc."
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          maxLength={200}
          required
        />
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="stock-sector">
          Sector
        </label>
        <select
          id="stock-sector"
          className="input"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
        >
          {SECTORS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="ds-help">Used to group stocks on the dashboard and watchlist.</span>
      </div>

      <div className="ds-form-actions">
        <Button type="submit" variant="primary" disabled={submitting}>
          <Icon name="plus" size={16} />
          {submitting ? 'Adding stock...' : 'Add stock'}
        </Button>
      </div>
    </form>
  );
}

export default StockForm;
