import { Link } from 'react-router-dom';
import { Section, Card, CardBody, EmptyState, Badge } from '../components/ui';
import { Icon } from '../components/icons';
import type { Transaction } from '../types';

interface DashboardRecentProps {
  transactions: Transaction[];
}

export default function DashboardRecent({ transactions }: DashboardRecentProps) {
  const recent = transactions.slice(0, 8);

  return (
    <Section
      eyebrow="Recent activity"
      title="Latest transactions"
      subtitle="The most recent buys and sells across your portfolios"
    >
      {recent.length === 0 ? (
        <EmptyState
          icon="clock"
          title="No transactions yet"
          text="Buy or sell a stock in one of your portfolios to see activity here."
          action={
            <Link to="/portfolios" className="btn btn-primary">
              Go to portfolios
            </Link>
          }
        />
      ) : (
        <Card>
          <CardBody>
            <div className="ds-table-wrap">
              <table className="ds-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Stock</th>
                    <th>Type</th>
                    <th>Shares</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Portfolio</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((tx) => {
                    const shares = Number(tx.shares);
                    const price = Number(tx.pricePerShare);
                    const fees = Number(tx.fees ?? 0);
                    const total = shares * price + (tx.transactionType === 'buy' ? fees : -fees);
                    return (
                      <tr key={tx.id}>
                        <td>{new Date(tx.transactionDate).toLocaleDateString()}</td>
                        <td>
                          <span className="ds-cluster" style={{ gap: '0.4rem' }}>
                            <Icon name="dollar" size={14} />
                            {tx.stock?.ticker ?? `#${tx.stockId}`}
                          </span>
                        </td>
                        <td>
                          <Badge tone={tx.transactionType === 'buy' ? 'success' : 'danger'}>
                            {tx.transactionType === 'buy' ? 'Buy' : 'Sell'}
                          </Badge>
                        </td>
                        <td>{shares.toLocaleString()}</td>
                        <td>${Number(price || 0).toFixed(2)}</td>
                        <td>${Number(total || 0).toFixed(2)}</td>
                        <td>
                          {tx.portfolio ? (
                            <Link to={`/portfolios/${tx.portfolioId}`}>{tx.portfolio.name}</Link>
                          ) : (
                            <Link to={`/portfolios/${tx.portfolioId}`}>
                              View <Icon name="arrow-right" size={12} />
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}
    </Section>
  );
}