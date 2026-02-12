import React, { useEffect, useState } from 'react';
import { Building2, MapPin, User, Ticket, CheckCircle, PlusCircle, ShieldCheck } from 'lucide-react';


import { DEPARTMENT_MAP, BRANCH_MAP } from '../../../mapping/userDetailsMapping'; 

const EmployeeDashboard = () => {
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    // 2. Retrieve user data from sessionStorage
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // 3. Set time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  if (!user) return <div className="p-8 text-center animate-pulse text-slate-400">Loading Environment...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10">
      {/* Modern Header Section */}
      <header className="relative overflow-hidden mb-12 bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-slate-100">
        {/* Subtle Gradient Glows */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-400/10 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-400/10 rounded-full blur-[100px]"></div>
        
        <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-10">
          {/* Avatar Section with Pulse Status */}
          <div className="relative">
            <div className="w-28 h-28 bg-blue-600 text-white rounded-[2.5rem] flex items-center justify-center text-4xl font-black shadow-2xl transform transition-transform hover:scale-105 duration-500">
              {user.first_name?.[0]}{user.last_name?.[0]}
            </div>
            {/* Live Status Indicator */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* User Info Section */}
          <div className="flex-1 text-center md:text-left">
            <div className="space-y-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                  {greeting}, <span className="text-blue-600">{user.first_name}</span>
                </h1>
                <span className="hidden md:block w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
               
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                <p className="text-slate-500 font-medium flex items-center gap-2">
                  <User size={16} className="text-slate-400" />
                  {user.position}
                </p>
                <span className="text-slate-200">|</span>
                <p className="font-mono text-xs font-bold bg-slate-900 text-white px-2 py-1 rounded-md tracking-widest shadow-sm">
                  ID:{user.employee_id}
                </p>
              </div>
            </div>

            {/* Metadata Chips using Imported Maps */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
              <div className="group flex items-center gap-3 bg-white border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all p-1.5 pr-4 rounded-2xl shadow-sm">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Building2 size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-black text-slate-400 leading-none mb-1">Department</span>
                  <span className="text-sm font-bold text-slate-700">
                    {DEPARTMENT_MAP[user.department_id] || "N/A"}
                  </span>
                </div>
              </div>

              <div className="group flex items-center gap-3 bg-white border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all p-1.5 pr-4 rounded-2xl shadow-sm">
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <MapPin size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-black text-slate-400 leading-none mb-1">Office Location</span>
                  <span className="text-sm font-bold text-slate-700">
                    {BRANCH_MAP[user.branch_id] || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <StatCard icon={<Ticket />} title="My Open Tickets" value="12" color="blue" />
        <StatCard icon={<CheckCircle />} title="Resolved Today" value="8" color="emerald" />
        <StatCard icon={<PlusCircle />} title="Tickets Created" value="4" color="amber" />
      </div>
    </div>
  );
};

// Reusable StatCard Component
const StatCard = ({ icon, title, value, color }) => {
  const themes = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-6">
        <div className={`p-4 rounded-2xl transition-colors duration-300 ${themes[color]}`}>
          {React.cloneElement(icon, { size: 24 })}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Analytics</span>
          <div className="w-8 h-1 bg-slate-100 rounded-full mt-1 group-hover:w-12 transition-all"></div>
        </div>
      </div>
      <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-2">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-black text-slate-900">{value}</span>
        <span className="text-emerald-500 text-xs font-bold">+2 today</span>
      </div>
    </div>
  );
};

export default EmployeeDashboard;