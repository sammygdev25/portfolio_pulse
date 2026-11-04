import { Section, Split, Media, CardMeta, Price, Button } from '../components/ui';
import { Icon } from '../components/icons';
import type { Portfolio } from '../types';

interface PortfolioDetailMediaProps {
  portfolio: Portfolio;
  totalValue?: number;
  holdingsCount?: number;
  onAddTransaction?: () => void;
}

export default function PortfolioDetailMedia({
  portfolio,
  totalValue,
  holdingsCount,
  onAddTransaction,
}: PortfolioDetailMediaProps) {
  const createdAt = portfolio.createdAt
    ? new Date(portfolio.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <Section tight>
      <Split>
        <Media alt={portfolio.name} ratio="square" badge="Portfolio" />
        <div className="ds-stack">
          <span className="ds-eyebrow">Investment portfolio</span>
          <h1>{portfolio.name}</h1>
          <CardMeta>
            <span className="ds-cluster">
              <Icon name="calendar" size={16} />
              {createdAt ? `Tracking since ${createdAt}` : 'Newly created'}
            </span>
            {typeof holdingsCount === 'number' && (
              <span className="ds-cluster">
                <Icon name="package" size={16} />
                {holdingsCount} {holdingsCount === 1 ? 'holding' : 'holdings'}
              </span>
            )}
          </CardMeta>
          {typeof totalValue === 'number' ? (
            <Price value={totalValue} />
          ) : (
            <span className="ds-muted">Add a transaction to start tracking value</span>
          )}
          {onAddTransaction && (
            <Button variant="primary" size="lg" onClick={onAddTransaction}>
              <Icon name="plus" size={18} />
              Record transaction
            </Button>
          )}
        </div>
      </Split>
    </Section>
  );
}