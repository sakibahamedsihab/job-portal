import { cookies } from "next/headers";
import { getAdminUsersService } from "@/lib/admin";
import AdminUserListClient from "@/components/AdminUserListClient";

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await getAdminUsersService(cookieHeader);
  const users = res?.users ?? [];

  return (
    <div className="pt-10 px-8 sm:px-12 w-full bg-white min-h-screen pb-20">
      <div className="border-b border-gray-200 pb-6 mb-10">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
          Management
        </p>
        <h1 className="text-4xl font-extrabold text-black uppercase tracking-tight">
          User Accounts
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Total Users: <span className="font-bold text-black">{users.length}</span>
        </p>
      </div>

      <AdminUserListClient initialUsers={users} />
    </div>
  );
}
