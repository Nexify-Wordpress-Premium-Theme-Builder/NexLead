import { MeetingsPageContent } from "@/components/meetings/meetings-page-content";
import { PageHeader } from "@/components/layout/page-header";

export default function MeetingsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        className="animate-fade-up"
        title="Meetings"
        description="Review booked meetings and prepare with lead-specific opportunity briefs."
      />
      <MeetingsPageContent />
    </div>
  );
}
