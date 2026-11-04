import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../database';
import { authMiddleware, AuthRequest, requireRole } from '../middleware/auth';

const router = Router();

const createPortfolioSchema = z.object({
  name: z.string().min(1).max(200),
});

const updatePortfolioSchema = z.object({
  name: z.string().min(1).max(200),
});

const idParamSchema = z.coerce.number().int().positive();

// GET /api/portfolios/ (authenticated - returns the current user's portfolios)
router.get('/', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const portfolios = await prisma.portfolio.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        transactions: {
          include: { stock: true },
        },
      },
    });
    res.json(portfolios);
  } catch (error) {
    next(error);
  }
});

// GET /api/portfolios/:id (authenticated - owner only)
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsedId = idParamSchema.safeParse(req.params.id);
  if (!parsedId.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedId.error.issues });
  }
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: parsedId.data },
      include: {
        transactions: {
          orderBy: { transactionDate: 'desc' },
          include: { stock: true },
        },
      },
    });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    if (portfolio.userId !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json(portfolio);
  } catch (error) {
    next(error);
  }
});

// POST /api/portfolios/ (authenticated)
router.post('/', authMiddleware, requireRole('user'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsed = createPortfolioSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const portfolio = await prisma.portfolio.create({
      data: {
        name: parsed.data.name,
        userId: req.userId!,
      },
    });
    res.status(201).json(portfolio);
  } catch (error) {
    next(error);
  }
});

// PUT /api/portfolios/:id (authenticated - owner only)
router.put('/:id', authMiddleware, requireRole('user'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsedId = idParamSchema.safeParse(req.params.id);
  if (!parsedId.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedId.error.issues });
  }
  const parsed = updatePortfolioSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const existing = await prisma.portfolio.findUnique({ where: { id: parsedId.data } });
    if (!existing) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    if (existing.userId !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const portfolio = await prisma.portfolio.update({
      where: { id: parsedId.data },
      data: { name: parsed.data.name },
    });
    res.json(portfolio);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/portfolios/:id (authenticated - owner only)
router.delete('/:id', authMiddleware, requireRole('user'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsedId = idParamSchema.safeParse(req.params.id);
  if (!parsedId.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedId.error.issues });
  }
  try {
    const existing = await prisma.portfolio.findUnique({ where: { id: parsedId.data } });
    if (!existing) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    if (existing.userId !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await prisma.portfolio.delete({ where: { id: parsedId.data } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;