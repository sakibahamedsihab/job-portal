"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toggleSaveJobService, checkIsJobSavedService } from "@/lib/savedJobs";

export default function BookmarkButton({ jobId }) {
  const { data: session, isPending } = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userRole = session?.user?.role;
  const canSave = userRole === "seeker";

  useEffect(() => {
    if (!jobId || !canSave) return;
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
  }, [jobId, canSave]);

  const handleToggle = async () => {
    if (!canSave) return;

    setIsLoading(true);
    const res = await toggleSaveJobService(jobId);
    if (res?.success) {
      setIsSaved(res.saved);
    }
    setIsLoading(false);
  };

  // Only render the bookmark button for job seekers
  if (isPending || !canSave) {
    return null;
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      title={isSaved ? "Remove from Saved Jobs" : "Save Job"}
      className={`px-5 py-3 border transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
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