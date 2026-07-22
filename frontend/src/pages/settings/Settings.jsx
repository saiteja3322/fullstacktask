import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FiSettings, FiSun, FiMoon, FiDatabase, FiServer, FiShield } from 'react-icons/fi';

export const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
          <FiSettings className="text-blue-400" />
          <span>System & Portal Configuration</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">Manage portal preferences, theme modes, and database connection status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-200 text-lg flex items-center gap-2">
            {theme === 'dark' ? <FiMoon className="text-amber-400" /> : <FiSun className="text-amber-400" />}
            <span>Visual Theme Mode</span>
          </h3>

          <p className="text-sm text-slate-400">
            Switch between Glassmorphic Dark mode and Light mode visual themes across the application dashboard.
          </p>

          <div className="pt-2">
            <button
              onClick={toggleTheme}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 flex items-center gap-3 transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <FiSun className="w-5 h-5 text-amber-400" />
                  <span>Switch to Light Theme Mode</span>
                </>
              ) : (
                <>
                  <FiMoon className="w-5 h-5 text-blue-400" />
                  <span>Switch to Dark Theme Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Infrastructure & Status */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-200 text-lg flex items-center gap-2">
            <FiServer className="text-emerald-400" />
            <span>Infrastructure Health</span>
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700">
              <span className="text-slate-400 flex items-center gap-2">
                <FiDatabase className="text-blue-400" /> Database Engine
              </span>
              <span className="font-mono text-emerald-400 font-bold">PostgreSQL 16 (Neon)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700">
              <span className="text-slate-400 flex items-center gap-2">
                <FiShield className="text-purple-400" /> Auth Framework
              </span>
              <span className="font-mono text-slate-200 font-bold">JWT + HttpOnly Cookie</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700">
              <span className="text-slate-400">Backend API Engine</span>
              <span className="font-mono text-slate-200 font-bold">Express 5 (Node 22)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
