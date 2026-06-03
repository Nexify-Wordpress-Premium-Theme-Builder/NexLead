import type { MeetingBrief } from "@shared/types/meeting";

export function MeetingBriefCard({ brief }: { brief: MeetingBrief }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-sm text-text-primary">{brief.summary}</p>
    </div>
  );
}
