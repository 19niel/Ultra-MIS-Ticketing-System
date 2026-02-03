import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/auth/me", {
          credentials: "include",
        });

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return null; // or spinner

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // ❌ Role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role_id)) {
    switch (user.role_id) {
      case 1:
        return <Navigate to="/admin" replace />;
      case 2:
        return <Navigate to="/techsupport" replace />;
      case 3:
        return <Navigate to="/employee" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // ✅ Allowed
  return children;
}
