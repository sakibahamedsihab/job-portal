// src/app/dashboard/recruiter/my-company/component.jsx
import Link from "next/link";

export default function CompanyDisplay({ company }) {
  return (
    <div className="pt-10 px-8 sm:px-12 w-full bg-white min-h-screen">
      {/* Header Section */}
      <div className="border-b border-gray-200 pb-6 mb-10">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
          Overview
        </p>
        <h1 className="text-4xl font-extrabold text-black uppercase tracking-tight">
          My Company
        </h1>
      </div>

      {!company ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] border border-gray-200 bg-gray-50 p-10">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">
            You haven't set up a company profile yet.
          </p>
          <Link
            href="/dashboard/recruiter/my-company/create"
            className="bg-black text-white font-bold text-sm uppercase py-4 px-10 rounded-none hover:bg-gray-800 transition-colors tracking-widest"
          >
            Create Company Profile
          </Link>
        </div>
      ) : (
        <div className="border border-gray-200 p-8 sm:p-12 w-full max-w-3xl mx-auto bg-white space-y-8">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              Company Name
            </p>
            <h2 className="text-2xl font-extrabold text-black uppercase tracking-wide">
              {company.name}
            </h2>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              Website
            </p>
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-bold text-blue-600 hover:underline"
            >
              {company.website}
            </a>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              Description
            </p>
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {company.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
