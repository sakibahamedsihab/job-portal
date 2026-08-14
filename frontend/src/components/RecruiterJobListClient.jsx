"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit3, Trash2, Users, ExternalLink } from "lucide-react";
import { deleteJobService } from "@/lib/jobs";

export default function RecruiterJobListClient({ initialJobs = [] }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete the job posting "${title}"? All associated applications will also be removed.`)) {
      return;
    }

    setDeletingId(id);
    const res = await deleteJobService(id);

    if (res.success) {
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } else {
      alert(res.message || "Failed to delete job.");
    }
    setDeletingId(null);
  };

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 p-16 text-center shadow-sm">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
          No jobs posted yet.
        </p>
        <Link
          href="/dashboard/recruiter/my-jobs/create"
          className="inline-block bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
        >
          Create Your First Job
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {jobs.map((job) => (
        <div
          key={job._id}
          className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-black transition-all flex flex-col lg:flex-row justify-between lg:items-center gap-6"
        >
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-gray-900">
              {job.title}
            </h2>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-1 rounded-lg border border-gray-100">
                {job.location}
              </span>
              <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-lg border border-emerald-100">
                {job.salary}
              </span>
              {job.jobType && (
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-lg border border-blue-100">
                  {job.jobType}
                </span>
              )}
              {job.category && (
                <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1 rounded-lg border border-purple-100">
                  {job.category}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* View applicants */}
            <Link
              href={`/dashboard/recruiter/my-jobs/${job._id}/applicants`}
              className="text-xs font-bold text-gray-900 bg-gray-50 hover:bg-gray-100 px-3.5 py-2.5 rounded-xl border border-gray-200 uppercase tracking-wider transition-all inline-flex items-center gap-1.5 shadow-sm"
            >
              <Users size={14} className="text-gray-500" />
              Applicants
            </Link>

            {/* Edit job */}
            <Link
              href={`/dashboard/recruiter/my-jobs/${job._id}/edit`}
              className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2.5 rounded-xl border border-blue-200 uppercase tracking-wider transition-all inline-flex items-center gap-1.5 shadow-sm"
            >
              <Edit3 size={14} />
              Edit
            </Link>

            {/* View live role */}
            <Link
              href={`/jobs/${job._id}`}
              target="_blank"
              className="text-xs font-bold text-gray-700 bg-gray-50 hover:bg-black hover:text-white hover:border-black px-3.5 py-2.5 rounded-xl border border-gray-200 uppercase tracking-wider transition-all inline-flex items-center gap-1.5 shadow-sm"
            >
              <ExternalLink size={14} />
              Live
            </Link>

            {/* Delete job */}
            <button
              onClick={() => handleDelete(job._id, job.title)}
              disabled={deletingId === job._id}
              className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3.5 py-2.5 rounded-xl border border-red-200 uppercase tracking-wider transition-all inline-flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
            >
              <Trash2 size={14} />
              {deletingId === job._id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
