import { useState } from "react";
import { Shield, CheckCircle2 } from "lucide-react";
// Import your new section
import Security from "./sections/Security"; 

export default function Settings() {
  const [activeTab, setActiveTab] = useState("security");

  // To add a new section later: 
  // 1. Create the .jsx file in /sections
  // 2. Add it to this 'tabs' array
  const tabs = [
    { id: "security", label: "Security", icon: Shield, component: <Security /> },
    // { id: "preferences", label: "Preferences", icon: SettingsIcon, component: <Preferences /> },
  ];

  // Helper to find the current component based on activeTab
  const renderActiveSection = () => {
    const tab = tabs.find((t) => t.id === activeTab);
    return tab ? tab.component : <Security />;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-8 bg-gray-50/50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">System Settings</h1>
          <p className="text-gray-500 text-sm">Manage your account preferences and security.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* SIDE NAVIGATION */}
        <div className="w-full md:w-64 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                  ? "bg-white text-blue-600 shadow-sm border border-gray-100" 
                  : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 flex-1">
            {renderActiveSection()}
          </div>

          {/* FOOTER - Stays consistent across all sections */}
          <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">

                {/* Input Words here if you want */}
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}