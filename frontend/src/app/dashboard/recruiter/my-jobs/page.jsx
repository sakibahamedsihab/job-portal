import Link from "next/link";
import { cookies } from "next/headers";
import { getMyJobsService } from "@/lib/jobs";

export default async function MyJobsPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await getMyJobsService(cookieHeader);
  const jobs = response?.jobs ?? [];

  return (
    <div className="pt-10 px-8 sm:px-12 w-full bg-gray-50/50 min-h-screen pb-20">

      <div className="flex justify-between items-end border-b border-gray-200 pb-6 mb-10">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Management
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            My Jobs
          </h1>
        </div>

        <Link
          href="/dashboard/recruiter/my-jobs/create"
          className="bg-black text-white font-bold text-xs uppercase py-3 px-6 rounded-xl shadow-md hover:bg-gray-800 hover:shadow-lg transition-all tracking-wider"
        >
          + Post Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-16 text-center shadow-sm">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
            No jobs posted yet.
          </p>
          <Link
            href="/dashboard/recruiter/my-jobs/create"
            className="inline-block bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
          >
            Create Your First Job
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-black transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-6"
            >
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  {job.title}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-1 rounded-lg border border-gray-100">
                    {job.location}
                  </span>
                  <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-lg border border-emerald-100">
                    {job.salary}
                  </span>
                  {job.jobType && (
                    <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-lg border border-blue-100">
                      {job.jobType}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <Link
                  href={`/dashboard/recruiter/my-jobs/${job._id}/applicants`}
                  className="text-xs font-bold text-black hover:text-gray-600 bg-gray-50 hover:bg-gray-100 px-4 py-2.5 rounded-xl border border-gray-200 uppercase tracking-wider transition-all inline-flex items-center gap-1 shadow-sm"
                >
                  View Applicants →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
