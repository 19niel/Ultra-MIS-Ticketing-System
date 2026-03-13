import { useEffect, useState, useRef, useCallback } from "react";
import { 
  X, Send, Clock, User, UserCog, Tag, MessageSquare, 
  Info, CheckCircle2, AlertCircle, Building2, MapPin, XCircle 
} from "lucide-react";
import { STATUS_MAP, PRIORITY_MAP, STATUS_COLOR, PRIORITY_COLOR, CATEGORY_MAP } from "../../../../mapping/ticketMapping";
import { DEPARTMENT_MAP, BRANCH_MAP } from "../../../../mapping/userDetailsMapping";
import { toast } from "sonner";
import { socket } from "../../../../socket"; 

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/tickets`;

export default function ViewTicket({ ticket, onClose }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  
  // --- Real-time Display States ---
  const [displayStatus, setDisplayStatus] = useState(ticket.status);
  const [displayPriority, setDisplayPriority] = useState(ticket.priority);
  const [displayAssignee, setDisplayAssignee] = useState(ticket.assigned_to);
  const [isResolved, setIsResolved] = useState(ticket.is_resolved);
  const [displayRemarks, setDisplayRemarks] = useState(ticket.remarks);
  const [displayClosedAt, setDisplayClosedAt] = useState(ticket.closed_at);
  const [displaySubject, setDisplaySubject] = useState(ticket.subject);
  const [displayDescription, setDisplayDescription] = useState(ticket.description);

  const [conversations, setConversations] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const isClosed = displayStatus?.toLowerCase() === 'closed' || displayStatus === "4" || displayStatus === "5";

  // --- SOCKET LISTENERS (Kept for Real-time) ---
  useEffect(() => {
    if (!socket) return;
    const ticketId = Number(ticket.ticket_id);

    const handleIncomingMessage = (data) => {
      if (Number(data.ticket_id) === ticketId) {
        setConversations((prev) => (prev.some(m => m.message_id === data.message_id) ? prev : [...prev, data]));
      }
    };
    
    const handleStatusUpdate = (data) => { 
      if (Number(data.ticket_id) === ticketId) {
        setDisplayStatus(data.status);
        if (data.is_resolved !== undefined) setIsResolved(data.is_resolved);
        if (data.remarks !== undefined) setDisplayRemarks(data.remarks);
        if (data.closed_at) setDisplayClosedAt(data.closed_at);
        toast.info(`Ticket status updated to: ${data.status}`);
      }
    };

    const handlePriorityUpdate = (data) => { 
      if (Number(data.ticket_id) === ticketId) setDisplayPriority(data.priority);
    };

    const handleAssigneeUpdate = (data) => { 
      if (Number(data.ticket_id) === ticketId) setDisplayAssignee(data.assigned_to);
    };

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
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, { credentials: "include" });
        if (res.ok) setCurrentUser((await res.json()).user);
      } catch (err) { console.error(err); }
    };
    fetchCurrentUser();
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      setLoadingMessages(true);
      const res = await fetch(`${BASE_URL}/${ticket.ticket_id}/messages`);
      if (res.ok) setConversations(await res.json());
    } catch (err) { console.error(err); } 
    finally { setLoadingMessages(false); }
  }, [ticket.ticket_id]);

  useEffect(() => {
    setDisplayStatus(ticket.status);
    setDisplayPriority(ticket.priority);
    setDisplayAssignee(ticket.assigned_to);
    setIsResolved(ticket.is_resolved);
    setDisplayClosedAt(ticket.closed_at);
    setDisplayRemarks(ticket.remarks);
    setDisplaySubject(ticket.subject);
    setDisplayDescription(ticket.description);
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
      if (res.ok) setNewMessage("");
    } catch (err) { toast.error("Failed to send message"); }
  };

  const formatTimestamp = (ts) => ts ? new Date(ts).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "N/A";

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-0 sm:p-4 text-left font-sans">
      <div className="bg-white w-full max-w-6xl h-full sm:h-[85vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* TOP BAR */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 uppercase tracking-wider">
              {ticket.ticket_number}
            </div>
            <h2 className="text-lg font-bold text-gray-800 truncate">{displaySubject}</h2>
          </div>
          
          <div className="flex items-center gap-3">
            {isClosed && (
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase border shadow-sm ${Number(isResolved) === 1 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {Number(isResolved) === 1 ? <CheckCircle2 size={14}/> : <XCircle size={14}/>}
                  {Number(isResolved) === 1 ? 'Resolved' : 'Failed'}
                </div>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* LEFT COLUMN: STATIC INFO */}
          <div className="hidden md:flex w-1/3 border-r flex-col bg-gray-50/50 p-6 space-y-8 overflow-y-auto">
            
            <section>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Status & Priority</label>
              <div className="space-y-3">
                  <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${STATUS_COLOR[displayStatus?.toLowerCase()] || 'bg-gray-100'}`}>
                    <span className="text-sm font-bold uppercase">{STATUS_MAP[displayStatus?.toLowerCase()] || displayStatus}</span>
                    <Clock size={14} className="opacity-60" />
                  </div>
                  <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${PRIORITY_COLOR[displayPriority?.toLowerCase()] || 'bg-gray-100'}`}>
                    <span className="text-sm font-bold uppercase">{PRIORITY_MAP[displayPriority?.toLowerCase()] || displayPriority} Priority</span>
                    <AlertCircle size={14} className="opacity-60" />
                  </div>
              </div>
            </section>

            <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <h4 className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2"><Info size={14} /> Description</h4>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">{displayDescription}</p>
            </section>

            <section className="space-y-3">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">Details</label>
              <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl">
                <Tag size={16} className="text-blue-500" />
                <span className="text-sm font-bold text-gray-700">{CATEGORY_MAP[ticket.category] || ticket.category || "Others"}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl">
                <Building2 size={16} className="text-gray-400" />
                <span className="text-sm font-bold text-gray-700">{DEPARTMENT_MAP[ticket.department_id] || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl">
                <MapPin size={16} className="text-gray-400" />
                <span className="text-sm font-bold text-gray-700">{BRANCH_MAP[ticket.branch_id] || "N/A"}</span>
              </div>
            </section>

            <section className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 flex items-center gap-2"><User size={14}/> Reporter</span>
                <span className="font-bold text-gray-800">{ticket.created_by}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 flex items-center gap-2"><UserCog size={14}/> Assignee</span>
                <span className="font-bold text-gray-800">{displayAssignee || "Unassigned"}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 flex items-center gap-2"><Clock size={14}/> Created</span>
                <span className="font-bold text-gray-800">{formatTimestamp(ticket.created_at)}</span>
              </div>

              {isClosed && (
                <div className="pt-4 border-t border-dashed border-gray-300 space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 flex items-center gap-2">
                        {Number(isResolved) === 1 ? <CheckCircle2 size={14} className="text-green-600"/> : <XCircle size={14} className="text-red-600"/>} 
                        Closed
                      </span>
                      <span className={`font-black ${Number(isResolved) === 1 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatTimestamp(displayClosedAt)}
                      </span>
                    </div>
                    <div className={`p-4 rounded-2xl border ${Number(isResolved) === 1 ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
                      <label className={`text-[10px] font-bold uppercase tracking-widest mb-2 block ${Number(isResolved) === 1 ? 'text-green-600' : 'text-red-600'}`}>Closing Remarks</label>
                      <p className="text-sm text-gray-700 leading-relaxed italic font-medium">"{displayRemarks || "No remarks provided."}"</p>
                    </div>
                </div>
              )}
            </section>
          </div>

          {/* RIGHT COLUMN: CONVERSATION */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="p-4 border-b flex items-center gap-2 text-gray-500 font-semibold text-sm">
              <MessageSquare size={16} /> Conversation Activity
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/20">
              {loadingMessages ? (
                <div className="text-center py-10 text-gray-400 text-sm">Loading Messages...</div>
              ) : conversations.map((msg) => (
                <div key={msg.message_id || Math.random()} className="flex gap-4 animate-in fade-in slide-in-from-bottom-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm">
                    {msg.first_name?.[0]}{msg.last_name?.[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-bold text-sm text-gray-900">{msg.first_name} {msg.last_name}</span>
                      <span className="text-[10px] font-bold text-blue-500 uppercase px-1.5 py-0.5 bg-blue-50 rounded border border-blue-100">{msg.senderRole}</span>
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
              <div className={`flex items-center gap-2 rounded-2xl p-2 border transition-all ${isClosed ? 'bg-gray-100 opacity-60' : 'bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white'}`}>
                <input
                  type="text"
                  disabled={isClosed}
                  placeholder={isClosed ? "This ticket is closed" : "Type your message..."}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-transparent px-4 py-2 text-sm outline-none disabled:cursor-not-allowed text-gray-700"
                />
                <button 
                  onClick={handleSendMessage} 
                  disabled={isClosed || !newMessage.trim()}
                  className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-md"
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