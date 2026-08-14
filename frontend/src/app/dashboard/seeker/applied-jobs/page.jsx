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
    <div className="pt-10 px-8 sm:px-12 w-full bg-gray-50/50 min-h-screen pb-20">

      <div className="border-b border-gray-200 pb-6 mb-10">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
          My Activity
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Applied Jobs
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          {applications.length} application{applications.length !== 1 ? "s" : ""} total
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-16 text-center shadow-sm">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
            No applications yet.
          </p>
          <Link
            href="/jobs"
            className="inline-block bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
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
                className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-black transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {app.jobTitle}
                  </h2>
                  <p className="text-sm font-medium text-gray-600 mt-1">
                    {app.companyName}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Applied on {formatDate(app.appliedAt)}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <span
                    className={`px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${badgeStyle}`}
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
