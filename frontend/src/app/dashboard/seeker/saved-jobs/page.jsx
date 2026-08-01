// src/app/dashboard/seeker/saved-jobs/page.jsx
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
    <div className="pt-10 px-8 sm:px-12 w-full bg-white min-h-screen pb-20">
      {/* Header Section */}
      <div className="border-b border-gray-200 pb-6 mb-10">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
          My Activity
        </p>
        <h1 className="text-4xl font-extrabold text-black uppercase tracking-tight">
          Saved Jobs
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          {savedJobs.length} job{savedJobs.length !== 1 ? "s" : ""} saved in your bookmarks.
        </p>
      </div>

      {/* Empty State vs List */}
      {savedJobs.length === 0 ? (
        <div className="border border-gray-200 p-16 text-center bg-gray-50 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <Bookmark size={24} strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-bold text-black uppercase tracking-wide mb-2">
            No Saved Jobs Yet
          </h2>
          <p className="text-sm font-medium text-gray-400 max-w-sm mb-6">
            Bookmark jobs while browsing so you can easily find and apply to them later.
          </p>
          <Link
            href="/jobs"
            className="inline-block bg-black text-white text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            Explore Open Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {savedJobs.map((item) => (
            <div
              key={item._id}
              className="border border-gray-200 p-6 bg-white hover:border-black transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <h2 className="text-lg font-extrabold text-black uppercase tracking-wide">
                  {item.jobTitle}
                </h2>
                <p className="text-sm text-gray-600 font-medium mt-1">
                  {item.companyName} • {item.location}
                </p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
                  Salary: {item.salary}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/jobs/${item.jobId}`}
                  className="px-4 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  View Details <ExternalLink size={14} />
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
