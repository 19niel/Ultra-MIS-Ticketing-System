import { useState, useEffect } from "react";
import { Search, Eye, Calendar, User, Tag, ChevronDown } from "lucide-react";
import ViewTicket from "./forms/ViewTicket";
import { STATUS_MAP, PRIORITY_MAP, STATUS_COLOR, PRIORITY_COLOR } from "./mapping";

// 🔔 Import the socket instance
import { socket } from "../../../socket"; // adjust the path if needed

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Fetch tickets from backend
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

    return () => {
      socket.off("ticket:new");
      socket.off("ticket:statusUpdated");
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

  const filteredTickets = tickets.filter((ticket) => {
    const searchText = search.toLowerCase();
    const createdAt = new Date(ticket.created_at);
    const now = new Date();

    const matchesSearch =
      (ticket.ticket_number?.toLowerCase() || "").includes(searchText) ||
      (ticket.subject?.toLowerCase() || "").includes(searchText);

    const matchesStatus = statusFilter === "all" || ticket.status?.toLowerCase() === statusFilter;

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
      {/* ... your existing header & filters ... */}

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
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${
                      PRIORITY_COLOR[ticket.priority?.toLowerCase()] || "bg-gray-100"
                    }`}
                  >
                    {PRIORITY_MAP[ticket.priority?.toLowerCase()] || ticket.priority}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${
                      STATUS_COLOR[ticket.status?.toLowerCase()] || "bg-gray-100"
                    }`}
                  >
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
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setDateFilter("all");
              }}
              className="mt-2 text-blue-600 text-sm font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {selectedTicket && <ViewTicket ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />}
    </div>
  );
}
