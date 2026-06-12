export default function AuditReportLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-6">
      <div className="h-40 rounded-2xl border border-border bg-surface" />
      <div className="h-32 rounded-2xl border border-border bg-surface" />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <div className="h-64 rounded-2xl border border-border bg-surface" />
          <div className="h-48 rounded-2xl border border-border bg-surface" />
        </div>
        <div className="space-y-6">
          <div className="h-48 rounded-2xl border border-border bg-surface" />
          <div className="h-56 rounded-2xl border border-border bg-surface" />
        </div>
      </div>
    </div>
  );
}
