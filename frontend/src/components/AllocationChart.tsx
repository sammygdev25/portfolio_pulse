import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface AllocationDataPoint {
  name: string;
  value: number;
}

interface AllocationChartProps {
  data: AllocationDataPoint[];
  title: string;
}

const COLORS = [
  '#2dd4a7',
  '#5b8def',
  '#f0556b',
  '#e4b74b',
  '#9b8df0',
  '#4bc0d9',
  '#e48b4b',
  '#8b96a8',
];

function AllocationChart({ data, title }: AllocationChartProps) {
  const hasData = Array.isArray(data) && data.length > 0 && data.some((d) => d.value > 0);

  return (
    <div className="ds-card ds-card-body">
      <h3 className="ds-card-title" style={{ marginBottom: '1rem' }}>
        {title}
      </h3>
      {!hasData ? (
        <p className="ds-muted ds-small">No allocation data yet. Buy shares in a portfolio to see the breakdown.</p>
      ) : (
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} stroke="var(--color-surface)" />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, 'Value']}
                contentStyle={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  color: 'var(--color-text)',
                }}
                itemStyle={{ color: 'var(--color-text)' }}
              />
              <Legend
                formatter={(value: string) => <span style={{ color: 'var(--color-text-secondary)' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export { AllocationChart };
export default AllocationChart;