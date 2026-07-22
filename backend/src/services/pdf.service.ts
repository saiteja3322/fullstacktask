import PDFDocument from 'pdfkit';
import { Response } from 'express';

export class PdfService {
  static generateInvoicePdf(invoice: any, res: Response) {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=Invoice-${invoice.invoiceNumber}.pdf`);

    doc.pipe(res);

    // Header
    doc
      .fontSize(20)
      .text('MINI ERP + CRM OPERATIONS PORTAL', { align: 'center' })
      .moveDown(0.5);

    doc
      .fontSize(14)
      .fillColor('#2563EB')
      .text(`TAX INVOICE: ${invoice.invoiceNumber}`, { align: 'center' })
      .moveDown(1.5);

    // Details Block
    doc.fillColor('#000000').fontSize(10);
    doc.text(`Invoice Date: ${new Date(invoice.createdAt).toLocaleDateString()}`);
    doc.text(`Status: ${invoice.status}`);
    doc.text(`Challan Reference: ${invoice.challan.challanNumber}`);
    doc.moveDown();

    // Customer Info
    doc.fontSize(12).text('Billed To:', { underline: true });
    doc.fontSize(10).text(`Name: ${invoice.challan.customer.customerName}`);
    if (invoice.challan.customer.businessName) {
      doc.text(`Business: ${invoice.challan.customer.businessName}`);
    }
    doc.text(`Mobile: ${invoice.challan.customer.mobile}`);
    if (invoice.challan.customer.GST) {
      doc.text(`GST Number: ${invoice.challan.customer.GST}`);
    }
    doc.moveDown(1.5);

    // Items Table Header
    doc.fontSize(10).text('Product Description', 50, doc.y, { width: 250 });
    doc.text('Qty', 300, doc.y, { width: 50 });
    doc.text('Price (Rs)', 360, doc.y, { width: 80 });
    doc.text('Total (Rs)', 450, doc.y, { width: 100 });
    doc.moveDown(0.5);
    doc.text('---------------------------------------------------------------------------------------------------');
    doc.moveDown(0.5);

    // Items List
    let subtotal = 0;
    invoice.challan.items.forEach((item: any) => {
      const lineTotal = item.price * item.quantity;
      subtotal += lineTotal;
      const snapshot = item.productSnapshot as any;

      doc.text(snapshot.name || 'Product Item', 50, doc.y, { width: 240 });
      doc.text(item.quantity.toString(), 300, doc.y, { width: 50 });
      doc.text(`Rs. ${item.price.toFixed(2)}`, 360, doc.y, { width: 80 });
      doc.text(`Rs. ${lineTotal.toFixed(2)}`, 450, doc.y, { width: 100 });
      doc.moveDown(0.5);
    });

    doc.moveDown();
    doc.text('---------------------------------------------------------------------------------------------------');
    doc.moveDown(0.5);

    // Calculations
    doc.text(`Subtotal: Rs. ${subtotal.toFixed(2)}`, { align: 'right' });
    doc.text(`Discount: -Rs. ${invoice.discount.toFixed(2)}`, { align: 'right' });
    doc.text(`GST (18%): +Rs. ${invoice.tax.toFixed(2)}`, { align: 'right' });
    doc.fontSize(12).fillColor('#1E40AF').text(`Grand Total: Rs. ${invoice.grandTotal.toFixed(2)}`, { align: 'right' });

    doc.moveDown(2);
    doc.fontSize(9).fillColor('#6B7280').text('Thank you for doing business with us!', { align: 'center' });

    doc.end();
  }

  static generateChallanPdf(challan: any, res: Response) {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=Challan-${challan.challanNumber}.pdf`);

    doc.pipe(res);

    doc.fontSize(20).text('SALES DELIVERY CHALLAN', { align: 'center' }).moveDown(0.5);
    doc.fontSize(12).fillColor('#059669').text(`Challan No: ${challan.challanNumber}`, { align: 'center' }).moveDown(1.5);

    doc.fillColor('#000000').fontSize(10);
    doc.text(`Date: ${new Date(challan.createdAt).toLocaleDateString()}`);
    doc.text(`Status: ${challan.status}`);
    doc.moveDown();

    doc.fontSize(12).text('Customer Details:', { underline: true });
    doc.fontSize(10).text(`Name: ${challan.customer.customerName}`);
    doc.text(`Mobile: ${challan.customer.mobile}`);
    doc.text(`Address: ${challan.customer.address || 'N/A'}`);
    doc.moveDown(1.5);

    doc.text('Item Description', 50, doc.y, { width: 300 });
    doc.text('Quantity', 380, doc.y, { width: 100 });
    doc.moveDown(0.5);
    doc.text('---------------------------------------------------------------------------------------------------');
    doc.moveDown(0.5);

    challan.items.forEach((item: any) => {
      const snapshot = item.productSnapshot as any;
      doc.text(snapshot.name || 'Product Item', 50, doc.y, { width: 300 });
      doc.text(item.quantity.toString(), 380, doc.y, { width: 100 });
      doc.moveDown(0.5);
    });

    doc.moveDown();
    doc.fontSize(11).text(`Total Dispatch Quantity: ${challan.totalQuantity}`, { align: 'right' });
    doc.end();
  }
}
