import { prisma } from '../config/db.js';
import { IPaginationQuery } from '../interfaces/query.interface.js';
import { InvoiceStatus } from '@prisma/client';

export class InvoiceRepository {
  static async findAll(query: IPaginationQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const { search, status, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const where: any = {};

    if (status) {
      where.status = status as InvoiceStatus;
    }

    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { challan: { challanNumber: { contains: search, mode: 'insensitive' } } },
        { challan: { customer: { customerName: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          challan: {
            include: {
              customer: { select: { id: true, customerName: true, businessName: true, mobile: true, email: true, GST: true } },
              user: { select: { id: true, name: true } },
              items: true,
            },
          },
        },
      }),
      prisma.invoice.count({ where }),
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
    return prisma.invoice.findUnique({
      where: { id },
      include: {
        challan: {
          include: {
            customer: true,
            items: true,
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
  }

  static async findByChallanId(challanId: string) {
    return prisma.invoice.findFirst({ where: { challanId } });
  }

  static async create(data: {
    invoiceNumber: string;
    challanId: string;
    tax: number;
    discount: number;
    grandTotal: number;
    status?: InvoiceStatus;
  }) {
    return prisma.invoice.create({
      data,
      include: {
        challan: {
          include: {
            customer: true,
            items: true,
          },
        },
      },
    });
  }

  static async updateStatus(id: string, status: InvoiceStatus) {
    return prisma.invoice.update({
      where: { id },
      data: { status },
    });
  }

  static async getRevenueStats() {
    const totalPaid = await prisma.invoice.aggregate({
      where: { status: 'PAID' },
      _sum: { grandTotal: true },
    });

    const totalUnpaid = await prisma.invoice.aggregate({
      where: { status: 'UNPAID' },
      _sum: { grandTotal: true },
    });

    return {
      paidRevenue: totalPaid._sum.grandTotal || 0,
      unpaidRevenue: totalUnpaid._sum.grandTotal || 0,
    };
  }
}
