"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building, Globe, FileText, PlusCircle, Edit3, X, Check } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import { updateCompanyService } from "@/lib/companies";

export default function CompanyDisplay({ company: initialCompany }) {
  const router = useRouter();
  const [company, setCompany] = useState(initialCompany);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: initialCompany?.name || "",
    website: initialCompany?.website || "",
    description: initialCompany?.description || "",
    logo: initialCompany?.logo || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await updateCompanyService(formData);

      if (response.success) {
        setCompany(response.company);
        setSuccessMessage("Company profile updated successfully!");
        setTimeout(() => {
          setIsEditing(false);
          setSuccessMessage("");
          router.refresh();
        }, 1200);
      } else {
        setErrorMessage(response.message || "Failed to update company profile.");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      setErrorMessage("Network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-10 px-8 sm:px-12 w-full bg-gray-50/50 min-h-screen pb-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-6 mb-10 gap-4">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Organization
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            My Company Profile
          </h1>
        </div>

        {company && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-black text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-md hover:bg-gray-800 transition-all flex items-center gap-2"
          >
            <Edit3 size={14} />
            Edit Profile
          </button>
        )}
      </div>

      {!company ? (
        <div className="flex flex-col items-center justify-center min-h-[45vh] bg-white rounded-3xl border border-gray-200 shadow-sm p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
            <Building size={32} />
          </div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">
            You haven&apos;t set up a company profile yet.
          </p>
          <Link
            href="/dashboard/recruiter/my-company/create"
            className="bg-black text-white font-bold text-xs uppercase py-3.5 px-8 rounded-xl shadow-md hover:bg-gray-800 hover:shadow-lg transition-all tracking-wider flex items-center gap-2"
          >
            <PlusCircle size={16} />
            Create Company Profile
          </Link>
        </div>
      ) : isEditing ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 sm:p-10 w-full max-w-2xl mx-auto">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Edit3 size={16} /> Edit Company Details
            </h2>
            <button
              onClick={() => {
                setIsEditing(false);
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-5">
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

            {/* Company Logo ImageUploader */}
            <ImageUploader
              label="Company Logo"
              value={formData.logo}
              onChange={(url) => setFormData((prev) => ({ ...prev, logo: url }))}
              aspectRatio="square"
              helperText="Upload official company logo (PNG, JPG, SVG)"
            />

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
                Company Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 focus:bg-white focus:outline-none focus:border-black rounded-xl text-gray-900 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
                Website URL *
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 focus:bg-white focus:outline-none focus:border-black rounded-xl text-gray-900 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
                About Company *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
                className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 focus:bg-white focus:outline-none focus:border-black rounded-xl text-gray-900 resize-none transition-all"
              ></textarea>
            </div>

            <div className="pt-3 flex items-center gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 bg-black text-white font-bold text-xs uppercase py-3.5 rounded-xl shadow-md hover:bg-gray-800 transition-all tracking-wider ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "SAVING..." : "SAVE & UPDATE PROFILE"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 sm:p-12 w-full max-w-3xl mx-auto space-y-8">
          <div className="flex items-center gap-5 border-b border-gray-100 pb-6">
            {company.logo ? (
              <div className="w-20 h-20 rounded-2xl border border-gray-200 bg-white overflow-hidden p-1 shadow-sm flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-extrabold text-2xl shadow-sm">
                {(company.name[0] || "C").toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-0.5">
                Company Name
              </p>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {company.name}
              </h2>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Globe size={13} className="text-gray-400" /> Website
            </p>
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-blue-600 hover:underline"
            >
              {company.website}
            </a>
          </div>

          <div>
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <FileText size={13} className="text-gray-400" /> About Company
            </p>
            <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
              {company.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
