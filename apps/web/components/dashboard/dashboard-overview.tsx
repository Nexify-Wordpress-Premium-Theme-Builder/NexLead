import {
  IconAlertTriangle,
  IconCheckCircle,
  IconClock,
  IconGlobe,
  IconUsers,
} from "@/components/ui/icons";
import { AnalysisSummaryCard } from "@/components/dashboard/analysis-summary-card";
import { DashboardEmptyPanel } from "@/components/dashboard/dashboard-empty-panel";
import { DashboardLineChart } from "@/components/dashboard/dashboard-line-chart";
import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { MetricCard } from "@/components/dashboard/metric-card";
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";
import { RecentAuditsCard } from "@/components/dashboard/recent-audits-card";
import { RecentLeadsCard } from "@/components/dashboard/recent-leads-card";
import { RecentWebsitesCard } from "@/components/dashboard/recent-websites-card";
import type { DashboardOverview } from "@/features/dashboard/dashboard.types";

type DashboardOverviewProps = {
  data: DashboardOverview;
};

export function DashboardOverview({ data }: DashboardOverviewProps) {
  const { kpis, trends, workspaceName, isFullyEmpty } = data;

  return (
    <div className="dashboard-page-enter mx-auto max-w-7xl">
      <div className="dashboard-stagger-item">
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-text-primary">Genel Bakış</h1>
        <p className="mt-2 max-w-2xl text-sm text-text-secondary sm:text-base">
          Lead, web sitesi ve analiz performansınızı tek ekrandan izleyin.
        </p>
        <p className="mt-3 text-sm text-text-muted">
          Aktif çalışma alanı:{" "}
          <span className="font-medium text-text-secondary">{workspaceName}</span>
        </p>
      </div>

      {isFullyEmpty ? (
        <div className="dashboard-stagger-item mt-8">
          <DashboardEmptyPanel />
        </div>
      ) : null}

      <div className="dashboard-stagger mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <MetricCard
          icon={<IconUsers className="h-5 w-5" />}
          label="Toplam Lead"
          value={kpis.totalLeads}
          description="Çalışma alanınızdaki aktif lead sayısı"
          sparkline={trends.leads}
          accentClassName="bg-accent/10 text-accent"
        />
        <MetricCard
          icon={<IconGlobe className="h-5 w-5" />}
          label="Web Siteleri"
          value={kpis.activeWebsites}
          description="Takip edilen web sitesi kayıtları"
          sparkline={trends.websites}
          accentClassName="bg-accent-purple/10 text-accent-purple"
        />
        <MetricCard
          icon={<IconCheckCircle className="h-5 w-5" />}
          label="Tamamlanan Analiz"
          value={kpis.completedAudits}
          description="Tamamlanan analiz kayıtları"
          sparkline={trends.audits}
          accentClassName="bg-success/10 text-success"
        />
        <MetricCard
          icon={<IconClock className="h-5 w-5" />}
          label="Bekleyen Analiz"
          value={kpis.pendingAudits}
          description="Kuyrukta veya çalışan analizler"
          accentClassName="bg-warning/10 text-warning"
        />
        <MetricCard
          icon={<IconCheckCircle className="h-5 w-5" />}
          label="Ortalama Skor"
          value={kpis.averageScore ?? 0}
          displayValue={kpis.averageScore !== null ? undefined : "—"}
          description="Tamamlanan analizlerin ortalama skoru"
          accentClassName="bg-accent/10 text-accent"
        />
        <MetricCard
          icon={<IconAlertTriangle className="h-5 w-5" />}
          label="Kritik Bulgu"
          value={kpis.criticalFindings}
          description="Kritik ve yüksek önemdeki bulgular"
          accentClassName="bg-error/10 text-error"
        />
      </div>

      <div className="dashboard-stagger mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="dashboard-stagger-item">
          <DashboardSection
            title="Lead & Analiz Performansı"
            description="Son 14 günlük kayıt trendleri"
          >
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft sm:p-6">
              <DashboardLineChart
                labels={trends.labels}
                series={[
                  { label: "Lead", values: trends.leads, color: "#2563EB" },
                  { label: "Web Sitesi", values: trends.websites, color: "#7C3AED" },
                  { label: "Analiz", values: trends.audits, color: "#16A34A" },
                ]}
              />
            </div>
          </DashboardSection>
        </div>

        <div className="dashboard-stagger-item">
          <AnalysisSummaryCard
            scoreSummary={data.scoreSummary}
            severitySummary={data.severitySummary}
          />
        </div>
      </div>

      <div className="dashboard-stagger-item mt-8">
        <RecentActivityCard items={data.recentActivity} />
      </div>

      <div className="dashboard-stagger mt-8 grid gap-6 lg:grid-cols-2">
        <div className="dashboard-stagger-item">
          <RecentLeadsCard leads={data.recentLeads} />
        </div>
        <div className="dashboard-stagger-item">
          <RecentWebsitesCard websites={data.recentWebsites} />
        </div>
      </div>

      <div className="dashboard-stagger-item mt-6">
        <RecentAuditsCard audits={data.recentAudits} />
      </div>
    </div>
  );
}
