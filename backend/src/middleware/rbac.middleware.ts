import { Request, Response, NextFunction } from 'express';
import { Role } from '../constants/roles.js';
import { ApiError } from '../utils/apiError.js';

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized('User identity missing'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Access denied. Role '${req.user.role}' is not authorized to access this resource`
        )
      );
    }

    next();
  };
};
