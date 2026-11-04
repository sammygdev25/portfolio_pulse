import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { getPortfolioList, createPortfolio, getPortfolio } from '../api';
import type { Portfolio } from '../types';

interface PortfolioContextType {
  portfolios: Portfolio[];
  selectedPortfolioId: string | null;
  loading: boolean;
  fetchPortfolios: () => Promise<void>;
  selectPortfolio: (id: string | null) => void;
  addPortfolio: (data: { name: string }) => Promise<Portfolio>;
  refreshPortfolio: (id: string) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPortfolios = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPortfolioList();
      setPortfolios(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectPortfolio = useCallback((id: string | null) => {
    setSelectedPortfolioId(id);
  }, []);

  const addPortfolio = useCallback(async (data: { name: string }) => {
    const created = await createPortfolio(data);
    setPortfolios((prev) => [created, ...prev]);
    return created;
  }, []);

  const refreshPortfolio = useCallback(async (id: string) => {
    try {
      const updated = await getPortfolio(id);
      setPortfolios((prev) => prev.map((p) => (String(p.id) === String(id) ? updated : p)));
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        portfolios,
        selectedPortfolioId,
        loading,
        fetchPortfolios,
        selectPortfolio,
        addPortfolio,
        refreshPortfolio,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within a PortfolioProvider');
  return ctx;
};
