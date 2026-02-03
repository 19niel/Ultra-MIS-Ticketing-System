    import { useState, useEffect } from "react";
    import { toast } from "sonner";

    export default function EditUserForm({ isOpen, onClose, user, onSuccess }) {
    const [formData, setFormData] = useState({
        employee_id: "",
        first_name: "",
        last_name: "",
        position: "",
        department_id: "",
        role_id: "",
        email: "",
        is_active: true,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Populate form when user changes
    useEffect(() => {
        if (user) {
        const [firstName, ...lastNameParts] = user.name.split(" ");

        setFormData({
            employee_id: user.employee_id,
            first_name: firstName,
            last_name: lastNameParts.join(" "),
            position: user.position,
            department_id: user.department_id ?? "",
            role_id: user.role_id ?? "",
            email: user.email,
            is_active: user.is_active,
        });
        }
    }, [user]);

    if (!isOpen || !user) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const res = await fetch(`http://localhost:3000/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
        toast.error(data.message || "Failed to update user");
        return;
        }

        // SUCCESS
        toast.success(data.message || "User updated successfully");

        // Call parent callback to refresh data
        if (onSuccess) onSuccess();

        onClose();
    } catch (error) {
        console.error(error);
        toast.error("Server error");
    } finally {
        setLoading(false);
    }
    };


    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>

            {error && (
            <div className="mb-3 text-sm text-red-600 bg-red-100 p-2 rounded">
                {error}
            </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
            <input
                type="text"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
            />

            <div className="flex gap-2">
                <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-1/2 border px-3 py-2 rounded"
                required
                />
                <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-1/2 border px-3 py-2 rounded"
                required
                />
            </div>

            <input
                type="text"
                name="position"
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
                <option value="1">IT Support</option>
                <option value="2">Programmer</option>
                <option value="3">HR</option>
                <option value="4">Operations</option>
                <option value="5">Sales</option>
                <option value="6">Finance</option>
                <option value="7">Manager</option>
                <option value="8">MIS</option>
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
                value={formData.email}
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
                {loading ? "Saving..." : "Save"}
                </button>
            </div>
            </form>
        </div>
        </div>
    );
    }
        