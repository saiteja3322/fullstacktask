import { Router } from 'express';
import { ChallanController } from '../controllers/challan.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { Role } from '../constants/roles.js';
import { validate } from '../middleware/validation.middleware.js';
import { createChallanValidator } from '../validators/challan.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize(Role.ADMIN, Role.SALES, Role.WAREHOUSE, Role.ACCOUNTS), ChallanController.getAll);
router.get('/:id', authorize(Role.ADMIN, Role.SALES, Role.WAREHOUSE, Role.ACCOUNTS), ChallanController.getById);
router.get('/:id/pdf', ChallanController.generatePdf);

router.post('/', authorize(Role.ADMIN, Role.SALES), createChallanValidator, validate, ChallanController.create);
router.put('/:id/confirm', authorize(Role.ADMIN, Role.WAREHOUSE, Role.SALES), ChallanController.confirm);
router.put('/:id/cancel', authorize(Role.ADMIN, Role.SALES), ChallanController.cancel);
router.delete('/:id', authorize(Role.ADMIN), ChallanController.delete);

export default router;
