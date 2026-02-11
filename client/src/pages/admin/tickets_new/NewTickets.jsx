import { useState, useEffect } from "react";
import { Send, Paperclip } from "lucide-react";
import { toast } from "sonner";

export default function NewTicket() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latestTicketNumber, setLatestTicketNumber] = useState("TKT-0000000");
  const [userData, setUserData] = useState(null); // Store session user here
  const [form, setForm] = useState({
    subject: "",
    category_id: "",
    priority_id: "",
    description: "",
  });

  // 1. Fetch the latest number AND the current session user
  useEffect(() => {
    // Fetch latest ticket number
    fetch("http://localhost:3000/api/tickets/latest-number")
      .then((res) => res.json())
      .then((data) => {
        if (data.latestTicketNumber) {
          setLatestTicketNumber(data.latestTicketNumber);
        }
      })
      .catch((err) => console.error("Error fetching latest number:", err));

    // Fetch user session from your /me endpoint
    // credentials: "include" is REQUIRED to send the session cookie
    fetch("http://localhost:3000/auth/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        setUserData(data.user);
      })
      .catch((err) => {
        console.error("Session fetch failed:", err);
        toast.error("Please login to create a ticket");
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 2. Logic to increment the string TKT-0000000
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
        subject: form.subject,
        description: form.description,
        created_by: userData.employee_id,
        assigned_to: null,
        status_id: 1, 
        priority_id: Number(form.priority_id),
        category_id: Number(form.category_id),
        department_id: Number(form.department_id), // Added
        branch_id: Number(form.branch_id),         // Added
        closed_at_id: null,
      };

      const res = await fetch("http://localhost:3000/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify(ticketPayload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create ticket");

      toast.success(`Ticket ${newTicketNumber} created successfully 🎉`);

      // Reset form and update latest locally
      setForm({ subject: "", category_id: "", priority_id: "", description: "" });
      setLatestTicketNumber(newTicketNumber);

    } catch (err) {
      console.error("Ticket creation failed:", err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Create New Ticket</h1>
        <p className="text-gray-500">Current Latest: {latestTicketNumber}</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-medium">Subject</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Category</label>
              <select name="category_id" value={form.category_id} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
                <option value="">Select category</option>
                <option value="1">Hardware</option>
                <option value="2">Software</option>
                <option value="3">Network</option>
                <option value="4">Email</option>
                <option value="5">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Priority</label>
              <select name="priority_id" value={form.priority_id} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
                <option value="">Select priority</option>
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Department</label>
              <select name="department_id" value={form.department_id} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
                <option value="">Department</option>
                <option value="1">MIS</option>
                <option value="2">HR</option>
                <option value="3">Sales</option>
                <option value="4">Finance</option>
                <option value="5">Manager</option>
                <option value="6">FSD</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Branch</label>
              <select name="branch_id" value={form.branch_id} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
                <option value="">Select priority</option>
                <option value="1">Head Office Angono</option>
                <option value="2">Pet Plans Guadalupe</option>
                <option value="3">Sucat Office</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full min-h-[150px] border rounded px-3 py-2" required />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2">
            <Send size={16} /> {isSubmitting ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
}