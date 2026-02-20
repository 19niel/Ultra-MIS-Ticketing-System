import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Filter, Calendar, Building2, Tag, CheckCircle2, XCircle, RefreshCcw, ArrowRight } from 'lucide-react';
import { DEPARTMENT_MAP, BRANCH_MAP } from "../../../mapping/userDetailsMapping";

const Reports = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    category: 'all',
    branch: 'all',
    department: 'all',
    is_resolved: 'all',
    dateRange: 'all',
    startDate: '',
    endDate: ''
  });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`http://localhost:3000/api/reports?${query}`);
      const result = await res.json();
      setData(result.chartData);
      setSummary(result.summary);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only trigger fetch if custom range is complete OR not using custom range
    if (filters.dateRange === 'custom') {
      if (filters.startDate && filters.endDate) fetchReports();
    } else {
      fetchReports();
    }
  }, [filters]);

  const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-gray-50/30 min-h-screen text-left">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Analytics Reports</h1>
          <p className="text-gray-500 font-medium">Monitor system performance and ticket distribution.</p>
        </div>
        <button onClick={fetchReports} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
          <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
          Refresh Data
        </button>
      </div>

      {/* FILTER PANEL */}
      <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Date Range</label>
            <select 
              className="w-full p-2 bg-gray-50 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-500"
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Branch</label>
            <select className="w-full p-2 bg-gray-50 border-none rounded-lg text-xs font-bold" value={filters.branch} onChange={(e) => setFilters({...filters, branch: e.target.value})}>
              <option value="all">All Branches</option>
              {Object.entries(BRANCH_MAP).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Department</label>
            <select className="w-full p-2 bg-gray-50 border-none rounded-lg text-xs font-bold" value={filters.department} onChange={(e) => setFilters({...filters, department: e.target.value})}>
              <option value="all">All Depts</option>
              {Object.entries(DEPARTMENT_MAP).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Outcome</label>
            <select className="w-full p-2 bg-gray-50 border-none rounded-lg text-xs font-bold" value={filters.is_resolved} onChange={(e) => setFilters({...filters, is_resolved: e.target.value})}>
              <option value="all">All Outcomes</option>
              <option value="resolved">Resolved</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="flex items-end">
            <button 
              onClick={() => setFilters({category:'all', branch:'all', department:'all', is_resolved:'all', dateRange:'all', startDate:'', endDate:''})}
              className="w-full p-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* CUSTOM DATE PICKER ROW */}
        {filters.dateRange === 'custom' && (
          <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-top-2">
            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-black uppercase text-blue-400 ml-1">From Date</label>
              <input 
                type="date" 
                className="w-full p-2 bg-white border border-blue-100 rounded-lg text-xs font-bold text-blue-700 outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              />
            </div>
            <ArrowRight size={16} className="text-blue-300 mt-5" />
            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-black uppercase text-blue-400 ml-1">To Date</label>
              <input 
                type="date" 
                className="w-full p-2 bg-white border border-blue-100 rounded-lg text-xs font-bold text-blue-700 outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              />
            </div>
          </div>
        )}
      </div>

      {/* SUMMARY CARDS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard title="Total Tickets" value={summary.totalTickets} icon={<Tag className="text-blue-600"/>} color="bg-blue-50" />
        <SummaryCard title="Resolved" value={summary.resolved} icon={<CheckCircle2 className="text-emerald-600"/>} color="bg-emerald-50" />
        <SummaryCard title="Failed" value={summary.failed} icon={<XCircle className="text-red-600"/>} color="bg-red-50" />
        <SummaryCard title="Still Open" value={summary.open} icon={<Calendar className="text-amber-600"/>} color="bg-amber-50" />
      </div>

      {/* CHART SECTION */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-800">Tickets by Category</h2>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <Filter size={14}/> Live Metrics
          </div>
        </div>
        
        <div className="h-[400px] w-full">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <RefreshCcw size={40} className="text-blue-200 animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }} />
                <Bar dataKey="total" radius={[6, 6, 0, 0]} barSize={50}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">{title}</p>
      <p className="text-2xl font-black text-gray-800">{value || 0}</p>
    </div>
  </div>
);

export default Reports;