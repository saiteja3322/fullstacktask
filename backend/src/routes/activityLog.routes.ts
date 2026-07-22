import { Router } from 'express';
import { ActivityLogController } from '../controllers/activityLog.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { Role } from '../constants/roles.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize(Role.ADMIN), ActivityLogController.getAll);

export default router;
