import { useState, useEffect, useCallback, useMemo } from 'react';
import { getWatchlistItemList, getStockList, api } from '../api';
import type { WatchlistItem, Stock } from '../types';
import WatchlistHeader from '../components/WatchlistHeader';
import WatchlistFilters from '../components/WatchlistFilters';
import WatchlistGrid from '../components/WatchlistGrid';
import WatchlistPagination from '../components/WatchlistPagination';
import WatchlistForm from '../components/WatchlistForm';
import { Button, Alert } from '../components/ui';

const PAGE_SIZE = 9;

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('');
  const [sortBy, setSortBy] = useState('ticker');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const loadItems = useCallback(async () => {
    try {
      const data = await getWatchlistItemList();
      setItems(data);
    } catch (err) {
      console.error(err);
      setError('Could not load your watchlist. Please try again.');
    }
  }, []);

  const loadStocks = useCallback(async () => {
    try {
      const data = await getStockList();
      setStocks(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([loadItems(), loadStocks()]).finally(() => setLoading(false));
  }, [loadItems, loadStocks]);

  const sectors = useMemo(() => {
    const set = new Set<string>();
    stocks.forEach((s) => {
      if (s.sector) set.add(s.sector);
    });
    return Array.from(set).sort();
  }, [stocks]);

  const filtered = useMemo(() => {
    let rows = [...items];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter((item) => {
        const ticker = item.stock?.ticker?.toLowerCase() ?? '';
        const name = item.stock?.companyName?.toLowerCase() ?? '';
        return ticker.includes(q) || name.includes(q);
      });
    }
    if (sector) {
      rows = rows.filter((item) => item.stock?.sector === sector);
    }
    rows.sort((a, b) => {
      if (sortBy === 'ticker') {
        return (a.stock?.ticker ?? '').localeCompare(b.stock?.ticker ?? '');
      }
      if (sortBy === 'targetPrice') {
        return Number(b.targetPrice) - Number(a.targetPrice);
      }
      if (sortBy === 'currentPrice') {
        return Number(b.stock?.currentPrice ?? 0) - Number(a.stock?.currentPrice ?? 0);
      }
      return 0;
    });
    return rows;
  }, [items, search, sector, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const handleRemove = async (id: number) => {
    try {
      await api.delete(`/watchlist/${id}/`);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setError('Could not remove this stock. Please try again.');
    }
  };

  const handleAdded = async () => {
    setShowForm(false);
    await loadItems();
  };

  return (
    <div className="ds-stack-lg">
      <WatchlistHeader count={filtered.length} loading={loading} />

      {error && <Alert tone="danger">{error}</Alert>}

      <div className="ds-cluster" style={{ justifyContent: 'flex-end' }}>
        <Button variant={showForm ? 'ghost' : 'primary'} onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : 'Add stock to watchlist'}
        </Button>
      </div>

      {showForm && <WatchlistForm stocks={stocks} onSubmit={handleAdded} />}

      <WatchlistFilters
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        sector={sector}
        onSectorChange={(v) => {
          setSector(v);
          setPage(1);
        }}
        sectors={sectors}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <WatchlistGrid
        items={pageItems}
        loading={loading}
        onRemove={handleRemove}
        onAddClick={() => setShowForm(true)}
      />

      <WatchlistPagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}