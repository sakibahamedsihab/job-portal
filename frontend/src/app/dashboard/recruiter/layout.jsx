// src/app/dashboard/recruiter/layout.jsx
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import SidebarNav from "@/components/dashboard/SidebarNav";

export default async function RecruiterLayout({ children }) {
  // Read the session server-side using Better Auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Not logged in → send to login page
  if (!session) {
    redirect("/login");
  }

  // Wrong role (seeker visiting recruiter dashboard) → send to their dashboard
  if (session.user.role === "seeker") {
    redirect("/dashboard/seeker");
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-gray-200 flex flex-col bg-white">
        <div className="p-8 border-b border-gray-200">
          <h2 className="text-xl font-extrabold text-black uppercase tracking-widest">
            Dashboard
          </h2>
        </div>
        <SidebarNav />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white relative">{children}</main>
    </div>
  );
}
