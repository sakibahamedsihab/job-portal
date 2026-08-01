// src/components/dashboard/SeekerSidebar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SeekerSidebar() {
  const pathname = usePathname();

  // Seeker Navigation items
  const navItems = [
    { name: "Overview", path: "/dashboard/seeker" },
    { name: "Applied Jobs", path: "/dashboard/seeker/applied-jobs" },
    { name: "Saved Jobs", path: "/dashboard/seeker/saved-jobs" },
  ];

  return (
    <nav className="flex flex-col pt-6">
      {navItems.map((item) => {
        const isActive =
          item.path === "/dashboard/seeker"
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
