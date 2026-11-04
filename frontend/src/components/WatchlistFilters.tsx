import { Section } from '../components/ui';
import { Icon } from '../components/icons';

interface WatchlistFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sector: string;
  onSectorChange: (value: string) => void;
  sectors: string[];
  sortBy: string;
  onSortChange: (value: string) => void;
}

export default function WatchlistFilters({
  search,
  onSearchChange,
  sector,
  onSectorChange,
  sectors,
  sortBy,
  onSortChange,
}: WatchlistFiltersProps) {
  return (
    <Section tight>
      <div className="ds-filters">
        <div className="ds-field">
          <label className="ds-label" htmlFor="watchlist-search">
            Search
          </label>
          <div className="ds-cluster">
            <Icon name="search" size={16} />
            <input
              id="watchlist-search"
              className="input"
              type="text"
              placeholder="Search by ticker or company name..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="watchlist-sector">
            Sector
          </label>
          <select
            id="watchlist-sector"
            className="input"
            value={sector}
            onChange={(e) => onSectorChange(e.target.value)}
          >
            <option value="">All sectors</option>
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="watchlist-sort">
            Sort by
          </label>
          <select
            id="watchlist-sort"
            className="input"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="recent">Recently added</option>
            <option value="ticker">Ticker (A-Z)</option>
            <option value="target_price">Target price</option>
            <option value="distance">Distance to target</option>
          </select>
        </div>
      </div>
    </Section>
  );
}