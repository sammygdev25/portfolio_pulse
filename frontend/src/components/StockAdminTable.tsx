import { useState } from 'react';
import { Button } from './ui';
import { Icon } from './icons';
import type { Stock } from '../types';

interface StockAdminTableProps {
  stocks: Stock[];
  onUpdatePrice: (id: number, price: number) => void | Promise<void>;
}

export default function StockAdminTable({ stocks, onUpdatePrice }: StockAdminTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draftPrice, setDraftPrice] = useState('');

  const startEdit = (stock: Stock) => {
    setEditingId(stock.id);
    setDraftPrice(String(stock.currentPrice));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftPrice('');
  };

  const saveEdit = (id: number) => {
    const price = Number(draftPrice);
    if (Number.isNaN(price) || price < 0) return;
    onUpdatePrice(id, price);
    setEditingId(null);
    setDraftPrice('');
  };

  if (stocks.length === 0) {
    return <p className="ds-muted">No stocks in the catalog yet.</p>;
  }

  return (
    <div className="ds-table-wrap">
      <table className="ds-table">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Company</th>
            <th>Sector</th>
            <th>Current Price</th>
            <th>Last Updated</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => {
            const isEditing = editingId === stock.id;
            return (
              <tr key={stock.id}>
                <td style={{ fontFamily: 'var(--font-mono, monospace)' }}>{stock.ticker}</td>
                <td>{stock.companyName}</td>
                <td>{stock.sector}</td>
                <td>
                  {isEditing ? (
                    <input
                      className="input"
                      type="number"
                      step="0.01"
                      min="0"
                      value={draftPrice}
                      onChange={(e) => setDraftPrice(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <span>${Number(stock.currentPrice).toFixed(2)}</span>
                  )}
                </td>
                <td className="ds-small ds-muted">
                  {stock.updatedAt ? new Date(stock.updatedAt).toLocaleDateString() : '—'}
                </td>
                <td>
                  {isEditing ? (
                    <div className="ds-cluster">
                      <Button variant="primary" size="md" onClick={() => saveEdit(stock.id)}>
                        <Icon name="check" size={16} /> Save
                      </Button>
                      <Button variant="ghost" size="md" onClick={cancelEdit}>
                        <Icon name="close" size={16} /> Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button variant="secondary" size="md" onClick={() => startEdit(stock)}>
                      <Icon name="edit" size={16} /> Update Price
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}