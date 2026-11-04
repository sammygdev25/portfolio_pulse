import { Section, Cluster, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface DashboardActionsProps {
  isAdmin?: boolean;
}

export default function DashboardActions({ isAdmin = false }: DashboardActionsProps) {
  return (
    <Section eyebrow="Quick actions" title="Manage your investments" tight>
      <Cluster gap="md" >
        <Button to="/portfolios" variant="primary">
          <Icon name="package" size={18} /> View portfolios
        </Button>
        <Button to="/portfolios" variant="secondary">
          <Icon name="plus" size={18} /> New transaction
        </Button>
        <Button to="/watchlist" variant="secondary">
          <Icon name="star" size={18} /> Go to watchlist
        </Button>
        {isAdmin && (
          <Button to="/staff/stocks" variant="ghost">
            <Icon name="settings" size={18} /> Manage stock prices
          </Button>
        )}
        <Button to="/profile" variant="ghost">
          <Icon name="user" size={18} /> Account settings
        </Button>
      </Cluster>
    </Section>
  );
}