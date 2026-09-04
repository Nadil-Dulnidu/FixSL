import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Skeleton className="h-7 w-40 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="clay-card p-5 border-l-4 border-l-slate-800 flex items-start gap-4">
            <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-12" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Issues */}
      <div className="clay-card overflow-hidden">
        <div className="p-5 border-b border-slate-800/60">
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="divide-y divide-slate-800/40">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <Skeleton className="h-7 w-20 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
