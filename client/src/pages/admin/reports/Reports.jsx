import React from 'react';
import { BarChart3, Search, FileText, Loader2 } from 'lucide-react';

const Reports = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center overflow-hidden relative">
      
      {/* BACKGROUND DECORATION (Floating Chart Bars) */}
      <div className="absolute inset-0 flex items-end justify-around px-20 opacity-[0.03] pointer-events-none">
        <div className="w-12 bg-blue-600 animate-[bounce_2s_infinite]" style={{ height: '40%' }}></div>
        <div className="w-12 bg-blue-600 animate-[bounce_3s_infinite]" style={{ height: '70%' }}></div>
        <div className="w-12 bg-blue-600 animate-[bounce_2.5s_infinite]" style={{ height: '50%' }}></div>
        <div className="w-12 bg-blue-600 animate-[bounce_3.5s_infinite]" style={{ height: '90%' }}></div>
      </div>

      {/* MAIN ANIMATION COMPONENT */}
      <div className="relative mb-8">
        {/* Rotating Search Ring */}
        <div className="absolute inset-0 border-4 border-dashed border-blue-100 rounded-full animate-[spin_10s_linear_infinite]"></div>
        
        <div className="relative bg-blue-600 p-6 rounded-2xl shadow-2xl shadow-blue-200">
          <BarChart3 size={48} className="text-white" />
          
          {/* Small Floating Icons */}
          <div className="absolute -top-2 -right-2 bg-yellow-400 p-1.5 rounded-lg shadow-md animate-bounce">
            <Search size={16} className="text-white" />
          </div>
        </div>
      </div>

      {/* TEXT SECTION */}
      <div className="space-y-4 z-10">
        <div className="flex items-center justify-center gap-2 text-blue-600 font-bold text-sm tracking-widest uppercase">
          <Loader2 size={16} className="animate-spin" />
          <span>Generating Insights</span>
        </div>
        
        <h1 className="text-4xl font-black text-gray-800 tracking-tight">
          Advanced Reporting
        </h1>
        
        <p className="text-gray-500 max-w-sm mx-auto font-medium leading-relaxed">
          We are currently calibrating the analytics engine to provide you with real-time data visualizations and exportable summaries.
        </p>
      </div>

      {/* MOCK DATA SKELETON ANIMATION */}
      <div className="mt-12 flex gap-3">
        <div className="h-2 w-12 bg-gray-100 rounded-full animate-pulse"></div>
        <div className="h-2 w-24 bg-blue-100 rounded-full animate-pulse"></div>
        <div className="h-2 w-16 bg-gray-100 rounded-full animate-pulse"></div>
      </div>

      {/* TOOLTIP-LIKE FOOTER */}
      <div className="mt-8 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3 text-slate-400">
        <FileText size={14} />
        <span className="text-xs font-semibold uppercase">Status: Finalizing Database Queries</span>
      </div>

    </div>
  );
};

export default Reports;