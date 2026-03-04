import React from 'react';
import { Tag, AlertCircle,Building2 } from "lucide-react";

export const NewTicketTemplate = ({ ticket }) => (
    
  <div className="flex flex-col gap-1 w-full pointer-events-auto">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5">
        <div className="p-1 bg-blue-100 rounded-lg text-blue-600">
          <AlertCircle size={14} />
        </div>
        <span className="text-xs font-black uppercase tracking-tighter text-gray-400">
          {ticket.subject}
        </span>
      </div>
      <span className="font-mono bg-slate-100 text-[10px] px-1.5 py-0.5 rounded border border-slate-200 font-bold">
        {ticket.ticket_number}
      </span>
    </div>

    <div className="mt-1">
      <p className="text-sm font-bold text-gray-800 line-clamp-1 capitalize">
        {ticket.reporter}
      </p>
      <div className="flex items-center gap-1 mt-0.5">
        <Building2 size={10} className="text-gray-400" />
        <span className="text-[10px] font-medium text-gray-500 uppercase">
          {ticket.category}
        </span>
      </div>
            <div className="flex items-center gap-1 mt-0.5">
        <Tag size={10} className="text-gray-400" />
        <span className="text-[10px] font-medium text-gray-500 uppercase">
          {ticket.department}
        </span>
      </div>
    </div>
  </div>
);