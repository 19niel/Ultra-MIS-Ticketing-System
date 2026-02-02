import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/auth/me", {
          credentials: "include",
        });
        if (!res.ok) {
          setUserRole(null);
        } else {
          const data = await res.json();
          setUserRole(data.user.role_id);
        }
      } catch (err) {
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return null;

  if (userRole) {
    switch (userRole) {
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

  return children;
}