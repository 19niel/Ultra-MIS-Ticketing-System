import { useState, useEffect } from "react";
import { 
  Search, UserPlus, Edit, Trash2, User, Mail, 
  ShieldCheck, Fingerprint, Filter 
} from "lucide-react";

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

  const getRoleLabel = (roleId) => {
    const roles = { 1: "admin", 2: "tech_support", 3: "employee" };
    return roles[roleId] || "employee";
  };

  const getRoleStyle = (roleId) => {
    const role = getRoleLabel(roleId);
    switch (role) {
      case "admin": return "bg-red-50 text-red-600 ring-red-200";
      case "tech_support": return "bg-blue-50 text-blue-600 ring-blue-200";
      default: return "bg-slate-50 text-slate-600 ring-slate-200";
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchTerm = search.toLowerCase();
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
    <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-8 bg-gray-50/50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Users Management</h1>
          <p className="text-gray-500 text-sm">Manage user accounts and system permissions.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-sm hover:shadow-blue-200 active:scale-95"
        >
          <UserPlus size={18} />
          Add New User
        </button>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or employee ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm">
          <Filter size={16} className="text-gray-400" />
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)} 
            className="bg-transparent text-sm font-bold text-gray-700 outline-none pr-2"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="tech_support">Tech Support</option>
            <option value="employee">Employee</option>
          </select>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-gray-400">Employee</th>
                <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-gray-400">Contact Information</th>
                <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-gray-400">Role</th>
                <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-wider text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user) => (
                <tr key={user.user_id} className="group hover:bg-blue-50/30 transition-colors">
                  {/* EMPLOYEE ID & NAME */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-200">
                        <User size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800 capitalize">
                          {user.first_name} {user.last_name}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-tight">
                          <Fingerprint size={10} />
                          {user.employee_id}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* EMAIL */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={14} className="text-gray-300" />
                      {user.email}
                    </div>
                  </td>

                  {/* ROLE BADGE */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ring-1 ring-inset shadow-sm ${getRoleStyle(user.role_id)}`}>
                      <ShieldCheck size={12} />
                      {getRoleLabel(user.role_id)}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white transition-all border border-gray-100 shadow-sm"
                        title="Edit User"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white transition-all border border-gray-100 shadow-sm"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                      <Search size={32} strokeWidth={1} />
                      <p className="text-sm font-medium">No users match your search criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
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