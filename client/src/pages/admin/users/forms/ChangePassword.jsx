import React, { useState } from 'react';
import axios from 'axios';
import { X, Lock, ShieldAlert } from 'lucide-react';

export default function ChangePassword({ isOpen, user, onClose, onSuccess }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleForceReset = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/force-reset-password`, {
        userId: user.user_id,
        newPassword
      });

      
      setNewPassword("");
      setConfirmPassword("");
      onSuccess(); // Refresh user list
      onClose();   // Close modal
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Failed to update"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-amber-50/50">
          <div className="flex items-center gap-3 text-amber-600">
            <div className="p-2 bg-amber-100 rounded-xl">
              <Lock size={20} />
            </div>
            <h2 className="font-black text-gray-800 tracking-tight">Reset Password</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleForceReset} className="p-6 space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3">
            <ShieldAlert className="text-blue-500 shrink-0" size={20} />
            <p className="text-xs text-blue-700 leading-relaxed">
              Resetting password for <b>{user.first_name} {user.last_name}</b>.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase text-gray-400 ml-1">New Password</label>
            <input
              type="password"
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase text-gray-400 ml-1">Confirm New Password</label>
            <input
              type="password"
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-amber-500 text-white p-4 rounded-2xl font-black text-sm hover:bg-amber-600 transition-all shadow-lg shadow-amber-200 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}