import { UserRepository } from '../repositories/user.repository.js';
import { ActivityLogRepository } from '../repositories/activityLog.repository.js';
import { IRegisterDTO, ILoginDTO, IChangePasswordDTO, IForgotPasswordDTO, IResetPasswordDTO } from '../interfaces/auth.interface.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { ApiError } from '../utils/apiError.js';
import { MESSAGES } from '../constants/messages.js';
import crypto from 'crypto';

export class AuthService {
  static async register(dto: IRegisterDTO) {
    const existing = await UserRepository.findByEmail(dto.email);
    if (existing) {
      throw ApiError.conflict(MESSAGES.AUTH.EMAIL_EXISTS);
    }

    const hashedPassword = await hashPassword(dto.password);
    const user = await UserRepository.create({
      ...dto,
      password: hashedPassword,
    });

    await ActivityLogRepository.create(user.id, 'USER_REGISTERED', 'AUTH');

    const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email, role: user.role });

    await UserRepository.updateRefreshToken(user.id, refreshToken);

    return { user, accessToken, refreshToken };
  }

  static async login(dto: ILoginDTO) {
    const user = await UserRepository.findByEmail(dto.email);
    if (!user) {
      throw ApiError.unauthorized(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const isMatch = await comparePassword(dto.password, user.password);
    if (!isMatch) {
      throw ApiError.unauthorized(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email, role: user.role });

    await UserRepository.updateRefreshToken(user.id, refreshToken);
    await ActivityLogRepository.create(user.id, 'USER_LOGIN', 'AUTH');

    const { password, refreshToken: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  static async logout(userId: string) {
    await UserRepository.updateRefreshToken(userId, null);
    await ActivityLogRepository.create(userId, 'USER_LOGOUT', 'AUTH');
    return true;
  }

  static async refreshTokens(refreshToken: string) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await UserRepository.findById(decoded.userId);

      if (!user) {
        throw ApiError.unauthorized('Invalid refresh token');
      }

      const newAccessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
      const newRefreshToken = generateRefreshToken({ userId: user.id, email: user.email, role: user.role });

      await UserRepository.updateRefreshToken(user.id, newRefreshToken);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }
  }

  static async getProfile(userId: string) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound('User profile not found');
    }
    return user;
  }

  static async updateProfile(userId: string, data: { name?: string; phone?: string; profileImage?: string }) {
    const user = await UserRepository.updateProfile(userId, data);
    await ActivityLogRepository.create(userId, 'PROFILE_UPDATED', 'USER');
    return user;
  }

  static async changePassword(userId: string, dto: IChangePasswordDTO) {
    const user = await UserRepository.findByEmail((await UserRepository.findById(userId))!.email);
    if (!user) throw ApiError.notFound('User not found');

    const isMatch = await comparePassword(dto.oldPassword, user.password);
    if (!isMatch) {
      throw ApiError.badRequest(MESSAGES.AUTH.INVALID_OLD_PASSWORD);
    }

    const newHash = await hashPassword(dto.newPassword);
    await UserRepository.updatePassword(userId, newHash);
    await ActivityLogRepository.create(userId, 'PASSWORD_CHANGED', 'AUTH');
    return true;
  }

  static async forgotPassword(dto: IForgotPasswordDTO) {
    const user = await UserRepository.findByEmail(dto.email);
    if (!user) {
      // Return success silently for security
      return true;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await UserRepository.setResetPasswordToken(user.id, resetToken, expires);
    await ActivityLogRepository.create(user.id, 'FORGOT_PASSWORD_REQUESTED', 'AUTH');
    return resetToken;
  }

  static async resetPassword(dto: IResetPasswordDTO) {
    const user = await UserRepository.findByResetToken(dto.token);
    if (!user) {
      throw ApiError.badRequest('Invalid or expired password reset token');
    }

    const newHash = await hashPassword(dto.newPassword);
    await UserRepository.updatePassword(user.id, newHash);
    await UserRepository.setResetPasswordToken(user.id, '', new Date(0));
    await ActivityLogRepository.create(user.id, 'PASSWORD_RESET_COMPLETED', 'AUTH');
    return true;
  }
}
