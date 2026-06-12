"use client";

import { hasTrendData } from "@/features/dashboard/dashboard.utils";

type ChartSeries = {
  label: string;
  values: number[];
  color: string;
};

type DashboardLineChartProps = {
  labels: string[];
  series: ChartSeries[];
};

function buildPath(values: number[], width: number, height: number, padding: number): string {
  const max = Math.max(...values, 1);
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const step = values.length > 1 ? innerWidth / (values.length - 1) : 0;

  return values
    .map((value, index) => {
      const x = padding + index * step;
      const y = padding + innerHeight - (value / max) * innerHeight;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

export function DashboardLineChart({ labels, series }: DashboardLineChartProps) {
  const width = 640;
  const height = 220;
  const padding = 24;
  const hasData = series.some((item) => hasTrendData(item.values));

  if (!hasData) {
    return (
      <div className="flex h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-soft/40 px-6 text-center">
        <p className="text-sm font-medium text-text-primary">Grafik için yeterli veri yok</p>
        <p className="mt-2 max-w-sm text-sm text-text-secondary">
          Lead, web sitesi veya analiz kayıtları oluştukça trend grafiği burada görünecek.
        </p>
      </div>
    );
  }

  const visibleLabels = labels.filter((_, index) => index % 2 === 0 || index === labels.length - 1);

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Lead, web sitesi ve analiz trend grafiği"
      >
        {[0, 1, 2, 3].map((line) => {
          const y = padding + ((height - padding * 2) / 3) * line;
          return (
            <line
              key={line}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#F2F4F7"
              strokeWidth="1"
            />
          );
        })}

        {series.map((item) => (
          <path
            key={item.label}
            d={buildPath(item.values, width, height, padding)}
            fill="none"
            stroke={item.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="chart-line-draw"
          />
        ))}
      </svg>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-4">
          {series.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-xs text-text-secondary">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              {item.label}
            </div>
          ))}
        </div>
        <p className="text-xs text-text-muted">
          {visibleLabels[0]} – {visibleLabels[visibleLabels.length - 1]}
        </p>
      </div>
    </div>
  );
}
