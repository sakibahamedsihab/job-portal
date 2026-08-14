import { cookies } from "next/headers";
import Link from "next/link";
import { Bookmark, ExternalLink } from "lucide-react";
import { getMySavedJobsService } from "@/lib/savedJobs";
import BookmarkButton from "@/components/BookmarkButton";

export default async function SavedJobsPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await getMySavedJobsService(cookieHeader);
  const savedJobs = res?.savedJobs ?? [];

  return (
    <div className="pt-10 px-8 sm:px-12 w-full bg-gray-50/50 min-h-screen pb-20">
      <div className="border-b border-gray-200 pb-6 mb-10">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
          My Activity
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Saved Jobs
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          {savedJobs.length} job{savedJobs.length !== 1 ? "s" : ""} saved in your bookmarks.
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-16 text-center shadow-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <Bookmark size={28} />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            No Saved Jobs Yet
          </h2>
          <p className="text-sm font-medium text-gray-400 max-w-sm mb-6">
            Bookmark jobs while browsing so you can easily find and apply to them later.
          </p>
          <Link
            href="/jobs"
            className="inline-block bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
          >
            Explore Open Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {savedJobs.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-black transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {item.jobTitle}
                </h2>
                <p className="text-sm text-gray-600 font-medium mt-1">
                  {item.companyName} • {item.location}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Salary: {item.salary}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/jobs/${item.jobId}`}
                  className="px-5 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-800 transition-all flex items-center gap-2 shadow-sm"
                >
                  View Role <ExternalLink size={14} />
                </Link>

                <BookmarkButton jobId={item.jobId?.toString() || item.jobId} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
