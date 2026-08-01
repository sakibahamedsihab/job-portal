"use client";
// src/components/ApplyButton.jsx

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
      if (result.message?.includes("already applied")) {
        setState("duplicate");
      } else {
        setState("error");
        setMessage(result.message || "Something went wrong.");
      }
    }
  };

  if (state === "applied") {
    return (
      <div className="w-full text-center py-3 border-2 border-green-600 text-green-600 font-bold text-xs uppercase tracking-wide">
        ✓ Application Submitted!
      </div>
    );
  }

  if (state === "duplicate") {
    return (
      <div className="w-full text-center py-3 border-2 border-yellow-500 text-yellow-600 font-bold text-xs uppercase tracking-wide">
        You have already applied for this job.
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="w-full space-y-2">
        <div className="text-center py-3 border-2 border-red-400 text-red-600 text-xs font-bold">
          {message}
        </div>
        <button
          onClick={() => setState("idle")}
          className="w-full py-1 text-xs font-bold uppercase text-gray-500 hover:text-black transition-colors"
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
      className={`w-full bg-black text-white font-bold uppercase text-xs tracking-wide py-3.5 transition-colors ${
        state === "loading"
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-gray-800"
      }`}
    >
      {state === "loading" ? "Submitting..." : "Apply For This Job"}
    </button>
  );
}
