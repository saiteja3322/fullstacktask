import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { Role } from '../constants/roles.js';
import { validate } from '../middleware/validation.middleware.js';
import { createCustomerValidator, updateCustomerValidator } from '../validators/customer.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize(Role.ADMIN, Role.SALES, Role.ACCOUNTS), CustomerController.getAll);
router.get('/:id', authorize(Role.ADMIN, Role.SALES, Role.ACCOUNTS), CustomerController.getById);

router.post('/', authorize(Role.ADMIN, Role.SALES), createCustomerValidator, validate, CustomerController.create);
router.put('/:id', authorize(Role.ADMIN, Role.SALES), updateCustomerValidator, validate, CustomerController.update);
router.put('/:id/follow-up', authorize(Role.ADMIN, Role.SALES), CustomerController.updateFollowUp);
router.delete('/:id', authorize(Role.ADMIN), CustomerController.delete);

export default router;
