import { Section, Cluster, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface AdminStocksActionsProps {
  onAddStock?: () => void;
  onRefresh?: () => void;
}

export default function AdminStocksActions({ onAddStock, onRefresh }: AdminStocksActionsProps) {
  return (
    <Section tight title="Quick actions" eyebrow="Manage the catalog">
      <Cluster gap="sm">
        <Button variant="primary" onClick={onAddStock}>
          <Icon name="plus" size={16} /> List new stock
        </Button>
        <Button variant="secondary" onClick={onRefresh}>
          <Icon name="refresh" size={16} /> Refresh prices
        </Button>
        <Button variant="ghost" to="/portfolios">
          <Icon name="package" size={16} /> View portfolios
        </Button>
        <Button variant="ghost" to="/watchlist">
          <Icon name="star" size={16} /> View watchlists
        </Button>
        <Button variant="ghost" to="/dashboard">
          <Icon name="grid" size={16} /> Back to dashboard
        </Button>
      </Cluster>
    </Section>
  );
}