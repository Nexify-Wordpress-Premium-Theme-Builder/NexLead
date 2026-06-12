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

const CHART_HEIGHT = 380;

function getPoints(
  values: number[],
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number },
  maxValue: number,
): Point[] {
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const step = values.length > 1 ? innerWidth / (values.length - 1) : 0;

  return values.map((value, index) => ({
    x: padding.left + index * step,
    y: padding.top + innerHeight - (value / maxValue) * innerHeight,
  }));
}

function buildCatmullRomPath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[index - 1] ?? points[index];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[index + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return path;
}

function buildAreaPath(points: Point[], height: number, bottomPadding: number): string {
  if (points.length === 0) return "";
  const line = buildCatmullRomPath(points);
  const last = points[points.length - 1];
  const first = points[0];
  const baseY = height - bottomPadding;
  return `${line} L ${last.x} ${baseY} L ${first.x} ${baseY} Z`;
}

function slugify(value: string): string {
  return value.replace(/\s+/g, "-").toLowerCase();
}

export function DashboardLineChart({ labels, series }: DashboardLineChartProps) {
  const width = 800;
  const height = CHART_HEIGHT;
  const padding = { top: 28, right: 20, bottom: 48, left: 48 };
  const chartHeight = height - padding.top - padding.bottom;
  const hasData = series.some((item) => hasTrendData(item.values));
  const maxValue = Math.max(...series.flatMap((item) => item.values), 1);

  if (!hasData) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[rgba(15,23,42,0.1)] bg-[#F8FAFC] px-6 text-center"
        style={{ height: CHART_HEIGHT }}
      >
        <p className="dashboard-body font-bold text-[#0F172A]">Grafik için yeterli veri yok</p>
        <p className="dashboard-body mt-2 max-w-sm">Kayıtlar oluştukça trend grafiği burada görünecek.</p>
      </div>
    );
  }

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    value: Math.round(maxValue * ratio),
    y: padding.top + chartHeight - ratio * chartHeight,
  }));

  const xLabelIndices = labels.map((_, i) => i).filter((i) => i % 2 === 0 || i === labels.length - 1);
  const firstSeriesPoints = getPoints(series[0].values, width, height, padding, maxValue);

  return (
    <div className="w-full" style={{ minHeight: CHART_HEIGHT }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-[380px] w-full"
        role="img"
        aria-label="Lead, web sitesi, analiz ve rapor trend grafiği"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {series.map((item) => {
            const slug = slugify(item.label);
            return (
              <linearGradient key={`gradient-${slug}`} id={`area-${slug}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={item.color} stopOpacity="0.2" />
                <stop offset="90%" stopColor={item.color} stopOpacity="0.03" />
                <stop offset="100%" stopColor={item.color} stopOpacity="0" />
              </linearGradient>
            );
          })}
        </defs>

        {yTicks.map((tick) => (
          <g key={tick.value}>
            <line
              x1={padding.left}
              y1={tick.y}
              x2={width - padding.right}
              y2={tick.y}
              stroke="#EEF2F7"
              strokeWidth="1"
            />
            <text x={padding.left - 12} y={tick.y + 4} textAnchor="end" fill="#94A3B8" fontSize="11" fontWeight="600">
              {tick.value}
            </text>
          </g>
        ))}

        {series.map((item, seriesIndex) => {
          const points = getPoints(item.values, width, height, padding, maxValue);
          const slug = slugify(item.label);

          return (
            <g key={item.label}>
              <path
                d={buildAreaPath(points, height, padding.bottom)}
                fill={`url(#area-${slug})`}
                className="chart-area-fade"
                style={{ animationDelay: `${seriesIndex * 0.08}s` }}
              />
              <path
                d={buildCatmullRomPath(points)}
                fill="none"
                stroke={item.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="chart-line-draw"
                style={{ animationDelay: `${0.1 + seriesIndex * 0.1}s` }}
              />
            </g>
          );
        })}

        {xLabelIndices.map((labelIndex) => {
          const point = firstSeriesPoints[labelIndex];
          if (!point) return null;
          return (
            <text
              key={labels[labelIndex]}
              x={point.x}
              y={height - 16}
              textAnchor="middle"
              fill="#94A3B8"
              fontSize="11"
              fontWeight="600"
            >
              {labels[labelIndex]}
            </text>
          );
        })}
      </svg>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(15,23,42,0.06)] pt-4">
        <div className="flex flex-wrap gap-2">
          {series.map((item) => (
            <span
              key={item.label}
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(15,23,42,0.08)] bg-[#F8FAFC] px-3 py-1.5 text-[12px] font-bold text-[#475569]"
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} aria-hidden="true" />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
