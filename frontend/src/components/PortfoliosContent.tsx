import { useNavigate } from 'react-router-dom';
import { Section, Grid, Card, CardBody, CardTitle, CardMeta, SkeletonCards, EmptyState, Button, Badge } from '../components/ui';
import { Icon } from '../components/icons';
import type { Portfolio } from '../types';

interface PortfoliosContentProps {
  portfolios: Portfolio[];
  loading: boolean;
  onCreate: () => void;
}

export default function PortfoliosContent({ portfolios, loading, onCreate }: PortfoliosContentProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Section title="Your portfolios">
        <SkeletonCards count={3} />
      </Section>
    );
  }

  if (portfolios.length === 0) {
    return (
      <Section title="Your portfolios">
        <EmptyState
          icon="package"
          title="No portfolios yet"
          text="Create your first portfolio to start tracking buy and sell transactions, holdings and performance."
          action={
            <Button variant="primary" onClick={onCreate}>
              <Icon name="plus" size={16} /> New portfolio
            </Button>
          }
        />
      </Section>
    );
  }

  return (
    <Section
      title="Your portfolios"
      subtitle="Track holdings, transactions and performance across each portfolio."
      actions={
        <Button variant="primary" onClick={onCreate}>
          <Icon name="plus" size={16} /> New portfolio
        </Button>
      }
    >
      <Grid size="md" cols={3}>
        {portfolios.map((portfolio) => (
          <Card key={portfolio.id} onClick={() => navigate(`/portfolios/${portfolio.id}`)}>
            <CardBody>
              <Badge tone="primary">Portfolio</Badge>
              <CardTitle>{portfolio.name}</CardTitle>
              <CardMeta>
                <Icon name="calendar" size={14} /> Created{' '}
                {portfolio.createdAt ? new Date(portfolio.createdAt).toLocaleDateString() : '—'}
              </CardMeta>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}