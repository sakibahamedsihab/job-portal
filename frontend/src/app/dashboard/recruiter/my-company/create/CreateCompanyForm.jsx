// src/app/dashboard/recruiter/my-company/create/CreateCompanyForm.jsx
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
    <div className="border border-gray-200 p-8 sm:p-10 w-full max-w-md bg-white">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Banner */}
        {errorMessage && (
          <div className="p-4 border-2 border-red-500 bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider">
            {errorMessage}
          </div>
        )}

        {/* Company Name */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-black uppercase tracking-wider">
            Company Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black rounded-none text-black"
          />
        </div>

        {/* Website URL */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-black uppercase tracking-wider">
            Website URL
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black rounded-none text-black"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-black uppercase tracking-wider">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
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
            {isLoading ? "SAVING..." : "SAVE COMPANY"}
          </button>
        </div>
      </form>
    </div>
  );
}
