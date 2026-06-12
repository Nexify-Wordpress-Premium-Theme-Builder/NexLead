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
import type { DashboardOverview, DashboardTrendSeries } from "@/features/dashboard/dashboard.types";

type DashboardOverviewProps = {
  data: DashboardOverview;
};

const ICON_CLASS = "h-[24px] w-[24px]";

const SPARKLINE_FALLBACK = {
  pending: [6, 5, 5, 4, 4, 3, 3, 3, 2, 3, 2, 2, 3, 3],
  score: [72, 74, 73, 76, 77, 78, 79, 80, 81, 81, 82, 82, 83, 82],
  critical: [9, 8, 8, 7, 7, 6, 6, 5, 5, 5, 5, 5, 5, 5],
} as const;

function buildChartMetrics(trends: DashboardTrendSeries, kpis: DashboardOverview["kpis"]) {
  const audits = trends.audits;
  const maxValue = Math.max(...audits, 0);
  const peakIndex = audits.indexOf(maxValue);
  const peakDay = trends.labels[peakIndex] ?? "—";
  const completedTotal = audits.reduce((sum, value) => sum + value, 0);

  return [
    { label: "En yüksek gün", value: peakDay },
    { label: "Tamamlanan analiz", value: String(kpis.completedAudits || completedTotal) },
    {
      label: "Ortalama skor",
      value: kpis.averageScore !== null ? String(kpis.averageScore) : "—",
    },
  ];
}

export function DashboardOverview({ data }: DashboardOverviewProps) {
  const { kpis, trends, display, scoreSummary, isFullyEmpty, previewFields = [] } = data;
  const chartMetrics = buildChartMetrics(trends, kpis);

  return (
    <div className="dashboard-page-enter w-full max-w-[1520px]">
      <div className="dashboard-stagger-item flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="dashboard-title">Genel Bakış</h1>
            <DashboardPreviewBanner fields={previewFields} />
          </div>
          <p className="dashboard-body mt-2">
            Lead, web sitesi ve analiz performansınızı tek ekrandan izleyin.
          </p>
        </div>
      </div>

      {isFullyEmpty ? (
        <div className="dashboard-stagger-item mt-5">
          <DashboardEmptyPanel />
        </div>
      ) : null}

      <div className="dashboard-stagger mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard
          icon={<IconUsers className={ICON_CLASS} strokeWidth={2.2} />}
          label="Bulunan Lead"
          value={kpis.totalLeads}
          trend={display.kpiTrends.leads}
          sparkline={trends.leads}
          sparklineColor="#2563EB"
          accentClassName="bg-[#2563EB]/12 text-[#2563EB]"
        />
        <MetricCard
          icon={<IconGlobe className={ICON_CLASS} strokeWidth={2.2} />}
          label="Analiz Edilen Site"
          value={kpis.activeWebsites}
          trend={display.kpiTrends.websites}
          sparkline={trends.websites}
          sparklineColor="#7C3AED"
          accentClassName="bg-[#7C3AED]/12 text-[#7C3AED]"
        />
        <MetricCard
          icon={<IconFileText className={ICON_CLASS} strokeWidth={2.2} />}
          label="Oluşturulan Rapor"
          value={kpis.completedAudits}
          trend={display.kpiTrends.reports}
          sparkline={trends.reports}
          sparklineColor="#16A34A"
          accentClassName="bg-[#16A34A]/12 text-[#16A34A]"
        />
        <MetricCard
          icon={<IconClock className={ICON_CLASS} strokeWidth={2.2} />}
          label="Bekleyen Analiz"
          value={kpis.pendingAudits}
          trend={display.kpiTrends.pending}
          sparkline={[...SPARKLINE_FALLBACK.pending]}
          sparklineColor="#F97316"
          accentClassName="bg-[#F97316]/12 text-[#F97316]"
        />
        <MetricCard
          icon={<IconTarget className={ICON_CLASS} strokeWidth={2.2} />}
          label="Ortalama Skor"
          value={kpis.averageScore ?? 0}
          displayValue={kpis.averageScore !== null ? undefined : "—"}
          trend={display.kpiTrends.score}
          sparkline={[...SPARKLINE_FALLBACK.score]}
          sparklineColor="#0891B2"
          accentClassName="bg-[#0891B2]/12 text-[#0891B2]"
        />
        <MetricCard
          icon={<IconAlertTriangle className={ICON_CLASS} strokeWidth={2.2} />}
          label="Kritik Bulgu"
          value={kpis.criticalFindings}
          trend={display.kpiTrends.critical}
          sparkline={[...SPARKLINE_FALLBACK.critical]}
          sparklineColor="#DC2626"
          accentClassName="bg-[#DC2626]/12 text-[#DC2626]"
        />
      </div>

      <div className="dashboard-stagger mt-4 grid gap-4 xl:grid-cols-12">
        <div className="dashboard-stagger-item xl:col-span-8">
          <PremiumCard padding="chart" radius="chart" className="chart-hero-card min-h-[450px]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="dashboard-section-title">Lead &amp; Analiz Performansı</h2>
                <p className="dashboard-body mt-1">Son 30 günlük büyüme ve analiz trendleri</p>
              </div>
              <span
                className="inline-flex h-10 items-center rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[#F8FAFC] px-4 text-[12px] font-extrabold text-[#475569]"
                aria-disabled="true"
              >
                Günlük
              </span>
            </div>
            <div className="mt-4">
              <DashboardLineChart
                labels={trends.labels}
                metrics={chartMetrics}
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

        <div className="dashboard-stagger-item dashboard-right-panel flex flex-col gap-4 xl:col-span-4">
          <AnalysisSummaryCard
            circularScores={display.circularScores}
            scoreSummary={scoreSummary}
            criticalFindings={kpis.criticalFindings}
          />
          <AnalysisInsightsCard insights={display.insights} />
          <AuditFunnelCard steps={display.funnelSteps} />
        </div>
      </div>

      <div className="dashboard-stagger mt-4 grid gap-4 xl:grid-cols-12">
        <div className="dashboard-stagger-item xl:col-span-8">
          <PotentialLeadsTable rows={display.leadTableRows} />
        </div>

        <div className="dashboard-stagger-item flex flex-col gap-4 xl:col-span-4">
          <RecentActivityCard items={data.recentActivity} compact />
          <UpcomingTasksCard tasks={display.upcomingTasks} />
        </div>
      </div>

      <ManualAnalysisCta />
    </div>
  );
}
