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
    <div className="pt-10 px-8 sm:px-12 w-full bg-white min-h-screen pb-20">

      <div className="border-b border-gray-200 pb-6 mb-10">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
          System Control
        </p>
        <h1 className="text-4xl font-extrabold text-black uppercase tracking-tight">
          Admin Overview
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border-2 border-black p-8 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Total Users
            </p>
            <h2 className="text-4xl font-extrabold text-black">{stats.totalUsers}</h2>
            <p className="text-xs font-medium text-gray-400 mt-2 uppercase">
              {stats.seekerCount} Seekers • {stats.recruiterCount} Recruiters
            </p>
          </div>
          <Users size={32} className="text-black" />
        </div>

        <div className="border-2 border-black p-8 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Active Jobs
            </p>
            <h2 className="text-4xl font-extrabold text-black">{stats.totalJobs}</h2>
          </div>
          <Briefcase size={32} className="text-black" />
        </div>

        <div className="border-2 border-black p-8 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Applications
            </p>
            <h2 className="text-4xl font-extrabold text-black">{stats.totalApplications}</h2>
          </div>
          <FileText size={32} className="text-black" />
        </div>
      </div>
    </div>
  );
}
