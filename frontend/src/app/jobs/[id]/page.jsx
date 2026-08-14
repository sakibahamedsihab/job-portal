import Link from "next/link";
import { getJobByIdService } from "@/lib/jobs";
import ApplyButton from "@/components/ApplyButton";
import BookmarkButton from "@/components/BookmarkButton";
import {
  Briefcase,
  Building,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Code2,
  CheckCircle2,
  Gift,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

function formatDate(date) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function JobDetailsPage({ params }) {
  const { id } = await params;

  const data = await getJobByIdService(id);
  const job = data?.success ? data.job : null;

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white border-2 border-black p-12 text-center max-w-md shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-2xl font-extrabold text-red-600 uppercase mb-3">
            Job Not Found
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            The job post you are looking for may have been expired, filled, or removed by moderation.
          </p>
          <Link
            href="/jobs"
            className="inline-block bg-black text-white text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            ← Browse Open Jobs
          </Link>
        </div>
      </div>
    );
  }

  const company = job.companyName || job.company || "Featured Company";
  const postedDate = formatDate(job.createdAt);
  const deadlineDate = job.deadline ? formatDate(job.deadline) : null;
  const skills = Array.isArray(job.skills) ? job.skills : [];
  const responsibilities = Array.isArray(job.responsibilities) ? job.responsibilities : [];
  const requirements = Array.isArray(job.requirements) ? job.requirements : [];
  const benefits = Array.isArray(job.benefits) ? job.benefits : [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation */}
        <Link
          href="/jobs"
          className="text-xs font-bold text-gray-500 hover:text-black uppercase tracking-widest inline-flex items-center gap-2 transition-colors bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm"
        >
          <ArrowLeft size={16} /> Back to Job Listings
        </Link>

        {/* Main Job Container */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 sm:p-12 space-y-10">
          {/* Header Section */}
          <div className="border-b border-gray-100 pb-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-800 px-3.5 py-1 rounded-full border border-gray-200">
                {job.category || "Engineering"}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider bg-black text-white px-3.5 py-1 rounded-full">
                {job.jobType || "Full-Time"}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 px-3.5 py-1 rounded-full">
                {job.workplaceType || "Remote"}
              </span>
              {job.experienceLevel && (
                <span className="text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 px-3.5 py-1 rounded-full">
                  {job.experienceLevel}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-gray-600">
              <span className="flex items-center gap-1.5 text-gray-900 font-bold">
                <Building size={16} className="text-gray-400" />
                {company}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={16} className="text-gray-400" />
                {job.location}
              </span>
              {postedDate && (
                <span className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <Clock size={14} />
                  Posted {postedDate}
                </span>
              )}
            </div>
          </div>

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-gray-50/80 rounded-2xl border border-gray-100">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1">
                Salary
              </p>
              <p className="text-sm sm:text-base font-extrabold text-gray-900 flex items-center gap-1">
                <DollarSign size={16} className="text-emerald-600 shrink-0" />
                {job.salary}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1">
                Workplace
              </p>
              <p className="text-sm sm:text-base font-extrabold text-gray-900">
                {job.workplaceType || "Remote"}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1">
                Experience
              </p>
              <p className="text-sm sm:text-base font-extrabold text-gray-900">
                {job.experienceLevel || "Mid-level"}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1">
                Deadline
              </p>
              <p className="text-sm sm:text-base font-extrabold text-gray-900">
                {deadlineDate || "Open Until Filled"}
              </p>
            </div>
          </div>

          {/* Key Skills & Tech Stack */}
          {skills.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-900 flex items-center gap-2">
                <Code2 size={16} className="text-gray-500" /> Skills & Technologies
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3.5 py-1.5 bg-gray-100 text-gray-800 text-xs font-bold rounded-xl border border-gray-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Role Overview */}
          <div className="space-y-4">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-900 flex items-center gap-2">
              <Briefcase size={16} className="text-gray-500" /> Role Overview
            </h2>
            <div className="text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {job.description}
            </div>
          </div>

          {/* Responsibilities */}
          {responsibilities.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-900 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-gray-500" /> Key Responsibilities
              </h2>
              <ul className="space-y-2.5">
                {responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm sm:text-base text-gray-700">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements & Qualifications */}
          {requirements.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-900 flex items-center gap-2">
                <ShieldCheck size={16} className="text-gray-500" /> Qualifications & Requirements
              </h2>
              <ul className="space-y-2.5">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm sm:text-base text-gray-700">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Perks & Benefits */}
          {benefits.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-900 flex items-center gap-2">
                <Gift size={16} className="text-gray-500" /> Perks & Benefits
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl border border-gray-100 bg-gray-50/80 flex items-start gap-3 text-sm text-gray-800"
                  >
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Apply & Bookmark Action Bar */}
          <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <ApplyButton jobId={job._id.toString()} />
            </div>
            <BookmarkButton jobId={job._id.toString()} />
          </div>
        </div>
      </div>
    </div>
  );
}
