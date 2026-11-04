import { Section, Grid, Card, CardBody, CardTitle, CardMeta } from '../components/ui';
import { Icon, IconName } from '../components/icons';

export interface HomeCategory {
  slug: string;
  name: string;
  description: string;
  icon: IconName;
}

interface HomeCategoriesProps {
  categories?: HomeCategory[];
}

const DEFAULT_CATEGORIES: HomeCategory[] = [
  {
    slug: 'technology',
    name: 'Technology',
    description: 'Software, hardware and semiconductor holdings',
    icon: 'sparkle',
  },
  {
    slug: 'healthcare',
    name: 'Healthcare',
    description: 'Pharma, biotech and medical device stocks',
    icon: 'shield',
  },
  {
    slug: 'financials',
    name: 'Financials',
    description: 'Banks, insurers and asset managers',
    icon: 'dollar',
  },
  {
    slug: 'energy',
    name: 'Energy',
    description: 'Oil, gas and renewable power companies',
    icon: 'refresh',
  },
  {
    slug: 'consumer',
    name: 'Consumer',
    description: 'Retail, staples and discretionary brands',
    icon: 'cart',
  },
  {
    slug: 'industrials',
    name: 'Industrials',
    description: 'Manufacturing, aerospace and logistics names',
    icon: 'truck',
  },
];

export default function HomeCategories({ categories = DEFAULT_CATEGORIES }: HomeCategoriesProps) {
  return (
    <Section
      eyebrow="Browse"
      title="Browse by sector"
      subtitle="Jump into stocks grouped by sector to build a diversified portfolio."
    >
      <Grid size="sm">
        {categories.map((category) => (
          <Card key={category.slug} to={`/?category=${category.slug}`}>
            <CardBody>
              <Icon name={category.icon} size={24} />
              <CardTitle>{category.name}</CardTitle>
              <CardMeta>{category.description}</CardMeta>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}