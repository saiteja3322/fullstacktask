import { Router } from 'express';
import { InvoiceController } from '../controllers/invoice.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { Role } from '../constants/roles.js';
import { validate } from '../middleware/validation.middleware.js';
import { createInvoiceValidator } from '../validators/invoice.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize(Role.ADMIN, Role.ACCOUNTS, Role.SALES), InvoiceController.getAll);
router.get('/:id', authorize(Role.ADMIN, Role.ACCOUNTS, Role.SALES), InvoiceController.getById);
router.get('/:id/pdf', InvoiceController.generatePdf);

router.post('/', authorize(Role.ADMIN, Role.ACCOUNTS), createInvoiceValidator, validate, InvoiceController.create);
router.put('/:id/status', authorize(Role.ADMIN, Role.ACCOUNTS), InvoiceController.updateStatus);

export default router;
