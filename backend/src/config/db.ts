import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger.js';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully via Prisma Client');
  } catch (error) {
    logger.error('Failed to connect to PostgreSQL database:', error);
    process.exit(1);
  }
};
