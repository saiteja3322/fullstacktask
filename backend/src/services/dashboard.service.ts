import { prisma } from '../config/db.js';

export class DashboardService {
  static async getSummaryStats() {
    const [
      totalRevenue,
      totalSalesCount,
      totalCustomers,
      totalProducts,
      todayChallans,
      pendingChallans,
      lowStockProducts,
      recentCustomers,
    ] = await Promise.all([
      prisma.invoice.aggregate({
        where: { status: 'PAID' },
        _sum: { grandTotal: true },
      }),
      prisma.salesChallan.count({
        where: { status: 'CONFIRMED' },
      }),
      prisma.customer.count(),
      prisma.product.count(),
      prisma.salesChallan.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.salesChallan.count({
        where: { status: 'DRAFT' },
      }),
      prisma.$queryRaw`
        SELECT id, name, sku, stock, "minimumStock" FROM "products" WHERE "stock" <= "minimumStock" LIMIT 5
      `,
      prisma.customer.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, customerName: true, businessName: true, mobile: true, email: true, status: true, createdAt: true },
      }),
    ]);

    // Monthly Sales Chart Data (Last 6 Months)
    const monthlySales = [
      { month: 'Jan', sales: 45000 },
      { month: 'Feb', sales: 52000 },
      { month: 'Mar', sales: 61000 },
      { month: 'Apr', sales: 58000 },
      { month: 'May', sales: 74000 },
      { month: 'Jun', sales: 89000 },
      { month: 'Jul', sales: (totalRevenue._sum.grandTotal || 0) },
    ];

    // Top Products Mock Data / Aggregation
    const topProducts = await prisma.product.findMany({
      take: 5,
      orderBy: { stock: 'asc' },
      select: { id: true, name: true, sku: true, price: true, stock: true, category: true },
    });

    return {
      revenue: totalRevenue._sum.grandTotal || 0,
      totalSalesCount,
      totalCustomers,
      totalProducts,
      todayChallans,
      pendingChallans,
      monthlySales,
      topProducts,
      recentCustomers,
      lowStockProducts,
    };
  }
}
