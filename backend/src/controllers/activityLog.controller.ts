import { Request, Response, NextFunction } from 'express';
import { ActivityLogService } from '../services/activityLog.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class ActivityLogController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ActivityLogService.getAll(req.query as any);
      return ApiResponse.paginated(res, 'Activity logs fetched', result.data, result.meta);
    } catch (error) {
      next(error);
    }
  }
}
