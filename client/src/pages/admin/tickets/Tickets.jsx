import { useState, useEffect } from "react";
import { Search, Eye, Calendar, Clock, User, Tag, ChevronDown, Filter } from "lucide-react";
import ViewTicket from "./forms/ViewTicket";
import { STATUS_MAP, PRIORITY_MAP, STATUS_COLOR, PRIORITY_COLOR } from "./mapping";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all"); // New State
  const [selectedTicket, setSelectedTicket] = useState(null);

  const fetchTickets = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/tickets");
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredTickets = tickets.filter((ticket) => {
    const searchText = search.toLowerCase();
    const createdAt = new Date(ticket.created_at);
    const now = new Date();

    // 1. Search Logic
    const matchesSearch =
      (ticket.ticket_number?.toLowerCase() || "").includes(searchText) ||
      (ticket.subject?.toLowerCase() || "").includes(searchText);

    // 2. Status Logic
    const matchesStatus = statusFilter === "all" || ticket.status?.toLowerCase() === statusFilter;

    // 3. Date Filter Logic
    let matchesDate = true;
    const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);

    if (dateFilter === "today") matchesDate = diffDays < 1;
    else if (dateFilter === "week") matchesDate = diffDays <= 7;
    else if (dateFilter === "month") matchesDate = diffDays <= 30;
    else if (dateFilter === "year") matchesDate = diffDays <= 365;

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-8 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Support Tickets</h1>
          <p className="text-gray-500 mt-1">Manage, prioritize, and resolve customer requests.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-medium text-gray-600">{filteredTickets.length} Active Tickets</span>
        </div>
      </div>

      {/* Modern Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none bg-gray-50 border-none rounded-xl px-4 py-2.5 text-gray-700 cursor-pointer focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
          <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full appearance-none bg-gray-50 border-none rounded-xl px-4 py-2.5 text-gray-700 cursor-pointer focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
          <Calendar className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.ticket_id}
            className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 border border-gray-200">
                    {ticket.ticket_number}
                  </span>
                  <div className={`h-1.5 w-1.5 rounded-full ${ticket.status === 'open' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors capitalize">
                    {ticket.subject}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <User size={12} />
                    </div>
                    <span>{ticket.created_by}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Tag size={14} className="text-gray-400" />
                    <span>{ticket.category}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{formatDate(ticket.created_at)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${PRIORITY_COLOR[ticket.priority?.toLowerCase()] || 'bg-gray-100'}`}>
                    {PRIORITY_MAP[ticket.priority?.toLowerCase()] || ticket.priority}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${STATUS_COLOR[ticket.status?.toLowerCase()] || 'bg-gray-100'}`}>
                    {STATUS_MAP[ticket.status?.toLowerCase()] || ticket.status}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedTicket(ticket)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100"
                >
                  <Eye size={20} />
                  <span className="text-sm font-medium">View</span>
                </button>
              </div>

            </div>
          </div>
        ))}

        {filteredTickets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
               <Search className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No matches found for your criteria</p>
            <button 
                onClick={() => {setSearch(""); setStatusFilter("all"); setDateFilter("all");}}
                className="mt-2 text-blue-600 text-sm font-semibold hover:underline"
            >
                Clear all filters
            </button>
          </div>
        )}
      </div>

      {selectedTicket && (
        <ViewTicket
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}