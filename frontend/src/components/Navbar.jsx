"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { signOut } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const { data: session, isPending } = useSession();
  console.log("Current Session:", session);

  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Left Side: Logo */}
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-black uppercase"
        >
          Job Portal
        </Link>

        {/* Right Side: Navigation & Auth Buttons */}
        <div className="flex items-center gap-6">
          {/* Find Jobs সবার জন্য ওপেন, তাই কন্ডিশনের বাইরে */}
          <Link
            href="/jobs"
            className="text-sm font-semibold text-gray-700 hover:text-black transition-colors"
          >
            Find Jobs
          </Link>

          {/* 3-Step Conditional Rendering */}
          {isPending ? (
            <span className="text-sm text-gray-500 animate-pulse">
              Loading...
            </span>
          ) : session ? (
            <div className="flex items-center gap-6">
              <span className="text-sm font-bold text-gray-800">
                Welcome, {session.user.name}
              </span>

              <Link
                href="/dashboard/recruiter"
                className="text-xs font-bold text-black hover:text-gray-500 uppercase tracking-widest transition-colors"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-50 text-red-600 text-sm font-bold px-4 py-2 hover:bg-red-100 transition-colors"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link
                href="/login"
                className="text-sm font-semibold text-gray-600 hover:text-black transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="bg-black text-white text-sm font-bold px-4 py-2 hover:bg-gray-800 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
