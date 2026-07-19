// src/app/dashboard/recruiter/page.jsx

import { getMyJobsService } from "@/lib/jobs";

export default async function RecruiterOverviewPage() {
  const jobs = await getMyJobsService();
  console.log(jobs.jobs);
  return (
    <div className="pt-10 px-8 sm:px-12 w-full bg-white min-h-screen">
      {/* Header Section */}
      <div className="border-b border-gray-200 pb-6 mb-10">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
          Welcome Back
        </p>
        <h1 className="text-4xl font-extrabold text-black uppercase tracking-tight">
          Overview
        </h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stat Card 1: Total Jobs */}
        <div className="border border-gray-200 p-8 sm:p-10 bg-gray-50 flex flex-col justify-between hover:border-black transition-colors">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Total Jobs Posted
          </p>
          <h2 className="text-6xl font-extrabold text-black">
            {jobs.jobs.length}
          </h2>
        </div>

        {/* Stat Card 2: Total Applications */}
        <div className="border border-gray-200 p-8 sm:p-10 bg-gray-50 flex flex-col justify-between hover:border-black transition-colors">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Total Applications
          </p>
          <h2 className="text-6xl font-extrabold text-black">0</h2>
        </div>
      </div>
    </div>
  );
}
