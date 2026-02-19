import React, { useEffect, useState, useCallback } from 'react';
import { 
  Building2, 
  MapPin, 
  User, 
  Ticket, 
  CheckCircle, 
  PlusCircle, 
  Clock, 
  AlertOctagon 
} from 'lucide-react';
import { DEPARTMENT_MAP, BRANCH_MAP } from '../../../mapping/userDetailsMapping'; 
import { socket } from "../../../socket"; 

const EmployeeDashboard = () => {
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState("Welcome");
  
  // 1. Define stats state including the new 'my_failed' field
  const [stats, setStats] = useState({
    my_pending: 0,
    my_today: 0,
    my_resolved: 0,
    my_failed: 0,
    my_total: 0
  });

  // 2. Memoized fetch function for real-time refreshes
  const fetchEmployeeStats = useCallback(async (empId) => {
    if (!empId) return;
    
    try {
      // Note: Ensure your backend controller handles 'my_failed' in the JSON response
      const res = await fetch(`http://localhost:3000/api/employee/tickets/stats/${empId}`);
      
      if (res.ok) {
        const data = await res.json();
        console.log("Dashboard Stats Updated:", data);
        setStats(data);
      } else {
        console.error("Server error during stats fetch:", res.status);
      }
    } catch (err) {
      console.error("Failed to fetch employee stats:", err);
    }
  }, []);

  // 3. Initialization and Socket Listeners
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    let currentEmpId = null;

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      currentEmpId = parsedUser.employee_id;
      
      if (currentEmpId) {
        fetchEmployeeStats(currentEmpId);
      }
    }

    // Dynamic Greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // Socket.io Real-time Integration
    if (socket) {
      const handleSocketRefresh = () => {
        if (currentEmpId) {
          console.log("Real-time update received. Refreshing dashboard...");
          fetchEmployeeStats(currentEmpId);
        }
      };

      // Listen for ticket changes (same as ViewTicket logic)
      socket.on("ticket:statusUpdated", handleSocketRefresh);
      socket.on("ticket:updated", handleSocketRefresh);
      socket.on("newTicket", handleSocketRefresh);

      // Cleanup listeners on component unmount
      return () => {
        socket.off("ticket:statusUpdated", handleSocketRefresh);
        socket.off("ticket:updated", handleSocketRefresh);
        socket.off("newTicket", handleSocketRefresh);
      };
    }
  }, [fetchEmployeeStats]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center animate-pulse text-slate-400 font-bold">
          Initializing Dashboard Environment...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10">
      
      {/* HEADER SECTION */}
      <header className="relative overflow-hidden mb-12 bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-slate-100">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-400/5 rounded-full blur-[100px]"></div>
        
        <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-10 text-left">
          {/* User Avatar */}
          <div className="w-28 h-28 bg-blue-600 text-white rounded-[2.5rem] flex items-center justify-center text-4xl font-black shadow-xl">
            {user.first_name?.[0]}{user.last_name?.[0]}
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              {greeting}, <span className="text-blue-600">{user.first_name}</span>
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-slate-500 font-medium mb-6">
              <span className="flex items-center gap-2">
                <User size={16} className="text-blue-500" />
                {user.position || "Staff"}
              </span>
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
              <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-sm font-bold">
                ID: {user.employee_id}
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <MetaChip 
                icon={<Building2 size={16}/>} 
                label="Department" 
                value={DEPARTMENT_MAP[user.department_id]} 
                color="blue" 
              />
              <MetaChip 
                icon={<MapPin size={16}/>} 
                label="Branch" 
                value={BRANCH_MAP[user.branch_id]} 
                color="indigo" 
              />
            </div>
          </div>
        </div>
      </header>

      {/* STATS GRID - 5 COLUMNS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        <StatCard 
          icon={<Clock />} 
          title="Open Tickets" 
          value={stats.my_pending} 
          color="amber" 
          description="Awaiting Action"
        />
        <StatCard 
          icon={<PlusCircle />} 
          title="Created Today" 
          value={stats.my_today} 
          color="blue" 
          description="Recent Submissions"
        />
        <StatCard 
          icon={<CheckCircle />} 
          title="Resolved" 
          value={stats.my_resolved} 
          color="emerald" 
          description="Completed"
        />
        <StatCard 
          icon={<AlertOctagon />} 
          title="Failed" 
          value={stats.my_failed} 
          color="red" 
          description="Needs Attention"
        />
        <StatCard 
          icon={<Ticket />} 
          title="Total Tickets" 
          value={stats.my_total} 
          color="slate" 
          description="Lifetime History"
        />
      </div>
    </div>
  );
};

// HELPER COMPONENTS
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
  const themes = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    red: "text-red-600 bg-red-50 border-red-100",
    slate: "text-slate-600 bg-slate-50 border-slate-100",
  };

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group text-left">
      <div className="flex items-center justify-between mb-6">
        <div className={`p-4 rounded-2xl ${themes[color]}`}>
          {React.cloneElement(icon, { size: 22 })}
        </div>
        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{description}</span>
      </div>
      <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-black text-slate-900">{value}</span>
      </div>
    </div>
  );
};

export default EmployeeDashboard;