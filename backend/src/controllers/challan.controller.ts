import { Request, Response, NextFunction } from 'express';
import { ChallanService } from '../services/challan.service.js';
import { PdfService } from '../services/pdf.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';

export class ChallanController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ChallanService.getAll(req.query as any);
      return ApiResponse.paginated(res, 'Sales Challans fetched', result.data, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const challan = await ChallanService.getById(req.params.id as string);
      return ApiResponse.success(res, 'Sales Challan details fetched', challan);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const challan = await ChallanService.create(req.body, req.user!.id);
      return ApiResponse.success(res, MESSAGES.CHALLAN.CREATED, challan, HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  static async confirm(req: Request, res: Response, next: NextFunction) {
    try {
      const confirmed = await ChallanService.confirm(req.params.id as string, req.user!.id);
      return ApiResponse.success(res, MESSAGES.CHALLAN.CONFIRMED, confirmed);
    } catch (error) {
      next(error);
    }
  }

  static async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const cancelled = await ChallanService.cancel(req.params.id as string, req.user!.id);
      return ApiResponse.success(res, MESSAGES.CHALLAN.CANCELLED, cancelled);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ChallanService.delete(req.params.id as string, req.user!.id);
      return ApiResponse.success(res, MESSAGES.CHALLAN.DELETED);
    } catch (error) {
      next(error);
    }
  }

  static async generatePdf(req: Request, res: Response, next: NextFunction) {
    try {
      const challan = await ChallanService.getById(req.params.id as string);
      return PdfService.generateChallanPdf(challan, res);
    } catch (error) {
      next(error);
    }
  }
}
