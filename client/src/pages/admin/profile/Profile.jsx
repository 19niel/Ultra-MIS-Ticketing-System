import React, { useEffect, useState } from 'react';
import { 
  ROLE_MAP, 
  BRANCH_MAP, 
  DEPARTMENT_MAP 
} from '../../../mapping/userDetailsMapping'; // Adjust path if needed

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
      <div className="p-8 text-center text-gray-500">
        Loading profile information...
      </div>
    );
  }

  // Generate Initials (e.g., Nathaniel Talag -> NT)
  const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <p className="text-sm text-gray-500">
          View and manage your account information
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-28 h-28  bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-[2.5rem] flex items-center justify-center text-4xl font-black shadow-2xl transform transition-transform">
            {initials || "U"}
          </div>
          <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition">
            Change Photo
          </button>
        </div>

        {/* User Info Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
          <ProfileField label="Employee ID" value={user.employee_id} />
          <ProfileField label="Full Name" value={`${user.first_name} ${user.last_name}`} />
          <ProfileField label="Email" value={user.email || "N/A"} />
          <ProfileField label="Position" value={user.position || "Staff"} />
          
          {/* Accessing Objects using [bracket notation] */}
          <ProfileField 
            label="Department" 
            value={DEPARTMENT_MAP[user.department_id || user.department] || "N/A"} 
          />
          <ProfileField 
            label="Branch" 
            value={BRANCH_MAP[user.branch_id || user.branch] || "N/A"} 
          />
          <ProfileField 
            label="Access Level" 
            value={ROLE_MAP[user.role_id] || "N/A"} 
          />
          <ProfileField label="Status" value="Active" isStatus />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="px-5 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition shadow-sm">
          Edit Profile
        </button>
        <button className="px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition">
          Change Password
        </button>
      </div>
    </div>
  );
}

function ProfileField({ label, value, isStatus }) {
  return (
    <div className="border-b border-gray-50 pb-2">
      <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">{label}</p>
      <p className={`font-medium text-gray-800 ${isStatus ? 'text-green-600' : ''}`}>
        {value || "Not Set"}
      </p>
    </div>
  );
}