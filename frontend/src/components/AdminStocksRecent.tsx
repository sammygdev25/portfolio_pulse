import { Section, Price, Badge, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';
import type { Stock } from '../types';

interface AdminStocksRecentProps {
  stocks: Stock[];
}

export default function AdminStocksRecent({ stocks }: AdminStocksRecentProps) {
  const recent = [...stocks]
    .sort(
      (a, b) =>
        new Date(b.updatedAt ?? b.createdAt).getTime() -
        new Date(a.updatedAt ?? a.createdAt).getTime()
    )
    .slice(0, 8);

  return (
    <Section
      eyebrow="Recent activity"
      title="Latest price updates"
      subtitle="The most recently touched tickers in the catalog"
    >
      {recent.length === 0 ? (
        <EmptyState
          icon="clock"
          title="No stocks yet"
          text="Add a ticker to start tracking its price history."
        />
      ) : (
        <div className="ds-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Company</th>
                <th>Sector</th>
                <th>Current price</th>
                <th>Last updated</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((stock) => (
                <tr key={stock.id}>
                  <td>
                    <strong>{stock.ticker}</strong>
                  </td>
                  <td>{stock.companyName}</td>
                  <td>
                    <Badge tone="soft">{stock.sector}</Badge>
                  </td>
                  <td>
                    <Price value={Number(stock.currentPrice)} />
                  </td>
                  <td className="ds-muted ds-small">
                    <Icon name="clock" size={14} />{' '}
                    {new Date(stock.updatedAt ?? stock.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}