import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  Users,
  Settings,
  FileText,
  BarChart3,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Bell,
  CopyrightIcon
} from "lucide-react";

export default function Sidebar({ role = "admin" }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const adminNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/admin" },
    { icon: Ticket, label: "All Tickets", to: "/admin/tickets" },
    { icon: MessageSquare, label: "New Ticket", to: "/admin/new" },
    { icon: Users, label: "Users", to: "/admin/users" },
    { icon: BarChart3, label: "Reports", to: "/admin/reports" },
    { icon: Settings, label: "Settings", to: "/admin/settings" },
  ];

  const techSupportNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/techsupport" },
    { icon: Ticket, label: "My Tickets", to: "/techsupport/tickets" },
    { icon: MessageSquare, label: "Unassigned", to: "/techsupport/unassigned" },
    { icon: FileText, label: "Knowledge Base", to: "/techsupport/kb" },
    { icon: Settings, label: "Settings", to: "/techsupport/settings" },
  ];

  const employeeNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/employee" },
    { icon: Ticket, label: "My Tickets", to: "/employee/tickets" },
    { icon: MessageSquare, label: "New Ticket", to: "/employee/new" },
    { icon: FileText, label: "Knowledge Base", to: "/employee/kb" },
    { icon: Settings, label: "Settings", to: "/employee/settings" },
  ];

  const navItems =
    role === "admin"
      ? adminNavItems
      : role === "tech_support"
      ? techSupportNavItems
      : employeeNavItems;

  return (
    <aside
      className={`h-screen border-r bg-white flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        {!isCollapsed && <span className="font-bold text-sm">Ubix Help Desk</span>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-green-100 rounded cursor-pointer p-1"
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 p-2 rounded hover:bg-gray-100 ${
              !isCollapsed ? "" : "justify-center"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Nav */}
      <div className="p-2 border-t space-y-1">
        <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
          <Bell className="w-5 h-5" />
          {!isCollapsed && <span>Notifications</span>}
        </div>

        <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
          <CopyrightIcon className="w-5 h-5" />
          {!isCollapsed && <span>All Rights Reserved Talag</span>}
        </div>
      </div>
    </aside>
  );
}
