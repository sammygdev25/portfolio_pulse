import { PageHeader } from '../components/ui';

interface WatchlistHeaderProps {
  count?: number;
  loading?: boolean;
}

export default function WatchlistHeader({ count, loading }: WatchlistHeaderProps) {
  const subtitle =
    !loading && typeof count === 'number'
      ? `Tracking ${count} stock${count === 1 ? '' : 's'} against your target prices`
      : 'Set target prices and keep an eye on the stocks you care about';

  return (
    <PageHeader
      eyebrow="Watchlist"
      title="Your watchlist"
      subtitle={subtitle}
    />
  );
}