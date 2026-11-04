import { Button } from '../components/ui';
import { Icon } from '../components/icons';

interface WatchlistPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function WatchlistPagination({ page, totalPages, onPageChange }: WatchlistPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="ds-pagination">
      <Button
        variant="ghost"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <Icon name="chevron-left" size={16} />
        Previous
      </Button>
      <span className="ds-muted">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="ghost"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
        <Icon name="chevron-right" size={16} />
      </Button>
    </div>
  );
}