import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../database';
import { authMiddleware, AuthRequest, requireRole } from '../middleware/auth';

const router = Router();

const createWatchlistItemSchema = z.object({
  stockId: z.number().int().positive(),
  targetPrice: z.number().nonnegative(),
});

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// GET /api/watchlist/ (authenticated - returns the current user's watchlist)
router.get('/', authMiddleware, requireRole('user'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const items = await prisma.watchlistItem.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      include: { stock: true },
    });
    res.json(items);
  } catch (error) {
    next(error);
  }
});

// POST /api/watchlist/ (authenticated)
router.post('/', authMiddleware, requireRole('user'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsed = createWatchlistItemSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const stock = await prisma.stock.findUnique({ where: { id: parsed.data.stockId } });
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    const existing = await prisma.watchlistItem.findFirst({
      where: { userId: req.userId, stockId: parsed.data.stockId },
    });
    if (existing) {
      return res.status(409).json({ error: 'Stock already in watchlist' });
    }

    const item = await prisma.watchlistItem.create({
      data: {
        userId: req.userId as number,
        stockId: parsed.data.stockId,
        targetPrice: parsed.data.targetPrice,
      },
      include: { stock: true },
    });
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/watchlist/:id (authenticated - only owner can remove)
router.delete('/:id', authMiddleware, requireRole('user'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  try {
    const item = await prisma.watchlistItem.findUnique({ where: { id: parsedParams.data.id } });
    if (!item) {
      return res.status(404).json({ error: 'WatchlistItem not found' });
    }
    if (item.userId !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await prisma.watchlistItem.delete({ where: { id: parsedParams.data.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;