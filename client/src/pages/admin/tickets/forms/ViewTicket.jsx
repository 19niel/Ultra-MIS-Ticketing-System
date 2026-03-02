import { useEffect, useState, useRef, useCallback } from "react";
import { 
  X, Send, Clock, User, UserCog, Tag, MessageSquare, Info, CheckCircle2, 
  UserPlus, AlertCircle, Building2, MapPin, Edit3, XCircle 
} from "lucide-react";
import { STATUS_MAP, PRIORITY_MAP, STATUS_COLOR, PRIORITY_COLOR, CATEGORY_MAP } from "../../../../mapping/ticketMapping";
import { DEPARTMENT_MAP, BRANCH_MAP } from "../../../../mapping/userDetailsMapping";
import { toast } from "sonner";
import { socket } from "../../../../socket"; 
import AdminEdit from "./AdminEdit";
import CloseTicketModal from "./CloseTicketModal";

const STATUS_ID_TO_NAME = { 1: "Open", 2: "In Progress", 3: "On Hold" };
const PRIORITY_ID_TO_NAME = { 1: "Low", 2: "Medium", 3: "High", 4: "Urgent" }; 
const BASE_URL = "http://localhost:3000/api/tickets";

export default function ViewTicket({ ticket, onClose }) {
  // --- States ---
  const [currentUser, setCurrentUser] = useState(null);
  const [supportUsers, setSupportUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  
  // Ticket Display States
  const [ticketState, setTicketState] = useState({
    status: ticket.status,
    priority: ticket.priority,
    assignee: ticket.assigned_to,
    isResolved: ticket.is_resolved,
    closedAt: ticket.closed_at
  });

  // Edit Inline States
  const [editing, setEditing] = useState({ status: false, priority: false, assignee: false });
  const [selectedIds, setSelectedIds] = useState({ status: "", priority: "", assignee: "" });

  // Modal & Auth States
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const isClosed = (ticketState.status?.toLowerCase() === 'closed' || String(ticket.status_id) === "4") && !isAuthorized;

  // --- Logic ---
  const attemptEdit = (field) => {
    const startEditing = () => setEditing(prev => ({ ...prev, [field]: true }));
    if (isClosed) {
      setPendingAction(() => startEditing);
      setIsAdminModalOpen(true);
    } else {
      startEditing();
    }
  };

  const fetchMessages = useCallback(async () => {
    try {
      setLoadingMessages(true);
      const res = await fetch(`${BASE_URL}/${ticket.ticket_id}/messages`);
      setConversations(await res.json());
    } catch (err) { console.error(err); } 
    finally { setLoadingMessages(false); }
  }, [ticket.ticket_id]);

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
    fetchMessages();

    socket.on("ticket:message:new", (data) => {
      if (data.ticket_id == ticket.ticket_id) {
        setConversations(prev => prev.some(m => m.message_id === data.message_id) ? prev : [...prev, data]);
      }
    });

    socket.on("ticket:statusUpdated", (data) => {
      if (data.ticket_id == ticket.ticket_id) {
        setTicketState(prev => ({ ...prev, status: STATUS_ID_TO_NAME[data.status] || data.status, closedAt: data.closed_at || prev.closedAt }));
      }
    });

    return () => {
      socket.off("ticket:message:new");
      socket.off("ticket:statusUpdated");
    };
  }, [ticket.ticket_id, fetchMessages, ticket.status]);

  useEffect(() => { scrollToBottom(); }, [conversations]);

  const handleUpdate = async (type, body, field) => {
    try {
      const endpoints = { status: 'status', priority: 'priority', assignee: 'assign' };
      const res = await fetch(`${BASE_URL}/${endpoints[type]}/${ticket.ticket_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      setEditing(prev => ({ ...prev, [field || type]: false }));
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated`);
    } catch (err) { toast.error(`Update failed`); }
  };

  const handleConfirmClose = async (resolutionValue) => {
    try {
      const res = await fetch(`${BASE_URL}/close/${ticket.ticket_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_resolved: resolutionValue }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      
      setTicketState(prev => ({ ...prev, isResolved: resolutionValue, status: "Closed", closedAt: data.closed_at || new Date().toISOString() }));
      setIsAuthorized(false); 
      setIsCloseModalOpen(false);
      toast.success("Ticket closed successfully");
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
      if (res.ok) setNewMessage("");
    } catch (err) { toast.error("Failed to send message"); }
  };

  const formatTimestamp = (ts) => ts ? new Date(ts).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "N/A";

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-0 sm:p-4 text-left">
      <AdminEdit 
        isOpen={isAdminModalOpen} 
        onClose={() => setIsAdminModalOpen(false)} 
        onConfirm={() => { setIsAdminModalOpen(false); setIsAuthorized(true); pendingAction?.(); }}
      />

      <CloseTicketModal 
        isOpen={isCloseModalOpen} onClose={() => setIsCloseModalOpen(false)} onConfirm={handleConfirmClose}
        ticketNumber={ticket.ticket_number} ticketSubject={ticket.subject}
      />

      <div className="bg-white w-full max-w-6xl h-full sm:h-[85vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 uppercase">{ticket.ticket_number}</div>
            <h2 className="text-lg font-bold text-gray-800 truncate">{ticket.subject}</h2>
          </div>
          <div className="flex items-center gap-3">
            {(!isClosed || isAuthorized) ? (
              <button onClick={() => setIsCloseModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-xs font-bold transition-all border border-red-100">
                <CheckCircle2 size={14} /> {isAuthorized ? "Update & Close" : "Close Ticket"}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                 <button onClick={() => setIsAdminModalOpen(true)} className="p-2 bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all"><Edit3 size={16} /></button>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase border shadow-sm ${Number(ticketState.isResolved) === 1 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {Number(ticketState.isResolved) === 1 ? <CheckCircle2 size={14}/> : <XCircle size={14}/>} {Number(ticketState.isResolved) === 1 ? 'Resolved' : 'Failed'}
                </div>
              </div>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="h-5 w-5 text-gray-500" /></button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="hidden md:flex w-1/3 border-r flex-col bg-gray-50/50 p-6 space-y-6 overflow-y-auto">
            <section>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Status & Priority</label>
              <div className="space-y-3">
                {!editing.status ? (
                  <div onClick={() => attemptEdit('status')} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer hover:shadow-md transition-all ${STATUS_COLOR[ticketState.status?.toLowerCase()] || 'bg-gray-100'}`}>
                    <span className="text-sm font-bold uppercase">{STATUS_MAP[ticketState.status?.toLowerCase()] || ticketState.status}</span>
                    <Clock size={14} className="opacity-60" />
                  </div>
                ) : (
                  <div className="p-3 bg-white border-2 border-blue-500 rounded-xl space-y-2">
                    <select value={selectedIds.status} onChange={(e) => setSelectedIds(p => ({...p, status: e.target.value}))} className="w-full text-sm outline-none">
                      <option value="">Change status...</option>
                      {Object.entries(STATUS_ID_TO_NAME).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
                    </select>
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate('status', { status_id: selectedIds.status }, 'status')} className="flex-1 bg-blue-600 text-white text-xs py-2 rounded-lg font-bold">Save</button>
                      <button onClick={() => setEditing(p => ({...p, status: false}))} className="flex-1 bg-gray-200 text-gray-600 text-xs py-2 rounded-lg font-bold">Cancel</button>
                    </div>
                  </div>
                )}

                {!editing.priority ? (
                  <div onClick={() => attemptEdit('priority')} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer hover:shadow-md transition-all ${PRIORITY_COLOR[ticketState.priority?.toLowerCase()] || 'bg-gray-100'}`}>
                    <span className="text-sm font-bold uppercase">{PRIORITY_MAP[ticketState.priority?.toLowerCase()] || ticketState.priority} Priority</span>
                    <AlertCircle size={14} className="opacity-60" />
                  </div>
                ) : (
                  <div className="p-3 bg-white border-2 border-blue-500 rounded-xl space-y-2">
                    <select value={selectedIds.priority} onChange={(e) => setSelectedIds(p => ({...p, priority: e.target.value}))} className="w-full text-sm outline-none">
                      <option value="">Change priority...</option>
                      {Object.entries(PRIORITY_ID_TO_NAME).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
                    </select>
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate('priority', { priority_id: selectedIds.priority }, 'priority')} className="flex-1 bg-blue-600 text-white text-xs py-2 rounded-lg font-bold">Save</button>
                      <button onClick={() => setEditing(p => ({...p, priority: false}))} className="flex-1 bg-gray-200 text-gray-600 text-xs py-2 rounded-lg font-bold">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <h4 className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2"><Info size={14} /> Description</h4>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">{ticket.description}</p>
            </section>

            <section className="space-y-3">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">Details</label>
              <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl"><Tag size={16} className="text-blue-500" /><span className="text-sm font-bold text-gray-700">{CATEGORY_MAP[ticket.category_id] || ticket.category_name}</span></div>
              <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl"><Building2 size={16} className="text-gray-400" /><span className="text-sm font-bold text-gray-700">{ticket.department_name || DEPARTMENT_MAP[ticket.department_id]}</span></div>
              <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl"><MapPin size={16} className="text-gray-400" /><span className="text-sm font-bold text-gray-700">{ticket.branch_name || BRANCH_MAP[ticket.branch_id]}</span></div>
            </section>

            <section className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center text-sm"><span className="text-gray-500 flex items-center gap-2"><User size={14}/> Reporter</span><span className="font-bold text-gray-800">{ticket.created_by}</span></div>
              
              <div className="flex justify-between items-start text-sm">
                <span className="text-gray-500 flex items-center gap-2 mt-1"><UserCog size={14}/> Assignee</span>
                {!editing.assignee ? (
                  <button onClick={() => attemptEdit('assignee')} className="text-blue-600 hover:underline font-bold flex items-center gap-1">{ticketState.assignee || "Unassigned"} <UserPlus size={12} /></button>
                ) : (
                  <div className="flex flex-col gap-2 min-w-[150px]">
                    <select value={selectedIds.assignee} onChange={(e) => setSelectedIds(p => ({...p, assignee: e.target.value}))} className="w-full text-xs border rounded-lg px-2 py-1">
                      <option value="">Select IT...</option>
                      {supportUsers.map(u => <option key={u.employee_id} value={u.employee_id}>{u.first_name} {u.last_name}</option>)}
                    </select>
                    <div className="flex gap-1">
                      <button onClick={() => handleUpdate('assign', { assigned_to: selectedIds.assignee }, 'assignee')} className="flex-1 bg-blue-600 text-white text-[10px] py-1 rounded font-bold">Save</button>
                      <button onClick={() => setEditing(p => ({...p, assignee: false}))} className="flex-1 bg-gray-200 text-gray-600 text-[10px] py-1 rounded font-bold">X</button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center text-sm"><span className="text-gray-500 flex items-center gap-2"><Clock size={14}/> Created</span><span className="font-bold text-gray-800">{formatTimestamp(ticket.created_at)}</span></div>
              {(isClosed || ticket.status_id === 4) && (
                <div className="pt-2 border-t border-dashed border-gray-300 flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-2">{Number(ticketState.isResolved) === 1 ? <CheckCircle2 size={14} className="text-green-600"/> : <XCircle size={14} className="text-red-600"/>} Closed</span>
                  <span className={`font-black ${Number(ticketState.isResolved) === 1 ? 'text-green-600' : 'text-red-600'}`}>{formatTimestamp(ticketState.closedAt)}</span>
                </div>
              )}
            </section>
          </div>

          {/* Chat Section */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="p-4 border-b flex items-center gap-2 text-gray-500 font-semibold text-sm">
              <MessageSquare size={16} /> Conversation Activity
              {isAuthorized && <span className="ml-auto text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 uppercase font-bold">Admin Override</span>}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/20">
              {loadingMessages ? (
                <div className="text-center py-10 text-gray-400">Loading Messages...</div>
              ) : conversations.map((msg) => (
                <div key={msg.message_id || Math.random()} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm">{msg.first_name?.[0]}{msg.last_name?.[0]}</div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-bold text-sm text-gray-900">{msg.first_name} {msg.last_name}</span>
                      <span className="text-[10px] font-bold text-blue-500 uppercase px-1.5 py-0.5 bg-blue-50 rounded border border-blue-100">{msg.senderRole}</span>
                      <span className="text-[11px] text-gray-400 ml-auto">{formatTimestamp(msg.created_at)}</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-sm text-gray-600 leading-relaxed">{msg.message}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t">
              <div className={`flex items-center gap-2 rounded-2xl p-2 border transition-all ${isClosed ? 'bg-gray-100 opacity-60' : 'bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500'}`}>
                <input
                  type="text" disabled={isClosed} placeholder={isClosed ? "Ticket closed (Authorize to reply)" : "Type your reply..."}
                  value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-transparent px-4 py-2 text-sm outline-none disabled:cursor-not-allowed text-gray-700"
                />
                <button onClick={handleSendMessage} disabled={isClosed || !newMessage.trim()} className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"><Send size={18} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}