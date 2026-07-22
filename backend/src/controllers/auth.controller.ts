import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);

      // Set HttpOnly refresh token cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return ApiResponse.success(res, MESSAGES.AUTH.REGISTER_SUCCESS, result, HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return ApiResponse.success(res, MESSAGES.AUTH.LOGIN_SUCCESS, result, HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        await AuthService.logout(req.user.id);
      }
      res.clearCookie('refreshToken');
      res.clearCookie('accessToken');
      return ApiResponse.success(res, MESSAGES.AUTH.LOGOUT_SUCCESS);
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.refreshToken || req.body?.refreshToken;
      if (!token) {
        return ApiResponse.error(res, 'Refresh token missing', HTTP_STATUS.UNAUTHORIZED);
      }

      const tokens = await AuthService.refreshTokens(token);

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return ApiResponse.success(res, 'Token refreshed successfully', tokens);
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await AuthService.getProfile(req.user!.id);
      return ApiResponse.success(res, 'Profile fetched successfully', profile);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      let imagePath = undefined;
      if (req.file) {
        imagePath = req.file.path || req.file.originalname;
      }

      const updated = await AuthService.updateProfile(req.user!.id, {
        ...req.body,
        ...(imagePath && { profileImage: imagePath }),
      });

      return ApiResponse.success(res, 'Profile updated successfully', updated);
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const oldPassword = req.body.oldPassword || req.body.currentPassword;
      const newPassword = req.body.newPassword;
      await AuthService.changePassword(req.user!.id, { oldPassword, newPassword });
      return ApiResponse.success(res, MESSAGES.AUTH.CHANGE_PASSWORD_SUCCESS);
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const resetToken = await AuthService.forgotPassword(req.body);
      return ApiResponse.success(res, MESSAGES.AUTH.PASSWORD_RESET_SENT, { resetToken });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthService.resetPassword(req.body);
      return ApiResponse.success(res, MESSAGES.AUTH.PASSWORD_RESET_SUCCESS);
    } catch (error) {
      next(error);
    }
  }
}
