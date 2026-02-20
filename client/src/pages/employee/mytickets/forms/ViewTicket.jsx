import { useEffect, useState, useRef, useCallback } from "react";
import { X, Send, Clock, User, UserCog, Tag, MessageSquare, Info, CheckCircle2, AlertCircle, CalendarCheck, XCircle } from "lucide-react";
import { STATUS_MAP, PRIORITY_MAP, STATUS_COLOR, PRIORITY_COLOR, CATEGORY_MAP } from "../../../../mapping/ticketMapping";
import { toast } from "sonner";
import { socket } from "../../../../socket"; 

const BASE_URL = "http://localhost:3000/api/tickets";

export default function ViewTicket({ ticket, onClose, userRole }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [displayStatus, setDisplayStatus] = useState(ticket.status);
  const [displayPriority, setDisplayPriority] = useState(ticket.priority);
  const [displayAssignee, setDisplayAssignee] = useState(ticket.assigned_to);
  const [conversations, setConversations] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // Determine if ticket is finalized
  const isClosed = displayStatus?.toLowerCase() === "closed";
  const isResolved = displayStatus?.toLowerCase() === "resolved";
  const isFailed = displayStatus?.toLowerCase() === "failed"; // If you have a failed state

  // SOCKET LISTENERS
  useEffect(() => {
    if (!socket) return;
    const handleIncomingMessage = (data) => {
      if (data.ticket_id === ticket.ticket_id) {
        setConversations((prev) => {
          const isDuplicate = prev.some(m => m.message_id === data.message_id);
          if (isDuplicate) return prev;
          return [...prev, data]; 
        });
      }
    };
    const handleStatusUpdate = (data) => { if (data.ticket_id === ticket.ticket_id) setDisplayStatus(data.status); };
    const handlePriorityUpdate = (data) => { if (data.ticket_id === ticket.ticket_id) setDisplayPriority(data.priority); };
    const handleAssigneeUpdate = (data) => { if (parseInt(data.ticket_id) === parseInt(ticket.ticket_id)) setDisplayAssignee(data.assigned_to); };

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

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/auth/me", { method: "GET", credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        }
      } catch (err) { console.error("Failed to fetch current user session:", err); }
    };
    fetchCurrentUser();
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      setLoadingMessages(true);
      const res = await fetch(`${BASE_URL}/${ticket.ticket_id}/messages`);
      const data = await res.json();
      setConversations(data);
    } catch (err) { console.error("Failed to fetch messages", err); }
    finally { setLoadingMessages(false); }
  }, [ticket.ticket_id]);

  useEffect(() => {
    setDisplayStatus(ticket.status);
    setDisplayPriority(ticket.priority);
    setDisplayAssignee(ticket.assigned_to);
    fetchMessages();
  }, [ticket, fetchMessages]);

  useEffect(() => { scrollToBottom(); }, [conversations]);

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
      <div className="bg-white w-full max-w-6xl h-full sm:h-[85vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* TOP BAR */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-white text-left relative">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 uppercase tracking-wider">
              {ticket.ticket_number}
            </div>
            <h2 className="text-lg font-bold text-gray-800 truncate ">{ticket.subject}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* OUTCOME INDICATOR (BANNER) - Shown only when Resolved or Closed */}
        {(isResolved || isClosed || isFailed) && (
          <div className={`px-6 py-3 flex items-center justify-between border-b animate-in slide-in-from-top duration-500 ${
            isFailed ? "bg-red-50 border-red-100" : "bg-emerald-50 border-emerald-100"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-lg ${isFailed ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
                {isFailed ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
              </div>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${isFailed ? "text-red-500" : "text-emerald-600"}`}>
                  Ticket Outcome
                </p>
                <p className={`text-sm font-bold ${isFailed ? "text-red-700" : "text-emerald-800"}`}>
                  {isFailed ? "Issue Marked as Unresolved/Failed" : "Issue Successfully Resolved"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Closure Date</p>
              <p className="text-xs font-bold text-gray-600 flex items-center gap-1.5 justify-end">
                <CalendarCheck size={14} className="text-gray-400" />
                {formatTimestamp(ticket.updated_at)}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* LEFT COLUMN: TICKET INFO */}
          <div className="hidden md:flex w-1/3 border-r flex-col bg-gray-50/50 p-6 space-y-8 overflow-y-auto text-left text-pretty">
            
            {/* STATUS & PRIORITY BADGES */}
            <section>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Current Status</label>
              <div className="space-y-3">
                <div className={`flex items-center justify-between p-3 rounded-xl border shadow-sm ${STATUS_COLOR[displayStatus?.toLowerCase()] || 'bg-gray-100 border-gray-200'}`}>
                  <span className="text-sm font-bold uppercase">{STATUS_MAP[displayStatus?.toLowerCase()] || displayStatus}</span>
                  <CheckCircle2 size={14} className="opacity-60" />
                </div>
                <div className={`flex items-center justify-between p-3 rounded-xl border shadow-sm ${PRIORITY_COLOR[displayPriority?.toLowerCase()] || 'bg-gray-100 border-gray-200'}`}>
                  <span className="text-sm font-bold uppercase">{PRIORITY_MAP[displayPriority?.toLowerCase()] || displayPriority} Priority</span>
                  <AlertCircle size={14} className="opacity-60" />
                </div>
              </div>
            </section>

            {/* DESCRIPTION BOX */}
            <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <h4 className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                <Info size={14} /> Description
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {ticket.description}
              </p>
            </section>

            {/* METADATA DETAILS */}
            <section className="space-y-4">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">History Details</label>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2"><User size={14}/> Reporter</span>
                  <span className="font-semibold text-gray-800">{ticket.created_by}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2"><UserCog size={14}/> Assignee</span>
                  <span className={`font-semibold ${displayAssignee ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                    {displayAssignee || "Unassigned"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2"><Tag size={14}/> Category</span>
                  <span className="font-semibold text-gray-800">{CATEGORY_MAP[ticket.category?.toLowerCase()] || ticket.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2"><Clock size={14}/> Created</span>
                  <span className="font-semibold text-gray-800 text-[12px]">{formatTimestamp(ticket.created_at)}</span>
                </div>
                {(isResolved || isClosed) && (
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-emerald-600 flex items-center gap-2 font-bold"><CalendarCheck size={14}/> Resolved</span>
                    <span className="font-black text-emerald-700 text-[12px]">{formatTimestamp(ticket.updated_at)}</span>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: CONVERSATION */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="p-4 border-b flex items-center gap-2 text-gray-500 font-semibold text-sm bg-gray-50/30">
              <MessageSquare size={16} /> Conversation Activity
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/10 text-left">
              {loadingMessages ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400 space-y-2">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-bold uppercase">Loading Messages</span>
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm italic">No conversation history yet.</div>
              ) : conversations.map((msg) => (
                <div key={msg.message_id || Math.random()} className="flex gap-4 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                    {msg.first_name?.[0]}{msg.last_name?.[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-bold text-sm text-gray-900">{msg.first_name} {msg.last_name}</span>
                      <span className="text-[9px] font-black text-blue-500 uppercase px-1.5 py-0.5 bg-blue-50 rounded border border-blue-100 tracking-tighter">{msg.senderRole}</span>
                      <span className="text-[11px] text-gray-400 ml-auto font-medium">{formatTimestamp(msg.created_at)}</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm text-sm text-gray-700 leading-relaxed ring-1 ring-black/[0.02]">
                      {msg.message}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* MESSAGE INPUT */}
            {!isClosed && (
              <div className="p-4 bg-white border-t">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all shadow-inner">
                  <input
                    type="text"
                    placeholder="Type your message to support..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 bg-transparent px-4 py-2 text-sm outline-none text-gray-800"
                  />
                  <button onClick={handleSendMessage} disabled={!newMessage.trim()}
                    className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-200 transition-all active:scale-95"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            )}
            {isClosed && (
              <div className="p-4 bg-gray-100 border-t text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                This ticket is closed. Conversations are archived.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}