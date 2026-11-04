import type { Portfolio } from '../types';

interface PortfolioSelectorProps {
  portfolios: Portfolio[];
  selectedId: string;
  onChange: (id: string) => void;
}

function PortfolioSelector({ portfolios, selectedId, onChange }: PortfolioSelectorProps) {
  if (!portfolios || portfolios.length === 0) {
    return null;
  }

  return (
    <div className="ds-field" style={{ maxWidth: '280px' }}>
      <label className="ds-label" htmlFor="portfolio-selector">
        Portfolio
      </label>
      <select
        id="portfolio-selector"
        className="input"
        value={selectedId}
        onChange={(e) => onChange(e.target.value)}
      >
        {portfolios.map((portfolio) => (
          <option key={portfolio.id} value={String(portfolio.id)}>
            {portfolio.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export { PortfolioSelector };
export default PortfolioSelector;