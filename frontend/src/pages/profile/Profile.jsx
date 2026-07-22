import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { useDispatch } from 'react-redux';
import { fetchProfile } from '../../redux/slices/authSlice';
import { Badge } from '../../components/common/Badge';
import { FiUser, FiMail, FiPhone, FiLock, FiShield, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const Profile = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      await authService.updateProfile(formData);
      dispatch(fetchProfile());
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Profile update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await authService.changePassword({ oldPassword: currentPassword, currentPassword, newPassword });
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.message || 'Password change failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-slate-900">
          {user?.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
        </div>
        <div className="text-center sm:text-left space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-100">{user?.name}</h1>
          <p className="text-sm text-slate-400 font-mono">{user?.email}</p>
          <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
            <Badge variant="blue">{user?.role}</Badge>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-medium">
              Verified Session
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Info Form */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-200 text-lg flex items-center gap-2">
            <FiUser className="text-blue-400" /> Personal Profile Details
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              <FiCheck className="w-4 h-4" /> Save Profile Details
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-200 text-lg flex items-center gap-2">
            <FiLock className="text-indigo-400" /> Security & Password
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              <FiShield className="w-4 h-4" /> Update Security Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
