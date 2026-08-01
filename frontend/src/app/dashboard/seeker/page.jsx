// src/app/dashboard/seeker/page.jsx
//
// Seeker Overview — a server component that fetches real data:
//   - The logged-in user's name (from Better Auth session, via auth.api.getSession)
//   - Their actual number of applications (from the backend)
//   - Their actual number of saved jobs (from the backend)
//   - Their 3 most recent applications for the "Recent Activity" list

import { cookies, headers } from "next/headers";
import Link from "next/link";
import { Briefcase, Bookmark, ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { getMyApplicationsService } from "@/lib/applications";
import { getMySavedJobsService } from "@/lib/savedJobs";

// ── Status badge colour map ──────────────────────────────────────────────────
const STATUS_STYLES = {
  pending:   "bg-gray-50 text-gray-600 border-gray-200",
  reviewing: "bg-yellow-50 text-yellow-700 border-yellow-200",
  interview: "bg-blue-50 text-blue-700 border-blue-200",
  rejected:  "bg-red-50 text-red-600 border-red-200",
  accepted:  "bg-green-50 text-green-700 border-green-200",
};

export default async function SeekerDashboardOverview() {
  // ── Step 1: Get the session to read the user's name ─────────────────────────
  const session = await auth.api.getSession({ headers: await headers() });
  const userName = session?.user?.name ?? "there";

  // ── Step 2: Fetch applications and saved jobs from backend ─────────────────
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const [appResult, savedResult] = await Promise.all([
    getMyApplicationsService(cookieHeader),
    getMySavedJobsService(cookieHeader),
  ]);

  const applications = appResult?.applications ?? [];
  const savedJobs = savedResult?.savedJobs ?? [];

  // ── Step 3: Derive stats from the data ───────────────────────────────────────
  const totalApplied = applications.length;
  const totalSaved = savedJobs.length;
  const recentApplications = applications.slice(0, 3);

  return (
    <main className="max-w-5xl mx-auto p-6 md:p-8 space-y-8">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-light text-gray-900 tracking-tight">
          Welcome back, <span className="font-semibold">{userName}</span>
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Here&apos;s a quick overview of your job search progress.
        </p>
      </div>

      {/* ── Quick Stats ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Applied Jobs */}
        <Link
          href="/dashboard/seeker/applied-jobs"
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-between group"
        >
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Applied Jobs</p>
            <h3 className="text-3xl font-semibold text-gray-900">{totalApplied}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Briefcase size={24} strokeWidth={1.5} />
          </div>
        </Link>

        {/* Saved Jobs */}
        <Link
          href="/dashboard/seeker/saved-jobs"
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-between group"
        >
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Saved Jobs</p>
            <h3 className="text-3xl font-semibold text-gray-900">{totalSaved}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Bookmark size={24} strokeWidth={1.5} />
          </div>
        </Link>
      </div>

      {/* ── Recent Applications ──────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
          <Link
            href="/dashboard/seeker/applied-jobs"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center transition-colors"
          >
            View all <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>

        {/* ── Empty state ───────────────────────────────────────────────────── */}
        {recentApplications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400 mb-4">
              You haven&apos;t applied to any jobs yet.
            </p>
            <Link
              href="/jobs"
              className="text-sm font-bold text-black border-b border-black pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentApplications.map((app) => {
              const statusLabel =
                app.status.charAt(0).toUpperCase() + app.status.slice(1);
              const badgeStyle = STATUS_STYLES[app.status] || STATUS_STYLES.pending;

              return (
                <div
                  key={app._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-gray-50/50 transition-colors duration-200"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{app.jobTitle}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{app.companyName}</p>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${badgeStyle}`}>
                      {statusLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}