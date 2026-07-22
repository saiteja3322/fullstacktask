import { InventoryRepository } from '../repositories/inventory.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { ActivityLogRepository } from '../repositories/activityLog.repository.js';
import { IPaginationQuery } from '../interfaces/query.interface.js';
import { ApiError } from '../utils/apiError.js';
import { MovementType } from '@prisma/client';
import { MESSAGES } from '../constants/messages.js';

export class InventoryService {
  static async stockIn(productId: string, quantity: number, reason: string | undefined, userId: string) {
    const product = await ProductRepository.findById(productId);
    if (!product) throw ApiError.notFound(MESSAGES.PRODUCT.NOT_FOUND);

    const updatedProduct = await ProductRepository.update(productId, {
      stock: product.stock + quantity,
    });

    const movement = await InventoryRepository.createMovement({
      productId,
      quantity,
      movementType: MovementType.IN,
      reason: reason || 'Stock Inward Restock',
      createdBy: userId,
    });

    await ActivityLogRepository.create(userId, `STOCK_IN: ${quantity} units for ${product.name}`, 'INVENTORY');

    return { product: updatedProduct, movement };
  }

  static async stockOut(productId: string, quantity: number, reason: string | undefined, userId: string) {
    const product = await ProductRepository.findById(productId);
    if (!product) throw ApiError.notFound(MESSAGES.PRODUCT.NOT_FOUND);

    if (product.stock < quantity) {
      throw ApiError.badRequest(`Insufficient stock available. Current stock: ${product.stock}`);
    }

    const updatedProduct = await ProductRepository.update(productId, {
      stock: product.stock - quantity,
    });

    const movement = await InventoryRepository.createMovement({
      productId,
      quantity,
      movementType: MovementType.OUT,
      reason: reason || 'Stock Outward Dispatched',
      createdBy: userId,
    });

    await ActivityLogRepository.create(userId, `STOCK_OUT: ${quantity} units for ${product.name}`, 'INVENTORY');

    return { product: updatedProduct, movement };
  }

  static async adjustStock(productId: string, newStock: number, reason: string | undefined, userId: string) {
    const product = await ProductRepository.findById(productId);
    if (!product) throw ApiError.notFound(MESSAGES.PRODUCT.NOT_FOUND);

    const diff = newStock - product.stock;
    const movementType = diff >= 0 ? MovementType.IN : MovementType.OUT;

    const updatedProduct = await ProductRepository.update(productId, { stock: newStock });

    const movement = await InventoryRepository.createMovement({
      productId,
      quantity: Math.abs(diff),
      movementType: MovementType.ADJUSTMENT,
      reason: reason || `Manual Stock Adjustment from ${product.stock} to ${newStock}`,
      createdBy: userId,
    });

    await ActivityLogRepository.create(userId, `STOCK_ADJUSTMENT: Set to ${newStock} for ${product.name}`, 'INVENTORY');

    return { product: updatedProduct, movement };
  }

  static async transferStock(productId: string, quantity: number, targetWarehouse: string, reason: string | undefined, userId: string) {
    const product = await ProductRepository.findById(productId);
    if (!product) throw ApiError.notFound(MESSAGES.PRODUCT.NOT_FOUND);

    if (product.stock < quantity) {
      throw ApiError.badRequest(`Insufficient stock available for transfer. Current stock: ${product.stock}`);
    }

    const movement = await InventoryRepository.createMovement({
      productId,
      quantity,
      movementType: MovementType.TRANSFER,
      reason: `Transfer to ${targetWarehouse}: ${reason || 'Inter-warehouse transfer'}`,
      createdBy: userId,
    });

    await ActivityLogRepository.create(userId, `STOCK_TRANSFER: ${quantity} units to ${targetWarehouse}`, 'INVENTORY');

    return movement;
  }

  static async getMovements(query: IPaginationQuery) {
    return InventoryRepository.findMovements(query);
  }
}
