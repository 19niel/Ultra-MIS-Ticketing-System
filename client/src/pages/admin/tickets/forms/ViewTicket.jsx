import { useEffect, useState, useRef, useCallback } from "react";
import { X, Send, Clock, User, UserCog, Tag, MessageSquare, Info, CheckCircle2, UserPlus, AlertCircle } from "lucide-react";
import { STATUS_MAP, PRIORITY_MAP, CATEGORY_MAP, STATUS_COLOR, PRIORITY_COLOR } from "../mapping";
import { toast } from "sonner";
import { socket } from "../../../../socket"; // 1. Socket is now active

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

  const messagesEndRef = useRef(null);
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingPriority, setEditingPriority] = useState(false);
  const [editingAssignee, setEditingAssignee] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState("");
  const [selectedPriorityId, setSelectedPriorityId] = useState("");
  const [selectedAssigneeId, setSelectedAssigneeId] = useState("");

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // 2. SOCKET LISTENER FOR REAL-TIME UPDATES
  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (data) => {
      if (data.ticket_id === ticket.ticket_id) {
        setConversations((prev) => {
          const isDuplicate = prev.some(m => m.message_id === data.message_id);
          if (isDuplicate) return prev;

          // Since the backend now sends names and roles, 
          // we just use the incoming data directly!
          return [...prev, data]; 
        });
      }
    };

    socket.on("ticket:message:new", handleIncomingMessage);

    return () => {
      socket.off("ticket:message:new", handleIncomingMessage);
    };
  }, [ticket.ticket_id]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/auth/me", {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch current user session:", err);
      }
    };
    fetchCurrentUser();
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      setLoadingMessages(true);
      const res = await fetch(`${BASE_URL}/${ticket.ticket_id}/messages`);
      const data = await res.json();
      setConversations(data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setLoadingMessages(false);
    }
  }, [ticket.ticket_id]);

  useEffect(() => {
    setDisplayStatus(ticket.status);
    setDisplayPriority(ticket.priority);
    setDisplayAssignee(ticket.assigned_to);
    fetchMessages();
    
    fetch(`${BASE_URL}/support-users`)
      .then(res => res.json())
      .then(data => setSupportUsers(data))
      .catch(err => console.error(err));
  }, [ticket, fetchMessages]);

  useEffect(() => { scrollToBottom(); }, [conversations]);

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
    } catch (err) {
      toast.error(`Update failed`);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;

    try {
      const res = await fetch(`${BASE_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticket_id: ticket.ticket_id,
          user_id: currentUser.user_id,
          message: newMessage,
        }),
      });
      if (!res.ok) throw new Error();
      setNewMessage("");
      // fetchMessages(); // Optional: Socket will now handle the UI update
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  const formatTimestamp = (ts) => ts ? new Date(ts).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "N/A";

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full max-w-6xl h-full sm:h-[85vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* TOP BAR */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-white text-left">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 uppercase tracking-wider">
              {ticket.ticket_number}
            </div>
            <h2 className="text-lg font-bold text-gray-800 truncate max-w-[300px]">{ticket.subject}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* LEFT COLUMN: TICKET INFO */}
          <div className="hidden md:flex w-1/3 border-r flex-col bg-gray-50/50 p-6 space-y-8 overflow-y-auto text-left">
            <section>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Status & Priority</label>
              <div className="space-y-3">
                {!editingStatus ? (
                  <div onClick={() => setEditingStatus(true)} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer hover:shadow-md transition-all ${STATUS_COLOR[displayStatus?.toLowerCase()] || 'bg-gray-100'}`}>
                    <span className="text-sm font-bold uppercase">{STATUS_MAP[displayStatus?.toLowerCase()] || displayStatus}</span>
                    <CheckCircle2 size={14} className="opacity-60" />
                  </div>
                ) : (
                  <div className="space-y-2 animate-in slide-in-from-top-1 duration-200">
                    <select value={selectedStatusId} onChange={(e) => setSelectedStatusId(e.target.value)} className="w-full text-sm border-2 border-blue-500 rounded-xl px-3 py-2 outline-none">
                      <option value="">Change status...</option>
                      {Object.entries(STATUS_ID_TO_NAME).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
                    </select>
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate('status', { status_id: selectedStatusId }, () => { setDisplayStatus(STATUS_ID_TO_NAME[selectedStatusId]); setEditingStatus(false); })} className="flex-1 bg-blue-600 text-white text-xs py-2 rounded-lg font-bold">Save</button>
                      <button onClick={() => setEditingStatus(false)} className="flex-1 bg-gray-200 text-gray-600 text-xs py-2 rounded-lg font-bold">Cancel</button>
                    </div>
                  </div>
                )}

                {!editingPriority ? (
                  <div onClick={() => setEditingPriority(true)} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer hover:shadow-md transition-all ${PRIORITY_COLOR[displayPriority?.toLowerCase()] || 'bg-gray-100'}`}>
                    <span className="text-sm font-bold uppercase">{PRIORITY_MAP[displayPriority?.toLowerCase()] || displayPriority} Priority</span>
                    <AlertCircle size={14} className="opacity-60" />
                  </div>
                ) : (
                  <div className="space-y-2 animate-in slide-in-from-top-1 duration-200">
                    <select value={selectedPriorityId} onChange={(e) => setSelectedPriorityId(e.target.value)} className="w-full text-sm border-2 border-blue-500 rounded-xl px-3 py-2 outline-none">
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

            <section className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <h4 className="text-blue-800 text-sm font-bold mb-2 flex items-center gap-2"><Info size={14} /> Description</h4>
              <p className="text-blue-900/70 text-sm leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
            </section>

            <section className="space-y-4">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">Details</label>
              <div className="space-y-4 text-sm text-gray-800">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2"><User size={14}/> Reporter</span>
                  <span className="font-medium">{ticket.created_by}</span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-gray-500 flex items-center gap-2 mt-1"><UserCog size={14}/> Assignee</span>
                  {!editingAssignee ? (
                    <button onClick={() => setEditingAssignee(true)} className="text-blue-600 hover:underline font-medium flex items-center gap-1">
                      {displayAssignee || "Unassigned"} <UserPlus size={12} />
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2 w-1/2">
                      <select value={selectedAssigneeId} onChange={(e) => setSelectedAssigneeId(e.target.value)} className="w-full text-xs border rounded-lg px-2 py-1 outline-none">
                        <option value="">Select IT...</option>
                        {supportUsers.map(u => <option key={u.employee_id} value={u.employee_id}>{u.first_name} {u.last_name}</option>)}
                      </select>
                      <div className="flex gap-1">
                        <button onClick={() => handleUpdate('assign', { assigned_to: selectedAssigneeId }, () => {
                          const user = supportUsers.find(u => u.employee_id === selectedAssigneeId);
                          setDisplayAssignee(`${user.first_name} ${user.last_name}`);
                          setEditingAssignee(false);
                        })} className="flex-1 bg-blue-600 text-white text-[10px] py-1 rounded">Save</button>
                        <button onClick={() => setEditingAssignee(false)} className="flex-1 bg-gray-200 text-gray-600 text-[10px] py-1 rounded">X</button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500 flex items-center gap-2"><Tag size={14}/> Category</span>
                  <span className="font-medium">{CATEGORY_MAP[ticket.category?.toLowerCase()] || ticket.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 flex items-center gap-2"><Clock size={14}/> Created</span>
                  <span className="font-medium text-[12px]">{formatTimestamp(ticket.created_at)}</span>
                </div>
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
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0">
                    {msg.first_name?.[0]}{msg.last_name?.[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-bold text-sm">{msg.first_name} {msg.last_name}</span>
                      <span className="text-[10px] font-bold text-blue-500 uppercase px-1.5 py-0.5 bg-blue-50 rounded">{msg.senderRole}</span>
                      <span className="text-[11px] text-gray-400 ml-auto">{formatTimestamp(msg.created_at)}</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm text-sm text-gray-600 leading-relaxed">
                      {msg.message}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t">
              <div className="flex items-center gap-2 bg-gray-50 border rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <input
                  type="text"
                  placeholder="Type a reply..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-transparent px-4 py-2 text-sm outline-none"
                />
                <button onClick={handleSendMessage} className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
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