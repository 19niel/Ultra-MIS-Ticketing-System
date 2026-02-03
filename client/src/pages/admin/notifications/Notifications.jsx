import React from "react";
import { Bell, Trash2, CheckCheck } from "lucide-react";

// Dummy notifications data
const notifications = [
  {
    id: 1,
    type: "alert",
    title: "Server Down",
    message: "The email server is currently unreachable.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "info",
    title: "New User Registered",
    message: "A new user has signed up for an account.",
    time: "5 hours ago",
    read: true,
  },
  {
    id: 3,
    type: "alert",
    title: "Password Expiry",
    message: "Your password will expire in 3 days.",
    time: "1 day ago",
    read: false,
  },
];

export default function Notifications() {
  const getNotificationIcon = (type) => <Bell className="h-5 w-5" />;

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Notifications</h1>
            <p className="text-gray-500">Stay updated with system alerts</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
            <CheckCheck className="h-4 w-4" />
            Mark All Read
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              className={` bg-white border rounded-lg p-4 shadow-sm flex items-start gap-4 ${
                !notification.read ? "border-blue-300" : "border-gray-200"
              }`}
            >
              <div
                className={`p-2 rounded-lg flex items-center justify-center ${
                  !notification.read ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-500"
                }`}
              >
                {getNotificationIcon(notification.type)}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold mb-1">{notification.title}</h3>
                    <p className="text-sm text-gray-500">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                    <button className="p-1 rounded hover:bg-gray-100">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
