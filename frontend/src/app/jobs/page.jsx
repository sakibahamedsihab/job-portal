import JobCard from "@/components/JobCard";
import { getJobsService } from "@/lib/jobs";

export default async function JobsPage() {
  const jobs = await getJobsService();
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-black uppercase mb-8">
          Available Jobs
        </h1>

        <div className="space-y-4">
          {jobs.jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
