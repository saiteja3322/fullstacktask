import { prisma } from '../config/db.js';
import { IPaginationQuery } from '../interfaces/query.interface.js';
import { CustomerType, CustomerStatus } from '@prisma/client';

export class CustomerRepository {
  static async findAll(query: IPaginationQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const { search, customerType, status, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const where: any = {};

    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { businessName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { mobile: { contains: search, mode: 'insensitive' } },
        { GST: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (customerType) {
      where.customerType = customerType as CustomerType;
    }

    if (status) {
      where.status = status as CustomerStatus;
    }

    const [data, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.customer.count({ where }),
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
    return prisma.customer.findUnique({
      where: { id },
      include: {
        salesChallans: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  static async create(data: any) {
    return prisma.customer.create({ data });
  }

  static async update(id: string, data: any) {
    return prisma.customer.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.customer.delete({ where: { id } });
  }

  static async count() {
    return prisma.customer.count();
  }
}
