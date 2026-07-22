import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';

export class ProductController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.getAll(req.query as any);
      return ApiResponse.paginated(res, 'Products fetched successfully', result.data, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getById(req.params.id as string);
      return ApiResponse.success(res, 'Product fetched successfully', product);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      let image = req.body.image || null;
      if (req.file) {
        image = req.file.path || req.file.originalname;
      }

      const product = await ProductService.create(
        {
          ...req.body,
          price: parseFloat(req.body.price),
          stock: req.body.stock ? parseInt(req.body.stock) : 0,
          minimumStock: req.body.minimumStock ? parseInt(req.body.minimumStock) : 5,
          image,
        },
        req.user!.id
      );
      return ApiResponse.success(res, MESSAGES.PRODUCT.CREATED, product, HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      let image = req.body.image;
      if (req.file) {
        image = req.file.path || req.file.originalname;
      }

      const payload = {
        ...req.body,
        ...(req.body.price && { price: parseFloat(req.body.price) }),
        ...(req.body.stock !== undefined && { stock: parseInt(req.body.stock) }),
        ...(req.body.minimumStock !== undefined && { minimumStock: parseInt(req.body.minimumStock) }),
        ...(image && { image }),
      };

      const updated = await ProductService.update(req.params.id as string, payload, req.user!.id);
      return ApiResponse.success(res, MESSAGES.PRODUCT.UPDATED, updated);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ProductService.delete(req.params.id as string, req.user!.id);
      return ApiResponse.success(res, MESSAGES.PRODUCT.DELETED);
    } catch (error) {
      next(error);
    }
  }
}
