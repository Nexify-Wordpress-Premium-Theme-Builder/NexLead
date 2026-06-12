import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="nx-page space-y-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-5 w-full max-w-xl" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-12">
        <Skeleton className="h-80 xl:col-span-8" />
        <Skeleton className="h-80 xl:col-span-4" />
      </div>
    </div>
  );
}
