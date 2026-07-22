import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchProfile } from './redux/slices/authSlice';
import { useAuth } from './hooks/useAuth';

// Layouts
import { ProtectedLayout } from './components/common/ProtectedLayout';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';

// Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/dashboard/Dashboard';
import { CustomersList } from './pages/customers/CustomersList';
import { ProductsList } from './pages/products/ProductsList';
import { InventoryList } from './pages/inventory/InventoryList';
import { StockMovementsList } from './pages/inventory/StockMovementsList';
import { ChallansList } from './pages/challans/ChallansList';
import { ChallanCreate } from './pages/challans/ChallanCreate';
import { ChallanDetail } from './pages/challans/ChallanDetail';
import { InvoicesList } from './pages/invoices/InvoicesList';
import { InvoiceDetail } from './pages/invoices/InvoiceDetail';
import { ActivityLogsList } from './pages/activityLogs/ActivityLogsList';
import { Profile } from './pages/profile/Profile';
import { Settings } from './pages/settings/Settings';
import { NotFound } from './pages/NotFound';

const AppLayout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 transition-colors duration-300">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<CustomersList />} />
            <Route path="/products" element={<ProductsList />} />
            <Route path="/inventory" element={<InventoryList />} />
            <Route path="/inventory/logs" element={<StockMovementsList />} />
            <Route path="/challans" element={<ChallansList />} />
            <Route path="/challans/new" element={<ChallanCreate />} />
            <Route path="/challans/:id" element={<ChallanDetail />} />
            <Route path="/invoices" element={<InvoicesList />} />
            <Route path="/invoices/:id" element={<InvoiceDetail />} />
            <Route path="/activity-logs" element={<ActivityLogsList />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfile());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />} />

      {/* Protected App Routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="/*" element={<AppLayout />} />
      </Route>

      {/* Root redirect */}
      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
