"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Briefcase, UserCheck, Shield, ArrowRight } from "lucide-react";
import { applyToJobService } from "@/lib/applications";

export default function ApplyButton({ jobId }) {
  const { data: session, isPending } = useSession();
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");

  const userRole = session?.user?.role || "guest";
  const canApply = userRole === "seeker";



  const roleMessages = {
    admin: {
      icon: Shield,
      title: "Admin Access",
      desc: "You're viewing as an admin. Switch to a seeker account to apply.",
      color: "bg-purple-50 border-purple-200 text-purple-700",
      iconColor: "text-purple-600",
    },
    recruiter: {
      icon: Briefcase,
      title: "Recruiter Account",
      desc: "You're logged in as a recruiter. Create a seeker profile to apply for jobs.",
      color: "bg-blue-50 border-blue-200 text-blue-700",
      iconColor: "text-blue-600",
    },
    guest: {
      icon: UserCheck,
      title: "Sign In to Apply",
      desc: "Create a job seeker account to start applying for positions.",
      color: "bg-gray-50 border-gray-200 text-gray-700",
      iconColor: "text-gray-600",
    },
  };

  const handleApply = async () => {
    if (!canApply) return;

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

  if (isPending) {
    return (
      <button
        disabled
        className="w-full bg-gray-200 text-gray-500 font-bold uppercase text-xs tracking-wider py-3.5 rounded-xl animate-pulse"
      >
        Loading...
      </button>
    );
  }

  if (state === "applied") {
    return (
      <div className="w-full text-center py-3.5 border border-emerald-300 bg-emerald-50 text-emerald-700 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2">
        <UserCheck size={16} className="text-emerald-600" />
        Application Submitted!
      </div>
    );
  }

  if (state === "duplicate") {
    return (
      <div className="w-full text-center py-3.5 border border-amber-300 bg-amber-50 text-amber-800 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2">
        <span>✓</span> You have already applied for this job.
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="w-full space-y-2">
        <div className="text-center py-3 border border-red-300 bg-red-50 text-red-600 text-xs font-bold rounded-xl">
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

  if (!canApply) {
    const roleInfo = roleMessages[userRole] || roleMessages.guest;
    const Icon = roleInfo.icon;

    return (
      <div className={`w-full p-4 border rounded-2xl ${roleInfo.color}`}>
        <div className="flex items-center gap-3">
          <div
            className={`p-2 ${roleInfo.color.replace("bg-", "bg-").replace("50", "100")} rounded-xl`}
          >
            <Icon size={20} className={roleInfo.iconColor} />
          </div>
          <div className="flex-1 text-left">
            <p className="font-bold text-sm uppercase tracking-wide">
              {roleInfo.title}
            </p>
            <p className="text-xs mt-1 opacity-80">{roleInfo.desc}</p>
          </div>
        </div>
        {userRole === "guest" && (
          <div className="mt-3 pt-3 border-t border-current/20">
            <a
              href="/register"
              className="w-full block text-center py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-800 transition-colors"
            >
              Create Seeker Account{" "}
              <ArrowRight size={14} className="inline ml-1" />
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleApply}
      disabled={state === "loading"}
      className={`w-full bg-black text-white font-bold uppercase text-xs tracking-wider py-3.5 rounded-xl transition-all shadow-sm hover:bg-gray-800 flex items-center justify-center gap-2 ${
        state === "loading"
          ? "opacity-50 cursor-not-allowed"
          : "hover:shadow-md"
      }`}
    >
      <Briefcase size={14} />
      {state === "loading" ? "Submitting..." : "Apply For This Job"}
    </button>
  );
}
