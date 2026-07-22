import { ProductRepository } from '../repositories/product.repository.js';
import { ActivityLogRepository } from '../repositories/activityLog.repository.js';
import { IPaginationQuery } from '../interfaces/query.interface.js';
import { ApiError } from '../utils/apiError.js';
import { MESSAGES } from '../constants/messages.js';

export class ProductService {
  static async getAll(query: IPaginationQuery) {
    return ProductRepository.findAll(query);
  }

  static async getById(id: string) {
    const product = await ProductRepository.findById(id);
    if (!product) {
      throw ApiError.notFound(MESSAGES.PRODUCT.NOT_FOUND);
    }
    return product;
  }

  static async create(data: any, userId: string) {
    const existingSku = await ProductRepository.findBySku(data.sku);
    if (existingSku) {
      throw ApiError.conflict(MESSAGES.PRODUCT.DUPLICATE_SKU);
    }

    const product = await ProductRepository.create(data);
    await ActivityLogRepository.create(userId, `PRODUCT_CREATED: ${product.name} (${product.sku})`, 'PRODUCT');
    return product;
  }

  static async update(id: string, data: any, userId: string) {
    const product = await this.getById(id);

    if (data.sku && data.sku !== product.sku) {
      const existingSku = await ProductRepository.findBySku(data.sku);
      if (existingSku) {
        throw ApiError.conflict(MESSAGES.PRODUCT.DUPLICATE_SKU);
      }
    }

    const updated = await ProductRepository.update(id, data);
    await ActivityLogRepository.create(userId, `PRODUCT_UPDATED: ${updated.name}`, 'PRODUCT');
    return updated;
  }

  static async delete(id: string, userId: string) {
    const product = await this.getById(id);
    await ProductRepository.delete(id);
    await ActivityLogRepository.create(userId, `PRODUCT_DELETED: ${product.name}`, 'PRODUCT');
    return true;
  }

  static async getLowStockAlerts() {
    return ProductRepository.findLowStock();
  }
}
