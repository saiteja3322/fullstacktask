import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/slices/productSlice';
import { stockIn, stockOut, adjustStock, transferStock } from '../../redux/slices/inventorySlice';
import { Modal } from '../../components/common/Modal';
import { Skeleton } from '../../components/common/Skeleton';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FiArrowDownLeft, FiArrowUpRight, FiSliders, FiRepeat, FiAlertCircle, FiBox, FiLayers } from 'react-icons/fi';

export const InventoryList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const { items, loading } = useSelector((state) => state.products);

  const [activeModal, setActiveModal] = useState(null); // 'in', 'out', 'adjust', 'transfer' or null
  const [selectedProduct, setSelectedProduct] = useState('');

  const [movementForm, setMovementForm] = useState({
    quantity: '',
    reason: '',
  });

  const [transferForm, setTransferForm] = useState({
    fromWarehouse: 'Main Warehouse',
    toWarehouse: 'Secondary Hub B',
    quantity: '',
    reason: '',
  });

  useEffect(() => {
    dispatch(fetchProducts({ limit: 100 }));
  }, [dispatch]);

  const handleOpenMovementModal = (type) => {
    setActiveModal(type);
    setSelectedProduct(items[0]?.id || '');
    setMovementForm({ quantity: '', reason: '' });
    setTransferForm({
      fromWarehouse: 'Main Warehouse',
      toWarehouse: 'Secondary Hub B',
      quantity: '',
      reason: '',
    });
  };

  const handleMovementSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      productId: selectedProduct,
      quantity: Number(movementForm.quantity),
      reason: movementForm.reason,
    };

    if (activeModal === 'in') {
      await dispatch(stockIn(payload));
    } else if (activeModal === 'out') {
      await dispatch(stockOut(payload));
    } else if (activeModal === 'adjust') {
      await dispatch(adjustStock(payload));
    }

    dispatch(fetchProducts({ limit: 100 }));
    setActiveModal(null);
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    await dispatch(
      transferStock({
        productId: selectedProduct,
        fromWarehouse: transferForm.fromWarehouse,
        toWarehouse: transferForm.toWarehouse,
        quantity: Number(transferForm.quantity),
        reason: transferForm.reason,
      })
    );
    dispatch(fetchProducts({ limit: 100 }));
    setActiveModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Inventory & Stock Operations</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Real-time stock audit, warehouse movements, and level adjustments</p>
        </div>

        {hasRole('ADMIN', 'WAREHOUSE') && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleOpenMovementModal('in')}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <FiArrowDownLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Stock In (+)</span>
            </button>
            <button
              onClick={() => handleOpenMovementModal('out')}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <FiArrowUpRight className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Stock Out (-)</span>
            </button>
            <button
              onClick={() => handleOpenMovementModal('adjust')}
              className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <FiSliders className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Adjust Stock</span>
            </button>
            <button
              onClick={() => handleOpenMovementModal('transfer')}
              className="px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <FiRepeat className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Transfer</span>
            </button>
            <button
              onClick={() => navigate('/inventory/logs')}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ml-2"
            >
              <FiLayers className="w-4 h-4" />
              <span>Audit Trail</span>
            </button>
          </div>
        )}
      </div>

      {/* Stock Table */}
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
                  <th className="py-4 px-6">Product Details</th>
                  <th className="py-4 px-6">SKU</th>
                  <th className="py-4 px-6">Current Stock</th>
                  <th className="py-4 px-6">Min Threshold</th>
                  <th className="py-4 px-6">Warehouse</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {items.map((prod) => {
                  const isLow = prod.stock <= prod.minimumStock;
                  return (
                    <tr key={prod.id} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 overflow-hidden shrink-0">
                            {prod.image ? (
                              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                            ) : (
                              <FiBox className="w-4 h-4" />
                            )}
                          </div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">{prod.name}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-700 dark:text-slate-300 font-medium">{prod.sku}</td>
                      <td className="py-4 px-6 font-mono font-extrabold text-base text-slate-900 dark:text-slate-100">{prod.stock} units</td>
                      <td className="py-4 px-6 font-mono text-slate-500 dark:text-slate-400 font-medium">{prod.minimumStock} units</td>
                      <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-400 font-medium">{prod.warehouse}</td>
                      <td className="py-4 px-6">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/30">
                            <FiAlertCircle className="w-3.5 h-3.5" /> Reorder Required
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                            Healthy Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stock In / Out / Adjust Modal */}
      <Modal
        isOpen={['in', 'out', 'adjust'].includes(activeModal)}
        onClose={() => setActiveModal(null)}
        title={
          activeModal === 'in'
            ? 'Stock In (+) - Receive Goods'
            : activeModal === 'out'
            ? 'Stock Out (-) - Dispatch Goods'
            : 'Manual Stock Adjustment'
        }
        maxWidth="max-w-md"
      >
        <form onSubmit={handleMovementSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Product *</label>
            <select
              required
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
            >
              {items.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Current: {p.stock} units | SKU: {p.sku})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {activeModal === 'adjust' ? 'New Exact Stock Level *' : 'Quantity *'}
            </label>
            <input
              type="number"
              required
              min="1"
              value={movementForm.quantity}
              onChange={(e) => setMovementForm({ ...movementForm, quantity: e.target.value })}
              placeholder={activeModal === 'adjust' ? 'e.g. 50' : 'e.g. 10'}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Reason / Notes</label>
            <input
              type="text"
              value={movementForm.reason}
              onChange={(e) => setMovementForm({ ...movementForm, reason: e.target.value })}
              placeholder="Supplier shipment PO-9912 / Damage write-off"
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/20"
            >
              Save Movement
            </button>
          </div>
        </form>
      </Modal>

      {/* Inter-Warehouse Transfer Modal */}
      <Modal
        isOpen={activeModal === 'transfer'}
        onClose={() => setActiveModal(null)}
        title="Inter-Warehouse Stock Transfer"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleTransferSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Product *</label>
            <select
              required
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
            >
              {items.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Stock: {p.stock})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">From Warehouse</label>
              <input
                type="text"
                value={transferForm.fromWarehouse}
                onChange={(e) => setTransferForm({ ...transferForm, fromWarehouse: e.target.value })}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">To Warehouse</label>
              <input
                type="text"
                value={transferForm.toWarehouse}
                onChange={(e) => setTransferForm({ ...transferForm, toWarehouse: e.target.value })}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Transfer Quantity *</label>
            <input
              type="number"
              required
              min="1"
              value={transferForm.quantity}
              onChange={(e) => setTransferForm({ ...transferForm, quantity: e.target.value })}
              placeholder="15"
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Transfer Notes</label>
            <input
              type="text"
              value={transferForm.reason}
              onChange={(e) => setTransferForm({ ...transferForm, reason: e.target.value })}
              placeholder="Regional warehouse rebalancing"
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/20"
            >
              Execute Transfer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
