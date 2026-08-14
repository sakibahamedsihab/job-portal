import { cookies } from "next/headers";
import { getMyJobsService } from "@/lib/jobs";
import { getJobApplicantsService } from "@/lib/applications";

export default async function RecruiterOverviewPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const result = await getMyJobsService(cookieHeader);
  const jobs = result?.jobs ?? [];

  const applicantResults = await Promise.all(
    jobs.map((job) => getJobApplicantsService(job._id, cookieHeader))
  );

  const totalApplications = applicantResults.reduce(
    (acc, curr) => acc + (curr?.applicants?.length || 0),
    0
  );

  return (
    <div className="pt-10 px-8 sm:px-12 w-full bg-white min-h-screen">
      <div className="border-b border-gray-200 pb-6 mb-10">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
          Welcome Back
        </p>
        <h1 className="text-4xl font-extrabold text-black uppercase tracking-tight">
          Overview
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 p-8 sm:p-10 bg-gray-50 flex flex-col justify-between hover:border-black transition-colors">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Total Jobs Posted
          </p>
          <h2 className="text-6xl font-extrabold text-black">{jobs.length}</h2>
        </div>

        <div className="border border-gray-200 p-8 sm:p-10 bg-gray-50 flex flex-col justify-between hover:border-black transition-colors">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Total Applications Received
          </p>
          <h2 className="text-6xl font-extrabold text-black">{totalApplications}</h2>
        </div>
      </div>
    </div>
  );
}
