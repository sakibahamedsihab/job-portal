// src/components/CreateJobForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createJobService } from "@/lib/jobs"; // তোমার বানানো সার্ভিস

export default function CreateJobForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await createJobService(jobData);

      if (response.success) {
        // সাকসেস হলে my-jobs পেজে পাঠিয়ে দাও
        router.push("/dashboard/recruiter/my-jobs");
        router.refresh();
      } else {
        alert(response.message || "Failed to post job.");
      }
    } catch (error) {
      console.error("Error submitting job:", error);
      alert("Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          disabled={isLoading}
          className={`w-full bg-black text-white font-bold text-sm uppercase py-4 rounded-none transition-colors tracking-widest ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
          }`}
        >
          {isLoading ? "PUBLISHING..." : "PUBLISH JOB"}
        </button>
      </div>
    </form>
  );
}
