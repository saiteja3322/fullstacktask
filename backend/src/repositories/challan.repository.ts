import { prisma } from '../config/db.js';
import { IPaginationQuery } from '../interfaces/query.interface.js';
import { ChallanStatus } from '@prisma/client';

export class ChallanRepository {
  static async findAll(query: IPaginationQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const { search, status, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const where: any = {};

    if (status) {
      where.status = status as ChallanStatus;
    }

    if (search) {
      where.OR = [
        { challanNumber: { contains: search, mode: 'insensitive' } },
        { customer: { customerName: { contains: search, mode: 'insensitive' } } },
        { customer: { businessName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.salesChallan.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          customer: { select: { id: true, customerName: true, businessName: true, mobile: true, email: true } },
          user: { select: { id: true, name: true } },
          items: true,
          invoices: { select: { id: true, invoiceNumber: true, status: true } },
        },
      }),
      prisma.salesChallan.count({ where }),
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
    return prisma.salesChallan.findUnique({
      where: { id },
      include: {
        customer: true,
        user: { select: { id: true, name: true, email: true } },
        items: true,
        invoices: true,
      },
    });
  }

  static async create(data: {
    challanNumber: string;
    customerId: string;
    totalQuantity: number;
    grandTotal: number;
    createdBy: string;
    items: Array<{ productSnapshot: any; price: number; quantity: number }>;
  }) {
    return prisma.salesChallan.create({
      data: {
        challanNumber: data.challanNumber,
        customerId: data.customerId,
        totalQuantity: data.totalQuantity,
        grandTotal: data.grandTotal,
        createdBy: data.createdBy,
        items: {
          create: data.items,
        },
      },
      include: {
        customer: true,
        items: true,
      },
    });
  }

  static async updateStatus(id: string, status: ChallanStatus) {
    return prisma.salesChallan.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
  }

  static async delete(id: string) {
    return prisma.salesChallan.delete({ where: { id } });
  }

  static async count() {
    return prisma.salesChallan.count();
  }
}
