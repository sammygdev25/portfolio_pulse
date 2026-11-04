import { PageHeader, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface AdminStocksHeaderProps {
  userName?: string;
  onAddStock: () => void;
}

export default function AdminStocksHeader({ userName, onAddStock }: AdminStocksHeaderProps) {
  return (
    <PageHeader
      eyebrow="Admin"
      title="Stock Catalog"
      subtitle={
        userName
          ? `Welcome back, ${userName}. Manage tickers, sectors and keep current prices accurate for every investor on the platform.`
          : 'Manage tickers, sectors and keep current prices accurate for every investor on the platform.'
      }
      actions={
        <Button variant="primary" size="lg" onClick={onAddStock}>
          <Icon name="plus" size={18} />
          Add Stock
        </Button>
      }
    />
  );
}