"use client";

import { useMemo, useState } from "react";
import { Copy, Download } from "lucide-react";
import { StatKpiCard } from "@/components/shared/stat-kpi-card";
import { LoadingButtonState } from "@/components/ui/loading-state";
import { Select } from "@/components/ui/select";
import {
  reportDataByRange,
  reportRangeOptions,
  type ReportRange,
} from "@/data/mock-reports";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/cn";
import { panelClass } from "@/lib/panel";

function getRandomDelay() {
  return 800 + Math.floor(Math.random() * 701);
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

const rangeLabelMap: Record<ReportRange, string> = {
  "7d": "Son 7 gün",
  "30d": "Son 30 gün",
  "90d": "Son 90 gün",
};

const reportLabelMap: Record<string, string> = {
  "Lead Growth": "Müşteri Artışı",
  "Audit Completion": "Analiz Tamamlama",
  "Reply Rate": "Yanıt Oranı",
  "Meeting Conversion": "Görüşme Dönüşümü",
  "High Opportunity": "Yüksek Fırsat",
  Audited: "Analiz Edildi",
  "Message Ready": "Mesaj Hazır",
  "Meeting Booked": "Planlanan Görüşme",
  Sent: "Gönderildi",
  Opened: "Açıldı",
  Replied: "Yanıt Geldi",
  Booked: "Planlandı",
  Consulting: "Danışmanlık",
  Marketing: "Pazarlama",
  Logistics: "Lojistik",
  Healthcare: "Sağlık",
};

const tr = (value: string) => reportLabelMap[value] ?? value;

export function ReportsPageContent() {
  const toast = useToast();
  const [selectedRange, setSelectedRange] = useState<ReportRange>("30d");
  const [isExporting, setIsExporting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const reportData = reportDataByRange[selectedRange];
  const maxOutreach = Math.max(...reportData.outreach.map((item) => item.value), 1);
  const summaryText = useMemo(() => {
    return [
      `NexLead Özet Raporu (${rangeLabelMap[selectedRange]})`,
      "",
      "KPI'lar:",
      ...reportData.kpis.map((kpi) => {
        const value = kpi.decimals
          ? `${(kpi.numericValue / Math.pow(10, kpi.decimals)).toFixed(kpi.decimals)}`
          : `${kpi.numericValue}`;
        return `- ${tr(kpi.label)}: ${kpi.prefix ?? ""}${value}${kpi.suffix ?? ""}`;
      }),
      "",
      "Müşteri Kalitesi:",
      ...reportData.leadQuality.map((item) => `- ${tr(item.label)}: ${item.value}`),
      "",
      "İletişim Performansı:",
      ...reportData.outreach.map((item) => `- ${tr(item.label)}: ${item.value}`),
      "",
      "Sektör Yanıt Oranı:",
      ...reportData.industries.map((item) => `- ${tr(item.industry)}: ${item.replyRate}%`),
    ].join("\n");
  }, [reportData, selectedRange]);

  const handleExportDownload = async () => {
    setIsExporting(true);
    await wait(getRandomDelay());
    const blob = new Blob([summaryText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `nexlead-rapor-${selectedRange}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
    setIsExporting(false);
    toast.success("Rapor dışa aktarıldı", "Özet rapor başarıyla indirildi.");
  };

  const handleCopySummary = async () => {
    setIsCopying(true);
    await wait(getRandomDelay());
    try {
      await navigator.clipboard.writeText(summaryText);
      toast.success("Özet kopyalandı", "Rapor özeti panoya kopyalandı.");
    } catch {
      toast.error("Kopyalama başarısız", "Pano erişimi kullanılamıyor.");
    }
    setIsCopying(false);
  };

  return (
    <div className="space-y-5">
      <div className={cn(panelClass("p-5"), "animate-fade-up animation-delay-100")}>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <label className="mb-1.5 block text-xs font-semibold text-text-muted">Rapor Aralığı</label>
            <Select
              value={selectedRange}
              onChange={(event) => setSelectedRange(event.target.value as ReportRange)}
              options={reportRangeOptions.map((option) => ({
                label: rangeLabelMap[option.id],
                value: option.id,
              }))}
            />
          </div>
          <button
            type="button"
            onClick={handleExportDownload}
            disabled={isExporting}
            className="btn-campaign inline-flex h-10 items-center gap-2 px-4 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            <LoadingButtonState isLoading={isExporting} loadingText="Dışa aktarılıyor...">
              Özeti İndir
            </LoadingButtonState>
          </button>
          <button
            type="button"
            onClick={handleCopySummary}
            disabled={isCopying}
            className="inline-flex h-10 items-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Copy className="mr-2 h-4 w-4" />
            <LoadingButtonState isLoading={isCopying} loadingText="Kopyalanıyor...">
              Özeti Kopyala
            </LoadingButtonState>
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {reportData.kpis.map((kpi, index) => (
          <StatKpiCard
            key={kpi.id}
            label={tr(kpi.label)}
            numericValue={kpi.numericValue}
            prefix={kpi.prefix}
            suffix={kpi.suffix}
            decimals={kpi.decimals}
            accent={kpi.accent}
            className={`animation-delay-${(index + 1) * 100}`}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-300")}>
          <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Müşteri Kalitesi Özeti</h3>
          <div className="space-y-3">
            {reportData.leadQuality.map((item, index) => (
              <div key={item.label}>
                <div className="mb-1 flex justify-between text-[13px]">
                  <span className="text-text-secondary">{tr(item.label)}</span>
                  <span className="font-semibold text-text-primary">{item.value.toLocaleString()}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-primary animate-bar-grow"
                    style={{
                      width: `${(item.value / item.max) * 100}%`,
                      animationDelay: `${300 + index * 80}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-350")}>
          <h3 className="mb-4 text-[15px] font-semibold text-text-primary">İletişim Performansı</h3>
          <div className="flex h-[140px] items-end gap-3">
            {reportData.outreach.map((item, index) => (
              <div key={item.label} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-primary/80 animate-bar-grow"
                  style={{
                    height: `${(item.value / maxOutreach) * 100}px`,
                    animationDelay: `${350 + index * 60}ms`,
                  }}
                />
                <span className="text-[10px] font-medium text-text-muted">{tr(item.label)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-400")}>
        <h3 className="mb-4 text-[15px] font-semibold text-text-primary">En İyi Performans Gösteren Sektörler</h3>
        <div className="grid gap-2.5 md:grid-cols-2">
          {reportData.industries.map((item, index) => (
            <div
              key={item.industry}
              className={cn(
                "flex items-center justify-between rounded-lg border border-border-soft px-3 py-2.5",
                "animate-fade-up-row",
                index < 5 ? `animation-delay-${(index + 2) * 100}` : "animation-delay-300",
              )}
            >
              <span className="text-[13px] font-medium text-text-primary">{tr(item.industry)}</span>
              <span className="text-[13px] font-bold text-green">{item.replyRate}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
