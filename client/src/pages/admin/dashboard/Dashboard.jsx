import React, { useEffect, useState, useCallback } from 'react';
import { Building2, MapPin, User, Ticket, CheckCircle, PlusCircle, Clock, AlertOctagon, Calendar } from 'lucide-react';
import { DEPARTMENT_MAP, BRANCH_MAP } from '../../../mapping/userDetailsMapping'; 
import { socket } from "../../../socket"; 

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState("Welcome");
  const [stats, setStats] = useState({
    pending_today: 0,
    total_today: 0,
    still_open: 0, 
    total_resolved: 0,
    total_failed: 0,
    total_created: 0
  });

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets/stats/summary`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch admin stats:", err);
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

    if (socket) {
      const handleRefresh = () => fetchStats();
      socket.on("ticket:new", handleRefresh);
      socket.on("ticket:statusUpdated", handleRefresh);
      socket.on("ticket:priorityUpdated", handleRefresh);
      socket.on("ticket:assigneeUpdated", handleRefresh);
      socket.on("ticket:statsUpdated", (updatedStats) => setStats(updatedStats));

      return () => {
        socket.off("ticket:new", handleRefresh);
        socket.off("ticket:statusUpdated", handleRefresh);
        socket.off("ticket:priorityUpdated", handleRefresh);
        socket.off("ticket:assigneeUpdated", handleRefresh);
        socket.off("ticket:statsUpdated");
      };
    }
  }, [fetchStats]);

  if (!user) return <div className="p-8 text-center animate-pulse text-slate-400">Loading Admin Environment...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 text-left">
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
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
               <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                {greeting}, <span className="text-blue-600">{user.first_name}</span>
              </h1>
              <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">Admin Control</span>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-slate-500 font-medium">
              <User size={16} className="text-slate-400"/> {user.position}
              <span className="text-slate-200">|</span>
              <p className="font-mono text-xs font-bold bg-slate-900 text-white px-2 py-1 rounded-md tracking-tighter">ID: {user.employee_id}</p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
              <MetaChip icon={<Building2 size={16}/>} label="Department" value={DEPARTMENT_MAP[user.department_id]} color="blue" />
              <MetaChip icon={<MapPin size={16}/>} label="Branch Office" value={BRANCH_MAP[user.branch_id]} color="indigo" />
            </div>
          </div>
        </div>
      </header>

      {/* 3x2 Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Clock />} 
          title="Pending Today" 
          value={stats.pending_today} 
          color="amber" 
          description="Awaiting Action"
        />
        <StatCard 
          icon={<Ticket />} 
          title="Tickets Today" 
          value={stats.total_today} 
          color="blue" 
          description="Today's Total"
        />
        <StatCard 
          icon={<Calendar />} 
          title="Still Open" 
          value={stats.still_open || 0} 
          color="indigo" 
          description="Pending Resolution"
        />
        <StatCard 
          icon={<CheckCircle />} 
          title="Total Resolved" 
          value={stats.total_resolved} 
          color="emerald" 
          description="Lifetime Success"
        />
        <StatCard 
          icon={<AlertOctagon />} 
          title="Total Failed" 
          value={stats.total_failed || 0} 
          color="red" 
          description="System Blockers"
        />
        <StatCard 
          icon={<PlusCircle />} 
          title="System Total" 
          value={stats.total_created} 
          color="slate" 
          description="All-time History"
        />
      </div>
    </div>
  );
};
const MetaChip = ({ icon, label, value, color }) => (
  <div className="flex items-center gap-3 bg-white border border-slate-100 p-1.5 pr-4 rounded-2xl shadow-sm">
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-${color}-50 text-${color}-600`}>
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] uppercase font-black text-slate-400 leading-none mb-1">{label}</span>
      <span className="text-sm font-bold text-slate-700">{value || "N/A"}</span>
    </div>
  </div>
);

const StatCard = ({ icon, title, value, color, description }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50 border-blue-100 dot-bg-blue-500",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100 dot-bg-emerald-500",
    amber: "text-amber-600 bg-amber-50 border-amber-100 dot-bg-amber-500",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100 dot-bg-indigo-500",
    red: "text-red-600 bg-red-50 border-red-100 dot-bg-red-500", // Red dot for failed
    slate: "text-slate-600 bg-slate-50 border-slate-100 dot-bg-slate-500",
  };

  // Map the dot colors to actual Tailwind classes
  const dotColors = {
    blue: "bg-blue-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    indigo: "bg-indigo-500",
    red: "bg-red-500",
    slate: "bg-slate-500",
  };

  return (
    <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${colors[color]}`}>
          {React.cloneElement(icon, { size: 20 })}
        </div>
        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{description}</span>
      </div>
      <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-black text-slate-900">{value}</span>
        {value > 0 && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>}
      </div>
    </div>
  );
};

export default AdminDashboard;