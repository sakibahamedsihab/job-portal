"use client";
// src/components/ApplyButton.jsx
//
// This is a CLIENT component because it needs interactivity:
//   - useState to track loading & applied state
//   - onClick to call the API
//
// The parent job detail page is a SERVER component (it fetches job data).
// Next.js allows mixing: server components can render client components.
// We keep only the interactive part here and pass the jobId as a prop.

import { useState } from "react";
import { applyToJobService } from "@/lib/applications";

export default function ApplyButton({ jobId }) {
  // "idle" | "loading" | "applied" | "error" | "duplicate"
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");

  const handleApply = async () => {
    setState("loading");

    const result = await applyToJobService(jobId);

    if (result.success) {
      setState("applied");
    } else {
      // The backend returns specific messages for duplicates vs other errors
      // so we can show a helpful message to the user
      if (result.message?.includes("already applied")) {
        setState("duplicate");
      } else {
        setState("error");
        setMessage(result.message || "Something went wrong.");
      }
    }
  };

  // ── Render different UI for each state ──────────────────────────────────────

  if (state === "applied") {
    return (
      <div className="w-full mt-10 text-center py-4 border-2 border-green-600 text-green-600 font-bold uppercase tracking-wide">
        ✓ Application Submitted!
      </div>
    );
  }

  if (state === "duplicate") {
    return (
      <div className="w-full mt-10 text-center py-4 border-2 border-yellow-500 text-yellow-600 font-bold uppercase tracking-wide">
        You have already applied for this job.
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="w-full mt-10 space-y-3">
        <div className="text-center py-3 border-2 border-red-400 text-red-600 text-sm font-bold">
          {message}
        </div>
        <button
          onClick={() => setState("idle")}
          className="w-full py-2 text-xs font-bold uppercase text-gray-500 hover:text-black transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleApply}
      disabled={state === "loading"}
      className={`w-full bg-black text-white font-bold uppercase tracking-wide py-3 mt-10 transition-colors ${
        state === "loading"
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-gray-800"
      }`}
    >
      {state === "loading" ? "Submitting..." : "Apply For This Job"}
    </button>
  );
}
