import React, { useEffect, useState } from 'react';
import { toast } from "sonner";
import { 
  Mail, Briefcase, MapPin, 
  ShieldCheck, Fingerprint, Edit3, CheckCircle2, Save, X 
} from "lucide-react";
import { 
  ROLE_MAP, 
  BRANCH_MAP, 
  DEPARTMENT_MAP 
} from '../../../mapping/userDetailsMapping';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData(parsedUser);
    }
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <p className="text-gray-400 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Update failed");

      setUser(formData);
      sessionStorage.setItem("user", JSON.stringify(formData));
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  const initials = `${formData.first_name?.[0] || ''}${formData.last_name?.[0] || ''}`.toUpperCase() || "U";

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-8 bg-gray-50/50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">My Profile</h1>
          <p className="text-gray-500 text-sm">Personal identity and account credentials.</p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing && (
            <button 
              onClick={() => { setIsEditing(false); setFormData(user); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-500 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all active:scale-95"
            >
              <X size={18} />
              Cancel
            </button>
          )}

          <button 
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 ${
              isEditing 
              ? "bg-emerald-600 text-white shadow-emerald-100 hover:bg-emerald-700" 
              : "bg-blue-600 text-white shadow-blue-100 hover:bg-blue-700"
            }`}
          >
            {isEditing ? <Save size={18} /> : <Edit3 size={18} />}
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: AVATAR CARD */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-slate-800 to-black text-white rounded-[2.5rem] flex items-center justify-center text-4xl font-black shadow-xl ring-4 ring-white">
              {initials}
            </div>
            
            <div className="mt-6 w-full space-y-2">
              {isEditing ? (
                <div className="flex gap-2">
                  <input 
                    name="first_name" 
                    value={formData.first_name || ""} 
                    onChange={handleChange}
                    className="w-1/2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:border-blue-500 outline-none"
                    placeholder="First"
                  />
                  <input 
                    name="last_name" 
                    value={formData.last_name || ""} 
                    onChange={handleChange}
                    className="w-1/2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:border-blue-500 outline-none"
                    placeholder="Last"
                  />
                </div>
              ) : (
                <h2 className="text-xl font-black text-gray-800 capitalize">
                  {user.first_name} {user.last_name}
                </h2>
              )}
              
              {isEditing ? (
                <input 
                  name="position" 
                  value={formData.position || ""} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                  placeholder="Position"
                />
              ) : (
                <p className="text-gray-400 text-sm font-medium">{user.position || "System User"}</p>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-50 w-full">
               <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-50 text-green-600 ring-1 ring-inset ring-green-200 shadow-sm">
                  <CheckCircle2 size={12} />
                  Account Active
               </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILS GRID */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailCard 
            icon={<Fingerprint className="text-orange-500" size={20} />}
            label="Employee ID"
            isEditing={isEditing}
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            mono
          />
          <DetailCard 
            icon={<Mail className="text-blue-500" size={20} />}
            label="Email Address"
            isEditing={isEditing}
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <DetailCard 
            icon={<Briefcase className="text-purple-500" size={20} />}
            label="Department"
            isEditing={isEditing}
            type="select"
            name="department_id"
            value={formData.department_id}
            options={DEPARTMENT_MAP}
            onChange={handleChange}
          />
          <DetailCard 
            icon={<MapPin className="text-red-500" size={20} />}
            label="Branch Location"
            isEditing={isEditing}
            type="select"
            name="branch_id"
            value={formData.branch_id}
            options={BRANCH_MAP}
            onChange={handleChange}
          />
          <DetailCard 
            icon={<ShieldCheck className="text-emerald-500" size={20} />}
            label="Access Level"
            isEditing={isEditing}
            type="select"
            name="role_id"
            value={formData.role_id}
            options={ROLE_MAP}
            onChange={handleChange}
            fullWidth
          />
        </div>
      </div>
    </div>
  );
}

function DetailCard({ icon, label, value, name, mono, fullWidth, isEditing, type = "text", options, onChange }) {
  return (
    <div className={`bg-white p-5 rounded-3xl border border-gray-100 shadow-sm transition-all ${fullWidth ? 'md:col-span-2' : ''} ${isEditing ? 'border-blue-100 ring-2 ring-blue-50/50' : ''}`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-2xl transition-colors ${isEditing ? 'bg-blue-50' : 'bg-gray-50'}`}>
          {icon}
        </div>
        <div className="space-y-1 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">
            {label}
          </p>
          
          {isEditing ? (
            type === "select" ? (
              <select 
                name={name}
                value={value}
                onChange={onChange}
                className="w-full bg-transparent text-sm font-bold text-gray-700 outline-none border-b border-gray-200 focus:border-blue-500 pb-1"
              >
                {Object.entries(options).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            ) : (
              <input 
                name={name}
                value={value || ""}
                onChange={onChange}
                className={`w-full bg-transparent text-sm font-bold text-gray-700 outline-none border-b border-gray-200 focus:border-blue-500 pb-1 ${mono ? 'font-mono text-blue-600' : ''}`}
              />
            )
          ) : (
            <p className={`text-sm font-bold text-gray-700 ${mono ? 'font-mono text-blue-600' : ''}`}>
              {type === "select" ? options[value] : (value || "N/A")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}