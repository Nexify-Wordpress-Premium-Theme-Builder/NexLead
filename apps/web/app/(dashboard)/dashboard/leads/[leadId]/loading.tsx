export default function LeadDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse">
      <div className="h-5 w-32 rounded-lg bg-surface-soft" />
      <div className="mt-6 h-10 w-64 max-w-full rounded-lg bg-surface-soft" />
      <div className="mt-3 h-6 w-24 rounded-full bg-surface-soft" />
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="h-72 rounded-2xl border border-border bg-surface" />
          <div className="h-48 rounded-2xl border border-border bg-surface" />
        </div>
        <div className="h-80 rounded-2xl border border-border bg-surface" />
      </div>
    </div>
  );
}
