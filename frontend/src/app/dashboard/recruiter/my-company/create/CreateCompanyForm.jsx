"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCompanyService } from "@/lib/companies";

export default function CreateCompanyForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await createCompanyService(formData);

      if (response.success) {
        router.push("/dashboard/recruiter/my-company");
        router.refresh();
      } else {
        setErrorMessage(response.message || "Failed to create company.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("Failed to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 sm:p-10 w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMessage && (
          <div className="p-4 border border-red-300 bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider rounded-2xl">
            {errorMessage}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
            Company Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Acme Corp"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 focus:bg-white focus:outline-none focus:border-black rounded-xl text-gray-900 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
            Website URL
          </label>
          <input
            type="url"
            name="website"
            placeholder="https://example.com"
            value={formData.website}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 focus:bg-white focus:outline-none focus:border-black rounded-xl text-gray-900 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Tell us about the company mission, culture, and team..."
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
            className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 focus:bg-white focus:outline-none focus:border-black rounded-xl text-gray-900 resize-none transition-all"
          ></textarea>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-black text-white font-bold text-xs uppercase py-3.5 rounded-xl shadow-md hover:bg-gray-800 hover:shadow-lg transition-all tracking-wider ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "SAVING..." : "SAVE COMPANY"}
          </button>
        </div>
      </form>
    </div>
  );
}
