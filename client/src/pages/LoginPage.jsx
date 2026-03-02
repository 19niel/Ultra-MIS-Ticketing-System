import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";

import { toast } from "sonner"; // 1. Import toast

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // 2. Error Toast
        toast.error(data.message || "Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      sessionStorage.setItem(
        "user",
        JSON.stringify({
          ...data.user,
          role:
            data.user.role_id === 1
              ? "admin"
              : data.user.role_id === 2
              ? "tech_support"
              : "employee",
        })
      );

      // 3. Success Toast
      toast.success(`You Have Logged In Successfully, ${data.user.first_name}!`, {
        className: "bg-blue-600 text-white p-6 border-none",
      });

      // Redirect based on role
      switch (data.user.role_id) {
        case 1: // Admin
          navigate("/admin");
          break;
        case 2: // Tech Support
          navigate("/admin");
          break;
        case 3: // Employee
          navigate("/employee");
          break;
        default:
          toast.warning("Access denied: Unknown role.");
      }
    } catch (err) {
      console.error(err);
      // 4. Server Error Toast
      toast.error("Connection error. Is the server running?");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          <img
            src="/img/UBIX_LOGO.png"
            alt="Company Logo"
            className="mx-auto w-40 h-40 object-contain"
          />
          Ticketing Help Desk
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                className="w-full pl-10 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                className="w-full pl-10 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded font-bold text-white transition ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">
              Create an Account
            </Link>
          </p>
        </div>

        <h3 className="text-xs text-gray-400 mt-6 text-right">
          Powered by U-BIX Corporation MIS Department
        </h3>
      </div>
    </div>
  );
}
