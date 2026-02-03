import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./utils/ProtectedRoute";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/dashboard/Dashboard";

// Employee
import EmployeeLayout from "./pages/employee/EmployeeLayout";
import EmployeeDashboard from "./pages/employee/dashboard/Dashboard";

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
      </Routes>
    </BrowserRouter>
  );
}
