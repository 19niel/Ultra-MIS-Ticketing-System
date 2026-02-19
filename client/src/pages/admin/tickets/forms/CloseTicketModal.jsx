import React, { useState } from "react";
import { X, CheckCircle2, XCircle, HelpCircle } from "lucide-react";

export default function CloseTicketModal({ isOpen, onClose, onConfirm, ticketNumber, ticketSubject }) {
  const [selectedResolution, setSelectedResolution] = useState(null); // null, 1 (Resolved), or 0 (Failed)

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 border border-gray-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4">
            <HelpCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Close Ticket?</h3>
          <p className="text-gray-500 text-sm mt-2 px-4">
            Are you sure you want to close <span className="font-bold text-blue-600">{ticketNumber}</span>?
            <br />
            <span className="italic text-gray-400">"{ticketSubject}"</span>
          </p>
        </div>

        {/* Resolution Choices */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <button
            type="button"
            onClick={() => setSelectedResolution(1)}
            className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
              selectedResolution === 1 
              ? "border-green-500 bg-green-50 text-green-700" 
              : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200"
            }`}
          >
            <CheckCircle2 size={24} />
            <span className="font-bold text-sm">Resolved</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedResolution(0)}
            className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
              selectedResolution === 0 
              ? "border-red-500 bg-red-50 text-red-700" 
              : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200"
            }`}
          >
            <XCircle size={24} />
            <span className="font-bold text-sm">Failed</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            disabled={selectedResolution === null}
            onClick={() => onConfirm(selectedResolution)}
            className="flex-[2] bg-blue-600 text-white px-4 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 disabled:opacity-30 disabled:shadow-none transition-all active:scale-95"
          >
            Submit & Close
          </button>
        </div>
      </div>
    </div>
  );
}