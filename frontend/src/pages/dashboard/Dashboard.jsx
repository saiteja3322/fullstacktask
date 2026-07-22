import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardSummary } from '../../redux/slices/dashboardSlice';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiDollarSign,
  FiShoppingCart,
  FiUsers,
  FiBox,
  FiAlertTriangle,
  FiFileText,
  FiTrendingUp,
  FiPlusCircle,
  FiLayers,
} from 'react-icons/fi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Skeleton } from '../../components/common/Skeleton';
import { Badge } from '../../components/common/Badge';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { summary, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  const monthlySalesData = {
    labels: summary?.monthlySales?.map((d) => d.month) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: summary?.monthlySales?.map((d) => d.sales) || [45000, 52000, 61000, 58000, 74000, 89000, 95000],
        backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.85)' : 'rgba(37, 99, 235, 0.85)',
        hoverBackgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 1)' : 'rgba(29, 78, 216, 1)',
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
        titleColor: theme === 'dark' ? '#f8fafc' : '#0f172a',
        bodyColor: theme === 'dark' ? '#94a3b8' : '#475569',
        borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(203, 213, 225, 0.8)',
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: theme === 'dark' ? '#94a3b8' : '#475569', font: { weight: '600' } },
      },
      y: {
        grid: { color: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(226, 232, 240, 0.8)', drawBorder: false },
        ticks: { color: theme === 'dark' ? '#94a3b8' : '#475569', font: { weight: '600' } },
      },
    },
  };

  const kpis = [
    {
      title: 'Total Paid Revenue',
      value: summary ? `₹${summary.revenue.toLocaleString()}` : '₹0',
      icon: FiDollarSign,
      cardBg: 'bg-emerald-50/90 dark:bg-slate-900',
      borderColor: 'border-emerald-200 dark:border-emerald-500/40',
      titleColor: 'text-emerald-800 dark:text-emerald-400 font-bold',
      valueColor: 'text-emerald-950 dark:text-emerald-300 font-black',
      iconBg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/40',
    },
    {
      title: 'Confirmed Sales',
      value: summary ? summary.totalSalesCount : 0,
      icon: FiShoppingCart,
      cardBg: 'bg-blue-50/90 dark:bg-slate-900',
      borderColor: 'border-blue-200 dark:border-blue-500/40',
      titleColor: 'text-blue-800 dark:text-blue-400 font-bold',
      valueColor: 'text-blue-950 dark:text-blue-300 font-black',
      iconBg: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-500/40',
    },
    {
      title: 'Active Customers',
      value: summary ? summary.totalCustomers : 0,
      icon: FiUsers,
      cardBg: 'bg-indigo-50/90 dark:bg-slate-900',
      borderColor: 'border-indigo-200 dark:border-indigo-500/40',
      titleColor: 'text-indigo-800 dark:text-indigo-400 font-bold',
      valueColor: 'text-indigo-950 dark:text-indigo-300 font-black',
      iconBg: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 border-indigo-300 dark:border-indigo-500/40',
    },
    {
      title: 'Total Catalog Products',
      value: summary ? summary.totalProducts : 0,
      icon: FiBox,
      cardBg: 'bg-purple-50/90 dark:bg-slate-900',
      borderColor: 'border-purple-200 dark:border-purple-500/40',
      titleColor: 'text-purple-800 dark:text-purple-400 font-bold',
      valueColor: 'text-purple-950 dark:text-purple-300 font-black',
      iconBg: 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-500/40',
    },
    {
      title: 'Pending Draft Challans',
      value: summary ? summary.pendingChallans : 0,
      icon: FiFileText,
      cardBg: 'bg-amber-50/90 dark:bg-slate-900',
      borderColor: 'border-amber-200 dark:border-amber-500/40',
      titleColor: 'text-amber-800 dark:text-amber-400 font-bold',
      valueColor: 'text-amber-950 dark:text-amber-300 font-black',
      iconBg: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/40',
    },
    {
      title: 'Low Stock Alerts',
      value: summary ? summary.lowStockProducts?.length || 0 : 0,
      icon: FiAlertTriangle,
      cardBg: 'bg-rose-50/90 dark:bg-slate-900',
      borderColor: 'border-rose-200 dark:border-rose-500/40',
      titleColor: 'text-rose-800 dark:text-rose-400 font-bold',
      valueColor: 'text-rose-950 dark:text-rose-300 font-black',
      iconBg: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-500/40',
    },
  ];

  if (loading && !summary) {
    return (
      <div className="space-y-6">
        <Skeleton height="h-32" count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <span>Executive Operations Control</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 font-mono font-bold">
              REAL-TIME SYNC
            </span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
            Monitor sales pipeline, inventory stock levels, challans, and customer activities.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/challans/new')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
          >
            <FiPlusCircle className="w-4 h-4" />
            <span>New Challan</span>
          </button>
          <button
            onClick={() => navigate('/inventory')}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold text-sm flex items-center gap-2 transition-all shadow-sm"
          >
            <FiLayers className="w-4 h-4" />
            <span>Stock Audit</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-6 rounded-2xl ${kpi.cardBg} border ${kpi.borderColor} shadow-sm dark:shadow-xl backdrop-blur-md flex items-center justify-between transition-all hover:scale-[1.01]`}
            >
              <div>
                <p className={`text-xs uppercase tracking-wider ${kpi.titleColor}`}>{kpi.title}</p>
                <h3 className={`text-2xl mt-1 tracking-tight ${kpi.valueColor}`}>{kpi.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${kpi.iconBg} shadow-sm`}>
                <Icon className="w-6 h-6" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg flex items-center gap-2">
                <FiTrendingUp className="text-blue-600 dark:text-blue-400" />
                <span>Monthly Revenue Overview</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Total invoice collection performance per month</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              +14.2% Growth
            </span>
          </div>

          <div className="h-64 w-full">
            <Bar data={monthlySalesData} options={chartOptions} />
          </div>
        </div>

        {/* Low Stock Alerts Side List */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg flex items-center gap-2">
                <FiAlertTriangle className="text-rose-600 dark:text-rose-400" />
                <span>Low Stock Warnings</span>
              </h3>
              <button
                onClick={() => navigate('/inventory')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {summary?.lowStockProducts?.length > 0 ? (
                summary.lowStockProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between shadow-sm dark:shadow-none"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{prod.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">SKU: {prod.sku}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                        {prod.stock} left
                      </span>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Min: {prod.minimumStock}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">No low stock warnings right now 🎉</div>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate('/inventory')}
            className="w-full mt-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-300 dark:border-slate-700 text-center transition-colors shadow-sm"
          >
            Reorder Stock Now
          </button>
        </div>
      </div>

      {/* Recent CRM Customers */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Recent Customer Leads & Clients</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Latest additions in CRM Pipeline</p>
          </div>
          <button onClick={() => navigate('/customers')} className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold">
            Manage Customers
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/60">
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Business</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {summary?.recentCustomers?.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">{cust.customerName}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{cust.businessName || '-'}</td>
                  <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-mono font-medium">{cust.mobile}</td>
                  <td className="py-3 px-4">
                    <Badge variant={cust.status === 'ACTIVE' ? 'green' : cust.status === 'LEAD' ? 'amber' : 'gray'}>
                      {cust.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-xs font-medium">{new Date(cust.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
