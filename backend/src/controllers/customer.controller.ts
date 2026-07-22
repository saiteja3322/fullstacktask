import { Request, Response, NextFunction } from 'express';
import { CustomerService } from '../services/customer.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';

export class CustomerController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CustomerService.getAll(req.query as any);
      return ApiResponse.paginated(res, 'Customers fetched successfully', result.data, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await CustomerService.getById(req.params.id as string);
      return ApiResponse.success(res, 'Customer fetched successfully', customer);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await CustomerService.create(req.body, req.user!.id);
      return ApiResponse.success(res, MESSAGES.CUSTOMER.CREATED, customer, HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await CustomerService.update(req.params.id as string, req.body, req.user!.id);
      return ApiResponse.success(res, MESSAGES.CUSTOMER.UPDATED, updated);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await CustomerService.delete(req.params.id as string, req.user!.id);
      return ApiResponse.success(res, MESSAGES.CUSTOMER.DELETED);
    } catch (error) {
      next(error);
    }
  }

  static async updateFollowUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { followUpDate, notes } = req.body;
      const dateVal = followUpDate ? new Date(followUpDate) : null;
      const updated = await CustomerService.updateFollowUp(req.params.id as string, dateVal, notes, req.user!.id);
      return ApiResponse.success(res, 'Follow-up status updated', updated);
    } catch (error) {
      next(error);
    }
  }
}
