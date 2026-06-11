export default function WebsiteDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse">
      <div className="h-5 w-48 rounded-lg bg-surface-soft" />
      <div className="mt-6 h-10 w-full max-w-xl rounded-lg bg-surface-soft" />
      <div className="mt-3 flex gap-2">
        <div className="h-6 w-24 rounded-full bg-surface-soft" />
        <div className="h-6 w-28 rounded-full bg-surface-soft" />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="h-72 rounded-2xl border border-border bg-surface" />
          <div className="h-48 rounded-2xl border border-border bg-surface" />
        </div>
        <div className="h-96 rounded-2xl border border-border bg-surface" />
      </div>
    </div>
  );
}
