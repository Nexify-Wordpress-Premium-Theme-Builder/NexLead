export function ReportCard({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="font-medium text-text-primary">{title}</p>
    </div>
  );
}
