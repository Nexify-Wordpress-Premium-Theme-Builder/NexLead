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

type Point = { x: number; y: number };

function getPoints(
  values: number[],
  width: number,
  height: number,
  padding: number,
  maxValue: number,
): Point[] {
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const step = values.length > 1 ? innerWidth / (values.length - 1) : 0;

  return values.map((value, index) => ({
    x: padding + index * step,
    y: padding + innerHeight - (value / maxValue) * innerHeight,
  }));
}

function buildSmoothPath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const controlX = (current.x + next.x) / 2;
    path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
  }

  return path;
}

function buildAreaPath(points: Point[], width: number, height: number, padding: number): string {
  if (points.length === 0) return "";

  const line = buildSmoothPath(points);
  const last = points[points.length - 1];
  const first = points[0];
  const baseY = height - padding;

  return `${line} L ${last.x} ${baseY} L ${first.x} ${baseY} Z`;
}

export function DashboardLineChart({ labels, series }: DashboardLineChartProps) {
  const width = 720;
  const height = 260;
  const padding = 28;
  const hasData = series.some((item) => hasTrendData(item.values));
  const maxValue = Math.max(...series.flatMap((item) => item.values), 1);

  if (!hasData) {
    return (
      <div className="flex h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-soft/40 px-6 text-center">
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
        aria-label="Lead, web sitesi, analiz ve rapor trend grafiği"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {series.map((item) => (
            <linearGradient
              key={`gradient-${item.label}`}
              id={`area-${item.label.replace(/\s+/g, "-")}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={item.color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={item.color} stopOpacity="0.02" />
            </linearGradient>
          ))}
        </defs>

        {[0, 1, 2, 3, 4].map((line) => {
          const y = padding + ((height - padding * 2) / 4) * line;
          return (
            <line
              key={line}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#EEF0F4"
              strokeWidth="1"
            />
          );
        })}

        {series.map((item) => {
          const points = getPoints(item.values, width, height, padding, maxValue);
          const gradientId = `area-${item.label.replace(/\s+/g, "-")}`;

          return (
            <g key={item.label}>
              <path
                d={buildAreaPath(points, width, height, padding)}
                fill={`url(#${gradientId})`}
                className="chart-area-fade"
              />
              <path
                d={buildSmoothPath(points)}
                fill="none"
                stroke={item.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="chart-line-draw"
              />
            </g>
          );
        })}
      </svg>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {series.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-xs text-text-secondary">
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
