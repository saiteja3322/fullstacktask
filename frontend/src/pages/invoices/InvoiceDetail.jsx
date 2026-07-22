import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchInvoiceById, updateInvoiceStatus } from '../../redux/slices/invoiceSlice';
import { invoiceService } from '../../services/invoiceService';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { FiArrowLeft, FiPrinter, FiCheckCircle } from 'react-icons/fi';

export const InvoiceDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentInvoice, loading } = useSelector((state) => state.invoices);

  useEffect(() => {
    dispatch(fetchInvoiceById(id));
  }, [dispatch, id]);

  if (loading || !currentInvoice) {
    return (
      <div className="p-6">
        <Skeleton height="h-32" count={2} />
      </div>
    );
  }

  const challan = currentInvoice.challan || {};
  const customer = challan.customer || {};

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/invoices')}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Invoices</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => invoiceService.downloadPdf(id)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <FiPrinter className="w-4 h-4" />
            <span>Download Invoice PDF</span>
          </button>

          {currentInvoice.status === 'UNPAID' && (
            <button
              onClick={() => dispatch(updateInvoiceStatus({ id, status: 'PAID' }))}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <FiCheckCircle className="w-4 h-4" />
              <span>Mark as Paid</span>
            </button>
          )}
        </div>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">TAX INVOICE</span>
            <h1 className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">{currentInvoice.invoiceNumber}</h1>
          </div>
          <div>
            <Badge variant={currentInvoice.status === 'PAID' ? 'green' : 'amber'} size="lg">
              {currentInvoice.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-xs uppercase text-slate-400 font-bold tracking-wider">Billed To:</h3>
            <p className="text-lg font-bold text-slate-100">{customer.customerName}</p>
            {customer.businessName && <p className="text-sm text-slate-300">{customer.businessName}</p>}
            <p className="text-sm text-slate-400 font-mono">Mobile: {customer.mobile}</p>
            {customer.GST && <p className="text-xs font-mono text-emerald-400">GSTIN: {customer.GST}</p>}
          </div>

          <div className="space-y-2 sm:text-right">
            <h3 className="text-xs uppercase text-slate-400 font-bold tracking-wider">Invoice Metadata:</h3>
            <p className="text-sm text-slate-300">
              Invoice Date: <span className="font-mono text-slate-100">{new Date(currentInvoice.createdAt).toLocaleDateString()}</span>
            </p>
            <p className="text-sm text-slate-300">
              Challan Ref: <span className="font-mono text-blue-400">{challan.challanNumber}</span>
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-900/80">
                <th className="py-3.5 px-6">Product Item</th>
                <th className="py-3.5 px-6">Quantity</th>
                <th className="py-3.5 px-6">Unit Price</th>
                <th className="py-3.5 px-6 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {challan.items?.map((item) => {
                const snapshot = item.productSnapshot || {};
                const lineTotal = item.price * item.quantity;
                return (
                  <tr key={item.id}>
                    <td className="py-4 px-6 font-semibold text-slate-200">{snapshot.name || 'Product'}</td>
                    <td className="py-4 px-6 font-mono text-slate-300">{item.quantity}</td>
                    <td className="py-4 px-6 font-mono text-slate-300">₹{item.price.toFixed(2)}</td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-100 text-right">₹{lineTotal.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <div className="w-full sm:w-72 space-y-2 text-right">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Items Subtotal:</span>
              <span className="font-mono text-slate-200">₹{challan.grandTotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Discount:</span>
              <span className="font-mono text-rose-400">-₹{currentInvoice.discount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">GST (18%):</span>
              <span className="font-mono text-emerald-400">+₹{currentInvoice.tax?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-extrabold text-blue-400 pt-2 border-t border-slate-800">
              <span>Grand Total:</span>
              <span className="font-mono">₹{currentInvoice.grandTotal?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
