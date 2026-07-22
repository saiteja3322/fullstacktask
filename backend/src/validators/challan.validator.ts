import { body } from 'express-validator';

export const createChallanValidator = [
  body('customerId').notEmpty().withMessage('Customer ID is required'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required in the sales challan'),
  body('items.*.productId').notEmpty().withMessage('Product ID is required for each item'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Item quantity must be a positive integer'),
  body('items.*.price')
    .isFloat({ min: 0 })
    .withMessage('Item price must be non-negative'),
];
