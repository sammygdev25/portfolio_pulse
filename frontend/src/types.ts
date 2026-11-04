/**
 * Auto-generated TypeScript types and Zod schemas from ProjectContract.
 * Model interfaces match the Django backend exactly.
 */
import { z } from 'zod';

// DRF returns a related object either as its pk or nested; parse both to the pk
// so the parsed type matches the number typed FK fields on the interfaces.
const zRelation = z.union([z.coerce.number().int(), z.object({ id: z.coerce.number().int() }).passthrough()]).transform((v) => (typeof v === 'number' ? v : v.id));

// ── User ──
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  portfolios?: Portfolio[];
  watchlistItems?: WatchlistItem[];
  firstName?: string | null;
  lastName?: string | null;
  isActive?: boolean;
}

export const UserSchema = z.object({
  id: z.coerce.number(),
  username: z.string(),
  email: z.string().email(),
  role: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  portfolios: z.array(z.custom<Portfolio>((v) => typeof v === 'object' && v !== null)).optional(),
  watchlistItems: z.array(z.custom<WatchlistItem>((v) => typeof v === 'object' && v !== null)).optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
}).passthrough();

// ── Portfolio ──
export interface Portfolio {
  id: number;
  user?: User;
  userId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  transactions?: Transaction[];
}

export const PortfolioSchema = z.object({
  id: z.coerce.number(),
  user: z.custom<User>((v) => typeof v === 'object' && v !== null).optional(),
  userId: z.coerce.number().int(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  transactions: z.array(z.custom<Transaction>((v) => typeof v === 'object' && v !== null)).optional(),
}).passthrough();

// ── Stock ──
export interface Stock {
  id: number;
  ticker: string;
  companyName: string;
  sector: string;
  currentPrice: number;
  createdAt: string;
  updatedAt: string;
  transactions?: Transaction[];
  watchlistItems?: WatchlistItem[];
}

export const StockSchema = z.object({
  id: z.coerce.number(),
  ticker: z.string(),
  companyName: z.string(),
  sector: z.string(),
  currentPrice: z.coerce.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  transactions: z.array(z.custom<Transaction>((v) => typeof v === 'object' && v !== null)).optional(),
  watchlistItems: z.array(z.custom<WatchlistItem>((v) => typeof v === 'object' && v !== null)).optional(),
}).passthrough();

// ── Transaction ──
export interface Transaction {
  id: number;
  portfolio?: Portfolio;
  portfolioId: number;
  stock?: Stock;
  stockId: number;
  transactionType: string;
  shares: number;
  pricePerShare: number;
  fees: number;
  transactionDate: string;
  createdAt: string;
  updatedAt?: string;
}

export const TransactionSchema = z.object({
  id: z.coerce.number(),
  portfolio: z.custom<Portfolio>((v) => typeof v === 'object' && v !== null).optional(),
  portfolioId: z.coerce.number().int(),
  stock: z.custom<Stock>((v) => typeof v === 'object' && v !== null).optional(),
  stockId: z.coerce.number().int(),
  transactionType: z.string(),
  shares: z.coerce.number(),
  pricePerShare: z.coerce.number(),
  fees: z.coerce.number(),
  transactionDate: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
}).passthrough();

// ── WatchlistItem ──
export interface WatchlistItem {
  id: number;
  user?: User;
  userId: number;
  stock?: Stock;
  stockId: number;
  targetPrice: number;
  createdAt: string;
  updatedAt: string;
}

export const WatchlistItemSchema = z.object({
  id: z.coerce.number(),
  user: z.custom<User>((v) => typeof v === 'object' && v !== null).optional(),
  userId: z.coerce.number().int(),
  stock: z.custom<Stock>((v) => typeof v === 'object' && v !== null).optional(),
  stockId: z.coerce.number().int(),
  targetPrice: z.coerce.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
}).passthrough();

// ── Paginated Response ──
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    count: z.coerce.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(itemSchema),
  });

