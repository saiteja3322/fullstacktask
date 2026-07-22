import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { Role } from '../constants/roles.js';
import { validate } from '../middleware/validation.middleware.js';
import { stockMovementValidator, stockTransferValidator } from '../validators/inventory.validator.js';

const router = Router();

router.use(authenticate);

router.post('/stock-in', authorize(Role.ADMIN, Role.WAREHOUSE), stockMovementValidator, validate, InventoryController.stockIn);
router.post('/stock-out', authorize(Role.ADMIN, Role.WAREHOUSE), stockMovementValidator, validate, InventoryController.stockOut);
router.post('/adjust-stock', authorize(Role.ADMIN, Role.WAREHOUSE), InventoryController.adjustStock);
router.post('/transfer-stock', authorize(Role.ADMIN, Role.WAREHOUSE), stockTransferValidator, validate, InventoryController.transferStock);

router.get('/movements', authorize(Role.ADMIN, Role.WAREHOUSE, Role.SALES), InventoryController.getMovements);
router.get('/low-stock-alerts', InventoryController.getLowStockAlerts);

export default router;
