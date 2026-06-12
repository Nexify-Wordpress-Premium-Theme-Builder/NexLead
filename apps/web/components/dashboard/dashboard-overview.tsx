import Link from "next/link";

import { AnimatedNumber } from "@/components/dashboard/animated-number";
import { DashboardEmptyPanel } from "@/components/dashboard/dashboard-empty-panel";
import { DashboardLineChart } from "@/components/dashboard/dashboard-line-chart";
import { DashboardPreviewBanner } from "@/components/dashboard/dashboard-preview-banner";
import { DashboardStat } from "@/components/dashboard/dashboard-stat";
import { IconActivity, IconFileText, IconGlobe, IconUsers } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import type { DashboardOverview } from "@/features/dashboard/dashboard.types";
import { formatWebsiteDate } from "@/features/websites/website.utils";

type DashboardOverviewProps = {
  data: DashboardOverview;
};

const TYPE_LABELS = { lead: "Lead", website: "Web Sitesi", audit: "Analiz" } as const;

export function DashboardOverview({ data }: DashboardOverviewProps) {
  const { kpis, trends, display, scoreSummary, isFullyEmpty, previewFields = [], recentActivity } = data;

  return (
    <div className="nx-page space-y-6">
      <PageHeader
        title="Genel Bakış"
        description="Lead pipeline'ınızı, web site analizlerinizi ve öncelikli aksiyonlarınızı tek ekrandan yönetin."
        badge={<DashboardPreviewBanner fields={previewFields} />}
        actions={
          <Link href="/dashboard/websites">
            <Button type="button">Yeni Analiz Başlat</Button>
          </Link>
        }
      />

      {isFullyEmpty ? <DashboardEmptyPanel /> : null}

      <div className="nx-stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DashboardStat
          label="Toplam Lead"
          value={kpis.totalLeads}
          hint="Çalışma alanındaki kayıtlar"
          icon={<IconUsers className="h-[18px] w-[18px]" strokeWidth={2} />}
        />
        <DashboardStat
          label="Aktif Web Sitesi"
          value={kpis.activeWebsites}
          hint="Analiz için kayıtlı"
          icon={<IconGlobe className="h-[18px] w-[18px]" strokeWidth={2} />}
        />
        <DashboardStat
          label="Tamamlanan Analiz"
          value={kpis.completedAudits}
          hint="Rapor oluşturulan"
          icon={<IconFileText className="h-[18px] w-[18px]" strokeWidth={2} />}
        />
        <DashboardStat
          label="Ortalama Skor"
          value={kpis.averageScore ?? 0}
          displayValue={kpis.averageScore !== null ? undefined : "—"}
          hint={kpis.pendingAudits > 0 ? `${kpis.pendingAudits} analiz bekliyor` : "Tüm analizler güncel"}
          icon={<IconActivity className="h-[18px] w-[18px]" strokeWidth={2} />}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <Card padding="lg" className="xl:col-span-8">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="nx-section-title">Performans Trendi</h2>
              <p className="nx-section-desc">Lead, site ve analiz hareketleri</p>
            </div>
          </div>
          <DashboardLineChart
            labels={trends.labels}
            series={[
              { label: "Leadler", values: trends.leads, color: "#4F46E5" },
              { label: "Web Siteleri", values: trends.websites, color: "#6366F1" },
              { label: "Analizler", values: trends.audits, color: "#059669" },
            ]}
          />
        </Card>

        <div className="flex flex-col gap-4 xl:col-span-4">
          <Card padding="md">
            <h2 className="nx-section-title">Analiz Sağlığı</h2>
            <p className="nx-section-desc">Genel skor ve kritik bulgular</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-surface-soft p-4">
                <p className="text-[12px] font-semibold text-text-muted">Ortalama Skor</p>
                <p className="mt-1 text-[28px] font-bold tabular-nums text-text-primary">
                  {scoreSummary.averageScore !== null ? (
                    <AnimatedNumber value={scoreSummary.averageScore} />
                  ) : (
                    "—"
                  )}
                </p>
              </div>
              <div className="rounded-xl bg-surface-soft p-4">
                <p className="text-[12px] font-semibold text-text-muted">Kritik Bulgu</p>
                <p className="mt-1 text-[28px] font-bold tabular-nums text-error">
                  <AnimatedNumber value={kpis.criticalFindings} />
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {display.insights.slice(0, 3).map((insight) => (
                <div
                  key={insight.id}
                  className="rounded-xl border bg-surface-soft px-3 py-2.5"
                  style={{ borderColor: "var(--nx-border)" }}
                >
                  <p className="text-[13px] font-semibold text-text-primary">{insight.title}</p>
                  <p className="mt-0.5 text-[12px] font-medium text-text-muted">{insight.description}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="md">
            <h2 className="nx-section-title">Hızlı Aksiyonlar</h2>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href="/dashboard/leads"
                className="rounded-xl border px-4 py-3 text-[14px] font-semibold text-text-primary transition-colors hover:bg-surface-soft"
                style={{ borderColor: "var(--nx-border)" }}
              >
                Lead ekle veya yönet
              </Link>
              <Link
                href="/dashboard/websites"
                className="rounded-xl border px-4 py-3 text-[14px] font-semibold text-text-primary transition-colors hover:bg-surface-soft"
                style={{ borderColor: "var(--nx-border)" }}
              >
                Web sitesi analizi başlat
              </Link>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card padding="none" className="overflow-hidden">
          <div className="border-b px-5 py-4" style={{ borderColor: "var(--nx-border)" }}>
            <h2 className="nx-section-title">Son Leadler</h2>
          </div>
          <ul>
            {display.leadTableRows.slice(0, 5).map((row, index) => (
              <li
                key={row.id}
                className="nx-row-enter flex items-center justify-between gap-3 border-b px-5 py-3.5 last:border-b-0"
                style={{ borderColor: "var(--nx-border)", animationDelay: `${index * 0.05}s` }}
              >
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-text-primary">{row.companyName}</p>
                  <p className="truncate text-[12px] font-medium text-text-muted">{row.website}</p>
                </div>
                <span className="nx-badge bg-accent-soft text-accent">{row.statusLabel}</span>
              </li>
            ))}
          </ul>
          <div className="border-t px-5 py-3" style={{ borderColor: "var(--nx-border)" }}>
            <Link href="/dashboard/leads" className="text-[14px] font-semibold text-accent hover:text-accent-hover">
              Tüm leadleri gör →
            </Link>
          </div>
        </Card>

        <Card padding="none" className="overflow-hidden">
          <div className="border-b px-5 py-4" style={{ borderColor: "var(--nx-border)" }}>
            <h2 className="nx-section-title">Son Aktiviteler</h2>
          </div>
          <ul>
            {recentActivity.slice(0, 5).map((item, index) => (
              <li
                key={item.id}
                className="nx-row-enter border-b px-5 py-3.5 last:border-b-0"
                style={{ borderColor: "var(--nx-border)", animationDelay: `${index * 0.05}s` }}
              >
                <p className="text-[14px] font-semibold text-text-primary">{item.title}</p>
                <p className="mt-0.5 text-[12px] font-medium text-text-muted">
                  {TYPE_LABELS[item.type]} · {item.subtitle} · {formatWebsiteDate(item.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
