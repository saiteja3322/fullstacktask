import { prisma } from '../config/db.js';
import { IPaginationQuery } from '../interfaces/query.interface.js';
import { MovementType } from '@prisma/client';

export class InventoryRepository {
  static async createMovement(data: {
    productId: string;
    quantity: number;
    movementType: MovementType;
    reason?: string;
    createdBy: string;
  }) {
    return prisma.stockMovement.create({
      data,
      include: {
        product: { select: { id: true, name: true, sku: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  static async findMovements(query: IPaginationQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const { movementType, search } = query;

    const where: any = {};

    if (movementType) {
      where.movementType = movementType as MovementType;
    }

    if (search) {
      where.product = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const [data, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          product: { select: { id: true, name: true, sku: true, warehouse: true } },
          user: { select: { id: true, name: true } },
        },
      }),
      prisma.stockMovement.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
