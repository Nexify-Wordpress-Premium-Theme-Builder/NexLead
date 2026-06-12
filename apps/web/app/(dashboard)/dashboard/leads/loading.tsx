export default function LeadsLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-9 w-40 rounded-lg bg-surface-soft" />
        <div className="h-10 w-32 rounded-lg bg-surface-soft" />
      </div>
      <div className="mt-8 h-[28rem] rounded-2xl border border-border bg-surface" />
    </div>
  );
}
