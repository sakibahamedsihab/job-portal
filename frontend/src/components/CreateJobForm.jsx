// src/components/CreateJobForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createJobService } from "@/lib/jobs";

export default function CreateJobForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await createJobService(jobData);

      if (response.success) {
        router.push("/dashboard/recruiter/my-jobs");
        router.refresh();
      } else {
        setErrorMessage(response.message || "Failed to post job. Please ensure you have created a company profile first.");
      }
    } catch (error) {
      console.error("Error submitting job:", error);
      setErrorMessage("Failed to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Feedback Banner */}
      {errorMessage && (
        <div className="p-4 border-2 border-red-500 bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider">
          {errorMessage}
        </div>
      )}

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
