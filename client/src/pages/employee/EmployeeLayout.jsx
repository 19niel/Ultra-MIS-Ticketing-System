import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function EmployeeLayout() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const role = user?.role || "employee";

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role={role} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header role={role} />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
  