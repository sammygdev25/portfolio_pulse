import { Card, CardBody, CardTitle, CardMeta } from '../components/ui';
import { Icon } from '../components/icons';
import type { Portfolio } from '../types';

interface PortfolioCardProps {
  portfolio: Portfolio;
  onClick?: (portfolio: Portfolio) => void;
}

function PortfolioCard({ portfolio, onClick }: PortfolioCardProps) {
  const created = portfolio.createdAt
    ? new Date(portfolio.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <Card onClick={onClick ? () => onClick(portfolio) : undefined}>
      <CardBody>
        <div className="ds-cluster" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <CardTitle>{portfolio.name}</CardTitle>
          <Icon name="package" title="Portfolio" />
        </div>
        {created && (
          <CardMeta>
            <Icon name="calendar" size={14} /> Created {created}
          </CardMeta>
        )}
      </CardBody>
    </Card>
  );
}

export default PortfolioCard;
export { PortfolioCard };