import { body } from 'express-validator';

export const stockMovementValidator = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('reason').optional().isString(),
];

export const stockTransferValidator = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('targetWarehouse').notEmpty().withMessage('Target Warehouse name is required'),
  body('reason').optional().isString(),
];
