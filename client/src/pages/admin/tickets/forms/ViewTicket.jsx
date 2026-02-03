import { useEffect, useState } from "react";
import { X, Send, Clock, CalendarClock, User, UserCog, Tag } from "lucide-react";
import {
  STATUS_MAP,
  PRIORITY_MAP,
  CATEGORY_MAP,
  STATUS_COLOR,
  PRIORITY_COLOR,
} from "../mapping";
import { toast } from "sonner";

const STATUS_ID_TO_NAME = {
  1: "Open",
  2: "In Progress",
  3: "On Hold",
  4: "Resolved",
  5: "Closed",
  6: "Failed",
};

export default function ViewTicket({ ticket, onClose, userRole }) {
  const [newMessage, setNewMessage] = useState("");
  const [displayStatus, setDisplayStatus] = useState(ticket.status);
  const [conversations, setConversations] = useState(ticket.conversations || []);
  const [savingStatus, setSavingStatus] = useState(false);
  
  // State for toggling between button and dropdown
  const [editingStatus, setEditingStatus] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState("");

  useEffect(() => {
    setDisplayStatus(ticket.status);
  }, [ticket]);

  const getInitials = (name) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase();

  const formatTimestamp = (timestamp) =>
    timestamp ? new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }) : "N/A";

  /* ===============================
       STATUS HANDLING
  =============================== */
  const handleStatusUpdate = async () => {
    if (!selectedStatusId) return;

    setSavingStatus(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/tickets/status/${ticket.ticket_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status_id: selectedStatusId,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      const data = await res.json();
      setDisplayStatus(STATUS_ID_TO_NAME[selectedStatusId]);
      setEditingStatus(false); 

      toast.success(
        `Ticket updated to ${STATUS_ID_TO_NAME[selectedStatusId]} 🎉`
      );

      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err) {
      console.error(err);
      toast.error(`Update failed ❌`);
    } finally {
      setSavingStatus(false);
    }
  };

  /* ===============================
       MESSAGE HANDLING
  =============================== */
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: "You",
      senderRole: userRole,
      message: newMessage,
      timestamp: new Date(),
    };
    setConversations((prev) => [...prev, newMsg]);
    setNewMessage("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
        {/* HEADER */}
        <div className="p-6 border-b flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {ticket.ticket_number}
              </span>

              <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${PRIORITY_COLOR[ticket.priority?.toLowerCase()]}`}>
                {PRIORITY_MAP[ticket.priority?.toLowerCase()] || ticket.priority}
              </span>

              <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${STATUS_COLOR[displayStatus?.toLowerCase()]}`}>
                {STATUS_MAP[displayStatus?.toLowerCase()] || displayStatus}
              </span>
            </div>

            <h2 className="text-2xl font-bold mt-2">{ticket.subject}</h2>
            <p className="text-gray-700 leading-relaxed">{ticket.description}</p>

            <div className="flex items-center gap-6 text-sm text-gray-500 flex-wrap pt-2">
              <span className="flex items-center gap-2"><User size={14} /> {ticket.created_by}</span>
              <span className="flex items-center gap-2"><UserCog size={14} /> {ticket.assigned_to || "No Assigned Yet"}</span>
              <span className="flex items-center gap-2"><Tag size={14} /> {CATEGORY_MAP[ticket.category?.toLowerCase()] || ticket.category}</span>
              <span className="flex items-center gap-2"><Clock size={14} /> {formatTimestamp(ticket.created_at)}</span>
              <span className="flex items-center gap-2"><CalendarClock size={14} /> {ticket.closed_at ? formatTimestamp(ticket.closed_at) : "Active"}</span>
            </div>

            {/* ✅ FORCED VISIBILITY: NO ROLE CHECK */}
            <div className="pt-3 flex items-center gap-2">
              {!editingStatus ? (
                <button
                  onClick={() => setEditingStatus(true)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Change Status
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <select
                    value={selectedStatusId}
                    onChange={(e) => setSelectedStatusId(e.target.value)}
                    className="text-sm border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="" disabled>Select status</option>
                    <option value="1">Open</option>
                    <option value="2">In Progress</option>
                    <option value="3">On Hold</option>
                    <option value="4">Resolved</option>
                    <option value="5">Closed</option>
                    <option value="6">Failed</option>
                  </select>
                  <button
                    disabled={savingStatus || !selectedStatusId}
                    onClick={handleStatusUpdate}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    {savingStatus ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setEditingStatus(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <button className="p-2 hover:bg-gray-100 rounded-full" onClick={onClose}>
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        {/* CONVERSATIONS */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {conversations.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No messages yet</div>
          ) : (
            conversations.map((msg) => (
              <div key={msg.id} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {getInitials(msg.sender)}
                </div>
                <div className="flex-1 bg-white p-3 rounded-lg border shadow-sm">
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <span className="font-semibold">{msg.sender}</span>
                    <span className="text-gray-400 text-xs">({msg.senderRole})</span>
                    <span className="text-gray-400 text-[10px] ml-auto">{formatTimestamp(msg.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-600">{msg.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* MESSAGE INPUT */}
        <div className="p-6 border-t bg-white flex gap-3">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2 transition-colors"
          >
            <Send size={16} /> Send
          </button>
        </div>
      </div>
    </div>
  );
}