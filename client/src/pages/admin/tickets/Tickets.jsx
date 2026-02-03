import { useState, useEffect } from "react";
import { Search, Eye } from "lucide-react";
import ViewTicket from "./forms/ViewTicket";
import { STATUS_MAP, PRIORITY_MAP, CATEGORY_MAP, STATUS_COLOR, PRIORITY_COLOR } from "./mapping";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Fetch tickets from backend
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/tickets");
        const data = await res.json();

        // Map backend data to readable values
        const mapped = data.map((t) => ({
          ...t,
          category: t.category ,
          status: t.status ,
          priority: t.priority,
          conversations: t.conversations || [],
        }));
        
        setTickets(mapped);
      } catch (err) {
        console.error("Failed to fetch tickets", err);
      }
    };

    fetchTickets();
  }, []);

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    const searchText = search.toLowerCase();
    const matchesSearch =
      ticket.ticket_number.toLowerCase().includes(searchText) ||
      ticket.subject.toLowerCase().includes(searchText) ||
      ticket.description.toLowerCase().includes(searchText) ||
      ticket.created_by?.toLowerCase().includes(searchText) ||
      ticket.assigned_to?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" || ticket.status?.toLowerCase() === statusFilter;

    const matchesPriority =
      priorityFilter === "all" || ticket.priority?.toLowerCase() === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
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
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="on hold">On Hold</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <div key={ticket.ticket_id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-mono text-gray-500">{ticket.ticket_number}</span>
                  <h3 className="text-lg font-semibold">{ticket.subject}</h3>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${PRIORITY_COLOR[ticket.priority?.toLowerCase()]}`}
                  >
                    {PRIORITY_MAP[ticket.priority?.toLowerCase()] || ticket.priority}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[ticket.status?.toLowerCase()]}`}
                  >
                    {STATUS_MAP[ticket.status?.toLowerCase()] || ticket.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                  <span>Created by: {ticket.created_by}</span>
                  <span>Category: {ticket.category}</span>
                  <span>Assigned to: {ticket.assigned_to ?? "No Assigned yet"}</span>
                </div>
              </div>

              {/* View Button */}
              <button
                onClick={() => setSelectedTicket(ticket)}
                className="flex items-center gap-2  px-3 py-2 rounded hover:bg-gray-100"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
            </div>
          </div>
        ))}

        {filteredTickets.length === 0 && (
          <div className="text-center py-10 text-gray-500">No tickets found</div>
        )}
      </div>

      {/* Modal */}
      {selectedTicket && (
        <ViewTicket
          ticket={selectedTicket}
          userRole="employee" // dynamically change based on logged-in user
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}
