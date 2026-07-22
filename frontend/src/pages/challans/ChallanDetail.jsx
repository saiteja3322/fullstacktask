import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchChallanById, confirmChallan, cancelChallan } from '../../redux/slices/challanSlice';
import { challanService } from '../../services/challanService';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { FiArrowLeft, FiPrinter, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export const ChallanDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentChallan, loading } = useSelector((state) => state.challans);

  useEffect(() => {
    dispatch(fetchChallanById(id));
  }, [dispatch, id]);

  if (loading || !currentChallan) {
    return (
      <div className="p-6">
        <Skeleton height="h-32" count={2} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/challans')}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to List</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => challanService.downloadPdf(id)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <FiPrinter className="w-4 h-4" />
            <span>Download PDF</span>
          </button>

          {currentChallan.status === 'DRAFT' && (
            <button
              onClick={() => dispatch(confirmChallan(id))}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <FiCheckCircle className="w-4 h-4" />
              <span>Confirm & Deduct Stock</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Challan Detail Card */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8">
        {/* Status Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">SALES DELIVERY CHALLAN</span>
            <h1 className="text-3xl font-extrabold text-blue-400 font-mono mt-1">{currentChallan.challanNumber}</h1>
          </div>
          <div>
            <Badge
              variant={currentChallan.status === 'CONFIRMED' ? 'green' : currentChallan.status === 'DRAFT' ? 'amber' : 'red'}
              size="lg"
            >
              {currentChallan.status}
            </Badge>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-xs uppercase text-slate-400 font-bold tracking-wider">Billed / Dispatched To:</h3>
            <p className="text-lg font-bold text-slate-100">{currentChallan.customer?.customerName}</p>
            {currentChallan.customer?.businessName && (
              <p className="text-sm text-slate-300">{currentChallan.customer.businessName}</p>
            )}
            <p className="text-sm text-slate-400 font-mono">Mobile: {currentChallan.customer?.mobile}</p>
            {currentChallan.customer?.address && (
              <p className="text-xs text-slate-400">{currentChallan.customer.address}</p>
            )}
          </div>

          <div className="space-y-2 sm:text-right">
            <h3 className="text-xs uppercase text-slate-400 font-bold tracking-wider">Challan Metadata:</h3>
            <p className="text-sm text-slate-300">
              Date: <span className="font-mono text-slate-100">{new Date(currentChallan.createdAt).toLocaleDateString()}</span>
            </p>
            <p className="text-sm text-slate-300">
              Created By: <span className="text-slate-100 font-medium">{currentChallan.user?.name || 'System'}</span>
            </p>
            <p className="text-sm text-slate-300">
              Total Line Items: <span className="font-mono text-slate-100">{currentChallan.items?.length || 0}</span>
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="rounded-2xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-900/80">
                <th className="py-3.5 px-6">Item Description</th>
                <th className="py-3.5 px-6">Quantity</th>
                <th className="py-3.5 px-6">Unit Price</th>
                <th className="py-3.5 px-6 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {currentChallan.items?.map((item) => {
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

        {/* Totals Summary */}
        <div className="flex justify-end pt-4 border-t border-slate-800">
          <div className="w-full sm:w-72 space-y-2 text-right">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Total Quantity:</span>
              <span className="font-mono text-slate-200">{currentChallan.totalQuantity} items</span>
            </div>
            <div className="flex justify-between text-lg font-extrabold text-blue-400 pt-2 border-t border-slate-800">
              <span>Grand Total:</span>
              <span className="font-mono">₹{currentChallan.grandTotal?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
