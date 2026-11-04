import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // A seeded database is never seeded twice (the image runs this on every boot with SEED_DEMO=1).
  if ((await prisma.user.count()) > 0 && process.env.SEED_FORCE !== '1') {
    console.log('Seed skipped: the database already has users (SEED_FORCE=1 seeds anyway).');
    return;
  }

  // Create demo user
  // The demo password is this project's own (SEED_DEMO_PASSWORD in backend/.env, made at generation, never shipped):
  // no generated app shares a known password. Without it there are no demo accounts and no demo data.
  const demoPassword = process.env.SEED_DEMO_PASSWORD || '';
  if (!demoPassword) {
    console.warn('[seed] SEED_DEMO_PASSWORD is not set: no demo accounts and no demo data.');
    return;
  }
  const hashedPassword = await bcrypt.hash(demoPassword, 10);
  await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      username: 'demo',
      email: 'demo@example.com',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
    },
  });

  // The admin account, with its own password (SEED_ADMIN_PASSWORD in backend/.env); without it there is none.
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || '';
  if (adminPassword) {
    await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        username: 'admin',
        email: 'admin@example.com',
        password: await bcrypt.hash(adminPassword, 10),
        firstName: 'Demo',
        lastName: 'Admin',
        role: 'admin',
      },
    });
  }

  // Domain seed data
  const ids: Record<string, number[]> = {};
  const pick = (list: number[] | undefined, n: number): number => (list && list.length ? list[(n - 1) % list.length] : n);
  ids.User = (await prisma.user.findMany({ select: { id: true }, orderBy: { id: 'asc' } })).map((r) => r.id);
  try {
    await prisma.portfolio.create({ data: { userId: pick(ids.User, 1), name: 'Retirement Growth Fund' } });
    await prisma.portfolio.create({ data: { userId: pick(ids.User, 2), name: 'Tech Innovators Portfolio' } });
    await prisma.portfolio.create({ data: { userId: pick(ids.User, 3), name: 'Dividend Income Builder' } });
    await prisma.portfolio.create({ data: { userId: pick(ids.User, 4), name: 'Aggressive Growth Picks' } });
    await prisma.portfolio.create({ data: { userId: pick(ids.User, 5), name: 'Blue Chip Core Holdings' } });
    await prisma.portfolio.create({ data: { userId: pick(ids.User, 6), name: 'Green Energy Ventures' } });
    await prisma.portfolio.create({ data: { userId: pick(ids.User, 7), name: 'Healthcare Opportunities' } });
    await prisma.portfolio.create({ data: { userId: pick(ids.User, 8), name: 'International Diversification' } });
    await prisma.portfolio.create({ data: { userId: pick(ids.User, 9), name: 'Small Cap Speculation' } });
    await prisma.portfolio.create({ data: { userId: pick(ids.User, 10), name: 'College Savings Account' } });
    ids.Portfolio = (await prisma.portfolio.findMany({ select: { id: true }, orderBy: { id: 'asc' } })).map((r) => r.id);
  } catch (e) { console.warn('[seed] Portfolio skipped:', e); }
  try {
    await prisma.stock.create({ data: { ticker: 'AAPL', companyName: 'Apple Inc.', sector: 'Technology', currentPrice: 8.50 } });
    await prisma.stock.create({ data: { ticker: 'MSFT', companyName: 'Microsoft Corporation', sector: 'Technology 2', currentPrice: 12.00 } });
    await prisma.stock.create({ data: { ticker: 'JNJ', companyName: 'Johnson & Johnson', sector: 'Healthcare', currentPrice: 9.75 } });
    await prisma.stock.create({ data: { ticker: 'XOM', companyName: 'Exxon Mobil Corporation', sector: 'Energy', currentPrice: 14.50 } });
    ids.Stock = (await prisma.stock.findMany({ select: { id: true }, orderBy: { id: 'asc' } })).map((r) => r.id);
  } catch (e) { console.warn('[seed] Stock skipped:', e); }
  try {
    await prisma.transaction.create({ data: { portfolioId: pick(ids.Portfolio, 1), stockId: pick(ids.Stock, 3), transactionType: 'buy', shares: 1.5, pricePerShare: 8.50, fees: 8.50, transactionDate: new Date() } });
    await prisma.transaction.create({ data: { portfolioId: pick(ids.Portfolio, 2), stockId: pick(ids.Stock, 7), transactionType: 'sell', shares: 3.0, pricePerShare: 12.00, fees: 12.00, transactionDate: new Date() } });
    await prisma.transaction.create({ data: { portfolioId: pick(ids.Portfolio, 3), stockId: pick(ids.Stock, 6), transactionType: 'buy 3', shares: 4.5, pricePerShare: 9.75, fees: 9.75, transactionDate: new Date() } });
    await prisma.transaction.create({ data: { portfolioId: pick(ids.Portfolio, 4), stockId: pick(ids.Stock, 5), transactionType: 'buy 4', shares: 6.0, pricePerShare: 14.50, fees: 14.50, transactionDate: new Date() } });
    await prisma.transaction.create({ data: { portfolioId: pick(ids.Portfolio, 5), stockId: pick(ids.Stock, 1), transactionType: 'sell 5', shares: 7.5, pricePerShare: 6.25, fees: 6.25, transactionDate: new Date() } });
    await prisma.transaction.create({ data: { portfolioId: pick(ids.Portfolio, 6), stockId: pick(ids.Stock, 10), transactionType: 'buy 6', shares: 9.0, pricePerShare: 11.00, fees: 11.00, transactionDate: new Date() } });
    await prisma.transaction.create({ data: { portfolioId: pick(ids.Portfolio, 7), stockId: pick(ids.Stock, 8), transactionType: 'buy 7', shares: 10.5, pricePerShare: 15.75, fees: 15.75, transactionDate: new Date() } });
    await prisma.transaction.create({ data: { portfolioId: pick(ids.Portfolio, 8), stockId: pick(ids.Stock, 2), transactionType: 'sell 8', shares: 12.0, pricePerShare: 7.50, fees: 7.50, transactionDate: new Date() } });
    await prisma.transaction.create({ data: { portfolioId: pick(ids.Portfolio, 9), stockId: pick(ids.Stock, 4), transactionType: 'buy 9', shares: 13.5, pricePerShare: 13.25, fees: 13.25, transactionDate: new Date() } });
    await prisma.transaction.create({ data: { portfolioId: pick(ids.Portfolio, 10), stockId: pick(ids.Stock, 9), transactionType: 'buy 10', shares: 15.0, pricePerShare: 10.00, fees: 10.00, transactionDate: new Date() } });
    ids.Transaction = (await prisma.transaction.findMany({ select: { id: true }, orderBy: { id: 'asc' } })).map((r) => r.id);
  } catch (e) { console.warn('[seed] Transaction skipped:', e); }
  try {
    await prisma.watchlistItem.create({ data: { userId: pick(ids.User, 1), stockId: pick(ids.Stock, 1), targetPrice: 8.50 } });
    await prisma.watchlistItem.create({ data: { userId: pick(ids.User, 2), stockId: pick(ids.Stock, 2), targetPrice: 12.00 } });
    await prisma.watchlistItem.create({ data: { userId: pick(ids.User, 3), stockId: pick(ids.Stock, 3), targetPrice: 9.75 } });
    await prisma.watchlistItem.create({ data: { userId: pick(ids.User, 4), stockId: pick(ids.Stock, 4), targetPrice: 14.50 } });
    await prisma.watchlistItem.create({ data: { userId: pick(ids.User, 5), stockId: pick(ids.Stock, 5), targetPrice: 6.25 } });
    await prisma.watchlistItem.create({ data: { userId: pick(ids.User, 6), stockId: pick(ids.Stock, 6), targetPrice: 11.00 } });
    await prisma.watchlistItem.create({ data: { userId: pick(ids.User, 7), stockId: pick(ids.Stock, 7), targetPrice: 15.75 } });
    await prisma.watchlistItem.create({ data: { userId: pick(ids.User, 8), stockId: pick(ids.Stock, 8), targetPrice: 7.50 } });
    await prisma.watchlistItem.create({ data: { userId: pick(ids.User, 9), stockId: pick(ids.Stock, 9), targetPrice: 13.25 } });
    await prisma.watchlistItem.create({ data: { userId: pick(ids.User, 10), stockId: pick(ids.Stock, 10), targetPrice: 10.00 } });
    ids.WatchlistItem = (await prisma.watchlistItem.findMany({ select: { id: true }, orderBy: { id: 'asc' } })).map((r) => r.id);
  } catch (e) { console.warn('[seed] WatchlistItem skipped:', e); }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
