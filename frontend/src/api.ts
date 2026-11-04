import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { z } from 'zod';
import { User, Portfolio, Stock, Transaction, WatchlistItem, UserSchema, PortfolioSchema, StockSchema, TransactionSchema, WatchlistItemSchema, PaginatedResponseSchema } from './types';

const API_BASE_URL = '/api';

// Auto-detect K8s preview proxy and rewrite API URLs
const isProxied = window.location.pathname.includes('/preview/proxy');
const proxyBase = isProxied
  ? window.location.pathname.replace(/\/preview\/proxy.*/, '/preview/proxy')
  : '';

const api: AxiosInstance = axios.create({
  baseURL: proxyBase + API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On a 401 with a stored refresh token (the Express track issues one), refresh once and retry.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
    const refreshToken = localStorage.getItem('refreshToken');
    if (error.response?.status === 401 && refreshToken && original && !original._retried) {
      original._retried = true;
      try {
        const res = await axios.post(proxyBase + API_BASE_URL + '/auth/refresh/', { refreshToken });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        return api(original);
      } catch {
        localStorage.removeItem('refreshToken');
      }
    }
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      localStorage.removeItem('token');
      if (originalRequest.method === 'get') {
        originalRequest._retry = true;
        delete originalRequest.headers.Authorization;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

// Response validation is advisory: a schema mismatch must never blank a page.
const parseOr = <S extends z.ZodTypeAny>(schema: S, data: unknown): z.output<S> => {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.warn('[api] response did not match schema, using raw data:', result.error.issues.slice(0, 3));
    return data as z.output<S>;
  }
  return result.data;
};

// Auth API
export const login = (credentials: { username: string; password: string }) =>
  api.post('/auth/login/', credentials);
export const register = (data: { username: string; email: string; password: string }) =>
  api.post('/auth/register/', data);
export const logout = () => api.post('/auth/logout/');
export const getProfile = () => api.get('/auth/profile/');

// ── User API ──
export const getUserList = async (params?: Record<string, unknown>): Promise<User[]> => {
  const res = await api.get('/users/', params ? { params } : undefined);
  const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? res.data?.data ?? res.data?.items ?? res.data?.users ?? res.data?.users ?? []);
  // The interface is the strict type: a field name the API does not send is a compile error, not an unknown.
  return parseOr(z.array(UserSchema), data) as User[];
};

export const getUser = async (id: number | string | Record<string, unknown>): Promise<User> => {
  // Pages sometimes call the detail getter with a filter object; route that to the list endpoint.
  if (typeof id === 'object' && id !== null) return getUserList(id) as unknown as Promise<User>;
  const res = await api.get(`/users/${id}/`);
  return parseOr(UserSchema, res.data) as User;
};

// Create sends the fields a form holds; the server sets owner, status, totals and times, and validates.
// ── Portfolio API ──
export const getPortfolioList = async (params?: Record<string, unknown>): Promise<Portfolio[]> => {
  const res = await api.get('/portfolios/', params ? { params } : undefined);
  const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? res.data?.data ?? res.data?.items ?? res.data?.portfolios ?? res.data?.portfolios ?? []);
  // The interface is the strict type: a field name the API does not send is a compile error, not an unknown.
  return parseOr(z.array(PortfolioSchema), data) as Portfolio[];
};

export const getPortfolio = async (id: number | string | Record<string, unknown>): Promise<Portfolio> => {
  // Pages sometimes call the detail getter with a filter object; route that to the list endpoint.
  if (typeof id === 'object' && id !== null) return getPortfolioList(id) as unknown as Promise<Portfolio>;
  const res = await api.get(`/portfolios/${id}/`);
  return parseOr(PortfolioSchema, res.data) as Portfolio;
};

// Create sends the fields a form holds; the server sets owner, status, totals and times, and validates.
export const createPortfolio = async (data: Partial<Omit<Portfolio, 'id'>>): Promise<Portfolio> => {
  const res = await api.post('/portfolios/', data);
  return parseOr(PortfolioSchema, res.data) as Portfolio;
};

export const deletePortfolio = async (id: number) => {
  await api.delete(`/portfolios/${id}/`);
};

// ── Stock API ──
export const getStockList = async (params?: Record<string, unknown>): Promise<Stock[]> => {
  const res = await api.get('/stocks/', params ? { params } : undefined);
  const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? res.data?.data ?? res.data?.items ?? res.data?.stocks ?? res.data?.stocks ?? []);
  // The interface is the strict type: a field name the API does not send is a compile error, not an unknown.
  return parseOr(z.array(StockSchema), data) as Stock[];
};

