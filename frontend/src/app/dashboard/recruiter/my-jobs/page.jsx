import Link from "next/link";
import { getMyJobsService } from "@/lib/jobs";

export default async function MyJobsPage() {
  const response = await getMyJobsService();
  const jobs = response?.jobs || [];

  return (
    <div className="pt-10 px-8 sm:px-12 w-full bg-white min-h-screen pb-20">
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

      {jobs.length === 0 ? (
        <div className="border border-gray-200 p-16 text-center bg-gray-50">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            No jobs posted yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="border border-gray-200 p-6 sm:p-8 bg-white hover:border-black transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-6"
            >
              {/* Job Info */}
              <div>
                <h2 className="text-xl font-extrabold text-black uppercase tracking-wide mb-3">
                  {job.title}
                </h2>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-widest px-3 py-1">
                    {job.location}
                  </span>
                  <span className="bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-widest px-3 py-1">
                    {job.salary}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button className="text-xs font-bold text-black border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-500 uppercase tracking-widest transition-colors">
                  View Applicants
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
