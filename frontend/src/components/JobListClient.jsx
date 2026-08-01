"use client";

// src/components/JobListClient.jsx
//
// Client component for the /jobs page providing live search and location filters.

import { useState, useMemo } from "react";
import { Search, MapPin, X, SlidersHorizontal } from "lucide-react";
import JobCard from "@/components/JobCard";

export default function JobListClient({ initialJobs = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  // Filter jobs based on search term and location
  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      const title = (job.title || "").toLowerCase();
      const company = (job.companyName || job.company || "").toLowerCase();
      const location = (job.location || "").toLowerCase();

      const matchesSearch =
        !searchQuery ||
        title.includes(searchQuery.toLowerCase()) ||
        company.includes(searchQuery.toLowerCase());

      const matchesLocation =
        !locationQuery || location.includes(locationQuery.toLowerCase());

      return matchesSearch && matchesLocation;
    });
  }, [initialJobs, searchQuery, locationQuery]);

  const hasFilters = searchQuery || locationQuery;

  const handleClearFilters = () => {
    setSearchQuery("");
    setLocationQuery("");
  };

  return (
    <div className="space-y-8">
      {/* ── Search & Filter Controls Card ────────────────────────────────────── */}
      <div className="bg-white border-2 border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
          <SlidersHorizontal size={18} className="text-black" />
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-black">
            Search & Filter Positions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Keyword Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search title, skill, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-black text-sm text-black rounded-none"
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

          {/* Location Filter */}
          <div className="relative">
            <MapPin
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Filter by location (e.g. Remote, NY)..."
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-black text-sm text-black rounded-none"
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

        {/* Filter Summary & Clear Button */}
        <div className="flex justify-between items-center pt-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Showing <span className="text-black font-extrabold">{filteredJobs.length}</span> of {initialJobs.length} jobs
          </p>

          {hasFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs font-bold text-red-600 hover:underline uppercase tracking-wider flex items-center gap-1"
            >
              <X size={14} /> Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ── Job Cards List ─────────────────────────────────────────────────── */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white border border-gray-200 p-16 text-center">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
            No jobs match your search criteria.
          </p>
          {hasFilters && (
            <button
              onClick={handleClearFilters}
              className="bg-black text-white text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-gray-800 transition-colors"
            >
              Clear Search Filters
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
