"use client";

import { ChevronDown, Info } from "lucide-react";
import { mockChartData } from "@/data/mock-dashboard";

const CHART_HEIGHT = 220;
const CHART_WIDTH = 560;
const PADDING = { top: 16, right: 12, bottom: 32, left: 36 };
const MAX_Y = 200;

export function DashboardChart() {
  const innerW = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerH = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const barGap = innerW / mockChartData.length;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card md:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-text-primary">
            Lead Acquisition & Conversions
          </h3>
          <Info className="h-4 w-4 text-text-muted" />
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text-secondary transition-all duration-200 hover:bg-slate-50"
        >
          Last 30 days
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 text-xs text-text-secondary">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
          Leads Acquired
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary/40" />
          Outreach Sent
        </span>
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-4 rounded bg-green" />
          Meetings Booked
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className="min-w-[480px] w-full"
          role="img"
          aria-label="Lead acquisition and conversions chart"
        >
          {[0, 50, 100, 150, 200].map((tick) => {
            const y = PADDING.top + innerH - (tick / MAX_Y) * innerH;
            return (
              <g key={tick}>
                <line
                  x1={PADDING.left}
                  x2={CHART_WIDTH - PADDING.right}
                  y1={y}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeDasharray="4 4"
                />
                <text x={8} y={y + 4} className="fill-text-muted text-[10px]">
                  {tick}
                </text>
              </g>
            );
          })}

          {mockChartData.map((point, i) => {
            const x = PADDING.left + i * barGap + barGap * 0.15;
            const barW = barGap * 0.28;
            const leadH = (point.leadsAcquired / MAX_Y) * innerH;
            const outreachH = (point.outreachSent / MAX_Y) * innerH;
            const baseY = PADDING.top + innerH;

            return (
              <g key={point.date}>
                <rect
                  x={x}
                  y={baseY - leadH}
                  width={barW}
                  height={leadH}
                  rx={4}
                  fill="#2563EB"
                />
                <rect
                  x={x + barW + 4}
                  y={baseY - outreachH}
                  width={barW}
                  height={outreachH}
                  rx={4}
                  fill="#93C5FD"
                />
                <text
                  x={x + barW}
                  y={CHART_HEIGHT - 8}
                  textAnchor="middle"
                  className="fill-text-muted text-[10px]"
                >
                  {point.date}
                </text>
              </g>
            );
          })}

          <polyline
            fill="none"
            stroke="#16A34A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={mockChartData
              .map((point, i) => {
                const x = PADDING.left + i * barGap + barGap * 0.5;
                const y =
                  PADDING.top + innerH - (point.meetingsBooked / MAX_Y) * innerH;
                return `${x},${y}`;
              })
              .join(" ")}
          />
          {mockChartData.map((point, i) => {
            const x = PADDING.left + i * barGap + barGap * 0.5;
            const y = PADDING.top + innerH - (point.meetingsBooked / MAX_Y) * innerH;
            return <circle key={point.date} cx={x} cy={y} r={4} fill="#16A34A" />;
          })}
        </svg>
      </div>
    </div>
  );
}
