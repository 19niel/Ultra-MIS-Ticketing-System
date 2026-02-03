import { useState } from "react";
import { Save, Bell, Shield, Palette, Globe } from "lucide-react";

export default function Settings() {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Smith");
  const [email, setEmail] = useState("john.smith@company.com");
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("en");

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-gray-800">Settings</h1>
          <p className="text-gray-500">Manage your account and system preferences</p>
        </div>

        {/* Profile Settings */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center gap-2 text-gray-800 font-semibold">
            <Globe className="w-5 h-5" /> Profile Settings
          </div>
          <p className="text-gray-500 text-sm">Update your personal information</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-700">First Name</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Last Name</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              className="w-full border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700">Role</label>
            <input
              type="text"
              className="w-full border p-2 rounded bg-gray-100"
              value="Administrator"
              disabled
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center gap-2 text-gray-800 font-semibold">
            <Bell className="w-5 h-5" /> Notifications
          </div>
          <p className="text-gray-500 text-sm">Manage how you receive notifications</p>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-gray-700 font-medium">Email Notifications</label>
              <p className="text-sm text-gray-500">Receive email updates for new tickets</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-gray-700 font-medium">Push Notifications</label>
              <p className="text-sm text-gray-500">Receive push notifications in browser</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center gap-2 text-gray-800 font-semibold">
            <Shield className="w-5 h-5" /> Security
          </div>
          <p className="text-gray-500 text-sm">Manage your security preferences</p>
          <div>
            <label className="block mb-1 text-gray-700">Current Password</label>
            <input type="password" className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block mb-1 text-gray-700">New Password</label>
            <input type="password" className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block mb-1 text-gray-700">Confirm New Password</label>
            <input type="password" className="w-full border p-2 rounded" />
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center gap-2 text-gray-800 font-semibold">
            <Palette className="w-5 h-5" /> Appearance
          </div>
          <p className="text-gray-500 text-sm">Customize your dashboard appearance</p>
          <div>
            <label className="block mb-1 text-gray-700">Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-gray-700">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="bg-blue-600 text-white px-6 py-2 rounded flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
