import Link from "next/link";
import { MapPin, DollarSign, Building, ArrowUpRight } from "lucide-react";

export default function JobCard({ job }) {
  const company = job.companyName || job.company || "Company";
  const skills = Array.isArray(job.skills) ? job.skills.slice(0, 4) : [];
  const companyInitial = (company[0] || "C").toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-black transition-all duration-300 flex flex-col justify-between h-full group">
      <div>
        {/* Top Header: Company Avatar & Badges */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center font-extrabold text-lg shadow-sm group-hover:scale-105 transition-transform">
              {companyInitial}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Building size={12} className="text-gray-400" />
                {company}
              </p>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {job.category || "Engineering"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              {job.jobType || "Full-Time"}
            </span>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              {job.workplaceType || "Remote"}
            </span>
          </div>
        </div>

        {/* Job Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-black transition-colors">
          {job.title}
        </h2>

        {/* Description Snippet */}
        {job.description && (
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
            {job.description}
          </p>
        )}

        {/* Location & Salary Chips */}
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-600 mb-5">
          <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
            <MapPin size={13} className="text-gray-400" />
            {job.location}
          </span>
          <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 font-bold text-gray-900">
            <DollarSign size={13} className="text-emerald-600" />
            {job.salary}
          </span>
          {job.experienceLevel && (
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg border border-purple-100 text-[11px] font-bold">
              {job.experienceLevel}
            </span>
          )}
        </div>

        {/* Skills Tags */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium bg-gray-100/80 text-gray-700 px-2.5 py-1 rounded-md border border-gray-200/60"
              >
                {skill}
              </span>
            ))}
            {job.skills && job.skills.length > 4 && (
              <span className="text-[10px] font-bold text-gray-400 self-center">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
        <span className="text-[11px] font-semibold text-gray-400">
          {job.deadline ? `Deadline: ${job.deadline}` : "Actively Hiring"}
        </span>
        <Link
          href={`/jobs/${job._id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-all shadow-sm group-hover:shadow-md"
        >
          View Role <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}
