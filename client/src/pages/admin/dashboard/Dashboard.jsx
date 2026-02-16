import React, { useEffect, useState, useCallback } from 'react';
import { Building2, MapPin, User, Ticket, CheckCircle, PlusCircle, Clock, ShieldCheck } from 'lucide-react';
import { DEPARTMENT_MAP, BRANCH_MAP } from '../../../mapping/userDetailsMapping'; 
import { socket } from "../../../socket"; // Ensure this path is correct

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState("Welcome");
  const [stats, setStats] = useState({
    pending_today: 0,
    total_today: 0,
    total_resolved: 0,
    total_created: 0
  });

  // Fetch Initial Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3000/api/tickets/stats/summary");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, []);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    fetchStats();

    // SOCKET REAL-TIME UPDATES
    if (socket) {
      // Listen for any ticket changes to refresh stats
      socket.on("ticket:statsUpdated", (updatedStats) => {
        setStats(updatedStats);
      });

      // Fallback: Refresh stats on any major ticket event
      const refreshEvents = ["ticket:new", "ticket:statusUpdated", "ticket:priorityUpdated"];
      refreshEvents.forEach(event => {
        socket.on(event, fetchStats);
      });
    }

    return () => {
      if (socket) {
        socket.off("ticket:statsUpdated");
        ["ticket:new", "ticket:statusUpdated", "ticket:priorityUpdated"].forEach(event => {
          socket.off(event, fetchStats);
        });
      }
    };
  }, [fetchStats]);

  if (!user) return <div className="p-8 text-center animate-pulse text-slate-400">Loading Environment...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10">
      {/* Header Section */}
      <header className="relative overflow-hidden mb-12 bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-slate-100">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-400/10 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-400/10 rounded-full blur-[100px]"></div>
        
        <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-10">
          <div className="relative">
            <div className="w-28 h-28 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-[2.5rem] flex items-center justify-center text-4xl font-black shadow-2xl">
              {user.first_name?.[0]}{user.last_name?.[0]}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              {greeting}, <span className="text-blue-600">{user.first_name}</span>
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-slate-500">
              <User size={16} /> {user.position}
              <span className="text-slate-200">|</span>
              <p className="font-mono text-xs font-bold bg-slate-900 text-white px-2 py-1 rounded-md">ID:{user.employee_id}</p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
              <MetaChip icon={<Building2 size={16}/>} label="Department" value={DEPARTMENT_MAP[user.department_id]} color="blue" />
              <MetaChip icon={<MapPin size={16}/>} label="Office Location" value={BRANCH_MAP[user.branch_id]} color="indigo" />
            </div>
          </div>
        </div>
      </header>

      {/* 4-Tile Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Clock />} 
          title="Pending Tickets Today" 
          value={stats.pending_today} 
          color="amber" 
          description="Awaiting Action"
        />
        <StatCard 
          icon={<Ticket />} 
          title="Total Tickets Today" 
          value={stats.total_today} 
          color="blue" 
          description="Daily Volume"
        />
        <StatCard 
          icon={<CheckCircle />} 
          title="Total Resolved" 
          value={stats.total_resolved} 
          color="emerald" 
          description="Lifetime Success"
        />
        <StatCard 
          icon={<PlusCircle />} 
          title="Total Created" 
          value={stats.total_created} 
          color="slate" 
          description="System Total"
        />
      </div>
    </div>
  );
};

// Sub-component for Header Chips
const MetaChip = ({ icon, label, value, color }) => (
  <div className="flex items-center gap-3 bg-white border border-slate-100 p-1.5 pr-4 rounded-2xl shadow-sm">
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-${color}-100 text-${color}-600`}>
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] uppercase font-black text-slate-400 leading-none mb-1">{label}</span>
      <span className="text-sm font-bold text-slate-700">{value || "N/A"}</span>
    </div>
  </div>
);

// Improved StatCard Component
const StatCard = ({ icon, title, value, color, description }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    slate: "text-slate-600 bg-slate-50 border-slate-100",
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group text-left">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${colors[color]}`}>
          {React.cloneElement(icon, { size: 20 })}
        </div>
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{description}</span>
      </div>
      <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-black text-slate-900">{value}</span>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
      </div>
    </div>
  );
};

export default AdminDashboard;