import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle, FiHome } from 'react-icons/fi';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-3xl shadow-xl">
        <FiAlertTriangle />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-4xl font-extrabold text-slate-100 font-mono">404 - Page Not Found</h1>
        <p className="text-sm text-slate-400">
          The operation path or resource you requested does not exist or has been moved.
        </p>
      </div>

      <button
        onClick={() => navigate('/dashboard')}
        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
      >
        <FiHome className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </button>
    </div>
  );
};
