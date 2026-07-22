import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { prisma } from '../config/db.js';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    let token = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw ApiError.unauthorized('Authentication token is required');
    }

    const decoded = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      throw ApiError.unauthorized('User associated with token no longer exists');
    }

    req.user = user;
    next();
  } catch (error: any) {
    next(ApiError.unauthorized(error.message || 'Invalid or expired token'));
  }
};
