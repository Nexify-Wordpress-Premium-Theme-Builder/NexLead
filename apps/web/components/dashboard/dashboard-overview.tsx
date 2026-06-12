import {
  IconAlertTriangle,
  IconClock,
  IconFileText,
  IconGlobe,
  IconTarget,
  IconUsers,
} from "@/components/ui/icons";
import { AnalysisSummaryCard } from "@/components/dashboard/analysis-summary-card";
import { AuditFunnelCard } from "@/components/dashboard/audit-funnel-card";
import { DashboardEmptyPanel } from "@/components/dashboard/dashboard-empty-panel";
import { DashboardLineChart } from "@/components/dashboard/dashboard-line-chart";
import { DashboardPreviewBanner } from "@/components/dashboard/dashboard-preview-banner";
import { ManualAnalysisCta } from "@/components/dashboard/manual-analysis-cta";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PotentialLeadsTable } from "@/components/dashboard/potential-leads-table";
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";
import { UpcomingTasksCard } from "@/components/dashboard/upcoming-tasks-card";
import type { DashboardOverview } from "@/features/dashboard/dashboard.types";

type DashboardOverviewProps = {
  data: DashboardOverview;
};

export function DashboardOverview({ data }: DashboardOverviewProps) {
  const { kpis, trends, display, scoreSummary, isFullyEmpty, previewFields = [] } = data;

  return (
    <div className="dashboard-page-enter w-full max-w-[1480px]">
      <DashboardPreviewBanner fields={previewFields} />

      <div className="dashboard-stagger-item">
        <h1 className="text-[1.875rem] font-bold tracking-[-0.03em] text-text-primary sm:text-[2rem]">
          Genel Bakış
        </h1>
        <p className="mt-1.5 text-dashboard-body text-text-secondary">
          Lead, web sitesi ve analiz performansınızı tek ekrandan izleyin.
        </p>
      </div>

      {isFullyEmpty ? (
        <div className="dashboard-stagger-item mt-6">
          <DashboardEmptyPanel />
        </div>
      ) : null}

      <div className="dashboard-stagger mt-5 grid grid-cols-2 gap-3.5 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard
          icon={<IconUsers className="h-[18px] w-[18px]" />}
          label="Bulunan Lead"
          value={kpis.totalLeads}
          trend={display.kpiTrends.leads}
          sparkline={trends.leads}
          sparklineColor="#2563EB"
          accentClassName="bg-accent/10 text-accent"
        />
        <MetricCard
          icon={<IconGlobe className="h-[18px] w-[18px]" />}
          label="Analiz Edilen Site"
          value={kpis.activeWebsites}
          trend={display.kpiTrends.websites}
          sparkline={trends.websites}
          sparklineColor="#7C3AED"
          accentClassName="bg-accent-purple/10 text-accent-purple"
        />
        <MetricCard
          icon={<IconFileText className="h-[18px] w-[18px]" />}
          label="Oluşturulan Rapor"
          value={kpis.completedAudits}
          trend={display.kpiTrends.reports}
          sparkline={trends.reports}
          sparklineColor="#16A34A"
          accentClassName="bg-success/10 text-success"
        />
        <MetricCard
          icon={<IconClock className="h-[18px] w-[18px]" />}
          label="Bekleyen Analiz"
          value={kpis.pendingAudits}
          trend={display.kpiTrends.pending}
          accentClassName="bg-warning/10 text-warning"
        />
        <MetricCard
          icon={<IconTarget className="h-[18px] w-[18px]" />}
          label="Ortalama Skor"
          value={kpis.averageScore ?? 0}
          displayValue={kpis.averageScore !== null ? undefined : "—"}
          trend={display.kpiTrends.score}
          accentClassName="bg-[#0891B2]/10 text-[#0891B2]"
        />
        <MetricCard
          icon={<IconAlertTriangle className="h-[18px] w-[18px]" />}
          label="Kritik Bulgu"
          value={kpis.criticalFindings}
          trend={display.kpiTrends.critical}
          accentClassName="bg-error/10 text-error"
        />
      </div>

      <div className="dashboard-stagger mt-5 grid gap-4 xl:grid-cols-12">
        <div className="dashboard-stagger-item xl:col-span-8">
          <div className="rounded-2xl border border-border/90 bg-surface p-4 shadow-soft sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-dashboard-section text-text-heading">Lead &amp; Analiz Performansı</h2>
                <p className="mt-1 text-[12px] font-medium text-text-secondary">
                  Son 14 günlük kayıt trendleri
                </p>
              </div>
              <span
                className="inline-flex h-8 items-center rounded-full border border-border/80 bg-surface-soft px-3.5 text-[11px] font-semibold text-text-secondary shadow-sm"
                aria-disabled="true"
              >
                Günlük
              </span>
            </div>
            <div className="mt-4">
              <DashboardLineChart
                labels={trends.labels}
                series={[
                  { label: "Leadler", values: trends.leads, color: "#2563EB" },
                  { label: "Web Siteleri", values: trends.websites, color: "#7C3AED" },
                  { label: "Analizler", values: trends.audits, color: "#16A34A" },
                  { label: "Raporlar", values: trends.reports, color: "#F97316" },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="dashboard-stagger-item xl:col-span-4">
          <AnalysisSummaryCard
            circularScores={display.circularScores}
            insights={display.insights}
            scoreSummary={scoreSummary}
          />
        </div>
      </div>

      <div className="dashboard-stagger mt-5 grid gap-4 xl:grid-cols-12">
        <div className="dashboard-stagger-item xl:col-span-8">
          <PotentialLeadsTable rows={display.leadTableRows} />
        </div>

        <div className="dashboard-stagger-item space-y-3.5 xl:col-span-4">
          <AuditFunnelCard steps={display.funnelSteps} />
          <RecentActivityCard items={data.recentActivity} compact />
          <UpcomingTasksCard tasks={display.upcomingTasks} />
        </div>
      </div>

      <ManualAnalysisCta />
    </div>
  );
}
