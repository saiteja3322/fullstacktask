import { Request, Response, NextFunction } from 'express';
import { InvoiceService } from '../services/invoice.service.js';
import { PdfService } from '../services/pdf.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';

export class InvoiceController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await InvoiceService.getAll(req.query as any);
      return ApiResponse.paginated(res, 'Invoices fetched successfully', result.data, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const invoice = await InvoiceService.getById(req.params.id as string);
      return ApiResponse.success(res, 'Invoice details fetched', invoice);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const invoice = await InvoiceService.createFromChallan(req.body, req.user!.id);
      return ApiResponse.success(res, MESSAGES.INVOICE.CREATED, invoice, HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await InvoiceService.updateStatus(req.params.id as string, req.body.status, req.user!.id);
      return ApiResponse.success(res, MESSAGES.INVOICE.UPDATED, updated);
    } catch (error) {
      next(error);
    }
  }

  static async generatePdf(req: Request, res: Response, next: NextFunction) {
    try {
      const invoice = await InvoiceService.getById(req.params.id as string);
      return PdfService.generateInvoicePdf(invoice, res);
    } catch (error) {
      next(error);
    }
  }
}
