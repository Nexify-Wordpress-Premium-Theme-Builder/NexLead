import Link from "next/link";

import { AnimatedNumber } from "@/components/dashboard/animated-number";
import { DashboardEmptyPanel } from "@/components/dashboard/dashboard-empty-panel";
import { DashboardLineChart } from "@/components/dashboard/dashboard-line-chart";
import { DashboardPreviewBanner } from "@/components/dashboard/dashboard-preview-banner";
import { DashboardStat } from "@/components/dashboard/dashboard-stat";
import { AuditStatusBadge } from "@/components/websites/audit-status-badge";
import { LeadStatusBadge } from "@/components/leads/lead-status-badge";
import {
  IconActivity,
  IconAlertTriangle,
  IconClock,
  IconFileText,
  IconGlobe,
  IconUsers,
} from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import type { DashboardOverview } from "@/features/dashboard/dashboard.types";
import { getAuditReportPath } from "@/features/reports/report.utils";
import { formatWebsiteDate } from "@/features/websites/website.utils";

type DashboardOverviewProps = {
  data: DashboardOverview;
};

const TYPE_LABELS = { lead: "Lead", website: "Web Sitesi", audit: "Analiz" } as const;

export function DashboardOverview({ data }: DashboardOverviewProps) {
  const {
    kpis,
    trends,
    display,
    scoreSummary,
    isFullyEmpty,
    previewFields = [],
    recentActivity,
    recentLeads,
    recentWebsites,
    recentAudits,
  } = data;

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

      <div className="nx-stagger grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <DashboardStat
          label="Toplam Lead"
          value={kpis.totalLeads}
          hint="Kayıtlı lead"
          iconTone="blue"
          icon={<IconUsers size={22} />}
        />
        <DashboardStat
          label="Aktif Web Sitesi"
          value={kpis.activeWebsites}
          hint="Analiz için kayıtlı"
          iconTone="cyan"
          icon={<IconGlobe size={22} />}
        />
        <DashboardStat
          label="Tamamlanan Analiz"
          value={kpis.completedAudits}
          hint="Rapor oluşturulan"
          iconTone="violet"
          icon={<IconFileText size={22} />}
        />
        <DashboardStat
          label="Bekleyen Analiz"
          value={kpis.pendingAudits}
          hint="Kuyruk veya çalışıyor"
          iconTone="amber"
          icon={<IconClock size={22} />}
        />
        <DashboardStat
          label="Ortalama Skor"
          value={kpis.averageScore ?? 0}
          displayValue={kpis.averageScore !== null ? undefined : "—"}
          hint={`${scoreSummary.scoredAuditCount} ölçümlü analiz`}
          iconTone="green"
          icon={<IconActivity size={22} />}
        />
        <DashboardStat
          label="Kritik Bulgu"
          value={kpis.criticalFindings}
          hint="Acil aksiyon gerektiren"
          iconTone="red"
          icon={<IconAlertTriangle size={22} />}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <Card padding="lg" className="xl:col-span-8">
          <div className="mb-5">
            <h2 className="nx-section-title">Performans Trendi</h2>
            <p className="nx-section-desc">Lead, site ve analiz hareketleri</p>
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
            <p className="nx-section-desc">Genel skor ve öncelikli içgörüler</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border bg-surface-soft p-4" style={{ borderColor: "var(--nx-border)" }}>
                <p className="text-[12px] font-semibold text-text-muted">Ortalama Skor</p>
                <p className="mt-1 text-[28px] font-extrabold tabular-nums text-text-primary">
                  {scoreSummary.averageScore !== null ? (
                    <AnimatedNumber value={scoreSummary.averageScore} />
                  ) : (
                    "—"
                  )}
                </p>
              </div>
              <div className="rounded-xl border bg-surface-soft p-4" style={{ borderColor: "var(--nx-border)" }}>
                <p className="text-[12px] font-semibold text-text-muted">Kritik Bulgu</p>
                <p className="mt-1 text-[28px] font-extrabold tabular-nums text-error">
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
              <Link
                href="/dashboard/reports"
                className="rounded-xl border px-4 py-3 text-[14px] font-semibold text-text-primary transition-colors hover:bg-surface-soft"
                style={{ borderColor: "var(--nx-border)" }}
              >
                Tamamlanan raporları gör
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
            {recentLeads.length === 0 ? (
              <li className="px-5 py-6 text-[13px] font-medium text-text-muted">Henüz lead kaydı yok.</li>
            ) : (
              recentLeads.slice(0, 5).map((lead, index) => (
                <li
                  key={lead.id}
                  className="nx-row-enter flex items-center justify-between gap-3 border-b px-5 py-3.5 last:border-b-0"
                  style={{ borderColor: "var(--nx-border)", animationDelay: `${index * 0.05}s` }}
                >
                  <div className="min-w-0">
                    <Link href={`/dashboard/leads/${lead.id}`} className="truncate text-[14px] font-semibold text-text-primary hover:text-accent">
                      {lead.companyName}
                    </Link>
                    <p className="truncate text-[12px] font-medium text-text-muted">{lead.normalizedDomain ?? "—"}</p>
                  </div>
                  <LeadStatusBadge status={lead.status} />
                </li>
              ))
            )}
          </ul>
          <div className="border-t px-5 py-3" style={{ borderColor: "var(--nx-border)" }}>
            <Link href="/dashboard/leads" className="text-[14px] font-semibold text-accent hover:text-accent-hover">
              Tüm leadleri gör →
            </Link>
          </div>
        </Card>

        <Card padding="none" className="overflow-hidden">
          <div className="border-b px-5 py-4" style={{ borderColor: "var(--nx-border)" }}>
            <h2 className="nx-section-title">Son Web Siteleri</h2>
          </div>
          <ul>
            {recentWebsites.slice(0, 5).map((website, index) => (
              <li
                key={website.id}
                className="nx-row-enter flex items-center justify-between gap-3 border-b px-5 py-3.5 last:border-b-0"
                style={{ borderColor: "var(--nx-border)", animationDelay: `${index * 0.05}s` }}
              >
                <div className="min-w-0">
                  <Link href={`/dashboard/websites/${website.id}`} className="truncate text-[14px] font-semibold text-text-primary hover:text-accent">
                    {website.label}
                  </Link>
                  <p className="truncate text-[12px] font-medium text-text-muted">{website.leadCompanyName ?? "Bağlı lead yok"}</p>
                </div>
                <AuditStatusBadge status={website.latestAuditStatus} />
              </li>
            ))}
          </ul>
          <div className="border-t px-5 py-3" style={{ borderColor: "var(--nx-border)" }}>
            <Link href="/dashboard/websites" className="text-[14px] font-semibold text-accent hover:text-accent-hover">
              Tüm siteleri gör →
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card padding="none" className="overflow-hidden">
          <div className="border-b px-5 py-4" style={{ borderColor: "var(--nx-border)" }}>
            <h2 className="nx-section-title">Son Analizler</h2>
          </div>
          <ul>
            {recentAudits.slice(0, 5).map((audit, index) => (
              <li
                key={audit.id}
                className="nx-row-enter flex items-center justify-between gap-3 border-b px-5 py-3.5 last:border-b-0"
                style={{ borderColor: "var(--nx-border)", animationDelay: `${index * 0.05}s` }}
              >
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-text-primary">{audit.websiteLabel}</p>
                  <p className="mt-0.5 text-[12px] font-medium text-text-muted">
                    {formatWebsiteDate(audit.completedAt ?? audit.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <AuditStatusBadge status={audit.status} />
                  {audit.status === "completed" ? (
                    <Link href={getAuditReportPath(audit.id)} className="text-[13px] font-semibold text-accent">
                      Rapor
                    </Link>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t px-5 py-3" style={{ borderColor: "var(--nx-border)" }}>
            <Link href="/dashboard/reports" className="text-[14px] font-semibold text-accent hover:text-accent-hover">
              Tüm raporları gör →
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
                {item.href ? (
                  <Link href={item.href} className="text-[14px] font-semibold text-text-primary hover:text-accent">
                    {item.title}
                  </Link>
                ) : (
                  <p className="text-[14px] font-semibold text-text-primary">{item.title}</p>
                )}
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
