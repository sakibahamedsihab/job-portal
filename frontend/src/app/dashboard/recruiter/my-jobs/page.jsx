import Link from "next/link";
import { cookies } from "next/headers";
import { getMyJobsService } from "@/lib/jobs";

export default async function MyJobsPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await getMyJobsService(cookieHeader);
  const jobs = response?.jobs ?? [];

  return (
    <div className="pt-10 px-8 sm:px-12 w-full bg-white min-h-screen pb-20">

      <div className="flex justify-between items-end border-b border-gray-200 pb-6 mb-10">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Management
          </p>
          <h1 className="text-4xl font-extrabold text-black uppercase tracking-tight">
            My Jobs
          </h1>
        </div>

        <Link
          href="/dashboard/recruiter/my-jobs/create"
          className="bg-black text-white font-bold text-sm uppercase py-4 px-8 rounded-none hover:bg-gray-800 transition-colors tracking-widest"
        >
          + Post Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="border border-gray-200 p-16 text-center bg-gray-50">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
            No jobs posted yet.
          </p>
          <Link
            href="/dashboard/recruiter/my-jobs/create"
            className="inline-block bg-black text-white text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            Create Your First Job
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="border border-gray-200 p-6 sm:p-8 bg-white hover:border-black transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-6"
            >
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

              <div>
                <Link
                  href={`/dashboard/recruiter/my-jobs/${job._id}/applicants`}
                  className="text-xs font-bold text-black border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-500 uppercase tracking-widest transition-colors inline-block"
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
