import { Role } from '../constants/roles.js';

export interface IRegisterDTO {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: Role;
}

export interface ILoginDTO {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface IChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
}

export interface IForgotPasswordDTO {
  email: string;
}

export interface IResetPasswordDTO {
  token: string;
  newPassword: string;
}
