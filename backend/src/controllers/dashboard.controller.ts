import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class DashboardController {
  static async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await DashboardService.getSummaryStats();
      return ApiResponse.success(res, 'Dashboard summary statistics fetched', summary);
    } catch (error) {
      next(error);
    }
  }
}
