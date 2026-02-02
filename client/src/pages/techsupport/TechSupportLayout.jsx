import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function TechSupportLayout() {
  // ✅ Static placeholders
  const role = "admin";
  const username = "John Doe";
  const initials = "JD";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar role={role} className="h-full" />

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header role={role} username={username} initials={initials} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Render nested routes here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
