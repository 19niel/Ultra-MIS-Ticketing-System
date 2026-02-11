import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, Mail, Briefcase, Building2, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    employee_id: "",
    first_name: "",
    last_name: "",
    position: "",
    department_id: "",
    branch_id: "",
    role_id: "3", // Default to Employee role
    email: "",
    password: "",
    confirmPassword: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);

    try {
      // Note: Endpoint changed to match your controller's likely route
      const res = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }

      toast.success("Account created successfully! Please login.");
      navigate("/"); // Redirect to Login
    } catch (err) {
      console.error("Registration Error:", err);
      toast.error("Server error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 py-12">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <img src="/img/UBIX_LOGO.png" alt="Logo" className="mx-auto w-32 h-32 object-contain" />
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500 text-sm">Join the U-BIX Help Desk System</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Employee ID */}
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              name="employee_id"
              type="text"
              placeholder="Employee ID"
              className="w-full pl-10 p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.employee_id}
              onChange={handleChange}
              required
            />
          </div>

          {/* Name Row */}
          <div className="flex gap-3">
            <input
              name="first_name"
              type="text"
              placeholder="First Name"
              className="w-1/2 p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <input
              name="last_name"
              type="text"
              placeholder="Last Name"
              className="w-1/2 p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Position */}
          <div className="relative">
            <Briefcase className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              name="position"
              type="text"
              placeholder="Position (e.g. Account Executive)"
              className="w-full pl-10 p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </div>

          {/* Dept & Branch Row */}
          <div className="flex gap-3">
            <div className="relative w-1/2">
              <Building2 className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <select
                name="department_id"
                className="w-full pl-10 p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                value={formData.department_id}
                onChange={handleChange}
                required
              >
                <option value="">Department</option>
                <option value="1">MIS</option>
                <option value="2">HR</option>
                <option value="3">Sales</option>
                <option value="4">Finance</option>
                <option value="5">Manager</option>
                <option value="6">FSD</option>
              </select>
            </div>
            <div className="relative w-1/2">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <select
                name="branch_id"
                className="w-full pl-10 p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                value={formData.branch_id}
                onChange={handleChange}
                required
              >
                <option value="">Branch</option>
                <option value="1">Head Office Angono</option>
                <option value="2">Pet Plans Guadalupe</option>
                <option value="3">Sucat Office</option>
              </select>
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full pl-10 p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Passwords */}
          <div className="flex gap-3">
            <div className="relative w-1/2">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full pl-10 p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="relative w-1/2">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm"
                className="w-full pl-10 p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-xl font-bold text-white shadow-lg transition-all ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}