import React from "react";
import { toast } from "sonner";
import { AlertCircle, X } from "lucide-react";

export default function DeleteUserForm({ isOpen, onClose, user, onDeleted }) {
  if (!isOpen || !user) return null;

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/users/${user.user_id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("User deleted successfully");
      onDeleted();
      onClose();
    } catch (error) {
      toast.error("Server error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 text-center">
          <div className="mx-auto w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4 border border-red-100">
            <AlertCircle size={32} />
          </div>
          
          <h2 className="text-xl font-black text-gray-800 tracking-tight mb-2">Confirm Delete</h2>
          <p className="text-sm text-gray-500 leading-relaxed px-4">
            Are you sure you want to remove <span className="font-bold text-gray-800">{user.first_name} {user.last_name}</span>? This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3 p-6 bg-gray-50/50 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all">
            Keep User
          </button>
          <button onClick={handleDelete} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-200">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}