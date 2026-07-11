// src/components/SidebarNav.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarNav() {
  const pathname = usePathname();

  // সাইডবারের মেনু লিস্ট
  const navItems = [
    { name: "Overview", path: "/dashboard/recruiter" },
    { name: "My Company", path: "/dashboard/recruiter/my-company" },
    { name: "My Jobs", path: "/dashboard/recruiter/my-jobs" },
  ];

  return (
    <nav className="flex flex-col pt-6">
      {navItems.map((item) => {
        // রাউট চেক করা
        const isActive =
          item.path === "/dashboard/recruiter"
            ? pathname === item.path
            : pathname.startsWith(item.path);

        return (
          <Link
            key={item.path}
            href={item.path}
            className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors border-l-4 ${
              isActive
                ? "border-black bg-black text-white"
                : "border-transparent text-gray-400 hover:bg-gray-50 hover:text-black"
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
