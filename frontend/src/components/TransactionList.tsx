import type { Transaction } from '../types';
import { Badge, EmptyState } from './ui';

interface TransactionListProps {
  transactions: Transaction[];
}

function TransactionList({ transactions }: TransactionListProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState
        icon="list"
        title="No transactions yet"
        text="Buy or sell shares to see your transaction history here."
      />
    );
  }

  return (
    <div className="ds-table-wrap">
      <table className="ds-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Stock</th>
            <th>Type</th>
            <th>Shares</th>
            <th>Price/Share</th>
            <th>Fees</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const shares = Number(tx.shares);
            const pricePerShare = Number(tx.pricePerShare);
            const fees = Number(tx.fees ?? 0);
            const gross = shares * pricePerShare;
            const total = tx.transactionType === 'buy' ? gross + fees : gross - fees;

            return (
              <tr key={tx.id}>
                <td>
                  {new Date(tx.transactionDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td>{tx.stock?.ticker ?? `#${tx.stockId}`}</td>
                <td>
                  <Badge tone={tx.transactionType === 'buy' ? 'success' : 'danger'}>
                    {tx.transactionType === 'buy' ? 'Buy' : 'Sell'}
                  </Badge>
                </td>
                <td>{shares.toLocaleString(undefined, { maximumFractionDigits: 4 })}</td>
                <td>${Number(pricePerShare || 0).toFixed(2)}</td>
                <td>${Number(fees || 0).toFixed(2)}</td>
                <td>${Number(total || 0).toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionList;
export { TransactionList };