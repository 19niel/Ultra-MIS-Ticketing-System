import React, { useState, useEffect } from "react";
import { Lock, Unlock, Save, X, ShieldCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function Security() {
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUserId(JSON.parse(storedUser).user_id);
    }
  }, []);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    // Validation
    if (passwords.new !== passwords.confirm) {
      return toast.error("New passwords do not match!");
    }

    try {
      const res = await fetch(`http://localhost:3000/api/users/change-password/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("Security credentials updated");
      setIsEditing(false);
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error) {
      toast.error(error.message || "Failed to update password");
    }
  };

  const isMatch = passwords.new === passwords.confirm && passwords.new !== "";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
        <div className={`p-2 rounded-lg transition-colors ${isEditing ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
          {isEditing ? <Unlock size={20} /> : <Lock size={20} />}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Account Security</h2>
          <p className="text-xs text-gray-500">Update your password to keep your account safe.</p>
        </div>
      </div>

      <div className="space-y-4 max-w-md">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-gray-400">Current Password</label>
          <input
            type="password"
            name="current"
            disabled={!isEditing}
            value={passwords.current}
            onChange={handleChange}
            placeholder="Type old password"
            className={`w-full px-4 py-2.5 rounded-xl outline-none transition-all text-sm font-medium border ${
              isEditing ? "bg-white border-gray-200 focus:border-red-500 shadow-sm" : "bg-gray-50 border-gray-100 text-gray-400"
            }`}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-gray-400">New Password</label>
            <input
              type="password"
              name="new"
              disabled={!isEditing}
              value={passwords.new}
              onChange={handleChange}
              placeholder="Min. 8 characters"
              className={`w-full px-4 py-2.5 rounded-xl outline-none transition-all text-sm font-medium border ${
                isEditing ? "bg-white border-gray-200 focus:border-blue-500 shadow-sm" : "bg-gray-50 border-gray-100 text-gray-400"
              }`}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-gray-400">Confirm New Password</label>
            <input
              type="password"
              name="confirm"
              disabled={!isEditing}
              value={passwords.confirm}
              onChange={handleChange}
              placeholder="Repeat new password"
              className={`w-full px-4 py-2.5 rounded-xl outline-none transition-all text-sm font-medium border ${
                isEditing 
                ? (isMatch ? "bg-white border-green-500" : "bg-white border-gray-200 focus:border-blue-500") 
                : "bg-gray-50 border-gray-100 text-gray-400"
              }`}
            />
          </div>
        </div>

        {/* Real-time Match UI */}
        {isEditing && passwords.confirm && (
          <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${isMatch ? 'text-green-500' : 'text-red-400'}`}>
            {isMatch ? <ShieldCheck size={14} /> : <AlertCircle size={14} />}
            {isMatch ? "Passwords are a match" : "Passwords do not match yet"}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all active:scale-95"
          >
            Change Password
          </button>
        ) : (
          <>
            <button 
              onClick={handleUpdate}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-100 active:scale-95"
            >
              <Save size={18} />
              Save New Password
            </button>
            <button 
              onClick={() => { setIsEditing(false); setPasswords({current:"", new:"", confirm:""}) }}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-500 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all"
            >
              <X size={18} />
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}