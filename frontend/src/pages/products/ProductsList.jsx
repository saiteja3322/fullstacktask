import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../redux/slices/productSlice';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import { Skeleton } from '../../components/common/Skeleton';
import { useAuth } from '../../hooks/useAuth';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiBox, FiGrid, FiList, FiAlertCircle } from 'react-icons/fi';

export const ProductsList = () => {
  const dispatch = useDispatch();
  const { hasRole } = useAuth();
  const { items, meta, loading } = useSelector((state) => state.products);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Electronics',
    price: '',
    stock: '',
    minimumStock: '5',
    warehouse: 'Main Warehouse',
    description: '',
    image: null,
  });

  useEffect(() => {
    dispatch(fetchProducts({ search, category, page, limit: 10 }));
  }, [dispatch, search, category, page]);

  const handleOpenCreateModal = () => {
    setSelectedProduct(null);
    setFormData({
      name: '',
      sku: '',
      category: 'Electronics',
      price: '',
      stock: '',
      minimumStock: '5',
      warehouse: 'Main Warehouse',
      description: '',
      image: null,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setSelectedProduct(prod);
    setFormData({
      name: prod.name || '',
      sku: prod.sku || '',
      category: prod.category || 'Electronics',
      price: prod.price || '',
      stock: prod.stock || '',
      minimumStock: prod.minimumStock || '5',
      warehouse: prod.warehouse || 'Main Warehouse',
      description: prod.description || '',
      image: null,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });

    if (selectedProduct) {
      await dispatch(updateProduct({ id: selectedProduct.id, formData: data }));
    } else {
      await dispatch(createProduct(data));
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete product item from catalog?')) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Product Catalog & Master Stock</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Manage catalog items, pricing, SKU codes, and minimum stock alerts</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-200 dark:bg-slate-800 rounded-xl p-1 border border-slate-300 dark:border-slate-700">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-sm transition-colors ${viewMode === 'table' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
              title="Table View"
            >
              <FiList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-sm transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
              title="Grid View"
            >
              <FiGrid className="w-4 h-4" />
            </button>
          </div>

          {hasRole('ADMIN', 'WAREHOUSE') && (
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-900 dark:text-slate-200 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Hardware">Hardware</option>
            <option value="Office Supplies">Office Supplies</option>
            <option value="Industrial">Industrial</option>
            <option value="Consumer Goods">Consumer Goods</option>
          </select>
        </div>
      </div>

      {/* Content View */}
      {loading ? (
        <div className="p-6 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800">
          <Skeleton height="h-12" count={5} />
        </div>
      ) : viewMode === 'table' ? (
        <div className="glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/60">
                  <th className="py-4 px-6">Product Details</th>
                  <th className="py-4 px-6">SKU Code</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price (₹)</th>
                  <th className="py-4 px-6">Stock Level</th>
                  <th className="py-4 px-6">Warehouse</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {items.length > 0 ? (
                  items.map((prod) => {
                    const isLow = prod.stock <= prod.minimumStock;
                    return (
                      <tr key={prod.id} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 overflow-hidden shrink-0">
                              {prod.image ? (
                                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                              ) : (
                                <FiBox className="w-5 h-5" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-slate-100">{prod.name}</div>
                              {prod.description && (
                                <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">{prod.description}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-mono text-slate-700 dark:text-slate-300 font-medium">{prod.sku}</td>
                        <td className="py-4 px-6">
                          <Badge variant="blue">{prod.category}</Badge>
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-100">₹{prod.price.toFixed(2)}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className={`font-extrabold ${isLow ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                              {prod.stock} units
                            </span>
                            {isLow && (
                              <span className="flex items-center gap-1 text-[10px] bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full border border-rose-500/20 font-bold">
                                <FiAlertCircle className="w-3 h-3" /> Low Stock
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400 font-medium">{prod.warehouse}</td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {hasRole('ADMIN', 'WAREHOUSE') && (
                              <button
                                onClick={() => handleOpenEditModal(prod)}
                                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 transition-colors"
                                title="Edit Product"
                              >
                                <FiEdit className="w-4 h-4" />
                              </button>
                            )}
                            {hasRole('ADMIN') && (
                              <button
                                onClick={() => handleDelete(prod.id)}
                                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 transition-colors"
                                title="Delete Product"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                      No products found. Click "Add Product" to add one to the catalog.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((prod) => {
            const isLow = prod.stock <= prod.minimumStock;
            return (
              <div
                key={prod.id}
                className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-40 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/60 mb-4 overflow-hidden flex items-center justify-center text-slate-400 relative">
                    {prod.image ? (
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                    ) : (
                      <FiBox className="w-12 h-12 stroke-[1.5]" />
                    )}
                    {isLow && (
                      <span className="absolute top-2 right-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                        Low Stock
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="blue">{prod.category}</Badge>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-medium">SKU: {prod.sku}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mt-2">{prod.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{prod.description || 'No description'}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Price</span>
                    <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100">₹{prod.price.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Stock</span>
                    <p className={`text-sm font-extrabold ${isLow ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {prod.stock} units
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProduct ? 'Edit Product Item' : 'Add Product to Catalog'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enterprise Industrial Router X1"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">SKU Code *</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="PRD-ELE-009"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500 uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="Electronics">Electronics</option>
                <option value="Hardware">Hardware</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Industrial">Industrial</option>
                <option value="Consumer Goods">Consumer Goods</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="299.99"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Initial Stock Level</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="50"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Minimum Stock Threshold</label>
              <input
                type="number"
                value={formData.minimumStock}
                onChange={(e) => setFormData({ ...formData, minimumStock: e.target.value })}
                placeholder="5"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Warehouse Location</label>
              <input
                type="text"
                value={formData.warehouse}
                onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                placeholder="Main Warehouse - Hub A"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Product specification and details..."
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Product Image File</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-700 dark:text-slate-300 text-xs focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/20"
            >
              Save Product
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
