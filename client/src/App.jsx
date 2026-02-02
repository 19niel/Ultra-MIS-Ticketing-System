import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";


// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/dashboard/Dashboard";

// Employee
import EmployeeLayout from "./pages/employee/EmployeeLayout";
import EmployeeDashboard from "./pages/employee/dashboard/Dashboard";


// Tech Support
import TechSupportLayout from "./pages/techsupport/TechSupportLayout"
import TechSupportDashboard from "./pages/techsupport/dashboard/Dashboard"


export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public login page */}
        <Route path="/" element={<LoginPage />} />

        {/* Admin layout routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard/>} />
 
        </Route>

        {/* Employee layout routes */}
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route index element={<EmployeeDashboard />} />

        </Route>


        {/* Tech Support layout routes */}
        <Route path="/techsupport" element={<TechSupportLayout />}>
          <Route index element={<TechSupportDashboard />} />

        </Route>

      </Routes>
    </Router>
  );
}
