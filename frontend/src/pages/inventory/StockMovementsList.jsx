import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStockMovements } from '../../redux/slices/inventorySlice';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import { Skeleton } from '../../components/common/Skeleton';
import { FiLayers, FiFilter } from 'react-icons/fi';

export const StockMovementsList = () => {
  const dispatch = useDispatch();
  const { movements, meta, loading } = useSelector((state) => state.inventory);

  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchStockMovements({ movementType: typeFilter, page, limit: 15 }));
  }, [dispatch, typeFilter, page]);

  const getMovementBadge = (type) => {
    switch (type) {
      case 'IN':
        return <Badge variant="green">+ INWARD</Badge>;
      case 'OUT':
        return <Badge variant="red">- OUTWARD</Badge>;
      case 'ADJUSTMENT':
        return <Badge variant="amber">ADJUSTMENT</Badge>;
      case 'TRANSFER':
        return <Badge variant="purple">TRANSFER</Badge>;
      default:
        return <Badge variant="gray">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <FiLayers className="text-blue-400" />
            <span>Stock Movement Audit Logs</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Immutable ledger of all stock entry, dispatch, and adjustment records</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm">
            <FiFilter className="text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none text-xs font-semibold"
            >
              <option value="">All Movement Types</option>
              <option value="IN">Stock Inward</option>
              <option value="OUT">Stock Outward</option>
              <option value="ADJUSTMENT">Adjustment</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-6">
            <Skeleton height="h-12" count={5} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-900/60">
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6">Product Item</th>
                  <th className="py-4 px-6">Movement Type</th>
                  <th className="py-4 px-6">Quantity</th>
                  <th className="py-4 px-6">Logged By User</th>
                  <th className="py-4 px-6">Reason / Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {movements.length > 0 ? (
                  movements.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6 text-xs text-slate-400 font-mono">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-200">
                        {log.product?.name || 'Product'}
                        <span className="block text-xs font-mono text-slate-500">{log.product?.sku}</span>
                      </td>
                      <td className="py-4 px-6">{getMovementBadge(log.movementType)}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`font-extrabold font-mono text-base ${
                            log.movementType === 'IN'
                              ? 'text-emerald-400'
                              : log.movementType === 'OUT'
                              ? 'text-rose-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {log.movementType === 'IN' ? `+${log.quantity}` : log.movementType === 'OUT' ? `-${log.quantity}` : log.quantity}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-300">
                        <div className="font-semibold">{log.user?.name || 'System User'}</div>
                        <div className="text-slate-500 font-mono">{log.user?.role}</div>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-400">{log.reason || 'Standard transaction log'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No stock movement audit records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="p-4 border-t border-slate-800">
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
