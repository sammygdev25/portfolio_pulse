import { EmptyState, Price, Badge } from './ui';

export interface Holding {
  stockId: number;
  ticker: string;
  companyName: string;
  sector: string;
  shares: number;
  avgCostPerShare: number;
  totalCost: number;
  currentPrice: number;
  marketValue: number;
  gainLoss: number;
  gainLossPercent: number;
}

interface HoldingsTableProps {
  holdings: Holding[];
}

function HoldingsTable({ holdings }: HoldingsTableProps) {
  if (!holdings || holdings.length === 0) {
    return (
      <EmptyState
        icon="package"
        title="No holdings yet"
        text="Buy some shares to see your positions build up here."
      />
    );
  }

  return (
    <div className="ds-table-wrap">
      <table className="ds-table">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Company</th>
            <th>Sector</th>
            <th>Shares</th>
            <th>Avg Cost</th>
            <th>Current Price</th>
            <th>Market Value</th>
            <th>Gain / Loss</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h) => {
            const isGain = h.gainLoss >= 0;
            return (
              <tr key={h.stockId}>
                <td>
                  <strong>{h.ticker}</strong>
                </td>
                <td>{h.companyName}</td>
                <td>
                  <Badge tone="soft">{h.sector}</Badge>
                </td>
                <td>{h.shares.toLocaleString(undefined, { maximumFractionDigits: 4 })}</td>
                <td>
                  <Price value={h.avgCostPerShare} />
                </td>
                <td>
                  <Price value={h.currentPrice} />
                </td>
                <td>
                  <Price value={h.marketValue} />
                </td>
                <td>
                  <Badge tone={isGain ? 'success' : 'danger'}>
                    {isGain ? '+' : ''}
                    {h.gainLoss.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
                    {' ('}
                    {isGain ? '+' : ''}
                    {Number(h.gainLossPercent || 0).toFixed(2)}%)
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export { HoldingsTable };
export default HoldingsTable;