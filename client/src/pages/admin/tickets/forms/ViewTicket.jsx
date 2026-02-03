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

  // ✅ NEW: separate display vs selected status
  const [displayStatus, setDisplayStatus] = useState(ticket.status);
  const [selectedStatusId, setSelectedStatusId] = useState(null);

  useEffect(() => {
    setDisplayStatus(ticket.status);
    setSelectedStatusId(null);
  }, [ticket]);

  const [conversations, setConversations] = useState(
    ticket.conversations || []
  );
  const [editingStatus, setEditingStatus] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  const canChangeStatus = userRole === "admin" || userRole === "employee";

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const formatTimestamp = (timestamp) =>
    new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

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
      isInternal: false,
    };

    setConversations((prev) => [...prev, newMsg]);
    setNewMessage("");
  };

  /* ===============================
     STATUS HANDLING
  =============================== */
  const handleStatusChange = (e) => {
    setSelectedStatusId(Number(e.target.value));
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatusId) return;

    setSavingStatus(true);

    try {
      const res = await fetch(
        `http://localhost:3000/api/tickets/${ticket.ticket_id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status_id: selectedStatusId,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      const data = await res.json();

      // ✅ update display AFTER save
      setDisplayStatus(STATUS_ID_TO_NAME[selectedStatusId]);
      setEditingStatus(false);

      toast.success(
        `Ticket ${data.ticket_number || ticket.ticket_number} status updated successfully 🎉`
      );

      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err) {
      console.error(err);
      toast.error(
        `Ticket ${ticket.ticket_number} status update failed ❌`
      );
    } finally {
      setSavingStatus(false);
    }
  };

  /* ===============================
     RENDER
  =============================== */
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="p-6 border-b flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-sm text-gray-500">
                {ticket.ticket_number}
              </span>

              <span
                className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                  PRIORITY_COLOR[ticket.priority?.toLowerCase()]
                }`}
              >
                {PRIORITY_MAP[ticket.priority?.toLowerCase()] ||
                  ticket.priority}
              </span>

              {/* ✅ DISPLAY STATUS ONLY */}
              <span
                className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                  STATUS_COLOR[displayStatus?.toLowerCase()]
                }`}
              >
                {STATUS_MAP[displayStatus?.toLowerCase()] || displayStatus}
              </span>
            </div>

            <h2 className="text-2xl font-bold">{ticket.subject}</h2>
            <p className="text-gray-700">{ticket.description}</p>

            <div className="flex items-center gap-6 text-sm text-gray-500 flex-wrap">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" /> {ticket.created_by}
              </span>

              <span className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />{" "}
                {ticket.assigned_to || "No Assigned Yet"}
              </span>

              <span className="flex items-center gap-2">
                <Tag className="h-4 w-4" />{" "}
                {CATEGORY_MAP[ticket.category?.toLowerCase()] ||
                  ticket.category}
              </span>

              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />{" "}
                {formatTimestamp(ticket.created_at)}
              </span>

              <span className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4" />{" "}
                {ticket.closed_at
                  ? formatTimestamp(ticket.closed_at)
                  : "Not Closed Yet"}
              </span>
            </div>

            {/* STATUS EDIT */}
            {canChangeStatus && (
              <div className="pt-3 flex items-center gap-2">
                <button
                  disabled={savingStatus}
                  onClick={() =>
                    editingStatus
                      ? handleStatusUpdate()
                      : setEditingStatus(true)
                  }
                  className={`px-3 py-1 rounded text-white text-sm w-30 ${
                    editingStatus
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {savingStatus
                    ? "Saving..."
                    : editingStatus
                    ? "Save Status"
                    : "Change Status"}
                </button>

                {editingStatus && (
                  <select
                    value={selectedStatusId ?? ""}
                    onChange={handleStatusChange}
                    className="px-2 py-1 text-sm rounded border border-gray-300 focus:ring focus:ring-blue-300"
                  >
                    <option value="" disabled>
                      Select status
                    </option>
                    <option value={1}>Open</option>
                    <option value={2}>In Progress</option>
                    <option value={3}>On Hold</option>
                    <option value={4}>Resolved</option>
                    <option value={5}>Closed</option>
                    <option value={6}>Failed</option>
                  </select>
                )}
              </div>
            )}
          </div>

          <button className="p-2 hover:bg-gray-100 rounded" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* CONVERSATIONS */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {conversations.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No messages yet
            </div>
          ) : (
            conversations.map((msg) => (
              <div key={msg.id} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                  {getInitials(msg.sender)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">{msg.sender}</span>
                    <span className="text-gray-400">{msg.senderRole}</span>
                    <span className="text-gray-400 text-xs">
                      {formatTimestamp(msg.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* MESSAGE INPUT */}
        <div className="p-6 border-t flex gap-3">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <Send className="h-4 w-4" /> Send
          </button>
        </div>
      </div>
    </div>
  );
}
