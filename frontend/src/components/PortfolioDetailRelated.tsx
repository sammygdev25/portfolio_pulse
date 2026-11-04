import { Link } from 'react-router-dom';
import { Section, Grid, Card, CardBody, CardTitle, CardMeta } from '../components/ui';
import { Icon } from '../components/icons';
import type { Portfolio } from '../types';

interface PortfolioDetailRelatedProps {
  portfolios: Portfolio[];
  currentPortfolioId: string | number;
  holdingsCountByPortfolio?: Record<string, number>;
}

export default function PortfolioDetailRelated({
  portfolios,
  currentPortfolioId,
  holdingsCountByPortfolio,
}: PortfolioDetailRelatedProps) {
  const related = portfolios
    .filter((p) => String(p.id) !== String(currentPortfolioId))
    .slice(0, 6);

  if (related.length === 0) {
    return null;
  }

  return (
    <Section
      eyebrow="Your portfolios"
      title="Other portfolios"
      subtitle="Jump to another portfolio you're tracking"
    >
      <Grid size="sm">
        {related.map((portfolio) => {
          const count = holdingsCountByPortfolio?.[String(portfolio.id)];
          return (
            <Card key={portfolio.id} to={`/portfolios/${portfolio.id}`}>
              <CardBody>
                <CardTitle>
                  <Icon name="package" size={16} /> {portfolio.name}
                </CardTitle>
                <CardMeta>
                  {typeof count === 'number'
                    ? `${count} holding${count === 1 ? '' : 's'}`
                    : 'View holdings and transactions'}
                </CardMeta>
              </CardBody>
            </Card>
          );
        })}
      </Grid>
    </Section>
  );
}