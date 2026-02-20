import { useState } from "react";
import { 
  Save, Bell, Shield, Palette, User, 
  Globe, Mail, Lock, CheckCircle2, Moon, Sun, Languages
} from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Smith");
  const [email, setEmail] = useState("john.smith@company.com");
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-8 bg-gray-50/50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">System Settings</h1>
          <p className="text-gray-500 text-sm">Manage your personal preferences and account security.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-sm active:scale-95">
          <Save size={18} />
          Save Changes
        </button>
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
        <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8">
            {activeTab === "profile" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                   <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <User size={20} />
                   </div>
                   <h2 className="text-lg font-bold text-gray-800">Profile Information</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-400">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-400">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-gray-400">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-gray-400">System Role</label>
                  <input
                    type="text"
                    disabled
                    className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 cursor-not-allowed"
                    value="Administrator"
                  />
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                   <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                      <Bell size={20} />
                   </div>
                   <h2 className="text-lg font-bold text-gray-800">Notification Preferences</h2>
                </div>

                <div className="space-y-4">
                  {[
                    { title: "Email Updates", desc: "Receive automated alerts for ticket changes", icon: Mail },
                    { title: "Push Notifications", desc: "Real-time alerts in your web browser", icon: Globe }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <item.icon size={18} className="text-gray-400" />
                        <div>
                          <p className="text-sm font-bold text-gray-800">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                   <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                      <Lock size={20} />
                   </div>
                   <h2 className="text-lg font-bold text-gray-800">Update Password</h2>
                </div>
                
                <div className="space-y-4 max-w-md">
                   {["Current Password", "New Password", "Confirm Password"].map((label) => (
                     <div key={label} className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-gray-400">{label}</label>
                        <input
                          type="password"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all text-sm"
                          placeholder="••••••••"
                        />
                     </div>
                   ))}
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                   <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                      <Palette size={20} />
                   </div>
                   <h2 className="text-lg font-bold text-gray-800">Interface Customization</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-2">
                      <Moon size={14} /> Theme Mode
                    </label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-bold text-gray-700 appearance-none"
                    >
                      <option value="light">Light Mode</option>
                      <option value="dark">Dark Mode</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-2">
                      <Languages size={14} /> Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-bold text-gray-700"
                    >
                      <option value="en">English (US)</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
            <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
              Last login: Feb 20, 2026 • 19:42 PM (this is static need to change)
            </p>
            <div className="flex items-center gap-1 text-green-600 text-[10px] font-black uppercase">
              <CheckCircle2 size={12} />
              All systems operational
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}