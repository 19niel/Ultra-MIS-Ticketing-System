import React from "react";
import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";

export default function DeleteTicketForm({ isOpen, onClose, ticket, onDeleted }) {
  if (!isOpen || !ticket) return null;

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/tickets/${ticket.ticket_id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success(`Ticket ${ticket.ticket_number} deleted`);
      onDeleted();
      onClose();
    } catch (error) {
      toast.error("Failed to delete ticket");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 text-center">
          <div className="mx-auto w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 border border-amber-100">
            <AlertTriangle size={32} />
          </div>
          
          <h2 className="text-xl font-black text-gray-800 tracking-tight mb-2">Delete Ticket?</h2>
          
          <div className="space-y-3 px-4">
            <p className="text-sm text-gray-500 leading-relaxed">
              Are you sure you want to remove <span className="font-bold text-gray-800">#{ticket.ticket_number}</span>?
            </p>
            
            {/* Displaying the Subject here */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Subject</p>
              <p className="text-sm font-semibold text-gray-700 capitalize italic">
                "{ticket.subject}"
              </p>
            </div>

            <p className="text-[11px] text-red-500 font-medium italic">
              This action will permanently remove the ticket history.
            </p>
          </div>
        </div>

        <div className="flex gap-3 p-6 bg-gray-50/50 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all">
            Cancel
          </button>
          <button onClick={handleDelete} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-200">
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}