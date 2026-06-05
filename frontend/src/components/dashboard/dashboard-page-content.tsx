"use client";

import { useMemo, useState } from "react";
import { DashboardChart } from "@/components/dashboard/dashboard-chart";
import { MetricCard } from "@/components/dashboard/metric-card";
import { OutreachPipeline } from "@/components/dashboard/outreach-pipeline";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { TopOpportunityLeads } from "@/components/dashboard/top-opportunity-leads";
import { UpcomingMeetings } from "@/components/dashboard/upcoming-meetings";
import { WebsiteAuditInsights } from "@/components/dashboard/website-audit-insights";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { LoadingButtonState } from "@/components/ui/loading-state";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { mockDashboardKpis } from "@/data/mock-dashboard";
import { useDemoData } from "@/hooks/use-demo-data";
import { useToast } from "@/hooks/use-toast";

const kpiDelays = [
  "animation-delay-100",
  "animation-delay-200",
  "animation-delay-300",
  "animation-delay-400",
] as const;

function getRandomDelay() {
  return 800 + Math.floor(Math.random() * 701);
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function DashboardPageContent() {
  const { addCampaign } = useDemoData();
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    industry: "SaaS",
    location: "Türkiye",
    goal: "Görüşme Planla",
  });

  const canSubmit = useMemo(() => formState.name.trim().length > 2, [formState.name]);

  const handleCreateCampaign = async () => {
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    await wait(getRandomDelay());

    const campaign = addCampaign({
      name: `${formState.name.trim()} · ${formState.goal}`,
      leadCount: 40 + Math.floor(Math.random() * 160),
      replyRate: 8 + Math.floor(Math.random() * 21),
      status: "draft",
    });

    setIsSubmitting(false);
    setIsModalOpen(false);
    setFormState({
      name: "",
      industry: "SaaS",
      location: "Türkiye",
      goal: "Görüşme Planla",
    });

    toast.success(
      "Kampanya oluşturuldu",
      `${campaign.name}, ${formState.location} bölgesindeki ${formState.industry} müşterileri için hazır.`,
    );
  };

  return (
    <div className="space-y-5">
      <PageHeader
        className="animate-fade-up"
        title="Panel"
        description="Potansiyel müşterileri, site analizlerini, iletişimleri ve fırsatları tek yerden takip edin."
        action={
          <button
            type="button"
            className="btn-campaign inline-flex items-center justify-center"
            onClick={() => setIsModalOpen(true)}
          >
            + Yeni Kampanya
          </button>
        }
      />

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {mockDashboardKpis.map((metric, index) => (
          <MetricCard key={metric.id} metric={metric} className={kpiDelays[index]} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DashboardChart className="animation-delay-450" />
        </div>
        <TopOpportunityLeads className="animation-delay-500" />
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <WebsiteAuditInsights className="animation-delay-450" />
        <OutreachPipeline className="animation-delay-500" />
        <UpcomingMeetings className="animation-delay-600" />
      </section>

      <RecentActivity className="animation-delay-600" />

      <Modal
        open={isModalOpen}
        onClose={() => (isSubmitting ? undefined : setIsModalOpen(false))}
        title="Yeni Kampanya Oluştur"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
            >
              İptal
            </button>
            <button
              type="button"
              className="btn-campaign inline-flex h-10 items-center justify-center px-4 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleCreateCampaign}
              disabled={!canSubmit || isSubmitting}
            >
              <LoadingButtonState isLoading={isSubmitting} loadingText="Oluşturuluyor...">
                Kampanya Oluştur
              </LoadingButtonState>
            </button>
          </>
        }
      >
        <div className="grid gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-muted">Kampanya Adı</label>
            <Input
              value={formState.name}
              onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
              placeholder="Q3 Web Dönüşüm Sprinti"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Sektör</label>
              <Select
                value={formState.industry}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, industry: event.target.value }))
                }
                options={[
                  { label: "SaaS", value: "SaaS" },
                  { label: "Sağlık", value: "Sağlık" },
                  { label: "Danışmanlık", value: "Danışmanlık" },
                  { label: "Gayrimenkul", value: "Gayrimenkul" },
                ]}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Konum</label>
              <Select
                value={formState.location}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, location: event.target.value }))
                }
                options={[
                  { label: "Türkiye", value: "Türkiye" },
                  { label: "Avrupa", value: "Avrupa" },
                  { label: "MENA", value: "MENA" },
                  { label: "Küresel", value: "Küresel" },
                ]}
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-muted">Hedef</label>
            <Select
              value={formState.goal}
              onChange={(event) => setFormState((current) => ({ ...current, goal: event.target.value }))}
              options={[
                { label: "Görüşme Planla", value: "Görüşme Planla" },
                { label: "Analiz Teklifi Gönder", value: "Analiz Teklifi Gönder" },
                { label: "Mevcut Müşteriye Ek Satış", value: "Mevcut Müşteriye Ek Satış" },
              ]}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
