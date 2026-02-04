import { useState, useEffect, useMemo } from "react";
import { Search, Eye, Calendar, User, Tag, Filter, XCircle } from "lucide-react";
import ViewTicket from "./forms/ViewTicket";
import { STATUS_MAP, PRIORITY_MAP, STATUS_COLOR, PRIORITY_COLOR } from "./mapping";
import { socket } from "../../../socket";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
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

    // 🔔 Listen for new tickets
    socket.on("ticket:new", (newTicket) => {
      setTickets((prev) => [newTicket, ...prev]);
    });

    // 🔔 Listen for ticket status updates
    socket.on("ticket:statusUpdated", (updatedTicket) => {
      setTickets((prev) =>
        prev.map((t) =>
          t.ticket_id === updatedTicket.ticket_id
            ? { ...t, status: updatedTicket.status, updated_at: updatedTicket.updated_at }
            : t
        )
      );
    });

    // 🔔 Listen for ticket priority updates (New Logic Added Here)
    socket.on("ticket:priorityUpdated", (updatedTicket) => {
      setTickets((prev) =>
        prev.map((t) =>
          t.ticket_id === updatedTicket.ticket_id
            ? { ...t, priority: updatedTicket.priority, updated_at: updatedTicket.updated_at }
            : t
        )
      );
    });

    return () => {
      socket.off("ticket:new");
      socket.off("ticket:statusUpdated");
      socket.off("ticket:priorityUpdated");
    };
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Filter Logic
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const searchText = search.toLowerCase();
      const ticketDate = new Date(ticket.created_at);
      const now = new Date();

      const matchesSearch =
        (ticket.ticket_number?.toLowerCase() || "").includes(searchText) ||
        (ticket.subject?.toLowerCase() || "").includes(searchText) ||
        (ticket.created_by?.toLowerCase() || "").includes(searchText);

      const matchesStatus = statusFilter === "all" || ticket.status?.toLowerCase() === statusFilter;
      const matchesPriority = priorityFilter === "all" || ticket.priority?.toLowerCase() === priorityFilter;

      let matchesDate = true;
      const startOfToday = new Date(now.setHours(0, 0, 0, 0));
      
      if (dateFilter === "today") {
        matchesDate = ticketDate >= startOfToday;
      } else if (dateFilter === "week") {
        const lastWeek = new Date().setDate(now.getDate() - 7);
        matchesDate = ticketDate >= lastWeek;
      } else if (dateFilter === "month") {
        const lastMonth = new Date().setMonth(now.getMonth() - 1);
        matchesDate = ticketDate >= lastMonth;
      }

      return matchesSearch && matchesStatus && matchesPriority && matchesDate;
    });
  }, [tickets, search, statusFilter, priorityFilter, dateFilter]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setDateFilter("all");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-8 bg-gray-50/50 min-h-screen">
      {/* HEADER & FILTERS */}
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Support Tickets</h1>
          <p className="text-gray-500 text-sm">Manage and track your active support requests.</p>
        </div>

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
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none focus:border-blue-500 shadow-sm transition-all"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none focus:border-blue-500 shadow-sm transition-all"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <div className="flex items-center gap-2 px-3 py-2.5 bg-blue-50 border border-blue-100 rounded-xl">
              <Filter size={16} className="text-blue-600" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-transparent text-sm font-bold text-blue-700 outline-none pr-2"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last Month</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* TICKET LIST */}
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
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold ring-1 ring-inset ${STATUS_COLOR[ticket.status?.toLowerCase()] || "bg-gray-100"}`}>
                    {STATUS_MAP[ticket.status?.toLowerCase()] || ticket.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold ring-1 ring-inset ${PRIORITY_COLOR[ticket.priority?.toLowerCase()] || "bg-gray-100"}`}>
                    {PRIORITY_MAP[ticket.priority?.toLowerCase()] || ticket.priority}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedTicket(ticket)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100"
                >
                  <Eye size={20} />
                  <span className="hidden sm:inline text-sm font-medium">View</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredTickets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <XCircle className="w-12 h-12 text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium text-lg">No tickets found</p>
            <p className="text-gray-400 text-sm mb-6">Try adjusting your filters or search keywords.</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
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