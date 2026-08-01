"use client";

// src/components/ApplicationStatusSelector.jsx
//
// Interactive Status Selector for Recruiters
//
// Rules requested:
//   1. Initial state (Pending): Recruiter sees 2 buttons: "Accept" and "Reject".
//   2. Once an action is taken:
//      - If "Accept" is clicked: Status becomes Accepted. The "Reject" button is hidden,
//        and the "Accept" button becomes disabled showing "Accepted".
//      - If "Reject" is clicked: Status becomes Rejected. The "Accept" button is hidden,
//        and the "Reject" button becomes disabled showing "Rejected".

import { useState } from "react";
import { Check, X } from "lucide-react";
import { updateApplicationStatusService } from "@/lib/applications";

export default function ApplicationStatusSelector({ applicationId, initialStatus }) {
  const [currentStatus, setCurrentStatus] = useState(initialStatus || "pending");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus || isUpdating) return;

    setIsUpdating(true);
    const result = await updateApplicationStatusService(applicationId, newStatus);

    if (result.success) {
      setCurrentStatus(result.status);
    } else {
      alert(result.message || "Failed to update candidate status.");
    }
    setIsUpdating(false);
  };

  const isAccepted = currentStatus === "accepted";
  const isRejected = currentStatus === "rejected";

  return (
    <div className="flex items-center gap-2">
      {/* ── Accept Button ─────────────────────────────────────────────────── */}
      {/* Hidden if candidate has already been rejected */}
      {!isRejected && (
        <button
          onClick={() => handleStatusChange("accepted")}
          disabled={isAccepted || isUpdating}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
            isAccepted
              ? "bg-green-100 text-green-800 border border-green-300 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          } ${isUpdating ? "opacity-50 cursor-wait" : ""}`}
        >
          <Check size={14} />
          {isAccepted ? "Accepted" : isUpdating ? "Saving..." : "Accept"}
        </button>
      )}

      {/* ── Reject Button ─────────────────────────────────────────────────── */}
      {/* Hidden if candidate has already been accepted */}
      {!isAccepted && (
        <button
          onClick={() => handleStatusChange("rejected")}
          disabled={isRejected || isUpdating}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
            isRejected
              ? "bg-red-100 text-red-800 border border-red-300 cursor-not-allowed"
              : "border border-red-500 text-red-600 hover:bg-red-50"
          } ${isUpdating ? "opacity-50 cursor-wait" : ""}`}
        >
          <X size={14} />
          {isRejected ? "Rejected" : isUpdating ? "Saving..." : "Reject"}
        </button>
      )}
    </div>
  );
}
