import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  updateCustomerFollowUp,
} from '../../redux/slices/customerSlice';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import { Skeleton } from '../../components/common/Skeleton';
import { useAuth } from '../../hooks/useAuth';
import { exportToCSV } from '../../utils/exportUtils';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiCalendar, FiDownload, FiCheckCircle } from 'react-icons/fi';

export const CustomersList = () => {
  const dispatch = useDispatch();
  const { hasRole } = useAuth();
  const { items, meta, loading } = useSelector((state) => state.customers);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [formData, setFormData] = useState({
    customerName: '',
    businessName: '',
    mobile: '',
    email: '',
    GST: '',
    address: '',
    customerType: 'RETAIL',
    status: 'LEAD',
  });

  const [followUpDate, setFollowUpDate] = useState('');

  useEffect(() => {
    dispatch(fetchCustomers({ search, status: statusFilter, page, limit: 10 }));
  }, [dispatch, search, statusFilter, page]);

  const handleOpenCreateModal = () => {
    setSelectedCustomer(null);
    setFormData({
      customerName: '',
      businessName: '',
      mobile: '',
      email: '',
      GST: '',
      address: '',
      customerType: 'RETAIL',
      status: 'LEAD',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cust) => {
    setSelectedCustomer(cust);
    setFormData({
      customerName: cust.customerName || '',
      businessName: cust.businessName || '',
      mobile: cust.mobile || '',
      email: cust.email || '',
      GST: cust.GST || '',
      address: cust.address || '',
      customerType: cust.customerType || 'RETAIL',
      status: cust.status || 'LEAD',
    });
    setIsModalOpen(true);
  };

  const handleOpenFollowUpModal = (cust) => {
    setSelectedCustomer(cust);
    setFollowUpDate(cust.followUpDate ? new Date(cust.followUpDate).toISOString().substring(0, 10) : '');
    setIsFollowUpModalOpen(true);
  };

  const handleSubmitCustomer = async (e) => {
    e.preventDefault();
    if (selectedCustomer) {
      await dispatch(updateCustomer({ id: selectedCustomer.id, customerData: formData }));
    } else {
      await dispatch(createCustomer(formData));
    }
    setIsModalOpen(false);
  };

  const handleSubmitFollowUp = async (e) => {
    e.preventDefault();
    if (selectedCustomer) {
      await dispatch(updateCustomerFollowUp({ id: selectedCustomer.id, followUpData: { followUpDate } }));
    }
    setIsFollowUpModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      dispatch(deleteCustomer(id));
    }
  };

  const handleExport = () => {
    const exportData = items.map((c) => ({
      Name: c.customerName,
      Business: c.businessName || '',
      Mobile: c.mobile,
      Email: c.email || '',
      GST: c.GST || '',
      Type: c.customerType,
      Status: c.status,
      Address: c.address || '',
    }));
    exportToCSV(exportData, 'ERP_Customers_Export.csv');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">CRM Customers & Leads</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Manage sales lead pipeline, follow-ups, and customer profiles</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm"
          >
            <FiDownload className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          {hasRole('ADMIN', 'SALES') && (
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Customer</span>
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
            placeholder="Search by name, business, mobile..."
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
            <option value="LEAD">Lead</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
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
                  <th className="py-4 px-6">Customer & Business</th>
                  <th className="py-4 px-6">Contact Info</th>
                  <th className="py-4 px-6">Type & GST</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Follow-up Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {items.length > 0 ? (
                  items.map((cust) => (
                    <tr key={cust.id} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{cust.customerName}</div>
                        {cust.businessName && <div className="text-xs text-slate-500 dark:text-slate-400">{cust.businessName}</div>}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-mono text-slate-800 dark:text-slate-200 font-medium">{cust.mobile}</div>
                        {cust.email && <div className="text-xs text-slate-500 dark:text-slate-400">{cust.email}</div>}
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="purple">{cust.customerType}</Badge>
                        {cust.GST && (
                          <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                            <FiCheckCircle className="w-3 h-3" /> GST: {cust.GST}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={cust.status === 'ACTIVE' ? 'green' : cust.status === 'LEAD' ? 'amber' : 'gray'}>
                          {cust.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        {cust.followUpDate ? (
                          <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700">
                            {new Date(cust.followUpDate).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">Not scheduled</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenFollowUpModal(cust)}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-600 dark:text-amber-400 transition-colors"
                            title="Schedule Follow-up"
                          >
                            <FiCalendar className="w-4 h-4" />
                          </button>
                          {hasRole('ADMIN', 'SALES') && (
                            <button
                              onClick={() => handleOpenEditModal(cust)}
                              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 transition-colors"
                              title="Edit Customer"
                            >
                              <FiEdit className="w-4 h-4" />
                            </button>
                          )}
                          {hasRole('ADMIN') && (
                            <button
                              onClick={() => handleDelete(cust.id)}
                              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 transition-colors"
                              title="Delete Customer"
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
                    <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                      No customers found. Click "Add Customer" to create one.
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

      {/* Add / Edit Customer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCustomer ? 'Edit Customer Details' : 'Add New CRM Customer'}
      >
        <form onSubmit={handleSubmitCustomer} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Customer Full Name *</label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Apex Global Traders"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Business / Company Name</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="Apex Enterprise Ltd"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile Number *</label>
              <input
                type="tel"
                required
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@apex.com"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">GST Identification Number</label>
              <input
                type="text"
                value={formData.GST}
                onChange={(e) => setFormData({ ...formData, GST: e.target.value })}
                placeholder="27AAAPA1234A1Z5"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500 font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Customer Type</label>
              <select
                value={formData.customerType}
                onChange={(e) => setFormData({ ...formData, customerType: e.target.value })}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="RETAIL">Retail</option>
                <option value="WHOLESALE">Wholesale</option>
                <option value="CORPORATE">Corporate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Pipeline Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="LEAD">Lead</option>
                <option value="ACTIVE">Active Client</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Billing & Delivery Address</label>
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Suite 402, Trade Center..."
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
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
              Save Customer
            </button>
          </div>
        </form>
      </Modal>

      {/* Schedule Follow-Up Modal */}
      <Modal
        isOpen={isFollowUpModalOpen}
        onClose={() => setIsFollowUpModalOpen(false)}
        title={`Schedule Follow-up with ${selectedCustomer?.customerName}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmitFollowUp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Next Follow-up Date *</label>
            <input
              type="date"
              required
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsFollowUpModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/20"
            >
              Schedule Date
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
