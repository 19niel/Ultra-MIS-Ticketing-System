import { useState, useEffect } from "react";
import { Send, Building2, MapPin, Tag, AlertCircle, Pencil } from "lucide-react";
import { toast } from "sonner";

export default function NewTicket() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latestTicketNumber, setLatestTicketNumber] = useState("TKT-0000000");
  const [userData, setUserData] = useState(null);

  const [form, setForm] = useState({
    subject: "",
    category_id: "",
    priority_id: "",
    department_id: "",
    branch_id: "",
    description: "",
  });

  useEffect(() => {
    fetch("http://localhost:3000/api/tickets/latest-number")
      .then((res) => res.json())
      .then((data) => {
        if (data.latestTicketNumber) setLatestTicketNumber(data.latestTicketNumber);
      })
      .catch((err) => console.error("Error fetching latest number:", err));

    fetch("http://localhost:3000/auth/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => setUserData(data.user))
      .catch((err) => {
        console.error("Session fetch failed:", err);
        toast.error("Please login to create a ticket");
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateNextTicketNumber = (currentLatest) => {
    const parts = currentLatest.split("-");
    const lastNum = parseInt(parts[1], 10);
    const nextNum = lastNum + 1;
    return `TKT-${String(nextNum).padStart(7, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!userData?.employee_id) {
        toast.error("User session invalid. Please login again.");
        return;
      }

      const newTicketNumber = generateNextTicketNumber(latestTicketNumber);
      const ticketPayload = {
        ticket_number: newTicketNumber,
        ...form,
        priority_id: Number(form.priority_id),
        category_id: Number(form.category_id),
        department_id: Number(form.department_id),
        branch_id: Number(form.branch_id),
        created_by: userData.employee_id,
        status_id: 1,
        assigned_to: null,
      };

      const res = await fetch("http://localhost:3000/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(ticketPayload),
      });

      if (!res.ok) throw new Error("Failed to create ticket");

      toast.success(`Ticket ${newTicketNumber} created successfully 🎉`);
      setForm({ subject: "", category_id: "", priority_id: "", department_id: "", branch_id: "", description: "" });
      setLatestTicketNumber(newTicketNumber);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10 space-y-8 bg-gray-50/50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Create New Ticket</h1>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 border border-gray-200 font-mono mt-1">
            Next: {generateNextTicketNumber(latestTicketNumber)}
          </span>
        </div>
        <p className="text-gray-500 text-sm">Fill out the details below to submit a new support request.</p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* SUBJECT */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-400">
              <Pencil size={16} />
              <label className="text-[11px] font-bold uppercase tracking-tighter">Issue Subject</label>
            </div>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="e.g., Cannot access shared drive"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium shadow-sm"
              required
            />
          </div>

          {/* GRID SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CATEGORY */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-400">
                <Tag size={16} />
                <label className="text-[11px] font-bold uppercase tracking-tighter">Category</label>
              </div>
              <select name="category_id" value={form.category_id} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none focus:border-blue-500 shadow-sm transition-all" required>
                <option value="">Select Category</option>
                <option value="1">Hardware</option>
                <option value="2">Software</option>
                <option value="3">Network</option>
                <option value="4">Email</option>
                <option value="5">Other</option>
              </select>
            </div>

            {/* PRIORITY */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-400">
                <AlertCircle size={16} />
                <label className="text-[11px] font-bold uppercase tracking-tighter">Priority Level</label>
              </div>
              <select name="priority_id" value={form.priority_id} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none focus:border-blue-500 shadow-sm transition-all" required>
                <option value="">Select Priority</option>
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
                <option value="4">Urgent</option>
              </select>
            </div>

            {/* DEPARTMENT */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-400">
                <Building2 size={16} />
                <label className="text-[11px] font-bold uppercase tracking-tighter">Assigned Department</label>
              </div>
              <select name="department_id" value={form.department_id} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none focus:border-blue-500 shadow-sm transition-all" required>
                <option value="">Select Department</option>
                <option value="1">MIS</option>
                <option value="2">HR</option>
                <option value="3">Sales</option>
                <option value="4">Finance</option>
              </select>
            </div>

            {/* BRANCH */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin size={16} />
                <label className="text-[11px] font-bold uppercase tracking-tighter">Branch Location</label>
              </div>
              <select name="branch_id" value={form.branch_id} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none focus:border-blue-500 shadow-sm transition-all" required>
                <option value="">Select Branch</option>
                <option value="1">Head Office Angono</option>
                <option value="2">Pet Plans Guadalupe</option>
                <option value="3">Sucat Office</option>
              </select>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-400">
              <Pencil size={16} />
              <label className="text-[11px] font-bold uppercase tracking-tighter">Detailed Description</label>
            </div>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Please provide as much detail as possible..."
              className="w-full min-h-[180px] px-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium shadow-sm leading-relaxed"
              required
            />
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full group flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <>
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Submit Support Ticket
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}