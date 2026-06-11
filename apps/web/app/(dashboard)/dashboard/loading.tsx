export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse">
      <div className="h-9 w-48 rounded-lg bg-surface-soft" />
      <div className="mt-3 h-5 w-full max-w-xl rounded-lg bg-surface-soft" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 rounded-2xl border border-border bg-surface" />
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="h-72 rounded-2xl border border-border bg-surface" />
        <div className="h-72 rounded-2xl border border-border bg-surface" />
      </div>
      <div className="mt-6 h-64 rounded-2xl border border-border bg-surface" />
    </div>
  );
}
