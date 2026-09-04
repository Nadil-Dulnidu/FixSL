import { Suspense } from "react";
import { getAdminIssues } from "@/lib/actions/admin";
import { IssuesTable } from "@/components/admin/issues-table";
import { IssueFilters } from "@/components/admin/issue-filters";
import { AlertTriangle } from "lucide-react";

interface AdminIssuesPageProps {
  searchParams: Promise<{
    status?: string;
    category?: string;
    priority?: string;
  }>;
}

export default async function AdminIssuesPage({ searchParams }: AdminIssuesPageProps) {
  const params = await searchParams;

  const result = await getAdminIssues({
    status: params.status,
    category: params.category,
    priority: params.priority,
  });

  const issues = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          <h1 className="text-2xl font-bold text-white">Issue Management</h1>
        </div>
        <p className="text-slate-400 text-sm">
          View, filter, and manage all reported infrastructure issues
        </p>
      </div>

      {/* Filters */}
      <Suspense fallback={null}>
        <IssueFilters />
      </Suspense>

      {/* Table */}
      <IssuesTable issues={issues} />
    </div>
  );
}
