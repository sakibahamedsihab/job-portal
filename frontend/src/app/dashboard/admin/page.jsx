import { cookies } from "next/headers";
import { Users, Briefcase, FileText, Building } from "lucide-react";
import { getAdminStatsService } from "@/lib/admin";

export default async function AdminOverviewPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await getAdminStatsService(cookieHeader);
  const stats = res?.stats ?? {
    totalUsers: 0,
    seekerCount: 0,
    recruiterCount: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalCompanies: 0,
  };

  return (
    <div className="pt-10 px-8 sm:px-12 w-full bg-gray-50/50 min-h-screen pb-20">

      <div className="border-b border-gray-200 pb-6 mb-10">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
          System Control
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Admin Overview
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm hover:shadow-md hover:border-black transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Total Users
            </p>
            <h2 className="text-4xl font-extrabold text-gray-900">{stats.totalUsers}</h2>
            <p className="text-xs font-medium text-gray-400 mt-2">
              {stats.seekerCount} Seekers • {stats.recruiterCount} Recruiters
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users size={28} />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm hover:shadow-md hover:border-black transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Active Jobs
            </p>
            <h2 className="text-4xl font-extrabold text-gray-900">{stats.totalJobs}</h2>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Briefcase size={28} />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm hover:shadow-md hover:border-black transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Applications
            </p>
            <h2 className="text-4xl font-extrabold text-gray-900">{stats.totalApplications}</h2>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileText size={28} />
          </div>
        </div>
      </div>
    </div>
  );
}
