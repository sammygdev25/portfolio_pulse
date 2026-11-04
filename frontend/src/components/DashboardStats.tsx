import { Grid, Stat } from '../components/ui';

interface DashboardStatsProps {
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  portfolioCount: number;
  holdingsCount: number;
}

export default function DashboardStats({
  totalValue,
  totalGainLoss,
  totalGainLossPercent,
  portfolioCount,
  holdingsCount,
}: DashboardStatsProps) {
  const isGain = totalGainLoss >= 0;

  const formattedValue = `$${totalValue.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const formattedGainLoss = `${isGain ? '+' : ''}$${totalGainLoss.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const formattedPercent = `${isGain ? '+' : ''}${Number(totalGainLossPercent || 0).toFixed(2)}%`;

  return (
    <Grid size="sm" cols={4}>
      <Stat
        value={formattedValue}
        label="Total Portfolio Value"
        icon="dollar"
      />
      <Stat
        value={`${formattedGainLoss} (${formattedPercent})`}
        label={isGain ? 'Total Gain' : 'Total Loss'}
        icon={isGain ? 'award' : 'alert'}
      />
      <Stat
        value={String(portfolioCount)}
        label="Portfolios"
        icon="list"
      />
      <Stat
        value={String(holdingsCount)}
        label="Watchlist Items"
        icon="star"
      />
    </Grid>
  );
}
