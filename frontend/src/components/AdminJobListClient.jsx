"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, ExternalLink, Building, MapPin } from "lucide-react";
import { deleteJobAdminService } from "@/lib/admin";

export default function AdminJobListClient({ initialJobs = [] }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [deletingId, setDeletingId] = useState(null);

  const handleDeleteJob = async (id, title) => {
    if (!confirm(`Are you sure you want to delete job post "${title}"?`)) return;

    setDeletingId(id);
    const res = await deleteJobAdminService(id);

    if (res.success) {
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } else {
      alert(res.message || "Failed to delete job.");
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-4">
      {jobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 font-bold uppercase text-xs shadow-sm">
          No job posts found for moderation.
        </div>
      ) : (
        jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md hover:border-black transition-all"
          >
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                {job.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500">
                <span className="flex items-center gap-1">
                  <Building size={13} className="text-gray-400" />
                  {job.companyName || job.company || "Company"}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-gray-400" />
                  {job.location}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href={`/jobs/${job._id}`}
                target="_blank"
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-black hover:text-white hover:border-black transition-all flex items-center gap-1.5 shadow-sm"
              >
                View <ExternalLink size={13} />
              </Link>

              <button
                onClick={() => handleDeleteJob(job._id, job.title)}
                disabled={deletingId === job._id}
                className="px-4 py-2 border border-red-200 bg-red-50 text-red-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
              >
                <Trash2 size={13} />
                {deletingId === job._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
