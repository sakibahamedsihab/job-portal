import Link from "next/link";
import { cookies } from "next/headers";
import { getMyJobsService } from "@/lib/jobs";
import RecruiterJobListClient from "@/components/RecruiterJobListClient";

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
          <p className="text-sm text-gray-500 mt-2">
            Manage, edit, and monitor your posted job openings.
          </p>
        </div>

        <Link
          href="/dashboard/recruiter/my-jobs/create"
          className="bg-black text-white font-bold text-xs uppercase py-3 px-6 rounded-xl shadow-md hover:bg-gray-800 hover:shadow-lg transition-all tracking-wider"
        >
          + Post Job
        </Link>
      </div>

      <RecruiterJobListClient initialJobs={jobs} />
    </div>
  );
}
