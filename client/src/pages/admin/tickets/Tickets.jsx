import { useState, useEffect } from "react";
import { Search, Eye } from "lucide-react";
import ViewTicket from "./forms/ViewTicket";
// Ensure these mappings exist in your mapping.js file
import { STATUS_MAP, PRIORITY_MAP, STATUS_COLOR, PRIORITY_COLOR } from "./mapping";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const fetchTickets = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/tickets");
      const data = await res.json();
      
      // We keep the data as is because the Backend CONCAT handled the names
      setTickets(data);
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const searchText = search.toLowerCase();
    
    // Safely check for nulls before calling toLowerCase()
    const matchesSearch =
      (ticket.ticket_number?.toLowerCase() || "").includes(searchText) ||
      (ticket.subject?.toLowerCase() || "").includes(searchText) ||
      (ticket.created_by?.toLowerCase() || "").includes(searchText) ||
      (ticket.assigned_to?.toLowerCase() || "").includes(searchText);

    const matchesStatus =
      statusFilter === "all" || ticket.status?.toLowerCase() === statusFilter;

    const matchesPriority =
      priorityFilter === "all" || ticket.priority?.toLowerCase() === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">All Tickets</h1>
        <p className="text-sm text-gray-500">Manage and monitor all support tickets</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ticket #, subject, or names..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-2 outline-none"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <div key={ticket.ticket_id} className="bg-white p-6 rounded-lg shadow border border-transparent hover:border-blue-200 transition-all">
            <div className="flex justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-mono text-gray-400">{ticket.ticket_number}</span>
                  <h3 className="text-lg font-semibold">{ticket.subject}</h3>

                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${PRIORITY_COLOR[ticket.priority?.toLowerCase()] || 'bg-gray-100'}`}>
                    {PRIORITY_MAP[ticket.priority?.toLowerCase()] || ticket.priority}
                  </span>

                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[ticket.status?.toLowerCase()] || 'bg-gray-100'}`}>
                    {STATUS_MAP[ticket.status?.toLowerCase()] || ticket.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                  <p><strong>Created by:</strong> {ticket.created_by}</p>
                  <p><strong>Category:</strong> {ticket.category}</p>
                  <p><strong>Assigned to:</strong> {ticket.assigned_to || "Unassigned"}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTicket(ticket)}
                className="flex h-fit items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50 text-gray-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
            </div>
          </div>
        ))}

        {filteredTickets.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed">
            <p className="text-gray-500 font-medium">No tickets found matching your filters.</p>
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