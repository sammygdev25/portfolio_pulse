import { Section, Split, Card, CardBody, Stack } from '../components/ui';
import { Icon } from '../components/icons';
import type { IconName } from '../components/icons';

interface ValuePoint {
  icon: IconName;
  title: string;
  text: string;
}

interface HomeAboutProps {
  valuePoints?: ValuePoint[];
}

const defaultValuePoints: ValuePoint[] = [
  {
    icon: 'shield',
    title: 'Your data, protected',
    text: 'Every portfolio and transaction stays tied to your account, guarded by secure authentication from day one.',
  },
  {
    icon: 'grid',
    title: 'Built for clarity',
    text: 'Allocation breakdowns and gain/loss summaries turn rows of trades into a dashboard you can actually read.',
  },
  {
    icon: 'bell',
    title: 'Stay on target',
    text: 'Watchlists with target prices mean you never lose track of a stock you are waiting to buy or sell.',
  },
];

export default function HomeAbout({ valuePoints = defaultValuePoints }: HomeAboutProps) {
  return (
    <Section
      eyebrow="Why Portfolio Pulse"
      title="A clear view of every position you hold"
      subtitle="Built for investors who want more than a spreadsheet."
    >
      <Split>
        <Stack gap="md">
          <p className="ds-lead">
            Portfolio Pulse was built to answer one question quickly: how are my investments actually doing?
            Track buy and sell transactions across as many portfolios as you need, and let the numbers roll
            up into one dashboard.
          </p>
          <p className="ds-muted">
            Behind every ticker sits a current price kept current by our admin team, so your total value,
            gains and losses reflect the market, not a stale snapshot. Add stocks to a watchlist with a
            target price, and check back whenever you like to see how close you are.
          </p>
          <p className="ds-muted">
            No noise, no ads, no trading execution &mdash; just the data you need to understand what you own
            and why it matters.
          </p>
        </Stack>
        <Stack gap="sm">
          {valuePoints.map((point) => (
            <Card key={point.title}>
              <CardBody>
                <Stack gap="xs">
                  <Icon name={point.icon} size={22} title={point.title} />
                  <h3 className="ds-card-title">{point.title}</h3>
                  <p className="ds-muted ds-small">{point.text}</p>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </Stack>
      </Split>
    </Section>
  );
}