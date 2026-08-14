"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, X, SlidersHorizontal, Filter } from "lucide-react";
import JobCard from "@/components/JobCard";

const CATEGORIES = [
  "All Categories",
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "DevOps & Cloud",
  "Data & AI",
  "Finance & Operations",
  "Customer Support",
  "Other",
];

const JOB_TYPES = ["All Types", "Full-Time", "Part-Time", "Contract", "Internship"];
const WORKPLACE_TYPES = ["All Workplaces", "Remote", "On-site", "Hybrid"];
const EXPERIENCE_LEVELS = ["All Levels", "Entry-level", "Mid-level", "Senior", "Lead", "Executive"];

export default function JobListClient({ initialJobs = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [jobTypeFilter, setJobTypeFilter] = useState("All Types");
  const [workplaceFilter, setWorkplaceFilter] = useState("All Workplaces");
  const [experienceFilter, setExperienceFilter] = useState("All Levels");

  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      const title = (job.title || "").toLowerCase();
      const company = (job.companyName || job.company || "").toLowerCase();
      const location = (job.location || "").toLowerCase();
      const category = job.category || "";
      const jobType = job.jobType || "";
      const workplaceType = job.workplaceType || "";
      const experienceLevel = job.experienceLevel || "";
      const skills = Array.isArray(job.skills) ? job.skills.join(" ").toLowerCase() : "";

      const matchesSearch =
        !searchQuery ||
        title.includes(searchQuery.toLowerCase()) ||
        company.includes(searchQuery.toLowerCase()) ||
        skills.includes(searchQuery.toLowerCase());

      const matchesLocation =
        !locationQuery || location.includes(locationQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "All Categories" || category.toLowerCase() === categoryFilter.toLowerCase();

      const matchesJobType =
        jobTypeFilter === "All Types" || jobType.toLowerCase() === jobTypeFilter.toLowerCase();

      const matchesWorkplace =
        workplaceFilter === "All Workplaces" || workplaceType.toLowerCase() === workplaceFilter.toLowerCase();

      const matchesExperience =
        experienceFilter === "All Levels" || experienceLevel.toLowerCase() === experienceFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesLocation &&
        matchesCategory &&
        matchesJobType &&
        matchesWorkplace &&
        matchesExperience
      );
    });
  }, [
    initialJobs,
    searchQuery,
    locationQuery,
    categoryFilter,
    jobTypeFilter,
    workplaceFilter,
    experienceFilter,
  ]);

  const hasFilters =
    searchQuery ||
    locationQuery ||
    categoryFilter !== "All Categories" ||
    jobTypeFilter !== "All Types" ||
    workplaceFilter !== "All Workplaces" ||
    experienceFilter !== "All Levels";

  const handleClearFilters = () => {
    setSearchQuery("");
    setLocationQuery("");
    setCategoryFilter("All Categories");
    setJobTypeFilter("All Types");
    setWorkplaceFilter("All Workplaces");
    setExperienceFilter("All Levels");
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Controls */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-gray-900" />
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-900">
              Search & Filter Positions
            </h2>
          </div>
          {hasFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-wider flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <X size={14} /> Reset Filters
            </button>
          )}
        </div>

        {/* Search Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search title, skill (e.g. React), or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50/70 border border-gray-200 focus:bg-white focus:border-black focus:outline-none text-sm text-gray-900 rounded-xl transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="relative">
            <MapPin
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Filter by location (e.g. Remote, San Francisco)..."
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50/70 border border-gray-200 focus:bg-white focus:border-black focus:outline-none text-sm text-gray-900 rounded-xl transition-all"
            />
            {locationQuery && (
              <button
                onClick={() => setLocationQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
          <div>
            <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black bg-gray-50 text-gray-900 transition-colors"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">
              Job Type
            </label>
            <select
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black bg-gray-50 text-gray-900 transition-colors"
            >
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">
              Workplace
            </label>
            <select
              value={workplaceFilter}
              onChange={(e) => setWorkplaceFilter(e.target.value)}
              className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black bg-gray-50 text-gray-900 transition-colors"
            >
              {WORKPLACE_TYPES.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">
              Experience Level
            </label>
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black bg-gray-50 text-gray-900 transition-colors"
            >
              {EXPERIENCE_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex justify-between items-center pt-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Showing <span className="text-black font-extrabold">{filteredJobs.length}</span> of {initialJobs.length} positions
          </p>
        </div>
      </div>

      {/* Jobs Grid / Empty State */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
            No jobs match your search and filter criteria.
          </p>
          {hasFilters && (
            <button
              onClick={handleClearFilters}
              className="bg-black text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
