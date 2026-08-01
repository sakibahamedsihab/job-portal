import Link from "next/link";
import { MapPin, DollarSign, Building } from "lucide-react";

export default function JobCard({ job }) {
  const company = job.companyName || job.company || "Company";

  return (
    <div className="bg-white p-6 sm:p-8 border-2 border-black hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
        <div>
          <h2 className="text-xl font-extrabold text-black uppercase tracking-wide">
            {job.title}
          </h2>
          <p className="text-sm font-bold text-gray-600 flex items-center gap-1.5 mt-1">
            <Building size={14} className="text-black" />
            {company}
          </p>
        </div>

        <span className="bg-gray-100 text-black text-xs font-bold uppercase tracking-wide px-3 py-1 border border-gray-300 self-start">
          Full-time
        </span>
      </div>

      <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-600 uppercase tracking-wide mb-6">
        <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 border border-gray-200">
          <MapPin size={13} className="text-black" />
          {job.location}
        </span>
        <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 border border-gray-200">
          <DollarSign size={13} className="text-black" />
          {job.salary}
        </span>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <Link
          href={`/jobs/${job._id}`}
          className="text-xs font-bold text-black uppercase tracking-widest border-2 border-black px-5 py-2.5 hover:bg-black hover:text-white transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
