"use client";

import { useState } from "react";
import { Trash2, UserCheck, Shield } from "lucide-react";
import { deleteUserAdminService } from "@/lib/admin";

export default function AdminUserListClient({ initialUsers = [] }) {
  const [users, setUsers] = useState(initialUsers);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete user account "${name}"?`)) return;

    setDeletingId(id);
    const res = await deleteUserAdminService(id);

    if (res.success) {
      setUsers((prev) => prev.filter((u) => (u._id || u.id) !== id));
    } else {
      alert(res.message || "Failed to delete user.");
    }
    setDeletingId(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
      {users.length === 0 ? (
        <div className="p-12 text-center text-gray-400 font-bold uppercase text-xs">
          No user accounts found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {users.map((user) => {
                const userId = user._id || user.id;
                return (
                  <tr key={userId} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-900">{user.name}</td>
                    <td className="py-4 px-6 text-gray-600">{user.email}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                          user.role === "admin"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : user.role === "recruiter"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                        }`}
                      >
                        {user.role === "admin" && <Shield size={12} />}
                        {user.role || "seeker"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {user.role !== "admin" && (
                        <button
                          onClick={() => handleDelete(userId, user.name)}
                          disabled={deletingId === userId}
                          className="text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg uppercase tracking-wider inline-flex items-center gap-1 disabled:opacity-50 transition-colors"
                        >
                          <Trash2 size={13} />
                          {deletingId === userId ? "Deleting..." : "Delete"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
