import { body } from 'express-validator';

export const createCustomerValidator = [
  body('customerName').trim().notEmpty().withMessage('Customer name is required'),
  body('mobile').trim().notEmpty().withMessage('Mobile number is required'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('GST').optional().isString(),
  body('customerType')
    .optional()
    .isIn(['RETAIL', 'WHOLESALE', 'DISTRIBUTOR'])
    .withMessage('Invalid customer type'),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE', 'LEAD'])
    .withMessage('Invalid customer status'),
  body('followUpDate').optional({ nullable: true }).isISO8601().withMessage('Invalid date format'),
];

export const updateCustomerValidator = [
  body('customerName').optional().trim().notEmpty(),
  body('mobile').optional().trim().notEmpty(),
  body('email').optional().isEmail(),
  body('customerType').optional().isIn(['RETAIL', 'WHOLESALE', 'DISTRIBUTOR']),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'LEAD']),
  body('followUpDate').optional({ nullable: true }).isISO8601(),
];
