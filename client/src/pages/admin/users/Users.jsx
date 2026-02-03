import { useState, useEffect } from "react";
import { Search, UserPlus, Edit, Trash2 } from "lucide-react";

import AddUserForm from "./forms/AddUserForm";
import EditUserForm from "./forms/EditUserForm";
import DeleteUserForm from "./forms/DeleteUserForm";

export default function Users() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = () => {
    fetch("http://localhost:3000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Helper to map role_id (integers) to labels for the UI
  const getRoleLabel = (roleId) => {
    const roles = { 1: "admin", 2: "tech_support", 3: "employee" };
    return roles[roleId] || "employee";
  };

  const getRoleColor = (roleId) => {
    const role = getRoleLabel(roleId);
    switch (role) {
      case "admin": return "bg-red-100 text-red-700";
      case "tech_support": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Filtering logic
  const filteredUsers = users.filter((user) => {
    const searchTerm = search.toLowerCase();
    
    // Combine names into a single string for searching
    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();
    const roleLabel = getRoleLabel(user.role_id);

    const matchesSearch = 
      fullName.includes(searchTerm) || 
      (user.email && user.email.toLowerCase().includes(searchTerm)) ||
      (user.employee_id && user.employee_id.toString().includes(searchTerm));

    const matchesRole = roleFilter === "all" || roleLabel === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-sm text-gray-500">Manage user accounts and permissions</p>
        </div>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or employee ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="tech_support">Tech Support</option>
          <option value="employee">Employee</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 text-left text-sm text-gray-500">
            <tr>
              <th className="px-6 py-3">Employee ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.user_id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-mono">{user.employee_id}</td>
                
                {/* DISPLAYING COMBINED NAME FROM LITERAL DB FIELDS */}
                <td className="px-6 py-4 font-medium">
                  {user.first_name} {user.last_name}
                </td>

                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role_id)}`}>
                    {getRoleLabel(user.role_id)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="p-2 border rounded hover:bg-gray-100 transition-colors"
                      onClick={() => setEditingUser(user)}
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    
                    <button
                      className="p-2 border rounded hover:bg-gray-100 text-red-600 transition-colors"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteModal(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AddUserForm isOpen={showModal} onClose={() => { setShowModal(false); fetchUsers(); }} />
      
      {editingUser && (
        <EditUserForm
          isOpen={!!editingUser}
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={fetchUsers}
        />
      )}

      <DeleteUserForm
        isOpen={showDeleteModal}
        user={selectedUser}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
        onDeleted={fetchUsers}
      />
    </div>
  );
}