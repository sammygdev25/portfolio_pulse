import { Grid, Stat } from '../components/ui';
import type { Stock } from '../types';

interface AdminStocksStatsProps {
  stocks: Stock[];
}

export default function AdminStocksStats({ stocks }: AdminStocksStatsProps) {
  const totalStocks = stocks.length;
  const sectors = new Set(stocks.map((s) => s.sector)).size;
  const avgPrice =
    totalStocks > 0
      ? stocks.reduce((sum, s) => sum + Number(s.currentPrice), 0) / totalStocks
      : 0;
  const topStock = stocks.reduce<Stock | null>((top, s) => {
    if (!top || Number(s.currentPrice) > Number(top.currentPrice)) return s;
    return top;
  }, null);

  return (
    <Grid size="sm" cols={4}>
      <Stat
        value={String(totalStocks)}
        label="Stocks in catalog"
        icon="package"
      />
      <Stat
        value={String(sectors)}
        label="Sectors covered"
        icon="grid"
      />
      <Stat
        value={`$${Number(avgPrice || 0).toFixed(2)}`}
        label="Average price"
        icon="dollar"
      />
      <Stat
        value={topStock ? `${topStock.ticker} $${Number(topStock.currentPrice).toFixed(2)}` : '—'}
        label="Highest priced"
        icon="award"
      />
    </Grid>
  );
}