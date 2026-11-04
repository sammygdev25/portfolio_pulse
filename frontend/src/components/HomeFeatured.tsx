import type { Stock } from '../types';
import { Section, Grid, Card, CardBody, CardTitle, CardMeta, CardFooter, Price, Media, Badge, SkeletonCards, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';

interface HomeFeaturedProps {
  stocks: Stock[];
  loading?: boolean;
}

export default function HomeFeatured({ stocks, loading }: HomeFeaturedProps) {
  const featured = stocks.slice(0, 8);

  return (
    <Section
      eyebrow="Markets"
      title="Featured stocks"
      subtitle="Track prices across sectors and build your watchlist from the names moving the market."
    >
      {loading ? (
        <SkeletonCards count={8} />
      ) : featured.length === 0 ? (
        <EmptyState
          icon="package"
          title="No stocks yet"
          text="Once stocks are added to the platform, they will appear here for quick tracking."
        />
      ) : (
        <Grid size="sm" cols={4}>
          {featured.map((stock) => (
            <Card key={stock.id}>
              <Media alt={stock.ticker} ratio="square" badge={stock.sector} />
              <CardBody>
                <CardTitle>{stock.ticker}</CardTitle>
                <CardMeta>{stock.companyName}</CardMeta>
                <CardFooter>
                  <Price value={Number(stock.currentPrice)} />
                  <Badge tone="soft">
                    <Icon name="tag" size={12} /> {stock.sector}
                  </Badge>
                </CardFooter>
              </CardBody>
            </Card>
          ))}
        </Grid>
      )}
    </Section>
  );
}