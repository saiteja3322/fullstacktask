import { body } from 'express-validator';

export const createInvoiceValidator = [
  body('challanId').notEmpty().withMessage('Challan ID is required'),
  body('tax').optional().isFloat({ min: 0 }).withMessage('Tax must be non-negative'),
  body('discount').optional().isFloat({ min: 0 }).withMessage('Discount must be non-negative'),
  body('status')
    .optional()
    .isIn(['UNPAID', 'PAID', 'CANCELLED'])
    .withMessage('Invalid invoice payment status'),
];
