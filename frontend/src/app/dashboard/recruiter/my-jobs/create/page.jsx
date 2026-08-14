import CreateJobForm from "@/components/CreateJobForm";
import Link from "next/link";

export default function CreateJobPage() {
  return (
    <div className="pt-10 px-8 sm:px-12 w-full bg-white min-h-screen pb-20">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/dashboard/recruiter/my-jobs"
          className="text-xs font-bold text-gray-400 hover:text-black uppercase tracking-widest transition-colors mb-8 inline-block"
        >
          &larr; Back to My Jobs
        </Link>

        <h1 className="text-4xl font-extrabold text-black uppercase tracking-tight mb-10">
          Post A New Job
        </h1>

        <div className="border border-gray-200 p-8 sm:p-10 w-full bg-white">
          <CreateJobForm />
        </div>
      </div>
    </div>
  );
}
