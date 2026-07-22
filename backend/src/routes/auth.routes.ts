import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { upload } from '../middleware/upload.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from '../validators/auth.validator.js';

const router = Router();

router.post('/register', authRateLimiter, registerValidator, validate, AuthController.register);
router.post('/login', authRateLimiter, loginValidator, validate, AuthController.login);
router.post('/logout', authenticate, AuthController.logout);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/forgot-password', authRateLimiter, forgotPasswordValidator, validate, AuthController.forgotPassword);
router.post('/reset-password', authRateLimiter, resetPasswordValidator, validate, AuthController.resetPassword);

router.get('/profile', authenticate, AuthController.getProfile);
router.put('/profile', authenticate, upload.single('profileImage'), AuthController.updateProfile);
router.put('/change-password', authenticate, changePasswordValidator, validate, AuthController.changePassword);

export default router;
