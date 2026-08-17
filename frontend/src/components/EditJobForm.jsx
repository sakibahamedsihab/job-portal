"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateJobService } from "@/lib/jobs";
import { Briefcase, MapPin, ListChecks } from "lucide-react";

const CATEGORIES = [
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

const JOB_TYPES = ["Full-Time", "Part-Time", "Contract", "Internship"];
const WORKPLACE_TYPES = ["Remote", "On-site", "Hybrid"];
const EXPERIENCE_LEVELS = ["Entry-level", "Mid-level", "Senior", "Lead", "Executive"];

export default function EditJobForm({ job }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [jobData, setJobData] = useState({
    title: job?.title || "",
    category: job?.category || "Engineering",
    jobType: job?.jobType || "Full-Time",
    workplaceType: job?.workplaceType || "Remote",
    experienceLevel: job?.experienceLevel || "Mid-level",
    location: job?.location || "",
    salary: job?.salary || "",
    description: job?.description || "",
    skills: Array.isArray(job?.skills) ? job.skills.join(", ") : job?.skills || "",
    responsibilities: Array.isArray(job?.responsibilities) ? job.responsibilities.join("\n") : job?.responsibilities || "",
    requirements: Array.isArray(job?.requirements) ? job.requirements.join("\n") : job?.requirements || "",
    benefits: Array.isArray(job?.benefits) ? job.benefits.join("\n") : job?.benefits || "",
    deadline: job?.deadline ? new Date(job.deadline).toISOString().split("T")[0] : "",
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
    setSuccessMessage("");

    try {
      const response = await updateJobService(job._id, jobData);

      if (response.success) {
        setSuccessMessage("Job post updated successfully!");
        setTimeout(() => {
          router.push("/dashboard/recruiter/my-jobs");
          router.refresh();
        }, 1000);
      } else {
        setErrorMessage(response.message || "Failed to update job.");
      }
    } catch (error) {
      console.error("Error updating job:", error);
      setErrorMessage("Failed to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {successMessage && (
        <div className="p-4 border border-green-200 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider rounded-2xl">
          ✓ {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider rounded-2xl">
          {errorMessage}
        </div>
      )}

      {/* Basic Role Information */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-3">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-gray-900 flex items-center gap-2">
            <Briefcase size={16} className="text-gray-500" /> 1. Role & Classification
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              value={jobData.title}
              onChange={handleChange}
              placeholder="e.g. Senior Full-Stack Engineer"
              required
              className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 focus:bg-white focus:border-black focus:outline-none rounded-xl text-gray-900 font-medium transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
              Category / Domain *
            </label>
            <select
              name="category"
              value={jobData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 focus:outline-none focus:border-black rounded-xl text-gray-900 transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
              Experience Level *
            </label>
            <select
              name="experienceLevel"
              value={jobData.experienceLevel}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 focus:outline-none focus:border-black rounded-xl text-gray-900 transition-colors"
            >
              {EXPERIENCE_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
              Employment Type *
            </label>
            <select
              name="jobType"
              value={jobData.jobType}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 focus:outline-none focus:border-black rounded-xl text-gray-900 transition-colors"
            >
              {JOB_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
              Workplace Setup *
            </label>
            <select
              name="workplaceType"
              value={jobData.workplaceType}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 focus:outline-none focus:border-black rounded-xl text-gray-900 transition-colors"
            >
              {WORKPLACE_TYPES.map((wp) => (
                <option key={wp} value={wp}>
                  {wp}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Location, Salary & Deadline */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-3">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-gray-900 flex items-center gap-2">
            <MapPin size={16} className="text-gray-500" /> 2. Location & Compensation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={jobData.location}
              onChange={handleChange}
              placeholder="e.g. Gulshan-2, Dhaka or Banani or Remote (BD)"
              required
              className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 focus:bg-white focus:border-black focus:outline-none rounded-xl text-gray-900 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
              Salary / Compensation *
            </label>
            <input
              type="text"
              name="salary"
              value={jobData.salary}
              onChange={handleChange}
              placeholder="e.g. ৳80,000 - ৳1,20,000 / month"
              required
              className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 focus:bg-white focus:border-black focus:outline-none rounded-xl text-gray-900 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
              Application Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={jobData.deadline}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 focus:outline-none focus:border-black rounded-xl text-gray-900 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Details, Skills, Responsibilities, Requirements & Benefits */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-3">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-gray-900 flex items-center gap-2">
            <ListChecks size={16} className="text-gray-500" /> 3. Detailed Specifications
          </h2>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
            Role Overview & Summary *
          </label>
          <textarea
            name="description"
            value={jobData.description}
            onChange={handleChange}
            placeholder="Give a compelling summary of the mission, company culture, and what this role entails..."
            rows="5"
            required
            className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 focus:bg-white focus:border-black focus:outline-none rounded-xl text-gray-900 resize-none transition-all"
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
            Required Skills & Tech Stack (comma or newline separated)
          </label>
          <input
            type="text"
            name="skills"
            value={jobData.skills}
            onChange={handleChange}
            placeholder="e.g. React, Next.js, Node.js, TypeScript, PostgreSQL, AWS"
            className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 focus:bg-white focus:border-black focus:outline-none rounded-xl text-gray-900 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
              Key Responsibilities (one per line)
            </label>
            <textarea
              name="responsibilities"
              value={jobData.responsibilities}
              onChange={handleChange}
              placeholder="• Architect reliable frontend modules&#10;• Collaborate with cross-functional teams&#10;• Review code and mentor engineers"
              rows="5"
              className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 focus:bg-white focus:border-black focus:outline-none rounded-xl text-gray-900 resize-none transition-all"
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
              Qualifications & Requirements (one per line)
            </label>
            <textarea
              name="requirements"
              value={jobData.requirements}
              onChange={handleChange}
              placeholder="• 4+ years software development experience&#10;• Strong understanding of REST & WebSockets&#10;• Proven track record delivering web apps"
              rows="5"
              className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 focus:bg-white focus:border-black focus:outline-none rounded-xl text-gray-900 resize-none transition-all"
            ></textarea>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
            Perks & Benefits (one per line)
          </label>
          <textarea
            name="benefits"
            value={jobData.benefits}
            onChange={handleChange}
            placeholder="• Full medical, dental, and vision coverage&#10;• Generous annual learning and gear stipend&#10;• Flexible remote schedule with unlimited PTO"
            rows="4"
            className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 focus:bg-white focus:border-black focus:outline-none rounded-xl text-gray-900 resize-none transition-all"
          ></textarea>
        </div>
      </div>

      <div className="pt-2 flex items-center gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className={`flex-1 bg-black text-white font-bold text-xs uppercase py-4 rounded-xl shadow-md hover:bg-gray-800 hover:shadow-lg transition-all tracking-widest ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "SAVING CHANGES..." : "SAVE & UPDATE JOB POSTING"}
        </button>
      </div>
    </form>
  );
}
