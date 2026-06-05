import { LeadsPageContent } from "@/components/leads/leads-page-content";
import { PageHeader } from "@/components/layout/page-header";

export default function LeadsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        className="animate-fade-up"
        title="Potansiyel Müşteriler"
        description="Müşteri kazanımı fırsatlarınızı yönetin, puanlayın ve önceliklendirin."
      />
      <LeadsPageContent />
    </div>
  );
}
