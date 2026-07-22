import rateLimit from 'express-rate-limit';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // 2000 requests per 15 mins for dev/testing
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, // 500 attempts limit for auth endpoints
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  },
});
