import { useState, useEffect } from "react";
import { 
  Search, Eye, Calendar, User, Tag, Filter, XCircle, 
  ChevronLeft, ChevronRight, Building2, MapPin 
} from "lucide-react";
import ViewTicket from "./forms/ViewTicket";
import { STATUS_MAP, PRIORITY_MAP, STATUS_COLOR, PRIORITY_COLOR } from "../../../mapping/ticketMapping";
import { DEPARTMENT_MAP, BRANCH_MAP } from "../../../mapping/userDetailsMapping"; 
import { socket } from "../../../socket";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [page, setPage] = useState(1);
  const [totalStats, setTotalStats] = useState({ totalPages: 1, totalTickets: 0 });

  const fetchTickets = async () => {
    try {
      const query = new URLSearchParams({
        page,
        limit: 10,
        search: search.trim(),
        status: statusFilter,
        priority: priorityFilter,
        dateRange: dateFilter 
      }).toString();

      const res = await fetch(`http://localhost:3000/api/tickets?${query}`);
      const data = await res.json();
      
      setTickets(data.tickets || []);
      setTotalStats({ 
        totalPages: data.totalPages || 1, 
        totalTickets: data.totalTickets || 0 
      });
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    }
  };

  useEffect(() => { setPage(1); }, [search, statusFilter, priorityFilter, dateFilter]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => { fetchTickets(); }, 300);

    socket.on("ticket:new", (newTicket) => {
      if (page === 1) setTickets((prev) => [newTicket, ...prev].slice(0, 10));
    });

    socket.on("ticket:statusUpdated", (updatedTicket) => {
      setTickets((prev) => prev.map((t) => t.ticket_id === updatedTicket.ticket_id ? { ...t, status: updatedTicket.status, updated_at: updatedTicket.updated_at } : t));
    });

    return () => {
      clearTimeout(delayDebounceFn);
      socket.off("ticket:new");
      socket.off("ticket:statusUpdated");
    };
  }, [page, search, statusFilter, priorityFilter, dateFilter]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setDateFilter("all");
    setPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-8 bg-gray-50/50 min-h-screen">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Support Tickets</h1>
          <p className="text-gray-500 text-sm">Manage and track your active support requests.</p>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID, subject, or requester..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm shadow-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none focus:border-blue-500 shadow-sm transition-all">
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none focus:border-blue-500 shadow-sm transition-all">
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-blue-50 border border-blue-100 rounded-xl">
              <Filter size={16} className="text-blue-600" />
              <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="bg-transparent text-sm font-bold text-blue-700 outline-none pr-2">
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* PAGINATION */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            {tickets.length > 0 ? (
              <>
                Showing <span className="font-bold text-gray-800">
                  {(page - 1) * 10 + 1}
                </span> to <span className="font-bold text-gray-800">
                  {Math.min(page * 10, totalStats.totalTickets)}
                </span> of{" "}
                <span className="font-bold text-gray-800">{totalStats.totalTickets}</span> results
              </>
            ) : (
              "No results to show"
            )}
          </div>

          <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100">
            <button 
              onClick={() => setPage((p) => Math.max(1, p - 1))} 
              disabled={page === 1} 
              className="px-4 py-2 text-sm font-bold text-gray-600 rounded-lg hover:bg-white disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={16} className="inline mr-1" /> Prev
            </button>
            
            <div className="px-4 text-sm font-bold border-x border-gray-200">
              <span className="text-blue-600">{page}</span> / {totalStats.totalPages}
            </div>
            
            <button 
              onClick={() => setPage((p) => Math.min(totalStats.totalPages, p + 1))} 
              disabled={page === totalStats.totalPages} 
              className="px-4 py-2 text-sm font-bold text-gray-600 rounded-lg hover:bg-white disabled:opacity-30 transition-colors"
            >
              Next <ChevronRight size={16} className="inline ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* TICKET LIST */}
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div key={ticket.ticket_id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 overflow-hidden">
            <div className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex-1 space-y-4">
                  
                  {/* SINGLE ROW: ID + TITLE + DEPT + BRANCH */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-400 border border-gray-200 font-mono flex-shrink-0">
                      {ticket.ticket_number}
                    </span>
                    
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors capitalize">
                      {ticket.subject}
                    </h3>

                    {/* Location Badges placed immediately after Title */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-100/50 rounded border border-slate-200/60">
                        <Building2 size={12} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          {DEPARTMENT_MAP[ticket.department_id] || "Unknown"}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-100/50 rounded border border-slate-200/60">
                        <MapPin size={12} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          {BRANCH_MAP[ticket.branch_id] || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* META INFO (User, Category, Date) */}
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <User size={12} />
                      </div>
                      <span className="font-medium">{ticket.created_by}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Tag size={14} />
                      <span className="text-gray-500">{ticket.category}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Calendar size={14} />
                      <span className="text-gray-500">{formatDate(ticket.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE: STATUS & ACTIONS */}
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ring-1 ring-inset shadow-sm ${STATUS_COLOR[ticket.status?.toLowerCase()] || "bg-gray-100 text-gray-600 ring-gray-200"}`}>
                      {STATUS_MAP[ticket.status?.toLowerCase()] || ticket.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ring-1 ring-inset shadow-sm ${PRIORITY_COLOR[ticket.priority?.toLowerCase()] || "bg-gray-100 text-gray-600 ring-gray-200"}`}>
                      {PRIORITY_MAP[ticket.priority?.toLowerCase()] || ticket.priority}
                    </span>
                  </div>
                  <button onClick={() => setSelectedTicket(ticket)} className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white transition-all border border-gray-100 group-hover:border-blue-600 shadow-sm">
                    <Eye size={20} />
                    <span className="hidden sm:inline text-sm font-bold">View</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTicket && <ViewTicket ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />}
    </div>
  );
}