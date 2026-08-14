import { getJobsService } from "@/lib/jobs";
import JobListClient from "@/components/JobListClient";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const data = await getJobsService();
  const jobs = data?.jobs ?? [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 pb-24">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="border-b border-gray-200 pb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Explore Opportunities
          </p>
          <h1 className="text-4xl font-extrabold text-black uppercase tracking-tight">
            Available Jobs
          </h1>
        </div>

        <JobListClient initialJobs={jobs} />
      </div>
    </div>
  );
}
