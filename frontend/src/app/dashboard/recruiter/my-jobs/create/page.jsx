// src/app/dashboard/recruiter/jobs/create/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function CreateJobPage() {
  const [jobData, setJobData] = useState({
    title: "",
    location: "",
    salary: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Ready to post job:", jobData);
    // পরে এখানে API কল বসবে
  };

  return (
    <div className="pt-10 px-8 sm:px-12 w-full bg-white min-h-screen pb-20">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-black uppercase tracking-wider">
                Job Title
              </label>
              <input
                type="text"
                name="title"
                value={jobData.title}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
                required
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black rounded-none text-black"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-black uppercase tracking-wider">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={jobData.location}
                  onChange={handleChange}
                  placeholder="e.g. Dhaka, Remote"
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black rounded-none text-black"
                />
              </div>

              {/* Salary */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-black uppercase tracking-wider">
                  Salary Range
                </label>
                <input
                  type="text"
                  name="salary"
                  value={jobData.salary}
                  onChange={handleChange}
                  placeholder="e.g. 40,000 - 60,000 BDT"
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black rounded-none text-black"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-black uppercase tracking-wider">
                Job Description
              </label>
              <textarea
                name="description"
                value={jobData.description}
                onChange={handleChange}
                placeholder="Describe the responsibilities and requirements..."
                rows="6"
                required
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black rounded-none text-black resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-black text-white font-bold text-sm uppercase py-4 rounded-none hover:bg-gray-800 transition-colors tracking-widest"
              >
                Publish Job
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
