// src/app/dashboard/seeker/applied-jobs/page.jsx
//
// This server component fetches all applications for the logged-in seeker
// and displays them in a clean list with status badges.
//
// Flow:
//   1. Get the session cookie from next/headers (server-side)
//   2. Forward the cookie to the backend via getMyApplicationsService
//   3. The backend's requireAuth validates the session and attaches req.user
//   4. The backend returns all applications where seekerId === req.user.id
//   5. We render the list (or an empty state if none found)

import { cookies } from "next/headers";
import Link from "next/link";
import { getMyApplicationsService } from "@/lib/applications";

// ── Status badge helper ──────────────────────────────────────────────────────
// Maps the raw "status" string stored in MongoDB to a visual badge style.
// Having this as a lookup object (vs a chain of if/else) is cleaner and
// makes it easy to add new statuses later.
const STATUS_STYLES = {
  pending:    "bg-gray-50 text-gray-600 border-gray-200",
  reviewing:  "bg-yellow-50 text-yellow-700 border-yellow-200",
  interview:  "bg-blue-50 text-blue-700 border-blue-200",
  rejected:   "bg-red-50 text-red-600 border-red-200",
  accepted:   "bg-green-50 text-green-700 border-green-200",
};

// ── Date formatter helper ────────────────────────────────────────────────────
// Converts an ISO date string to a friendly format like "Aug 1, 2026"
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AppliedJobsPage() {
  // ── Step 1: Read the cookie from the incoming request ─────────────────────
  // This is a server component, so we use next/headers to access cookies.
  // The seeker's session is stored in the browser as "better-auth.session_token".
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  // ── Step 2: Fetch applications from the backend ───────────────────────────
  // We pass cookieHeader so the fetch includes it in the "Cookie" header.
  // Without this, the Express backend would receive no session and return 401.
  const result = await getMyApplicationsService(cookieHeader);
  const applications = result?.applications ?? [];

  return (
    <div className="pt-10 px-8 sm:px-12 w-full bg-white min-h-screen pb-20">

      {/* Page Header */}
      <div className="border-b border-gray-200 pb-6 mb-10">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
          My Activity
        </p>
        <h1 className="text-4xl font-extrabold text-black uppercase tracking-tight">
          Applied Jobs
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          {applications.length} application{applications.length !== 1 ? "s" : ""} total
        </p>
      </div>

      {/* ── Empty State ────────────────────────────────────────────────────── */}
      {/* Shown when the seeker hasn't applied to any jobs yet */}
      {applications.length === 0 ? (
        <div className="border border-gray-200 p-16 text-center bg-gray-50">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
            No applications yet.
          </p>
          <Link
            href="/jobs"
            className="inline-block bg-black text-white text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        /* ── Application List ─────────────────────────────────────────────── */
        <div className="flex flex-col gap-4">
          {applications.map((app) => {
            // Capitalise the first letter of the status for display
            // e.g. "pending" → "Pending"
            const statusLabel =
              app.status.charAt(0).toUpperCase() + app.status.slice(1);

            // Pick the badge style from the lookup, fall back to neutral gray
            const badgeStyle =
              STATUS_STYLES[app.status] || STATUS_STYLES.pending;

            return (
              <div
                key={app._id}
                className="border border-gray-200 p-6 bg-white hover:border-black transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Left: Job info */}
                <div>
                  <h2 className="text-lg font-extrabold text-black uppercase tracking-wide">
                    {app.jobTitle}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {app.companyName}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
                    Applied on {formatDate(app.appliedAt)}
                  </p>
                </div>

                {/* Right: Status badge */}
                <div className="flex-shrink-0">
                  <span
                    className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest border ${badgeStyle}`}
                  >
                    {statusLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
