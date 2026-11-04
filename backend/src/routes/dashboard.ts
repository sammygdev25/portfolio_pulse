import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../database';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

interface StockAccumulator {
  stockId: number;
  ticker: string;
  companyName: string;
  sector: string;
  currentPrice: number;
  boughtShares: number;
  boughtCost: number;
  soldShares: number;
}

// GET /api/dashboard/ (authenticated)
router.get('/', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const portfolios = await prisma.portfolio.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        transactions: {
          include: { stock: true },
          orderBy: { transactionDate: 'desc' },
        },
      },
    });

    let totalValue = 0;
    let totalCost = 0;

    const portfolioSummaries = portfolios.map((portfolio) => {
      const stockMap = new Map<number, StockAccumulator>();

      for (const tx of portfolio.transactions) {
        const stock = tx.stock;
        let acc = stockMap.get(tx.stockId);
        if (!acc) {
          acc = {
            stockId: tx.stockId,
            ticker: stock.ticker,
            companyName: stock.companyName,
            sector: stock.sector,
            currentPrice: Number(stock.currentPrice),
            boughtShares: 0,
            boughtCost: 0,
            soldShares: 0,
          };
          stockMap.set(tx.stockId, acc);
        }
        const shares = Number(tx.shares);
        const pricePerShare = Number(tx.pricePerShare);
        const fees = Number(tx.fees);
        if (tx.transactionType === 'buy') {
          acc.boughtShares += shares;
          acc.boughtCost += shares * pricePerShare + fees;
        } else if (tx.transactionType === 'sell') {
          acc.soldShares += shares;
        }
      }

      let portfolioValue = 0;
      let portfolioCost = 0;

      for (const acc of stockMap.values()) {
        const netShares = acc.boughtShares - acc.soldShares;
        if (netShares <= 0) continue;
        const avgCost = acc.boughtShares > 0 ? acc.boughtCost / acc.boughtShares : 0;
        const costBasis = avgCost * netShares;
        const marketValue = netShares * acc.currentPrice;
        portfolioValue += marketValue;
        portfolioCost += costBasis;
      }

      const gain = portfolioValue - portfolioCost;
      const gainPercent = portfolioCost > 0 ? (gain / portfolioCost) * 100 : 0;

      totalValue += portfolioValue;
      totalCost += portfolioCost;

      return {
        id: portfolio.id,
        name: portfolio.name,
        value: portfolioValue,
        cost: portfolioCost,
        gain,
        gainPercent,
      };
    });

    // Aggregate holdings across all portfolios for allocation breakdowns
    const aggregateMap = new Map<number, StockAccumulator>();
    for (const portfolio of portfolios) {
      for (const tx of portfolio.transactions) {
        const stock = tx.stock;
        let acc = aggregateMap.get(tx.stockId);
        if (!acc) {
          acc = {
            stockId: tx.stockId,
            ticker: stock.ticker,
            companyName: stock.companyName,
            sector: stock.sector,
            currentPrice: Number(stock.currentPrice),
            boughtShares: 0,
            boughtCost: 0,
            soldShares: 0,
          };
          aggregateMap.set(tx.stockId, acc);
        }
        const shares = Number(tx.shares);
        const pricePerShare = Number(tx.pricePerShare);
        const fees = Number(tx.fees);
        if (tx.transactionType === 'buy') {
          acc.boughtShares += shares;
          acc.boughtCost += shares * pricePerShare + fees;
        } else if (tx.transactionType === 'sell') {
          acc.soldShares += shares;
        }
      }
    }

    const allocationByStock: { ticker: string; companyName: string; value: number; percent: number }[] = [];
    const sectorValues = new Map<string, number>();

    for (const acc of aggregateMap.values()) {
      const netShares = acc.boughtShares - acc.soldShares;
      if (netShares <= 0) continue;
      const marketValue = netShares * acc.currentPrice;
      allocationByStock.push({
        ticker: acc.ticker,
        companyName: acc.companyName,
        value: marketValue,
        percent: totalValue > 0 ? (marketValue / totalValue) * 100 : 0,
      });
      sectorValues.set(acc.sector, (sectorValues.get(acc.sector) || 0) + marketValue);
    }

    const allocationBySector = Array.from(sectorValues.entries()).map(([sector, value]) => ({
      sector,
      value,
      percent: totalValue > 0 ? (value / totalValue) * 100 : 0,
    }));

    allocationByStock.sort((a, b) => b.value - a.value);
    allocationBySector.sort((a, b) => b.value - a.value);

    const totalGain = totalValue - totalCost;
    const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

    const recentTransactions = portfolios
      .flatMap((portfolio) =>
        portfolio.transactions.map((tx) => ({
          id: tx.id,
          portfolioId: portfolio.id,
          portfolioName: portfolio.name,
          stockId: tx.stockId,
          ticker: tx.stock.ticker,
          companyName: tx.stock.companyName,
          transactionType: tx.transactionType,
          shares: Number(tx.shares),
          pricePerShare: Number(tx.pricePerShare),
          fees: Number(tx.fees),
          transactionDate: tx.transactionDate,
        }))
      )
      .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
      .slice(0, 10);

    res.json({
      totalValue,
      totalCost,
      totalGain,
      totalGainPercent,
      portfolios: portfolioSummaries,
      allocationBySector,
      allocationByStock,
      recentTransactions,
    });
  } catch (error) {
    next(error);
  }
});

export default router;