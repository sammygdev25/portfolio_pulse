import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../database';
import { authMiddleware, AuthRequest, requireRole } from '../middleware/auth';

const router = Router();

const idParamSchema = z.coerce.number().int().positive();

const createTransactionSchema = z.object({
  portfolioId: z.number().int().positive(),
  stockId: z.number().int().positive(),
  transactionType: z.enum(['buy', 'sell']),
  shares: z.number().positive(),
  pricePerShare: z.number().nonnegative(),
  fees: z.number().nonnegative().optional(),
  transactionDate: z.coerce.date(),
});

const listQuerySchema = z.object({
  portfolioId: z.coerce.number().int().positive().optional(),
});

// GET /api/transactions/ (authenticated) - list transactions for the user's portfolios
router.get('/', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid query', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const { portfolioId } = parsed.data;

    if (portfolioId) {
      const portfolio = await prisma.portfolio.findUnique({ where: { id: portfolioId } });
      if (!portfolio || portfolio.userId !== req.userId) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        portfolio: {
          userId: req.userId,
          ...(portfolioId ? { id: portfolioId } : {}),
        },
      },
      include: { stock: true },
      orderBy: { transactionDate: 'desc' },
    });
    res.json(transactions);
  } catch (error) {
    next(error);
  }
});

// POST /api/transactions/ (authenticated)
router.post('/', authMiddleware, requireRole('user'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsed = createTransactionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const { portfolioId, stockId, transactionType, shares, pricePerShare, fees, transactionDate } = parsed.data;

    const portfolio = await prisma.portfolio.findUnique({ where: { id: portfolioId } });
    if (!portfolio || portfolio.userId !== req.userId) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    const stock = await prisma.stock.findUnique({ where: { id: stockId } });
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    if (transactionType === 'sell') {
      const existing = await prisma.transaction.findMany({
        where: { portfolioId, stockId },
      });
      let heldShares = 0;
      for (const t of existing) {
        const qty = Number(t.shares);
        heldShares += t.transactionType === 'buy' ? qty : -qty;
      }
      if (shares > heldShares) {
        return res.status(400).json({
          error: 'Cannot sell more shares than currently held',
          code: 'validation_error',
        });
      }
    }

    const transaction = await prisma.transaction.create({
      data: {
        portfolioId,
        stockId,
        transactionType,
        shares,
        pricePerShare,
        fees: fees ?? 0,
        transactionDate,
      },
      include: { stock: true },
    });
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
});

// GET /api/transactions/:id (authenticated)
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsedId = idParamSchema.safeParse(req.params.id);
  if (!parsedId.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedId.error.issues });
  }
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: parsedId.data },
      include: { stock: true, portfolio: true },
    });
    if (!transaction || transaction.portfolio.userId !== req.userId) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    next(error);
  }
});

export default router;