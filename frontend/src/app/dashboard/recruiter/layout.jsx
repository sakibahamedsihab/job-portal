// src/app/dashboard/recruiter/layout.jsx
// এখানে আর "use client" নেই, এটি এখন একটি পিওর সার্ভার কম্পোনেন্ট!

import SidebarNav from "@/components/dashboard/SidebarNav";

export default function RecruiterLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* ⬛ Left Sidebar */}
      <aside className="w-64 border-r border-gray-200 flex flex-col bg-white">
        {/* Sidebar Header */}
        <div className="p-8 border-b border-gray-200">
          <h2 className="text-xl font-extrabold text-black uppercase tracking-widest">
            Dashboard
          </h2>
        </div>

        {/* Client Component for Navigation */}
        <SidebarNav />
      </aside>

      {/* ⬜ Right Main Content Area */}
      <main className="flex-1 bg-white relative">{children}</main>
    </div>
  );
}
