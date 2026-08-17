"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  Briefcase,
  Home,
  Search,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
  PlusCircle,
  ChevronDown,
  FileText,
  Bookmark,
  Building,
  Camera,
} from "lucide-react";
import ProfilePhotoModal from "@/components/ProfilePhotoModal";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: session, isPending } = useSession();

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await signOut();
    router.push("/");
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [pathname]);

  const userRole = session?.user?.role;
  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const userImage = session?.user?.image || "";
  const userInitial = (userName[0] || "U").toUpperCase();

  const dashboardUrl =
    userRole === "admin"
      ? "/dashboard/admin"
      : userRole === "recruiter"
      ? "/dashboard/recruiter"
      : "/dashboard/seeker";

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 py-3.5 px-6 sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left: Brand Logo */}
          <Link
            href="/"
            className="text-xl font-extrabold tracking-tight text-black flex items-center gap-2.5 hover:opacity-85 transition-opacity"
          >
            <div className="w-9 h-9 bg-black text-white rounded-xl flex items-center justify-center shadow-sm">
              <Briefcase size={18} />
            </div>
            <span className="font-extrabold tracking-tight text-lg">Job Portal</span>
          </Link>

          {/* Middle: Main Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-gray-100/70 p-1 rounded-2xl border border-gray-200/60">
            <Link
              href="/"
              className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                pathname === "/"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-600 hover:text-black hover:bg-white/50"
              }`}
            >
              <Home size={14} />
              Home
            </Link>
            <Link
              href="/jobs"
              className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                pathname.startsWith("/jobs")
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-600 hover:text-black hover:bg-white/50"
              }`}
            >
              <Search size={14} />
              Find Jobs
            </Link>
          </div>

          {/* Right: Auth Controls & Profile */}
          <div className="flex items-center gap-3">
            {isPending ? (
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider animate-pulse">
                Loading...
              </span>
            ) : session ? (
              <div className="flex items-center gap-3">
                {/* Recruiter "+ Post Job" CTA */}
                {userRole === "recruiter" && (
                  <Link
                    href="/dashboard/recruiter/my-jobs/create"
                    className="bg-black text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-gray-800 hover:shadow transition-all flex items-center gap-1.5 uppercase tracking-wider"
                  >
                    <PlusCircle size={14} />
                    Post Job
                  </Link>
                )}

                {/* Profile Avatar Trigger & Dropdown Menu */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-gray-200 bg-gray-50/80 hover:bg-gray-100/80 hover:border-gray-300 transition-all focus:outline-none"
                    aria-expanded={isDropdownOpen}
                    aria-label="User profile menu"
                  >
                    {/* Avatar Circle / Image */}
                    {userImage ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center bg-gray-100 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={userImage}
                          alt={userName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-900 to-gray-700 text-white flex items-center justify-center text-xs font-bold shadow-sm flex-shrink-0">
                        {userInitial}
                      </div>
                    )}
                    
                    <div className="hidden sm:block text-left">
                      <p className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[120px]">
                        {userName}
                      </p>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        {userRole}
                      </p>
                    </div>

                    <ChevronDown
                      size={14}
                      className={`text-gray-500 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu Modal */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-gray-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      {/* Header Details */}
                      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                        {userImage ? (
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={userImage}
                              alt={userName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {userInitial}
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-gray-900 truncate">
                            {userName}
                          </p>
                          <p className="text-[11px] text-gray-500 truncate mb-1">
                            {userEmail}
                          </p>
                          <span
                            className={`inline-block text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                              userRole === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : userRole === "recruiter"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {userRole === "recruiter" ? "Recruiter" : userRole === "admin" ? "Admin" : "Job Seeker"}
                          </span>
                        </div>
                      </div>

                      {/* Navigation Items */}
                      <div className="p-1 space-y-0.5">
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setIsPhotoModalOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-gray-700 hover:text-black hover:bg-gray-50 rounded-xl transition-colors uppercase tracking-wider text-left"
                        >
                          <Camera size={15} className="text-gray-400" />
                          Change Profile Photo
                        </button>

                        <Link
                          href={dashboardUrl}
                          className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-gray-700 hover:text-black hover:bg-gray-50 rounded-xl transition-colors uppercase tracking-wider"
                        >
                          <LayoutDashboard size={15} className="text-gray-400" />
                          Dashboard Overview
                        </Link>

                        {/* Recruiter-specific links */}
                        {userRole === "recruiter" && (
                          <>
                            <Link
                              href="/dashboard/recruiter/my-jobs"
                              className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-gray-700 hover:text-black hover:bg-gray-50 rounded-xl transition-colors uppercase tracking-wider"
                            >
                              <FileText size={15} className="text-gray-400" />
                              My Posted Jobs
                            </Link>
                            <Link
                              href="/dashboard/recruiter/my-company"
                              className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-gray-700 hover:text-black hover:bg-gray-50 rounded-xl transition-colors uppercase tracking-wider"
                            >
                              <Building size={15} className="text-gray-400" />
                              Company Profile
                            </Link>
                          </>
                        )}

                        {/* Seeker-specific links */}
                        {userRole === "seeker" && (
                          <>
                            <Link
                              href="/dashboard/seeker/applied-jobs"
                              className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-gray-700 hover:text-black hover:bg-gray-50 rounded-xl transition-colors uppercase tracking-wider"
                            >
                              <FileText size={15} className="text-gray-400" />
                              Applied Jobs
                            </Link>
                            <Link
                              href="/dashboard/seeker/saved-jobs"
                              className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-gray-700 hover:text-black hover:bg-gray-50 rounded-xl transition-colors uppercase tracking-wider"
                            >
                              <Bookmark size={15} className="text-gray-400" />
                              Saved Jobs
                            </Link>
                          </>
                        )}
                      </div>

                      {/* Divider & Logout */}
                      <div className="border-t border-gray-100 p-1 mt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors uppercase tracking-wider"
                        >
                          <LogOut size={15} />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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

      {/* Profile Photo Modal */}
      <ProfilePhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentImage={userImage}
      />
    </>
  );
}
