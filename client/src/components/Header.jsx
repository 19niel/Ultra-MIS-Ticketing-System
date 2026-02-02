import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Settings, ChevronDown, LogOut } from "lucide-react";

export default function Header({ role = "admin" }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState("User");
  const [initials, setInitials] = useState("US");
  const [employeeId, setEmployeeId] = useState("");
  const [position, setPosition] = useState(""); // fixed typo: postion -> position

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/auth/me", {
          method: "GET",
          credentials: "include", // important: sends cookie
        });

        if (!res.ok) return;

        const data = await res.json();
        const user = data.user;

        if (user) {
          const firstName = user.first_name || "";
          const lastName = user.last_name || "";
          const fullName = `${firstName} ${lastName}`.trim();
          setUsername(fullName || "User");
          setEmployeeId(user.employee_id || "");
          setPosition(user.position || ""); // ensure position exists in backend

          // Calculate initials
          const names = fullName.split(" ");
          const firstInitial = names[0]?.[0] || "U";
          const lastInitial = names[1]?.[0] || "";
          setInitials((firstInitial + lastInitial).toUpperCase());
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed", err);
    }

    navigate("/", { replace: true });
  };

  const basePath = `/${role}`;

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="w-full px-6 py-1 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 font-bold text-blue-600">
            {initials}
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">
              {employeeId || "Employee"}
            </h1>
            <p className="text-xs text-gray-500 capitalize">
              {role} Dashboard {position ? `• ${position}` : ""}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 relative">
          <button
            className="p-2 rounded hover:bg-gray-100"
            onClick={() => navigate(`${basePath}/notifications`)}
          >
            <Bell className="w-5 h-5" />
          </button>

          <button
            className="p-2 rounded hover:bg-gray-100"
            onClick={() => navigate(`${basePath}/settings`)}
          >
            <Settings className="w-5 h-5" />
          </button>

          <div className="relative">
            <button
              className="flex items-center gap-2 p-2 border rounded hover:bg-gray-100"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-600">
                {initials}
              </div>
              <span className="hidden sm:inline">{username}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
                <div className="px-4 py-2 text-gray-500 font-semibold">
                  My Account
                </div>
                <hr />

                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => navigate(`${basePath}/profile`)}
                >
                  Profile
                </button>

                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => navigate(`${basePath}/settings`)}
                >
                  Settings
                </button>

                <hr />

                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
