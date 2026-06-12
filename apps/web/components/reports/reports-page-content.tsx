"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { AnimatedNumber } from "@/components/dashboard/animated-number";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FilterPills } from "@/components/ui/filter-pills";
import { IconFileText } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/page-header";
import type { ReportListItem, ReportsListData } from "@/features/reports/reports-list.types";
import { getAuditReportPath } from "@/features/reports/report.utils";
import { formatWebsiteDate } from "@/features/websites/website.utils";

type ReportsPageContentProps = {
  data: ReportsListData;
  isPreview?: boolean;
};

type ScoreFilter = "all" | "critical" | "high";

function ReportScore({ score }: { score: number | null }) {
  if (score === null) return <span className="text-text-muted">—</span>;
  return (
    <span className="font-bold tabular-nums text-text-primary">
      <AnimatedNumber value={score} />
    </span>
  );
}

function ReportRowActions({ item, isPreview }: { item: ReportListItem; isPreview?: boolean }) {
  if (isPreview) {
    return (
      <span className="text-[13px] font-medium text-text-muted" title="Önizleme verisi">
        Önizleme
      </span>
    );
  }

  return (
    <Link href={getAuditReportPath(item.auditId)}>
      <Button type="button" variant="ghost" size="sm">
        Raporu Gör
      </Button>
    </Link>
  );
}

export function ReportsPageContent({ data, isPreview = false }: ReportsPageContentProps) {
  const [search, setSearch] = useState("");
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("all");

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return data.items.filter((item) => {
      if (scoreFilter === "critical" && item.criticalHighCount === 0) return false;
      if (scoreFilter === "high" && (item.overallScore === null || item.overallScore >= 70)) return false;

      if (!query) return true;

      const haystack = [item.websiteLabel, item.leadCompanyName].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }, [data.items, scoreFilter, search]);

  return (
    <div className="nx-page space-y-6">
      <PageHeader
        title="Raporlar"
        description="Tamamlanan web site analiz raporlarınızı görüntüleyin ve öncelikli bulgulara hızlıca ulaşın."
        badge={
          isPreview ? (
            <span className="nx-badge border border-amber-200 bg-amber-50 text-amber-800">Önizleme verisi</span>
          ) : undefined
        }
        actions={
          <Link href="/dashboard/websites">
            <Button type="button" variant="secondary">
              Web Site Analizleri
            </Button>
          </Link>
        }
      />

      <div className="nx-stagger grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Toplam Rapor", value: data.summary.totalReports },
          { label: "Son 30 Gün", value: data.summary.last30Days },
          {
            label: "Ortalama Skor",
            value: data.summary.averageScore,
            display: data.summary.averageScore !== null ? undefined : "—",
          },
          { label: "Kritik Bulgulu", value: data.summary.criticalReports },
        ].map((item) => (
          <Card key={item.label} padding="md">
            <p className="nx-stat-label">{item.label}</p>
            <p className="nx-stat-value mt-2">
              {item.display ?? <AnimatedNumber value={item.value ?? 0} />}
            </p>
          </Card>
        ))}
      </div>

      {data.isEmpty && !isPreview ? (
        <Card padding="lg">
          <div className="flex flex-col items-center py-10 text-center">
            <div className="nx-icon-badge nx-icon-badge--violet h-14 w-14">
              <IconFileText size={26} />
            </div>
            <h2 className="mt-4 text-[17px] font-bold text-text-primary">Henüz rapor yok</h2>
            <p className="mt-2 max-w-md text-[13px] font-medium leading-[1.45] text-text-muted">
              Tamamlanan bir web site analizi olduğunda raporlar burada listelenir.
            </p>
            <Link href="/dashboard/websites" className="mt-6">
              <Button type="button">Web Site Analizlerine Git</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          <Card padding="md" className="space-y-4">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Web sitesi veya lead ara..."
              className="nx-input max-w-md"
              aria-label="Rapor ara"
            />
            <FilterPills
              value={scoreFilter}
              onChange={setScoreFilter}
              ariaLabel="Skor filtresi"
              options={[
                { value: "all", label: "Tümü" },
                { value: "critical", label: "Kritik bulgulu" },
                { value: "high", label: "Düşük skor" },
              ]}
            />
          </Card>

          <div className="nx-table-wrap hidden md:block">
            <div className="overflow-x-auto">
              <table className="nx-table">
                <thead>
                  <tr>
                    <th>Web Sitesi</th>
                    <th>Lead</th>
                    <th>Skor</th>
                    <th>Bulgu</th>
                    <th>Tamamlanma</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, index) => (
                    <tr
                      key={item.auditId}
                      className="nx-row-enter"
                      style={{ animationDelay: `${index * 0.04}s` }}
                    >
                      <td className="max-w-[220px] truncate font-semibold text-text-primary">
                        {item.websiteLabel}
                      </td>
                      <td>{item.leadCompanyName ?? "—"}</td>
                      <td>
                        <ReportScore score={item.overallScore} />
                      </td>
                      <td>
                        {item.findingsCount}
                        {item.criticalHighCount > 0 ? (
                          <span className="ml-1 text-error">({item.criticalHighCount} kritik/yüksek)</span>
                        ) : null}
                      </td>
                      <td>{item.completedAt ? formatWebsiteDate(item.completedAt) : "—"}</td>
                      <td>
                        <ReportRowActions item={item} isPreview={isPreview} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3 md:hidden">
            {filteredItems.map((item, index) => (
              <Card
                key={item.auditId}
                padding="md"
                className="nx-row-enter"
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                <p className="truncate text-[16px] font-bold text-text-primary">{item.websiteLabel}</p>
                <p className="mt-1 truncate text-[13px] text-text-muted">{item.leadCompanyName ?? "Bağlı lead yok"}</p>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
                  <div>
                    <dt className="text-text-muted">Skor</dt>
                    <dd className="mt-0.5">
                      <ReportScore score={item.overallScore} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-text-muted">Bulgu</dt>
                    <dd className="mt-0.5 font-medium text-text-primary">{item.findingsCount}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-text-muted">Tamamlanma</dt>
                    <dd className="mt-0.5 font-medium text-text-primary">
                      {item.completedAt ? formatWebsiteDate(item.completedAt) : "—"}
                    </dd>
                  </div>
                </dl>
                <div className="mt-4">
                  <ReportRowActions item={item} isPreview={isPreview} />
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
