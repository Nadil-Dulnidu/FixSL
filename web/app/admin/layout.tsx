import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ShieldAlert } from "lucide-react";
import { logger } from "@/lib/logger";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, sessionClaims } = await auth();

  // Redirect to sign-in if not authenticated
  if (!userId) {
    redirect("/sign-in");
  }

  // Check for admin role in public metadata
  const role = (sessionClaims?.metadata as Record<string, unknown>)?.role;

  if (role !== "admin") {
    logger.warn("Unauthorized admin layout access", { userId, role });

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090d16]">
        <div className="clay-card p-10 max-w-md text-center space-y-5">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-red-500/15 flex items-center justify-center border border-red-500/30">
            <ShieldAlert className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Access Denied</h1>
          <p className="text-slate-400 leading-relaxed">
            You don&apos;t have permission to access the admin panel. Please
            contact the system administrator if you believe this is an error.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors text-sm font-medium"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#090d16] overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 pt-18 sm:pt-18 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
