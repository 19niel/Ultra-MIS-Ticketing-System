import { useState } from "react";
import { toast } from "sonner";


export default function AddUserForm({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    employee_id: "",
    first_name: "",
    last_name: "",
    position: "",
    department_id: "",
    branch_id:"",
    role_id: "",
    email: "",
    password: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setLoading(true); // Set loading to true when starting
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // This is where your 409 error is caught
        const errorMsg = data.message || "Failed to add user";
        toast.error(errorMsg);
        setError(errorMsg); // Show it in the modal UI too
        return;
      }

      toast.success("User added successfully");
      if (onSuccess) onSuccess(); // Refresh the table list
      onClose(); // Close the modal
    } catch (error) {
      console.error("Add User Error:", error);
      toast.error("Server error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add User</h2>

        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="employee_id"
            placeholder="Employee ID"
            value={formData.employee_id}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <div className="flex gap-2">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-1/2 border px-3 py-2 rounded"
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-1/2 border px-3 py-2 rounded"
              required
            />
          </div>

          <input
            type="text"
            name="position"
            placeholder="Position"
            value={formData.position}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <select
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select Department</option>
            <option value="1">MIS</option>
            <option value="2">HR</option>
            <option value="3">Sales</option>
            <option value="4">Finance</option>
            <option value="5">Manager</option>
            <option value="6">FSD</option>
          </select>

          <select
            name="branch_id"
            value={formData.branch_id}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select Branch</option>
            <option value="1">Head Office Angono</option>
            <option value="2">Pet Plans Guadalupe</option>
            <option value="3">Sucat Office</option>
          </select>

          <select
            name="role_id"
            value={formData.role_id}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select Role</option>
            <option value="1">Admin</option>
            <option value="2">Tech Support</option>
            <option value="3">Employee</option>
          </select>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
            Active
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
