"use client";

// src/components/BookmarkButton.jsx
// Interactive bookmark button component for Job Seekers.

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { toggleSaveJobService, checkIsJobSavedService } from "@/lib/savedJobs";

export default function BookmarkButton({ jobId }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!jobId) return;
    let isMounted = true;

    const fetchStatus = async () => {
      const res = await checkIsJobSavedService(jobId);
      if (isMounted && res?.success) {
        setIsSaved(res.isSaved);
      }
    };

    fetchStatus();

    return () => {
      isMounted = false;
    };
  }, [jobId]);

  const handleToggle = async () => {
    setIsLoading(true);
    const res = await toggleSaveJobService(jobId);
    if (res?.success) {
      setIsSaved(res.saved);
    }
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      title={isSaved ? "Remove from Saved Jobs" : "Save Job"}
      className={`px-5 py-3 border transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider ${
        isSaved
          ? "border-emerald-600 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          : "border-gray-300 text-gray-700 hover:border-black hover:bg-gray-50"
      } ${isLoading ? "opacity-60 cursor-wait" : ""}`}
    >
      <Bookmark size={16} className={isSaved ? "fill-emerald-600" : ""} />
      {isSaved ? "Saved" : "Save Job"}
    </button>
  );
}
