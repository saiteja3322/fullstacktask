import { ChallanRepository } from '../repositories/challan.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { CustomerRepository } from '../repositories/customer.repository.js';
import { InventoryRepository } from '../repositories/inventory.repository.js';
import { ActivityLogRepository } from '../repositories/activityLog.repository.js';
import { IPaginationQuery } from '../interfaces/query.interface.js';
import { generateChallanNumber } from '../utils/numberGenerator.js';
import { ApiError } from '../utils/apiError.js';
import { ChallanStatus, MovementType } from '@prisma/client';

export class ChallanService {
  static async getAll(query: IPaginationQuery) {
    return ChallanRepository.findAll(query);
  }

  static async getById(id: string) {
    const challan = await ChallanRepository.findById(id);
    if (!challan) throw ApiError.notFound('Sales Challan not found');
    return challan;
  }

  static async create(data: { customerId: string; items: Array<{ productId: string; quantity: number; price: number }> }, userId: string) {
    const customer = await CustomerRepository.findById(data.customerId);
    if (!customer) throw ApiError.notFound('Customer not found');

    let totalQuantity = 0;
    let grandTotal = 0;
    const itemsToCreate = [];

    for (const item of data.items) {
      const product = await ProductRepository.findById(item.productId);
      if (!product) throw ApiError.notFound(`Product ID ${item.productId} not found`);

      totalQuantity += item.quantity;
      const lineTotal = item.price * item.quantity;
      grandTotal += lineTotal;

      itemsToCreate.push({
        productSnapshot: {
          id: product.id,
          name: product.name,
          sku: product.sku,
          category: product.category,
        },
        price: item.price,
        quantity: item.quantity,
      });
    }

    const challanNumber = generateChallanNumber();

    const challan = await ChallanRepository.create({
      challanNumber,
      customerId: data.customerId,
      totalQuantity,
      grandTotal,
      createdBy: userId,
      items: itemsToCreate,
    });

    await ActivityLogRepository.create(userId, `CHALLAN_CREATED: ${challanNumber}`, 'SALES_CHALLAN');
    return challan;
  }

  static async confirm(id: string, userId: string) {
    const challan = await this.getById(id);

    if (challan.status === ChallanStatus.CONFIRMED) {
      throw ApiError.badRequest('Sales Challan is already confirmed');
    }

    // Verify stock availability for all items
    for (const item of challan.items) {
      const snapshot = item.productSnapshot as any;
      const product = await ProductRepository.findById(snapshot.id);

      if (!product) throw ApiError.badRequest(`Product ${snapshot.name} no longer exists`);
      if (product.stock < item.quantity) {
        throw ApiError.badRequest(`Insufficient stock for product ${product.name}. Available: ${product.stock}, Required: ${item.quantity}`);
      }
    }

    // Deduct stock & create movement records
    for (const item of challan.items) {
      const snapshot = item.productSnapshot as any;
      const product = await ProductRepository.findById(snapshot.id)!;

      await ProductRepository.update(snapshot.id, {
        stock: product!.stock - item.quantity,
      });

      await InventoryRepository.createMovement({
        productId: snapshot.id,
        quantity: item.quantity,
        movementType: MovementType.OUT,
        reason: `Sales Challan Confirmation (${challan.challanNumber})`,
        createdBy: userId,
      });
    }

    const confirmedChallan = await ChallanRepository.updateStatus(id, ChallanStatus.CONFIRMED);
    await ActivityLogRepository.create(userId, `CHALLAN_CONFIRMED: ${challan.challanNumber}`, 'SALES_CHALLAN');
    return confirmedChallan;
  }

  static async cancel(id: string, userId: string) {
    const challan = await this.getById(id);

    if (challan.status === ChallanStatus.CANCELLED) {
      throw ApiError.badRequest('Sales Challan is already cancelled');
    }

    // If it was confirmed, restore stock
    if (challan.status === ChallanStatus.CONFIRMED) {
      for (const item of challan.items) {
        const snapshot = item.productSnapshot as any;
        const product = await ProductRepository.findById(snapshot.id);

        if (product) {
          await ProductRepository.update(snapshot.id, {
            stock: product.stock + item.quantity,
          });

          await InventoryRepository.createMovement({
            productId: snapshot.id,
            quantity: item.quantity,
            movementType: MovementType.IN,
            reason: `Sales Challan Cancellation Restored (${challan.challanNumber})`,
            createdBy: userId,
          });
        }
      }
    }

    const cancelledChallan = await ChallanRepository.updateStatus(id, ChallanStatus.CANCELLED);
    await ActivityLogRepository.create(userId, `CHALLAN_CANCELLED: ${challan.challanNumber}`, 'SALES_CHALLAN');
    return cancelledChallan;
  }

  static async delete(id: string, userId: string) {
    const challan = await this.getById(id);
    if (challan.status === ChallanStatus.CONFIRMED) {
      throw ApiError.badRequest('Cannot delete confirmed sales challan. Cancel it first.');
    }

    await ChallanRepository.delete(id);
    await ActivityLogRepository.create(userId, `CHALLAN_DELETED: ${challan.challanNumber}`, 'SALES_CHALLAN');
    return true;
  }
}
