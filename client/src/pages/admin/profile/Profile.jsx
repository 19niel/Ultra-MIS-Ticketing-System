import React, { useEffect, useState } from 'react';
import { 
  User, Mail, Briefcase, Building2, MapPin, 
  ShieldCheck, Fingerprint, Camera, Edit3, KeyRound, CheckCircle2 
} from "lucide-react";
import { 
  ROLE_MAP, 
  BRANCH_MAP, 
  DEPARTMENT_MAP 
} from '../../../mapping/userDetailsMapping';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
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

  const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-8 bg-gray-50/50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">My Profile</h1>
          <p className="text-gray-500 text-sm">Personal identity and account credentials.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm active:scale-95">
            <KeyRound size={18} className="text-gray-400" />
            Security
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-blue-100 shadow-lg active:scale-95">
            <Edit3 size={18} />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: AVATAR CARD */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm flex flex-col items-center text-center">
            <div className="relative group">
              <div className="w-32 h-32 bg-gradient-to-br from-slate-800 to-black text-white rounded-[2.5rem] flex items-center justify-center text-4xl font-black shadow-xl ring-4 ring-white">
                {initials || "U"}
              </div>
              
            </div>
            
            <div className="mt-6">
              <h2 className="text-xl font-black text-gray-800 capitalize">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-gray-400 text-sm font-medium mt-1">{user.position || "System User"}</p>
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
            value={user.employee_id}
            mono
          />
          <DetailCard 
            icon={<Mail className="text-blue-500" size={20} />}
            label="Email Address"
            value={user.email || "No email provided"}
          />
          <DetailCard 
            icon={<Briefcase className="text-purple-500" size={20} />}
            label="Department"
            value={DEPARTMENT_MAP[user.department_id] || "General"}
          />
          <DetailCard 
            icon={<MapPin className="text-red-500" size={20} />}
            label="Branch Location"
            value={BRANCH_MAP[user.branch_id] || "Main Office"}
          />
          <DetailCard 
            icon={<ShieldCheck className="text-emerald-500" size={20} />}
            label="Access Level"
            value={ROLE_MAP[user.role_id] || "Employee"}
            fullWidth
          />
        </div>
      </div>
    </div>
  );
}

function DetailCard({ icon, label, value, mono, fullWidth }) {
  return (
    <div className={`bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors ${fullWidth ? 'md:col-span-2' : ''}`}>
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-white transition-colors">
          {icon}
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">
            {label}
          </p>
          <p className={`text-sm font-bold text-gray-700 ${mono ? 'font-mono text-blue-600' : ''}`}>
            {value || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}