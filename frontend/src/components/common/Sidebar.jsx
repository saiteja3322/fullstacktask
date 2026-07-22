import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  FiGrid,
  FiUsers,
  FiBox,
  FiLayers,
  FiFileText,
  FiDollarSign,
  FiActivity,
  FiUser,
  FiSettings,
  FiArchive,
} from 'react-icons/fi';

export const Sidebar = () => {
  const { hasRole } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: FiGrid, roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
    { label: 'Customers CRM', path: '/customers', icon: FiUsers, roles: ['ADMIN', 'SALES', 'ACCOUNTS'] },
    { label: 'Products Catalog', path: '/products', icon: FiBox, roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
    { label: 'Inventory Control', path: '/inventory', icon: FiArchive, roles: ['ADMIN', 'WAREHOUSE'] },
    { label: 'Stock Movements', path: '/inventory/logs', icon: FiLayers, roles: ['ADMIN', 'WAREHOUSE', 'SALES'] },
    { label: 'Sales Challans', path: '/challans', icon: FiFileText, roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
    { label: 'Invoices & Billing', path: '/invoices', icon: FiDollarSign, roles: ['ADMIN', 'ACCOUNTS', 'SALES'] },
    { label: 'Activity Logs', path: '/activity-logs', icon: FiActivity, roles: ['ADMIN'] },
    { label: 'User Profile', path: '/profile', icon: FiUser, roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
    { label: 'Settings', path: '/settings', icon: FiSettings, roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-200 dark:border-slate-700/50 flex flex-col justify-between py-6 px-4 shrink-0 transition-colors duration-300">
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xl shadow-lg">
            ERP
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 dark:text-slate-100 tracking-wide text-lg">NEXUS ERP</h1>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Operations Suite</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            if (!hasRole(...item.roles)) return null;

            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 shadow-md font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 rounded-2xl bg-slate-200/60 dark:bg-gradient-to-br dark:from-blue-900/40 dark:to-slate-800/60 border border-slate-300 dark:border-blue-500/20 text-center transition-colors">
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Enterprise Edition v1.0</p>
        <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-1 font-bold">PostgreSQL Connected</p>
      </div>
    </aside>
  );
};
