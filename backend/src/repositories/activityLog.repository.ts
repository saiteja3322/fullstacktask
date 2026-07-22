import { prisma } from '../config/db.js';
import { IPaginationQuery } from '../interfaces/query.interface.js';

export class ActivityLogRepository {
  static async create(userId: string | undefined, action: string, module: string) {
    return prisma.activityLog.create({
      data: {
        userId: userId || null,
        action,
        module,
      },
    });
  }

  static async findAll(query: IPaginationQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 15;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.activityLog.findMany({
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true, role: true } },
        },
      }),
      prisma.activityLog.count(),
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
