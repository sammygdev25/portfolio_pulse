import { Section, Button } from '../components/ui';
import { Icon } from '../components/icons';
import { useAuth } from '../contexts/AuthContext';

interface HomeCtaProps {
  title?: string;
  text?: string;
}

export default function HomeCta({
  title = 'Start tracking your portfolio today',
  text = 'Create a free account, build your portfolios, and watch your gains and losses update in real time.',
}: HomeCtaProps) {
  const { isAuthenticated } = useAuth();

  return (
    <Section tight>
      <div className="ds-hero" style={{ textAlign: 'center' }}>
        <h2>{title}</h2>
        <p className="ds-lead">{text}</p>
        <div className="ds-cluster" style={{ justifyContent: 'center' }}>
          <Button
            variant="primary"
            size="lg"
            to={isAuthenticated ? '/portfolios' : '/register'}
          >
            {isAuthenticated ? 'View my portfolios' : 'Sign up free'}
            <Icon name="arrow-right" size={18} />
          </Button>
        </div>
      </div>
    </Section>
  );
}