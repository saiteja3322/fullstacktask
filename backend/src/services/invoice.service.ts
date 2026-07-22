import { InvoiceRepository } from '../repositories/invoice.repository.js';
import { ChallanRepository } from '../repositories/challan.repository.js';
import { ActivityLogRepository } from '../repositories/activityLog.repository.js';
import { IPaginationQuery } from '../interfaces/query.interface.js';
import { generateInvoiceNumber } from '../utils/numberGenerator.js';
import { ApiError } from '../utils/apiError.js';
import { InvoiceStatus } from '@prisma/client';

export class InvoiceService {
  static async getAll(query: IPaginationQuery) {
    return InvoiceRepository.findAll(query);
  }

  static async getById(id: string) {
    const invoice = await InvoiceRepository.findById(id);
    if (!invoice) throw ApiError.notFound('Invoice not found');
    return invoice;
  }

  static async createFromChallan(data: { challanId: string; tax?: number; discount?: number; status?: InvoiceStatus }, userId: string) {
    const challan = await ChallanRepository.findById(data.challanId);
    if (!challan) throw ApiError.notFound('Sales Challan not found');

    const existingInvoice = await InvoiceRepository.findByChallanId(data.challanId);
    if (existingInvoice) {
      throw ApiError.conflict('An invoice for this Sales Challan has already been generated');
    }

    const subtotal = challan.grandTotal;
    const discount = data.discount || 0;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = data.tax !== undefined ? data.tax : taxableAmount * 0.18; // Default 18% GST
    const grandTotal = taxableAmount + tax;

    const invoiceNumber = generateInvoiceNumber();

    const invoice = await InvoiceRepository.create({
      invoiceNumber,
      challanId: data.challanId,
      tax: parseFloat(tax.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      grandTotal: parseFloat(grandTotal.toFixed(2)),
      status: data.status || InvoiceStatus.UNPAID,
    });

    await ActivityLogRepository.create(userId, `INVOICE_GENERATED: ${invoiceNumber}`, 'INVOICE');
    return invoice;
  }

  static async updateStatus(id: string, status: InvoiceStatus, userId: string) {
    await this.getById(id);
    const updated = await InvoiceRepository.updateStatus(id, status);
    await ActivityLogRepository.create(userId, `INVOICE_STATUS_UPDATED: ${updated.invoiceNumber} to ${status}`, 'INVOICE');
    return updated;
  }
}
