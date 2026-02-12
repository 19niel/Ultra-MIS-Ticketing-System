import React from 'react';
import { HardHat, Pickaxe, Settings } from 'lucide-react';

const KnowledgeBase = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200 p-10 text-center">
      
      {/* ANIMATED ICON GROUP */}
      <div className="relative mb-8">
        {/* Large Rotating Gear */}
        <Settings size={80} className="text-blue-600 animate-[spin_8s_linear_infinite] opacity-20 absolute -top-4 -left-4" />
        
        {/* Main Icon with Bounce */}
        <div className="relative bg-white p-6 rounded-full shadow-xl border border-gray-100 animate-bounce">
          <HardHat size={60} className="text-yellow-500" />
        </div>

        {/* Floating Pickaxe */}
        <Pickaxe size={32} className="text-blue-500 absolute -bottom-2 -right-4 animate-pulse" />
      </div>

      {/* TEXT SECTION */}
      <div className="space-y-4 max-w-md">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest animate-pulse">
          Feature Under Construction
        </div>
        
        <h1 className="text-4xl font-black text-gray-800 tracking-tight">
          Knowledge Base
        </h1>
        
        <p className="text-gray-500 font-medium">
          We're currently building a library of guides and solutions to help you better. This section will be available soon!
        </p>
      </div>

      {/* ANIMATED LOADING BAR */}
      <div className="mt-10 w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 rounded-full animate-[progress_2s_ease-in-out_infinite] w-1/3"></div>
      </div>

      {/* CUSTOM STYLE FOR PROGRESS ANIMATION */}
      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>

    </div>
  );
};

export default KnowledgeBase;