import Link from "next/link";
import { getJobByIdService } from "@/lib/jobs";
import ApplyButton from "@/components/ApplyButton";
import BookmarkButton from "@/components/BookmarkButton";

export default async function JobDetailsPage({ params }) {
  const { id } = await params;
  
  const data = await getJobByIdService(id);
  const job = data?.success ? data.job : null;

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-bold text-red-500">Job Not Found!</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 shadow-sm border border-gray-200">
        {/* Back button */}
        <Link
          href="/jobs"
          className="text-sm font-bold text-gray-500 hover:text-black mb-6 inline-block"
        >
          ← Back to Jobs
        </Link>

        {/* Job Header */}
        <h1 className="text-3xl font-extrabold text-black uppercase mb-2">
          {job.title}
        </h1>
        <p className="text-lg text-gray-600 font-medium mb-4">
          {job.company || job.companyName} • {job.location}
        </p>

        <div className="inline-block bg-gray-100 px-4 py-1.5 text-sm font-bold text-gray-700 mb-8">
          Salary: {job.salary}
        </div>

        {/* Job Description */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-black uppercase mb-3">
            Job Description
          </h3>
          <p className="text-gray-600 leading-relaxed">{job.description}</p>
        </div>

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-black uppercase mb-3">
              Requirements
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions: Apply & Bookmark */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-10">
          <div className="flex-1">
            <ApplyButton jobId={job._id.toString()} />
          </div>
          <BookmarkButton jobId={job._id.toString()} />
        </div>
      </div>
    </div>
  );
}
