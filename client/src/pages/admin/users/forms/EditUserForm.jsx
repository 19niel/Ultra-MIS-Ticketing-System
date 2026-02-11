import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function EditUserForm({ isOpen, onClose, user, onSuccess }) {
  const [formData, setFormData] = useState({
    employee_id: "",
    first_name: "",
    last_name: "",
    position: "",
    department_id: "",
    branch_id: "", // Added
    role_id: "",
    email: "",
    is_active: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        employee_id: user.employee_id || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        position: user.position || "",
        department_id: user.department_id || "",
        branch_id: user.branch_id || "", // Added
        role_id: user.role_id || "",
        email: user.email || "",
        is_active: user.is_active === 1 || user.is_active === true,
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/api/users/${user.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("User updated successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          <input name="employee_id" value={formData.employee_id} onChange={handleChange} placeholder="Employee ID" className="w-full border px-3 py-2 rounded" required />
          
          <div className="flex gap-2">
            <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" className="w-1/2 border px-3 py-2 rounded" required />
            <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" className="w-1/2 border px-3 py-2 rounded" required />
          </div>

          <input name="position" value={formData.position} onChange={handleChange} placeholder="Position" className="w-full border px-3 py-2 rounded" required />
          
          <select name="department_id" value={formData.department_id} onChange={handleChange} className="w-full border px-3 py-2 rounded" required>
            <option value="">Select Department</option>
            <option value="1">MIS</option>
            <option value="2">HR</option>
            <option value="3">Sales</option>
          </select>

          {/* New Branch Dropdown */}
          <select name="branch_id" value={formData.branch_id} onChange={handleChange} className="w-full border px-3 py-2 rounded" required>
            <option value="">Select Branch</option>
            <option value="1">Main Office</option>
            <option value="2">Cebu Branch</option>
            <option value="3">Davao Branch</option>
          </select>

          <select name="role_id" value={formData.role_id} onChange={handleChange} className="w-full border px-3 py-2 rounded" required>
            <option value="1">Admin</option>
            <option value="2">Tech Support</option>
            <option value="3">Employee</option>
          </select>

          <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
          
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
            Active Account
          </label>
          
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}