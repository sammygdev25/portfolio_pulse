import { useEffect, useState } from 'react';
import HomeHero from '../components/HomeHero';
import HomeFeatured from '../components/HomeFeatured';
import HomeCategories from '../components/HomeCategories';
import HomeAbout from '../components/HomeAbout';
import HomeCta from '../components/HomeCta';
import { getStockList } from '../api';
import type { Stock } from '../types';

export default function HomePage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getStockList();
        if (active) setStocks(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="ds-stack-lg">
      <HomeHero imageUrl="/img/brand/hero.jpg" />
      <HomeFeatured stocks={stocks.slice(0, 8).map((s: any) => (s.sector === 'Technology 2' || s.category === 'Technology 2') ? { ...s, sector: 'Technology', category: 'Technology' } : s)} loading={loading} />
      <HomeCategories />
      <HomeAbout />
      <HomeCta />
    </div>
  );
}