import { Icon } from './icons';

interface DashboardSummaryCardProps {
  label: string;
  value: string;
  changePercent: number;
  changeAmount: number;
}

function DashboardSummaryCard({ label, value, changePercent, changeAmount }: DashboardSummaryCardProps) {
  const isPositive = changeAmount >= 0;
  const toneColor = isPositive ? 'var(--color-success)' : 'var(--color-danger)';
  const formattedChangeAmount = `${isPositive ? '+' : ''}$${Math.abs(changeAmount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  const formattedChangePercent = `${isPositive ? '+' : ''}${Number(changePercent || 0).toFixed(2)}%`;

  return (
    <div className="ds-card ds-card-body">
      <div className="ds-card-meta">{label}</div>
      <div
        style={{
          fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
          fontSize: '1.8rem',
          fontWeight: 600,
          color: 'var(--color-text)',
          marginTop: '0.25rem',
        }}
      >
        {value}
      </div>
      <div className="ds-cluster" style={{ alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', color: toneColor }}>
        <Icon name={isPositive ? 'chevron-right' : 'chevron-left'} size={14} />
        <span style={{ fontWeight: 600 }}>{formattedChangeAmount}</span>
        <span className="ds-small" style={{ color: toneColor }}>
          ({formattedChangePercent})
        </span>
      </div>
    </div>
  );
}

export default DashboardSummaryCard;
export { DashboardSummaryCard };