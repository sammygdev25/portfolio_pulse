import { PageHeader, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface DashboardHeaderProps {
  userName?: string;
  onAddPortfolio?: () => void;
}

export default function DashboardHeader({ userName, onAddPortfolio }: DashboardHeaderProps) {
  const greeting = userName ? `Welcome back, ${userName}` : 'Welcome back';

  return (
    <PageHeader
      eyebrow="Dashboard"
      title={greeting}
      subtitle="Track your portfolio value, gains and losses, and allocation across every holding in one place."
      actions={
        onAddPortfolio ? (
          <Button variant="primary" size="lg" onClick={onAddPortfolio}>
            <Icon name="plus" size={18} />
            New portfolio
          </Button>
        ) : undefined
      }
    />
  );
}