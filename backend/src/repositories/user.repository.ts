import { prisma } from '../config/db.js';
import { IRegisterDTO } from '../interfaces/auth.interface.js';

export class UserRepository {
  static async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profileImage: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async create(data: IRegisterDTO & { password: string }) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });
  }

  static async updateRefreshToken(userId: string, refreshToken: string | null) {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  static async updateProfile(userId: string, data: { name?: string; phone?: string; profileImage?: string }) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profileImage: true,
        role: true,
      },
    });
  }

  static async updatePassword(userId: string, passwordHash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { password: passwordHash },
    });
  }

  static async setResetPasswordToken(userId: string, token: string, expires: Date) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });
  }

  static async findByResetToken(token: string) {
    return prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() },
      },
    });
  }
}
