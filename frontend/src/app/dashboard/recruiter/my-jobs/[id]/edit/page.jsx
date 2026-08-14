import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EditJobForm from "@/components/EditJobForm";
import { getJobByIdService } from "@/lib/jobs";

export default async function EditJobPage({ params }) {
  const { id } = await params;
  const response = await getJobByIdService(id);
  const job = response?.job || null;

  if (!job) {
    return (
      <div className="pt-10 px-8 sm:px-12 w-full bg-gray-50/50 min-h-screen">
        <Link
          href="/dashboard/recruiter/my-jobs"
          className="text-xs font-bold text-gray-500 hover:text-black uppercase tracking-widest inline-flex items-center gap-2 mb-8 transition-colors bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm"
        >
          <ArrowLeft size={16} /> Back to My Jobs
        </Link>
        <div className="bg-white rounded-3xl border border-red-200 p-12 text-center shadow-sm">
          <h2 className="text-xl font-bold text-red-600 mb-2">Job Post Not Found</h2>
          <p className="text-sm text-gray-500">The requested job does not exist or may have been deleted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pt-10 min-h-screen bg-gray-50/50 px-4 sm:px-8 pb-20">
      <div className="w-full max-w-3xl mb-6">
        <Link
          href="/dashboard/recruiter/my-jobs"
          className="text-xs font-bold text-gray-500 hover:text-black uppercase tracking-widest inline-flex items-center gap-2 transition-colors bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm"
        >
          <ArrowLeft size={16} /> Back to My Jobs
        </Link>
      </div>

      <div className="w-full max-w-3xl mb-8">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
          Management
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Edit Job Posting
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Update the specifications and compensation for <span className="font-semibold text-gray-800">{job.title}</span>.
        </p>
      </div>

      <div className="w-full max-w-3xl">
        <EditJobForm job={job} />
      </div>
    </div>
  );
}
