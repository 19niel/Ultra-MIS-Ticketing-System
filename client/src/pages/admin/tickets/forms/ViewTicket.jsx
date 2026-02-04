import { useEffect, useState, useRef } from "react";
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
  const [conversations, setConversations] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  
  const messagesEndRef = useRef(null);

  // Get current user from storage
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = storedUser?.user_id;

  // States for Status/Assignee
  const [editingStatus, setEditingStatus] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState("");
  const [editingAssignee, setEditingAssignee] = useState(false);
  const [supportUsers, setSupportUsers] = useState([]);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setDisplayStatus(ticket.status);
    setDisplayAssignee(ticket.assigned_to);
    fetchSupportUsers();
    fetchMessages();
  }, [ticket]);

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  const fetchMessages = async () => {
    try {
      setLoadingMessages(true);
      const res = await fetch(`http://localhost:3000/api/tickets/${ticket.ticket_id}/messages`);
      const data = await res.json();
      setConversations(data);
    } catch (err) {
      console.error("Failed to fetch messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchSupportUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/tickets/support-users");
      const data = await res.json();
      setSupportUsers(data);
    } catch (err) {
      console.error("Failed to fetch support users");
    }
  };

  const handleSendMessage = async () => {
    
    const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}"); // CORRECT
    const currentUserId = storedUser?.user_id;

  if (!currentUserId) {
    toast.error("User ID not found. Please log in again.");
    console.error("Missing currentUserId. Check localStorage 'user' object.");
    return;
  }

    try {
      const res = await fetch("http://localhost:3000/api/tickets/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticket_id: ticket.ticket_id,
          user_id: currentUserId, 
          message: newMessage,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");
      
      setNewMessage("");
      fetchMessages(); // Reload to show the new message with the user's name
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getInitials = (fname, lname) => {
    return `${fname?.[0] || ""}${lname?.[0] || ""}`.toUpperCase() || "?";
  };

  const formatTimestamp = (timestamp) =>
    timestamp ? new Date(timestamp).toLocaleString("en-US", {
      month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
    }) : "N/A";

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
          {/* LEFT COLUMN - Ticket Details */}
          <div className="hidden md:flex w-1/3 border-r flex-col bg-gray-50/50 overflow-y-auto">
             <div className="p-6 space-y-6">
                {/* Status Section */}
                <section>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Status & Priority</label>
                  <div className="space-y-3">
                     <div className={`p-3 rounded-xl border font-bold text-sm uppercase ${STATUS_COLOR[displayStatus?.toLowerCase()]}`}>
                        {STATUS_MAP[displayStatus?.toLowerCase()] || displayStatus}
                     </div>
                     <div className={`p-3 rounded-xl border font-bold text-sm uppercase ${PRIORITY_COLOR[ticket.priority?.toLowerCase()]}`}>
                        {ticket.priority} Priority
                     </div>
                  </div>
                </section>

                <section className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                  <h4 className="text-blue-800 text-sm font-bold mb-2 flex items-center gap-2"><Info size={14} /> Description</h4>
                  <p className="text-blue-900/70 text-sm leading-relaxed">{ticket.description}</p>
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
              {loadingMessages ? (
                <div className="flex justify-center py-10 text-gray-400 text-sm">Loading conversation...</div>
              ) : conversations.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-40">
                  <MessageSquare size={32} className="mb-4" />
                  <p className="text-sm font-medium">No messages yet</p>
                </div>
              ) : (
                conversations.map((msg) => {
                  const isMe = msg.user_id === currentUserId;
                  return (
                    <div key={msg.message_id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-md bg-gradient-to-tr ${isMe ? 'from-indigo-600 to-purple-500' : 'from-blue-600 to-indigo-500'}`}>
                        {getInitials(msg.first_name, msg.last_name)}
                      </div>
                      <div className={`flex-1 max-w-[80%] ${isMe ? 'text-right' : ''}`}>
                        <div className={`flex items-baseline gap-2 mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                          <span className="font-bold text-gray-900 text-sm">
                            {isMe ? "You" : `${msg.first_name} ${msg.last_name}`}
                          </span>
                          <span className="text-[10px] font-bold text-blue-500 uppercase px-1.5 py-0.5 bg-blue-50 rounded">
                            {msg.senderRole}
                          </span>
                          <span className="text-[11px] text-gray-400">{formatTimestamp(msg.created_at)}</span>
                        </div>
                        <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-600 border border-gray-100 rounded-tl-none'}`}>
                          {msg.message}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
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
                  className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
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