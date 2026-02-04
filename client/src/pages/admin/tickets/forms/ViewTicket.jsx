import { useEffect, useState } from "react";
import { X, Send, Clock, User, UserCog, Tag, MessageSquare, Info, CheckCircle2, UserPlus } from "lucide-react";
import {
  STATUS_MAP,
  PRIORITY_MAP,
  CATEGORY_MAP,
  STATUS_COLOR,
  PRIORITY_COLOR,
} from "../mapping";
import { toast } from "sonner";

const STATUS_ID_TO_NAME = {
  1: "Open", 2: "In Progress", 3: "On Hold", 4: "Resolved", 5: "Closed", 6: "Failed",
};

export default function ViewTicket({ ticket, onClose, userRole }) {
  const [newMessage, setNewMessage] = useState("");
  const [displayStatus, setDisplayStatus] = useState(ticket.status);
  const [displayAssignee, setDisplayAssignee] = useState(ticket.assigned_to);
  const [conversations, setConversations] = useState(ticket.conversations || []);
  
  // States for Status editing
  const [editingStatus, setEditingStatus] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState("");

  // States for Assignee editing
  const [editingAssignee, setEditingAssignee] = useState(false);
  const [supportUsers, setSupportUsers] = useState([]);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState("");

  useEffect(() => {
    setDisplayStatus(ticket.status);
    setDisplayAssignee(ticket.assigned_to);
    fetchSupportUsers();
  }, [ticket]);

  const fetchSupportUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/tickets/support-users");
      const data = await res.json();
      setSupportUsers(data);
    } catch (err) {
      console.error("Failed to fetch support users");
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatusId) return;
    try {
      const res = await fetch(`http://localhost:3000/api/tickets/status/${ticket.ticket_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status_id: selectedStatusId }),
      });
      if (!res.ok) throw new Error();
      setDisplayStatus(STATUS_ID_TO_NAME[selectedStatusId]);
      setEditingStatus(false);
      toast.success("Status updated");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleAssignUpdate = async () => {
    if (!selectedAssigneeId) return;
    try {
      const res = await fetch(`http://localhost:3000/api/tickets/assign/${ticket.ticket_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assigned_to: selectedAssigneeId }),
      });
      if (!res.ok) throw new Error();
      
      const chosenUser = supportUsers.find(u => u.employee_id === selectedAssigneeId);
      setDisplayAssignee(`${chosenUser.first_name} ${chosenUser.last_name}`);
      setEditingAssignee(false);
      toast.success("Ticket assigned successfully");
    } catch (err) {
      toast.error("Assignment failed");
    }
  };

  const getInitials = (name) => name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "?";

  const formatTimestamp = (timestamp) =>
    timestamp ? new Date(timestamp).toLocaleString("en-US", {
      month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
    }) : "N/A";

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: "You",
      senderRole: userRole || "Staff",
      message: newMessage,
      timestamp: new Date(),
    };
    setConversations((prev) => [...prev, newMsg]);
    setNewMessage("");
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full max-w-6xl h-full sm:h-[85vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* TOP BAR */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border border-blue-100">
              {ticket.ticket_number}
            </div>
            <h2 className="text-lg font-bold text-gray-800 truncate max-w-[300px]">{ticket.subject}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* LEFT COLUMN */}
          <div className="hidden md:flex w-1/3 border-r flex-col bg-gray-50/50">
            <div className="p-6 space-y-8 overflow-y-auto">
              
              <section>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Status & Priority</label>
                <div className="space-y-3">
                   {!editingStatus ? (
                    <div 
                      onClick={() => setEditingStatus(true)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer hover:bg-white transition-all ${STATUS_COLOR[displayStatus?.toLowerCase()] || 'bg-gray-100'}`}
                    >
                      <span className="text-sm font-bold uppercase">{STATUS_MAP[displayStatus?.toLowerCase()] || displayStatus}</span>
                      <div className="bg-white/50 p-1 rounded-md"><CheckCircle2 size={14} /></div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <select
                        value={selectedStatusId}
                        onChange={(e) => setSelectedStatusId(e.target.value)}
                        className="w-full text-sm border-2 border-blue-500 rounded-xl px-3 py-2 outline-none"
                      >
                        <option value="" disabled>Change status...</option>
                        {Object.entries(STATUS_ID_TO_NAME).map(([id, name]) => (
                          <option key={id} value={id}>{name}</option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <button onClick={handleStatusUpdate} className="flex-1 bg-blue-600 text-white text-xs py-2 rounded-lg font-bold">Save</button>
                        <button onClick={() => setEditingStatus(false)} className="flex-1 bg-gray-200 text-gray-600 text-xs py-2 rounded-lg font-bold">Cancel</button>
                      </div>
                    </div>
                  )}

                  <div className={`p-3 rounded-xl border flex items-center justify-between ${PRIORITY_COLOR[ticket.priority?.toLowerCase()]}`}>
                    <span className="text-sm font-bold uppercase">{PRIORITY_MAP[ticket.priority?.toLowerCase()] || ticket.priority} Priority</span>
                  </div>
                </div>
              </section>

              <section className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <h4 className="text-blue-800 text-sm font-bold mb-2 flex items-center gap-2">
                   <Info size={14} /> Description
                </h4>
                <p className="text-blue-900/70 text-sm leading-relaxed">{ticket.description}</p>
              </section>

              <section className="space-y-4">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">Details</label>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 flex items-center gap-2"><User size={14}/> Reporter</span>
                    <span className="font-medium text-gray-800">{ticket.created_by}</span>
                  </div>

                  {/* Assignee Section with Toggle */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center gap-2"><UserCog size={14}/> Assignee</span>
                      {!editingAssignee ? (
                        <button 
                          onClick={() => setEditingAssignee(true)}
                          className="text-blue-600 hover:underline font-medium flex items-center gap-1"
                        >
                          {displayAssignee || "Unassigned"} <UserPlus size={12} />
                        </button>
                      ) : (
                        <div className="flex flex-col gap-2 w-full mt-2">
                          <select
                            value={selectedAssigneeId}
                            onChange={(e) => setSelectedAssigneeId(e.target.value)}
                            className="w-full text-xs border rounded-lg px-2 py-1.5 outline-none"
                          >
                            <option value="">Select IT Personnel</option>
                            {supportUsers.map(u => (
                              <option key={u.employee_id} value={u.employee_id}>
                                {u.first_name} {u.last_name}
                              </option>
                            ))}
                          </select>
                          <div className="flex gap-2">
                            <button onClick={handleAssignUpdate} className="flex-1 bg-blue-600 text-white text-[10px] py-1 rounded font-bold">Assign</button>
                            <button onClick={() => setEditingAssignee(false)} className="flex-1 bg-gray-200 text-gray-600 text-[10px] py-1 rounded font-bold">Cancel</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 flex items-center gap-2"><Tag size={14}/> Category</span>
                    <span className="font-medium text-gray-800">{CATEGORY_MAP[ticket.category?.toLowerCase()] || ticket.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 flex items-center gap-2"><Clock size={14}/> Created</span>
                    <span className="font-medium text-gray-800 text-[12px]">{formatTimestamp(ticket.created_at)}</span>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* RIGHT COLUMN: CONVERSATION */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="p-4 border-b flex items-center gap-2 text-gray-500">
              <MessageSquare size={16} />
              <span className="text-sm font-semibold tracking-tight">Conversation Activity</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
              {conversations.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-40">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare size={32} />
                  </div>
                  <p className="text-sm font-medium">No messages in this thread</p>
                </div>
              ) : (
                conversations.map((msg) => (
                  <div key={msg.id} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-sm font-bold text-white shadow-md">
                      {getInitials(msg.sender)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-bold text-gray-900 text-sm">{msg.sender}</span>
                        <span className="text-[10px] font-bold text-blue-500 uppercase px-1.5 py-0.5 bg-blue-50 rounded">
                          {msg.senderRole}
                        </span>
                        <span className="text-[11px] text-gray-400 ml-auto">{formatTimestamp(msg.timestamp)}</span>
                      </div>
                      <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm text-sm text-gray-600 leading-relaxed">
                        {msg.message}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-white border-t">
              <div className="relative flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <input
                  type="text"
                  placeholder="Type a reply..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-transparent border-none px-4 py-2 text-sm outline-none focus:ring-0"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}