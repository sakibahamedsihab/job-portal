import Link from "next/link";
import { Building, Globe, FileText, PlusCircle } from "lucide-react";

export default function CompanyDisplay({ company }) {
  return (
    <div className="pt-10 px-8 sm:px-12 w-full bg-gray-50/50 min-h-screen pb-20">
      <div className="border-b border-gray-200 pb-6 mb-10">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
          Organization
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          My Company Profile
        </h1>
      </div>

      {!company ? (
        <div className="flex flex-col items-center justify-center min-h-[45vh] bg-white rounded-3xl border border-gray-200 shadow-sm p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
            <Building size={32} />
          </div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">
            You haven&apos;t set up a company profile yet.
          </p>
          <Link
            href="/dashboard/recruiter/my-company/create"
            className="bg-black text-white font-bold text-xs uppercase py-3.5 px-8 rounded-xl shadow-md hover:bg-gray-800 hover:shadow-lg transition-all tracking-wider flex items-center gap-2"
          >
            <PlusCircle size={16} />
            Create Company Profile
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 sm:p-12 w-full max-w-3xl mx-auto space-y-8">
          <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
            <div className="w-16 h-16 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-extrabold text-2xl shadow-sm">
              {(company.name[0] || "C").toUpperCase()}
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-0.5">
                Company Name
              </p>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {company.name}
              </h2>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Globe size={13} className="text-gray-400" /> Website
            </p>
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-blue-600 hover:underline"
            >
              {company.website}
            </a>
          </div>

          <div>
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <FileText size={13} className="text-gray-400" /> About Company
            </p>
            <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
              {company.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
