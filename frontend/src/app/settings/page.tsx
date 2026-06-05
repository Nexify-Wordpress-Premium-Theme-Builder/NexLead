import { SettingsPageContent } from "@/components/settings/settings-page-content";
import { PageHeader } from "@/components/layout/page-header";

export default function SettingsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        className="animate-fade-up"
        title="Ayarlar"
        description="Profilinizi, çalışma alanınızı, outreach tercihlerinizi ve entegrasyonları yönetin."
      />
      <SettingsPageContent />
    </div>
  );
}
