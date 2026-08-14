"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  Briefcase,
  Search,
  LayoutDashboard,
  User,
  LogOut,
  LogIn,
  UserPlus,
  PlusCircle,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const { data: session, isPending } = useSession();

  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-black flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div className="w-9 h-9 bg-black text-white rounded-xl flex items-center justify-center shadow-sm">
            <Briefcase size={18} />
          </div>
          <span>Job Portal</span>
        </Link>

        {/* Navigation & Auth Controls */}
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
          <Link
            href="/jobs"
            className="text-xs font-bold text-gray-700 hover:text-black transition-colors flex items-center gap-1.5 uppercase tracking-wider px-3 py-2 rounded-xl hover:bg-gray-50"
          >
            <Search size={14} />
            Find Jobs
          </Link>

          {isPending ? (
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider animate-pulse">
              Loading...
            </span>
          ) : session ? (
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider">
                <User size={14} className="text-gray-400" />
                {session.user.name}
              </span>

              <Link
                href={
                  session.user.role === "admin"
                    ? "/dashboard/admin"
                    : session.user.role === "recruiter"
                    ? "/dashboard/recruiter"
                    : "/dashboard/seeker"
                }
                className="text-xs font-bold text-gray-800 hover:text-black uppercase tracking-wider transition-colors flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-gray-100"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>

              {session.user.role === "recruiter" && (
                <Link
                  href="/dashboard/recruiter/my-jobs/create"
                  className="bg-black text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-gray-800 hover:shadow transition-all flex items-center gap-1.5 uppercase tracking-wider"
                >
                  <PlusCircle size={14} />
                  Post Job
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="bg-red-50 text-red-600 text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-red-100 transition-all flex items-center gap-1.5 uppercase tracking-wider"
              >
                <LogOut size={13} />
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="text-xs font-bold text-gray-700 hover:text-black transition-all flex items-center gap-1.5 uppercase tracking-wider px-3.5 py-2 rounded-xl hover:bg-gray-100"
              >
                <LogIn size={14} />
                Log In
              </Link>
              <Link
                href="/register"
                className="bg-black text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-gray-800 hover:shadow transition-all flex items-center gap-1.5 uppercase tracking-wider"
              >
                <UserPlus size={14} />
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
