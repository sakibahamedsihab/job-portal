import Link from "next/link";
import CreateCompanyForm from "./CreateCompanyForm";

export default function CreateCompanyPage() {
  return (
    <div className="flex flex-col items-center pt-10 min-h-screen bg-white px-4">
      <div className="w-full max-w-md mb-6">
        <Link
          href="/dashboard/recruiter/my-company"
          className="text-xs font-bold text-gray-400 hover:text-black uppercase tracking-widest transition-colors inline-block"
        >
          &larr; Back to My Company
        </Link>
      </div>

      <div className="text-center mb-8">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
          Set up profile
        </p>
        <h1 className="text-4xl font-extrabold text-black uppercase tracking-tight">
          Create A Company
        </h1>
      </div>

      <CreateCompanyForm />
    </div>
  );
}
