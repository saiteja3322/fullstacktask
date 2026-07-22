import { Response } from 'express';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export class ApiResponse {
  static success(res: Response, message: string, data: any = null, statusCode: number = HTTP_STATUS.OK) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static paginated(res: Response, message: string, data: any[], meta: any, statusCode: number = HTTP_STATUS.OK) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta,
    });
  }

  static error(res: Response, message: string, statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors: any = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }
}
