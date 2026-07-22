import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createChallan } from '../../redux/slices/challanSlice';
import { fetchCustomers } from '../../redux/slices/customerSlice';
import { fetchProducts } from '../../redux/slices/productSlice';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2, FiArrowLeft, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const ChallanCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const customers = useSelector((state) => state.customers.items);
  const products = useSelector((state) => state.products.items);

  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([
    { productId: '', quantity: 1, price: 0 },
  ]);

  useEffect(() => {
    dispatch(fetchCustomers({ limit: 100 }));
    dispatch(fetchProducts({ limit: 100 }));
  }, [dispatch]);

  const handleProductChange = (index, prodId) => {
    const selectedProd = products.find((p) => p.id === prodId);
    const updatedItems = [...items];
    updatedItems[index].productId = prodId;
    updatedItems[index].price = selectedProd ? selectedProd.price : 0;
    setItems(updatedItems);
  };

  const handleQuantityChange = (index, qty) => {
    const updatedItems = [...items];
    updatedItems[index].quantity = Math.max(1, Number(qty));
    setItems(updatedItems);
  };

  const handleAddItemRow = () => {
    setItems([...items, { productId: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveItemRow = (index) => {
    if (items.length === 1) {
      toast.error('Challan must contain at least one item');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const grandTotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId) {
      toast.error('Please select a customer');
      return;
    }
    const invalidItems = items.some((it) => !it.productId || it.quantity <= 0);
    if (invalidItems) {
      toast.error('Please select valid products for all line items');
      return;
    }

    const payload = {
      customerId,
      items: items.map((it) => ({
        productId: it.productId,
        quantity: Number(it.quantity),
        price: Number(it.price),
      })),
    };

    const res = await dispatch(createChallan(payload));
    if (createChallan.fulfilled.match(res)) {
      navigate('/challans');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/challans')}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Challans</span>
        </button>

        <h1 className="text-xl font-bold text-slate-100">Create New Sales Delivery Challan</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Selection Card */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider text-xs">Customer Selection</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select CRM Customer *</label>
            <select
              required
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">-- Choose Customer --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.customerName} {c.businessName ? `(${c.businessName})` : ''} — {c.mobile}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Line Items Card */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider text-xs">Line Item Products</h3>
            <button
              type="button"
              onClick={handleAddItemRow}
              className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <FiPlus className="w-3.5 h-3.5" /> Add Row
            </button>
          </div>

          <div className="space-y-3">
            {items.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-3 items-center bg-slate-800/50 p-3 rounded-2xl border border-slate-700/60"
              >
                <div className="col-span-12 sm:col-span-6">
                  <label className="block text-[10px] uppercase text-slate-400 font-semibold mb-1">Product</label>
                  <select
                    required
                    value={row.productId}
                    onChange={(e) => handleProductChange(index, e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- Select Product --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (SKU: {p.sku} | Stock: {p.stock} | ₹{p.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <label className="block text-[10px] uppercase text-slate-400 font-semibold mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={row.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <label className="block text-[10px] uppercase text-slate-400 font-semibold mb-1">Price (₹)</label>
                  <input
                    type="number"
                    readOnly
                    value={row.price}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 text-sm font-mono cursor-not-allowed"
                  />
                </div>

                <div className="col-span-3 sm:col-span-1 text-right">
                  <label className="block text-[10px] uppercase text-slate-400 font-semibold mb-1">Total</label>
                  <div className="text-sm font-bold text-emerald-400 font-mono py-2">
                    ₹{(row.quantity * row.price).toFixed(2)}
                  </div>
                </div>

                <div className="col-span-1 text-right">
                  <button
                    type="button"
                    onClick={() => handleRemoveItemRow(index)}
                    className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Row */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-400">
              Total Quantity: <strong className="text-slate-200 font-mono">{totalQuantity} units</strong>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Estimated Grand Total</span>
              <span className="text-2xl font-extrabold text-blue-400 font-mono">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/challans')}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center gap-2 transition-all"
          >
            <FiCheck className="w-5 h-5" />
            <span>Generate Delivery Challan</span>
          </button>
        </div>
      </form>
    </div>
  );
};
