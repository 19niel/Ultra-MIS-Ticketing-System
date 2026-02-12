import React, { useState } from "react";
import { Lock, ShieldAlert, X } from "lucide-react";

export default function AdminEdit({ isOpen, onClose, onConfirm }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace "admin123" with your actual logic or API call
    if (password === "admin123") {
      onConfirm();
      setPassword("");
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500); // Reset shake
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className={`bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden transform transition-all ${error ? "animate-bounce" : ""}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-amber-100 p-2 rounded-lg">
              <ShieldAlert className="text-amber-600" size={20} />
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <h3 className="text-lg font-bold text-gray-800">Ticket is Closed</h3>
          <p className="text-sm text-gray-500 mb-6">
            Editing a closed ticket requires authorization. Please enter the supervisor password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                autoFocus
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all ${
                  error ? "border-red-500 ring-2 ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
              />
            </div>
            
            {error && <p className="text-xs text-red-500 font-bold text-center italic">Invalid Password</p>}

            <button
              type="submit"
              className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition-colors"
            >
              Authorize Edit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}