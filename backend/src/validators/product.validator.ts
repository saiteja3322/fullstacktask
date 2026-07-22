import { body } from 'express-validator';

export const createProductValidator = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('sku').trim().notEmpty().withMessage('SKU code is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('minimumStock').optional().isInt({ min: 0 }).withMessage('Minimum stock must be non-negative'),
  body('warehouse').optional().isString(),
];

export const updateProductValidator = [
  body('name').optional().trim().notEmpty(),
  body('sku').optional().trim().notEmpty(),
  body('category').optional().trim().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  body('minimumStock').optional().isInt({ min: 0 }),
];
