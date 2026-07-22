import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvoices, updateInvoiceStatus } from '../../redux/slices/invoiceSlice';
import { invoiceService } from '../../services/invoiceService';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import { Skeleton } from '../../components/common/Skeleton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiDollarSign, FiPrinter, FiCheckCircle, FiClock, FiEye } from 'react-icons/fi';

export const InvoicesList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const { items, meta, loading } = useSelector((state) => state.invoices);

  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchInvoices({ status: statusFilter, page, limit: 10 }));
  }, [dispatch, statusFilter, page]);

  const handleToggleStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'PAID' ? 'UNPAID' : 'PAID';
    if (window.confirm(`Mark invoice payment status as ${nextStatus}?`)) {
      dispatch(updateInvoiceStatus({ id, status: nextStatus }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <FiDollarSign className="text-blue-600 dark:text-blue-400" />
            <span>Invoices & Billing Portal</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Formal tax invoice generation, payment tracking, and PDF receipts</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-200 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="">All Payment Statuses</option>
            <option value="UNPAID">Unpaid</option>
            <option value="PAID">Paid</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-6">
            <Skeleton height="h-12" count={5} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/60">
                  <th className="py-4 px-6">Invoice Number</th>
                  <th className="py-4 px-6">Challan Ref</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Tax / Discount</th>
                  <th className="py-4 px-6">Grand Total</th>
                  <th className="py-4 px-6">Payment Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {items.length > 0 ? (
                  items.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-blue-600 dark:text-blue-400">{inv.invoiceNumber}</td>
                      <td className="py-4 px-6 font-mono text-slate-600 dark:text-slate-400 text-xs font-medium">{inv.challan?.challanNumber}</td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 dark:text-slate-200">{inv.challan?.customer?.customerName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{inv.challan?.customer?.mobile}</div>
                      </td>
                      <td className="py-4 px-6 text-xs font-mono text-slate-600 dark:text-slate-400 font-medium">
                        <div>Tax: +₹{inv.tax?.toFixed(2)}</div>
                        <div>Disc: -₹{inv.discount?.toFixed(2)}</div>
                      </td>
                      <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-slate-100 text-base">₹{inv.grandTotal?.toFixed(2)}</td>
                      <td className="py-4 px-6">
                        <Badge variant={inv.status === 'PAID' ? 'green' : inv.status === 'UNPAID' ? 'amber' : 'red'}>
                          {inv.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/invoices/${inv.id}`)}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                            title="View Invoice Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => invoiceService.downloadPdf(inv.id)}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 transition-colors"
                            title="Download PDF"
                          >
                            <FiPrinter className="w-4 h-4" />
                          </button>

                          {hasRole('ADMIN', 'ACCOUNTS') && (
                            <button
                              onClick={() => handleToggleStatus(inv.id, inv.status)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                                inv.status === 'PAID'
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                              }`}
                              title="Toggle Payment Status"
                            >
                              {inv.status === 'PAID' ? (
                                <>
                                  <FiClock className="w-3.5 h-3.5" /> Mark Unpaid
                                </>
                              ) : (
                                <>
                                  <FiCheckCircle className="w-3.5 h-3.5" /> Mark Paid
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                      No invoices found. Generate invoices from confirmed delivery challans.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <Pagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
