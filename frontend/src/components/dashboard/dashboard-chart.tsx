"use client";

import { ChevronDown, Info } from "lucide-react";
import { mockChartData } from "@/data/mock-dashboard";
import { panelClass } from "@/lib/panel";
import { cn } from "@/lib/cn";

const CHART_HEIGHT = 228;
const CHART_WIDTH = 560;
const PADDING = { top: 20, right: 12, bottom: 36, left: 40 };
const MAX_Y = 200;

const barDelays = [100, 170, 240, 310, 380, 450, 520, 590];

export function DashboardChart({ className }: { className?: string }) {
  const innerW = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerH = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const barGap = innerW / mockChartData.length;

  const linePoints = mockChartData
    .map((point, i) => {
      const x = PADDING.left + i * barGap + barGap * 0.5;
      const y = PADDING.top + innerH - (point.meetingsBooked / MAX_Y) * innerH;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className={cn(panelClass("p-6 md:p-6"), "animate-fade-up", className)}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-text-primary">
            Lead Acquisition & Conversions
          </h3>
          <Info className="h-4 w-4 text-text-muted" />
        </div>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border-soft bg-surface px-3 text-sm font-medium text-text-secondary transition-all duration-200 hover:bg-surface-muted"
        >
          Last 30 days
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-5 text-xs font-medium text-text-secondary">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-[3px] bg-primary" />
          Leads Acquired
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-[3px] bg-[#93C5FD]" />
          Outreach Sent
        </span>
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-5 rounded bg-green" />
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
                  stroke="#E2E8F0"
                  strokeDasharray="4 6"
                  opacity={0.7}
                />
                <text x={10} y={y + 4} fill="#94A3B8" fontSize="13">
                  {tick}
                </text>
              </g>
            );
          })}

          {mockChartData.map((point, i) => {
            const x = PADDING.left + i * barGap + barGap * 0.12;
            const barW = barGap * 0.3;
            const leadH = (point.leadsAcquired / MAX_Y) * innerH;
            const outreachH = (point.outreachSent / MAX_Y) * innerH;
            const baseY = PADDING.top + innerH;
            const delay = barDelays[i] ?? 100;

            return (
              <g key={point.date}>
                <g
                  transform={`translate(${x + barW / 2}, ${baseY})`}
                  className="animate-bar-grow"
                  style={{ animationDelay: `${delay}ms` }}
                >
                  <rect
                    x={-barW / 2}
                    y={-leadH}
                    width={barW}
                    height={leadH}
                    rx={5}
                    fill="#2563EB"
                  />
                </g>
                <g
                  transform={`translate(${x + barW + 5 + barW / 2}, ${baseY})`}
                  className="animate-bar-grow"
                  style={{ animationDelay: `${delay + 40}ms` }}
                >
                  <rect
                    x={-barW / 2}
                    y={-outreachH}
                    width={barW}
                    height={outreachH}
                    rx={5}
                    fill="#93C5FD"
                  />
                </g>
                <text
                  x={x + barW + 2}
                  y={CHART_HEIGHT - 10}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="13"
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
            points={linePoints}
            className="animate-chart-line"
            style={{ animationDelay: "280ms" }}
          />
          {mockChartData.map((point, i) => {
            const x = PADDING.left + i * barGap + barGap * 0.5;
            const y = PADDING.top + innerH - (point.meetingsBooked / MAX_Y) * innerH;
            const dotDelay = 900 + i * 50;
            return (
              <circle
                key={`dot-${point.date}`}
                cx={x}
                cy={y}
                r={4}
                fill="#16A34A"
                className="animate-dot-in"
                style={{ animationDelay: `${dotDelay}ms` }}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
