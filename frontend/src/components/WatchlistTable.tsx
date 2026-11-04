import type { WatchlistItem } from '../types';
import { Button } from '../components/ui';
import { Badge } from '../components/ui';
import { Icon } from '../components/icons';

interface WatchlistTableProps {
  items: WatchlistItem[];
  onRemove: (id: number) => void;
}

function WatchlistTable({ items, onRemove }: WatchlistTableProps) {
  return (
    <div className="ds-table-wrap">
      <table className="ds-table">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Company</th>
            <th>Sector</th>
            <th>Current Price</th>
            <th>Target Price</th>
            <th>Status</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const currentPrice = item.stock ? Number(item.stock.currentPrice) : null;
            const targetPrice = Number(item.targetPrice);
            const reached = currentPrice !== null && currentPrice <= targetPrice;
            return (
              <tr key={item.id}>
                <td>
                  <strong>{item.stock?.ticker ?? '—'}</strong>
                </td>
                <td>{item.stock?.companyName ?? '—'}</td>
                <td>{item.stock?.sector ?? '—'}</td>
                <td>{currentPrice !== null ? `$${Number(currentPrice || 0).toFixed(2)}` : '—'}</td>
                <td>${Number(targetPrice || 0).toFixed(2)}</td>
                <td>
                  {reached ? (
                    <Badge tone="success">Target reached</Badge>
                  ) : (
                    <Badge tone="neutral">Watching</Badge>
                  )}
                </td>
                <td>
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => onRemove(item.id)}
                    aria-label={`Remove ${item.stock?.ticker ?? 'stock'} from watchlist`}
                  >
                    <Icon name="trash" size={16} />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default WatchlistTable;
export { WatchlistTable };