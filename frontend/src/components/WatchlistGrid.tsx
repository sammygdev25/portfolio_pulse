import { Section, Grid, Card, CardBody, CardTitle, CardMeta, Price, Badge, Media, SkeletonCards, EmptyState, Button } from '../components/ui';
import { Icon } from '../components/icons';
import type { WatchlistItem } from '../types';

interface WatchlistGridProps {
  items: WatchlistItem[];
  loading: boolean;
  onRemove: (id: number) => void;
  onAddClick?: () => void;
}

export default function WatchlistGrid({ items, loading, onRemove, onAddClick }: WatchlistGridProps) {
  if (loading) {
    return (
      <Section title="Watched stocks" subtitle="Tickers you're tracking against a target price">
        <SkeletonCards count={6} />
      </Section>
    );
  }

  if (items.length === 0) {
    return (
      <Section title="Watched stocks" subtitle="Tickers you're tracking against a target price">
        <EmptyState
          icon="star"
          title="Your watchlist is empty"
          text="Add a ticker and a target price to get notified when it's worth a second look."
          action={
            onAddClick ? (
              <Button variant="primary" onClick={onAddClick}>
                <Icon name="plus" size={16} /> Add a stock
              </Button>
            ) : undefined
          }
        />
      </Section>
    );
  }

  return (
    <Section title="Watched stocks" subtitle={`${items.length} ticker${items.length === 1 ? '' : 's'} on your radar`}>
      <Grid size="md" cols={3}>
        {items.map((item) => {
          const current = item.stock ? Number(item.stock.currentPrice) : null;
          const target = Number(item.targetPrice);
          const reached = current !== null && current <= target;
          return (
            <Card key={item.id}>
              <Media
                ratio="square"
                alt={item.stock?.companyName ?? 'Stock'}
                badge={item.stock?.sector ?? undefined}
              />
              <CardBody>
                <CardTitle>{item.stock?.ticker ?? 'Unknown'}</CardTitle>
                <CardMeta>{item.stock?.companyName ?? 'Company unavailable'}</CardMeta>
                <div className="ds-cluster" style={{ marginTop: '0.5rem' }}>
                  {current !== null && <Price value={current} />}
                  <Badge tone={reached ? 'success' : 'soft'}>
                    {reached ? 'Target reached' : `Target ${Number(target || 0).toFixed(2)}`}
                  </Badge>
                </div>
                <div className="ds-form-actions">
                  <Button variant="danger" size="md" onClick={() => onRemove(item.id)}>
                    <Icon name="trash" size={16} /> Remove
                  </Button>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </Grid>
    </Section>
  );
}