"use client";

import JobCard from "@/components/JobCard";

const DUMMY_JOBS = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Solutions BD",
    location: "Dhaka",
    salary: "60k",
  },
  {
    id: 2,
    title: "React Developer",
    company: "AppX",
    location: "Remote",
    salary: "80k",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Creative Studio",
    location: "Mirpur",
    salary: "50k",
  },
];

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-black uppercase mb-8">
          Available Jobs
        </h1>

        <div className="space-y-4">
          {DUMMY_JOBS.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
