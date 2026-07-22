import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChallans, confirmChallan, cancelChallan, deleteChallan } from '../../redux/slices/challanSlice';
import { createInvoice } from '../../redux/slices/invoiceSlice';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import { Skeleton } from '../../components/common/Skeleton';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiCheckCircle, FiXCircle, FiTrash2, FiFileText, FiEye, FiDollarSign } from 'react-icons/fi';

export const ChallansList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const { items, meta, loading } = useSelector((state) => state.challans);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedChallanForInvoice, setSelectedChallanForInvoice] = useState(null);
  const [tax, setTax] = useState('0');
  const [discount, setDiscount] = useState('0');

  useEffect(() => {
    dispatch(fetchChallans({ search, status: statusFilter, page, limit: 10 }));
  }, [dispatch, search, statusFilter, page]);

  const handleConfirm = (id) => {
    if (window.confirm('Confirm and dispatch this sales delivery challan? Item stock will be deducted.')) {
      dispatch(confirmChallan(id));
    }
  };

  const handleCancel = (id) => {
    if (window.confirm('Cancel this sales challan?')) {
      dispatch(cancelChallan(id));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this draft sales challan permanently?')) {
      dispatch(deleteChallan(id));
    }
  };

  const handleOpenGenerateInvoiceModal = (ch) => {
    setSelectedChallanForInvoice(ch);
    const calculatedTax = (ch.grandTotal * 0.18).toFixed(2); // Default 18% GST
    setTax(calculatedTax);
    setDiscount('0');
    setIsInvoiceModalOpen(true);
  };

  const handleCreateInvoiceSubmit = async (e) => {
    e.preventDefault();
    if (selectedChallanForInvoice) {
      const res = await dispatch(
        createInvoice({
          challanId: selectedChallanForInvoice.id,
          tax: Number(tax),
          discount: Number(discount),
        })
      );
      if (createInvoice.fulfilled.match(res)) {
        setIsInvoiceModalOpen(false);
        navigate(`/invoices/${res.payload.id}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sales Delivery Challans</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Build delivery notes, dispatch stock items, and convert confirmed challans to Tax Invoices
          </p>
        </div>

        {hasRole('ADMIN', 'SALES') && (
          <button
            onClick={() => navigate('/challans/new')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
          >
            <FiPlus className="w-4 h-4" />
            <span>Create New Challan</span>
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by challan no, customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-900 dark:text-slate-200 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="CONFIRMED">Confirmed</option>
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
                  <th className="py-4 px-6">Challan Code</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Quantity</th>
                  <th className="py-4 px-6">Grand Total</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {items.length > 0 ? (
                  items.map((ch) => (
                    <tr key={ch.id} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-blue-600 dark:text-blue-400">{ch.challanNumber}</td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900 dark:text-slate-200">{ch.customer?.customerName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{ch.customer?.mobile}</div>
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-700 dark:text-slate-300 font-medium">{ch.totalQuantity} items</td>
                      <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-slate-100">₹{ch.grandTotal?.toFixed(2)}</td>
                      <td className="py-4 px-6">
                        <Badge
                          variant={ch.status === 'CONFIRMED' ? 'green' : ch.status === 'DRAFT' ? 'amber' : 'red'}
                        >
                          {ch.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">
                        {new Date(ch.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View Detail */}
                          <button
                            onClick={() => navigate(`/challans/${ch.id}`)}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                            title="View Challan Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>

                          {/* Confirm Action */}
                          {ch.status === 'DRAFT' && hasRole('ADMIN', 'WAREHOUSE', 'SALES') && (
                            <button
                              onClick={() => handleConfirm(ch.id)}
                              className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors"
                              title="Confirm & Dispatch Stock"
                            >
                              <FiCheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* Generate Invoice Action */}
                          {ch.status === 'CONFIRMED' && hasRole('ADMIN', 'ACCOUNTS', 'SALES') && (
                            <button
                              onClick={() => handleOpenGenerateInvoiceModal(ch)}
                              className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors"
                              title="Generate Tax Invoice"
                            >
                              <FiDollarSign className="w-4 h-4" />
                            </button>
                          )}

                          {/* Cancel Action */}
                          {ch.status === 'DRAFT' && hasRole('ADMIN', 'SALES') && (
                            <button
                              onClick={() => handleCancel(ch.id)}
                              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-600 dark:text-amber-400 transition-colors"
                              title="Cancel Delivery Challan"
                            >
                              <FiXCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete Action */}
                          {ch.status === 'DRAFT' && hasRole('ADMIN') && (
                            <button
                              onClick={() => handleDelete(ch.id)}
                              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 transition-colors"
                              title="Delete Challan"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                      No delivery challans found. Click "Create New Challan" to build one.
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

      {/* Generate Tax Invoice Modal */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title={`Generate Invoice for Challan #${selectedChallanForInvoice?.challanNumber}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Customer:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-200">{selectedChallanForInvoice?.customer?.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Items Subtotal:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">₹{selectedChallanForInvoice?.grandTotal?.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tax Amount (₹ / 18% GST)</label>
            <input
              type="number"
              step="0.01"
              required
              value={tax}
              onChange={(e) => setTax(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Discount Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 flex items-center justify-between">
            <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">Final Invoice Grand Total:</span>
            <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
              ₹{(
                (selectedChallanForInvoice?.grandTotal || 0) +
                Number(tax || 0) -
                Number(discount || 0)
              ).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsInvoiceModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/20"
            >
              Generate Tax Invoice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
