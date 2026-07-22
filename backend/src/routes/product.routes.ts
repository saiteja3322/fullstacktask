import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { Role } from '../constants/roles.js';
import { upload } from '../middleware/upload.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createProductValidator, updateProductValidator } from '../validators/product.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);

router.post('/', authorize(Role.ADMIN, Role.WAREHOUSE), upload.single('image'), createProductValidator, validate, ProductController.create);
router.put('/:id', authorize(Role.ADMIN, Role.WAREHOUSE), upload.single('image'), updateProductValidator, validate, ProductController.update);
router.delete('/:id', authorize(Role.ADMIN), ProductController.delete);

export default router;
