// src/app/dashboard/recruiter/jobs/page.jsx
import Link from "next/link";

export default function MyJobsPage() {
  return (
    <div className="pt-10 px-8 sm:px-12 w-full bg-white min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-end border-b border-gray-200 pb-6 mb-10">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Overview
          </p>
          <h1 className="text-4xl font-extrabold text-black uppercase tracking-tight">
            My Jobs
          </h1>
        </div>

        {/* Post Job Button */}
        <Link
          href="/dashboard/recruiter/my-jobs/create"
          className="bg-black text-white font-bold text-sm uppercase py-4 px-8 rounded-none hover:bg-gray-800 transition-colors tracking-widest"
        >
          + Post Job
        </Link>
      </div>

      {/* Job List Placeholder (পরে এখানে আসল ডাটা আসবে) */}
      <div className="border border-gray-200 p-16 text-center bg-gray-50">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
          No jobs posted yet.
        </p>
      </div>
    </div>
  );
}
