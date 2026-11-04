import { Hero, Button, Media } from '../components/ui';
import { Icon } from '../components/icons';

interface HomeHeroProps {
  imageUrl?: string;
}

export default function HomeHero({ imageUrl = '/img/brand/hero.jpg' }: HomeHeroProps) {
  return (
    <Hero
      eyebrow="Portfolio Tracking"
      title="Track every share, every gain, in one place"
      text="Monitor your buy and sell transactions across multiple portfolios, watch sector allocations shift in real time, and keep an eye on the stocks you're not holding yet. Built for investors who want clarity on performance without the spreadsheet."
      actions={
        <>
          <Button variant="primary" size="lg" to="/portfolios">
            View Portfolios
            <Icon name="arrow-right" size={18} />
          </Button>
          <Button variant="ghost" size="lg" to="/watchlist">
            Browse Watchlist
          </Button>
        </>
      }
      media={imageUrl ? <Media src={imageUrl} alt="Portfolio performance overview" ratio="wide" /> : undefined}
    />
  );
}
