import { MeetingsPageContent } from "@/components/meetings/meetings-page-content";
import { PageHeader } from "@/components/layout/page-header";

export default function MeetingsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        className="animate-fade-up"
        title="Görüşmeler"
        description="Planlanan görüşmeleri inceleyin ve müşteri özelinde fırsat brifleriyle hazırlanın."
      />
      <MeetingsPageContent />
    </div>
  );
}
