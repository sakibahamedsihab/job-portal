import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import SidebarNav from "@/components/dashboard/SeekerSidebar";

export default async function SeekerLayout({ children }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if (session.user.role === "recruiter") {
    redirect("/dashboard/recruiter");
  }

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="w-64 border-r border-gray-200 flex flex-col bg-white">
        <div className="p-8 border-b border-gray-200">
          <h2 className="text-xl font-extrabold text-black uppercase tracking-widest">
            Dashboard
          </h2>
        </div>
        <SidebarNav />
      </aside>

      <main className="flex-1 bg-white relative">{children}</main>
    </div>
  );
}
