import { prisma } from '../config/db.js';
import { IPaginationQuery } from '../interfaces/query.interface.js';

export class ProductRepository {
  static async findAll(query: IPaginationQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const { search, category, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.product.count({ where }),
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

  static async findById(id: string) {
    return prisma.product.findUnique({ where: { id } });
  }

  static async findBySku(sku: string) {
    return prisma.product.findUnique({ where: { sku } });
  }

  static async create(data: any) {
    return prisma.product.create({ data });
  }

  static async update(id: string, data: any) {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.product.delete({ where: { id } });
  }

  static async findLowStock() {
    return prisma.$queryRaw`
      SELECT * FROM "products" WHERE "stock" <= "minimumStock" ORDER BY "stock" ASC
    `;
  }

  static async count() {
    return prisma.product.count();
  }
}
