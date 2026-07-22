import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiLogOut, FiUser, FiBell, FiAlertTriangle, FiFileText, FiUsers, FiCheckCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Low Stock Alert',
      message: '5 inventory items reached minimum reorder threshold',
      type: 'warning',
      icon: FiAlertTriangle,
      path: '/inventory',
      read: false,
      time: '10 mins ago',
    },
    {
      id: 2,
      title: 'Pending Sales Challans',
      message: '2 delivery challans ready for warehouse confirmation',
      type: 'challan',
      icon: FiFileText,
      path: '/challans',
      read: false,
      time: '1 hour ago',
    },
    {
      id: 3,
      title: 'CRM Lead Follow-up',
      message: '3 customer leads scheduled for follow-up call today',
      type: 'customer',
      icon: FiUsers,
      path: '/customers',
      read: false,
      time: '2 hours ago',
    },
  ]);

  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (item) => {
    setNotifications(notifications.map((n) => (n.id === item.id ? { ...n, read: true } : n)));
    setShowNotifications(false);
    navigate(item.path);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 glass-panel border-b border-slate-200 dark:border-slate-700/50 px-6 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent tracking-tight">
          Mini ERP + CRM Operations
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Dark/Light Mode Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shadow-sm flex items-center gap-1.5 font-semibold text-xs"
          title="Toggle Dark / Light Theme"
        >
          {theme === 'dark' ? (
            <>
              <FiSun className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Light Mode</span>
            </>
          ) : (
            <>
              <FiMoon className="w-4 h-4 text-slate-700" />
              <span className="hidden md:inline">Dark Mode</span>
            </>
          )}
        </button>

        {/* Notifications Icon & Popover */}
        <div className="relative" ref={popoverRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 relative transition-colors shadow-sm"
            title="Notifications"
          >
            <FiBell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1"
                    >
                      <FiCheckCircle className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-80 overflow-y-auto">
                  {notifications.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleNotificationClick(item)}
                        className={`p-3.5 flex items-start gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                          !item.read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                        }`}
                      >
                        <div
                          className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                            item.type === 'warning'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : item.type === 'challan'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                              : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                              {item.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                            {item.message}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-center">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/dashboard');
                    }}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View All Operations Dashboard Alerts
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Info & Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-300 dark:border-slate-700/60">
          <div onClick={() => navigate('/profile')} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md group-hover:scale-105 transition-transform">
              {user?.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-500 transition-colors">
                {user?.name || 'User'}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">{user?.role}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 ml-2 transition-colors"
            title="Logout"
          >
            <FiLogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
