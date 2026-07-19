import Link from "next/link";

export default function JobCard({ job }) {
  return (
    <div className="bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
      <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>
      <p className="text-gray-600 font-medium">
        {job.company} {job.location}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1">
          Salary: {job.salary}
        </span>
        <Link
          href={`/jobs/${job._id}`}
          className="text-sm font-bold text-black border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
