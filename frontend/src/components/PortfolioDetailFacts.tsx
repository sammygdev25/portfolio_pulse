import type { Portfolio } from '../types';
import type { Holding } from './HoldingsTable.tsx';
import { Section, Grid, Stat } from '../components/ui';
import { Icon } from '../components/icons';

interface PortfolioDetailFactsProps {
  portfolio: Portfolio;
  holdings: Holding[];
  transactionsCount: number;
}

export default function PortfolioDetailFacts({ portfolio, holdings, transactionsCount }: PortfolioDetailFactsProps) {
  const totalMarketValue = holdings.reduce((sum, h: any) => sum + Number(h.marketValue ?? 0), 0);
  const totalCostBasis = holdings.reduce((sum, h: any) => sum + Number(h.costBasis ?? 0), 0);
  const totalGainLoss = totalMarketValue - totalCostBasis;
  const gainLossPct = totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0;

  const createdAt = portfolio.createdAt ? new Date(portfolio.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : '—';

  return (
    <Section eyebrow="Overview" title="Portfolio details">
      <Grid cols={2} size="md">
        <Stat value={portfolio.name} label="Portfolio name" icon="package" />
        <Stat value={createdAt} label="Created" icon="calendar" />
        <Stat value={holdings.length} label="Holdings" icon="grid" />
        <Stat value={transactionsCount} label="Transactions" icon="refresh" />
        <Stat value={`$${Number(totalMarketValue || 0).toFixed(2)}`} label="Market value" icon="dollar" />
        <Stat value={`$${Number(totalCostBasis || 0).toFixed(2)}`} label="Cost basis" icon="credit-card" />
        <Stat
          value={`${totalGainLoss >= 0 ? '+' : ''}$${Number(totalGainLoss || 0).toFixed(2)}`}
          label="Unrealized gain/loss"
          icon={totalGainLoss >= 0 ? 'arrow-right' : 'alert'}
        />
        <Stat
          value={`${gainLossPct >= 0 ? '+' : ''}${Number(gainLossPct || 0).toFixed(2)}%`}
          label="Return"
          icon="sparkle"
        />
      </Grid>
      {holdings.length === 0 && (
        <p className="ds-muted ds-small">
          <Icon name="info" size={14} /> No buy or sell transactions yet for this portfolio. Record a trade to start
          tracking holdings and performance here.
        </p>
      )}
    </Section>
  );
}