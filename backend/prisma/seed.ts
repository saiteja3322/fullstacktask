import { PrismaClient, Role, CustomerType, CustomerStatus, ChallanStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Database Seeding...');

  // Clean existing data
  await prisma.activityLog.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.salesChallanItem.deleteMany();
  await prisma.salesChallan.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing database records.');

  // Hashed Password for default users
  const hashedPassword = await bcrypt.hash('Admin@123456', 10);
  const salesPassword = await bcrypt.hash('Sales@123456', 10);
  const whPassword = await bcrypt.hash('Warehouse@123456', 10);
  const accPassword = await bcrypt.hash('Accounts@123456', 10);

  // 1. Users
  const admin = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@erp.com',
      password: hashedPassword,
      phone: '+1 555-0100',
      role: Role.ADMIN,
      isEmailVerified: true,
    },
  });

  const salesUser = await prisma.user.create({
    data: {
      name: 'Sarah Sales Manager',
      email: 'sales@erp.com',
      password: salesPassword,
      phone: '+1 555-0101',
      role: Role.SALES,
      isEmailVerified: true,
    },
  });

  const warehouseUser = await prisma.user.create({
    data: {
      name: 'Wayne Warehouse Lead',
      email: 'warehouse@erp.com',
      password: whPassword,
      phone: '+1 555-0102',
      role: Role.WAREHOUSE,
      isEmailVerified: true,
    },
  });

  const accountsUser = await prisma.user.create({
    data: {
      name: 'Alex Accounts Lead',
      email: 'accounts@erp.com',
      password: accPassword,
      phone: '+1 555-0103',
      role: Role.ACCOUNTS,
      isEmailVerified: true,
    },
  });

  console.log('✅ Users seeded: 1 Admin, 1 Sales, 1 Warehouse, 1 Accounts');

  // 2. 100 Customers
  const customerTypes: CustomerType[] = [CustomerType.RETAIL, CustomerType.WHOLESALE, CustomerType.DISTRIBUTOR];
  const customerStatuses: CustomerStatus[] = [CustomerStatus.ACTIVE, CustomerStatus.INACTIVE, CustomerStatus.LEAD];
  const createdCustomers = [];

  for (let i = 1; i <= 100; i++) {
    const cust = await prisma.customer.create({
      data: {
        customerName: `Customer ${i} ${['Enterprise', 'Corp', 'Solutions', 'Traders', 'Logistics'][i % 5]}`,
        businessName: `Apex Business ${i} Ltd`,
        mobile: `+1 555-9${String(i).padStart(4, '0')}`,
        email: `client${i}@business.org`,
        GST: `27AAAC${String(1000 + i)}K1Z${i % 9}`,
        customerType: customerTypes[i % customerTypes.length],
        address: `${100 + i} Commerce Blvd, Suite ${i}, Innovation City`,
        status: customerStatuses[i % customerStatuses.length],
        followUpDate: i % 3 === 0 ? new Date(Date.now() + i * 86400000) : null,
        notes: `Key enterprise account registered during initial batch setup #${i}`,
      },
    });
    createdCustomers.push(cust);
  }

  console.log('✅ 100 Customers seeded');

  // 3. 100 Products
  const categories = ['Electronics', 'Industrial Tools', 'Office Supplies', 'Raw Materials', 'Packaging'];
  const warehouses = ['Main Warehouse', 'North Hub', 'South Storage', 'West Distribution Center'];
  const createdProducts = [];

  for (let i = 1; i <= 100; i++) {
    const price = Math.floor(Math.random() * 900) + 50;
    const stock = Math.floor(Math.random() * 150) + 10;
    const prod = await prisma.product.create({
      data: {
        name: `Industrial Component SKU-${1000 + i}`,
        sku: `SKU-PROD-${1000 + i}`,
        category: categories[i % categories.length],
        description: `High performance grade item catalog standard #${i}`,
        price: parseFloat(price.toFixed(2)),
        stock: stock,
        minimumStock: 15,
        warehouse: warehouses[i % warehouses.length],
        image: `https://picsum.photos/seed/prod${i}/400/300`,
      },
    });
    createdProducts.push(prod);
  }

  console.log('✅ 100 Products seeded');

  // 4. 50 Sales Challans & Invoices
  for (let i = 1; i <= 50; i++) {
    const cust = createdCustomers[i % createdCustomers.length];
    const prod1 = createdProducts[i % createdProducts.length];
    const prod2 = createdProducts[(i + 1) % createdProducts.length];
    const qty1 = (i % 5) + 1;
    const qty2 = (i % 3) + 2;

    const totalQty = qty1 + qty2;
    const grandTotal = prod1.price * qty1 + prod2.price * qty2;
    const isConfirmed = i % 2 === 0;

    const challan = await prisma.salesChallan.create({
      data: {
        challanNumber: `CH-202607-${String(1000 + i)}`,
        customerId: cust.id,
        status: isConfirmed ? ChallanStatus.CONFIRMED : ChallanStatus.DRAFT,
        totalQuantity: totalQty,
        grandTotal: grandTotal,
        createdBy: salesUser.id,
        items: {
          create: [
            {
              productSnapshot: { id: prod1.id, name: prod1.name, sku: prod1.sku },
              price: prod1.price,
              quantity: qty1,
            },
            {
              productSnapshot: { id: prod2.id, name: prod2.name, sku: prod2.sku },
              price: prod2.price,
              quantity: qty2,
            },
          ],
        },
      },
    });

    // Create Invoice for confirmed challans
    if (isConfirmed) {
      const tax = grandTotal * 0.18;
      const discount = grandTotal * 0.05;
      const invoiceTotal = grandTotal - discount + tax;

      await prisma.invoice.create({
        data: {
          invoiceNumber: `INV-202607-${String(1000 + i)}`,
          challanId: challan.id,
          tax: tax,
          discount: discount,
          grandTotal: invoiceTotal,
          status: i % 4 === 0 ? 'PAID' : 'UNPAID',
        },
      });
    }
  }

  console.log('✅ 50 Sales Challans & associated Invoices seeded');

  // 5. Initial Activity Log
  await prisma.activityLog.create({
    data: {
      userId: admin.id,
      action: 'INITIAL_SEED_COMPLETE',
      module: 'SYSTEM',
    },
  });

  console.log('🚀 Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
