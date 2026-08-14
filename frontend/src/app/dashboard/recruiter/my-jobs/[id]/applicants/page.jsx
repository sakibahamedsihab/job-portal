import { cookies } from "next/headers";
import Link from "next/link";
import { Users, Mail, Calendar, ArrowLeft } from "lucide-react";
import { getJobApplicantsService } from "@/lib/applications";
import ApplicationStatusSelector from "@/components/ApplicationStatusSelector";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function JobApplicantsPage({ params }) {
  const { id } = await params;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await getJobApplicantsService(id, cookieHeader);

  const isSuccess = response?.success ?? false;
  const jobTitle = response?.jobTitle || "Job Applicants";
  const applicants = response?.applicants ?? [];

  if (!isSuccess) {
    return (
      <div className="pt-10 px-8 sm:px-12 w-full bg-white min-h-screen">
        <Link
          href="/dashboard/recruiter/my-jobs"
          className="text-xs font-bold text-gray-500 hover:text-black uppercase tracking-widest flex items-center gap-2 mb-8"
        >
          <ArrowLeft size={16} /> Back to My Jobs
        </Link>

        <div className="border border-red-200 p-12 text-center bg-red-50">
          <h2 className="text-xl font-bold text-red-700 uppercase mb-2">
            Access Denied or Job Not Found
          </h2>
          <p className="text-sm text-red-600 max-w-md mx-auto mb-6">
            {response?.message ||
              "You do not have permission to view applicants for this job."}
          </p>
          <Link
            href="/dashboard/recruiter/my-jobs"
            className="inline-block bg-black text-white text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            Return to My Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-10 px-8 sm:px-12 w-full bg-white min-h-screen pb-20">

      <Link
        href="/dashboard/recruiter/my-jobs"
        className="text-xs font-bold text-gray-500 hover:text-black uppercase tracking-widest flex items-center gap-2 mb-8 transition-colors"
      >
        <ArrowLeft size={16} /> Back to My Jobs
      </Link>

      <div className="border-b border-gray-200 pb-6 mb-10">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
          Applicants List
        </p>
        <h1 className="text-4xl font-extrabold text-black uppercase tracking-tight">
          {jobTitle}
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Total Applicants: <span className="font-bold text-black">{applicants.length}</span>
        </p>
      </div>

      {applicants.length === 0 ? (
        <div className="border border-gray-200 p-16 text-center bg-gray-50 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-4">
            <Users size={24} strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-bold text-black uppercase tracking-wide mb-2">
            No Applicants Yet
          </h2>
          <p className="text-sm font-medium text-gray-400 max-w-sm">
            Job seekers who apply to this position will appear here. Check back soon!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {applicants.map((applicant, index) => (
            <div
              key={applicant._id || index}
              className="border border-gray-200 p-6 bg-white hover:border-black transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold bg-black text-white px-2 py-0.5">
                    #{index + 1}
                  </span>
                  <h3 className="text-lg font-extrabold text-black uppercase tracking-wide">
                    {applicant.seekerName || "Anonymous Candidate"}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Mail size={14} className="text-gray-400" />
                    {applicant.seekerEmail}
                  </span>

                  <span className="flex items-center gap-1.5 text-xs text-gray-400 uppercase tracking-wide">
                    <Calendar size={14} className="text-gray-400" />
                    Applied: {formatDate(applicant.appliedAt)}
                  </span>
                </div>
              </div>

              <div>
                <ApplicationStatusSelector
                  applicationId={applicant._id?.toString() || applicant._id}
                  initialStatus={applicant.status}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
