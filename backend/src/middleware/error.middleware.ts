import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  if (!(err instanceof ApiError)) {
    logger.error('Unhandled System Error:', err);
    message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  } else {
    logger.warn(`API Error [${statusCode}]: ${message}`);
  }

  return ApiResponse.error(res, message, statusCode, errors);
};
