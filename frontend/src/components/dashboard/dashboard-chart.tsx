"use client";

import { ChevronDown } from "lucide-react";
import { mockChartData } from "@/data/mock-dashboard";
import { panelClass } from "@/lib/panel";
import { cn } from "@/lib/cn";

const CHART_HEIGHT = 220;
const CHART_WIDTH = 560;
const PADDING = { top: 18, right: 12, bottom: 34, left: 40 };
const MAX_Y = 200;

export function DashboardChart({ className }: { className?: string }) {
  const innerW = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerH = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const barGap = innerW / mockChartData.length;

  return (
    <div className={cn(panelClass("p-6"), "animate-fade-up", className)}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[15px] font-semibold text-text-primary">
          Müşteri Kazanımı ve Dönüşümler
        </h3>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border-soft bg-surface px-3 text-[13px] font-medium text-text-secondary transition-all duration-200 hover:border-border hover:bg-surface-muted"
        >
          Son 30 gün
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 text-xs font-medium text-text-secondary">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-[2px] bg-primary" />
          Kazanılan Müşteriler
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-[2px] bg-[#93C5FD]" />
          Gönderilen İletişim
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-green" />
          Planlanan Görüşmeler
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className="min-w-[480px] w-full"
          role="img"
          aria-label="Müşteri kazanımı ve dönüşüm grafiği"
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
                  strokeDasharray="3 5"
                  opacity={0.55}
                />
                <text x={10} y={y + 4} fill="#94A3B8" fontSize="12">
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
            const delayClass = [
              "animation-delay-100",
              "animation-delay-150",
              "animation-delay-200",
              "animation-delay-250",
              "animation-delay-300",
              "animation-delay-350",
              "animation-delay-400",
              "animation-delay-450",
            ][i];

            return (
              <g key={point.date}>
                <rect
                  x={x}
                  y={baseY - leadH}
                  width={barW}
                  height={leadH}
                  rx={4}
                  fill="#2563EB"
                  className={cn("animate-bar-grow", delayClass)}
                  style={{ transformOrigin: `${x + barW / 2}px ${baseY}px` }}
                />
                <rect
                  x={x + barW + 4}
                  y={baseY - outreachH}
                  width={barW}
                  height={outreachH}
                  rx={4}
                  fill="#93C5FD"
                  className={cn("animate-bar-grow", delayClass)}
                  style={{
                    transformOrigin: `${x + barW + 4 + barW / 2}px ${baseY}px`,
                    animationDelay: `${100 + i * 50 + 40}ms`,
                  }}
                />
                <text
                  x={x + barW + 2}
                  y={CHART_HEIGHT - 10}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="12"
                >
                  {point.date}
                </text>
              </g>
            );
          })}

          <polyline
            fill="none"
            stroke="#16A34A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-chart-line animation-delay-350"
            points={mockChartData
              .map((point, i) => {
                const x = PADDING.left + i * barGap + barGap * 0.5;
                const y = PADDING.top + innerH - (point.meetingsBooked / MAX_Y) * innerH;
                return `${x},${y}`;
              })
              .join(" ")}
          />
          {mockChartData.map((point, i) => {
            const x = PADDING.left + i * barGap + barGap * 0.5;
            const y = PADDING.top + innerH - (point.meetingsBooked / MAX_Y) * innerH;
            const dotDelay = [
              "animation-delay-400",
              "animation-delay-450",
              "animation-delay-500",
              "animation-delay-500",
              "animation-delay-500",
              "animation-delay-600",
              "animation-delay-600",
              "animation-delay-600",
            ][i];
            return (
              <circle
                key={point.date}
                cx={x}
                cy={y}
                r={3.5}
                fill="#16A34A"
                className={cn("animate-dot-in", dotDelay)}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
