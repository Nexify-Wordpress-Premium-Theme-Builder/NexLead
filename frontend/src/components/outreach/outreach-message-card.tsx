import type { OutreachMessage } from "@shared/types/outreach";

export function OutreachMessageCard({ message }: { message: OutreachMessage }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="font-medium text-text-primary">{message.subject}</p>
      <p className="text-sm text-text-secondary">{message.body}</p>
    </div>
  );
}
