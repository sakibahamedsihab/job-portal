"use client";

import { useState } from "react";
import { Check, Loader2, ChevronDown, Clock, Eye, PhoneCall, CheckCircle, XCircle } from "lucide-react";
import { updateApplicationStatusService } from "@/lib/applications";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    style: "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
    icon: Clock,
  },
  reviewing: {
    label: "Reviewing",
    style: "bg-yellow-50 text-yellow-800 border-yellow-300 hover:bg-yellow-100",
    icon: Eye,
  },
  interview: {
    label: "Interview",
    style: "bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100",
    icon: PhoneCall,
  },
  accepted: {
    label: "Accepted",
    style: "bg-green-50 text-green-800 border-green-300 hover:bg-green-100",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    style: "bg-red-50 text-red-800 border-red-300 hover:bg-red-100",
    icon: XCircle,
  },
};

export default function ApplicationStatusSelector({ applicationId, initialStatus }) {
  const [currentStatus, setCurrentStatus] = useState(initialStatus || "pending");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === currentStatus || isUpdating) return;

    setIsUpdating(true);
    const result = await updateApplicationStatusService(applicationId, newStatus);

    if (result.success) {
      setCurrentStatus(result.status || newStatus);
    } else {
      alert(result.message || "Failed to update candidate status.");
    }
    setIsUpdating(false);
  };

  const activeConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.pending;
  const ActiveIcon = activeConfig.icon;

  return (
    <div className="relative inline-flex items-center">
      <div
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all shadow-sm ${
          activeConfig.style
        } ${isUpdating ? "opacity-60" : ""}`}
      >
        {isUpdating ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <ActiveIcon size={14} />
        )}
        <select
          value={currentStatus}
          onChange={handleStatusChange}
          disabled={isUpdating}
          className="bg-transparent font-bold uppercase tracking-wider text-xs focus:outline-none cursor-pointer pr-1 appearance-none disabled:cursor-not-allowed"
          aria-label="Update application status"
        >
          <option value="pending" className="bg-white text-gray-800">
            Pending
          </option>
          <option value="reviewing" className="bg-white text-yellow-700">
            Reviewing
          </option>
          <option value="interview" className="bg-white text-blue-700">
            Interview
          </option>
          <option value="accepted" className="bg-white text-green-700">
            Accepted
          </option>
          <option value="rejected" className="bg-white text-red-700">
            Rejected
          </option>
        </select>
        <ChevronDown size={13} className="pointer-events-none opacity-60 ml-0.5" />
      </div>
    </div>
  );
}
