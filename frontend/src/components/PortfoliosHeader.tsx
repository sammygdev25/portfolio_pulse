import { PageHeader, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface PortfoliosHeaderProps {
  portfolioCount?: number;
  onCreate?: () => void;
}

export default function PortfoliosHeader({ portfolioCount, onCreate }: PortfoliosHeaderProps) {
  const subtitle =
    typeof portfolioCount === 'number'
      ? `${portfolioCount} portfolio${portfolioCount === 1 ? '' : 's'} tracking your buy and sell activity across stocks`
      : 'Organize your holdings, log buy and sell transactions, and track performance across every portfolio you manage';

  return (
    <PageHeader
      eyebrow="Portfolio management"
      title="Your Portfolios"
      subtitle={subtitle}
      actions={
        onCreate ? (
          <Button variant="primary" size="lg" onClick={onCreate}>
            <Icon name="plus" size={18} />
            New portfolio
          </Button>
        ) : undefined
      }
    />
  );
}