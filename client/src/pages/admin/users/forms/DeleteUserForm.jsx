import React from "react";
import { toast } from "sonner";

export default function DeleteUserForm({ isOpen, onClose, user, onDeleted }) {
  if (!isOpen || !user) return null;

 const handleDelete = async () => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/users/${user.id}`,
      { method: "DELETE" }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Failed to delete user");
      return;
    }

    toast.success("User deleted");
    onDeleted(user.id);
    onClose();
  } catch (error) {
    toast.error("Server error");
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
        <h2 className="text-xl font-bold text-red-600 mb-3">
          Delete User
        </h2>

        <p className="text-gray-700 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{user.name}</span>?
          <br />
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
