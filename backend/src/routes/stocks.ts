import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../database';
import { authMiddleware, AuthRequest, requireStaff } from '../middleware/auth';

const router = Router();

const createStockSchema = z.object({
  ticker: z.string().min(1).max(10),
  companyName: z.string().min(1).max(200),
  sector: z.string().min(1).max(100),
  currentPrice: z.number().nonnegative(),
});

const updatePriceSchema = z.object({
  currentPrice: z.number().nonnegative(),
});

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

function serializeStock(stock: {
  id: number;
  ticker: string;
  companyName: string;
  sector: string;
  currentPrice: unknown;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: stock.id,
    ticker: stock.ticker,
    companyName: stock.companyName,
    sector: stock.sector,
    currentPrice: Number(stock.currentPrice),
    createdAt: stock.createdAt,
    updatedAt: stock.updatedAt,
  };
}

// GET /api/stocks/
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stocks = await prisma.stock.findMany({
      orderBy: { ticker: 'asc' },
    });
    res.json(stocks.map(serializeStock));
  } catch (error) {
    next(error);
  }
});

// GET /api/stocks/:id/
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  try {
    const stock = await prisma.stock.findUnique({ where: { id: parsedParams.data.id } });
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    res.json(serializeStock(stock));
  } catch (error) {
    next(error);
  }
});

// POST /api/stocks/ (staff only)
router.post('/', authMiddleware, requireStaff, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsed = createStockSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const existing = await prisma.stock.findFirst({ where: { ticker: parsed.data.ticker } });
    if (existing) {
      return res.status(409).json({ error: 'Stock with this ticker already exists' });
    }
    const stock = await prisma.stock.create({
      data: {
        ticker: parsed.data.ticker,
        companyName: parsed.data.companyName,
        sector: parsed.data.sector,
        currentPrice: parsed.data.currentPrice,
      },
    });
    res.status(201).json(serializeStock(stock));
  } catch (error) {
    next(error);
  }
});

// PATCH /api/stocks/:id/ (staff only) - update current price
router.patch('/:id', authMiddleware, requireStaff, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  const parsed = updatePriceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const stock = await prisma.stock.findUnique({ where: { id: parsedParams.data.id } });
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    const updated = await prisma.stock.update({
      where: { id: parsedParams.data.id },
      data: { currentPrice: parsed.data.currentPrice },
    });
    res.json(serializeStock(updated));
  } catch (error) {
    next(error);
  }
});

export default router;
