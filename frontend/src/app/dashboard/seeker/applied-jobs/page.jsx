import { cookies } from "next/headers";
import Link from "next/link";
import { getMyApplicationsService } from "@/lib/applications";

const STATUS_STYLES = {
  pending:    "bg-gray-50 text-gray-600 border-gray-200",
  reviewing:  "bg-yellow-50 text-yellow-700 border-yellow-200",
  interview:  "bg-blue-50 text-blue-700 border-blue-200",
  rejected:   "bg-red-50 text-red-600 border-red-200",
  accepted:   "bg-green-50 text-green-700 border-green-200",
};

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AppliedJobsPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const result = await getMyApplicationsService(cookieHeader);
  const applications = result?.applications ?? [];

  return (
    <div className="pt-10 px-8 sm:px-12 w-full bg-white min-h-screen pb-20">

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
        <div className="flex flex-col gap-4">
          {applications.map((app) => {
            const statusLabel =
              app.status.charAt(0).toUpperCase() + app.status.slice(1);

            const badgeStyle =
              STATUS_STYLES[app.status] || STATUS_STYLES.pending;

            return (
              <div
                key={app._id}
                className="border border-gray-200 p-6 bg-white hover:border-black transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
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
