import { useState, useEffect } from "react";
import { toast } from "sonner";
import { X, User, Save } from "lucide-react";

export default function EditUserForm({ isOpen, onClose, user, onSuccess }) {
  const [formData, setFormData] = useState({
    employee_id: "",
    first_name: "",
    last_name: "",
    position: "",
    department_id: "",
    branch_id: "",
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
        branch_id: user.branch_id || "",
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
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2 text-blue-600">
            <User size={20} />
            <h2 className="text-lg font-black tracking-tight text-gray-800">Edit User Account</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 mb-1 block tracking-widest">Employee Identity</label>
              <input name="employee_id" value={formData.employee_id} onChange={handleChange} placeholder="Employee ID" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium" required />
            </div>
            
            <div className="flex gap-3">
              <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" className="w-1/2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all text-sm font-medium" required />
              <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" className="w-1/2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all text-sm font-medium" required />
            </div>

            <input name="position" value={formData.position} onChange={handleChange} placeholder="Position" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all text-sm font-medium" required />
            
            <div className="grid grid-cols-1 gap-3">
              <select name="department_id" value={formData.department_id} onChange={handleChange} className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none focus:border-blue-500" required>
                <option value="">Select Department</option>
                <option value="1">MIS</option>
                <option value="2">HR</option>
                <option value="3">Sales</option>
              </select>

              <select name="branch_id" value={formData.branch_id} onChange={handleChange} className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none focus:border-blue-500" required>
                <option value="">Select Branch</option>
                <option value="1">Head Office Angono</option>
                <option value="2">Pet Plans Guadalupe</option>
                <option value="3">Sucat Office</option>
              </select>

              <select name="role_id" value={formData.role_id} onChange={handleChange} className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none focus:border-blue-500" required>
                <option value="1">Admin</option>
                <option value="2">Tech Support</option>
                <option value="3">Employee</option>
              </select>
            </div>

            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all text-sm font-medium" required />
            
            <label className="relative flex items-center cursor-pointer pt-2">
              <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="sr-only peer" />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-2 text-xs font-black uppercase text-gray-500 tracking-wider">Active Account</span>
            </label>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all">
              Cancel
            </button>
            <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}