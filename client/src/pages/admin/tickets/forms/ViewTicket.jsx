import { useEffect, useState, useRef, useCallback } from "react";
import { 
  X, Send, Clock, User, UserCog, Tag, MessageSquare, 
  Info, CheckCircle2, UserPlus, AlertCircle, Building2, MapPin 
} from "lucide-react";
import { STATUS_MAP, PRIORITY_MAP, STATUS_COLOR, PRIORITY_COLOR, CATEGORY_MAP } from "../../../../mapping/ticketMapping";
import { DEPARTMENT_MAP, BRANCH_MAP } from "../../../../mapping/userDetailsMapping";
import { toast } from "sonner";
import { socket } from "../../../../socket"; 
import AdminEdit from "./AdminEdit"; // Renamed as requested

const STATUS_ID_TO_NAME = { 1: "Open", 2: "In Progress", 3: "On Hold", 4: "Resolved", 5: "Closed", 6: "Failed" };
const PRIORITY_ID_TO_NAME = { 1: "Low", 2: "Medium", 3: "High", 4: "Urgent" }; 
const BASE_URL = "http://localhost:3000/api/tickets";

export default function ViewTicket({ ticket, onClose, userRole }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [displayStatus, setDisplayStatus] = useState(ticket.status);
  const [displayPriority, setDisplayPriority] = useState(ticket.priority);
  const [displayAssignee, setDisplayAssignee] = useState(ticket.assigned_to);
  const [conversations, setConversations] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [supportUsers, setSupportUsers] = useState([]);

  // Edit States
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingPriority, setEditingPriority] = useState(false);
  const [editingAssignee, setEditingAssignee] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState("");
  const [selectedPriorityId, setSelectedPriorityId] = useState("");
  const [selectedAssigneeId, setSelectedAssigneeId] = useState("");

  // Admin Override States
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const isClosed = displayStatus?.toLowerCase() === 'closed';

  // HELPER: Logic to handle clicking fields when closed
  const attemptEdit = (field) => {
    if (isClosed) {
      setPendingAction(() => () => {
        if (field === 'status') setEditingStatus(true);
        if (field === 'priority') setEditingPriority(true);
        if (field === 'assignee') setEditingAssignee(true);
      });
      setIsAdminModalOpen(true);
    } else {
      if (field === 'status') setEditingStatus(true);
      if (field === 'priority') setEditingPriority(true);
      if (field === 'assignee') setEditingAssignee(true);
    }
  };

  // SOCKET LISTENERS
  useEffect(() => {
    if (!socket) return;
    const handleIncomingMessage = (data) => {
      if (data.ticket_id == ticket.ticket_id) {
        setConversations((prev) => {
          if (prev.some(m => m.message_id === data.message_id)) return prev;
          return [...prev, data]; 
        });
      }
    };
    const handleStatusUpdate = (data) => { if (data.ticket_id == ticket.ticket_id) setDisplayStatus(STATUS_ID_TO_NAME[data.status] || data.status); };
    const handlePriorityUpdate = (data) => { if (data.ticket_id == ticket.ticket_id) setDisplayPriority(PRIORITY_ID_TO_NAME[data.priority] || data.priority); };
    const handleAssigneeUpdate = (data) => { if (data.ticket_id == ticket.ticket_id) setDisplayAssignee(data.assigned_to); };

    socket.on("ticket:message:new", handleIncomingMessage);
    socket.on("ticket:statusUpdated", handleStatusUpdate);
    socket.on("ticket:priorityUpdated", handlePriorityUpdate);
    socket.on("ticket:assigneeUpdated", handleAssigneeUpdate);

    return () => {
      socket.off("ticket:message:new", handleIncomingMessage);
      socket.off("ticket:statusUpdated", handleStatusUpdate);
      socket.off("ticket:priorityUpdated", handlePriorityUpdate);
      socket.off("ticket:assigneeUpdated", handleAssigneeUpdate);
    };
  }, [ticket.ticket_id]);

  // INITIAL DATA FETCH
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [meRes, supportRes] = await Promise.all([
          fetch("http://localhost:3000/auth/me", { credentials: "include" }),
          fetch(`${BASE_URL}/support-users`)
        ]);
        if (meRes.ok) setCurrentUser((await meRes.json()).user);
        if (supportRes.ok) setSupportUsers(await supportRes.json());
      } catch (err) { console.error(err); }
    };
    fetchInitialData();
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      setLoadingMessages(true);
      const res = await fetch(`${BASE_URL}/${ticket.ticket_id}/messages`);
      setConversations(await res.json());
    } catch (err) { console.error(err); } 
    finally { setLoadingMessages(false); }
  }, [ticket.ticket_id]);

  useEffect(() => {
    setDisplayStatus(ticket.status);
    setDisplayPriority(ticket.priority);
    setDisplayAssignee(ticket.assigned_to);
    fetchMessages();
  }, [ticket, fetchMessages]);

  useEffect(() => { scrollToBottom(); }, [conversations]);

  // UPDATE HANDLERS
  const handleUpdate = async (type, body, successCallback) => {
    try {
      const endpoints = {
        status: `${BASE_URL}/status/${ticket.ticket_id}`,
        priority: `${BASE_URL}/priority/${ticket.ticket_id}`,
        assign: `${BASE_URL}/assign/${ticket.ticket_id}`,
      };
      const res = await fetch(endpoints[type], {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      successCallback();
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated`);
    } catch (err) { toast.error(`Update failed`); }
  };

  const handleCloseTicket = async () => {
    if (!window.confirm("Mark this ticket as Closed?")) return;
    try {
      const res = await fetch(`${BASE_URL}/close/${ticket.ticket_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error();
      toast.success("Ticket closed");
    } catch (err) { toast.error("Failed to close ticket"); }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;
    try {
      const res = await fetch(`${BASE_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_id: ticket.ticket_id, user_id: currentUser.user_id, message: newMessage }),
      });
      if (!res.ok) throw new Error();
      setNewMessage("");
    } catch (err) { toast.error("Failed to send message"); }
  };

  const formatTimestamp = (ts) => ts ? new Date(ts).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "N/A";

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-0 sm:p-4">
      
      {/* PASSWORD MODAL */}
      <AdminEdit 
        isOpen={isAdminModalOpen} 
        onClose={() => setIsAdminModalOpen(false)} 
        onConfirm={() => {
          setIsAdminModalOpen(false);
          if (pendingAction) pendingAction();
        }}
      />

      <div className="bg-white w-full max-w-6xl h-full sm:h-[85vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* TOP BAR */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-white text-left">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 uppercase tracking-wider">
              {ticket.ticket_number}
            </div>
            <h2 className="text-lg font-bold text-gray-800 truncate ">{ticket.subject}</h2>
          </div>
          
          <div className="flex items-center gap-3">
            {!isClosed && (
              <button 
                onClick={handleCloseTicket}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-xs font-bold transition-all border border-red-100"
              >
                <CheckCircle2 size={14} /> Close Ticket
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* LEFT COLUMN: TICKET INFO */}
          <div className="hidden md:flex w-1/3 border-r flex-col bg-gray-50/50 p-6 space-y-8 overflow-y-auto text-left">
            
            {/* STATUS & PRIORITY SECTION */}
            <section>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Status & Priority</label>
              <div className="space-y-3">
                {/* Status Field */}
                {!editingStatus ? (
                  <div onClick={() => attemptEdit('status')} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer hover:shadow-md transition-all ${STATUS_COLOR[displayStatus?.toLowerCase()] || 'bg-gray-100'}`}>
                    <span className="text-sm font-bold uppercase">{STATUS_MAP[displayStatus?.toLowerCase()] || displayStatus}</span>
                    <CheckCircle2 size={14} className="opacity-60" />
                  </div>
                ) : (
                  <div className="p-3 bg-white border-2 border-blue-500 rounded-xl space-y-2">
                    <select value={selectedStatusId} onChange={(e) => setSelectedStatusId(e.target.value)} className="w-full text-sm outline-none">
                      <option value="">Change status...</option>
                      {Object.entries(STATUS_ID_TO_NAME).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
                    </select>
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate('status', { status_id: selectedStatusId }, () => { setDisplayStatus(STATUS_ID_TO_NAME[selectedStatusId]); setEditingStatus(false); })} className="flex-1 bg-blue-600 text-white text-xs py-2 rounded-lg font-bold">Save</button>
                      <button onClick={() => setEditingStatus(false)} className="flex-1 bg-gray-200 text-gray-600 text-xs py-2 rounded-lg font-bold">Cancel</button>
                    </div>
                  </div>
                )}

                {/* Priority Field */}
                {!editingPriority ? (
                  <div onClick={() => attemptEdit('priority')} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer hover:shadow-md transition-all ${PRIORITY_COLOR[displayPriority?.toLowerCase()] || 'bg-gray-100'}`}>
                    <span className="text-sm font-bold uppercase">{PRIORITY_MAP[displayPriority?.toLowerCase()] || displayPriority} Priority</span>
                    <AlertCircle size={14} className="opacity-60" />
                  </div>
                ) : (
                  <div className="p-3 bg-white border-2 border-blue-500 rounded-xl space-y-2">
                    <select value={selectedPriorityId} onChange={(e) => setSelectedPriorityId(e.target.value)} className="w-full text-sm outline-none">
                      <option value="">Change priority...</option>
                      {Object.entries(PRIORITY_ID_TO_NAME).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
                    </select>
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate('priority', { priority_id: selectedPriorityId }, () => { setDisplayPriority(PRIORITY_ID_TO_NAME[selectedPriorityId]); setEditingPriority(false); })} className="flex-1 bg-blue-600 text-white text-xs py-2 rounded-lg font-bold">Save</button>
                      <button onClick={() => setEditingPriority(false)} className="flex-1 bg-gray-200 text-gray-600 text-xs py-2 rounded-lg font-bold">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* DESCRIPTION SECTION (RE-ADDED) */}
            <section className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <h4 className="text-blue-800 text-sm font-bold mb-2 flex items-center gap-2"><Info size={14} /> Description</h4>
              <p className="text-blue-900/70 text-sm leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
            </section>

            {/* SOURCE INFORMATION */}
            <section className="space-y-4">
               <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">Source Information</label>
               <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500"><Building2 size={16} /></div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase leading-none mb-1">Department</p>
                      <p className="text-sm font-bold text-gray-700">{DEPARTMENT_MAP[ticket.department_id] || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500"><MapPin size={16} /></div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase leading-none mb-1">Office Branch</p>
                      <p className="text-sm font-bold text-gray-700">{BRANCH_MAP[ticket.branch_id] || "N/A"}</p>
                    </div>
                  </div>
               </div>
            </section>

            {/* PEOPLE & TIME SECTION */}
            <section className="space-y-4 pt-4 border-t border-gray-100">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">People & Time</label>
              <div className="space-y-4 text-sm text-gray-800">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2"><User size={14}/> Reporter</span>
                  <span className="font-bold text-gray-700">{ticket.created_by}</span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-gray-500 flex items-center gap-2 mt-1"><UserCog size={14}/> Assignee</span>
                  <div className="text-right">
                    {!editingAssignee ? (
                      <button onClick={() => attemptEdit('assignee')} className="text-blue-600 hover:underline font-bold flex items-center gap-1">
                        {displayAssignee || "Unassigned"} <UserPlus size={12} />
                      </button>
                    ) : (
                      <div className="flex flex-col gap-2 min-w-[150px]">
                        <select value={selectedAssigneeId} onChange={(e) => setSelectedAssigneeId(e.target.value)} className="w-full text-xs border rounded-lg px-2 py-1 outline-none">
                          <option value="">Select IT...</option>
                          {supportUsers.map(u => <option key={u.employee_id} value={u.employee_id}>{u.first_name} {u.last_name}</option>)}
                        </select>
                        <div className="flex gap-1">
                          <button onClick={() => handleUpdate('assign', { assigned_to: selectedAssigneeId }, () => setEditingAssignee(false))} className="flex-1 bg-blue-600 text-white text-[10px] py-1 rounded font-bold">Save</button>
                          <button onClick={() => setEditingAssignee(false)} className="flex-1 bg-gray-200 text-gray-600 text-[10px] py-1 rounded font-bold text-center">X</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2"><Tag size={14}/> Category</span>
                  <span className="font-bold text-gray-700">{CATEGORY_MAP[ticket.category?.toLowerCase()] || ticket.category}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2"><Clock size={14}/> Created</span>
                  <span className="font-bold text-gray-400 text-xs">{formatTimestamp(ticket.created_at)}</span>
                </div>

                {isClosed && (
                  <div className="flex justify-between items-center pt-2 border-t border-dashed">
                    <span className="text-red-500 flex items-center gap-2 font-bold"><CheckCircle2 size={14}/> Closed On</span>
                    <span className="font-bold text-red-600 text-xs">{formatTimestamp(ticket.closed_at || new Date())}</span>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: CONVERSATION */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="p-4 border-b flex items-center gap-2 text-gray-500 font-semibold text-sm">
              <MessageSquare size={16} /> Conversation Activity
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30 text-left">
              {loadingMessages ? (
                <div className="text-center py-10 text-gray-400">Loading...</div>
              ) : conversations.map((msg) => (
                <div key={msg.message_id || Math.random()} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {msg.first_name?.[0]}{msg.last_name?.[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-bold text-sm">{msg.first_name} {msg.last_name}</span>
                      <span className="text-[10px] font-bold text-blue-500 uppercase px-1.5 py-0.5 bg-blue-50 rounded">{msg.senderRole}</span>
                      <span className="text-[11px] text-gray-400 ml-auto">{formatTimestamp(msg.created_at)}</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-sm text-gray-600 leading-relaxed">
                      {msg.message}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t">
              <div className={`flex items-center gap-2 border rounded-2xl p-2 transition-all ${isClosed ? 'bg-gray-100' : 'bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500'}`}>
                <input
                  type="text"
                  disabled={isClosed}
                  placeholder={isClosed ? "Ticket is closed" : "Type a reply..."}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-transparent px-4 py-2 text-sm outline-none disabled:cursor-not-allowed"
                />
                <button 
                  onClick={handleSendMessage} 
                  disabled={isClosed || !newMessage.trim()}
                  className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
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