// src/app/jobs/page.jsx
//
// Public Jobs Page — Server Component
// Fetches all available job listings from Express GET /api/jobs
// and passes them to JobListClient for live search/filtering.

import { getJobsService } from "@/lib/jobs";
import JobListClient from "@/components/JobListClient";

export default async function JobsPage() {
  const data = await getJobsService();
  const jobs = data?.jobs ?? [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 pb-24">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="border-b border-gray-200 pb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Explore Opportunities
          </p>
          <h1 className="text-4xl font-extrabold text-black uppercase tracking-tight">
            Available Jobs
          </h1>
        </div>

        {/* Client Search & List Component */}
        <JobListClient initialJobs={jobs} />
      </div>
    </div>
  );
}
