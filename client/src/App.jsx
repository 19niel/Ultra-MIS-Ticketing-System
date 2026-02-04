import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./utils/ProtectedRoute";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/dashboard/Dashboard";
import AdminTickets from "./pages/admin/tickets/Tickets"
import AdminNewTickets from "./pages/admin/tickets_new/NewTickets"
import AdminProfile from "./pages/admin/profile/Profile"
import AdminNotifications from "./pages/admin/notifications/Notifications"
import AdminSettings from "./pages/admin/settings/Settings"
import AdminUsers from "./pages/admin/users/Users"

// Employee
import EmployeeLayout from "./pages/employee/EmployeeLayout";
import EmployeeDashboard from "./pages/employee/dashboard/Dashboard";
import EmployeeTickets from "./pages/employee/mytickets/Tickets"

// Tech Support
import TechSupportLayout from "./pages/techsupport/TechSupportLayout";
import TechSupportDashboard from "./pages/techsupport/dashboard/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LoginPage />} />

        {/* ADMIN (role_id = 1) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="tickets" index element={<AdminTickets />} />
          <Route path="new" index element={<AdminNewTickets />} />
          <Route path="profile" index element={<AdminProfile />} />
          <Route path="notifications" index element={<AdminNotifications />} />
          <Route path="settings" index element={<AdminSettings />} />
          <Route path="users" index element={<AdminUsers />} />

        </Route>


        {/* TECH SUPPORT (role_id = 2) */}
        <Route
          path="/techsupport"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <TechSupportLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TechSupportDashboard />} />
        </Route>


        {/* EMPLOYEE (role_id = 3) */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={[3]}>
              <EmployeeLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<EmployeeDashboard />} />
          <Route path="mytickets" element={<EmployeeTickets/>} />
        </Route>


      </Routes>
    </BrowserRouter>
  );
}
