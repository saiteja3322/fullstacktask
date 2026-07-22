import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventory.service.js';
import { ProductService } from '../services/product.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { MESSAGES } from '../constants/messages.js';

export class InventoryController {
  static async stockIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, quantity, reason } = req.body;
      const result = await InventoryService.stockIn(productId, parseInt(quantity), reason, req.user!.id);
      return ApiResponse.success(res, MESSAGES.INVENTORY.STOCK_UPDATED, result);
    } catch (error) {
      next(error);
    }
  }

  static async stockOut(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, quantity, reason } = req.body;
      const result = await InventoryService.stockOut(productId, parseInt(quantity), reason, req.user!.id);
      return ApiResponse.success(res, MESSAGES.INVENTORY.STOCK_UPDATED, result);
    } catch (error) {
      next(error);
    }
  }

  static async adjustStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, newStock, reason } = req.body;
      const result = await InventoryService.adjustStock(productId, parseInt(newStock), reason, req.user!.id);
      return ApiResponse.success(res, MESSAGES.INVENTORY.STOCK_UPDATED, result);
    } catch (error) {
      next(error);
    }
  }

  static async transferStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, quantity, targetWarehouse, reason } = req.body;
      const result = await InventoryService.transferStock(productId, parseInt(quantity), targetWarehouse, reason, req.user!.id);
      return ApiResponse.success(res, MESSAGES.INVENTORY.STOCK_TRANSFERRED, result);
    } catch (error) {
      next(error);
    }
  }

  static async getMovements(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await InventoryService.getMovements(req.query as any);
      return ApiResponse.paginated(res, 'Stock movement logs fetched', result.data, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getLowStockAlerts(req: Request, res: Response, next: NextFunction) {
    try {
      const alerts = await ProductService.getLowStockAlerts();
      return ApiResponse.success(res, 'Low stock alerts fetched', alerts);
    } catch (error) {
      next(error);
    }
  }
}
