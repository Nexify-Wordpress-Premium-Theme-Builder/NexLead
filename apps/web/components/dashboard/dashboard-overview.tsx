import {
  IconAlertTriangle,
  IconClock,
  IconFileText,
  IconGlobe,
  IconTarget,
  IconUsers,
} from "@/components/ui/icons";
import { AnalysisInsightsCard } from "@/components/dashboard/analysis-insights-card";
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
import { PremiumCard } from "@/components/ui/premium-card";
import type { DashboardOverview } from "@/features/dashboard/dashboard.types";

type DashboardOverviewProps = {
  data: DashboardOverview;
};

const ICON_CLASS = "h-[22px] w-[22px]";

export function DashboardOverview({ data }: DashboardOverviewProps) {
  const { kpis, trends, display, scoreSummary, isFullyEmpty, previewFields = [] } = data;

  return (
    <div className="dashboard-page-enter w-full max-w-[1520px]">
      <div className="dashboard-stagger-item flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="dashboard-title">Genel Bakış</h1>
          <p className="dashboard-body mt-2">
            Lead, web sitesi ve analiz performansınızı tek ekrandan izleyin.
          </p>
        </div>
        <DashboardPreviewBanner fields={previewFields} />
      </div>

      {isFullyEmpty ? (
        <div className="dashboard-stagger-item mt-6">
          <DashboardEmptyPanel />
        </div>
      ) : null}

      <div className="dashboard-stagger mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard
          icon={<IconUsers className={ICON_CLASS} strokeWidth={2.2} />}
          label="Bulunan Lead"
          value={kpis.totalLeads}
          trend={display.kpiTrends.leads}
          sparkline={trends.leads}
          sparklineColor="#2563EB"
          accentClassName="bg-[#2563EB]/10 text-[#2563EB]"
        />
        <MetricCard
          icon={<IconGlobe className={ICON_CLASS} strokeWidth={2.2} />}
          label="Analiz Edilen Site"
          value={kpis.activeWebsites}
          trend={display.kpiTrends.websites}
          sparkline={trends.websites}
          sparklineColor="#7C3AED"
          accentClassName="bg-[#7C3AED]/10 text-[#7C3AED]"
        />
        <MetricCard
          icon={<IconFileText className={ICON_CLASS} strokeWidth={2.2} />}
          label="Oluşturulan Rapor"
          value={kpis.completedAudits}
          trend={display.kpiTrends.reports}
          sparkline={trends.reports}
          sparklineColor="#16A34A"
          accentClassName="bg-[#16A34A]/10 text-[#16A34A]"
        />
        <MetricCard
          icon={<IconClock className={ICON_CLASS} strokeWidth={2.2} />}
          label="Bekleyen Analiz"
          value={kpis.pendingAudits}
          trend={display.kpiTrends.pending}
          accentClassName="bg-[#F97316]/10 text-[#F97316]"
        />
        <MetricCard
          icon={<IconTarget className={ICON_CLASS} strokeWidth={2.2} />}
          label="Ortalama Skor"
          value={kpis.averageScore ?? 0}
          displayValue={kpis.averageScore !== null ? undefined : "—"}
          trend={display.kpiTrends.score}
          accentClassName="bg-[#0891B2]/10 text-[#0891B2]"
        />
        <MetricCard
          icon={<IconAlertTriangle className={ICON_CLASS} strokeWidth={2.2} />}
          label="Kritik Bulgu"
          value={kpis.criticalFindings}
          trend={display.kpiTrends.critical}
          accentClassName="bg-[#DC2626]/10 text-[#DC2626]"
        />
      </div>

      <div className="dashboard-stagger mt-5 grid gap-4 xl:grid-cols-12">
        <div className="dashboard-stagger-item xl:col-span-8">
          <PremiumCard padding="chart" className="min-h-[420px]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="dashboard-section-title">Lead &amp; Analiz Performansı</h2>
                <p className="dashboard-body mt-1">Son 30 günlük büyüme trendleri</p>
              </div>
              <span
                className="inline-flex h-9 items-center rounded-full border border-[rgba(15,23,42,0.08)] bg-[#F8FAFC] px-4 text-[12px] font-bold text-[#475569]"
                aria-disabled="true"
              >
                Günlük
              </span>
            </div>
            <div className="mt-5">
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
          </PremiumCard>
        </div>

        <div className="dashboard-stagger-item dashboard-right-panel space-y-4 xl:col-span-4">
          <AnalysisSummaryCard circularScores={display.circularScores} scoreSummary={scoreSummary} />
          <AnalysisInsightsCard insights={display.insights} />
          <AuditFunnelCard steps={display.funnelSteps} />
        </div>
      </div>

      <div className="dashboard-stagger mt-5 grid gap-4 xl:grid-cols-12">
        <div className="dashboard-stagger-item xl:col-span-8">
          <PotentialLeadsTable rows={display.leadTableRows} />
        </div>

        <div className="dashboard-stagger-item space-y-4 xl:col-span-4">
          <RecentActivityCard items={data.recentActivity} compact />
          <UpcomingTasksCard tasks={display.upcomingTasks} />
        </div>
      </div>

      <ManualAnalysisCta />
    </div>
  );
}
