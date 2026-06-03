export function EmailPreview({ content }: { content: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 text-sm text-text-secondary">
      {content}
    </div>
  );
}