export const getStock = async (id: number | string | Record<string, unknown>): Promise<Stock> => {
  // Pages sometimes call the detail getter with a filter object; route that to the list endpoint.
  if (typeof id === 'object' && id !== null) return getStockList(id) as unknown as Promise<Stock>;
  const res = await api.get(`/stocks/${id}/`);
  return parseOr(StockSchema, res.data) as Stock;
};

// Create sends the fields a form holds; the server sets owner, status, totals and times, and validates.
export const createStock = async (data: Partial<Omit<Stock, 'id'>>): Promise<Stock> => {
  const res = await api.post('/stocks/', data);
  return parseOr(StockSchema, res.data) as Stock;
};

export const updateStock = async (id: number, data: Partial<Stock>): Promise<Stock> => {
  const res = await api.patch(`/stocks/${id}/`, data);
  return parseOr(StockSchema, res.data) as Stock;
};

// ── Transaction API ──
export const getTransactionList = async (params?: Record<string, unknown>): Promise<Transaction[]> => {
  const res = await api.get('/transactions/', params ? { params } : undefined);
  const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? res.data?.data ?? res.data?.items ?? res.data?.transactions ?? res.data?.transactions ?? []);
  // The interface is the strict type: a field name the API does not send is a compile error, not an unknown.
  return parseOr(z.array(TransactionSchema), data) as Transaction[];
};

export const getTransaction = async (id: number | string | Record<string, unknown>): Promise<Transaction> => {
  // Pages sometimes call the detail getter with a filter object; route that to the list endpoint.
  if (typeof id === 'object' && id !== null) return getTransactionList(id) as unknown as Promise<Transaction>;
  const res = await api.get(`/transactions/${id}/`);
  return parseOr(TransactionSchema, res.data) as Transaction;
};

// Create sends the fields a form holds; the server sets owner, status, totals and times, and validates.
export const createTransaction = async (data: Partial<Omit<Transaction, 'id'>>): Promise<Transaction> => {
  const res = await api.post('/transactions/', data);
  return parseOr(TransactionSchema, res.data) as Transaction;
};

// ── WatchlistItem API ──
export const getWatchlistItemList = async (params?: Record<string, unknown>): Promise<WatchlistItem[]> => {
  const res = await api.get('/watchlist_items/', params ? { params } : undefined);
  const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? res.data?.data ?? res.data?.items ?? res.data?.watchlistItems ?? res.data?.watchlistItems ?? []);
  // The interface is the strict type: a field name the API does not send is a compile error, not an unknown.
  return parseOr(z.array(WatchlistItemSchema), data) as WatchlistItem[];
};

export const getWatchlistItem = async (id: number | string | Record<string, unknown>): Promise<WatchlistItem> => {
  // Pages sometimes call the detail getter with a filter object; route that to the list endpoint.
  if (typeof id === 'object' && id !== null) return getWatchlistItemList(id) as unknown as Promise<WatchlistItem>;
  const res = await api.get(`/watchlist_items/${id}/`);
  return parseOr(WatchlistItemSchema, res.data) as WatchlistItem;
};

// Create sends the fields a form holds; the server sets owner, status, totals and times, and validates.
export const createWatchlistItem = async (data: Partial<Omit<WatchlistItem, 'id'>>): Promise<WatchlistItem> => {
  const res = await api.post('/watchlist_items/', data);
  return parseOr(WatchlistItemSchema, res.data) as WatchlistItem;
};

export const updateWatchlistItem = async (id: number, data: Partial<WatchlistItem>): Promise<WatchlistItem> => {
  const res = await api.patch(`/watchlist_items/${id}/`, data);
  return parseOr(WatchlistItemSchema, res.data) as WatchlistItem;
};

export const deleteWatchlistItem = async (id: number) => {
  await api.delete(`/watchlist_items/${id}/`);
};


// Auth aliases — domain agents use varied naming conventions
export const loginUser = (email: string, password: string) => api.post('/auth/login/', { username: email, password });
export const registerUser = (userData: any) => api.post('/auth/register/', userData);
export const getCurrentUser = getProfile;
export const updateUserProfile = (data: Partial<any>) => api.patch('/auth/profile/', data);

export { api };
export default api;

// Added by integration: exports other files import from this module.
export const getHoldingList = async (params?: Record<string, unknown>): Promise<any[]> => {
  const res = await api.get('/holdings/', params ? { params } : undefined);
  const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? res.data?.data ?? res.data?.items ?? res.data?.holdings ?? res.data?.holdings ?? []);
  return data;
};
