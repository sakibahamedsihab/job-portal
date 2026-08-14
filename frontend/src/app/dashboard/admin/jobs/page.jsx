import { cookies } from "next/headers";
import { getAdminJobsService } from "@/lib/admin";
import AdminJobListClient from "@/components/AdminJobListClient";

export default async function AdminJobsPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await getAdminJobsService(cookieHeader);
  const jobs = res?.jobs ?? [];

  return (
    <div className="pt-10 px-8 sm:px-12 w-full bg-white min-h-screen pb-20">
      <div className="border-b border-gray-200 pb-6 mb-10">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
          Moderation
        </p>
        <h1 className="text-4xl font-extrabold text-black uppercase tracking-tight">
          Job Posts Moderation
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Total Active Jobs: <span className="font-bold text-black">{jobs.length}</span>
        </p>
      </div>

      <AdminJobListClient initialJobs={jobs} />
    </div>
  );
}
