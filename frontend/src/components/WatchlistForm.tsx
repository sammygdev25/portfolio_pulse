import { useState } from 'react';
import { createWatchlistItem } from '../api';
import { Button } from './ui';
import { Icon } from './icons';
import type { Stock, WatchlistItem } from '../types';

interface WatchlistFormProps {
  stocks: Stock[];
  onSubmit: (item: WatchlistItem) => void;
}

export function WatchlistForm({ stocks, onSubmit }: WatchlistFormProps) {
  const [stockId, setStockId] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!stockId) {
      setError('Pick a stock to track.');
      return;
    }
    const price = Number(targetPrice);
    if (!targetPrice || Number.isNaN(price) || price <= 0) {
      setError('Enter a valid target price.');
      return;
    }

    setSubmitting(true);
    try {
      const item = await createWatchlistItem({
        stockId: Number(stockId),
        targetPrice: price,
      });
      onSubmit(item);
      setStockId('');
      setTargetPrice('');
    } catch (err: any) {
      setError(err?.message || 'Could not add this stock to your watchlist.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="ds-form" onSubmit={handleSubmit}>
      <div className="ds-form-row">
        <div className="ds-field">
          <label className="ds-label" htmlFor="watchlist-stock">
            Stock
          </label>
          <select
            id="watchlist-stock"
            className="input"
            value={stockId}
            onChange={(e) => setStockId(e.target.value)}
          >
            <option value="">Select a stock...</option>
            {stocks.map((stock) => (
              <option key={stock.id} value={stock.id}>
                {stock.ticker} — {stock.companyName}
              </option>
            ))}
          </select>
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="watchlist-target-price">
            Target price
          </label>
          <input
            id="watchlist-target-price"
            className="input"
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g. 150.00"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
          />
          <span className="ds-help">You'll track this stock once it hits your target.</span>
        </div>
      </div>

      {error && (
        <p className="ds-small" style={{ color: 'var(--color-danger)' }}>
          {error}
        </p>
      )}

      <div className="ds-form-actions">
        <Button type="submit" variant="primary" disabled={submitting}>
          <Icon name="plus" size={16} />
          {submitting ? 'Adding...' : 'Add to watchlist'}
        </Button>
      </div>
    </form>
  );
}

export default WatchlistForm;
